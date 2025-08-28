import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export type Slide = {
  src: string;
  alt: string;
};

interface HeroSlideshowProps {
  images: Slide[];
  intervalMs?: number;
  className?: string;
}

const HeroSlideshow: React.FC<HeroSlideshowProps> = ({
  images,
  intervalMs = 6000,
  className,
}) => {
  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelectedIndex(api.selectedScrollSnap());
    api.on("select", onSelect);
    onSelect();
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  React.useEffect(() => {
    if (!api || paused || images.length <= 1) return;
    const id = setInterval(() => {
      api.scrollNext();
    }, intervalMs);
    return () => clearInterval(id);
  }, [api, intervalMs, paused, images.length]);

  if (!images || images.length === 0) return null;

  return (
    <div
      className={cn("relative h-full w-full", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <Carousel setApi={setApi} opts={{ loop: true }} className="h-full w-full">
        <CarouselContent className="h-full">
          {images.map((img, idx) => (
            <CarouselItem key={idx} className="h-full p-0">
              <div className="relative h-full w-full">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="absolute inset-0 h-full w-full object-cover filter blur-sm scale-110"
                  loading={idx === 0 ? "eager" : "lazy"}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-4 md:-left-12 bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm" />
        <CarouselNext className="-right-4 md:-right-12 bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm" />
      </Carousel>

      <div className="absolute bottom-4 left-1/2 z-[1] -translate-x-1/2">
        <div className="flex items-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => api?.scrollTo(i)}
              className={cn(
                "h-2 w-2 rounded-full transition-colors",
                i === selectedIndex ? "bg-white" : "bg-white/50"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSlideshow;