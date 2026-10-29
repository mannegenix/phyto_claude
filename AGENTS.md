<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project conventions (Phyto Elements)

- Read `README.md` first: stack, structure, themes, scroll video, forms, chatbot.
- All site copy lives in `src/content/*` and is read only through `src/lib/content.ts` (async, CMS-ready). Never hard-code product data in components.
- Styling: use theme tokens only (`bg-paper`, `text-heading`, `bg-accent`, `text-accent-text`, `.band`, `.card` …). No raw hex colours in components; colour routes live in `src/styles/themes.css`.
- Colour: when changing a brand token in `themes.css`, also update its Display P3 line at the end of the file. Depth/typography effects live in `src/styles/polish.css`.
- Buttons: `.btn` (primary, accent fill) and `.btn btn-ghost` (outline in `--accent-text`). Keep this consistent in every theme.
- Positioning: Phyto Elements sources extracts from qualified producers, tests every lot, and sells under its label only lots that pass. Quality is shown through rigorous, very high testing standards. The page and nav label stay "Manufacturing & Quality" (/manufacturing), but manufacturing is not the headline and the Garcinia plant is not a focus. Use "lot", not "batch".
- Content governance: never add unverified specs, certifications, capacities, customer names or health claims. Unverified spec fields stay undefined so the UI shows "Shared on request".
- Motion: client components only; respect `prefers-reduced-motion`; content must be visible at rest (no opacity: 0 waiting on scroll). Clean up GSAP with `useGSAP` / `ctx.revert()`. Effects must clean up (client navigation).
- Motion components: preloader (`motion/Preloader`, CSS only, every full load), hero (`hero/SpecimenHero`, canvas), `sections/QualityFunnel` (GSAP scrub), line art (`botanicals/*`, CSS scroll-driven), wave edges (`.wave-top`). Styles live in `src/styles/motion.css`.
- Live colour route: R07 "Lab green + blue" (`lablight`), set as `defaultTheme` in `src/config/site.ts`. All other routes stay defined (R01 to R09) and must not be removed; R05 Blue + green is the original client palette, do not change it. There is no on-page route switcher.
- Lab routes (labgreen, lablight, labday) share `src/styles/lab.css`; per-route scene colours are `--lab-*` / `--specimen-*` tokens in themes.css. They and the review compare page live in `src/styles/lab.css`, `hero/HeroScene.tsx` and `app/compare/`. Compare is review-only (404 unless NEXT_PUBLIC_SHOW_THEME_SWITCHER=true).
- Full-screen section mode: `motion/PanelScroll` makes every top-level `<section>` in `<main>` (or in a single wrapper div) a sticky full-screen panel, snaps one screen per wheel gesture (Lenis snap "lock"); each incoming section is held in place and uncovered by a scroll-driven circle from the screen centre with a ring on its edge, on every page (`.rip-ring`, `--rip-p`). Page-to-page navigation plays the leaf-to-bottle extract transition (`motion/RouteTransition`); full loads and refreshes play the preloader every time. New page sections must be `<section>` elements with an opaque background and a `.wrap` child. Off for reduced motion and in /compare panes.
- Logo: approved client artwork only, in `public/brand` (mark, wordmark, stacked logo, each with a `-reverse` version for dark surfaces) and `src/app/icon.png`, `apple-icon.png`, `favicon.ico`. `layout/Logo` shows the reversed set via the `.logo-neg` rules (footer, dark themes, lablight header over the hero). Do not reintroduce a traced or redrawn logo.
- Lab line art: `botanicals/LabArt` draws testing, QC, document and logistics motifs (chromatogram, vials, COA, drums, shipping …). Use it as a step icon (`art` field on testPillars/operatingFunctions) or a faint backdrop (`<LabArt kind backdrop pos />` inside a `labart-host` section). Pick the motif that matches the section's copy.
- Wheel scrolling: `PanelScroll` steps one screen per wheel gesture (trackpad momentum is swallowed until the glide ends and the wheel goes quiet); touch uses Lenis snap. Tune `GLIDE` (1.1s) / `QUIET` / `STEP` there. Source-to-seal is n+1 screens: one per stage, then the seal screen as the pause.
- Homepage products: `sections/ProductShowcase` (flask intro, glass cards, lightbox with prev/next and 3D per product). Glass styling on the green band; neumorphic cards elsewhere.
- 3D: keep three.js behind `LazyScene` (dynamic import, viewport + reduced-motion gate).
- Deployment target is Cloudflare Workers via OpenNext. Do NOT enable `cacheComponents` / `use cache` (not reliable on the Workers runtime). Keep pages statically generatable; read env vars via `getEnv()` at request time.
- Before finishing a change: `npm run lint && npm run typecheck && npm run build`.
