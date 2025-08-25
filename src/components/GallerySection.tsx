
import { Card } from "@/components/ui/card";

const GallerySection = () => {
  const galleryImages = [
    "https://live.staticflickr.com/65535/54709595432_047bf4f33f_c.jpg",
    "https://live.staticflickr.com/65535/54710654874_630c048d4a_c.jpg",
    "https://live.staticflickr.com/65535/54709592352_444cf18e91_c.jpg",
    "https://live.staticflickr.com/65535/54710630223_429b866271_z.jpg"
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-fire-gradient">
          Captured in Movement
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {galleryImages.map((image, index) => (
            <Card key={index} className="overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300">
              <div 
                className="aspect-square bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                style={{ backgroundImage: `url(${image})` }}
              >
                <div className="w-full h-full bg-gradient-to-t from-fire-purple/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Card className="inline-block p-6 bg-white/80 backdrop-blur-sm border border-purple-200">
            <p className="text-gray-600 mb-2">More photos coming soon!</p>
            <p className="text-sm text-gray-500">Follow us on Instagram for the latest updates</p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
