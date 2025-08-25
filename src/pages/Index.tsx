
import Navigation from "@/components/Navigation";
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
      <Navigation />
      <div className="pt-20">
        <HeroSection />
        <AboutSection />
        <CountdownSection />
        <TestimonialSection />
        <GallerySection />
        <BibleVersesSection />
        <FormsSection />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
