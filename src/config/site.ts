/**
 * Site-wide configuration.
 *
 * `defaultTheme` is the colour route the live site renders with. Once the client
 * picks a route, set it here and leave NEXT_PUBLIC_SHOW_THEME_SWITCHER unset in
 * production so visitors only ever see the chosen theme.
 */
export const THEMES = [
  { id: "greenlight", label: "Green light", swatch: ["#2b8530", "#9bd866"] },
  { id: "greendark", label: "Green dark", swatch: ["#0d3b2e", "#15583f"] },
  { id: "bluelight", label: "Blue light", swatch: ["#15dbeb", "#0a9fd8", "#f04e12"] },
  { id: "bluevivid", label: "Blue vivid", swatch: ["#1d6bf3", "#15dbeb"] },
  { id: "bluegreen", label: "Blue + green", swatch: ["#15dbeb", "#22c55e"] },
  { id: "bluedark", label: "Blue dark", swatch: ["#0d838c", "#ffb627"] },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

export const siteConfig = {
  name: "Phyto Elements",
  domain: "phytoelements.in",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://phytoelements.in",
  tagline: "Botanical Ingredients for Global Markets",
  description:
    "Phyto Elements is an India-based B2B manufacturer of bulk plant extracts for Indian and global markets.",
  defaultTheme: "greenlight" as ThemeId,
  /** Shows the colour-route switcher for client reviews. Never enable in production. */
  showThemeSwitcher: process.env.NEXT_PUBLIC_SHOW_THEME_SWITCHER === "true",
  /** Shows "review before launch" notes for internal content review. */
  showReviewNotes: process.env.NEXT_PUBLIC_SHOW_REVIEW_NOTES === "true",
  /** Chat widget appears only when the API key is configured server-side and this flag is on. */
  chatEnabled: process.env.NEXT_PUBLIC_CHAT_ENABLED === "true",
};

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/products/garcinia", label: "Flagship: Garcinia", flag: true },
  { href: "/operations", label: "Operations" },
  { href: "/manufacturing", label: "Manufacturing & Quality" },
  { href: "/resources", label: "Resources" },
  { href: "/contact", label: "Contact" },
] as const;
