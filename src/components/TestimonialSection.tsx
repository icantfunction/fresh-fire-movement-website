
import { Card } from "@/components/ui/card";

const TestimonialSection = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-fire-gradient">
          Hearts Set Ablaze
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Video Testimonial Placeholder */}
          <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl border border-purple-200 animate-gentle-float">
            <div className="aspect-video bg-gradient-to-br from-fire-purple/20 to-fire-magenta/20 rounded-lg flex items-center justify-center mb-6">
              <div className="text-center text-gray-600">
                <div className="w-16 h-16 mx-auto mb-4 bg-fire-purple/20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-fire-purple" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <p className="font-semibold">Video Testimonial</p>
                <p className="text-sm">Coming Soon</p>
              </div>
            </div>
            <blockquote className="text-center italic text-gray-700">
              "Space reserved for powerful testimonies of lives transformed through worship and dance"
            </blockquote>
          </Card>
          
          {/* Quote Slider Placeholder */}
          <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl border border-purple-200 animate-dance-sway">
            <div className="text-center">
              <div className="text-6xl text-fire-gold mb-4">"</div>
              <blockquote className="text-xl italic text-gray-700 mb-6">
                "In the fire of worship, we find our truest selves - surrendered, consecrated, and alive in His presence."
              </blockquote>
              <cite className="text-fire-purple font-semibold">- Fresh Fire Dancer</cite>
            </div>
            
            <div className="flex justify-center mt-6 space-x-2">
              <div className="w-3 h-3 bg-fire-purple rounded-full"></div>
              <div className="w-3 h-3 bg-fire-magenta/50 rounded-full"></div>
              <div className="w-3 h-3 bg-fire-gold/50 rounded-full"></div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
