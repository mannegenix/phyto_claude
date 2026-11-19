import type { Metadata } from "next";
import Link from "next/link";
import { getProducts } from "@/lib/content";
import { PageHead } from "@/components/ui/PageHead";
import { EnquirySection } from "@/components/sections/EnquirySection";
import { ProductCarousel } from "@/components/products/ProductCarousel";
import { ProductFinder } from "@/components/products/ProductFinder";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Bulk plant extracts led by Garcinia Cambogia, every lot tested to recognised global quality standards.",
};

export default async function ProductsPage() {
  const products = await getProducts();
  const items = products.map((p) => ({
    slug: p.slug,
    code: p.code,
    name: p.name,
    short: p.short,
    role: p.role,
    botanicalSource: p.botanicalSource,
    plantPart: p.plantPart,
    marker: p.marker,
    applications: p.applications,
    swatch: p.swatch,
    image: p.image,
    intro: p.intro,
  }));

  return (
    <>
      <PageHead
        title="Every extract, one standard"
        crumbs={[{ label: "Products" }]}
        lede="Garcinia Cambogia leads the portfolio. Every lot of every extract is tested to recognised global quality standards, and only lots that pass carry our label."
      />

      {/* Product overview first: the whole range in one table */}
      <section className="section product-overview">
        <div className="wrap grid gap-6">
          <div className="sec-head">
            <span className="eyebrow">Product overview</span>
            <h2>Compare the portfolio</h2>
          </div>
          <p className="po-hint">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 9V4.5a1.5 1.5 0 0 1 3 0V11l3.6.6a2 2 0 0 1 1.7 2.2l-.5 4.2a3 3 0 0 1-3 2.6H11a3 3 0 0 1-2.4-1.2L5.4 15a1.5 1.5 0 0 1 2.3-1.9L9 14.5" />
            </svg>
            Select any extract to open its specification sheet.
          </p>
            <div className="po-list sheet" role="table" aria-label="Product overview">
              <div className="po-row po-head" role="row">
                <span role="columnheader">Product</span>
                <span role="columnheader">Role</span>
                <span role="columnheader">Quality marker / grade</span>
                <span role="columnheader">Primary B2B application</span>
                <span role="columnheader" className="sr-only">
                  Details
                </span>
              </div>
              {products.map((p) => (
                <Link key={p.slug} href={`/products/${p.slug}`} className="po-row" role="row">
                  <span className="po-name" role="cell">
                    {p.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.image} alt="" width={44} height={44} loading="lazy" />
                    )}
                    <span>
                      <b>{p.name}</b>
                      <small>{p.botanicalSource}</small>
                    </span>
                  </span>
                  <span className="po-role" role="cell" data-k="Role">
                    <i className={p.flagship ? "is-flag" : ""}>{p.role.replace(" product", "")}</i>
                  </span>
                  <span role="cell" data-k="Marker">
                    {p.marker}
                  </span>
                  <span role="cell" data-k="Application">
                    {p.applicationArea}
                  </span>
                  <span className="po-go" role="cell" aria-hidden="true">
                    <span className="po-go-label">View specs</span>
                    <span className="po-go-arrow">→</span>
                  </span>
                </Link>
              ))}
            </div>
        </div>
      </section>

      <section className="products-stage">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">The extracts</span>
            <h2>Explore each extract</h2>
          </div>
          <ProductCarousel items={items} />
        </div>
      </section>

      <section className="section">
        <div className="wrap grid gap-10">
          <div className="sec-head">
            <span className="eyebrow">Find by application</span>
            <h2>Which extract fits your formulation?</h2>
          </div>
          <ProductFinder products={products} />
        </div>
      </section>

      <EnquirySection title="Enquire about any product" />
    </>
  );
}
