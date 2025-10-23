import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navigation from "@/components/Navigation";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getCurrentSession, signIn, signOut, getIdToken, parseJwt } from "@/lib/cognito";

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

  const fetchOrders = async () => {
    setIsLoading(true);
    getIdToken(
      async (token) => {
        try {
          const response = await fetch(`${API_BASE}/admin?method=list`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch orders: ${response.status}`);
          }

          const data = await response.json();
          setOrders(data.items || []);
          setTotalOrders(data.items?.length || 0);
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
    getIdToken(
      async (token) => {
        try {
          const response = await fetch(
            `${API_BASE}/admin?method=approve&orderId=${encodeURIComponent(orderId)}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error(`Failed to approve order: ${response.status}`);
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
          </>
        )}
      </main>
    </div>
  );
};

export default Admin;
