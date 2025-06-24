
import { Button } from "@/components/ui/button";
import { Instagram, ExternalLink } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1920&h=1080&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.4)"
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 royal-gradient opacity-60 z-10" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full fire-gradient opacity-20 animate-gentle-float z-20" />
      <div className="absolute bottom-32 right-16 w-24 h-24 rounded-full bg-fire-gold opacity-30 animate-dance-sway z-20" />
      
      {/* Main Content */}
      <div className="relative z-30 text-center px-4 max-w-4xl mx-auto">
        <div className="animate-gentle-float">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
            Fresh Fire
            <span className="block text-fire-gradient">Dance Ministry</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200 mb-8 font-light">
            A Ministry of Movement, Surrender, and Fire
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              asChild
              size="lg"
              className="fire-gradient text-white hover:opacity-90 transition-all duration-300 animate-fire-glow font-semibold px-8 py-3"
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
              className="border-white/30 text-white hover:bg-white/10 transition-all duration-300 font-semibold px-8 py-3"
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
      </div>
    </section>
  );
};

export default HeroSection;
