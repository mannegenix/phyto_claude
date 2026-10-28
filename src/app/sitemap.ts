import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getProducts } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  const pages = [
    "",
    "/about",
    "/products",
    "/operations",
    "/manufacturing",
    "/resources",
    "/sample",
    "/contact",
    "/privacy",
  ];
  return [
    ...pages.map((p) => ({
      url: `${siteConfig.url}${p}`,
      changeFrequency: "monthly" as const,
      priority: p === "" ? 1 : 0.7,
    })),
    ...products.map((p) => ({
      url: `${siteConfig.url}/products/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ];
}
