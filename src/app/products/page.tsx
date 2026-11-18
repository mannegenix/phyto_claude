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
            <div className="sheet overflow-x-auto">
              <table className="min-w-[720px]">
                <thead>
                  <tr>
                    {["Product", "Portfolio role", "Quality marker / grade basis", "Primary B2B application"].map(
                      (h) => (
                        <th key={h} scope="col">
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.slug}>
                      <td>
                        <Link href={`/products/${p.slug}`} className="font-semibold">
                          {p.name}
                        </Link>
                      </td>
                      <td>{p.role.replace(" product", "")}</td>
                      <td>{p.marker}</td>
                      <td>{p.applicationArea}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
