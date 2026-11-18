import type { Metadata } from "next";
import { getCompany } from "@/lib/content";
import { PageHead } from "@/components/ui/PageHead";
import { SourceToSeal, TestPillars } from "@/components/sections/home";

export const metadata: Metadata = {
  title: "Manufacturing & Quality",
  description:
    "Bulk plant extracts made and sourced to defined specifications and tested to recognised global quality standards and beyond. Only lots that pass carry our name.",
};

export default async function ManufacturingPage() {
  const c = await getCompany();
  return (
    <>
      <PageHead
        title="Manufacturing & Quality"
        crumbs={[{ label: "Manufacturing & Quality" }]}
        lede="Every extract we supply is made to a defined specification and tested to recognised global quality standards, and often beyond them. Only the lots that pass carry the Phyto Elements label."
      />
      <section className="section bgphoto bgphoto-quality">
        <div className="wrap grid items-start gap-[clamp(28px,5vw,64px)] min-[861px]:grid-cols-2">
          <div className="grid max-w-[66ch] gap-4">
            <span className="eyebrow">Manufacturing</span>
            <h2 className="text-[clamp(1.8rem,3.4vw,2.5rem)]">Made to a defined specification</h2>
            <p>
              Our extracts are produced in our own manufacturing and by qualified manufacturing partners. Wherever a lot
              is made, it is made against the same defined specification for botanical source, plant part, marker
              compound and grade, aligned with recognised global quality standards.
            </p>
            <span className="eyebrow mt-6">Quality</span>
            <h2 className="text-[clamp(1.8rem,3.4vw,2.5rem)]">Global standards, and beyond</h2>
            <p>
              Quality is decided in testing. Each lot is checked rigorously against recognised global quality standards,
              and we hold ourselves to go beyond them where we can. Lots that fall short are rejected or returned. They are never
              relabelled, blended in or sold under our name.
            </p>
          </div>
          <div className="grid gap-[18px]">
            <p className="callout">{c.promise}</p>
          </div>
        </div>
      </section>
      <TestPillars pillars={c.testPillars} />
      <SourceToSeal stages={c.stages} layout="stepper" />
      <section className="section sunk">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Quality documentation</span>
            <h2>Representative information and lot-certified information are kept separate</h2>
          </div>
          <div className="kv">
            <div>
              <h3 className="text-[1.1rem]">Specification sheet</h3>
              <p>The grade, marker compound, parameters and acceptance limits each lot is tested against.</p>
            </div>
            <div>
              <h3 className="text-[1.1rem]">Representative COA</h3>
              <p>Clearly labelled as representative. Shows the test panel and typical results for evaluation.</p>
            </div>
            <div>
              <h3 className="text-[1.1rem]">Lot-specific COA</h3>
              <p>Issued for the identified lot, matched to its lot reference, and sent with the shipment documents.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
