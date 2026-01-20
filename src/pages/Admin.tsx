import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navigation from "@/components/Navigation";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getCurrentSession, signIn, signOut, parseJwt, userPool } from "@/lib/cognito";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CognitoUserSession } from "amazon-cognito-identity-js";

const API_BASE =
  import.meta.env.VITE_API_BASE ||
  (typeof process !== "undefined" ? (process as any)?.env?.REACT_APP_API_BASE : undefined) ||
  "https://y5w6n0i9vc.execute-api.us-east-1.amazonaws.com/prod";
const isDev = import.meta.env.DEV;
const log = (...args: unknown[]) => {
  if (isDev) {
    console.log(...args);
  }
};
log("[admin] API_BASE =", API_BASE);
const WORKSHOP_API = `${API_BASE}/workshop`;
const WORKSHOP_ATTENDANCE_API = `${API_BASE}/workshop/attendance`;

// Helper to get Cognito session as Promise
function getSessionPromise() {
  return new Promise<CognitoUserSession>((resolve, reject) => {
    const user = userPool.getCurrentUser();
    if (!user) return reject(new Error("No current user"));
    user.getSession((err, sess) => (err ? reject(err) : resolve(sess)));
  });
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const session = await getSessionPromise();
  if (!session?.isValid()) throw new Error("Session invalid");

  const headers = new Headers(options.headers || {});
  headers.set("Authorization", `Bearer ${session.getIdToken().getJwtToken()}`);

  let res = await fetch(url, { ...options, headers });
  if (res.status === 401 || res.status === 403) {
    const retryHeaders = new Headers(options.headers || {});
    retryHeaders.set("Authorization", `Bearer ${session.getAccessToken().getJwtToken()}`);
    res = await fetch(url, { ...options, headers: retryHeaders });
  }

  return res;
}

interface Order {
  orderId: string;
  name: string;
  phone: string;
  email: string;
  quantity: number;
  specialInstructions?: string;
  status: string;
  createdAt: string;
}

interface WorkshopRegistration {
  registrationId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  yearsAtClc: number;
  encounterCollide: boolean;
  dateOfBirth: string;
  grade: string;
  audition: boolean;
  present: boolean;
  createdAt: string;
}

