
import { useState, useEffect } from 'react';
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
  
  const getWebhookUrl = (formType: string) => {
    switch (formType) {
      case "audition application":
        return "https://hooks.zapier.com/hooks/catch/23791564/uhfg52w/";
      case "workshop signup":
        return "https://hooks.zapier.com/hooks/catch/23791564/uhfwx7o/";
      default:
        return "https://hooks.zapier.com/hooks/catch/23791564/uhfwx7o/";
    }
  };

  const collectFormData = (form: HTMLFormElement, formType: string) => {
    const formData = new FormData(form);
    const data: Record<string, any> = {
      formType,
      timestamp: new Date().toISOString(),
      source: window.location.origin,
    };

    // Convert FormData to object
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }

    // Handle checkboxes explicitly to ensure they always send a value
    const checkboxes = form.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      const input = checkbox as HTMLInputElement;
      const fieldName = input.name || input.id;
      data[fieldName] = input.checked;
    });

    return data;
  };

  const handleSubmit = async (e: React.FormEvent, formType: string) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const form = e.target as HTMLFormElement;
    
    try {
      const formData = collectFormData(form, formType);
      
      const response = await fetch(getWebhookUrl(formType), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify(formData),
      });

      toast({
        title: "Registration Successful!",
        description: `Your ${formType} has been submitted and sent to our team. We'll get back to you soon!`,
      });

      // Reset form
      form.reset();
      
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Submission Error",
        description: "There was an issue submitting your form. Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-fire-gradient">
          Connect with Fresh Fire
        </h2>
        
        <Tabs defaultValue="workshop" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="contact">Collaboration</TabsTrigger>
            <TabsTrigger value="prayer">Prayer Request</TabsTrigger>
            <TabsTrigger value="newsletter">Join Our Fire</TabsTrigger>
            <TabsTrigger value="workshop">Workshop Signup</TabsTrigger>
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
                    <Input id="audition-name" name="fullName" placeholder="Your full name" required />
                  </div>
                  <div>
                    <Label htmlFor="audition-dob">Date of Birth *</Label>
                    <Input id="audition-dob" name="dateOfBirth" type="date" required />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="audition-email">Email Address *</Label>
                  <Input id="audition-email" name="email" type="email" placeholder="your@email.com" required />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="baptized" name="baptized" />
                    <Label htmlFor="baptized" className="text-sm">
                      I have been baptized
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox id="believer" name="believer" />
                    <Label htmlFor="believer" className="text-sm">
                      I am a believer in Jesus Christ
                    </Label>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="clc-years">How many years have you been attending CLC? *</Label>
                  <Select name="clcYears" required>
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
                  <Checkbox id="encounter-youth-camp" name="encounteredYouthCamp" />
                  <Label htmlFor="encounter-youth-camp" className="text-sm">
                    I have attended Encounter or Youth Camp
                  </Label>
                </div>
                
                <div>
                  <Label htmlFor="sod-level">Last level of SOD completed *</Label>
                  <Select name="sodLevel" required>
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
          
          <TabsContent value="workshop">
            <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl border border-purple-200">
              <form onSubmit={(e) => handleSubmit(e, "workshop signup")} className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-fire-gold mb-2">Workshop Signup</h3>
                  <p className="text-gray-600">Register for our upcoming dance workshop.</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="workshop-name">Full Name *</Label>
                    <Input id="workshop-name" name="fullName" placeholder="Your full name" required />
                  </div>
                  <div>
                    <Label htmlFor="workshop-age">Age *</Label>
                    <Input id="workshop-age" name="age" type="number" placeholder="Your age" required />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="workshop-email">Email Address *</Label>
                    <Input id="workshop-email" name="email" type="email" placeholder="your@email.com" required />
                  </div>
                  <div>
                    <Label htmlFor="workshop-phone">Phone Number *</Label>
                    <Input id="workshop-phone" name="phone" type="tel" placeholder="(555) 123-4567" required />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="workshop-zip">Zip Code *</Label>
                    <Input id="workshop-zip" name="zipCode" placeholder="12345" required />
                  </div>
                  <div>
                    <Label htmlFor="workshop-sod">Last SOD Level Finished *</Label>
                    <Select name="sodLevel" required>
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
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="workshop-tshirt">T-Shirt Size *</Label>
                    <Select name="tshirtSize" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="xs">XS</SelectItem>
                        <SelectItem value="s">S</SelectItem>
                        <SelectItem value="m">M</SelectItem>
                        <SelectItem value="l">L</SelectItem>
                        <SelectItem value="xl">XL</SelectItem>
                        <SelectItem value="2xl">2XL</SelectItem>
                        <SelectItem value="3xl">3XL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="workshop-instagram">Instagram Handle</Label>
                    <Input id="workshop-instagram" name="instagramHandle" placeholder="@yourusername" />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="emergency-contact-name">Emergency Contact Name *</Label>
                    <Input id="emergency-contact-name" name="emergencyContactName" placeholder="Full name" required />
                  </div>
                  <div>
                    <Label htmlFor="emergency-contact-phone">Emergency Contact Phone *</Label>
                    <Input id="emergency-contact-phone" name="emergencyContactPhone" type="tel" placeholder="(555) 123-4567" required />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="years-dancing">Years Dancing Prior *</Label>
                  <Select name="yearsDancing" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select years" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">No prior experience</SelectItem>
                      <SelectItem value="1-2">1-2 years</SelectItem>
                      <SelectItem value="3-5">3-5 years</SelectItem>
                      <SelectItem value="6-10">6-10 years</SelectItem>
                      <SelectItem value="more-than-10">More than 10 years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="injury-medical">Injury & Medical Notes</Label>
                  <Textarea 
                    id="injury-medical" 
                    name="injuryMedicalNotes"
                    placeholder="Please list any injuries, medical conditions, or physical limitations we should be aware of..." 
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="additional-notes">Additional Notes</Label>
                  <Textarea 
                    id="additional-notes" 
                    name="additionalNotes"
                    placeholder="Any additional information you'd like us to know..." 
                    rows={3}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-fire-gold hover:bg-fire-gold/90 text-white transition-all duration-300 font-semibold"
                >
                  {isSubmitting ? "Registering..." : "Register for Workshop"}
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
