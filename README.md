# Phyto Elements · phytoelements.in

Product-led B2B website for Phyto Elements, a manufacturer of bulk plant extracts.
Built for scroll-driven video, 3D, animation, a grounded chatbot and a CMS.

## Quick start

```bash
npm install
cp .env.example .env.local     # review switches are on; integrations optional
npm run dev                    # http://localhost:3000
```

Requires Node.js 20.9+ (Node 22 or 24 recommended). For scroll-video frames you also need ffmpeg (`brew install ffmpeg`).

## Scripts

| Command                                | What it does                                                                        |
| -------------------------------------- | ----------------------------------------------------------------------------------- |
| `npm run dev`                          | Dev server (Turbopack)                                                              |
| `npm run build` / `npm start`          | Production build / serve                                                            |
| `npm run lint`                         | ESLint (includes React Compiler rules)                                              |
| `npm run typecheck`                    | Generates route types, runs `tsc`                                                   |
| `npm run format`                       | Prettier + Tailwind class sorting                                                   |
| `npm run preview`                      | Build for Cloudflare and run it in the local Workers runtime                        |
| `npm run deploy`                       | Build for Cloudflare and deploy                                                     |
| `npm run frames -- <video.mp4> <name>` | Converts a video into a scroll-scrubbed WebP sequence in `public/sequences/<name>/` |

## Stack

| Layer           | Choice                                                                                           |
| --------------- | ------------------------------------------------------------------------------------------------ |
| Framework       | Next.js 16 (App Router, Turbopack, Cache Components), React 19, TypeScript                       |
| Styling         | Tailwind CSS v4 + theme tokens (CSS variables) in `src/styles/themes.css`                        |
| Scroll & motion | GSAP + ScrollTrigger, Lenis smooth scroll, Motion (Framer Motion)                                |
| 3D              | three.js via React Three Fiber + drei, lazy-loaded                                               |
| Forms           | Server Action + zod validation, Cloudflare Turnstile, Resend email, CRM webhook                  |
| Chatbot         | Vercel AI SDK + Claude (Anthropic provider), answers only from site content                      |
| Fonts           | Self-hosted variable fonts via @fontsource (Bricolage Grotesque, Hanken Grotesk, JetBrains Mono) |
| Content         | Typed local content in `src/content/`, read through `src/lib/content.ts` (CMS-ready)             |

## Project structure

```
src/
  app/                     routes: /, /about, /products, /products/[slug], /operations,
                           /manufacturing, /resources, /sample, /contact, /privacy
    actions/enquiry.ts     enquiry Server Action (validate → spam check → email → CRM)
    api/chat/route.ts      grounded chatbot endpoint
  components/
    layout/                Header, Footer, Logo (traced vector mark)
    sections/              homepage sections, EnquirySection
    product/               BatchTag, ProductCard, SpecSheet, EnquiryButtons
    forms/EnquiryForm.tsx  client form (keeps input on validation errors)
    motion/                SmoothScroll, Reveal, ScrollVideo (+ placeholder animation)
    three/                 MoleculeScene (R3F), LazyScene (viewport + reduced-motion gate)
    chat/ChatWidget.tsx    floating assistant
    dev/ThemeSwitcher.tsx  colour-route switcher for client reviews
    ui/                    PageHead, MailList, ReviewNote
  content/                 products.ts, company.ts, types.ts  ← all site copy lives here
  config/site.ts           site settings, default theme, nav, feature flags
  lib/                     content access, env, enquiry schema, chatbot instructions
  styles/                  themes.css (6 colour routes), components.css
public/sequences/          scroll-video frame sequences
scripts/extract-frames.mjs video → WebP frames + manifest
```

## Colour routes (themes)

Six routes from the client reviews: `greenlight`, `greendark`, `bluelight`, `bluevivid`, `bluegreen`, `bluedark`.

