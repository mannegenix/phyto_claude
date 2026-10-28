import "server-only";
import { z } from "zod";

/**
 * Server-side environment. Every integration is optional in development:
 * when a key is missing the feature degrades gracefully (logged instead of sent).
 * See .env.example for the full list.
 */
const schema = z.object({
  RESEND_API_KEY: z.string().optional(),
  ENQUIRY_FROM: z.string().default("Phyto Elements Website <website@phytoelements.in>"),
  ENQUIRY_TO: z.string().default("sales@phytoelements.in"),
  SAMPLES_CC: z.string().default("samples@phytoelements.in"),
  TURNSTILE_SECRET_KEY: z.string().optional(),
  CRM_WEBHOOK_URL: z.url().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  CHAT_MODEL: z.string().default("claude-haiku-5-5"),
});

export const env = schema.parse({
  RESEND_API_KEY: process.env.RESEND_API_KEY || undefined,
  ENQUIRY_FROM: process.env.ENQUIRY_FROM || undefined,
  ENQUIRY_TO: process.env.ENQUIRY_TO || undefined,
  SAMPLES_CC: process.env.SAMPLES_CC || undefined,
  TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY || undefined,
  CRM_WEBHOOK_URL: process.env.CRM_WEBHOOK_URL || undefined,
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || undefined,
  CHAT_MODEL: process.env.CHAT_MODEL || undefined,
});
