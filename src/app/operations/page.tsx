import type { Metadata } from "next";
import Link from "next/link";
import { getCompany } from "@/lib/content";
import { PageHead } from "@/components/ui/PageHead";

export const metadata: Metadata = {
  title: "How we work",
  description: "From specification and producer qualification to testing, release and fulfilment: how Phyto Elements decides what carries its name.",
};

export default async function OperationsPage() {
  const c = await getCompany();
  return (
    <>
      <PageHead
        title="How we work"
        crumbs={[{ label: "How we work" }]}
        lede="We write the specification, qualify the producers, test every lot and release only what passes. Documentation is linked to the lot you receive."
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
              quotations, purchase orders and shipment documents. No lot COA is sent without confirming the correct
              product and lot reference.
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
