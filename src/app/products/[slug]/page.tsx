import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCompany, getProduct, getProducts } from "@/lib/content";
import { siteConfig } from "@/config/site";
import { PageHead } from "@/components/ui/PageHead";
import { SpecSheet } from "@/components/product/SpecSheet";
import { BatchTag } from "@/components/product/BatchTag";
import { EnquiryButtons } from "@/components/product/EnquiryButtons";
import { EnquirySection } from "@/components/sections/EnquirySection";
import { ReviewNote } from "@/components/ui/ReviewNote";
import { BotanicalArt } from "@/components/botanicals/BotanicalArt";

// Only the known products exist; any other slug is a static 404.
export const dynamicParams = false;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) return {};
  return {
    title: p.name,
    description: `${p.name}: bulk ${p.marker.split(",")[0]}-standardized extract from ${p.botanicalSource.split(" (")[0]} for ${p.applicationArea.toLowerCase()}. Request specifications, samples or a quote.`,
  };
}

const DOCS = [
  ["Specification sheet", "SPEC", "Email on request"],
  ["Representative COA", "COA", "Labelled representative"],
  ["Lot COA", "COA", "For the identified lot"],
  ["Safety Data Sheet", "SDS", "Where applicable"],
] as const;

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const [product, all] = await Promise.all([getProduct(slug), getProducts()]);
  if (!product) notFound();
  const idx = all.findIndex((o) => o.slug === product.slug);
  const next = all[(idx + 1) % all.length];
  const { testPillars } = await getCompany();

  // Structured product data for search engines (no unverified spec values).
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.intro,
    category: "Bulk plant extract",
    brand: { "@type": "Brand", name: siteConfig.name },
    sku: product.code,
    url: `${siteConfig.url}/products/${product.slug}`,
  };

  return (
    <div className="specimen-page" style={{ ["--sw" as string]: product.swatch }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BotanicalArt slug={product.slug} className="specimen-bg" strokeWidth={1.1} />
      <PageHead title={product.name} crumbs={[{ href: "/products", label: "Products" }, { label: product.short }]}>
        <div className="mb-4 flex flex-wrap gap-2.5">
          <span className="chip">{product.code}</span>
          <span className={`chip ${product.flagship ? "chip-flag" : ""}`}>{product.role}</span>
          <span className="chip">Every lot tested</span>
        </div>
        <div className="grid items-end gap-7 min-[821px]:grid-cols-[1fr_auto]">
          <p className="lede">{product.intro}</p>
          <EnquiryButtons />
        </div>
      </PageHead>

      <section className="section">
        <div className="wrap grid items-start gap-[clamp(28px,4vw,56px)] min-[961px]:grid-cols-[1.4fr_.9fr]">
          <div className="grid min-w-0">
            <article className="chapter">
              <span className="chapter-num">01 · Source</span>
              <h2>
                <i>{product.botanicalSource.split(" (")[0]}</i>, {product.plantPart.toLowerCase()}
              </h2>
              <p className="max-w-[60ch] text-muted">
                We buy {product.short} from producers we have qualified, against our own specification for the
                botanical, the plant part and the {product.marker.split(",")[0].split(" (")[0]} grade. Where it comes
                from can vary; what it has to meet does not.
              </p>
            </article>

            <article className="chapter">
              <span className="chapter-num">02 · Test</span>
              <h2>Checked before it carries our label</h2>
              <p className="max-w-[60ch] text-muted">
                Every incoming lot of {product.short} is held against the same five questions. Lots that fall short are
                not sold under the Phyto Elements name.
              </p>
              <ol className="pillars pillars-compact">
                {testPillars.map((t) => (
                  <li key={t.code}>
                    <span className="pillar-code">{t.code}</span>
                    <h3>{t.title}</h3>
                  </li>
                ))}
              </ol>
            </article>

            <article className="chapter">
              <span className="chapter-num">03 · Specification</span>
              <h2>Specification summary</h2>
              <SpecSheet product={product} />
              <ReviewNote>
                {product.reviewNote} Publish only grades Phyto Elements can test and supply consistently; replace
                &ldquo;Shared on request&rdquo; with verified values once approved.
              </ReviewNote>
            </article>

            <article className="chapter">
              <span className="chapter-num">04 · Applications</span>
              <h2>Where formulators use it</h2>
              <div className="flex flex-wrap gap-2">
                {product.applications.map((a) => (
                  <span key={a} className="rounded-full border border-line bg-surface px-3 py-1.5 text-[0.88rem]">
                    {a}
                  </span>
                ))}
              </div>
              <p className="text-[0.84rem] text-muted">
                Supplied as an ingredient for professional formulation. No disease-treatment claims are made for this
                product.
              </p>
            </article>

            <article className="chapter">
              <span className="chapter-num">05 · Documents</span>
              <h2>Paperwork that matches your lot</h2>
              <div className="border-t border-line">
                {DOCS.map(([name, tag, note]) => (
                  <div key={name} className="doc">
                    <span className="doc-ico">{tag}</span>
                    <div>
                      <h4>{name}</h4>
                      <p>{note}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[0.84rem] text-muted">
                Documents are sent from <span className="mono">quality@phytoelements.in</span>.
              </p>
            </article>
          </div>
          <aside className="sticky-tag grid min-w-0 gap-5">
            <BatchTag product={product} />
            <BotanicalArt slug={product.slug} className="mx-auto w-[min(100%,260px)] text-accent" draw label={`Line drawing of ${product.short}`} />
          </aside>
        </div>
      </section>

      <EnquirySection
        preselect={product.slug}
        eyebrow={`Enquire · ${product.short}`}
        title={`Request ${product.short} specifications, samples or a quote`}
      />

      <section className="section">
        <div className="wrap">
          <span className="eyebrow">Next extract</span>
          <Link
            href={`/products/${next.slug}`}
            className="next-extract mt-4"
            style={{ ["--sw" as string]: next.swatch }}
          >
            <div className="grid gap-2">
              <span className="mono text-[0.78rem] text-muted">{next.code} · {next.role}</span>
              <h3>{next.name}</h3>
              <span className="text-[0.95rem] text-accent-text">View specimen sheet →</span>
            </div>
            <BotanicalArt slug={next.slug} draw />
          </Link>
        </div>
      </section>
    </div>
  );
}
