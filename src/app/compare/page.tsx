import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteConfig, THEMES } from "@/config/site";
import { getProducts } from "@/lib/content";
import { ComparePanes } from "./ComparePanes";

export const metadata: Metadata = {
  title: "Compare colour routes",
  robots: { index: false, follow: false },
};

/**
 * Review-only page: the same page in two colour routes, side by side, with synced
 * scrolling. Exists only when NEXT_PUBLIC_SHOW_THEME_SWITCHER=true; a 404 otherwise.
 */
export default async function ComparePage() {
  if (!siteConfig.showThemeSwitcher) notFound();
  const products = await getProducts();
  const pages = [
    { path: "/", label: "Home" },
    ...products.map((p) => ({ path: `/products/${p.slug}`, label: p.short })),
    { path: "/products", label: "Products" },
    { path: "/manufacturing", label: "Manufacturing & Quality" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ];
  return (
    <ComparePanes
      themes={THEMES.map((t) => ({ id: t.id, label: t.label }))}
      pages={pages}
      left={siteConfig.defaultTheme}
      right="labgreen"
    />
  );
}
