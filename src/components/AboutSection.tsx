
const AboutSection = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-fire-gradient">
            Called to Move in His Spirit
          </h2>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-2xl border border-purple-200">
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              "The world does not need another dance..." We are not performers; we are worshippers that minister in dance. Our purpose is to worship God in Spirit and in Truth (John 4:23). We are His vessels, consecrated for His work and for His glory! We use our broad range of spiritual gifts to serve the Lord and minister to others. Everything we do will be done with excellence…for an audience of One!
            </p>
            <cite className="block mt-4 text-fire-gold font-semibold italic">- late Kimberly "Mama Kim" Smith</cite>
            
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
