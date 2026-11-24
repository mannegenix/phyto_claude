import { siteConfig } from "@/config/site";
import { getCompany, getProducts } from "@/lib/content";

/**
 * /llms.txt: a plain-text summary of the company and its range for AI assistants
 * (llmstxt.org format). Built at build time from the same content as the pages, so it
 * never says more than the site does.
 */
export const dynamic = "force-static";

/** Marker names are lowercase in running text; acronyms ("HCA …") stay as they are. */
const lowerFirst = (t: string) => (/^[A-Z][A-Z]/.test(t) ? t : t.charAt(0).toLowerCase() + t.slice(1));

export async function GET() {
  const [products, c] = await Promise.all([getProducts(), getCompany()]);
  const u = siteConfig.url;
  const lines = [
    `# ${siteConfig.name}`,
    "",
    `> ${c.positioning}`,
    "",
    `${siteConfig.name} is based in Hyderabad, India, and supplies Indian & Global buyers: ingredient distributors, nutraceutical companies, formulators and contract manufacturers. Every lot is tested to recognised global quality standards; only lots that pass carry the ${siteConfig.name} name. Specifications, samples, Certificates of Analysis and quotations: info@phytoelements.in.`,
    "",
    "## Products",
    "",
    ...products.map(
      (p) =>
        `- [${p.name}](${u}/products/${p.slug}): ${p.botanicalSource}, ${p.plantPart.toLowerCase()}; marker ${lowerFirst(p.marker.split(",")[0])}. ${p.applicationArea}.`,
    ),
    "",
    "## Company",
    "",
    `- [About](${u}/about): who we are and the team's background`,
    `- [Manufacturing & Quality](${u}/manufacturing): specifications and lot testing`,
    `- [How we work](${u}/operations): from specification to release and fulfilment`,
    `- [Request a Sample](${u}/sample)`,
    `- [Contact](${u}/contact): info@phytoelements.in, Hyderabad, India`,
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
