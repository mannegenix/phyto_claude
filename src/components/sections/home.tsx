import Link from "next/link";
import type { Product, ValuePoint, OperatingFunction, ProcessStage } from "@/content/types";
import { BatchTag } from "@/components/product/BatchTag";
import { ProductCard } from "@/components/product/ProductCard";
import { Reveal } from "@/components/motion/Reveal";
import { ScrollVideo } from "@/components/motion/ScrollVideo";
import { LazyScene } from "@/components/three/LazyScene";
import { ReviewNote } from "@/components/ui/ReviewNote";

export function Hero({ flagship, positioning }: { flagship: Product; positioning: string }) {
  return (
    <section className="hero-glow py-[clamp(48px,7vw,88px)]">
      <div className="wrap grid items-center gap-[clamp(32px,5vw,72px)] min-[881px]:grid-cols-[1.25fr_.9fr]">
        <div>
          <span className="eyebrow">Bulk plant extracts · Manufactured in India</span>
          <h1 className="hero-title mt-[18px] mb-[22px]">
            Bulk Plant Extracts for <em>Global Markets</em>
          </h1>
          <p className="lede">{positioning}</p>
          <div className="mt-[30px] flex flex-wrap gap-3">
            <Link href="/sample" className="btn">
              Request a Sample
            </Link>
            <Link href="/products" className="btn btn-ghost">
              Explore Products
            </Link>
          </div>
          <div className="dot-list mt-[34px]">
            <span>Six focus extracts</span>
            <span>Batch-linked COA</span>
            <span>India &amp; export supply</span>
          </div>
        </div>
        <Reveal delay={0.15}>
          <BatchTag product={flagship} />
        </Reveal>
      </div>
    </section>
  );
}

export function ValuesSection({ intro, values }: { intro: string; values: ValuePoint[] }) {
  return (
    <section className="section sunk">
      <div className="wrap">
        <Reveal className="sec-head">
          <span className="eyebrow">Who we are</span>
          <h2>A focused manufacturer of specification-driven botanical ingredients</h2>
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
    <section className="section band">
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
              <small>Grade</small>
              <span>Per approved specification</span>
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
    <section className="section">
      <div className="wrap">
        {heading && (
          <Reveal className="sec-head">
            <span className="eyebrow">Manufacturing portfolio</span>
            <h2>Six extracts, each made to an approved specification</h2>
            <p className="lede">
              Every product has its own page, specification summary and enquiry form. Additional extracts are added only
              after process development, quality validation and commercial evaluation.
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

/** Sticky split-screen scroll: process steps scroll on one side, the scrubbed video stays pinned. */
export function ProcessScroll({ stages }: { stages: ProcessStage[] }) {
  return (
    <section className="section sunk">
      <div className="wrap">
        <div className="sec-head">
          <span className="eyebrow">From botanicals to batch</span>
          <h2>Five stages between raw material and your dock</h2>
        </div>
        <ScrollVideo steps={stages} sequence="process" />
      </div>
    </section>
  );
}

export function WhyUs({ functions }: { functions: OperatingFunction[] }) {
  return (
    <section className="section">
      <div className="wrap grid items-start gap-[clamp(28px,5vw,64px)] min-[861px]:grid-cols-2">
        <Reveal className="grid gap-[18px]">
          <span className="eyebrow">Why work with Phyto Elements</span>
          <h2 className="text-[clamp(1.9rem,3.6vw,2.75rem)]">Every document traces back to the batch you receive</h2>
          <p className="lede">
            Our operating role covers product and process development, raw-material qualification, controlled
            extraction, standardization, quality testing, batch release, packing and fulfilment.
          </p>
          <div>
            <Link href="/operations" className="btn btn-ghost">
              See all nine operating functions
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

export function ManufacturingBand() {
  return (
    <section className="section band">
      <div className="wrap grid items-start gap-[clamp(28px,5vw,64px)] min-[861px]:grid-cols-2">
        <div className="grid gap-[18px]">
          <span className="eyebrow">Manufacturing &amp; quality</span>
          <h2 className="text-[clamp(1.9rem,3.6vw,2.75rem)]">Controlled extract manufacturing</h2>
        </div>
        <div className="grid gap-[18px]">
          <p className="lede">
            Phyto Elements manufactures bulk botanical extracts using controlled, product-specific processing designed
            around approved specifications and customer requirements. Each commercial batch is supported by
            manufacturing records, applicable quality tests, approved packing and a batch-linked Certificate of
            Analysis.
          </p>
          <div>
            <Link href="/manufacturing" className="btn btn-ghost">
              Manufacturing &amp; Quality
            </Link>
          </div>
          <ReviewNote>
            Certifications, capacity, equipment and in-house testing are intentionally absent. Add only once verified
            with records.
          </ReviewNote>
        </div>
      </div>
    </section>
  );
}
