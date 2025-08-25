import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-purple-200">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-fire-gradient">
            Fresh Fire
          </Link>
          
          <div className="flex gap-6">
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
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;