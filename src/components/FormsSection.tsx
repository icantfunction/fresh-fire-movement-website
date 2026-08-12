import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { workshopRegistrationSchema, type WorkshopFormData } from "@/schemas/workshopSchema";
import { submitWorkshopRegistration } from "@/services/workshopService";

// One signup covers both dates: everyone registers, and the "do you plan to audition?"
// answer decides whether the audition agreement is required. Dates live here so the card
// heading and the requirements checklist can never drift apart.
const AUDITION = {
  auditionDate: "September 6, 2026",
  workshopDate: "September 13, 2026",
  /** Used inside the requirements checklist sentence. */
  startSentence:
    "Auditions are held September 6, 2026 in the main sanctuary. Arrive early — auditions begin promptly at the announced start time.",
};

const FormsSection = () => {
  const [auditionDialogOpen, setAuditionDialogOpen] = useState(false);
  const [pendingData, setPendingData] = useState<WorkshopFormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suppressPendingReset, setSuppressPendingReset] = useState(false);
  const [auditionChecklistOpen, setAuditionChecklistOpen] = useState(false);
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

  const form = useForm<WorkshopFormData>({
    resolver: zodResolver(workshopRegistrationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      yearsAtClc: 0,
      encounterCollide: "no",
      dateOfBirth: "",
      grade: "",
    },
  });

  const handleJoinGroup = () => {
    const url = "https://chat.whatsapp.com/J1eUD5DKl8q9K809mYlZxm?mode=ems_copy_t";
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) {
      newWindow.opener = null;
    }
  };

  const resetAuditionChecklist = () => {
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
    setAuditionChecklistOpen(false);
  };

  const handleAuditionCheckboxChange = (
    field: keyof typeof auditionConfirmations,
    checked: boolean
  ) => {
    setAuditionConfirmations((prev) => {
      const next = { ...prev, [field]: checked };
      if (field === "readAll" && !checked) {
        next.finalConfirmation = false;
      }
      return next;
    });

    if (field === "readAll") {
      setShowFinalConfirmation(checked);
    }
  };

  const allRequiredChecked = Object.entries(auditionConfirmations)
    .filter(([key]) => key !== "finalConfirmation")
    .every(([, value]) => value === true);
  const canProceedWithSubmission = allRequiredChecked && auditionConfirmations.finalConfirmation;

  const handleOpenAuditionDialog = (data: WorkshopFormData) => {
    setPendingData(data);
    setAuditionDialogOpen(true);
  };

  const submitRegistration = async (audition: boolean) => {
    if (!pendingData) return;

    setIsSubmitting(true);
    try {
      const response = await submitWorkshopRegistration({
        firstName: pendingData.firstName,
        lastName: pendingData.lastName,
        phoneNumber: pendingData.phoneNumber,
        yearsAtClc: pendingData.yearsAtClc,
        encounterCollide: pendingData.encounterCollide === "yes",
        dateOfBirth: pendingData.dateOfBirth,
        grade: pendingData.grade,
        audition,
      });

      toast({
        title: "Registration received!",
        description: `Thanks for registering. Confirmation ID: ${response.registrationId}`,
      });

      form.reset({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        yearsAtClc: 0,
        encounterCollide: "no",
        dateOfBirth: "",
        grade: "",
      });
      setPendingData(null);
      setAuditionDialogOpen(false);
      setSuppressPendingReset(false);
      resetAuditionChecklist();
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

  const handleAuditionChoice = (audition: boolean) => {
    if (audition) {
      setSuppressPendingReset(true);
      setAuditionDialogOpen(false);
      resetAuditionChecklist();
      setAuditionChecklistOpen(true);
      return;
    }

    submitRegistration(false);
  };

  const handleChecklistCancel = () => {
    resetAuditionChecklist();
    setPendingData(null);
    setSuppressPendingReset(false);
  };

  const handleChecklistSubmit = () => {
    if (!canProceedWithSubmission) return;
    submitRegistration(true);
  };

  return (
    <section id="audition-signup" className="relative py-24 px-4 scroll-mt-24 overflow-hidden bg-gradient-to-bl from-fire-deep via-[#1a0b2e] to-[#0f0820]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(124,58,237,0.3),transparent_55%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(245,158,11,0.1),transparent_60%)] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="h-px w-12 bg-fire-gold/60" />
            <span className="text-xs md:text-sm font-semibold tracking-[0.3em] text-fire-gold uppercase">
              Get Involved
            </span>
            <span className="h-px w-12 bg-fire-gold/60" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white">
            Connect with Fresh Fire
          </h2>
        </div>

        <div className="space-y-10">
          <Card className="relative p-6 md:p-8 bg-white shadow-[0_20px_60px_rgba(15,8,32,0.5)] border border-white/20">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-12 bg-fire-gold" />
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-black tracking-tight text-fire-deep mb-3">
                Audition &amp; Workshop Signup
              </h3>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-4 text-fire-gold font-semibold tracking-[0.15em] uppercase text-[11px]">
                <span>Auditions &middot; {AUDITION.auditionDate}</span>
                <span className="hidden sm:inline-block h-1 w-1 rounded-full bg-fire-gold/50" />
                <span>Workshop &middot; {AUDITION.workshopDate}</span>
              </div>
              <p className="mt-4 text-sm text-gray-600">
                Sign up once. We'll ask whether you plan to audition.
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleOpenAuditionDialog)} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="First name" autoComplete="given-name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Last name" autoComplete="family-name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="(555) 555-5555"
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="yearsAtClc"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Years at CLC</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            inputMode="numeric"
                            min={0}
                            step={1}
                            {...field}
                            onChange={(event) => field.onChange(event.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="encounterCollide"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Encounter/Collide (Y/N)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="grade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grade</FormLabel>
                        <FormControl>
                          <Input placeholder="Grade" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  variant="fire"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Audition Signup"
                  )}
                </Button>
              </form>
            </Form>
          </Card>

          <Card className="relative p-6 md:p-8 bg-white shadow-[0_20px_60px_rgba(15,8,32,0.5)] border border-white/20">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-12 bg-fire-gold" />
            <div className="text-center">
              <h3 className="text-2xl md:text-3xl font-black tracking-tight text-fire-deep mb-3">
                Join Our Fire
              </h3>
              <p className="text-gray-600 mb-8">
                Ready to become part of the Fresh Fire Dance Ministry family?
              </p>

              <Button
                onClick={handleJoinGroup}
                variant="gold"
                size="lg"
                className="w-full max-w-md mx-auto"
              >
                Join Our WhatsApp Group
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <Dialog
        open={auditionDialogOpen}
        onOpenChange={(open) => {
          if (!isSubmitting) {
            setAuditionDialogOpen(open);
            if (!open) {
              if (suppressPendingReset) {
                setSuppressPendingReset(false);
                return;
              }
              setPendingData(null);
            }
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Audition Question</DialogTitle>
            <DialogDescription>
              Do you plan to audition?
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              onClick={() => handleAuditionChoice(true)}
              className="bg-fire-purple hover:bg-fire-purple/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Yes
            </Button>
            <Button
              onClick={() => handleAuditionChoice(false)}
              variant="outline"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              No
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={auditionChecklistOpen}
        onOpenChange={(open) => {
          if (isSubmitting) return;
          if (open) {
            setAuditionChecklistOpen(true);
          } else {
            handleChecklistCancel();
          }
        }}
      >
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
                  id="audition-choreographed"
                  checked={auditionConfirmations.choreographed}
                  onCheckedChange={(checked) =>
                    handleAuditionCheckboxChange("choreographed", checked === true)
                  }
                />
                <Label htmlFor="audition-choreographed" className="text-sm leading-relaxed">
                  For the first portion of auditions, you will learn a choreographed piece with a group of dancers.
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="audition-interview"
                  checked={auditionConfirmations.interview}
                  onCheckedChange={(checked) =>
                    handleAuditionCheckboxChange("interview", checked === true)
                  }
                />
                <Label htmlFor="audition-interview" className="text-sm leading-relaxed">
                  The second part of your audition will be an individual interview by the judges.
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="audition-solo"
                  checked={auditionConfirmations.solo}
                  onCheckedChange={(checked) =>
                    handleAuditionCheckboxChange("solo", checked === true)
                  }
                />
                <Label htmlFor="audition-solo" className="text-sm leading-relaxed">
                  The last piece is a solo dance that you will need to prepare with timing around 30-60 seconds. This piece should be to any worship music of your choice and can be as creative as you like.
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="audition-timing"
                  checked={auditionConfirmations.timing}
                  onCheckedChange={(checked) =>
                    handleAuditionCheckboxChange("timing", checked === true)
                  }
                />
                <Label htmlFor="audition-timing" className="text-sm leading-relaxed">
                  {AUDITION.startSentence}
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="audition-attire"
                  checked={auditionConfirmations.attire}
                  onCheckedChange={(checked) =>
                    handleAuditionCheckboxChange("attire", checked === true)
                  }
                />
                <Label htmlFor="audition-attire" className="text-sm leading-relaxed">
                  Come dressed in loose fitting attire. You should wear a tee shirt (short or long sleeved), leggings or joggers. Make sure that your shirt covers your mid section so that when you lift your arms, no flesh is exposed.
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="audition-covering"
                  checked={auditionConfirmations.covering}
                  onCheckedChange={(checked) =>
                    handleAuditionCheckboxChange("covering", checked === true)
                  }
                />
                <Label htmlFor="audition-covering" className="text-sm leading-relaxed">
                  Please bring a shirt, scarf, or sweater to wrap around your waist to cover your bottom.
                </Label>
              </div>
            </div>

            <div className="text-lg font-semibold text-fire-purple mt-8 mb-4">
              Prerequisites of being in Fresh Fire:
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="audition-membership"
                  checked={auditionConfirmations.membership}
                  onCheckedChange={(checked) =>
                    handleAuditionCheckboxChange("membership", checked === true)
                  }
                />
                <Label htmlFor="audition-membership" className="text-sm leading-relaxed">
                  Are required to be active members of Christian Life Center and regularly attend worship services and give tithes and offerings.
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="audition-encounter"
                  checked={auditionConfirmations.encounter}
                  onCheckedChange={(checked) =>
                    handleAuditionCheckboxChange("encounter", checked === true)
                  }
                />
                <Label htmlFor="audition-encounter" className="text-sm leading-relaxed">
                  Have attended Encounter and completed School of Discipleship (under the director's discretion, dancer may minister while attending SOD).
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="audition-believer"
                  checked={auditionConfirmations.believer}
                  onCheckedChange={(checked) =>
                    handleAuditionCheckboxChange("believer", checked === true)
                  }
                />
                <Label htmlFor="audition-believer" className="text-sm leading-relaxed">
                  Every member of Fresh Fire Dance Ministry must be a believer and follower of Jesus Christ and has accepted Him as their personal Lord and Savior with baptism by immersion in water.
                </Label>
              </div>
            </div>

            <div className="border-t pt-6 mt-8">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="audition-readAll"
                  checked={auditionConfirmations.readAll}
                  onCheckedChange={(checked) =>
                    handleAuditionCheckboxChange("readAll", checked === true)
                  }
                />
                <Label htmlFor="audition-readAll" className="text-sm font-semibold">
                  I have read all the requirements above.
                </Label>
              </div>

              {showFinalConfirmation && (
                <div className="mt-4 p-4 bg-fire-gold/10 rounded-lg border border-fire-gold/30">
                  <div className="flex items-start space-x-3">
                    <Label htmlFor="audition-finalConfirmation" className="text-sm font-semibold flex-1">
                      Are you sure you read it and are in complete agreement?
                    </Label>
                    <Checkbox
                      id="audition-finalConfirmation"
                      checked={auditionConfirmations.finalConfirmation}
                      onCheckedChange={(checked) =>
                        handleAuditionCheckboxChange("finalConfirmation", checked === true)
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4 mt-8">
              <Button
                variant="outline"
                onClick={handleChecklistCancel}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleChecklistSubmit}
                disabled={!canProceedWithSubmission || isSubmitting}
                className="flex-1 bg-fire-gold hover:bg-fire-gold/90 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Registration"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default FormsSection;
