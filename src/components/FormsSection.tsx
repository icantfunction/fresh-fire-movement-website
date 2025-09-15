
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const FormsSection = () => {

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-fire-gradient">
          Connect with Fresh Fire
        </h2>
        
        <div className="w-full">
          <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl border border-purple-200">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-fire-gold mb-4">Join Our Fire</h3>
              <p className="text-gray-600 mb-8">Ready to become part of the Fresh Fire Dance Ministry family?</p>
              
              <Button 
                onClick={() => window.open('https://chat.whatsapp.com/J1eUD5DKl8q9K809mYlZxm?mode=ems_copy_t', '_blank')}
                className="w-full max-w-md mx-auto bg-fire-gold hover:bg-fire-gold/90 text-white transition-all duration-300 font-semibold text-lg py-4"
              >
                Join Our WhatsApp Group
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FormsSection;
