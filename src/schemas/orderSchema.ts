import { z } from "zod";

export const orderSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be less than 100 characters" }),
  phone: z
    .string()
    .trim()
    .min(1, { message: "Phone is required" })
    .max(20, { message: "Phone must be less than 20 characters" }),
  email: z
    .string()
    .trim()
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must be less than 255 characters" })
    .optional()
    .or(z.literal("")),
  quantity: z
    .number()
    .min(1, { message: "Quantity must be at least 1" })
    .max(50, { message: "Quantity cannot exceed 50" }),
  notes: z
    .string()
    .trim()
    .max(1000, { message: "Notes must be less than 1000 characters" })
    .optional(),
});

export type OrderFormData = z.infer<typeof orderSchema>;
