import { Button } from "@/components/ui/button";
import { Instagram, ExternalLink, Info, Users, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0f0820] via-fire-deep to-[#1a0b2e]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.16),transparent_55%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(124,58,237,0.25),transparent_60%)] pointer-events-none" />

      <div className="relative z-30 text-center px-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-3 mb-8">
          <span className="h-px w-12 bg-fire-gold/60" />
          <span className="text-xs md:text-sm font-semibold tracking-[0.3em] text-fire-gold uppercase">
            A Ministry of Movement, Surrender &amp; Fire
          </span>
          <span className="h-px w-12 bg-fire-gold/60" />
        </div>

        <h1 className="text-7xl md:text-9xl font-black tracking-tight text-white leading-[0.95]">
          Fresh Fire
        </h1>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 bg-clip-text text-transparent mb-12 leading-[0.95]">
          Dance Ministry
        </h1>

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
