import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { usePageMeta } from "@/hooks/usePageMeta";
import { LOCATIONS } from "@/data/locations";

const LocationPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = slug ? LOCATIONS[slug] : undefined;

  usePageMeta({
    title: location?.pageTitle ?? "Fresh Fire Dance Ministry",
    description: location?.metaDescription,
    canonical: location ? `https://freshfiredanceministry.com/ministries/${location.slug}` : undefined,
  });

  if (!location) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0820] via-fire-deep to-[#1a0b2e]">
      <section className="relative pt-12 pb-12 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.08),transparent_55%)] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-white/30 bg-white/5 text-white hover:bg-white hover:text-fire-deep mb-10"
          >
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>

          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="h-px w-12 bg-fire-gold/60" />
              <span className="text-xs md:text-sm font-semibold tracking-[0.3em] text-fire-gold uppercase">
                {location.overline}
              </span>
              <span className="h-px w-12 bg-fire-gold/60" />
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6">
              {location.headline}
            </h1>

            <p className="text-white/85 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
              {location.intro}
            </p>
          </div>
        </div>
      </section>

      <section className="relative pb-24 px-4">
        <div className="relative max-w-3xl mx-auto">
          <div className="relative bg-white/[0.04] border border-white/10 rounded-lg backdrop-blur-sm p-8 md:p-12">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-12 bg-fire-gold" />

            <div className="space-y-6 text-white/85 leading-relaxed text-base md:text-lg">
              {location.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="mt-10 pt-8 border-t border-white/10">
              <p className="text-fire-gold font-semibold tracking-[0.25em] uppercase text-xs mb-4">
                Serving the {location.cityShort} community
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-white/60 text-sm">
                {location.neighborhoodKeywords.map((keyword) => (
                  <li key={keyword} className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-fire-gold/60" />
                    {keyword}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Button asChild variant="gold" className="flex-1">
                <Link to="/#audition-signup">Join Our Fire</Link>
              </Button>
              <Button asChild variant="fire" className="flex-1">
                <Link to="/meet-the-team">Meet the Team</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LocationPage;
