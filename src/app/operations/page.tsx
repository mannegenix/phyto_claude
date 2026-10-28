import type { Metadata } from "next";
import Link from "next/link";
import { getCompany } from "@/lib/content";
import { PageHead } from "@/components/ui/PageHead";

export const metadata: Metadata = {
  title: "Operations",
  description: "Nine operating functions from product development to domestic and export fulfilment.",
};

export default async function OperationsPage() {
  const c = await getCompany();
  return (
    <>
      <PageHead
        title="Operations"
        crumbs={[{ label: "Operations" }]}
        lede="Our operating role as an extract manufacturer runs from product and process development through to domestic and export fulfilment. Documentation is linked to the manufactured batch and its approved specification."
      />
      <section className="section">
        <div className="wrap">
          <ol className="funcs">
            {c.operatingFunctions.map((f) => (
              <li key={f.title}>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="section band">
        <div className="wrap grid items-start gap-[clamp(28px,5vw,64px)] min-[861px]:grid-cols-2">
          <div className="grid gap-[18px]">
            <span className="eyebrow">One interface</span>
            <h2 className="text-[clamp(1.9rem,3.6vw,2.6rem)]">
              Specification, sample, price, packing and documents through one point of contact
            </h2>
          </div>
          <div className="grid gap-[18px]">
            <p className="lede">
              Technical and commercial records are exchanged by email: specifications, Certificates of Analysis,
              quotations, purchase orders and shipment documents. No batch COA is sent without confirming the correct
              product and batch reference.
            </p>
            <div>
              <Link href="/contact" className="btn">
                Contact our team
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
