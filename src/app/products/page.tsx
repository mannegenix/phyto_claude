import type { Metadata } from "next";
import Link from "next/link";
import { getProducts } from "@/lib/content";
import { PageHead } from "@/components/ui/PageHead";
import { ProductGrid } from "@/components/sections/home";
import { EnquirySection } from "@/components/sections/EnquirySection";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Six bulk plant extracts manufactured to approved specifications: Garcinia Cambogia, Curcumin, Ashwagandha, Boswellia, Bakuchiol and Bacopa.",
};

export default async function ProductsPage() {
  const products = await getProducts();
  return (
    <>
      <PageHead
        title="Products"
        crumbs={[{ label: "Products" }]}
        lede="Six bulk extracts, each manufactured to an approved specification. Select a product for its specification summary, documents and enquiry form."
      />
      <section className="pt-[clamp(40px,6vw,72px)]">
        <div className="wrap">
          <div className="sheet overflow-x-auto">
            <table className="min-w-[720px]">
              <thead>
                <tr>
                  {["#", "Product", "Portfolio role", "Quality marker / grade basis", "Primary B2B application"].map(
                    (h) => (
                      <th key={h} scope="col" className="w-auto">
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
        </div>
      </section>
      <ProductGrid products={products} heading={false} />
      <EnquirySection title="Enquire about any product" />
    </>
  );
}
