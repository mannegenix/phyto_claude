import { z } from "zod";

/** Enquiry / sample-request fields (brief §7). Shared by the form and the server action. */
export const ENQUIRY_TYPES = ["Specifications", "Sample", "Quote"] as const;
export const TIMELINES = [
  "Immediate (within 30 days)",
  "1–3 months",
  "3–6 months",
  "Evaluating / no fixed date",
] as const;
export const UNITS = ["kg", "MT", "g (sample)"] as const;
export const SPEC_FILE_TYPES = [".pdf", ".doc", ".docx", ".xls", ".xlsx"];
export const SPEC_FILE_MAX_BYTES = 5 * 1024 * 1024;

export const enquirySchema = z.object({
  type: z.enum(ENQUIRY_TYPES),
  name: z.string().trim().min(2, "Enter your full name."),
  company: z.string().trim().min(2, "Enter your company name."),
  email: z.email("Enter a valid business email, e.g. name@company.com."),
  phone: z
    .string()
    .trim()
    .regex(/^\+\d[\d\s-]{6,}$/, "Start with + and the country code, e.g. +91 98xxx xxxxx."),
  country: z.string().trim().min(2, "Enter your country."),
  product: z.string().min(1, "Select a product."),
  grade: z.string().trim().max(300).optional().default(""),
  quantity: z.string().trim().min(1, "Enter the quantity you need."),
  unit: z.enum(UNITS),
  application: z.string().trim().max(120).optional().default(""),
  timeline: z.string().trim().max(60).optional().default(""),
  sample: z.enum(["Yes", "No"]),
  message: z.string().trim().max(4000).optional().default(""),
  consent: z.literal("on", { error: "Please confirm to continue." }),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

export type EnquiryState =
  | { status: "idle" }
  | { status: "error"; message?: string; fieldErrors?: Partial<Record<keyof EnquiryInput | "spec", string>> }
  | { status: "success"; reference: string; routedTo: string; name: string; email: string; productName: string };
