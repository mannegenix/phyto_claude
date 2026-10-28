import type { Metadata } from "next";
import { getCompany } from "@/lib/content";
import { PageHead } from "@/components/ui/PageHead";
import { ReviewNote } from "@/components/ui/ReviewNote";
import { SourceToSeal, TestPillars } from "@/components/sections/home";

export const metadata: Metadata = {
  title: "Testing & Quality",
  description:
    "Every lot is checked for identity, purity, potency, safety and stability against the Phyto Elements specification. Only lots that pass carry our name.",
};

export default async function QualityPage() {
  const c = await getCompany();
  return (
    <>
      <PageHead
        title="Testing & Quality"
        crumbs={[{ label: "Testing & Quality" }]}
        lede="We source from several qualified producers. What we sell is decided by testing: every lot is held to our specification, and only the lots that pass carry the Phyto Elements label."
      />
      <section className="section">
        <div className="wrap grid items-start gap-[clamp(28px,5vw,64px)] min-[861px]:grid-cols-2">
          <div className="grid max-w-[66ch] gap-4">
            <span className="eyebrow">Our guarantee</span>
            <h2 className="text-[clamp(1.8rem,3.4vw,2.5rem)]">The label is the promise</h2>
            <p>
              Sourcing is how we secure supply; it can change with season, region and producer. Our specification does
              not change. Each lot is tested against it, and the Phyto Elements label goes only on lots that meet it.
            </p>
            <p>
              Lots that fall short are rejected or returned. They are never relabelled, blended in or sold under our
              name.
            </p>
          </div>
          <div className="grid gap-[18px]">
            <p className="callout">{c.promise}</p>
            <ReviewNote>
              Verify before naming specific tests, laboratories or certifications:
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
