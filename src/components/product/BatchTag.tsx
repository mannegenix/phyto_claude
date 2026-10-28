import type { Product } from "@/content/types";
import { ProductOrb } from "./ProductOrb";

/** Deterministic decorative barcode widths (pure function, computed outside render). */
function barcodeBars(seed: number) {
  const bars: { w: number; faint: boolean }[] = [];
  for (let i = 0, x = seed; i < 34; i += 1) {
    x = (x * 9301 + 49297) % 233280;
    bars.push({ w: 1 + (x % 3), faint: i % 5 === 0 });
  }
  return bars;
}

function Barcode({ seed }: { seed: number }) {
  const bars = barcodeBars(seed);
  return (
    <span className="flex h-[22px] gap-[2px]" aria-hidden="true">
      {bars.map((b, i) => (
        <i key={i} className="block bg-ink" style={{ width: b.w, opacity: b.faint ? 0.25 : 0.75 }} />
      ))}
    </span>
  );
}

/** Product "batch label" card: the site's signature element. */
export function BatchTag({ product }: { product: Product }) {
  return (
    <div className="tag">
      <div className="tag-top">
        <span className="tag-hole" />
        <span>{product.code} · BULK EXTRACT</span>
        <span className={`chip ${product.flagship ? "chip-flag" : ""}`}>{product.role}</span>
      </div>
      <div className="flex items-start justify-between gap-3 pr-[18px]">
        <div className="min-w-0">
          <div className="tag-name">{product.name}</div>
          <div className="tag-src">{product.botanicalSource}</div>
        </div>
        <ProductOrb product={product} size="sm" uid="tag" className="mt-3.5" />
      </div>
      <dl>
        <dt>Plant part</dt>
        <dd>{product.plantPart}</dd>
        <dt>Marker</dt>
        <dd>{product.marker.split(",")[0]}</dd>
        <dt>Grade / assay</dt>
        <dd className="req">Per our specification</dd>
        <dt>Documents</dt>
        <dd>Spec · COA · SDS</dd>
      </dl>
      <div className="tag-foot">
        <span>Lot No. ________ · Tested</span>
        <Barcode seed={product.code.charCodeAt(4) * 7} />
      </div>
    </div>
  );
}
