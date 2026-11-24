import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { OG_PRODUCT_SLUGS } from "@/lib/og-images";

/** Site-wide share image (public/og/site.jpg, 1200×630). Made by scripts/og-images.mjs. */
export const OG_SITE = "/og/site.jpg";

/** Share image for a product: its own card when one has been made, else the site image. */
export const productOgImage = (slug: string) =>
  (OG_PRODUCT_SLUGS as readonly string[]).includes(slug) ? `/og/${slug}.jpg` : OG_SITE;

/**
 * Metadata for one page: title, description, canonical address, and the share card
 * (Open Graph / Twitter). Next.js merges metadata shallowly, so every page sets its own
 * openGraph in full through this helper rather than relying on the layout's.
 */
export function pageMetadata({
  title,
  description,
  path,
  image = OG_SITE,
  imageAlt,
}: {
  title?: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
}): Metadata {
  const shareTitle = title
    ? `${title} · ${siteConfig.name}`
    : `${siteConfig.name} · Bulk Plant Extracts for Global Markets`;
  const images = [{ url: image, width: 1200, height: 630, alt: imageAlt ?? shareTitle }];
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      siteName: siteConfig.name,
      type: "website",
      locale: "en_IN",
      url: path,
      title: shareTitle,
      description,
      images,
    },
    twitter: { card: "summary_large_image", title: shareTitle, description, images: [image] },
  };
}

/** Organization + WebSite structured data (homepage). Only facts already on the site. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteConfig.url}/#organization`,
        name: siteConfig.name,
        url: siteConfig.url,
        logo: `${siteConfig.url}/brand/logo.png`,
        email: "info@phytoelements.in",
        description: siteConfig.description,
        address: { "@type": "PostalAddress", addressLocality: "Hyderabad", addressCountry: "IN" },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "sales",
          email: "info@phytoelements.in",
          areaServed: "Worldwide",
          availableLanguage: "English",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        publisher: { "@id": `${siteConfig.url}/#organization` },
        inLanguage: "en-IN",
      },
    ],
  };
}
