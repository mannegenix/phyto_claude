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
    "Six bulk plant extracts, each lot tested against our specification: Garcinia Cambogia, Curcumin, Ashwagandha, Boswellia, Bakuchiol and Bacopa.",
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
        title="Six extracts, one standard"
        crumbs={[{ label: "Products" }]}
        lede="Garcinia Cambogia leads the portfolio. Every lot of every extract is tested against our specification, and only lots that pass carry our label."
      />

      <section className="products-stage">
        <div className="wrap">
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

          <details className="compare-all">
            <summary>
              <span>Compare all six at a glance</span>
              <span className="mono text-[0.76rem]">Marker · role · primary application</span>
            </summary>
            <div className="sheet mt-4 overflow-x-auto">
              <table className="min-w-[720px]">
                <thead>
                  <tr>
                    {["#", "Product", "Portfolio role", "Quality marker / grade basis", "Primary B2B application"].map(
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
                      <td className="mono">{p.code.slice(3)}</td>
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
          </details>
        </div>
      </section>

      <EnquirySection title="Enquire about any product" />
    </>
  );
}
