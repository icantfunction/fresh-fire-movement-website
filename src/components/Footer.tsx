import { Instagram, ExternalLink, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-[#0f0820] via-[#1a0b2e] to-[#0f0820] text-white py-16 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.08),transparent_50%)] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-24 bg-fire-gold" />

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h3 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-3">
            Fresh Fire Dance Ministry
          </h3>
          <p className="text-white/60 max-w-2xl mx-auto text-sm md:text-base tracking-wide">
            Igniting lives through movement, surrender, and worship at Christian Life Center Fort Lauderdale
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-6 mb-10">
          <a
            href="https://instagram.com/ffdanceministry"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-fire-gold hover:text-fire-gold/80 transition-colors duration-200 text-sm font-semibold tracking-[0.15em] uppercase"
          >
            <Instagram className="w-4 h-4" />
            @ffdanceministry
          </a>

          <span className="hidden md:inline-block h-1 w-1 rounded-full bg-fire-gold/60" />

          <a
            href="https://clcftl.org"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-fire-gold hover:text-fire-gold/80 transition-colors duration-200 text-sm font-semibold tracking-[0.15em] uppercase"
          >
            <ExternalLink className="w-4 h-4" />
            Christian Life Center
          </a>
        </div>

        <div className="text-center text-white/40 text-xs tracking-wider">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span>Made with</span>
            <Heart className="w-3 h-3 text-fire-gold animate-pulse" />
            <span>for the Kingdom</span>
          </div>
          <p>&copy; 2026 Fresh Fire Dance Ministry. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
