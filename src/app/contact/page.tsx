import { LabArt } from "@/components/botanicals/LabArt";
import type { Metadata } from "next";
import { getCompany } from "@/lib/content";
import { siteConfig } from "@/config/site";
import { PageHead } from "@/components/ui/PageHead";
import { MailList } from "@/components/ui/MailList";
import { LogoMark } from "@/components/layout/Logo";
import { ReviewNote } from "@/components/ui/ReviewNote";
import { EnquirySection } from "@/components/sections/EnquirySection";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Phyto Elements sales, samples, quality and orders teams.",
};

export default async function ContactPage() {
  const c = await getCompany();
  return (
    <>
      <PageHead
        title="Contact"
        crumbs={[{ label: "Contact" }]}
        lede="Write to the desk that fits your enquiry, or use the form below."
      />
      <section className="section labart-host">
        <LabArt kind="shipping" backdrop pos="bl" />
        <div className="wrap grid items-start gap-[clamp(28px,5vw,64px)] min-[861px]:grid-cols-2">
          <MailList mailboxes={c.mailboxes} />
          <div className="grid gap-[18px]">
            <div className="tag grid gap-3.5 p-6">
              <span className="eyebrow">Company</span>
              <div className="flex items-center gap-3">
                <LogoMark className="size-[42px]" />
                <div>
                  <div className="font-display text-[1.3rem] font-semibold">{siteConfig.name}</div>
                  <div className="font-sans text-muted">Hyderabad, India</div>
                </div>
              </div>
              <div className="font-sans text-[0.92rem] text-muted">
                Registered address and legal entity name published after verification.
              </div>
              <div className="mono text-[0.86rem]">{siteConfig.domain}</div>
            </div>
            <ReviewNote>Confirm the city/address for publication. &ldquo;Hyderabad&rdquo; is a placeholder.</ReviewNote>
          </div>
        </div>
      </section>
      <EnquirySection title="Send an enquiry" />
    </>
  );
}
