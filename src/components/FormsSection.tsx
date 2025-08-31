
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const FormsSection = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent, formType: string) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Form Submitted",
        description: `Your ${formType} has been received. We'll get back to you soon!`,
      });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-fire-gradient">
          Connect with Fresh Fire
        </h2>
        
        <Tabs defaultValue="contact" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="contact">Collaboration</TabsTrigger>
            <TabsTrigger value="prayer">Prayer Request</TabsTrigger>
            <TabsTrigger value="newsletter">Join Our Fire</TabsTrigger>
          </TabsList>
          
          <TabsContent value="contact">
            <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl border border-purple-200">
              <form onSubmit={(e) => handleSubmit(e, "collaboration inquiry")} className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-fire-purple mb-2">Ministry Collaboration</h3>
                  <p className="text-gray-600">Ready to join the fire or collaborate with our ministry?</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Your name" required />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="your@email.com" required />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="(555) 123-4567" />
                </div>
                
                <div>
                  <Label htmlFor="interest">Area of Interest</Label>
                  <Input id="interest" placeholder="Dance ministry, collaboration, etc." />
                </div>
                
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Tell us about your heart for worship through movement..." 
                    rows={4}
                    required 
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full fire-gradient text-white hover:opacity-90 transition-all duration-300 font-semibold"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="prayer">
            <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl border border-purple-200">
              <form onSubmit={(e) => handleSubmit(e, "prayer request")} className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-fire-magenta mb-2">Prayer Request</h3>
                  <p className="text-gray-600">We believe in the power of prayer. Share your heart with us.</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="prayer-name">Name (Optional)</Label>
                    <Input id="prayer-name" placeholder="Your name" />
                  </div>
                  <div>
                    <Label htmlFor="prayer-email">Email (Optional)</Label>
                    <Input id="prayer-email" type="email" placeholder="your@email.com" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="prayer-request">Prayer Request</Label>
                  <Textarea 
                    id="prayer-request" 
                    placeholder="Share your prayer request with us..." 
                    rows={5}
                    required 
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-fire-magenta hover:bg-fire-magenta/90 text-white transition-all duration-300 font-semibold"
                >
                  {isSubmitting ? "Submitting..." : "Submit Prayer Request"}
                </Button>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="newsletter">
            <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl border border-purple-200">
              <form onSubmit={(e) => handleSubmit(e, "audition application")} className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-fire-gold mb-2">Join Our Fire - Audition Form</h3>
                  <p className="text-gray-600">Apply to become part of the Fresh Fire Dance Ministry family.</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="audition-name">Full Name *</Label>
                    <Input id="audition-name" placeholder="Your full name" required />
                  </div>
                  <div>
                    <Label htmlFor="audition-dob">Date of Birth *</Label>
                    <Input id="audition-dob" type="date" required />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="audition-email">Email Address *</Label>
                  <Input id="audition-email" type="email" placeholder="your@email.com" required />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="baptized" />
                    <Label htmlFor="baptized" className="text-sm">
                      I have been baptized
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox id="believer" />
                    <Label htmlFor="believer" className="text-sm">
                      I am a believer in Jesus Christ
                    </Label>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="clc-years">How many years have you been attending CLC? *</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select years" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="less-than-1">Less than 1 year</SelectItem>
                      <SelectItem value="1-2">1-2 years</SelectItem>
                      <SelectItem value="3-5">3-5 years</SelectItem>
                      <SelectItem value="6-10">6-10 years</SelectItem>
                      <SelectItem value="more-than-10">More than 10 years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="encounter-youth-camp" />
                  <Label htmlFor="encounter-youth-camp" className="text-sm">
                    I have attended Encounter or Youth Camp
                  </Label>
                </div>
                
                <div>
                  <Label htmlFor="sod-level">Last level of SOD completed *</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select SOD level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sod-1">SOD 1</SelectItem>
                      <SelectItem value="sod-2">SOD 2</SelectItem>
                      <SelectItem value="sod-3">SOD 3</SelectItem>
                      <SelectItem value="none">None completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-fire-gold hover:bg-fire-gold/90 text-white transition-all duration-300 font-semibold"
                >
                  {isSubmitting ? "Submitting Application..." : "Submit Audition Application"}
                </Button>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default FormsSection;
