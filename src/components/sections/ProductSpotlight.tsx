"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/content/types";
import { LazyScene } from "@/components/three/LazyScene";
import { ProductOrb } from "@/components/product/ProductOrb";

type Item = Pick<
  Product,
  "slug" | "code" | "name" | "short" | "role" | "flagship" | "intro" | "botanicalSource" | "plantPart" | "marker" | "swatch" | "image"
>;

const MARKER_LABEL: Record<string, string> = {
  garcinia: "Hydroxycitric acid family",
  curcumin: "Curcuminoid family",
  ashwagandha: "Withanolide family",
  boswellia: "Boswellic acid family",
  bakuchiol: "Bakuchiol (meroterpene)",
  bacopa: "Bacoside family",
};

/**
 * Homepage spotlight: Garcinia first, then the other five in the same format.
 * Each extract has its own 3D model of its quality-marker family (illustrative).
 */
export function ProductSpotlight({ items }: { items: Item[] }) {
  const [i, setI] = useState(0);
  const p = items[i] ?? items[0];

  return (
    <section className="section band wave-top bgphoto bgphoto-leaf spotlight">
      <div className="wrap grid items-center gap-[clamp(28px,4vw,56px)] min-[881px]:grid-cols-2">
        <div className="grid gap-5">
          <div className="spot-tabs" role="tablist" aria-label="Choose an extract">
            {items.map((x, k) => (
              <button
                key={x.slug}
                type="button"
                role="tab"
                aria-selected={k === i}
                className="spot-tab"
                onClick={() => setI(k)}
                style={{ ["--sw" as string]: x.swatch }}
              >
                <ProductOrb product={x} size="sm" uid={`spot-${k}`} />
                <span>{x.short}</span>
              </button>
            ))}
          </div>
          <div key={p.slug} className="spot-body">
            <span className="eyebrow">
              {p.flagship ? "Flagship" : p.role.replace(" product", "")} · {p.code}
            </span>
            <h2 className="mt-3 mb-4 text-[clamp(1.9rem,3.6vw,2.9rem)]">{p.name}</h2>
            <p className="lede">{p.intro}</p>
            <div className="flag-specs mt-6">
              <div>
                <small>Botanical source</small>
                <span>
                  <i>{p.botanicalSource.split(" (")[0]}</i>
                </span>
              </div>
              <div>
                <small>Plant part</small>
                <span>{p.plantPart}</span>
              </div>
              <div>
                <small>Quality marker</small>
                <span>{p.marker.split(",")[0]}</span>
              </div>
              <div>
                <small>Every lot</small>
                <span>Tested before labelling</span>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={`/products/${p.slug}`} className="btn">
                View {p.short}
              </Link>
              <Link href="/sample" className="btn btn-ghost">
                Request a sample
              </Link>
            </div>
          </div>
        </div>
        <div className="flag-art" style={{ ["--sw" as string]: p.swatch }}>
          <LazyScene
            variant={p.slug}
            tint={p.swatch}
            fallback={
              <div className="grid size-full place-items-center">
                <ProductOrb product={p} size="lg" uid="spot-fallback" />
              </div>
            }
          />
          <div className="mono pointer-events-none absolute inset-x-[18px] bottom-4 flex justify-between gap-3 text-[0.72rem] text-on-band-muted">
            <span>3D · {MARKER_LABEL[p.slug] ?? p.marker} · illustrative</span>
            <span>Drag to rotate</span>
          </div>
        </div>
      </div>
    </section>
  );
}
