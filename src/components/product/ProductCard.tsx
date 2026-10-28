import Link from "next/link";
import type { Product } from "@/content/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`} className="card">
      <div className="flex items-center justify-between gap-2.5">
        <span className="mono text-[0.74rem] text-muted">{product.code}</span>
        {product.flagship ? (
          <span className="chip chip-flag">Flagship</span>
        ) : (
          <span className="chip">{product.role.replace(" product", "")}</span>
        )}
      </div>
      <div className="flex items-center gap-3.5">
        <div className="swatch" style={{ ["--sw" as string]: product.swatch }} />
        <div className="min-w-0">
          <h3>{product.name}</h3>
          <div className="mt-1 text-[0.92rem] text-muted italic">{product.botanicalSource.split(" (")[0]}</div>
        </div>
      </div>
      <dl>
        <div>
          <dt>Marker</dt>
          <dd>{product.marker.split(",")[0]}</dd>
        </div>
        <div>
          <dt>Use</dt>
          <dd>{product.applicationArea.split(",")[0].replace(" formulations", "")}</dd>
        </div>
      </dl>
      <span className="text-[0.92rem] font-semibold text-accent-text">View product &amp; enquire →</span>
    </Link>
  );
}
