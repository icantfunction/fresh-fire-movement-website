import { useState, type FormEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExternalLink, Loader2, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

// This form is audition-only, so the date lives here once and feeds both the card heading
// and the requirements checklist.
const AUDITION = {
  date: "September 20, 2026",
  time: "2:00 PM Sharp",
  /** Used inside the requirements checklist sentence. */
  startSentence:
    "Auditions begin at 2:00 PM SHARP on September 20, 2026 in the main sanctuary. Arrive early — late arrivals may not be seen.",
};

// Workshop registration is handled off-site by the church's Pushpay giving page, so this
// card is a link out rather than a form — nothing about it touches our API.
const WORKSHOP = {
  date: "September 13, 2026",
  time: "2:00 PM Sharp",
  minimum: "$10",
  registerUrl:
    "https://pushpay.com/g/clcftl?fnd=wES1hrvpPMplmZ1Tt2EQtA&fndv=Lock&lang=en&src=qrcode",
};

const MINISTRY_EMAIL = "ffdanceministry@gmail.com";
const MAX_MAILTO_URI_LENGTH = 1800;
const MAX_DANCE_PIECES = 50;
const MINISTRY_REQUEST_FIELDS = {
  contactName: "contactName",
  contactEmail: "contactEmail",
  contactPhone: "contactPhone",
  eventDate: "eventDate",
  location: "location",
  church: "church",
  theme: "theme",
  scripture: "scripture",
  serviceFormat: "serviceFormat",
  dancePieces: "dancePieces",
  ministryPreference: "ministryPreference",
  roomRestrictions: "roomRestrictions",
  additionalInformation: "additionalInformation",
} as const;
type MinistryRequestField = (typeof MINISTRY_REQUEST_FIELDS)[keyof typeof MINISTRY_REQUEST_FIELDS];

const REQUIRED_MINISTRY_REQUEST_FIELDS: MinistryRequestField[] = [
  MINISTRY_REQUEST_FIELDS.contactName,
  MINISTRY_REQUEST_FIELDS.contactEmail,
  MINISTRY_REQUEST_FIELDS.eventDate,
  MINISTRY_REQUEST_FIELDS.location,
  MINISTRY_REQUEST_FIELDS.church,
  MINISTRY_REQUEST_FIELDS.theme,
  MINISTRY_REQUEST_FIELDS.scripture,
  MINISTRY_REQUEST_FIELDS.serviceFormat,
  MINISTRY_REQUEST_FIELDS.dancePieces,
  MINISTRY_REQUEST_FIELDS.ministryPreference,
  MINISTRY_REQUEST_FIELDS.roomRestrictions,
];

const getLocalDateInputValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const FormsSection = () => {
  const [pendingData, setPendingData] = useState<WorkshopFormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  const [ministryRequestDraft, setMinistryRequestDraft] = useState<string | null>(null);

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

  const handleMinistryRequestSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const requestForm = event.currentTarget;
    const data = new FormData(requestForm);
    const value = (name: MinistryRequestField) => String(data.get(name) || "").trim();
    const firstBlankRequiredField = REQUIRED_MINISTRY_REQUEST_FIELDS.find(
      (name) => !value(name)
    );

    if (firstBlankRequiredField) {
      const field = requestForm.elements.namedItem(firstBlankRequiredField);
      if (field instanceof HTMLElement) field.focus();
      toast({
        title: "Please complete every required field",
        description: "Required answers cannot contain only spaces.",
        variant: "destructive",
      });
      return;
    }

    const contactName = value(MINISTRY_REQUEST_FIELDS.contactName);
    const church = value(MINISTRY_REQUEST_FIELDS.church);
    const eventDate = value(MINISTRY_REQUEST_FIELDS.eventDate);
    const minimumMinistryRequestDate = getLocalDateInputValue(new Date());
    if (eventDate < minimumMinistryRequestDate) {
      const field = requestForm.elements.namedItem(MINISTRY_REQUEST_FIELDS.eventDate);
      if (field instanceof HTMLElement) field.focus();
      toast({
        title: "Choose an upcoming date",
        description: "Ministry requests must be for today or a future date.",
        variant: "destructive",
      });
      return;
    }

    const dancePieces = Number(value(MINISTRY_REQUEST_FIELDS.dancePieces));
    if (!Number.isInteger(dancePieces) || dancePieces < 1 || dancePieces > MAX_DANCE_PIECES) {
      const field = requestForm.elements.namedItem(MINISTRY_REQUEST_FIELDS.dancePieces);
      if (field instanceof HTMLElement) field.focus();
      toast({
        title: "Check the number of dance pieces",
        description: `Enter a whole number from 1 to ${MAX_DANCE_PIECES}.`,
        variant: "destructive",
      });
      return;
    }

    const subject = `Ministry Request: ${church} — ${eventDate}`;
    const body = [
      "Thank you for the opportunity to minister at your upcoming service!",
      "",
      "CONTACT INFORMATION",
      `Name: ${contactName}`,
      `Email: ${value(MINISTRY_REQUEST_FIELDS.contactEmail)}`,
      `Phone: ${value(MINISTRY_REQUEST_FIELDS.contactPhone) || "Not provided"}`,
      "",
      "SERVICE DETAILS",
      `Date: ${eventDate}`,
      `Location: ${value(MINISTRY_REQUEST_FIELDS.location)}`,
      `Affiliated church: ${church}`,
      `Theme: ${value(MINISTRY_REQUEST_FIELDS.theme)}`,
      `Scripture: ${value(MINISTRY_REQUEST_FIELDS.scripture)}`,
      `General format of the service: ${value(MINISTRY_REQUEST_FIELDS.serviceFormat)}`,
      `Number of dance pieces requested: ${dancePieces}`,
      `Ministry preference: ${value(MINISTRY_REQUEST_FIELDS.ministryPreference)}`,
      `Room size or setup restrictions: ${value(MINISTRY_REQUEST_FIELDS.roomRestrictions) || "None provided"}`,
      "",
      `Additional information: ${value(MINISTRY_REQUEST_FIELDS.additionalInformation) || "None provided"}`,
    ].join("\r\n");

    setMinistryRequestDraft(`Subject: ${subject}\r\n\r\n${body}`);

    const mailtoUrl = `mailto:${MINISTRY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    if (mailtoUrl.length > MAX_MAILTO_URI_LENGTH) {
      toast({
        title: "Request ready to copy",
        description: `The request is too long for a reliable email link. Copy the details below and email them to ${MINISTRY_EMAIL}.`,
        variant: "destructive",
      });
      return;
    }

    window.location.href = mailtoUrl;

    toast({
      title: "Email draft prepared",
      description: `If no draft appears, copy the request details below and email them to ${MINISTRY_EMAIL}.`,
    });
  };

  const handleCopyMinistryRequest = async () => {
    if (!ministryRequestDraft) return;

    try {
      await navigator.clipboard.writeText(ministryRequestDraft);
      toast({
        title: "Request details copied",
        description: `Paste them into an email addressed to ${MINISTRY_EMAIL}.`,
      });
    } catch {
      toast({
        title: "Copy failed",
        description: `Select the generated request below and email it to ${MINISTRY_EMAIL}.`,
        variant: "destructive",
      });
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

  // Everyone using this form is auditioning, so a valid submit goes straight to the
  // requirements agreement rather than asking whether they intend to audition.
  const handleOpenAuditionDialog = (data: WorkshopFormData) => {
    setPendingData(data);
    resetAuditionChecklist();
    setAuditionChecklistOpen(true);
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

  const handleChecklistCancel = () => {
    resetAuditionChecklist();
    setPendingData(null);
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
            <div className="text-center">
              <h3 className="text-2xl md:text-3xl font-black tracking-tight text-fire-deep mb-2">
                Workshop Registration
              </h3>
              <p className="text-fire-gold font-semibold tracking-[0.2em] uppercase text-xs">
                {WORKSHOP.date} &middot; {WORKSHOP.time}
              </p>

              <p className="mt-4 text-gray-600">
                Register through Christian Life Center's giving page.
                {" "}
                <span className="font-semibold text-fire-deep">
                  {WORKSHOP.minimum} minimum donation
                </span>{" "}
                to attend.
              </p>

              <Button asChild variant="fire" size="lg" className="mt-6 w-full max-w-md mx-auto">
                <a href={WORKSHOP.registerUrl} target="_blank" rel="noopener noreferrer">
                  Register for the Workshop
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>

              <p className="mt-3 text-xs text-gray-500">
                Opens Pushpay in a new tab
              </p>
            </div>
          </Card>

          <Card className="relative p-6 md:p-8 bg-white shadow-[0_20px_60px_rgba(15,8,32,0.5)] border border-white/20">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-12 bg-fire-gold" />
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-black tracking-tight text-fire-deep mb-2">
                Audition Signup
              </h3>
              <p className="text-fire-gold font-semibold tracking-[0.2em] uppercase text-xs">
                {AUDITION.date} &middot; {AUDITION.time}
              </p>
              <p className="mt-4 text-sm text-gray-600">
                You'll review and agree to the audition requirements before your signup is
                submitted.
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

          <Card className="relative p-6 md:p-8 bg-white shadow-[0_20px_60px_rgba(15,8,32,0.5)] border border-white/20">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-12 bg-fire-gold" />
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-black tracking-tight text-fire-deep mb-3">
                Invite Fresh Fire to Minister
              </h3>
              <p className="text-gray-700 font-medium">
                Thank you for the opportunity to minister at your upcoming service!
              </p>
              <p className="mt-3 text-sm text-gray-600 max-w-2xl mx-auto">
                In order for us to prepare, kindly share the following details. With this initial
                information, we'll prayerfully review your request and respond with our availability.
              </p>
            </div>

            <form
              onSubmit={handleMinistryRequestSubmit}
              onChange={() => setMinistryRequestDraft(null)}
              className="space-y-6"
            >
              <fieldset className="space-y-4">
                <legend className="text-lg font-bold text-fire-deep mb-4">
                  Your Contact Information
                </legend>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="ministry-contact-name">Name</Label>
                    <Input
                      id="ministry-contact-name"
                      name={MINISTRY_REQUEST_FIELDS.contactName}
                      autoComplete="name"
                      placeholder="Your full name"
                      maxLength={100}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ministry-contact-email">Email</Label>
                    <Input
                      id="ministry-contact-email"
                      name={MINISTRY_REQUEST_FIELDS.contactEmail}
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      maxLength={254}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ministry-contact-phone">Phone Number (optional)</Label>
                  <Input
                    id="ministry-contact-phone"
                    name={MINISTRY_REQUEST_FIELDS.contactPhone}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="(555) 555-5555"
                    maxLength={32}
                  />
                </div>
              </fieldset>

              <fieldset className="space-y-4 border-t border-gray-200 pt-6">
                <legend className="text-lg font-bold text-fire-deep mb-4">
                  Service Details
                </legend>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="ministry-event-date">Date</Label>
                    <Input
                      id="ministry-event-date"
                      name={MINISTRY_REQUEST_FIELDS.eventDate}
                      type="date"
                      min={getLocalDateInputValue(new Date())}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ministry-location">Location</Label>
                    <Input
                      id="ministry-location"
                      name={MINISTRY_REQUEST_FIELDS.location}
                      placeholder="Venue name and address"
                      maxLength={200}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ministry-church">Affiliated Church</Label>
                  <Input
                    id="ministry-church"
                    name={MINISTRY_REQUEST_FIELDS.church}
                    placeholder="Church or ministry name"
                    maxLength={150}
                    required
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="ministry-theme">Theme</Label>
                    <Input
                      id="ministry-theme"
                      name={MINISTRY_REQUEST_FIELDS.theme}
                      placeholder="Service or event theme"
                      maxLength={160}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ministry-scripture">Scripture</Label>
                    <Input
                      id="ministry-scripture"
                      name={MINISTRY_REQUEST_FIELDS.scripture}
                      placeholder="Book, chapter, and verse"
                      maxLength={160}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ministry-service-format">General Format of the Service</Label>
                  <Textarea
                    id="ministry-service-format"
                    name={MINISTRY_REQUEST_FIELDS.serviceFormat}
                    placeholder="Describe the order of service and where the dance ministry would participate."
                    className="min-h-28 text-base md:text-sm"
                    maxLength={1200}
                    required
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="ministry-dance-pieces">Number of Dance Pieces Requested</Label>
                    <Input
                      id="ministry-dance-pieces"
                      name={MINISTRY_REQUEST_FIELDS.dancePieces}
                      type="number"
                      inputMode="numeric"
                      min={1}
                      max={MAX_DANCE_PIECES}
                      step={1}
                      placeholder="1"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ministry-preference">Ministry Preference</Label>
                    <select
                      id="ministry-preference"
                      name={MINISTRY_REQUEST_FIELDS.ministryPreference}
                      defaultValue=""
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm"
                      required
                    >
                      <option value="" disabled>
                        Select a preference
                      </option>
                      <option value="Adult ministry">Adult ministry</option>
                      <option value="Youth ministry">Youth ministry</option>
                      <option value="Collaborative piece">Collaborative piece</option>
                      <option value="No preference">No preference</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ministry-room-restrictions">
                    Room Size or Setup Restrictions
                  </Label>
                  <Textarea
                    id="ministry-room-restrictions"
                    name={MINISTRY_REQUEST_FIELDS.roomRestrictions}
                    placeholder="Describe the available floor or stage, entrances, ceiling height, or enter None."
                    className="min-h-24 text-base md:text-sm"
                    maxLength={800}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ministry-additional-information">
                    Additional Information (optional)
                  </Label>
                  <Textarea
                    id="ministry-additional-information"
                    name={MINISTRY_REQUEST_FIELDS.additionalInformation}
                    placeholder="Share any other details that would help us prayerfully review your request."
                    className="min-h-24 text-base md:text-sm"
                    maxLength={1200}
                  />
                </div>
              </fieldset>

              <Button type="submit" variant="fire" size="lg" className="w-full">
                <Mail className="mr-2 h-4 w-4" />
                Email Ministry Request
              </Button>
              {ministryRequestDraft && (
                <div className="space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={handleCopyMinistryRequest}
                  >
                    Copy Request Details
                  </Button>
                  <Textarea
                    aria-label="Generated ministry request"
                    readOnly
                    value={ministryRequestDraft}
                    className="min-h-48 text-base md:text-sm"
                  />
                </div>
              )}
              <p className="text-center text-xs text-gray-500">
                This opens your email app with your answers addressed to {MINISTRY_EMAIL}.
                Your information is not stored on this website.
              </p>
            </form>
          </Card>
        </div>
      </div>

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
