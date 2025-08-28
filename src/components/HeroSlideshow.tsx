import { useState, useEffect, useRef } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

interface HeroSlideshowProps {
  images: Array<{ src: string; alt: string }>;
  variant?: "standard" | "cinema";
  fadeMs?: number;
  kenBurns?: boolean;
  blurPx?: number;
  overlayGradient?: boolean;
  overlay?: React.ReactNode;
  className?: string;
}

const HeroSlideshow = ({
  images,
  variant = "standard",
  fadeMs = 3000,
  kenBurns = true,
  blurPx = 2,
  overlayGradient = true,
  overlay,
  className = "",
}: HeroSlideshowProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  const [isPaused, setIsPaused] = useState(false);
  
  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const autoplayOptions = {
    delay: variant === "cinema" ? fadeMs + 1000 : 7000,
    stopOnInteraction: false,
    stopOnFocusIn: false,
  };

  const plugin = useRef(
    Autoplay(autoplayOptions)
  );

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setSelectedIndex(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    onSelect();

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // Preload next image
  useEffect(() => {
    if (variant === "cinema" && images.length > 1) {
      const nextIndex = (selectedIndex + 1) % images.length;
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = images[nextIndex].src;
      document.head.appendChild(link);
      
      return () => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      };
    }
  }, [selectedIndex, images, variant]);

  // Handle pause/resume on hover and focus
  const handleMouseEnter = () => {
    setIsPaused(true);
    plugin.current.stop();
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    plugin.current.play();
  };

  const handleFocus = () => {
    setIsPaused(true);
    plugin.current.stop();
  };

  const handleBlur = () => {
    setIsPaused(false);
    plugin.current.play();
  };

  const adjustedFadeMs = prefersReducedMotion ? 300 : fadeMs;
  const shouldUseKenBurns = variant === "cinema" && kenBurns && !prefersReducedMotion;

  return (
    <div 
      className={`relative w-full h-full ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="w-full h-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="h-full">
          {images.map((img, idx) => {
            const isActive = idx === selectedIndex;
            
            if (variant === "cinema") {
              return (
                <CarouselItem key={idx} className="absolute inset-0 h-full w-full p-0">
                  <div className="relative h-full w-full">
                    <img
                      src={img.src}
                      alt={img.alt}
                      className={`
                        absolute inset-0 h-full w-full object-cover
                        transition-opacity duration-[${adjustedFadeMs}ms] ease-in-out
                        ${isActive ? "opacity-100" : "opacity-0"}
                        ${shouldUseKenBurns ? (isActive
                          ? `md:blur-[${blurPx}px] blur-[1px] scale-110 md:scale-105 transition-transform duration-[7000ms] ease-linear`
                          : "blur-0 scale-100") : ""}
                      `}
                      loading={idx === 0 ? "eager" : "lazy"}
                      style={{ willChange: "opacity, transform" }}
                    />
                  </div>
                </CarouselItem>
              );
            }

            return (
              <CarouselItem key={idx} className="h-full p-0">
                <div className="relative h-full w-full">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading={idx === 0 ? "eager" : "lazy"}
                  />
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {/* Overlay gradient (cinema mode) */}
        {variant === "cinema" && overlayGradient && (
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-br from-orange-600/40 via-red-600/50 to-yellow-500/40 mix-blend-multiply" />
        )}

        {/* ARIA controls for accessibility */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex gap-2" role="tablist" aria-label="Slideshow navigation">
            {images.map((_, idx) => (
              <button
                key={idx}
                role="tab"
                aria-selected={idx === selectedIndex}
                aria-label={`Go to slide ${idx + 1}`}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === selectedIndex 
                    ? "bg-white scale-125" 
                    : "bg-white/50 hover:bg-white/75"
                }`}
                onClick={() => api?.scrollTo(idx)}
              />
            ))}
          </div>
        </div>
      </Carousel>

      {/* Optional overlay content slot */}
      {overlay && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          {overlay}
        </div>
      )}
    </div>
  );
};

export default HeroSlideshow;