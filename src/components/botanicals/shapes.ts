/**
 * Line drawings of the six botanicals, as SVG path data in a 200 × 200 box.
 *
 * The same paths drive three things: the line art on product cards and pages
 * (SVG), the draw-on-scroll background of product pages, and the particle
 * targets of the homepage hero (sampled through Path2D). They are stylised
 * illustrations, not botanical references.
 */

const f = (n: number) => Math.round(n * 10) / 10;

/** Closed wavy outline: a circle whose radius ripples with `lobes` bumps. */
function blob(cx: number, cy: number, r: number, lobes: number, amp: number, sx = 1, sy = 1, rot = 0) {
  const pts: string[] = [];
  const steps = 96;
  for (let i = 0; i <= steps; i += 1) {
    const a = (i / steps) * Math.PI * 2;
    const rr = r + amp * Math.cos(lobes * a + rot);
    pts.push(`${i === 0 ? "M" : "L"}${f(cx + Math.cos(a) * rr * sx)} ${f(cy + Math.sin(a) * rr * sy)}`);
  }
  return `${pts.join(" ")}Z`;
}

/** Leaf from base (x1,y1) to tip (x2,y2): outline, midrib and `veins` pairs of side veins. */
function leaf(x1: number, y1: number, x2: number, y2: number, w: number, veins = 0): string[] {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  const nx = -dy / len;
  const ny = dx / len;
  const mx = x1 + dx * 0.45;
  const my = y1 + dy * 0.45;
  const outline = `M${f(x1)} ${f(y1)} Q${f(mx + nx * w)} ${f(my + ny * w)} ${f(x2)} ${f(y2)} Q${f(mx - nx * w)} ${f(my - ny * w)} ${f(x1)} ${f(y1)}Z`;
  const out = [outline, `M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}`];
  for (let i = 1; i <= veins; i += 1) {
    const t = i / (veins + 1);
    const px = x1 + dx * t;
    const py = y1 + dy * t;
    const reach = w * 0.48 * Math.sin(Math.PI * Math.min(0.95, t + 0.1));
    const fx = px + dx * 0.12;
    const fy = py + dy * 0.12;
    out.push(`M${f(px)} ${f(py)} Q${f(fx + nx * reach * 0.5)} ${f(fy + ny * reach * 0.5)} ${f(fx + nx * reach)} ${f(fy + ny * reach)}`);
    out.push(`M${f(px)} ${f(py)} Q${f(fx - nx * reach * 0.5)} ${f(fy - ny * reach * 0.5)} ${f(fx - nx * reach)} ${f(fy - ny * reach)}`);
  }
  return out;
}

/** Teardrop pointing up, e.g. a resin tear. */
function drop(cx: number, cy: number, r: number) {
  return `M${f(cx)} ${f(cy - r * 2.1)} C${f(cx + r * 0.4)} ${f(cy - r * 1.2)} ${f(cx + r * 1.05)} ${f(cy - r * 0.6)} ${f(cx + r)} ${f(cy)} A${r} ${r} 0 0 1 ${f(cx - r)} ${f(cy)} C${f(cx - r * 1.05)} ${f(cy - r * 0.6)} ${f(cx - r * 0.4)} ${f(cy - r * 1.2)} ${f(cx)} ${f(cy - r * 2.1)}Z`;
}

function ellipse(cx: number, cy: number, rx: number, ry: number, deg = 0) {
  return rotate(blob(cx, cy, 1, 0, 0, rx, ry), cx, cy, deg);
}

/** Rotates every absolute M/L point of a polyline path around (cx, cy). */
function rotate(d: string, cx: number, cy: number, deg: number) {
  if (!deg) return d;
  const a = (deg * Math.PI) / 180;
  const c = Math.cos(a);
  const s = Math.sin(a);
  return d.replace(/([ML])(-?[\d.]+) (-?[\d.]+)/g, (_, cmd: string, xs: string, ys: string) => {
    const x = Number(xs) - cx;
    const y = Number(ys) - cy;
    return `${cmd}${f(cx + x * c - y * s)} ${f(cy + x * s + y * c)}`;
  });
}

function garcinia(): string[] {
  const ribs = [1, 2, 3].flatMap((i) => [
    `M100 68 Q${100 - i * 19} 120 100 170`,
    `M100 68 Q${100 + i * 19} 120 100 170`,
  ]);
  return [
    blob(100, 119, 52, 8, 2),
    ...ribs,
    "M100 68 C100 56 102 48 108 40",
    ...leaf(107, 44, 172, 26, 17, 4),
    ...leaf(100, 52, 38, 34, 13, 3),
  ];
}

