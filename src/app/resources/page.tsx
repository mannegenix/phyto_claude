import type { Metadata } from "next";
import Link from "next/link";
import { getCompany } from "@/lib/content";
import { PageHead } from "@/components/ui/PageHead";
import { MailList } from "@/components/ui/MailList";
import { ReviewNote } from "@/components/ui/ReviewNote";

export const metadata: Metadata = {
  title: "Documents & Resources",
  description: "Specifications, representative and batch COAs, SDS and commercial documents, shared by email.",
};

export default async function ResourcesPage() {
  const c = await getCompany();
  return (
    <>
      <PageHead
        title="Documents & Resources"
        crumbs={[{ label: "Documents / Resources" }]}
        lede="Technical and commercial documents are shared by email so each one matches the product, grade and batch you are evaluating."
      />
      <section className="section">
        <div className="wrap grid items-start gap-[clamp(28px,5vw,64px)] min-[861px]:grid-cols-2">
          <div className="border-t border-line">
            {c.documents.map((d) => (
              <div key={d.name} className="doc">
                <span className="doc-ico">{d.tag}</span>
                <div>
                  <h4>{d.name}</h4>
                  <p>{d.body}</p>
                </div>
                <span className="mono text-right text-[0.72rem] text-muted">{d.access}</span>
              </div>
            ))}
          </div>
          <div className="grid gap-[18px]">
            <h2 className="text-[1.6rem]">Request a document</h2>
            <p className="muted">
              Use the enquiry form and choose &ldquo;Request specifications&rdquo;, or write directly to the quality
              desk.
            </p>
            <MailList mailboxes={c.mailboxes.filter((m) => /quality|info/.test(m.address))} />
            <div>
              <Link href="/sample" className="btn">
                Request specifications
              </Link>
            </div>
            <ReviewNote>
              Company profile PDF and per-product spec sheets can move to direct downloads once approved. Batch COAs
              stay email-only.
            </ReviewNote>
          </div>
        </div>
      </section>
    </>
  );
}
