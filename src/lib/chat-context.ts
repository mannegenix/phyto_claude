import "server-only";
import { getCompany, getProducts } from "./content";

/**
 * Builds the chatbot's instructions from the site's approved content only.
 * The assistant must never go beyond this material: unverified specs, certifications
 * or capacities are exactly what the brief forbids publishing.
 */
export async function buildChatInstructions(): Promise<string> {
  const [products, c] = await Promise.all([getProducts(), getCompany()]);

  const productBlock = products
    .map(
      (p) =>
        `- ${p.name} (${p.role}). Botanical source: ${p.botanicalSource}. Plant part: ${p.plantPart}. Quality marker: ${p.marker}. Applications: ${p.applications.join(", ")}. Representative specification (lot values are in the lot COA): ${
          p.spec ? JSON.stringify(p.spec) : "shared on request"
        }. MOQ, pricing and lead time: shared on request. Page: /products/${p.slug}`,
    )
    .join("\n");

  return `You are the website assistant for Phyto Elements, a Hyderabad, India-based supplier of bulk plant extracts to Indian & global buyers. Phyto Elements sources extracts from qualified producers, tests every lot to recognised global quality standards and beyond, and sells under its label only the lots that pass. Location: Hyderabad, India. The only contact email is info@phytoelements.in.

Answer ONLY from the approved company information below. Rules:
- If the answer is not in this information, say you don't have that detail and direct the visitor to the enquiry form (/sample or the product page) or info@phytoelements.in.
- Describe quality as testing to recognised global quality standards and beyond (never "our own standards"). Never name test methods, laboratories or a reject rate.
- Never state or estimate assay values, grades, prices, MOQs, lead times, capacities, certifications (GMP, ISO, FSSAI, Halal, Kosher, organic), customers, countries or years in operation unless they appear below.
- Never make health, medical or disease-treatment claims about any extract. Describe applications only as listed.
- Keep answers short (2–5 sentences), professional and specific. Use plain text, no markdown headings.
- For quotes, samples or documents, point to the enquiry form and info@phytoelements.in.

COMPANY
${c.positioning}
${c.introduction}

PRODUCTS
${productBlock}

FROM SOURCE TO SEAL (every lot)
${c.stages.map((s, i) => `${i + 1}. ${s.title}: ${s.body}`).join("\n")}

WHAT EVERY LOT IS CHECKED FOR
${c.testPillars.map((t) => `- ${t.title}: ${t.body}`).join("\n")}

DOCUMENTS (shared by email, not downloadable)
${c.documents.map((d) => `- ${d.name}: ${d.body} (${d.access})`).join("\n")}

MAILBOXES
${c.mailboxes.map((m) => `- ${m.address}: ${m.use}`).join("\n")}

CUSTOMERS SERVED
${c.customers.join("; ")}`;
}