function curcumin(): string[] {
  return [
    blob(98, 150, 30, 5, 4, 1.35, 0.72),
    rotate(blob(52, 158, 14, 3, 2, 1.5, 0.65), 52, 158, 18),
    rotate(blob(146, 140, 14, 3, 2, 1.6, 0.62), 146, 140, -24),
    rotate(blob(120, 176, 11, 3, 1.5, 1.5, 0.6), 120, 176, 30),
    rotate(blob(74, 128, 10, 3, 1.5, 1.4, 0.6), 74, 128, -40),
    "M70 146 q4 6 0 12 M90 140 q4 8 0 18 M112 140 q4 8 0 18 M130 144 q3 6 0 12 M150 134 q3 5 0 10",
    ...leaf(96, 126, 118, 22, 20, 5),
    ...leaf(92, 128, 46, 40, 15, 4),
    ...leaf(102, 126, 166, 58, 13, 3),
  ];
}

function ashwagandha(): string[] {
  return [
    "M100 112 C98 136 104 160 100 194",
    "M100 132 C88 140 78 146 64 166 M101 146 C114 154 124 162 136 182 M100 162 C92 170 86 178 82 192 M64 166 C60 172 58 178 58 186 M136 182 C140 186 142 190 142 196",
    "M100 112 C100 86 96 60 92 22",
    ...leaf(98, 92, 46, 76, 13, 3),
    ...leaf(97, 74, 148, 56, 12, 3),
    ...leaf(94, 52, 54, 34, 10, 2),
    "M95 40 C112 38 126 30 136 22",
    blob(146, 40, 18, 5, 3, 0.9, 1.15, Math.PI / 2),
    blob(146, 42, 7, 0, 0),
    "M136 22 L140 24",
  ];
}

function boswellia(): string[] {
  const rachis = "M34 178 C60 140 92 96 152 26";
  const pairs: string[] = [];
  for (let i = 0; i < 6; i += 1) {
    const t = 0.18 + i * 0.13;
    const x = 34 + (152 - 34) * t + Math.sin(t * Math.PI) * -8;
    const y = 178 + (26 - 178) * t;
    pairs.push(...leaf(x, y, x - 30 + i * 2, y - 14 - i, 7));
    pairs.push(...leaf(x, y, x + 24 - i, y + 16 - i * 2, 7));
  }
  return [
    rachis,
    ...pairs,
    ...leaf(152, 26, 168, 6, 7),
    drop(148, 168, 9),
    drop(170, 176, 7),
    drop(128, 182, 6),
    drop(162, 148, 5),
  ];
}

function bakuchiol(): string[] {
  const pods: string[] = [];
  for (let i = 0; i < 7; i += 1) {
    const y = 34 + i * 10;
    const side = i % 2 === 0 ? -1 : 1;
    pods.push(ellipse(150 + side * 7, y, 4.2, 6.5, side * 24));
  }
  return [
    blob(80, 104, 46, 22, 1.6, 0.92, 1.08),
    "M80 150 L80 62",
    "M80 132 Q60 120 46 112 M80 132 Q100 120 114 112 M80 112 Q62 98 46 86 M80 112 Q98 98 114 86 M80 92 Q68 80 60 70 M80 92 Q92 80 100 70",
    "M80 150 C82 168 90 182 100 196",
    "M150 104 L150 28",
    ...pods,
    "M100 196 C120 170 138 140 150 104",
  ];
}

function bacopa(): string[] {
  const stem = "M14 132 C44 112 70 150 100 130 S156 104 188 126";
  const nodes: [number, number, number][] = [
    [40, 124, -12],
    [72, 138, 6],
    [104, 128, -8],
    [136, 116, 4],
    [166, 116, 10],
  ];
  const leaves = nodes.flatMap(([x, y, tilt]) => [
    ...leaf(x, y, x - 8 + tilt, y - 30, 8, 1),
    ...leaf(x, y, x + 8 + tilt, y + 28, 8, 1),
  ]);
  return [
    stem,
    ...leaves,
    "M104 128 C108 112 110 92 112 72",
    blob(112, 62, 11, 5, 4, 1, 1, Math.PI / 2),
    blob(112, 62, 3, 0, 0),
    "M14 132 C10 140 12 150 6 158 M72 138 C70 150 74 160 70 172 M136 116 C138 128 134 140 138 150",
  ];
}

export const BOTANICALS: Record<string, string[]> = {
  garcinia: garcinia(),
  curcumin: curcumin(),
  ashwagandha: ashwagandha(),
  boswellia: boswellia(),
  bakuchiol: bakuchiol(),
  bacopa: bacopa(),
};

export function botanicalPaths(slug: string): string[] {
  return BOTANICALS[slug] ?? BOTANICALS.garcinia;
}