- The live site uses `siteConfig.defaultTheme` in `src/config/site.ts`.
- `NEXT_PUBLIC_SHOW_THEME_SWITCHER=true` shows the switcher (bottom-left) for client reviews.
- When the client picks a route: set `defaultTheme`, turn the switcher off, and optionally delete the unused routes from `themes.css`.
- Components only use tokens (`bg-paper`, `text-heading`, `bg-accent`, `.band`, …), never raw colours.

### Colour depth, text clarity and 4K

- **Wide-gamut colour:** `themes.css` ends with a `@media (color-gamut: p3)` layer. On Display P3 screens (recent Macs, iPhones, most 4K monitors) brand colours render 30–45% more saturated; other screens get a smaller sRGB boost. Lightness is unchanged, so contrast is identical. If you edit a brand colour, update its P3 line too (same hue/lightness, higher chroma, written as `oklch(...)`).
- **Polish layer:** `src/styles/polish.css` holds the depth effects (button gradients and glows, hero colour glow, section sheen, coloured shadows, card top edges) and the typography tuning (17px / weight 420 body text, optical sizing, stronger secondary text at ≥7:1 contrast).
- **High-DPI:** the scroll-video canvas and the 3D scene render at up to 3× device pixels; frames extract at 1920px by default (`--width 2560` for 4K). All logos and illustrations are vector.

## Sticky split-screen scroll video

`<ScrollVideo steps={…} sequence="process" />` pins the media panel while the step panels scroll; the frame shown is tied to scroll position.

1. Get the clip (5–15 s, 1080p MP4 works best).
2. `npm run frames -- ~/Downloads/process.mp4 process --fps 24 --width 1280`
3. Reload. The component reads `public/sequences/process/manifest.json` and plays the frames.

Until frames exist it draws a procedural placeholder (botanical → extraction → standardization → testing → packed drum).
Tips: use `--fps 15` for lighter pages; serve `/sequences` from a CDN in production (cache headers are already immutable).

## 3D

`LazyScene` mounts `MoleculeScene` only when the panel nears the viewport and never for reduced-motion visitors, so three.js is not in the initial bundle. To use a real model: put a `.glb` in `public/models/`, load it with drei's `useGLTF`, and keep the fallback image.

## Enquiry form

Fields follow the brief (§7). Behaviour without keys: submissions validate and are logged to the server console.

| Variable                                                 | Purpose                                                                |
| -------------------------------------------------------- | ---------------------------------------------------------------------- |
| `RESEND_API_KEY`, `ENQUIRY_FROM`                         | Email delivery. Verify phytoelements.in in Resend (SPF/DKIM).          |
| `ENQUIRY_TO`, `SAMPLES_CC`                               | Routing: sales@, plus samples@ for sample requests                     |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Spam protection                                                        |
| `CRM_WEBHOOK_URL`                                        | Posts each lead as JSON to Zoho Flow / HubSpot (via Make/Zapier) / n8n |

Buyer specification uploads: PDF/Word/Excel up to 5 MB, attached to the email.

## Chatbot

Set `ANTHROPIC_API_KEY` and `NEXT_PUBLIC_CHAT_ENABLED=true`. Instructions are built from `src/content` in `src/lib/chat-context.ts`; the assistant is told never to state unpublished specs, certifications or health claims, and to route quotes/samples to the form. Default model `claude-haiku-5-5` (`CHAT_MODEL` to change). Add rate limiting (e.g. Upstash) before launch.

## Deploying to Cloudflare (Workers)

