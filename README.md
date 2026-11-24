# Phyto Elements · phytoelements.in

Product-led B2B website for Phyto Elements, a supplier of bulk plant extracts: sourced widely, tested lot by lot, and only what passes carries the Phyto Elements name.
Built for full-screen scroll motion, a tested-lot hero animation and a CMS-ready content layer.

## Quick start

```bash
npm install
cp .env.example .env.local     # integrations optional
npm run dev                    # http://localhost:3000
```

Requires Node.js 20.9+ (Node 22 or 24 recommended).

## Scripts

| Command                       | What it does                                                 |
| ----------------------------- | ------------------------------------------------------------ |
| `npm run dev`                 | Dev server (Turbopack)                                       |
| `npm run build` / `npm start` | Production build / serve                                     |
| `npm run lint`                | ESLint (includes React Compiler rules)                       |
| `npm run typecheck`           | Generates route types, runs `tsc`                            |
| `npm run format`              | Prettier + Tailwind class sorting                            |
| `npm run preview`             | Build for Cloudflare and run it in the local Workers runtime |
| `npm run deploy`              | Build for Cloudflare and deploy                              |

## Stack

| Layer           | Choice                                                                                           |
| --------------- | ------------------------------------------------------------------------------------------------ |
| Framework       | Next.js 16 (App Router, Turbopack), React 19, TypeScript                                         |
| Styling         | Tailwind CSS v4 + theme tokens (CSS variables) in `src/styles/themes.css`                        |
| Scroll & motion | GSAP + ScrollTrigger, Lenis smooth scroll, Motion (Framer Motion)                                |
| Forms           | Server Action + zod validation, Cloudflare Turnstile, Resend email, CRM webhook                  |
| Fonts           | Self-hosted variable fonts via @fontsource (Bricolage Grotesque, Hanken Grotesk, JetBrains Mono) |
| Content         | Typed local content in `src/content/`, read through `src/lib/content.ts` (CMS-ready)             |

## Project structure

```
src/
  app/                     routes: /, /about, /products, /products/[slug], /operations,
                           /manufacturing, /sample, /contact, /privacy
                           not-found.tsx (404), error.tsx (500), global-error.tsx
    actions/enquiry.ts     enquiry Server Action (validate → spam check → email → CRM)
  components/
    layout/                Header, Footer, MobileDock, Logo (approved client artwork in public/brand)
    hero/                  SpecimenHero (lot-testing canvas), HeroScene, HeroTicker, HeroMode
    sections/              homepage sections, DockCarousel, SealViews, EnquirySection
    product/, products/    ProductCard, ProductOrb, SpecSheet, ProductCarousel, ProductFinder
    forms/EnquiryForm.tsx  client form (keeps input on validation errors)
    motion/                Preloader, RouteTransition, SmoothScroll, PanelScroll, Reveal, FxGuard
    ui/                    PageHead, MailList, OpIcon, RailDots
  content/                 products.ts, company.ts, types.ts  ← all site copy lives here
  config/site.ts           site settings, theme, nav, indexing switch
  lib/                     content access, env, enquiry schema, motion/hero/look boot scripts
  styles/                  themes.css (tokens), lab.css + verdan.css (theme), logo.css (look),
                           motion.css, mobile.css, dock.css, hero-dev1.css, system-pages.css
```

## Theme and look

