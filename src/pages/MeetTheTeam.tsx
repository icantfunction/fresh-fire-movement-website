import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import lynette1 from "@/assets/lynette-photo-1.jpg";
import lynette2 from "@/assets/lynette-photo-2.jpg";
import lynette3 from "@/assets/lynette-photo-3.jpg";
import team1 from "@/assets/team/team-1.jpg";
import team2 from "@/assets/team/team-2.jpg";
import team3 from "@/assets/team/team-3.jpg";
import liana from "@/assets/leaders/liana.jpg";
import shanice from "@/assets/leaders/shanice.jpg";
import jadeja from "@/assets/leaders/jadeja.jpg";
import whitney from "@/assets/leaders/whitney.jpg";
import susana from "@/assets/leaders/susana.jpg";
import janeka from "@/assets/leaders/janeka.jpg";
import danielle from "@/assets/leaders/danielle.jpg";

const lynetteImages = [lynette1, lynette2, lynette3];
const teamImages = [team1, team2, team3];

const leaders = [
  { name: "Liana", title: "Fresh Fire Assistant Director", photo: liana },
  { name: "Shanice", title: "Dance Development Director", photo: shanice },
  { name: "Jadeja", title: "Fresh Fire Junior Director", photo: jadeja },
  { name: "Whitney", title: "Choreography Director", photo: whitney },
  { name: "Susana", title: "Garment Coordinator", photo: susana },
  { name: "Janeka", title: "Prayer Advisor", photo: janeka },
  { name: "Danielle", title: "Fresh Spirit Director", photo: danielle },
];

