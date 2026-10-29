import type { Metadata } from "next";
import { getCompany } from "@/lib/content";
import { PageHead } from "@/components/ui/PageHead";
import { ReviewNote } from "@/components/ui/ReviewNote";
import { LabArt } from "@/components/botanicals/LabArt";
import { SourceToSeal, TestPillars } from "@/components/sections/home";

export const metadata: Metadata = {
  title: "Manufacturing & Quality",
  description:
    "Bulk plant extracts made and sourced to the Phyto Elements specification, then held to rigorous testing standards. Only lots that pass carry our name.",
};

export default async function ManufacturingPage() {
  const c = await getCompany();
  return (
    <>
      <PageHead
        title="Manufacturing & Quality"
        crumbs={[{ label: "Manufacturing & Quality" }]}
        lede="Every extract we supply is made to our specification and held to rigorous, very high testing standards. Only the lots that pass carry the Phyto Elements label."
      />
      <section className="section bgphoto bgphoto-quality">
        <div className="wrap grid items-start gap-[clamp(28px,5vw,64px)] min-[861px]:grid-cols-2">
          <div className="grid max-w-[66ch] gap-4">
            <span className="eyebrow">Manufacturing</span>
            <h2 className="text-[clamp(1.8rem,3.4vw,2.5rem)]">Made to our specification</h2>
            <p>
              Our extracts are produced in our own manufacturing and by qualified manufacturing partners. Wherever a lot
              is made, it is made against the same Phyto Elements specification for botanical source, plant part,
              marker compound and grade.
            </p>
            <span className="eyebrow mt-6">Quality</span>
            <h2 className="text-[clamp(1.8rem,3.4vw,2.5rem)]">Rigorous testing, very high standards</h2>
            <p>
              Quality is decided in testing. Each lot is checked rigorously against our specification, and our acceptance
              standards are set high on purpose. Lots that fall short are rejected or returned. They are never
              relabelled, blended in or sold under our name.
            </p>
          </div>
          <div className="grid gap-[18px]">
            <p className="callout">{c.promise}</p>
            <ReviewNote>
              Verify before naming specific tests, laboratories, facilities or certifications:
              <ul className="mt-1.5 list-disc pl-[18px]">
                {c.qualityChecklist.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </ReviewNote>
          </div>
        </div>
      </section>
      <TestPillars pillars={c.testPillars} />
      <SourceToSeal stages={c.stages} />
      <section className="section sunk labart-host">
        <LabArt kind="coa" backdrop pos="tr" />
        <LabArt kind="seal" backdrop pos="bl" />
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
