
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
            <blockquote className="text-xl md:text-2xl text-white italic mb-4">
              "Let them praise His name with dancing; let them sing praises to Him with tambourine and lyre."
            </blockquote>
            <cite className="text-fire-gold font-semibold">Psalm 149:3</cite>
          </Card>
          
          <Card className="p-8 bg-white/10 backdrop-blur-md border border-white/20 text-center">
            <blockquote className="text-xl md:text-2xl text-white italic mb-4">
              "You have turned my mourning into joyful dancing. You have taken away my clothes of mourning and clothed me with joy."
            </blockquote>
            <cite className="text-fire-gold font-semibold">Psalm 30:11</cite>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default BibleVersesSection;
