import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Instagram, ExternalLink, Info, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const HeroSection = () => {
  const [spaghettiFormOpen, setSpaghettiFormOpen] = useState(false);

  const handleSpaghettiOrder = (e: React.FormEvent) => {
    e.preventDefault();
    // Will be connected to DynamoDB soon
    setSpaghettiFormOpen(false);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden fire-gradient">
      
      {/* Main Content */}
      <div className="relative z-30 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
          Fresh Fire
          <span className="block bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 bg-clip-text text-transparent">
            Dance Ministry
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-orange-100 mb-8 font-light drop-shadow-lg">
          A Ministry of Movement, Surrender, and Fire
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            asChild
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white transition-all duration-300 font-semibold px-8 py-3 shadow-2xl"
          >
            <a 
              href="https://instagram.com/ffdanceministry" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Instagram className="w-5 h-5" />
              @ffdanceministry
            </a>
          </Button>
          
          <Button 
            asChild
            variant="outline"
            size="lg"
            className="border-2 border-white/70 bg-white/90 text-gray-800 hover:bg-white hover:border-white transition-all duration-300 font-semibold px-8 py-3 shadow-xl"
          >
            <a 
              href="https://clcftl.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <ExternalLink className="w-5 h-5" />
              clcftl.org
            </a>
          </Button>

          <Button 
            asChild
            size="lg"
            className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white transition-all duration-300 font-semibold px-8 py-3 shadow-2xl"
          >
            <Link 
              to="/about"
              className="flex items-center gap-2"
            >
              <Info className="w-5 h-5" />
              About Us
            </Link>
          </Button>

          <Button 
            asChild
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white transition-all duration-300 font-semibold px-8 py-3 shadow-2xl"
          >
            <Link 
              to="/meet-the-team"
              className="flex items-center gap-2"
            >
              <Users className="w-5 h-5" />
              Meet the Team
            </Link>
          </Button>
        </div>

        {/* Haitian Spaghetti Order Section */}
        <div className="mt-16 max-w-2xl mx-auto">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border-2 border-orange-200">
            <h2 className="text-3xl md:text-4xl font-bold text-fire-gold mb-4">Order Haitian Spaghetti</h2>
            <p className="text-gray-700 text-lg mb-6">Support our ministry by ordering delicious homemade Haitian spaghetti!</p>
            
            <Dialog open={spaghettiFormOpen} onOpenChange={setSpaghettiFormOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="lg"
                  className="w-full bg-fire-gold hover:bg-fire-gold/90 text-white transition-all duration-300 font-semibold text-xl py-6 shadow-xl"
                >
                  Place Your Order
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Order Haitian Spaghetti</DialogTitle>
                  <DialogDescription>
                    Fill out the form below to place your order. We'll contact you soon!
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSpaghettiOrder} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Your full name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="(123) 456-7890" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input id="quantity" type="number" min="1" placeholder="Number of orders" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Special Instructions (Optional)</Label>
                    <Textarea id="notes" placeholder="Any dietary restrictions or special requests..." />
                  </div>
                  <Button type="submit" className="w-full bg-fire-gold hover:bg-fire-gold/90">
                    Submit Order
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
