import { Link } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { Button } from "./ui/button";
import { cognitoLogout } from "@/utils/cognitoLogout";
import { Loader2 } from "lucide-react";

const Navigation = () => {
  const auth = useAuth();

  const handleSignOut = () => {
    auth.removeUser();
    cognitoLogout();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-purple-200">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-fire-gradient">
            Fresh Fire
          </Link>
          
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" className="text-muted-foreground hover:text-fire-purple">
                Home
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="ghost" className="text-muted-foreground hover:text-fire-purple">
                About Us
              </Button>
            </Link>

            {auth.isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-fire-purple" />
            ) : auth.isAuthenticated ? (
              <>
                <Link to="/admin">
                  <Button variant="ghost" className="text-muted-foreground hover:text-fire-purple">
                    Admin
                  </Button>
                </Link>
                <span className="text-sm text-muted-foreground">
                  {auth.user?.profile.email}
                </span>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
                  className="border-fire-purple text-fire-purple hover:bg-fire-purple hover:text-white"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button
                  variant="default"
                  size="sm"
                  className="bg-fire-purple hover:bg-fire-purple/90"
                >
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;