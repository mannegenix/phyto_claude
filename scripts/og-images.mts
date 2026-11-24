/**
 * Makes the share-card images (Open Graph / Twitter, 1200×630 JPEG) in public/og/:
 *   site.jpg          the default card (homepage and every page without its own)
 *   <slug>.jpg        one per product, from its wide photo
 * and writes the list of products that have a card to src/lib/og-images.ts.
 *
 * Run after adding or renaming a product (needs Playwright with Chromium on your machine):
 *   npm i -D playwright && npx playwright install chromium   # once
 *   node --experimental-strip-types scripts/og-images.mts
 * A product without a card simply shares the site card.
 */
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import { products } from "../src/content/products.ts";

const root = resolve(import.meta.dirname, "..");
const f = (p: string) => pathToFileURL(resolve(root, p)).href;
const { chromium } = createRequire(import.meta.url)("playwright");

const G = "#02584a",
  L = "#94de03",
  Y = "#fdce18";
const fonts = `
@font-face{font-family:H;src:url(${f("node_modules/@fontsource-variable/hanken-grotesk/files/hanken-grotesk-latin-wght-normal.woff2")}) format("woff2");font-weight:100 900}
@font-face{font-family:M;src:url(${f("node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2")}) format("woff2");font-weight:100 800}
*{box-sizing:border-box}body{margin:0}
.c{width:1200px;height:630px;display:flex;background:color-mix(in oklab,${L} 12%,white);font-family:H;color:${G};overflow:hidden}
.l{flex:1;padding:52px 56px 50px;display:flex;flex-direction:column;gap:22px}
.logo{height:84px;width:auto;align-self:flex-start;margin-bottom:10px}
.eb{font:600 17px/1 M;letter-spacing:.16em;text-transform:uppercase;display:flex;align-items:center;gap:12px}
.eb i{width:44px;height:8px;background:linear-gradient(90deg,${L} 60%,${Y} 60%)}
h1{margin:0;font-weight:700;line-height:1.04;letter-spacing:-.01em}
p{margin:0;font-size:24px;line-height:1.4;color:color-mix(in oklab,${G} 82%,white)}
.tag{margin-top:auto;display:flex;gap:10px;flex-wrap:wrap}
.tag span{font:700 16px/1 M;letter-spacing:.1em;text-transform:uppercase;padding:12px 16px;border-radius:999px}
.r{width:470px;position:relative}
.r img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.r::before{content:"";position:absolute;left:0;top:0;bottom:0;width:10px;background:${L};z-index:1}
.mo{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:6px;background:${L};padding-left:10px}
.mo img{position:static}
`;
const page = (body: string) =>
  `<!doctype html><html><head><meta charset="utf-8"><style>${fonts}</style></head><body>${body}</body></html>`;
const pills = `<div class="tag"><span style="background:${L}">Every lot tested</span><span style="background:${Y}">Indian &amp; Global supply</span></div>`;

const cards: { file: string; html: string }[] = [];
cards.push({
  file: "site.jpg",
  html: page(`<div class="c"><div class="l"><img class="logo" src="${f("public/brand/logo.png")}">
<div class="eb"><i></i>Bulk plant extracts · Tested lot by lot</div>
<h1 style="font-size:60px">Only the best extracts carry our name</h1>
<p>Sourced from qualified producers. Every lot tested to recognised global quality standards.</p>${pills}</div>
<div class="r mo">${products
    .filter((p) => p.image)
    .slice(0, 4)
    .map((p) => `<img src="${f("public" + p.image)}">`)
    .join("")}</div></div>`),
});
const made: string[] = [];
for (const p of products) {
  if (!p.image) continue;
  const wide = "public" + p.image.replace(".webp", "-wide.webp");
  const photo = existsSync(resolve(root, wide)) ? wide : "public" + p.image;
  made.push(p.slug);
  cards.push({
    file: `${p.slug}.jpg`,
    html: page(`<div class="c"><div class="l"><img class="logo" src="${f("public/brand/logo.png")}">
<div class="eb"><i></i>${p.role} · Bulk extract</div>
<h1 style="font-size:${p.name.length > 24 ? 56 : 64}px">${p.name}</h1>
<p><em>${p.botanicalSource.split(" (")[0]}</em> · ${p.plantPart.toLowerCase()}<br>Marker: ${p.marker.split(",")[0]}</p>${pills}</div>
<div class="r"><img src="${f(photo)}"></div></div>`),
  });
}

mkdirSync(resolve(root, "public/og"), { recursive: true });
const browser = await chromium.launch();
const tab = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const c of cards) {
  // Load from a file so the page may read the local photos, logo and fonts.
  const tmp = join(tmpdir(), `pe-og-${c.file}.html`);
  writeFileSync(tmp, c.html);
  await tab.goto(pathToFileURL(tmp).href, { waitUntil: "load" });
  await tab.evaluate(() => document.fonts.ready);
  await tab.screenshot({ path: resolve(root, "public/og", c.file), type: "jpeg", quality: 86 });
  console.log("og:", c.file);
}
await browser.close();

writeFileSync(
  resolve(root, "src/lib/og-images.ts"),
  `/** Products with their own share card in public/og/ (written by scripts/og-images.mts). */\nexport const OG_PRODUCT_SLUGS = ${JSON.stringify(made)} as const;\n`,
);
