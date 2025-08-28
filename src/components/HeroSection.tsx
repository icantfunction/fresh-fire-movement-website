
import { Button } from "@/components/ui/button";
import { Instagram, ExternalLink, Info } from "lucide-react";
import { Link } from "react-router-dom";
import HeroSlideshow from "./HeroSlideshow";

const HeroSection = () => {
  const images = [
    { src: "https://live.staticflickr.com/65535/54710633118_ed0842bac6_c.jpg", alt: "Fresh Fire Dance Ministry performance" },
    { src: "https://live.staticflickr.com/65535/54710632548_dfee898a4f_c.jpg", alt: "Dancers in worship" },
    { src: "https://live.staticflickr.com/65535/54710427846_106fc692f2_c.jpg", alt: "Ministry in action" },
    { src: "https://live.staticflickr.com/65535/54710656484_22638b28b0_c.jpg", alt: "Dance ministry team" },
    { src: "https://live.staticflickr.com/65535/54710426256_2ff009e34e_c.jpg", alt: "Worship through movement" },
    { src: "https://live.staticflickr.com/65535/54710654874_630c048d4a_c.jpg", alt: "Fresh Fire community" }
  ];

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Slideshow */}
      <HeroSlideshow 
        images={images}
        variant="cinema"
        className="absolute inset-0 z-0"
        overlay={
          <div className="text-center px-4 max-w-4xl mx-auto">
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
        }
      />
    </section>
  );
};

export default HeroSection;
