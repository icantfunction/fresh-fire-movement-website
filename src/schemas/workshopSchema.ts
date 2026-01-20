import { z } from "zod";

export const workshopRegistrationSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, { message: "First name is required" })
    .max(50, { message: "First name must be less than 50 characters" }),
  lastName: z
    .string()
    .trim()
    .min(1, { message: "Last name is required" })
    .max(50, { message: "Last name must be less than 50 characters" }),
  phoneNumber: z
    .string()
    .trim()
    .min(1, { message: "Phone number is required" })
    .max(20, { message: "Phone number must be less than 20 characters" }),
  yearsAtClc: z.coerce
    .number()
    .min(0, { message: "Years at CLC must be 0 or more" })
    .max(100, { message: "Years at CLC must be less than 100" }),
  encounterCollide: z.enum(["yes", "no"], {
    required_error: "Please select yes or no",
  }),
  dateOfBirth: z
    .string()
    .trim()
    .min(1, { message: "Date of birth is required" }),
  grade: z
    .string()
    .trim()
    .min(1, { message: "Grade is required" })
    .max(50, { message: "Grade must be less than 50 characters" }),
});

export type WorkshopFormData = z.infer<typeof workshopRegistrationSchema>;
