import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Instagram, ExternalLink, Info, Users, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { orderSchema, type OrderFormData } from "@/schemas/orderSchema";
import { submitSpaghettiOrder } from "@/services/orderService";
import { toast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const HeroSection = () => {
  const [spaghettiFormOpen, setSpaghettiFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      quantity: 1,
    },
  });

  const handleSpaghettiOrder = async (data: OrderFormData) => {
    setIsSubmitting(true);
    
    try {
      const response = await submitSpaghettiOrder({
        name: data.name,
        phone: data.phone,
        email: data.email || undefined,
        quantity: data.quantity,
      });

      toast({
        title: "Order received!",
        description: `We'll confirm your order soon. Order ID: ${response.orderId}`,
      });

      form.reset();
      setTimeout(() => setSpaghettiFormOpen(false), 2000);
    } catch (error) {
      if (error instanceof Error && error.message.includes("Failed to fetch")) {
        toast({
          title: "Network error",
          description: "Unable to connect. Please check your internet and try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Something went wrong",
          description: "Please try again or contact us directly.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
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
      </div>
    </section>
  );
};

export default HeroSection;
