import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navigation from "@/components/Navigation";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getCurrentSession, signIn, signOut, getIdToken, getAccessToken, parseJwt } from "@/lib/cognito";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const API_BASE = "https://y5w6n0i9vc.execute-api.us-east-1.amazonaws.com/prod";

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
        fetchOrders();
      },
      () => {
        setWho(null);
      }
    );
  }, []);

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
    setIsLoading(true);
    setNormalizedCount(null);
    const tryFetch = async (token: string, tokenType: "id" | "access") => {
      setLastTokenType(tokenType);
      try {
        const claims = parseJwt(token);
        setLastTokenClaims(claims ? { iss: claims.iss, aud: claims.aud, client_id: claims.client_id, exp: claims.exp } : null);
      } catch {
        setLastTokenClaims(null);
      }
      try {
        const response = await fetch(`${API_BASE}/admin?method=list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const responseText = await response.text();
        setLastFetchStatus(response.status);
        setLastFetchBody(responseText);
        let data: any = null;
        try {
          data = responseText ? JSON.parse(responseText) : null;
        } catch {
          data = null;
        }
        setLastResponseKeys(data && typeof data === "object" ? Object.keys(data) : null);
        if (!response.ok) {
          return { ok: false, status: response.status, data };
        }
        return { ok: true, status: response.status, data };
      } catch (err: any) {
        setLastFetchStatus(-1);
        setLastFetchBody(err?.message || "Network error");
        setLastResponseKeys(null);
        return { ok: false, status: -1, data: null };
      }
    };
    
    getIdToken(
      async (idToken) => {
        try {
          // Try with ID token first
          let result = await tryFetch(idToken, "id");
          
          // If 401/403, retry with Access token
          if (!result.ok && (result.status === 401 || result.status === 403)) {
            getAccessToken(
              async (accessToken) => {
                try {
                  result = await tryFetch(accessToken, "access");
                  
                  if (!result.ok) {
                    throw new Error(`Failed to fetch orders: ${result.status}`);
                  }
                  
                  const items = normalizeOrders(result.data);
                  setOrders(items);
                  setTotalOrders(items.length);
                  setNormalizedCount(items.length);
                } catch (error) {
                  toast({
                    title: "Error",
                    description: error instanceof Error ? error.message : "Failed to fetch orders",
                    variant: "destructive",
                  });
                } finally {
                  setIsLoading(false);
                }
              },
              (error) => {
                setAuthError(error);
                setIsLoading(false);
              }
            );
            return;
          }
          
          if (!result.ok) {
            throw new Error(`Failed to fetch orders: ${result.status}`);
          }
          
          const items = normalizeOrders(result.data);
          setOrders(items);
          setTotalOrders(items.length);
          setNormalizedCount(items.length);
        } catch (error) {
          toast({
            title: "Error",
            description: error instanceof Error ? error.message : "Failed to fetch orders",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        setAuthError(error);
        setIsLoading(false);
      }
    );
  };

  const handleApprove = async (orderId: string) => {
    const tryApprove = async (token: string, tokenType: "id" | "access") => {
      setLastTokenType(tokenType);
      try {
        const claims = parseJwt(token);
        setLastTokenClaims(claims ? { iss: claims.iss, aud: claims.aud, client_id: claims.client_id, exp: claims.exp } : null);
      } catch {
        setLastTokenClaims(null);
      }
      try {
        const response = await fetch(
          `${API_BASE}/admin?method=approve&orderId=${encodeURIComponent(orderId)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        const responseText = await response.text();
        setLastFetchStatus(response.status);
        setLastFetchBody(responseText);
        setLastResponseKeys(null);
        
        return { ok: response.ok, status: response.status };
      } catch (err: any) {
        setLastFetchStatus(-1);
        setLastFetchBody(err?.message || "Network error");
        setLastResponseKeys(null);
        return { ok: false, status: -1 };
      }
    };
    
    getIdToken(
      async (idToken) => {
        try {
          let result = await tryApprove(idToken, "id");
          
          // If 401/403, retry with Access token
          if (!result.ok && (result.status === 401 || result.status === 403)) {
            getAccessToken(
              async (accessToken) => {
                try {
                  result = await tryApprove(accessToken, "access");
                  
                  if (!result.ok) {
                    throw new Error(`Failed to approve order: ${result.status}`);
                  }
                  
                  toast({
                    title: "Success",
                    description: "Order approved successfully",
                  });
                  
                  fetchOrders();
                } catch (error) {
                  toast({
                    title: "Error",
                    description: error instanceof Error ? error.message : "Failed to approve order",
                    variant: "destructive",
                  });
                }
              },
              (error) => {
                toast({
                  title: "Error",
                  description: error,
                  variant: "destructive",
                });
              }
            );
            return;
          }
          
          if (!result.ok) {
            throw new Error(`Failed to approve order: ${result.status}`);
          }
          
          toast({
            title: "Success",
            description: "Order approved successfully",
          });
          
          fetchOrders();
        } catch (error) {
          toast({
            title: "Error",
            description: error instanceof Error ? error.message : "Failed to approve order",
            variant: "destructive",
          });
        }
      },
      (error) => {
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        });
      }
    );
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
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="border-fire-purple text-fire-purple hover:bg-fire-purple hover:text-white"
              >
                Sign Out
              </Button>
            </div>
            
            <div className="flex gap-4 mb-8">
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
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Special Instructions</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center">
                          <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                        </TableCell>
                      </TableRow>
                    ) : orders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground">
                          No orders yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      orders.map((order) => (
                        <TableRow key={order.orderId}>
                          <TableCell>{order.name}</TableCell>
                          <TableCell>{order.phone}</TableCell>
                          <TableCell>{order.email}</TableCell>
                          <TableCell>{order.quantity}</TableCell>
                          <TableCell>
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
                          <TableCell>{order.specialInstructions || "-"}</TableCell>
                          <TableCell>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {order.status === "pending" && (
                              <Button
                                size="sm"
                                onClick={() => handleApprove(order.orderId)}
                                className="bg-fire-purple hover:bg-fire-purple/90"
                              >
                                Approve
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            {/* Debug Panel */}
            <Card className="mt-8 border-dashed">
              <Collapsible open={showDebug} onOpenChange={setShowDebug}>
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
                        {lastFetchStatus || "N/A"}
                      </span>
                    </div>
                    {lastTokenType && (
                      <div>
                        <span className="font-semibold">Token Audience (first 40 chars):</span>{" "}
                        <span className="text-muted-foreground break-all">
                          {(() => {
                            try {
                              const tokenParts = lastFetchBody.split('Bearer ');
                              if (tokenParts.length > 1) {
                                const claims = parseJwt(tokenParts[1]);
                                return (claims?.aud || claims?.client_id || "N/A").substring(0, 40);
                              }
                              return "N/A";
                            } catch {
                              return "N/A";
                            }
                          })()}
                        </span>
                      </div>
                    )}
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
          </>
        )}
      </main>
    </div>
  );
};

export default Admin;
