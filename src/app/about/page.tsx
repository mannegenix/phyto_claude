import { LabArt } from "@/components/botanicals/LabArt";
import type { Metadata } from "next";
import { getCompany } from "@/lib/content";
import { siteConfig } from "@/config/site";
import { PageHead } from "@/components/ui/PageHead";

export const metadata: Metadata = {
  title: "About",
  description: "India-based B2B supplier of tested bulk plant extracts. Sourced widely, tested rigorously, only the best carries our name.",
};

export default async function AboutPage() {
  const c = await getCompany();
  return (
    <>
      <PageHead
        title="About Phyto Elements"
        crumbs={[{ label: "About" }]}
        lede="An India-based B2B supplier of bulk plant extracts. We source widely, test every lot, and put our name only on what passes."
      />
      <section className="section bgphoto bgphoto-grove">
        <div className="wrap grid items-start gap-[clamp(28px,5vw,64px)] min-[861px]:grid-cols-2">
          <div className="grid max-w-[66ch] gap-4">
            <p>{c.introduction}</p>
            <p>
              Our portfolio is built around six extracts with applications across nutraceutical,
              wellness, food, cosmetic and personal-care markets. Garcinia Cambogia Extract is the flagship product.
              Curcumin, Ashwagandha, Boswellia, Bakuchiol and Bacopa form the remaining focus portfolio.
            </p>
            <p>
              Sourcing is how we secure supply. Testing is how we decide what we sell. Additional extracts join the
              portfolio only once we have a specification, qualified producers and a testing route for them.
            </p>
          </div>
          <div className="grid gap-[18px]">
            <div className="tag p-6">
              <span className="eyebrow">Positioning</span>
              <p className="mt-2.5 font-display text-[1.4rem] leading-snug tracking-tight">{c.positioning}</p>
            </div>
            <p className="callout">
              Tagline: <b className="text-ink">{siteConfig.tagline}</b>
            </p>
          </div>
        </div>
      </section>
      <section className="section sunk labart-host">
        <LabArt kind="drums" backdrop pos="tr" />
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Who we serve</span>
            <h2>Core customer groups</h2>
          </div>
          <div className="grid gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
            {c.customers.map((cu, i) => (
              <div key={cu} className="card cursor-default grid-rows-none">
                <span className="mono text-[0.74rem] text-muted">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-[1.15rem]">{cu}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section labart-host">
        <LabArt kind="vials" backdrop pos="tr" />
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">How we create value</span>
            <h2>What buyers get from working with us</h2>
          </div>
          <div className="values">
            {c.values.map((v) => (
              <div key={v.title}>
                <h3>{v.title}</h3>
                <p>{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
