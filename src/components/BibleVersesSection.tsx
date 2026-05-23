const BibleVersesSection = () => {
  const verses = [
    {
      quote:
        "Therefore, since we are receiving a kingdom that cannot be shaken, let us be thankful, and so worship God acceptably with reverence and awe for our God is a consuming fire.",
      citation: "Hebrews 12:28-29",
    },
    {
      quote:
        "Therefore, I urge you, brothers and sisters, in view of God's mercy, to offer your bodies as a living sacrifice, holy and pleasing to God—this is your true and proper worship.",
      citation: "Romans 12:1",
    },
  ];

  return (
    <section className="relative py-24 px-4 overflow-hidden bg-gradient-to-t from-fire-deep via-[#1a0b2e] to-[#0f0820]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(245,158,11,0.22),transparent_55%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.12),transparent_60%)] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-3 mb-6">
          <span className="h-px w-12 bg-fire-gold/60" />
          <span className="text-xs md:text-sm font-semibold tracking-[0.3em] text-fire-gold uppercase">
            Scripture
          </span>
          <span className="h-px w-12 bg-fire-gold/60" />
        </div>

        <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-12">
          Founded on His Word
        </h2>

        <div className="space-y-6">
          {verses.map((verse) => (
            <div
              key={verse.citation}
              className="relative bg-white/[0.04] border border-white/10 rounded-lg backdrop-blur-sm p-8 md:p-12 text-left md:text-center"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-12 bg-fire-gold" />
              <blockquote className="text-xl md:text-2xl text-white/90 italic leading-relaxed mb-5">
                &ldquo;{verse.quote}&rdquo;
              </blockquote>
              <cite className="text-fire-gold font-semibold not-italic tracking-[0.2em] uppercase text-xs md:text-sm">
                {verse.citation}
              </cite>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BibleVersesSection;
