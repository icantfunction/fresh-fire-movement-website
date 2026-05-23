import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { galleryPhotos, flickrUrl } from "@/data/photos";

const PREVIEW_COUNT = 8;

const GallerySection = () => {
  const previewPhotos = galleryPhotos.slice(0, PREVIEW_COUNT);

  return (
    <section className="relative py-24 px-4 overflow-hidden bg-gradient-to-br from-[#0f0820] via-fire-deep to-[#1a0b2e]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.06),transparent_60%)] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="h-px w-12 bg-fire-gold/60" />
            <span className="text-xs md:text-sm font-semibold tracking-[0.3em] text-fire-gold uppercase">
              The Gallery
            </span>
            <span className="h-px w-12 bg-fire-gold/60" />
          </div>

          <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white">
            Captured in Movement
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {previewPhotos.map((id) => (
            <Link
              key={id}
              to="/gallery"
              className="relative overflow-hidden rounded-lg border border-white/10 group cursor-pointer block"
            >
              <img
                src={flickrUrl(id, "z")}
                alt="Fresh Fire Dance Ministry"
                loading="lazy"
                className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-fire-deep/80 via-fire-deep/20 to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-300" />
              <div className="absolute inset-0 ring-1 ring-fire-gold/0 group-hover:ring-fire-gold/40 transition-all duration-300" />
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="relative inline-block bg-white/[0.04] border border-white/10 rounded-lg backdrop-blur-sm p-6 md:p-8">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-12 bg-fire-gold" />
            <p className="text-white/70 mb-5 text-sm md:text-base">
              Explore the full archive of {galleryPhotos.length}+ moments or submit your own.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild variant="gold">
                <Link to="/gallery">Browse Full Gallery</Link>
              </Button>
              <Button asChild variant="fire">
                <Link to="/captured-in-movement/upload">Upload Content</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
