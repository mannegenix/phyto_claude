import Link from "next/link";
import type { Product, ValuePoint, OperatingFunction, ProcessStage, TestPillar } from "@/content/types";
import { ProductCard } from "@/components/product/ProductCard";
import { Reveal } from "@/components/motion/Reveal";
import { ReviewNote } from "@/components/ui/ReviewNote";
import { SpecimenHero } from "@/components/hero/SpecimenHero";
import { HeroScene } from "@/components/hero/HeroScene";
import { QualityFunnel } from "@/components/sections/QualityFunnel";

export function Hero({ products, positioning }: { products: Product[]; positioning: string }) {
  const items = products.map((p) => ({
    slug: p.slug,
    code: p.code,
    name: p.name,
    marker: p.marker,
    plantPart: p.plantPart,
    swatch: p.swatch,
  }));
  return (
    <section className="hero hero-glow">
      <HeroScene />
      <div className="wrap grid items-center gap-[clamp(24px,4vw,56px)] min-[961px]:grid-cols-[1fr_1.1fr]">
        <div className="relative z-[1]">
          <span className="eyebrow">Bulk plant extracts · Tested lot by lot</span>
          <h1 className="hero-title mt-[18px] mb-[22px]">
            Only the best extracts <em>carry our name</em>
          </h1>
          <p className="lede">{positioning}</p>
          <div className="mt-[30px] flex flex-wrap gap-3">
            <Link href="/sample" className="btn">
              Request a Sample
            </Link>
            <Link href="/manufacturing" className="btn btn-ghost">
              Our quality standards
            </Link>
          </div>
          <div className="dot-list mt-[34px]">
            <span>Six focus extracts</span>
            <span>Every lot tested</span>
            <span>India &amp; export supply</span>
          </div>
        </div>
        <SpecimenHero items={items} />
      </div>
      <ProductTicker products={products} />
    </section>
  );
}

/** Product ticker under the hero: every extract, every lot, the same check. */
export function ProductTicker({ products }: { products: Product[] }) {
  const row = products.map((p) => (
    <span key={p.slug} className="ticker-item">
      <b>{p.code}</b> {p.short} <span className="ticker-marker">{p.marker.split(/[,/(]/)[0].trim()}</span>
      <span className="ticker-ok">Tested</span>
    </span>
  ));
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        {row}
        {row}
      </div>
    </div>
  );
}

export function ValuesSection({ intro, values }: { intro: string; values: ValuePoint[] }) {
  return (
    <section className="section sunk photo photo-pipette">
      <div className="wrap">
        <Reveal className="sec-head">
          <span className="eyebrow">Who we are</span>
          <h2>Sourced widely. Tested rigorously. Only the best carries our name.</h2>
          <p className="lede">{intro}</p>
        </Reveal>
        <div className="values">
          {values.map((v) => (
            <div key={v.title}>
              <h3>{v.title}</h3>
              <p>{v.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProductGrid({ products, heading = true }: { products: Product[]; heading?: boolean }) {
  return (
    <section className={`section photo photo-amber ${heading ? "wave-top" : ""}`}>
      <div className="wrap">
        {heading && (
          <Reveal className="sec-head">
            <span className="eyebrow">Portfolio</span>
            <h2>Six extracts, one standard</h2>
            <p className="lede">
              Garcinia Cambogia leads the portfolio, and the other five are held to exactly the same test. Every product
              has its own page, specification summary and enquiry form.
            </p>
          </Reveal>
        )}
        <div className="grid gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

/** "From source to seal": the stages scroll beside a field of lots that narrows to the ones that pass. */
export function SourceToSeal({ stages }: { stages: ProcessStage[] }) {
  return (
    <section
      className="section wave-top s2s photo photo-dropper"
      data-steps={stages.length + 2}
      style={{ ["--s2s-n" as string]: stages.length + 2 }}
    >
      <div className="wrap">
        <div className="sec-head">
          <span className="eyebrow">From source to seal</span>
          <h2>Many lots come in. Only the ones that pass go out under our name.</h2>
          <p className="lede">
            We source from several qualified producers so supply stays steady. What keeps the standard fixed is the test
            every lot has to pass.
          </p>
        </div>
        <QualityFunnel stages={stages} />
      </div>
    </section>
  );
}

/** The five things every lot is checked for. */
export function TestPillars({ pillars, heading = true }: { pillars: TestPillar[]; heading?: boolean }) {
  return (
    <section className="section band wave-top photo photo-instrument">
      <div className="wrap">
        {heading && (
          <div className="sec-head">
            <span className="eyebrow">Our guarantee</span>
            <h2>What every lot is checked for</h2>
            <p className="lede">
              Before a lot carries the Phyto Elements label, it is held against five questions. If the answer to any of
              them is no, it does not go out under our name.
            </p>
          </div>
        )}
        <ol className="pillars">
          {pillars.map((t, i) => (
            <li key={t.code} style={{ ["--i" as string]: i }}>
              <span className="pillar-code">{t.code}</span>
              <h3>{t.title}</h3>
              <p>{t.body}</p>
            </li>
          ))}
        </ol>
        <ReviewNote>
          Confirm the actual test panel and methods per product with the client before naming any (for example HPLC,
          heavy metals, microbiology). Until then the five pillars stay generic.
        </ReviewNote>
      </div>
    </section>
  );
}

export function WhyUs({ functions }: { functions: OperatingFunction[] }) {
  return (
    <section className="section">
      <div className="wrap grid items-start gap-[clamp(28px,5vw,64px)] min-[861px]:grid-cols-2">
        <Reveal className="grid gap-[18px]">
          <span className="eyebrow">How we work</span>
          <h2 className="text-[clamp(1.9rem,3.6vw,2.75rem)]">Every document traces back to the lot you receive</h2>
          <p className="lede">
            From writing the specification to the release decision, every step exists to make sure what you receive is
            what passed.
          </p>
          <div>
            <Link href="/operations" className="btn btn-ghost">
              See how we work
            </Link>
          </div>
        </Reveal>
        <ul className="dot-rows">
          {functions.map((f) => (
            <li key={f.title}>{f.title}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
