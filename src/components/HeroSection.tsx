import { Button } from "@/components/ui/button";
import { Instagram, ExternalLink, Info, Users, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden fire-gradient">
      
      {/* Main Content */}
      <div className="relative z-30 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
          Fresh Fire
          <span className="block bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 bg-clip-text text-transparent">
            Dance Ministry
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-orange-100 mb-8 font-light drop-shadow-lg">
          A Ministry of Movement, Surrender, and Fire
        </p>
        
        <div className="flex flex-wrap gap-3 justify-center items-center max-w-3xl mx-auto">
          <Button asChild variant="gold" size="lg">
            <a href="#audition-signup" className="flex items-center gap-2">
              <ChevronDown className="w-5 h-5" />
              Audition Signup
            </a>
          </Button>

          <Button asChild variant="fire" size="lg">
            <Link to="/about" className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              About Us
            </Link>
          </Button>

          <Button asChild variant="fire" size="lg">
            <Link to="/meet-the-team" className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Meet the Team
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            className="bg-white text-fire-deep border-2 border-white shadow-md hover:bg-white/90 hover:shadow-xl hover:-translate-y-0.5"
          >
            <a
              href="https://instagram.com/ffdanceministry"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Instagram className="w-5 h-5" />
              @ffdanceministry
            </a>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-fire-deep"
          >
            <a
              href="https://clcftl.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <ExternalLink className="w-5 h-5" />
              clcftl.org
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