The site deploys to **Cloudflare Workers** through the [OpenNext adapter](https://opennext.js.org/cloudflare) (`@opennextjs/cloudflare`).
A full Next.js app (server actions, the chat API, server rendering) needs Workers. Cloudflare Pages only hosts static sites or the deprecated `next-on-pages`; both live under **Workers & Pages** in the dashboard.

### One-time setup

1. **R2 bucket** for the Next.js cache: dashboard → R2 → Create bucket → `phyto-elements-opennext-cache`
   (or `npx wrangler r2 bucket create phyto-elements-opennext-cache`).
2. **Connect the repo**: Workers & Pages → Create → Workers → _Import a repository_ → pick the GitHub repo.
3. **Build settings** (Worker → Settings → Build):

   | Setting                              | Value                                                        |
   | ------------------------------------ | ------------------------------------------------------------ |
   | Project / Worker name                | `phyto-elements` (must match `name` in `wrangler.jsonc`)     |
   | Root directory                       | `/`                                                          |
   | Build command                        | `npx opennextjs-cloudflare build`                            |
   | Deploy command                       | `npx opennextjs-cloudflare deploy`                           |
   | Non-production branch deploy command | `npx opennextjs-cloudflare upload` (preview URLs per branch) |
   | Node version                         | from `.node-version` (22)                                    |

4. **Build variables** (Settings → Build → Variables and secrets). `NEXT_PUBLIC_*` values are baked in at build time:
   `NEXT_PUBLIC_SITE_URL=https://phytoelements.in`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `NEXT_PUBLIC_CHAT_ENABLED`,
   and for review deployments only `NEXT_PUBLIC_SHOW_THEME_SWITCHER=true`, `NEXT_PUBLIC_SHOW_REVIEW_NOTES=true`.
5. **Runtime secrets** (Worker → Settings → Variables and Secrets, type _Secret_), or `npx wrangler secret put NAME`:
   `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, `ANTHROPIC_API_KEY`, `CRM_WEBHOOK_URL`.
   Non-secret routing values (`ENQUIRY_TO`, `SAMPLES_CC`, `ENQUIRY_FROM`, `CHAT_MODEL`) are in `wrangler.jsonc` → `vars`.
6. **Custom domain**: Worker → Settings → Domains & Routes → Add → `phytoelements.in` (and `www`).

Every push to the production branch then builds and deploys automatically.

### From your machine

```bash
npx wrangler login
npm run preview   # build + run in the local Workers runtime (http://localhost:8787); secrets from .dev.vars
npm run deploy    # build + deploy to Cloudflare
```

### Cloudflare notes

- `cacheComponents` / `"use cache"` are **off on purpose**: they hang on the Workers runtime. Pages are statically generated at build time and served from R2 + static assets.
- Env vars are read at request time through `getEnv()` (src/lib/env.ts), because Workers inject secrets per request.
- Static files (frames in `/sequences`, `/_next/static`) get long-lived cache headers from `public/_headers`.
- Worker bundle is ~1.6 MB gzipped, within the Free plan's 3 MB limit. Keep three.js and other heavy libraries client-side (they already are).
- Node.js middleware isn't supported by the adapter; the project doesn't use middleware.

## Content governance (from the brief)

- Spec values (`spec` in `products.ts`) stay empty until QA-approved; the UI shows "Shared on request".
- No capacity, certification, equipment or years-in-operation claims until verified.
- `NEXT_PUBLIC_SHOW_REVIEW_NOTES=true` shows the "review before launch" notes on every page.

## Moving to a CMS

Replace the bodies of `getProducts`, `getProduct` and `getCompany` in `src/lib/content.ts` with Sanity or Payload queries. Types in `src/content/types.ts` define the schema; pages don't change.

## Launch checklist (brief §10)

- [ ] Client colour route set in `site.ts`; switcher and review notes off
- [ ] Botanical sources, plant parts and any spec values QA-approved
- [ ] Resend domain verified; test emails to all five mailboxes
- [ ] Turnstile keys set; CRM webhook tested
- [ ] Legal name/address on contact page and footer
- [ ] Privacy notice reviewed (DPDP Act 2023 / GDPR); cookie controls if analytics added
- [ ] Analytics + form-conversion events
- [ ] R2 bucket created; Workers Builds connected; build variables and secrets set
- [ ] Custom domain attached; HTTPS verified
- [ ] Scroll-video frames served with cache headers; Lighthouse check on mobile
