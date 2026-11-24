/**
 * Site-wide configuration.
 *
 * `defaultTheme` is the colour route the site renders with (tokens in styles/themes.css).
 * Since Nov 24 only R10 "Verdan light" is kept; the other routes were removed.
 */
export const THEMES = [
  /** Verdan light: white + pale sage glass, chartreuse, from the client's "Verdan Farm OS" reference. */
  { id: "verdan", no: "R10", label: "Verdan light", swatch: ["#f8faf5", "#e4ebdc", "#c8e068"] },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

export const siteConfig = {
  name: "Phyto Elements",
  domain: "phytoelements.in",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://phytoelements.in",
  /**
   * Search engines may index the site only when BOTH are true:
   *  - NEXT_PUBLIC_SITE_URL is the live domain (phytoelements.in / www), and
   *  - NEXT_PUBLIC_ALLOW_INDEXING is "true" (the go-live switch).
   * Anything else (dev2, *.workers.dev, previews, the live domain while it is still being
   * tested, or the variables missing) is served with noindex and a disallow-all robots.txt.
   */
  indexable:
    process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true" &&
    ["phytoelements.in", "www.phytoelements.in"].includes(
      new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://dev2.phytoelements.in").hostname,
    ),
  tagline: "Botanical ingredients for global markets",
  description:
    "Phyto Elements, based in Hyderabad, India, supplies bulk plant extracts to Indian & Global buyers. Every lot is tested to recognised global quality standards, and only what passes carries our name.",
  defaultTheme: "verdan" as ThemeId,
  /**
   * Privacy / Terms / Cookies are hidden until the client supplies the details: /privacy
   * answers 404, and the footer and enquiry-form links are not shown. Set true to publish.
   */
  legalPagesLive: false,
};

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/products/garcinia", label: "Flagship: Garcinia", flag: true },
  { href: "/operations", label: "How we work" },
  { href: "/manufacturing", label: "Manufacturing & Quality" },
  { href: "/contact", label: "Contact" },
] as const;
