import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Instagram, ExternalLink, Info, Users, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { heroPhotos, flickrUrl } from "@/data/photos";

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroPhotos.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0f0820]">
      <div className="absolute inset-0">
        {heroPhotos.map((id, i) => (
          <img
            key={id}
            src={flickrUrl(id, "b")}
            alt=""
            aria-hidden="true"
            loading={i === 0 ? "eager" : "lazy"}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500ms] ease-in-out ${
              i === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-[#0f0820]/85 via-fire-deep/65 to-[#0f0820]/95 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.18),transparent_55%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(124,58,237,0.25),transparent_60%)] pointer-events-none" />

      <div className="relative z-30 text-center px-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-3 mb-8">
          <span className="h-px w-12 bg-fire-gold/60" />
          <span className="text-xs md:text-sm font-semibold tracking-[0.3em] text-fire-gold uppercase">
            A Ministry of Movement, Surrender &amp; Fire
          </span>
          <span className="h-px w-12 bg-fire-gold/60" />
        </div>

        <h1 className="text-7xl md:text-9xl font-black tracking-tight text-white leading-[0.95] drop-shadow-2xl">
          Fresh Fire
        </h1>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 bg-clip-text text-transparent mb-12 leading-[0.95] drop-shadow-2xl">
          Dance Ministry
        </h1>

        <div className="flex flex-wrap gap-3 justify-center items-center max-w-3xl mx-auto">
          <Button asChild variant="gold" size="lg">
            <a href="#audition-signup" className="flex items-center gap-2">
              <ChevronDown className="w-5 h-5" />
              Join Our Fire
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

        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex gap-2">
          {heroPhotos.map((id, i) => (
            <button
              key={id}
              type="button"
              onClick={() => setCurrentIndex(i)}
              aria-label={`Show photo ${i + 1}`}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === currentIndex ? "w-8 bg-fire-gold" : "w-2 bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
