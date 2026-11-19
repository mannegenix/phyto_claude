import type { Product } from "@/content/types";
import { ProductOrb } from "./ProductOrb";

/** Product "batch label" card: the site's signature element. */
export function BatchTag({ product }: { product: Product }) {
  return (
    <div className="tag">
      <div className="tag-top">
        <span className="tag-hole" />
        <span>{product.short} · Bulk extract</span>
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
        <dd>{product.spec?.gradeAssay ?? "Shared on request"}</dd>
        <dt>Documents</dt>
        <dd>Spec · COA · SDS</dd>
      </dl>
      <div className="tag-foot">
        <span>Every lot tested · COA with every lot</span>
      </div>
    </div>
  );
}
