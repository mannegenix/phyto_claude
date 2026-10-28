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
- Content governance: never add unverified specs, certifications, capacities, customer names or health claims. Unverified spec fields stay undefined so the UI shows "Shared on request".
- Motion: client components only; respect `prefers-reduced-motion`; content must be visible at rest (no opacity: 0 waiting on scroll). Clean up GSAP with `useGSAP` / `ctx.revert()`. Effects must clean up (client navigation).
- 3D: keep three.js behind `LazyScene` (dynamic import, viewport + reduced-motion gate).
- Deployment target is Cloudflare Workers via OpenNext. Do NOT enable `cacheComponents` / `use cache` (not reliable on the Workers runtime). Keep pages statically generatable; read env vars via `getEnv()` at request time.
- Before finishing a change: `npm run lint && npm run typecheck && npm run build`.
