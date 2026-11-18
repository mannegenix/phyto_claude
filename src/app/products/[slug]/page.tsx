import Image from "next/image";
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
import { ProductOrb } from "@/components/product/ProductOrb";

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
  const prev = all[(idx - 1 + all.length) % all.length];
  const { testPillars } = await getCompany();

  // Structured product data for search engines (no unverified spec values).
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.intro,
    category: "Bulk plant extract",
    brand: { "@type": "Brand", name: siteConfig.name },
    url: `${siteConfig.url}/products/${product.slug}`,
  };

  return (
    <div className="specimen-page" style={{ ["--sw" as string]: product.swatch }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHead title={product.name} crumbs={[{ href: "/products", label: "Products" }, { label: product.short }]}>
        <div className="mb-4 flex flex-wrap gap-2.5">
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
              {product.image && (
                <figure className="chapter-photo">
                  <Image src={product.image.replace(".webp", "-wide.webp")} alt={`${product.short}: raw botanical and extract powder`} width={1600} height={940} sizes="(max-width: 960px) 92vw, 760px" unoptimized />
                  <figcaption>Representative image · not a specific lot</figcaption>
                </figure>
              )}
              <h2>
                <i>{product.botanicalSource.split(" (")[0]}</i>, {product.plantPart.toLowerCase()}
              </h2>
              <p className="max-w-[60ch] text-muted">
                We buy {product.short} from qualified producers against a defined specification for the botanical, the
                plant part and the {product.marker.split(",")[0].split(" (")[0]} grade, aligned with recognised global
                quality standards. Where it comes from can vary; what it has to meet does not.
              </p>
            </article>

            <article className="chapter is-test">
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
                Documents are sent from <span className="mono">info@phytoelements.in</span>.
              </p>
            </article>
          </div>
          <aside className="sticky-tag grid min-w-0 gap-5">
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
        <div className="wrap grid gap-6">
          <div className="pf-head">
            <div className="sec-head">
              <span className="eyebrow">The portfolio</span>
              <h2>Explore every extract</h2>
            </div>
            <nav className="pf-nav" aria-label="Previous and next extract">
              <Link href={`/products/${prev.slug}`} rel="prev" className="pf-step">
                <span aria-hidden="true">←</span>
                <span>
                  <small>Previous</small>
                  {prev.short}
                </span>
              </Link>
              <Link href={`/products/${next.slug}`} rel="next" className="pf-step is-next">
                <span>
                  <small>Next</small>
                  {next.short}
                </span>
                <span aria-hidden="true">→</span>
              </Link>
            </nav>
          </div>
          <ul className="pf-rail rail" aria-label="All extracts">
            {all.map((p) => {
              const here = p.slug === product.slug;
              return (
                <li key={p.slug}>
                  <Link
                    href={`/products/${p.slug}`}
                    className={`pf-card ${here ? "is-here" : ""}`}
                    aria-current={here ? "page" : undefined}
                    style={{ ["--sw" as string]: p.swatch }}
                  >
                    <span className="pf-photo">
                      <ProductOrb product={p} size="md" uid={`pf-${p.slug}`} />
                    </span>
                    <span className="pf-text">
                      <b>{p.name}</b>
                      <small>{p.marker}</small>
                    </span>
                    <span className="pf-tag">{here ? "Viewing" : p.role.replace(" product", "")}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}
