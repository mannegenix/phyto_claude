import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, getProducts } from "@/lib/content";
import { siteConfig } from "@/config/site";
import { PageHead } from "@/components/ui/PageHead";
import { SpecSheet } from "@/components/product/SpecSheet";
import { BatchTag } from "@/components/product/BatchTag";
import { EnquiryButtons } from "@/components/product/EnquiryButtons";
import { EnquirySection } from "@/components/sections/EnquirySection";
import { ReviewNote } from "@/components/ui/ReviewNote";

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
  ["Batch COA", "COA", "After batch identification"],
  ["Safety Data Sheet", "SDS", "Where applicable"],
] as const;

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const [product, all] = await Promise.all([getProduct(slug), getProducts()]);
  if (!product) notFound();
  const others = all.filter((o) => o.slug !== product.slug);

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
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHead title={product.name} crumbs={[{ href: "/products", label: "Products" }, { label: product.short }]}>
        <div className="mb-4 flex flex-wrap gap-2.5">
          <span className="chip">{product.code}</span>
          <span className={`chip ${product.flagship ? "chip-flag" : ""}`}>{product.role}</span>
        </div>
        <div className="grid items-end gap-7 min-[821px]:grid-cols-[1fr_auto]">
          <p className="lede">{product.intro}</p>
          <EnquiryButtons />
        </div>
      </PageHead>

      <section className="section">
        <div className="wrap grid items-start gap-[clamp(28px,4vw,56px)] min-[901px]:grid-cols-[1.35fr_1fr]">
          <div className="grid min-w-0 gap-[18px]">
            <SpecSheet product={product} />
            <ReviewNote>
              {product.reviewNote} Publish only grades Phyto Elements can manufacture and supply consistently; replace
              &ldquo;Shared on request&rdquo; with verified values once approved.
            </ReviewNote>
          </div>
          <aside className="grid min-w-0 gap-7">
            <div>
              <h3 className="mb-2.5 text-[1.15rem]">Application categories</h3>
              <div className="flex flex-wrap gap-2">
                {product.applications.map((a) => (
                  <span key={a} className="rounded-full border border-line bg-surface px-3 py-1.5 text-[0.88rem]">
                    {a}
                  </span>
                ))}
              </div>
              <p className="mt-2.5 text-[0.84rem] text-muted">
                Supplied as an ingredient for professional formulation. No disease-treatment claims are made for this
                product.
              </p>
            </div>
            <div>
              <h3 className="mb-2.5 text-[1.15rem]">Documents</h3>
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
              <p className="mt-2.5 text-[0.84rem] text-muted">
                Documents are sent from <span className="mono">quality@phytoelements.in</span>.
              </p>
            </div>
            <BatchTag product={product} />
          </aside>
        </div>
      </section>

      <EnquirySection
        preselect={product.slug}
        eyebrow={`Enquire · ${product.short}`}
        title={`Request ${product.short} specifications, samples or a quote`}
      />

      <section className="section">
        <div className="wrap grid gap-[18px]">
          <span className="eyebrow">Other extracts</span>
          <div className="flex flex-wrap gap-2.5">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/products/${o.slug}`}
                className="flex items-center gap-2.5 rounded-full border border-line bg-surface py-2.5 pr-3.5 pl-2.5 text-[0.9rem] text-ink no-underline hover:border-accent"
              >
                <span className="swatch size-[22px] shadow-none" style={{ ["--sw" as string]: o.swatch }} />
                {o.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
