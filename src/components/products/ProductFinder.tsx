"use client";

import { useState } from "react";
import type { Product } from "@/content/types";
import { ProductCard } from "@/components/product/ProductCard";

const FILTERS = [
  { id: "all", label: "All extracts", match: [] as string[] },
  { id: "nutra", label: "Nutraceutical & wellness", match: ["nutraceutical", "wellness", "supplement"] },
  { id: "ayur", label: "Ayurvedic & traditional", match: ["ayurvedic", "traditional"] },
  { id: "cosmetic", label: "Cosmetic & personal care", match: ["cosmetic", "skin", "personal-care"] },
  { id: "food", label: "Functional food & colour", match: ["food", "colour"] },
] as const;

/** Product grid with application filters. Categories come from each product's listed applications. */
export function ProductFinder({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const f = FILTERS.find((x) => x.id === filter) ?? FILTERS[0];
  const shown = products.filter((p) => {
    if (f.match.length === 0) return true;
    const text = `${p.applicationArea} ${p.applications.join(" ")}`.toLowerCase();
    return f.match.some((m) => text.includes(m));
  });

  return (
    <div className="grid gap-8">
      <div className="finder-chips" role="group" aria-label="Filter by application">
        {FILTERS.map((x) => (
          <button key={x.id} type="button" aria-pressed={filter === x.id} onClick={() => setFilter(x.id)}>
            {x.label}
          </button>
        ))}
      </div>
      <div className="grid gap-[26px] sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
        {shown.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </div>
  );
}
