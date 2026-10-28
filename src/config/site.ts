/**
 * Site-wide configuration.
 *
 * `defaultTheme` is the colour route the live site renders with. Every route stays
 * defined here and in themes.css so any of them can be brought back by changing
 * `defaultTheme`. In review mode (NEXT_PUBLIC_SHOW_THEME_SWITCHER=true) routes can
 * also be previewed with ?theme=<id> and side by side on /compare.
 *
 * Route numbers are stable references for client conversations.
 */
export const THEMES = [
  { id: "greenlight", no: "R01", label: "Green light", swatch: ["#2b8530", "#9bd866"] },
  { id: "greendark", no: "R02", label: "Green dark", swatch: ["#0d3b2e", "#15583f"] },
  { id: "bluelight", no: "R03", label: "Blue light", swatch: ["#15dbeb", "#0a9fd8", "#f04e12"] },
  { id: "bluevivid", no: "R04", label: "Blue vivid", swatch: ["#1d6bf3", "#15dbeb"] },
  { id: "bluegreen", no: "R05", label: "Blue + green (original)", swatch: ["#15dbeb", "#22c55e"] },
  { id: "bluedark", no: "R06", label: "Blue dark", swatch: ["#0d838c", "#ffb627"] },
  /** Selected route: Lab green + blue. Indena-style lab look in light tones with a blue testing splash. */
  { id: "lablight", no: "R07", label: "Lab green + blue (selected)", swatch: ["#2f8f2e", "#8fd14f", "#15dbeb"] },
  /** Dark edition of the lab route, kept for reference. */
  { id: "labgreen", no: "R08", label: "Lab green dark", swatch: ["#141615", "#8fd14f", "#15dbeb"] },
  { id: "labday", no: "R09", label: "Lab daylight", swatch: ["#e4f6cf", "#8fd14f", "#0a76b3"] },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

export const siteConfig = {
  name: "Phyto Elements",
  domain: "phytoelements.in",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://phytoelements.in",
  tagline: "Botanical Ingredients for Global Markets",
  description:
    "Phyto Elements is an India-based B2B supplier of bulk plant extracts. Every lot is tested against our specification, and only what passes carries our name.",
  defaultTheme: "lablight" as ThemeId,
  /** Review mode: enables /compare and ?theme= previews. Never enable in production. */
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
  { href: "/operations", label: "How we work" },
  { href: "/manufacturing", label: "Manufacturing & Quality" },
  { href: "/resources", label: "Resources" },
  { href: "/contact", label: "Contact" },
] as const;
