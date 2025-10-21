import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const FormsSection = () => {
  const [spaghettiFormOpen, setSpaghettiFormOpen] = useState(false);

  const handleSpaghettiOrder = (e: React.FormEvent) => {
    e.preventDefault();
    // Will be connected to DynamoDB soon
    setSpaghettiFormOpen(false);
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-fire-gradient">
          Connect with Fresh Fire
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6 w-full">
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

          <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl border border-purple-200">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-fire-gold mb-4">Order Haitian Spaghetti</h3>
              <p className="text-gray-600 mb-8">Support our ministry by ordering delicious homemade Haitian spaghetti!</p>
              
              <Dialog open={spaghettiFormOpen} onOpenChange={setSpaghettiFormOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="w-full max-w-md mx-auto bg-fire-gold hover:bg-fire-gold/90 text-white transition-all duration-300 font-semibold text-lg py-4"
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
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="your@email.com" required />
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
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FormsSection;
