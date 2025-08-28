
import { Button } from "@/components/ui/button";
import { Instagram, ExternalLink, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

interface HeroSectionProps {
  variant?: "standard" | "cinema";
  fadeMs?: number;
  kenBurns?: boolean;
  blurPx?: number;
  overlayGradient?: boolean;
  overlay?: React.ReactNode;
}

const HeroSection = ({
  variant = "standard",
  fadeMs = 3000,
  kenBurns = true,
  blurPx = 2,
  overlayGradient = true,
  overlay
}: HeroSectionProps = {}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const backgroundImages = [
    { src: "https://live.staticflickr.com/65535/54710633118_ed0842bac6_c.jpg", alt: "Fresh Fire Dance Ministry performance" },
    { src: "https://live.staticflickr.com/65535/54710632548_dfee898a4f_c.jpg", alt: "Dance worship session" },
    { src: "https://live.staticflickr.com/65535/54710427846_106fc692f2_c.jpg", alt: "Ministry team performance" },
    { src: "https://live.staticflickr.com/65535/54710656484_22638b28b0_c.jpg", alt: "Worship dance ministry" },
    { src: "https://live.staticflickr.com/65535/54710426256_2ff009e34e_c.jpg", alt: "Fresh Fire dance team" },
    { src: "https://live.staticflickr.com/65535/54710654874_630c048d4a_c.jpg", alt: "Dance ministry worship" }
  ];

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  // Preload next image
  useEffect(() => {
    const nextIndex = (currentImageIndex + 1) % backgroundImages.length;
    const nextImage = backgroundImages[nextIndex];
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = nextImage.src;
    document.head.appendChild(link);
    
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, [currentImageIndex, backgroundImages]);

  const getTransitionDuration = () => {
    if (prefersReducedMotion) return "duration-300";
    return variant === "cinema" ? `duration-[${fadeMs}ms]` : "duration-[4000ms]";
  };

  const getKenBurnsClasses = (isActive: boolean) => {
    if (!kenBurns || prefersReducedMotion || variant !== "cinema") return "";
    
    if (isActive) {
      return `scale-110 md:scale-105 blur-[1px] md:blur-[${blurPx}px] transition-transform duration-[7000ms] ease-linear`;
    }
    return "scale-100 blur-0 transition-transform duration-[7000ms] ease-linear";
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Slideshow */}
      <div className="absolute inset-0 z-0">
        {backgroundImages.map((image, index) => {
          const isActive = index === currentImageIndex;
          return (
            <div key={index} className="absolute inset-0 w-full h-full">
              <img
                src={image.src}
                alt={image.alt}
                className={`
                  absolute inset-0 w-full h-full object-cover
                  ${variant === "cinema" 
                    ? `transition-opacity ${getTransitionDuration()} ease-in-out ${
                        isActive ? "opacity-100" : "opacity-0"
                      } ${getKenBurnsClasses(isActive)}`
                    : `filter blur-sm scale-110 transition-opacity ${getTransitionDuration()} ease-in-out ${
                        isActive ? "opacity-100" : "opacity-0"
                      }`
                  }
                `}
                loading={index === 0 ? "eager" : "lazy"}
                style={variant === "cinema" ? { willChange: "opacity, transform" } : undefined}
              />
            </div>
          );
        })}
      </div>
      
      {/* Overlay gradient */}
      {variant === "cinema" && overlayGradient ? (
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-br from-orange-600/40 via-red-600/50 to-yellow-500/40 mix-blend-multiply" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/50 via-red-600/60 to-yellow-500/50 z-10" />
      )}
      
      {/* Optional overlay content slot */}
      {overlay && <div className="absolute inset-0 z-20 flex items-center justify-center">{overlay}</div>}
      
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
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            asChild
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white transition-all duration-300 font-semibold px-8 py-3 shadow-2xl"
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
            className="border-2 border-white/70 bg-white/90 text-gray-800 hover:bg-white hover:border-white transition-all duration-300 font-semibold px-8 py-3 shadow-xl"
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
            className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white transition-all duration-300 font-semibold px-8 py-3 shadow-2xl"
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
