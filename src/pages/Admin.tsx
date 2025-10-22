import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { cognitoLogout } from "@/utils/cognitoLogout";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const auth = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalOrders, setTotalOrders] = useState(0);

  const fetchOrders = async () => {
    if (!auth.user) return;
    
    setIsLoading(true);
    try {
      const token = auth.user.id_token || auth.user.access_token;
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
  };

  const handleApprove = async (orderId: string) => {
    if (!auth.user) return;

    try {
      const token = auth.user.id_token || auth.user.access_token;
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
  };

  const handleSignOut = () => {
    auth.removeUser();
    cognitoLogout();
  };

  useEffect(() => {
    if (auth.isAuthenticated) {
      fetchOrders();
    }
  }, [auth.isAuthenticated]);

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto px-4 py-8 mt-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Logged in as: <span className="font-medium text-fire-purple">{auth.user?.profile.email}</span>
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
      </main>
    </div>
  );
};

export default Admin;
