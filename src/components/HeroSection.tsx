
import { Button } from "@/components/ui/button";
import { Instagram, ExternalLink, Info } from "lucide-react";
import { Link } from "react-router-dom";
import HeroSlideshow, { type Slide } from "@/components/HeroSlideshow";

const HeroSection = () => {
  const backgroundImages: Slide[] = [
    { src: "https://live.staticflickr.com/65535/54710633118_ed0842bac6_c.jpg", alt: "Fresh Fire Dance Ministry performance" },
    { src: "https://live.staticflickr.com/65535/54710632548_dfee898a4f_c.jpg", alt: "Dance ministry worship" },
    { src: "https://live.staticflickr.com/65535/54710427846_106fc692f2_c.jpg", alt: "Ministry movement and surrender" },
    { src: "https://live.staticflickr.com/65535/54710656484_22638b28b0_c.jpg", alt: "Fire dance ministry" },
    { src: "https://live.staticflickr.com/65535/54710426256_2ff009e34e_c.jpg", alt: "Worship through dance" },
    { src: "https://live.staticflickr.com/65535/54710654874_630c048d4a_c.jpg", alt: "Fresh Fire ministry worship" }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Slideshow */}
      <div className="absolute inset-0 z-0">
        <HeroSlideshow 
          images={backgroundImages} 
          intervalMs={6000} 
          className="h-full w-full"
        />
      </div>
      
      {/* Fire Ministry Overlay - Using design system */}
      <div className="absolute inset-0 fire-gradient opacity-30 z-10" />
      
      {/* Main Content */}
      <div className="relative z-30 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-bold text-hero-text mb-6 leading-tight drop-shadow-2xl animate-gentle-float">
          Fresh Fire
          <span className="block text-fire-gradient animate-fire-glow">
            Dance Ministry
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-hero-text-secondary mb-8 font-light drop-shadow-lg">
          A Ministry of Movement, Surrender, and Fire
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            asChild
            size="lg"
            className="fire-gradient hover:opacity-90 text-primary-foreground transition-all duration-300 font-semibold px-8 py-3 shadow-2xl animate-fire-glow"
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
            variant="outline"
            size="lg"
            className="border-2 border-hero-text/70 bg-background/90 text-foreground hover:bg-background hover:border-hero-text transition-all duration-300 font-semibold px-8 py-3 shadow-xl"
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

          <Button 
            asChild
            size="lg"
            className="royal-gradient hover:opacity-90 text-primary-foreground transition-all duration-300 font-semibold px-8 py-3 shadow-2xl"
          >
            <Link 
              to="/about"
              className="flex items-center gap-2"
            >
              <Info className="w-5 h-5" />
              About Us
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
