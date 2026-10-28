import Image from "next/image";
import type { Product } from "@/content/types";
import { Illustration } from "@/components/botanicals/Illustration";

/**
 * The product's visual: its botanical inside a glass orb, tinted with the product colour.
 * Shows the product photo when `image` is set in products.ts, otherwise the illustration.
 */
export function ProductOrb({
  product,
  size = "md",
  uid = size,
  className = "",
}: {
  product: Pick<Product, "slug" | "short" | "swatch" | "image">;
  size?: "sm" | "md" | "lg" | "xl";
  uid?: string;
  className?: string;
}) {
  return (
    <div className={`orb orb-${size} ${className}`} style={{ ["--sw" as string]: product.swatch }}>
      {product.image ? (
        <Image src={product.image} alt={product.short} fill sizes="(max-width: 700px) 60vw, 360px" unoptimized />
      ) : (
        <Illustration slug={product.slug} uid={uid} className="orb-art" />
      )}
    </div>
  );
}
