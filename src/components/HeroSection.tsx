
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
          filter: "brightness(0.3)"
        }}
      />
      
      {/* Fire Gradient Overlay */}
      <div className="absolute inset-0 fire-gradient opacity-70 z-10" />
      
      {/* Floating Fire Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-gradient-to-r from-orange-500 to-red-500 opacity-30 animate-gentle-float z-20" />
      <div className="absolute bottom-32 right-16 w-24 h-24 rounded-full bg-gradient-to-r from-yellow-400 to-orange-600 opacity-40 animate-dance-sway z-20" />
      <div className="absolute top-1/3 right-1/4 w-16 h-16 rounded-full bg-gradient-to-r from-red-400 to-pink-500 opacity-25 animate-gentle-float z-20" style={{ animationDelay: '1s' }} />
      
      {/* Main Content */}
      <div className="relative z-30 text-center px-4 max-w-4xl mx-auto">
        <div className="animate-gentle-float">
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
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white transition-all duration-300 animate-fire-glow font-semibold px-8 py-3 shadow-2xl"
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
              className="border-2 border-orange-300/50 text-orange-100 hover:bg-orange-500/20 hover:border-orange-300 transition-all duration-300 font-semibold px-8 py-3 backdrop-blur-sm"
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