const MeetTheTeam = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % lynetteImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0820] via-fire-deep to-[#1a0b2e]">
      <section className="relative pt-12 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.08),transparent_55%)] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto">
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
                Our Leadership
              </span>
              <span className="h-px w-12 bg-fire-gold/60" />
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6">
              Meet the Team
            </h1>

            <p className="text-white/70 max-w-2xl mx-auto text-base md:text-lg tracking-wide">
              The hearts and hands behind Fresh Fire Dance Ministry &mdash; leaders consecrated for His work and for His glory.
            </p>
          </div>
        </div>
      </section>

      <section className="relative pb-24 px-4">
        <div className="relative max-w-6xl mx-auto">
          <div className="relative bg-white/[0.04] border border-white/10 rounded-lg backdrop-blur-sm overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-24 bg-fire-gold z-10" />

            <div className="grid md:grid-cols-5 gap-0">
              <div className="md:col-span-2 relative aspect-[3/4] md:aspect-auto md:min-h-[640px] overflow-hidden bg-fire-deep/40">
                {lynetteImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Mrs. Lynette Nelson - Photo ${index + 1}`}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500ms] ${
                      index === currentImageIndex ? "opacity-100" : "opacity-0"
                    }`}
                  />
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-fire-deep/50 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {lynetteImages.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCurrentImageIndex(i)}
                      aria-label={`Show photo ${i + 1}`}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        i === currentImageIndex ? "w-8 bg-fire-gold" : "w-2 bg-white/40 hover:bg-white/70"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="md:col-span-3 p-8 md:p-12">
                <p className="text-fire-gold font-semibold tracking-[0.25em] uppercase text-xs mb-3">
                  Executive Director
                </p>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-8">
                  Mrs. Lynette Nelson
                </h2>

                <div className="space-y-5 text-white/85 leading-relaxed text-sm md:text-base">
                  <p>
                    Lynette S. Nelson was destined to worship the Lord through dance. Born and raised in the south suburbs of Chicago, her journey began in childhood and was solidified in 1996 when her aunt taught her a praise dance to honor her grandparents' retirement&mdash;a moment that forever changed her life. She later joined the dance ministry at St. James AME Church, where she served as co-director of both the youth and adult dance ministries. In 2012, she was appointed Dance Coordinator for the Chicago Conference&ndash;South District of the AME Church, supporting over 20 churches until relocating in 2015.
                  </p>
                  <p>
                    Now residing in South Florida, Lynette joined Christian Life Center (CLC) in 2016 and served as Spiritual Advisor for Fresh Fire Dance Ministry. In 2021, she became its Director, leading the ministry's expansion, including the launch of Fresh Fire Juniors and providing dance leadership across CLC's four campuses: Sunrise, Prospect, Coral Springs, and West Boca.
                  </p>
                  <p>
                    Beyond dance, Lynette and her husband, Hugh Nelson, serve together at CLC by teaching premarital classes and as prayer team leaders within the Spiritual Life Ministry. She is also a member of the Lay Ministry Cohort, supporting various ministries across the church wherever needed.
                  </p>
                  <p>
                    Lynette is a certified graduate of The Eagles Network (TEN), has attended national dance conferences, and is deeply committed to using dance to express God's love and healing. She holds a Bachelor of Science in Finance and an MBA from the University of Illinois Urbana-Champaign, and works professionally as a healthcare treasury consultant. She is joyfully married to Hugh and enjoys traveling, baking, and serving God with passion and purpose.
                  </p>
                </div>

                <div className="relative mt-10 bg-fire-deep/40 border border-fire-gold/20 rounded-lg p-6">
                  <div className="absolute top-0 left-6 h-px w-10 bg-fire-gold" />
                  <p className="text-fire-gold font-semibold tracking-[0.25em] uppercase text-xs mb-3">
                    Her Life Verse
                  </p>
                  <blockquote className="text-white/90 italic text-base md:text-lg leading-relaxed mb-3">
                    &ldquo;Nothing shall be able to separate us from the love of God, which is in Christ Jesus our Lord.&rdquo;
                  </blockquote>
                  <cite className="text-fire-gold font-semibold not-italic tracking-[0.2em] uppercase text-xs">
                    Romans 8:39
                  </cite>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-20 px-4 overflow-hidden border-t border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.06),transparent_60%)] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="h-px w-12 bg-fire-gold/60" />
              <span className="text-xs md:text-sm font-semibold tracking-[0.3em] text-fire-gold uppercase">
                Also Leading
              </span>
              <span className="h-px w-12 bg-fire-gold/60" />
            </div>

            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
              Directors &amp; Coordinators
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {leaders.map((leader) => (
              <div key={leader.name} className="group">
                <div className="relative overflow-hidden rounded-lg border border-white/10 aspect-[2/3] mb-4 bg-fire-deep/40">
                  <img
                    src={leader.photo}
                    alt={`${leader.name}, ${leader.title}`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-fire-deep/80 via-fire-deep/10 to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-500" />
                  <div className="absolute inset-0 ring-1 ring-fire-gold/0 group-hover:ring-fire-gold/40 transition-all duration-500" />
                </div>
                <h3 className="text-xl md:text-2xl font-black tracking-tight text-white">
                  {leader.name}
                </h3>
                <p className="text-fire-gold font-semibold tracking-[0.18em] uppercase text-[10px] md:text-xs mt-1">
                  {leader.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 px-4 overflow-hidden border-t border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(124,58,237,0.18),transparent_60%)] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="h-px w-12 bg-fire-gold/60" />
              <span className="text-xs md:text-sm font-semibold tracking-[0.3em] text-fire-gold uppercase">
                The Ministry in Motion
              </span>
              <span className="h-px w-12 bg-fire-gold/60" />
            </div>

            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
              Together in Worship
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {teamImages.map((image, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-lg border border-white/10 group aspect-[3/2]"
              >
                <img
                  src={image}
                  alt={`Fresh Fire Dance Ministry team photo ${i + 1}`}
                  loading={i === 0 ? "eager" : "lazy"}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-fire-deep/70 via-transparent to-transparent opacity-50 group-hover:opacity-20 transition-opacity duration-500" />
                <div className="absolute inset-0 ring-1 ring-fire-gold/0 group-hover:ring-fire-gold/40 transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MeetTheTeam;
