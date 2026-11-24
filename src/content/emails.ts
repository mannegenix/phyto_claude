/**
 * Automatic reply sent to people who submit an enquiry (client chose Option B,
 * "Copy for your records", 24 Nov 2026). No response times are promised.
 */
export const enquiryAck = {
  /** Opening line after the greeting; {request} becomes "sample request", "quote request" … */
  intro: "Thank you for your {request}. Here is a copy of what you sent us, for your records.",
  /** Shown after the table; {reference} is bolded in the HTML version. */
  next: "Our team will reply from info@phytoelements.in. To correct or add details, reply to this email and keep {reference} in the subject.",
  signOff: "Phyto Elements",
  footer: "You are receiving this because you sent an enquiry through our website.",
  requestNames: {
    Specifications: "request for specifications",
    Sample: "sample request",
    Quote: "quote request",
  } as Record<string, string>,
};
