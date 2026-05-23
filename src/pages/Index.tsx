
import { ExternalLink } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import CountdownSection from "@/components/CountdownSection";
import TestimonialSection from "@/components/TestimonialSection";
import GallerySection from "@/components/GallerySection";
import BibleVersesSection from "@/components/BibleVersesSection";
import FormsSection from "@/components/FormsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <a
        href="https://clcftl.org"
        target="_blank"
        rel="noopener noreferrer"
        className="md:hidden block bg-gradient-to-r from-fire-deep via-fire-purple/40 to-fire-deep py-4 px-6 text-center group border-y border-fire-gold/20 hover:via-fire-purple/60 transition-colors"
      >
        <span className="inline-flex items-center gap-3 text-white text-xs font-semibold tracking-[0.3em] uppercase">
          <span className="h-px w-6 bg-fire-gold/60 transition-all duration-300 group-hover:w-10" />
          Christian Life Center
          <ExternalLink className="w-3 h-3 text-fire-gold" />
          <span className="h-px w-6 bg-fire-gold/60 transition-all duration-300 group-hover:w-10" />
        </span>
      </a>
      <AboutSection />
      <CountdownSection />
      {/* <TestimonialSection /> */}
      <GallerySection />
      <BibleVersesSection />
      <FormsSection />
      <Footer />
    </div>
  );
};

export default Index;
