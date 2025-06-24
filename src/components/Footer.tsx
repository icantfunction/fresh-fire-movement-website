
import { Instagram, ExternalLink, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-fire-deep text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold mb-4 text-fire-gradient">Fresh Fire Dance Ministry</h3>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Igniting lives through movement, surrender, and worship at Christian Life Center Fort Lauderdale
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-8">
          <a 
            href="https://instagram.com/ffdanceministry" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-fire-gold hover:text-fire-gold/80 transition-colors duration-300 font-semibold"
          >
            <Instagram className="w-5 h-5" />
            @ffdanceministry
          </a>
          
          <div className="w-px h-6 bg-gray-600 hidden md:block" />
          
          <a 
            href="https://clcftl.org" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-fire-gold hover:text-fire-gold/80 transition-colors duration-300 font-semibold"
          >
            <ExternalLink className="w-5 h-5" />
            Christian Life Center
          </a>
        </div>
        
        <div className="text-center text-gray-400 text-sm">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-fire-gold animate-pulse" />
            <span>for the Kingdom</span>
          </div>
          <p>&copy; 2024 Fresh Fire Dance Ministry. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