const Admin = () => {
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [who, setWho] = useState<string | null>(null);
  const [authError, setAuthError] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [totalOrders, setTotalOrders] = useState(0);
  const [workshopRegistrations, setWorkshopRegistrations] = useState<WorkshopRegistration[]>([]);
  const [isWorkshopLoading, setIsWorkshopLoading] = useState(false);
  const [totalRegistrations, setTotalRegistrations] = useState(0);
  
  // Debug state
  const [lastFetchStatus, setLastFetchStatus] = useState<number | null>(null);
  const [lastFetchBody, setLastFetchBody] = useState<string>("");
  const [lastTokenType, setLastTokenType] = useState<"id" | "access" | null>(null);
  const [lastTokenClaims, setLastTokenClaims] = useState<{ iss?: string; aud?: string; client_id?: string; exp?: number } | null>(null);
  const [lastResponseKeys, setLastResponseKeys] = useState<string[] | null>(null);
  const [normalizedCount, setNormalizedCount] = useState<number | null>(null);
  const [showDebug, setShowDebug] = useState(false);

  // Try to restore session on mount
  useEffect(() => {
    getCurrentSession(
      (session) => {
        const idToken = session.getIdToken().getJwtToken();
        const claims = parseJwt(idToken);
        setWho(claims?.email || claims?.["cognito:username"] || "admin");
        // fetchOrders() will be triggered by the useEffect([who]) below
      },
      () => {
        setWho(null);
      }
    );
  }, []);

  // Fetch orders when user session is restored
  useEffect(() => {
    if (who) {
      log("[admin] Session present; fetching orders...");
      fetchOrders();
      fetchWorkshopRegistrations();
    }
  }, [who]);

  const handleSignIn = () => {
    setAuthError("");
    if (!username || !password) {
      setAuthError("Enter phone number and password.");
      return;
    }

    setIsSigningIn(true);
    signIn(username, password, {
      onSuccess: (session) => {
        const idToken = session.getIdToken().getJwtToken();
        const claims = parseJwt(idToken);
        setWho(claims?.email || claims?.["cognito:username"] || username);
        setPassword("");
        setIsSigningIn(false);
        log("[admin] API_BASE on login:", API_BASE);
        fetchOrders();
      },
      onFailure: (error) => {
        setAuthError(error);
        setIsSigningIn(false);
      },
      onNewPasswordRequired: () => {
        setAuthError("New password required. Please contact administrator to set a permanent password.");
        setIsSigningIn(false);
      },
      onMFARequired: () => {
        setAuthError("MFA is required but not supported in this interface.");
        setIsSigningIn(false);
      }
    });
  };

  const handleSignOut = () => {
    signOut();
    setWho(null);
    setOrders([]);
    setTotalOrders(0);
    setWorkshopRegistrations([]);
    setTotalRegistrations(0);
    setUsername("");
    setPassword("");
  };

  // Helpers: unwrap DynamoDB AttributeValue shapes and normalize list responses
  const unwrap = (v: any): any => {
    if (v && typeof v === "object") {
      if ("S" in v) return (v as any).S;
      if ("N" in v) return Number((v as any).N);
      if ("BOOL" in v) return !!(v as any).BOOL;
      if ("M" in v) return Object.fromEntries(Object.entries((v as any).M).map(([k, val]) => [k, unwrap(val)]));
      if ("L" in v) return (v as any).L.map(unwrap);
    }
    return v;
  };

  const normalizeOrders = (payload: any): Order[] => {
    const raw =
      payload?.items ??
      payload?.data?.items ??
      payload?.orders ??
      payload?.Items ??
      payload?.data?.orders ??
      [];

    const arr = Array.isArray(raw) ? raw : [];
    return arr.map((it: any) => {
      const obj = unwrap(it);
      return {
        orderId: obj.orderId ?? obj.id ?? "",
        name: obj.name ?? "",
        phone: obj.phone ?? obj.phoneNumber ?? "",
        email: obj.email ?? "",
        quantity: Number(obj.quantity ?? obj.qty ?? 1),
        specialInstructions: obj.specialInstructions ?? obj.notes ?? undefined,
        status: obj.status ?? "pending",
        createdAt: obj.createdAt ?? obj.created_at ?? obj.timestamp ?? new Date().toISOString(),
      } as Order;
    });
  };

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      log("[admin] fetchOrders: starting");
      log("[admin] Fetching orders from", `${API_BASE}/admin?method=list`);
      if (isDev) {
        setNormalizedCount(null);
      }

      // 1) Get session + ID token
      const session = await getSessionPromise();
      if (!session?.isValid()) throw new Error("Session invalid");
      const idToken = session.getIdToken().getJwtToken();
      // Helper to log token claims
      const logTokenClaims = (token: string) => {
        if (!isDev) return;
        try {
          const claims = parseJwt(token);
          setLastTokenClaims(claims ? { iss: claims.iss, aud: claims.aud, client_id: claims.client_id, exp: claims.exp } : null);
        } catch {
          setLastTokenClaims(null);
        }
      };

      logTokenClaims(idToken);
      if (isDev) {
        setLastTokenType("id");
      }

      // 2) Try with ID token
      let res = await fetch(`${API_BASE}/admin?method=list`, {
        headers: { Authorization: `Bearer ${idToken}` },
      }).catch((e) => {
        console.error("[admin] fetch threw (ID token):", e);
        if (isDev) {
          setLastFetchStatus(-1);
          setLastFetchBody(e?.message || "Network error");
          setLastResponseKeys(null);
        }
        toast({
          title: "Network/CORS Error",
          description: "Failed to connect to the API. Check console for details.",
          variant: "destructive",
        });
        throw e;
      });

      // 3) If unauthorized, retry with Access token
      if (res.status === 401 || res.status === 403) {
        const access = session.getAccessToken().getJwtToken();
        logTokenClaims(access);
        if (isDev) {
          setLastTokenType("access");
        }
        
        res = await fetch(`${API_BASE}/admin?method=list`, {
          headers: { Authorization: `Bearer ${access}` },
        }).catch((e) => {
          console.error("[admin] fetch threw (ACCESS token):", e);
          if (isDev) {
            setLastFetchStatus(-1);
            setLastFetchBody(e?.message || "Network error");
            setLastResponseKeys(null);
          }
          toast({
            title: "Network/CORS Error",
            description: "Failed to connect to the API. Check console for details.",
            variant: "destructive",
          });
          throw e;
        });
      }

      log("[admin] Orders status:", res.status);
      const responseText = await res.text();
      if (isDev) {
        setLastFetchStatus(res.status);
        setLastFetchBody(responseText);
      }

      let data: any = null;
      try {
        data = responseText ? JSON.parse(responseText) : null;
      } catch {
        data = null;
      }

      if (isDev) {
        setLastResponseKeys(data && typeof data === "object" ? Object.keys(data) : null);
      }

      if (!res.ok) {
        throw new Error(`Failed to fetch orders: ${res.status}`);
      }

      const items = normalizeOrders(data);
      setOrders(items);
      setTotalOrders(items.length);
      if (isDev) {
        setNormalizedCount(items.length);
      }
    } catch (e: any) {
      console.error("[admin] fetchOrders error:", e?.message || e);
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Failed to fetch orders",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const normalizeWorkshopRegistrations = (payload: any): WorkshopRegistration[] => {
    const raw = payload?.items ?? payload?.registrations ?? payload ?? [];
    const arr = Array.isArray(raw) ? raw : [];
    return arr.map((item: any) => ({
      registrationId: item.registrationId ?? item.id ?? "",
      firstName: item.firstName ?? "",
      lastName: item.lastName ?? "",
      phoneNumber: item.phoneNumber ?? item.phone ?? "",
      yearsAtClc: Number(item.yearsAtClc ?? 0),
      encounterCollide: !!item.encounterCollide,
      dateOfBirth: item.dateOfBirth ?? "",
      grade: item.grade ?? "",
      audition: !!item.audition,
      present: !!item.present,
      createdAt: item.createdAt ?? "",
    }));
  };

  const fetchWorkshopRegistrations = async () => {
    try {
      setIsWorkshopLoading(true);
      const res = await fetchWithAuth(WORKSHOP_API);
      const responseText = await res.text();
      let data: any = null;
      try {
        data = responseText ? JSON.parse(responseText) : null;
      } catch {
        data = null;
      }

      if (!res.ok) {
        throw new Error(`Failed to fetch registrations: ${res.status}`);
      }

      const items = normalizeWorkshopRegistrations(data);
      setWorkshopRegistrations(items);
      setTotalRegistrations(items.length);
    } catch (e: any) {
      console.error("[admin] fetchWorkshopRegistrations error:", e?.message || e);
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Failed to fetch registrations",
        variant: "destructive",
      });
    } finally {
      setIsWorkshopLoading(false);
    }
  };

  const handleAttendanceToggle = async (registrationId: string, present: boolean) => {
    try {
      setIsWorkshopLoading(true);
      const res = await fetchWithAuth(WORKSHOP_ATTENDANCE_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ registrationId, present }),
      });

      if (!res.ok) {
        throw new Error(`Failed to update attendance: ${res.status}`);
      }

      setWorkshopRegistrations((prev) =>
        prev.map((registration) =>
          registration.registrationId === registrationId
            ? { ...registration, present }
            : registration
        )
      );
    } catch (e: any) {
      console.error("[admin] Attendance update error:", e?.message || e);
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Failed to update attendance",
        variant: "destructive",
      });
    } finally {
      setIsWorkshopLoading(false);
    }
  };

  const handleApprove = async (orderId: string) => {
    try {
      setIsLoading(true);
      log("[admin] Approving order:", orderId);

      // 1) Get session + ID token
      const session = await getSessionPromise();
      if (!session?.isValid()) throw new Error("Session invalid");
      const idToken = session.getIdToken().getJwtToken();

      if (isDev) {
        setLastTokenType("id");
        try {
          const claims = parseJwt(idToken);
          setLastTokenClaims(claims ? { iss: claims.iss, aud: claims.aud, client_id: claims.client_id, exp: claims.exp } : null);
        } catch {
          setLastTokenClaims(null);
        }
      }

      // 2) Try with ID token
      let res = await fetch(`${API_BASE}/admin?method=approve&orderId=${encodeURIComponent(orderId)}`, {
        headers: { Authorization: `Bearer ${idToken}` },
      }).catch((e) => {
        console.error("[admin] approve fetch threw (ID token):", e);
        if (isDev) {
          setLastFetchStatus(-1);
          setLastFetchBody(e?.message || "Network error");
        }
        throw e;
      });

      // 3) If unauthorized, retry with Access token
      if (res.status === 401 || res.status === 403) {
        const access = session.getAccessToken().getJwtToken();
        if (isDev) {
          setLastTokenType("access");
        }
        
        res = await fetch(`${API_BASE}/admin?method=approve&orderId=${encodeURIComponent(orderId)}`, {
          headers: { Authorization: `Bearer ${access}` },
        }).catch((e) => {
          console.error("[admin] approve fetch threw (ACCESS token):", e);
          if (isDev) {
            setLastFetchStatus(-1);
            setLastFetchBody(e?.message || "Network error");
          }
          throw e;
        });
      }

      log("[admin] Approve status:", res.status);
      const responseText = await res.text();
      if (isDev) {
        setLastFetchStatus(res.status);
        setLastFetchBody(responseText);
      }

      if (res.status === 404) {
        toast({
          title: "Not Found",
          description: "Order not found (maybe already deleted)",
          variant: "destructive",
        });
        return;
      }

      if (!res.ok) {
        throw new Error(`Failed to approve order: ${res.status}`);
      }

      toast({
        title: "Success",
        description: "Order approved successfully",
      });

      // Optimistically update UI
      setOrders((prev) => prev.map((o) => 
        o.orderId === orderId ? { ...o, status: "approved" } : o
      ));

    } catch (e: any) {
      console.error("[admin] Approve error:", e?.message || e);
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Failed to approve order",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (orderId: string) => {
    if (!confirm("Delete this order? This action cannot be undone.")) {
      return;
    }

    try {
      setIsLoading(true);
      log("[admin] Deleting order:", orderId);

      // 1) Get session + ID token
      const session = await getSessionPromise();
      if (!session?.isValid()) throw new Error("Session invalid");
      const idToken = session.getIdToken().getJwtToken();

      if (isDev) {
        setLastTokenType("id");
        try {
          const claims = parseJwt(idToken);
          setLastTokenClaims(claims ? { iss: claims.iss, aud: claims.aud, client_id: claims.client_id, exp: claims.exp } : null);
        } catch {
          setLastTokenClaims(null);
        }
      }

      // 2) Try with ID token
      let res = await fetch(`${API_BASE}/admin?method=delete&orderId=${encodeURIComponent(orderId)}`, {
        headers: { Authorization: `Bearer ${idToken}` },
      }).catch((e) => {
        console.error("[admin] delete fetch threw (ID token):", e);
        if (isDev) {
          setLastFetchStatus(-1);
          setLastFetchBody(e?.message || "Network error");
        }
        throw e;
      });

      // 3) If unauthorized, retry with Access token
      if (res.status === 401 || res.status === 403) {
        const access = session.getAccessToken().getJwtToken();
        if (isDev) {
          setLastTokenType("access");
        }
        
        res = await fetch(`${API_BASE}/admin?method=delete&orderId=${encodeURIComponent(orderId)}`, {
          headers: { Authorization: `Bearer ${access}` },
        }).catch((e) => {
          console.error("[admin] delete fetch threw (ACCESS token):", e);
          if (isDev) {
            setLastFetchStatus(-1);
            setLastFetchBody(e?.message || "Network error");
          }
          throw e;
        });
      }

      log("[admin] Delete status:", res.status);
      const responseText = await res.text();
      if (isDev) {
        setLastFetchStatus(res.status);
        setLastFetchBody(responseText);
      }

      if (res.status === 404) {
        // Still remove from UI optimistically
        setOrders((prev) => prev.filter((o) => o.orderId !== orderId));
        setTotalOrders((prev) => Math.max(0, prev - 1));
        return;
      }

      if (!res.ok) {
        throw new Error(`Failed to delete order: ${res.status}`);
      }

      // Optimistically remove from UI
      setOrders((prev) => prev.filter((o) => o.orderId !== orderId));
      setTotalOrders((prev) => Math.max(0, prev - 1));

    } catch (e: any) {
      console.error("[admin] Delete error:", e?.message || e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto px-4 py-8 mt-16">
        {!who ? (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Admin Sign In</CardTitle>
              <CardDescription>Enter your phone number and password to access the admin dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Phone Number (E.164 format)</Label>
                  <Input
                    id="username"
                    placeholder="+3863076306"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
                  />
                  <p className="text-xs text-muted-foreground">Example: +15551234567</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
                  />
                </div>
                {authError && (
                  <div className="text-sm text-destructive">{authError}</div>
                )}
                <Button
                  onClick={handleSignIn}
                  disabled={isSigningIn}
                  className="w-full bg-fire-purple hover:bg-fire-purple/90"
                >
                  {isSigningIn ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                  Logged in as: <span className="font-medium text-fire-purple">{who}</span>
                </p>
              </div>
              <div className="flex gap-2">
                {isDev && (
                  <Button
                    onClick={fetchOrders}
                    variant="secondary"
                    size="sm"
                  >
                    Run fetch (debug)
                  </Button>
                )}
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  className="border-fire-purple text-fire-purple hover:bg-fire-purple hover:text-white"
                >
                  Sign Out
                </Button>
              </div>
            </div>
            
            <Tabs defaultValue="orders" className="space-y-6">
              <TabsList>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="workshop">Workshop Registrations</TabsTrigger>
              </TabsList>

              <TabsContent value="orders" className="space-y-6">
                <div className="flex gap-4">
                  <Card className="max-w-sm">
                    <CardHeader>
                      <CardTitle>Total Orders</CardTitle>
                      <CardDescription>Haitian Spaghetti Orders</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{totalOrders}</p>
                    </CardContent>
                  </Card>
                  <Button
                    onClick={fetchOrders}
                    disabled={isLoading}
                    variant="outline"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      "Refresh Orders"
                    )}
                  </Button>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>Latest Haitian spaghetti orders</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[600px] w-full">
                      <div className="min-w-max">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="min-w-[150px]">Name</TableHead>
                              <TableHead className="min-w-[120px]">Phone</TableHead>
                              <TableHead className="min-w-[180px]">Email</TableHead>
                              <TableHead className="min-w-[80px]">Quantity</TableHead>
                              <TableHead className="min-w-[100px]">Status</TableHead>
                              <TableHead className="min-w-[120px]">Date</TableHead>
                              <TableHead className="sticky right-0 bg-card shadow-[-4px_0_8px_rgba(0,0,0,0.1)] min-w-[180px]">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {isLoading ? (
                              <TableRow>
                                <TableCell colSpan={7} className="text-center">
                                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                </TableCell>
                              </TableRow>
                            ) : orders.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={7} className="text-center text-muted-foreground">
                                  No orders yet
                                </TableCell>
                              </TableRow>
                            ) : (
                              orders.map((order) => (
                                <TableRow key={order.orderId}>
                                  <TableCell className="min-w-[150px]">{order.name}</TableCell>
                                  <TableCell className="min-w-[120px]">{order.phone}</TableCell>
                                  <TableCell className="min-w-[180px]">{order.email}</TableCell>
                                  <TableCell className="min-w-[80px]">{order.quantity}</TableCell>
                                  <TableCell className="min-w-[100px]">
                                    <span
                                      className={`px-2 py-1 rounded-full text-xs ${
                                        order.status === "approved"
                                          ? "bg-green-100 text-green-800"
                                          : "bg-yellow-100 text-yellow-800"
                                      }`}
                                    >
                                      {order.status}
                                    </span>
                                  </TableCell>
                                  <TableCell className="min-w-[120px]">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                  </TableCell>
                                  <TableCell className="sticky right-0 bg-card shadow-[-4px_0_8px_rgba(0,0,0,0.1)] min-w-[180px]">
                                    <div className="flex gap-2">
                                      {order.status === "pending" && (
                                        <Button
                                          size="sm"
                                          onClick={() => handleApprove(order.orderId)}
                                          className="bg-fire-purple hover:bg-fire-purple/90"
                                          disabled={isLoading}
                                        >
                                          Approve
                                        </Button>
                                      )}
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleDelete(order.orderId)}
                                        disabled={isLoading}
                                      >
                                        Delete
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="workshop" className="space-y-6">
                <div className="flex gap-4">
                  <Card className="max-w-sm">
                    <CardHeader>
                      <CardTitle>Total Registrations</CardTitle>
                      <CardDescription>Workshop Registration</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{totalRegistrations}</p>
                    </CardContent>
                  </Card>
                  <Button
                    onClick={fetchWorkshopRegistrations}
                    disabled={isWorkshopLoading}
                    variant="outline"
                  >
                    {isWorkshopLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      "Refresh Registrations"
                    )}
                  </Button>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Workshop Registrations</CardTitle>
                    <CardDescription>February 1st, 2026 at 2:00 PM</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[600px] w-full">
                      <div className="min-w-max">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="min-w-[160px]">Name</TableHead>
                              <TableHead className="min-w-[140px]">Phone</TableHead>
                              <TableHead className="min-w-[120px]">Years at CLC</TableHead>
                              <TableHead className="min-w-[160px]">Encounter/Collide</TableHead>
                              <TableHead className="min-w-[140px]">Date of Birth</TableHead>
                              <TableHead className="min-w-[120px]">Grade</TableHead>
                              <TableHead className="min-w-[100px]">Audition</TableHead>
                              <TableHead className="min-w-[120px]">Status</TableHead>
                              <TableHead className="min-w-[120px]">Date</TableHead>
                              <TableHead className="sticky right-0 bg-card shadow-[-4px_0_8px_rgba(0,0,0,0.1)] min-w-[170px]">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {isWorkshopLoading ? (
                              <TableRow>
                                <TableCell colSpan={10} className="text-center">
                                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                </TableCell>
                              </TableRow>
                            ) : workshopRegistrations.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={10} className="text-center text-muted-foreground">
                                  No registrations yet
                                </TableCell>
                              </TableRow>
                            ) : (
                              workshopRegistrations.map((registration) => (
                                <TableRow key={registration.registrationId}>
                                  <TableCell className="min-w-[160px]">
                                    {registration.firstName} {registration.lastName}
                                  </TableCell>
                                  <TableCell className="min-w-[140px]">{registration.phoneNumber}</TableCell>
                                  <TableCell className="min-w-[120px]">{registration.yearsAtClc}</TableCell>
                                  <TableCell className="min-w-[160px]">
                                    {registration.encounterCollide ? "Yes" : "No"}
                                  </TableCell>
                                  <TableCell className="min-w-[140px]">{registration.dateOfBirth}</TableCell>
                                  <TableCell className="min-w-[120px]">{registration.grade}</TableCell>
                                  <TableCell className="min-w-[100px]">
                                    {registration.audition ? "Yes" : "No"}
                                  </TableCell>
                                  <TableCell className="min-w-[120px]">
                                    <span
                                      className={`px-2 py-1 rounded-full text-xs ${
                                        registration.present
                                          ? "bg-green-100 text-green-800"
                                          : "bg-gray-100 text-gray-800"
                                      }`}
                                    >
                                      {registration.present ? "Present" : "Not Here"}
                                    </span>
                                  </TableCell>
                                  <TableCell className="min-w-[120px]">
                                    {registration.createdAt
                                      ? new Date(registration.createdAt).toLocaleDateString()
                                      : "N/A"}
                                  </TableCell>
                                  <TableCell className="sticky right-0 bg-card shadow-[-4px_0_8px_rgba(0,0,0,0.1)] min-w-[170px]">
                                    <Button
                                      size="sm"
                                      onClick={() =>
                                        handleAttendanceToggle(registration.registrationId, !registration.present)
                                      }
                                      className={
                                        registration.present
                                          ? "bg-gray-200 text-gray-900 hover:bg-gray-300"
                                          : "bg-fire-purple hover:bg-fire-purple/90"
                                      }
                                      disabled={isWorkshopLoading}
                                    >
                                      {registration.present ? "Mark Not Here" : "Mark Present"}
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            {isDev && (
              <Card className="mt-8 border-dashed">
                <Collapsible
                  open={showDebug}
                  onOpenChange={(open) => {
                    setShowDebug(open);
                    if (open && lastFetchStatus === null) {
                      fetchOrders();
                    }
                  }}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-sm">Debug Details</CardTitle>
                          <CardDescription className="text-xs">
                            Token and API response diagnostics
                          </CardDescription>
                        </div>
                        {showDebug ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="space-y-3 text-xs font-mono">
                      <div>
                        <span className="font-semibold">Token Type:</span>{" "}
                        <span className={lastTokenType === "access" ? "text-amber-600" : "text-blue-600"}>
                          {lastTokenType || "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold">HTTP Status:</span>{" "}
                        <span className={lastFetchStatus === 200 ? "text-green-600" : "text-red-600"}>
                          {lastFetchStatus ?? "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold">Token Issuer:</span>{" "}
                        <span className="text-muted-foreground break-all">
                          {lastTokenClaims?.iss || "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold">Token Audience:</span>{" "}
                        <span className="text-muted-foreground break-all">
                          {lastTokenClaims?.aud || lastTokenClaims?.client_id || "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold">Token Expiration:</span>{" "}
                        <span className="text-muted-foreground">
                          {lastTokenClaims?.exp ? new Date(lastTokenClaims.exp * 1000).toISOString() : "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold">Response Keys:</span>{" "}
                        <span className="text-muted-foreground">
                          {lastResponseKeys?.join(", ") || "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold">Normalized Items:</span>{" "}
                        <span className="text-muted-foreground">
                          {normalizedCount ?? "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold">Response Body:</span>
                        <pre className="mt-2 p-3 bg-muted rounded text-[10px] overflow-x-auto max-h-48">
                          {lastFetchBody ?
                            (lastFetchBody.length > 1000 ?
                              lastFetchBody.substring(0, 1000) + "..." :
                              lastFetchBody
                            ) :
                            "No response yet"
                          }
                        </pre>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Admin;