- One colour route: R10 "Verdan light" (`verdan`, `siteConfig.defaultTheme`), tokens in `src/styles/themes.css`, built on `lab.css` + `verdan.css`.
- One look: the Logo look (`html.pe-logo`, `src/styles/logo.css`) — only the three logo colours (deep green #02584A, leaf lime #94DE03, sun yellow #FDCE18) on white and pale tints.
- Components only use tokens (`bg-paper`, `text-heading`, `bg-accent`, `.band`, …), never raw colours.
- The other routes (R01–R09), the Gradient/Light looks and the review compare page were removed on Nov 24; they are in git history.
- **Polish layer:** `src/styles/polish.css` holds the depth effects and the typography tuning (weight 420 body text, optical sizing, stronger secondary text).

## Enquiry form

Fields follow the brief (§7). Behaviour without keys: submissions validate and are logged to the server console.

| Variable                                                 | Purpose                                                                |
| -------------------------------------------------------- | ---------------------------------------------------------------------- |
| `RESEND_API_KEY`, `ENQUIRY_FROM`                         | Email delivery. Verify phytoelements.in in Resend (SPF/DKIM).          |
| `ENQUIRY_TO`                                             | Inbox for every enquiry (info@phytoelements.in)                        |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Spam protection                                                        |
| `CRM_WEBHOOK_URL`                                        | Posts each lead as JSON to Zoho Flow / HubSpot (via Make/Zapier) / n8n |

Buyer specification uploads: PDF/Word/Excel up to 5 MB, attached to the email.

## Deploying to Cloudflare (Workers)

The site deploys to **Cloudflare Workers** through the [OpenNext adapter](https://opennext.js.org/cloudflare) (`@opennextjs/cloudflare`).
A full Next.js app (server actions, server rendering) needs Workers. Cloudflare Pages only hosts static sites or the deprecated `next-on-pages`; both live under **Workers & Pages** in the dashboard.

### One-time setup

1. **No R2 bucket needed.** Pages are prerendered and the Next.js cache is served read-only from
   Workers static assets (`open-next.config.ts`). Add R2 only if ISR/revalidation is introduced.
2. **Connect the repo**: Workers & Pages → Create → Workers → _Import a repository_ → pick the GitHub repo.
3. **Build settings** (Worker → Settings → Build):

   | Setting                              | Value                                                          |
   | ------------------------------------ | -------------------------------------------------------------- |
   | Project / Worker name                | `phytoelements-claude` (must match `name` in `wrangler.jsonc`) |
   | Root directory                       | `/`                                                            |
   | Build command                        | `npx opennextjs-cloudflare build`                              |
   | Deploy command                       | `npx opennextjs-cloudflare deploy`                             |
   | Non-production branch deploy command | `npx opennextjs-cloudflare upload` (preview URLs per branch)   |
   | Node version                         | from `.node-version` (22)                                      |

4. **Build variables** (Settings → Build → Variables and secrets). `NEXT_PUBLIC_*` values are baked in at build time:
   `NEXT_PUBLIC_SITE_URL=https://phytoelements.in`, `NEXT_PUBLIC_ALLOW_INDEXING=true` (go-live switch; leave unset until launch), `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.
5. **Runtime secrets** (Worker → Settings → Variables and Secrets, type _Secret_), or `npx wrangler secret put NAME`:
   `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, `CRM_WEBHOOK_URL`.
   Non-secret routing values (`ENQUIRY_TO`, `ENQUIRY_FROM`) are in `wrangler.jsonc` → `vars`.
6. **Custom domain**: Worker → Settings → Domains & Routes → Add → `phytoelements.in` (and `www`).

Every push to the production branch then builds and deploys automatically.

### From your machine

```bash
npx wrangler login
npm run preview   # build + run in the local Workers runtime (http://localhost:8787); secrets from .dev.vars
npm run deploy    # build + deploy to Cloudflare
```

### Cloudflare notes

- `cacheComponents` / `"use cache"` are **off on purpose**: they hang on the Workers runtime. Pages are statically generated at build time and served from Workers static assets.
- Env vars are read at request time through `getEnv()` (src/lib/env.ts), because Workers inject secrets per request.
- Static files (`/_next/static`) get long-lived cache headers from `public/_headers`.
- Worker bundle is ~1.6 MB gzipped, within the Free plan's 3 MB limit.
- Node.js middleware isn't supported by the adapter; the project doesn't use middleware.

## Content governance (from the brief)

- Spec values (`spec` in `products.ts`) stay empty until QA-approved; the UI shows "Shared on request".
- No capacity, certification, equipment or years-in-operation claims until verified.

## Moving to a CMS

Replace the bodies of `getProducts`, `getProduct` and `getCompany` in `src/lib/content.ts` with Sanity or Payload queries. Types in `src/content/types.ts` define the schema; pages don't change.

## Launch checklist (brief §10)

- [ ] Botanical sources, plant parts and any spec values QA-approved
- [ ] Resend domain verified; test emails reach info@
- [ ] Turnstile keys set; CRM webhook tested
- [ ] Legal name/address on contact page and footer
- [ ] Privacy notice reviewed (DPDP Act 2023 / GDPR); cookie controls if analytics added
- [ ] Analytics + form-conversion events
- [ ] Workers Builds connected; build variables and secrets set
- [ ] Custom domain attached; HTTPS verified
- [ ] Lighthouse check on mobile

## Creative layer (motion)

| Piece                      | Where                                                                                      | Notes                                                                                                                          |
| -------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| Preloader "The Drop"       | `src/components/motion/Preloader.tsx`                                                      | Pure CSS, about 2 s, once per session, skipped for reduced motion.                                                             |
| Hero "The Living Specimen" | `src/components/hero/SpecimenHero.tsx`                                                     | Canvas particles: lots in, test gate, rejects fall, passes form the botanical. Cycles through the products. Pauses off screen. |
| Hero ticker                | `hero/HeroTicker.tsx`                                                                      | Follows the hero lot animation (Lot in → Testing → Passed).                                                                    |
| Liquid section edges       | `.wave-top` in `motion.css`                                                                | Masked wave on a section's top edge, slow drift.                                                                               |
| Test pillars               | `TestPillars`                                                                              | Identity, purity, potency, safety, stability. Generic until the client confirms methods.                                       |
| Source to seal             | `DockCarousel` (home), `SealStepper` in `sections/SealViews.tsx` (Manufacturing & Quality) | Photo carousel / auto-playing steps. Illustrative.                                                                             |
| Product page               | `src/app/products/[slug]/page.tsx`                                                         | Product photo, specification summary, full portfolio rail with Previous / Next.                                                |

## Product imagery

Each product shows its botanical inside a tinted glass orb (`components/product/ProductOrb.tsx`). A product added without a photo falls back to a full-colour illustration (`components/botanicals/Illustration.tsx`). To use a photo, add it to `public/images/products/` and set `image: "/images/products/<slug>.webp"` on the product in `src/content/products.ts`; every orb (cards, labels, products carousel) switches to the photo. Square images, at least 800 × 800, work best.

The products page is a showcase carousel (`components/products/ProductCarousel.tsx`), an application filter grid (`ProductFinder.tsx`) and a collapsible comparison table.

## Full-screen sections

Every page reads as a series of screens (`components/motion/PanelScroll.tsx`): each top-level `<section>` fills the viewport and stays put while the next one rises over it; one wheel or trackpad gesture moves one screen, and taller sections are stepped through. The background pattern is fixed, so only the content changes; incoming content drifts up, outgoing content recedes, and a drop of extract falls with ripples at each change. Touch devices scroll natively with the same stacking. Reduced-motion visitors get a normal page.
