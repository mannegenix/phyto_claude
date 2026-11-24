import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { getCompany } from "@/lib/content";
import { siteConfig } from "@/config/site";
import { PageHead } from "@/components/ui/PageHead";
import { MailList } from "@/components/ui/MailList";
import { LogoMark } from "@/components/layout/Logo";
import { EnquirySection } from "@/components/sections/EnquirySection";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: "Contact Phyto Elements, Hyderabad, India: info@phytoelements.in.",
  path: "/contact",
});

export default async function ContactPage() {
  const c = await getCompany();
  return (
    <>
      <PageHead
        title="Contact"
        crumbs={[{ label: "Contact" }]}
        lede="Write to info@phytoelements.in, or use the form below."
      />
      <section className="section">
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
              <div className="mono text-[0.86rem]">{siteConfig.domain}</div>
            </div>
          </div>
        </div>
      </section>
      <EnquirySection title="Send an enquiry" />
    </>
  );
}
