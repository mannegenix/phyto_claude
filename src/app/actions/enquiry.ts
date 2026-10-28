"use server";

import { Resend } from "resend";
import { getEnv } from "@/lib/env";
import { getProduct } from "@/lib/content";
import { enquirySchema, SPEC_FILE_MAX_BYTES, SPEC_FILE_TYPES, type EnquiryState } from "@/lib/enquiry-schema";

async function verifyTurnstile(token: FormDataEntryValue | null): Promise<boolean> {
  const env = getEnv();
  if (!env.TURNSTILE_SECRET_KEY) return true; // not configured (local dev)
  if (typeof token !== "string" || !token) return false;
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: token }),
  });
  const data = (await res.json()) as { success?: boolean };
  return Boolean(data.success);
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
}

/**
 * Handles enquiry / sample-request submissions:
 * validate → spam check → email sales@ (cc samples@ for sample requests) → optional CRM webhook.
 */
export async function submitEnquiry(_prev: EnquiryState, formData: FormData): Promise<EnquiryState> {
  const env = getEnv();
  // Honeypot: bots fill hidden fields.
  if (formData.get("website")) return { status: "error", message: "Submission blocked." };

  if (!(await verifyTurnstile(formData.get("cf-turnstile-response")))) {
    return { status: "error", message: "Spam check failed. Please refresh the page and try again." };
  }

  const parsed = enquirySchema.safeParse(Object.fromEntries(formData));
  const fieldErrors: Record<string, string> = {};
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      fieldErrors[key] ??= issue.message;
    }
  }

  const file = formData.get("spec");
  let attachment: { filename: string; content: Buffer } | undefined;
  if (file instanceof File && file.size > 0) {
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!SPEC_FILE_TYPES.includes(ext)) fieldErrors.spec = "Use a PDF, Word or Excel file.";
    else if (file.size > SPEC_FILE_MAX_BYTES)
      fieldErrors.spec = "File is over 5 MB. Please compress it or email it to sales@.";
    else attachment = { filename: file.name, content: Buffer.from(await file.arrayBuffer()) };
  }

  if (!parsed.success || Object.keys(fieldErrors).length) {
    return { status: "error", fieldErrors };
  }

  const data = parsed.data;
  const product = await getProduct(data.product);
  const productName = product?.name ?? "Other / multiple products";
  const reference = `PE-ENQ-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  const wantsSample = data.sample === "Yes" || data.type === "Sample";
  const to = [env.ENQUIRY_TO];
  const cc = wantsSample ? [env.SAMPLES_CC] : [];

  const rows: [string, string][] = [
    ["Reference", reference],
    ["Request", `${data.type}${wantsSample ? " + sample" : ""}`],
    ["Name", data.name],
    ["Company", data.company],
    ["Email", data.email],
    ["Phone / WhatsApp", data.phone],
    ["Country", data.country],
    ["Product", productName],
    ["Grade / specification", data.grade || "—"],
    ["Quantity", `${data.quantity} ${data.unit}`],
    ["Application", data.application || "—"],
    ["Timeline", data.timeline || "—"],
    ["Message", data.message || "—"],
  ];
  const html = `<h2>New website enquiry ${reference}</h2><table cellpadding="6">${rows
    .map(([k, v]) => `<tr><th align="left">${k}</th><td>${escapeHtml(v).replace(/\n/g, "<br>")}</td></tr>`)
    .join("")}</table>`;

  try {
    if (env.RESEND_API_KEY) {
      const resend = new Resend(env.RESEND_API_KEY);
      const { error } = await resend.emails.send({
        from: env.ENQUIRY_FROM,
        to,
        cc,
        replyTo: data.email,
        subject: `[${reference}] ${data.type} · ${productName} · ${data.company}`,
        html,
        attachments: attachment ? [attachment] : undefined,
      });
      if (error) throw new Error(error.message);
    } else {
      console.info("[enquiry] RESEND_API_KEY not set. Enquiry not emailed:", Object.fromEntries(rows));
    }

    if (env.CRM_WEBHOOK_URL) {
      await fetch(env.CRM_WEBHOOK_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ reference, ...data, productName, wantsSample, source: "website" }),
      });
    }
  } catch (err) {
    console.error("[enquiry] delivery failed", err);
    return { status: "error", message: "We couldn't send your enquiry. Please email sales@phytoelements.in directly." };
  }

  return {
    status: "success",
    reference,
    routedTo: [...to, ...cc].join(" + "),
    name: data.name,
    email: data.email,
    productName,
  };
}
