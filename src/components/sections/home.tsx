import Link from "next/link";
import type { Product, ValuePoint, OperatingFunction, ProcessStage, TestPillar } from "@/content/types";
import { ProductCard } from "@/components/product/ProductCard";
import { Reveal } from "@/components/motion/Reveal";
import { LazyScene } from "@/components/three/LazyScene";
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
    <section className="section sunk">
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

function FruitFallback() {
  // Static illustration shown before the 3D scene loads (and for reduced-motion visitors).
  return (
    <svg viewBox="0 0 200 200" className="size-full" aria-hidden="true">
      <circle cx="100" cy="96" r="62" fill="#d9a441" />
      <circle cx="100" cy="96" r="56" fill="#f0c766" />
      <circle cx="100" cy="96" r="46" fill="#f7e6b3" />
      {Array.from({ length: 8 }, (_, i) => {
        const a = ((i + 0.5) / 8) * Math.PI * 2;
        return (
          <ellipse
            key={i}
            cx={100 + Math.cos(a) * 25}
            cy={96 + Math.sin(a) * 25}
            rx="13"
            ry="6.5"
            transform={`rotate(${(a * 180) / Math.PI} ${100 + Math.cos(a) * 25} ${96 + Math.sin(a) * 25})`}
            fill="#eccf84"
          />
        );
      })}
    </svg>
  );
}

export function FlagshipBand({ product }: { product: Product }) {
  return (
    <section className="section band wave-top">
      <div className="wrap grid items-center gap-[clamp(32px,5vw,64px)] min-[881px]:grid-cols-2">
        <div>
          <span className="eyebrow">Flagship · {product.code}</span>
          <h2 className="mt-3.5 mb-[18px] text-[clamp(2rem,4vw,3.1rem)]">{product.name}</h2>
          <p className="lede">{product.intro}</p>
          <div className="flag-specs mt-7">
            <div>
              <small>Botanical source</small>
              <span>
                <i>{product.botanicalSource.split(" (")[0]}</i>
              </span>
            </div>
            <div>
              <small>Plant part</small>
              <span>{product.plantPart}</span>
            </div>
            <div>
              <small>Quality marker</small>
              <span>{product.marker}</span>
            </div>
            <div>
              <small>Every lot</small>
              <span>Tested before labelling</span>
            </div>
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={`/products/${product.slug}`} className="btn">
              View {product.short}
            </Link>
            <Link href="/sample" className="btn btn-ghost">
              Request a sample
            </Link>
          </div>
        </div>
        <div className="flag-art">
          <LazyScene fallback={<FruitFallback />} />
          <div className="mono pointer-events-none absolute inset-x-[18px] bottom-4 flex justify-between text-[0.72rem] text-on-band-muted">
            <span>3D preview · drag to rotate</span>
            <span>{product.marker.split(" (")[1]?.replace(")", "") ?? ""}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProductGrid({ products, heading = true }: { products: Product[]; heading?: boolean }) {
  return (
    <section className={`section ${heading ? "wave-top" : ""}`}>
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
    <section className="section wave-top">
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
    <section className="section band wave-top">
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
