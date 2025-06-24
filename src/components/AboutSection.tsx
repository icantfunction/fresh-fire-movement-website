
const AboutSection = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="animate-gentle-float">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-fire-gradient">
            Called to Move in His Spirit
          </h2>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-2xl border border-purple-200">
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              Fresh Fire is a dance ministry led by Ms. Lynette Nelson at Christian Life Center Fort Lauderdale. Open to anyone age 16 and up, Fresh Fire exists to ignite lives through movement, emphasizing surrender, consecration, and worship through dance. Whether you're a teen, adult, parent, or fellow worship artist, there's room for you in the fire.
            </p>
            
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <span className="px-4 py-2 bg-fire-purple/10 text-fire-purple rounded-full font-semibold">
                Ages 16+
              </span>
              <span className="px-4 py-2 bg-fire-magenta/10 text-fire-magenta rounded-full font-semibold">
                All Skill Levels
              </span>
              <span className="px-4 py-2 bg-fire-gold/10 text-amber-700 rounded-full font-semibold">
                Worship Through Movement
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
