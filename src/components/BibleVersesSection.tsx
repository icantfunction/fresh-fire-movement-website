
import { Card } from "@/components/ui/card";

const BibleVersesSection = () => {
  return (
    <section className="py-20 px-4 royal-gradient">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-white">
          Founded on His Word
        </h2>
        
        <div className="space-y-8">
          <Card className="p-8 bg-white/10 backdrop-blur-md border border-white/20 text-center">
            <blockquote className="text-lg md:text-xl text-white italic mb-4">
              "The world does not need another dance..." We are not performers; we are worshippers that minister in dance. Our purpose is to worship God in Spirit and in Truth (John 4:23). We are His vessels, consecrated for His work and for His glory! We use our broad range of spiritual gifts to serve the Lord and minister to others. Everything we do will be done with excellence…for an audience of One!
            </blockquote>
            <cite className="text-fire-gold font-semibold">Ministry Vision - late Kimberly "Mama Kim" Smith</cite>
          </Card>
          
          <Card className="p-8 bg-white/10 backdrop-blur-md border border-white/20 text-center">
            <blockquote className="text-xl md:text-2xl text-white italic mb-4">
              "Therefore, since we are receiving a kingdom that cannot be shaken, let us be thankful, and so worship God acceptably with reverence and awe for our God is a consuming fire."
            </blockquote>
            <cite className="text-fire-gold font-semibold">Hebrews 12:28-29</cite>
          </Card>
          
          <Card className="p-8 bg-white/10 backdrop-blur-md border border-white/20 text-center">
            <blockquote className="text-xl md:text-2xl text-white italic mb-4">
              "Therefore, I urge you, brothers and sisters, in view of God's mercy, to offer your bodies as a living sacrifice, holy and pleasing to God--this is your true and proper worship."
            </blockquote>
            <cite className="text-fire-gold font-semibold">Romans 12:1</cite>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default BibleVersesSection;
