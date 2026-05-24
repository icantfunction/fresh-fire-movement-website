import { useEffect, useState } from "react";
import { Loader2, CalendarDays, Video, Image as ImageIcon } from "lucide-react";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchMediaArchive } from "@/services/mediaService";
import type { MediaArchiveItem } from "@/types/media";

const MediaArchive = () => {
  const [items, setItems] = useState<MediaArchiveItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const archiveItems = await fetchMediaArchive();
        setItems(archiveItems);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load archive.");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-yellow-50">
      <main className="pt-12 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-fire-gradient mb-3">
              Captured in Movement Archive
            </h1>
            <p className="text-gray-600">
              Approved clips and photos from our ministry moments.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-fire-purple" />
            </div>
          ) : error ? (
            <Card className="max-w-xl mx-auto">
              <CardContent className="pt-6 text-center text-red-600">{error}</CardContent>
            </Card>
          ) : items.length === 0 ? (
            <Card className="max-w-xl mx-auto">
              <CardContent className="pt-6 text-center text-gray-600">
                No approved media yet. Check back soon.
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {items.map((item) => (
                <Card key={item.submissionId} className="overflow-hidden">
                  <div className="bg-black/5">
                    {item.mediaType === "video" ? (
                      <video
                        src={item.previewUrl}
                        controls
                        preload="metadata"
                        className="w-full h-72 object-cover bg-black"
                      />
                    ) : (
                      <img
                        src={item.previewUrl}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-72 object-cover"
                      />
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-gray-600">
                    {item.description ? <p>{item.description}</p> : null}
                    <p className="flex items-center gap-2">
                      {item.mediaType === "video" ? (
                        <Video className="w-4 h-4" />
                      ) : (
                        <ImageIcon className="w-4 h-4" />
                      )}
                      {item.mediaType === "video" ? "Video clip" : "Photo"}
                    </p>
                    <p className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4" />
                      Captured: {new Date(item.capturedAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MediaArchive;

