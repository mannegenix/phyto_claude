import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  // Dev and preview addresses (e.g. dev2.phytoelements.in) are closed to crawlers.
  if (!siteConfig.indexable) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/", disallow: "/api/" }, sitemap: `${siteConfig.url}/sitemap.xml` };
}
