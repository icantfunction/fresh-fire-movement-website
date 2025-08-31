
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const FormsSection = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAuditionDialog, setShowAuditionDialog] = useState(false);
  const [pendingAuditionForm, setPendingAuditionForm] = useState<HTMLFormElement | null>(null);
  const [auditionConfirmations, setAuditionConfirmations] = useState({
    choreographed: false,
    interview: false,
    solo: false,
    timing: false,
    attire: false,
    covering: false,
    membership: false,
    encounter: false,
    believer: false,
    readAll: false,
    finalConfirmation: false,
  });
  const [showFinalConfirmation, setShowFinalConfirmation] = useState(false);
  
  const resetAuditionDialog = () => {
    setAuditionConfirmations({
      choreographed: false,
      interview: false,
      solo: false,
      timing: false,
      attire: false,
      covering: false,
      membership: false,
      encounter: false,
      believer: false,
      readAll: false,
      finalConfirmation: false,
    });
    setShowFinalConfirmation(false);
    setShowAuditionDialog(false);
    setPendingAuditionForm(null);
  };

  const handleAuditionCheckboxChange = (field: string, checked: boolean) => {
    setAuditionConfirmations(prev => ({
      ...prev,
      [field]: checked
    }));
    
    if (field === 'readAll' && checked) {
      setShowFinalConfirmation(true);
    } else if (field === 'readAll' && !checked) {
      setShowFinalConfirmation(false);
      setAuditionConfirmations(prev => ({
        ...prev,
        finalConfirmation: false
      }));
    }
  };

  const allRequiredChecked = Object.entries(auditionConfirmations)
    .filter(([key]) => key !== 'finalConfirmation')
    .every(([, value]) => value === true);

  const canProceedWithSubmission = allRequiredChecked && auditionConfirmations.finalConfirmation;

  const proceedWithAuditionSubmission = async () => {
    if (!pendingAuditionForm || !canProceedWithSubmission) return;
    
    setIsSubmitting(true);
    
    try {
      const formData = collectFormData(pendingAuditionForm, "audition application");
      
      const response = await fetch(getWebhookUrl("audition application"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify(formData),
      });

      toast({
        title: "Registration Successful!",
        description: "Your audition application has been submitted and sent to our team. We'll get back to you soon!",
      });

      // Reset form and dialog
      pendingAuditionForm.reset();
      resetAuditionDialog();
      
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
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-1 md:gap-0 mb-8 h-auto p-1">
            <TabsTrigger value="contact" className="text-xs md:text-sm px-2 py-3 md:px-3">
              <span className="hidden sm:inline">Collaboration</span>
              <span className="sm:hidden">Collab</span>
            </TabsTrigger>
            <TabsTrigger value="prayer" className="text-xs md:text-sm px-2 py-3 md:px-3">
              <span className="hidden sm:inline">Prayer Request</span>
              <span className="sm:hidden">Prayer</span>
            </TabsTrigger>
            <TabsTrigger value="newsletter" className="text-xs md:text-sm px-2 py-3 md:px-3">
              <span className="hidden sm:inline">Join Our Fire</span>
              <span className="sm:hidden">Join</span>
            </TabsTrigger>
            <TabsTrigger value="workshop" className="text-xs md:text-sm px-2 py-3 md:px-3">
              <span className="hidden sm:inline">Workshop Signup</span>
              <span className="sm:hidden">Workshop</span>
            </TabsTrigger>
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
              <form onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                setPendingAuditionForm(form);
                setShowAuditionDialog(true);
              }} className="space-y-6">
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

      {/* Audition Confirmation Dialog */}
      <Dialog open={showAuditionDialog} onOpenChange={(open) => {
        if (!open) {
          resetAuditionDialog();
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-fire-gold mb-4">
              Audition Requirements & Agreement
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="text-lg font-semibold text-fire-purple mb-4">
              Audition Breakdown:
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="choreographed" 
                  checked={auditionConfirmations.choreographed}
                  onCheckedChange={(checked) => handleAuditionCheckboxChange('choreographed', checked as boolean)}
                />
                <Label htmlFor="choreographed" className="text-sm leading-relaxed">
                  For the first portion of auditions, you will learn a choreographed piece with a group of dancers.
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="interview" 
                  checked={auditionConfirmations.interview}
                  onCheckedChange={(checked) => handleAuditionCheckboxChange('interview', checked as boolean)}
                />
                <Label htmlFor="interview" className="text-sm leading-relaxed">
                  The second part of your audition will be an individual interview by the judges.
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="solo" 
                  checked={auditionConfirmations.solo}
                  onCheckedChange={(checked) => handleAuditionCheckboxChange('solo', checked as boolean)}
                />
                <Label htmlFor="solo" className="text-sm leading-relaxed">
                  The last piece is a solo dance that you will need to prepare with timing around 30-60 second. This piece should be to any worship music of your choice and can be as creative as you like!
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="timing" 
                  checked={auditionConfirmations.timing}
                  onCheckedChange={(checked) => handleAuditionCheckboxChange('timing', checked as boolean)}
                />
                <Label htmlFor="timing" className="text-sm leading-relaxed">
                  Auditions will begin promptly at 2:00pm in the main sanctuary.
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="attire" 
                  checked={auditionConfirmations.attire}
                  onCheckedChange={(checked) => handleAuditionCheckboxChange('attire', checked as boolean)}
                />
                <Label htmlFor="attire" className="text-sm leading-relaxed">
                  Come dressed in loose fitting attire. You should wear a tee shirt (short or long sleeved), leggings or joggers. Make sure that your shirt covers your mid section so that when you lift your arms, no flesh is exposed.
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="covering" 
                  checked={auditionConfirmations.covering}
                  onCheckedChange={(checked) => handleAuditionCheckboxChange('covering', checked as boolean)}
                />
                <Label htmlFor="covering" className="text-sm leading-relaxed">
                  Please bring a shirt, scarf or sweater to wrap around your waist to cover your bottom!
                </Label>
              </div>
            </div>

            <div className="text-lg font-semibold text-fire-purple mt-8 mb-4">
              Prerequisites of being in FF:
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="membership" 
                  checked={auditionConfirmations.membership}
                  onCheckedChange={(checked) => handleAuditionCheckboxChange('membership', checked as boolean)}
                />
                <Label htmlFor="membership" className="text-sm leading-relaxed">
                  Are required to be active members of Christian Life Center and regularly attend worship services and give tithes/offerings
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="encounter" 
                  checked={auditionConfirmations.encounter}
                  onCheckedChange={(checked) => handleAuditionCheckboxChange('encounter', checked as boolean)}
                />
                <Label htmlFor="encounter" className="text-sm leading-relaxed">
                  Have attended Encounter and completed School of Discipleship (under the Director's discretion, dancer may minister while attending SOD)
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="believer" 
                  checked={auditionConfirmations.believer}
                  onCheckedChange={(checked) => handleAuditionCheckboxChange('believer', checked as boolean)}
                />
                <Label htmlFor="believer" className="text-sm leading-relaxed">
                  Every member of Fresh Fire Dance Ministry must be a believer and follower of Jesus Christ and has accepted Him as their personal Lord and Savior with baptism by immersion in water
                </Label>
              </div>
            </div>

            <div className="border-t pt-6 mt-8">
              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="readAll" 
                  checked={auditionConfirmations.readAll}
                  onCheckedChange={(checked) => handleAuditionCheckboxChange('readAll', checked as boolean)}
                />
                <Label htmlFor="readAll" className="text-sm font-semibold">
                  I have read all the requirements above
                </Label>
              </div>

              {showFinalConfirmation && (
                <div className="mt-4 p-4 bg-fire-gold/10 rounded-lg border border-fire-gold/30">
                  <div className="flex items-start space-x-3">
                    <Label htmlFor="finalConfirmation" className="text-sm font-semibold flex-1">
                      Are you sure you read it and are in complete agreement??
                    </Label>
                    <Checkbox 
                      id="finalConfirmation" 
                      checked={auditionConfirmations.finalConfirmation}
                      onCheckedChange={(checked) => handleAuditionCheckboxChange('finalConfirmation', checked as boolean)}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4 mt-8">
              <Button 
                variant="outline" 
                onClick={resetAuditionDialog}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={proceedWithAuditionSubmission}
                disabled={!canProceedWithSubmission || isSubmitting}
                className="flex-1 bg-fire-gold hover:bg-fire-gold/90 text-white"
              >
                {isSubmitting ? "Submitting Application..." : "Submit Audition Application"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default FormsSection;
