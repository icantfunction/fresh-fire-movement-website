import Footer from "@/components/Footer";
import { allPhotosChronological, flickrUrl } from "@/data/photos";

const Gallery = () => {
  const allPhotos = allPhotosChronological;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0820] via-fire-deep to-[#1a0b2e]">
      <section className="relative pt-16 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.08),transparent_55%)] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="h-px w-12 bg-fire-gold/60" />
            <span className="text-xs md:text-sm font-semibold tracking-[0.3em] text-fire-gold uppercase">
              Photos &amp; Videos
            </span>
            <span className="h-px w-12 bg-fire-gold/60" />
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6">
            The Full Gallery
          </h1>

          <p className="text-white/70 max-w-2xl mx-auto text-base md:text-lg tracking-wide">
            Every moment of movement, surrender, and worship &mdash; captured in {allPhotos.length} frames from the Fresh Fire Dance Ministry.
          </p>
        </div>
      </section>

      <section className="relative pb-24 px-4">
        <div className="relative max-w-7xl mx-auto">
          <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-3 md:gap-4 [column-fill:_balance]">
            {allPhotos.map((id, i) => (
              <a
                key={id}
                href={flickrUrl(id, "b")}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block mb-3 md:mb-4 break-inside-avoid overflow-hidden rounded-lg border border-white/10 group cursor-zoom-in"
              >
                <img
                  src={flickrUrl(id, "z")}
                  alt={`Fresh Fire Dance Ministry photo ${i + 1}`}
                  loading={i < 12 ? "eager" : "lazy"}
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-fire-deep/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 ring-1 ring-fire-gold/0 group-hover:ring-fire-gold/50 transition-all duration-300" />
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 px-4 overflow-hidden border-t border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.06),transparent_60%)] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="h-px w-12 bg-fire-gold/60" />
            <span className="text-xs md:text-sm font-semibold tracking-[0.3em] text-fire-gold uppercase">
              Coming Soon
            </span>
            <span className="h-px w-12 bg-fire-gold/60" />
          </div>

          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-6">
            Videos
          </h2>

          <div className="relative bg-white/[0.04] border border-white/10 rounded-lg backdrop-blur-sm p-8 md:p-12">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-12 bg-fire-gold" />
            <p className="text-white/70 text-base md:text-lg leading-relaxed">
              Performance and worship-set videos from Fresh Fire Dance Ministry are on the way. Check back soon to watch the ministry in motion.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Gallery;
