import { useState } from "react";
import { Eye, Download, Loader2 } from "lucide-react";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { allPhotosChronological, flickrUrl, type FlickrSize } from "@/data/photos";

// Quality ladder: try original first, fall back through descending sizes.
const DOWNLOAD_SIZE_LADDER: FlickrSize[] = ["o", "k", "h", "b", "c"];

async function downloadPhotoAtHighestQuality(id: string): Promise<void> {
  const filename = `fresh-fire-${id}.jpg`;

  for (const size of DOWNLOAD_SIZE_LADDER) {
    try {
      const url = flickrUrl(id, size);
      const response = await fetch(url);
      if (!response.ok) continue;

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(objectUrl);
      return;
    } catch {
      continue;
    }
  }

  throw new Error("No downloadable size available for this photo.");
}

const Gallery = () => {
  const allPhotos = allPhotosChronological;
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const closeDialog = () => {
    if (isDownloading) return;
    setSelectedPhoto(null);
  };

  const handleView = (id: string) => {
    window.open(flickrUrl(id, "h"), "_blank", "noopener,noreferrer");
    setSelectedPhoto(null);
  };

  const handleDownload = async (id: string) => {
    setIsDownloading(true);
    try {
      await downloadPhotoAtHighestQuality(id);
      toast({
        title: "Photo saved",
        description: "Check your device's downloads folder.",
      });
      setSelectedPhoto(null);
    } catch {
      toast({
        title: "Download failed",
        description: "Opening the photo in a new tab instead — you can save from there.",
        variant: "destructive",
      });
      window.open(flickrUrl(id, "b"), "_blank", "noopener,noreferrer");
      setSelectedPhoto(null);
    } finally {
      setIsDownloading(false);
    }
  };

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

          <p className="text-white/50 max-w-2xl mx-auto text-xs md:text-sm tracking-wide mt-4 uppercase font-semibold tracking-[0.2em]">
            Tap any photo to view or save it
          </p>
        </div>
      </section>

      <section className="relative pb-24 px-4">
        <div className="relative max-w-7xl mx-auto">
          <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-3 md:gap-4 [column-fill:_balance]">
            {allPhotos.map((id, i) => (
              <button
                key={id}
                type="button"
                onClick={() => setSelectedPhoto(id)}
                aria-label={`Open photo ${i + 1}`}
                className="relative block mb-3 md:mb-4 break-inside-avoid overflow-hidden rounded-lg border border-white/10 group cursor-pointer w-full text-left"
              >
                <img
                  src={flickrUrl(id, "z")}
                  alt={`Fresh Fire Dance Ministry photo ${i + 1}`}
                  loading={i < 12 ? "eager" : "lazy"}
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-fire-deep/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 ring-1 ring-fire-gold/0 group-hover:ring-fire-gold/50 transition-all duration-300" />
              </button>
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

      <Dialog open={selectedPhoto !== null} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="max-w-2xl bg-[#0f0820] border-white/10 text-white sm:rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-white tracking-tight font-black text-2xl">
              View or Save
            </DialogTitle>
            <DialogDescription className="text-white/60">
              View opens the photo full-screen in a new tab. Download saves it directly to your device at the highest quality available.
            </DialogDescription>
          </DialogHeader>

          {selectedPhoto && (
            <>
              <div className="rounded-lg overflow-hidden border border-white/10 bg-black/40">
                <img
                  src={flickrUrl(selectedPhoto, "c")}
                  alt="Selected"
                  className="w-full object-contain max-h-[55vh]"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  onClick={() => handleView(selectedPhoto)}
                  variant="fire"
                  size="lg"
                  className="flex-1"
                  disabled={isDownloading}
                >
                  <Eye className="mr-2 h-5 w-5" />
                  View
                </Button>
                <Button
                  onClick={() => handleDownload(selectedPhoto)}
                  variant="gold"
                  size="lg"
                  className="flex-1"
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-5 w-5" />
                      Download
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Gallery;
