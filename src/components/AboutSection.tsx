const AboutSection = () => {
  return (
    <section className="relative py-24 px-4 overflow-hidden bg-gradient-to-b from-fire-deep via-[#1a0b2e] to-[#0f0820]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.18),transparent_55%)] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-3 mb-6">
          <span className="h-px w-12 bg-fire-gold/60" />
          <span className="text-xs md:text-sm font-semibold tracking-[0.3em] text-fire-gold uppercase">
            Our Heart
          </span>
          <span className="h-px w-12 bg-fire-gold/60" />
        </div>

        <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-10">
          Called to Move in His Spirit
        </h2>

        <div className="relative bg-white/[0.04] border border-white/10 rounded-lg backdrop-blur-sm p-8 md:p-12">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-12 bg-fire-gold" />
          <p className="text-lg md:text-xl text-white/85 leading-relaxed">
            "The world does not need another dance..." We are not performers; we are worshippers that minister in dance. Our purpose is to worship God in Spirit and in Truth (John 4:23). We are His vessels, consecrated for His work and for His glory! We use our broad range of spiritual gifts to serve the Lord and minister to others. Everything we do will be done with excellence&hellip;for an audience of One!
          </p>
          <cite className="block mt-6 text-fire-gold font-semibold not-italic tracking-[0.2em] uppercase text-xs md:text-sm">
            &mdash; late Kimberly "Mama Kim" Smith
          </cite>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <span className="px-4 py-2 bg-white/[0.06] border border-white/10 text-white/80 rounded-full text-xs font-semibold uppercase tracking-[0.2em]">
            Ages 16+
          </span>
          <span className="px-4 py-2 bg-white/[0.06] border border-white/10 text-white/80 rounded-full text-xs font-semibold uppercase tracking-[0.2em]">
            All Skill Levels
          </span>
          <span className="px-4 py-2 bg-fire-gold/10 border border-fire-gold/30 text-fire-gold rounded-full text-xs font-semibold uppercase tracking-[0.2em]">
            Worship Through Movement
          </span>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
