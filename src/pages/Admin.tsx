import { useAuth } from "react-oidc-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { cognitoLogout } from "@/utils/cognitoLogout";

const Admin = () => {
  const auth = useAuth();

  const handleSignOut = () => {
    auth.removeUser();
    cognitoLogout();
  };

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
        
        <div className="mb-8">
          <Card className="max-w-sm">
            <CardHeader>
              <CardTitle>Total Orders</CardTitle>
              <CardDescription>Haitian Spaghetti Orders</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">0</p>
            </CardContent>
          </Card>
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
                  <TableHead>Quantity</TableHead>
                  <TableHead>Special Instructions</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No orders yet
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Admin;
