import type { Metadata } from "next";
import { getCompany } from "@/lib/content";
import { PageHead } from "@/components/ui/PageHead";
import { ReviewNote } from "@/components/ui/ReviewNote";
import { ProcessScroll } from "@/components/sections/home";

export const metadata: Metadata = {
  title: "Manufacturing & Quality",
  description: "Controlled, product-specific extract manufacturing with batch-linked Certificates of Analysis.",
};

export default async function ManufacturingPage() {
  const c = await getCompany();
  return (
    <>
      <PageHead
        title="Manufacturing & Quality"
        crumbs={[{ label: "Manufacturing & Quality" }]}
        lede="Controlled, product-specific processing designed around approved specifications and customer requirements."
      />
      <section className="section">
        <div className="wrap grid items-start gap-[clamp(28px,5vw,64px)] min-[861px]:grid-cols-2">
          <div className="grid max-w-[66ch] gap-4">
            <h2 className="text-[1.8rem]">Controlled extract manufacturing</h2>
            <p>
              Phyto Elements manufactures bulk botanical extracts using controlled, product-specific processing designed
              around approved specifications and customer requirements.
            </p>
            <p>
              Each commercial batch is supported by defined manufacturing records, applicable quality tests, approved
              packing and a batch-linked Certificate of Analysis.
            </p>
          </div>
          <div className="grid gap-[18px]">
            <ReviewNote>
              Verify before going live:
              <ul className="mt-1.5 list-disc pl-[18px]">
                {c.manufacturingChecklist.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </ReviewNote>
            <p className="callout">
              Certifications, capacity and testing infrastructure will be listed here as they are verified and
              documented.
            </p>
          </div>
        </div>
      </section>
      <ProcessScroll stages={c.stages} />
      <section className="section">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Quality documentation</span>
            <h2>Representative information and batch-certified information are kept separate</h2>
          </div>
          <div className="kv">
            <div>
              <h3 className="text-[1.1rem]">Specification sheet</h3>
              <p>Defines the grade, marker compound, physical parameters and limits we manufacture to.</p>
            </div>
            <div>
              <h3 className="text-[1.1rem]">Representative COA</h3>
              <p>Clearly labelled as representative. Shows the test panel and typical results for evaluation.</p>
            </div>
            <div>
              <h3 className="text-[1.1rem]">Batch-specific COA</h3>
              <p>
                Issued against the identified batch, matched to its batch reference, and sent with the shipment
                documents.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
