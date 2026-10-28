import type { ReactNode } from "react";
import { blob, drop, ellipse, leaf, rotate } from "./shapes";

/**
 * Full-colour botanical illustrations (200 × 200), one per product. They stand in for
 * product photography until the client supplies photos; set `image` on a product in
 * src/content/products.ts and ProductOrb shows the photo instead.
 * Stylised artwork, not botanical reference images.
 */

type Paint = (id: (name: string) => string) => ReactNode;

function Leaf({
  x1,
  y1,
  x2,
  y2,
  w,
  fill,
  veins = 3,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  w: number;
  fill: string;
  veins?: number;
}) {
  const [outline, mid, ...vs] = leaf(x1, y1, x2, y2, w, veins);
  return (
    <g>
      <path d={outline} fill={fill} stroke="#1f5a1c" strokeOpacity="0.35" strokeWidth="0.8" />
      <path d={mid} stroke="#e9f7c9" strokeOpacity="0.75" strokeWidth="1.1" fill="none" strokeLinecap="round" />
      {vs.map((d, i) => (
        <path key={i} d={d} stroke="#e9f7c9" strokeOpacity="0.45" strokeWidth="0.7" fill="none" strokeLinecap="round" />
      ))}
    </g>
  );
}

const LEAF_STOPS = (
  <>
    <stop offset="0" stopColor="#7cc84a" />
    <stop offset="1" stopColor="#2f7d24" />
  </>
);

const paint: Record<string, Paint> = {
  garcinia: (id) => (
    <>
      <defs>
        <radialGradient id={id("fruit")} cx="0.38" cy="0.32" r="0.75">
          <stop offset="0" stopColor="#ffe08a" />
          <stop offset="0.45" stopColor="#f6b23c" />
          <stop offset="1" stopColor="#c9701f" />
        </radialGradient>
        <linearGradient id={id("leaf")} x1="0" y1="0" x2="1" y2="1">
          {LEAF_STOPS}
        </linearGradient>
      </defs>
      <Leaf x1={104} y1={50} x2={172} y2={26} w={18} fill={`url(#${id("leaf")})`} />
      <Leaf x1={98} y1={56} x2={34} y2={36} w={14} fill={`url(#${id("leaf")})`} />
      <path d="M100 70 C100 58 102 50 108 42" stroke="#6b4a26" strokeWidth="3.4" fill="none" strokeLinecap="round" />
      <path d={blob(100, 122, 54, 8, 2.4)} fill={`url(#${id("fruit")})`} />
      {[1, 2, 3].flatMap((i) => [
        <path key={`a${i}`} d={`M100 70 Q${100 - i * 19} 122 100 174`} stroke="#b45f17" strokeOpacity="0.45" strokeWidth="1.4" fill="none" />,
        <path key={`b${i}`} d={`M100 70 Q${100 + i * 19} 122 100 174`} stroke="#b45f17" strokeOpacity="0.45" strokeWidth="1.4" fill="none" />,
      ])}
      <ellipse cx="78" cy="98" rx="14" ry="8" fill="#fff6d6" opacity="0.55" transform="rotate(-35 78 98)" />
    </>
  ),

  curcumin: (id) => (
    <>
      <defs>
        <linearGradient id={id("skin")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d9a066" />
          <stop offset="1" stopColor="#9c5f2c" />
        </linearGradient>
        <radialGradient id={id("core")} cx="0.5" cy="0.5" r="0.6">
          <stop offset="0" stopColor="#ffc93c" />
          <stop offset="0.6" stopColor="#f59a12" />
          <stop offset="1" stopColor="#d9700b" />
        </radialGradient>
        <linearGradient id={id("leaf")} x1="0" y1="0" x2="1" y2="1">
          {LEAF_STOPS}
        </linearGradient>
      </defs>
      <Leaf x1={96} y1={120} x2={118} y2={18} w={20} fill={`url(#${id("leaf")})`} veins={5} />
      <Leaf x1={92} y1={122} x2={44} y2={36} w={15} fill={`url(#${id("leaf")})`} veins={4} />
      <Leaf x1={102} y1={120} x2={166} y2={54} w={13} fill={`url(#${id("leaf")})`} veins={3} />
      <path d={rotate(blob(52, 158, 14, 3, 2, 1.5, 0.65), 52, 158, 18)} fill={`url(#${id("skin")})`} />
      <path d={rotate(blob(122, 178, 11, 3, 1.5, 1.5, 0.6), 122, 178, 30)} fill={`url(#${id("skin")})`} />
      <path d={blob(98, 150, 30, 5, 4, 1.35, 0.72)} fill={`url(#${id("skin")})`} />
      <path d="M70 146 q4 6 0 12 M90 140 q4 8 0 18 M112 140 q4 8 0 18 M130 144 q3 6 0 12" stroke="#7a4520" strokeOpacity="0.55" strokeWidth="1.4" fill="none" />
      {/* cut piece showing the bright interior */}
      <ellipse cx="156" cy="144" rx="17" ry="13" fill="#8a5426" />
      <ellipse cx="156" cy="142" rx="15" ry="11" fill={`url(#${id("core")})`} />
      <ellipse cx="156" cy="142" rx="8" ry="5.5" fill="#ffd25e" opacity="0.7" />
    </>
  ),

  ashwagandha: (id) => (
    <>
      <defs>
        <linearGradient id={id("root")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#c9a46e" />
          <stop offset="0.5" stopColor="#e6cc9c" />
          <stop offset="1" stopColor="#b08850" />
        </linearGradient>
        <radialGradient id={id("berry")} cx="0.35" cy="0.3" r="0.7">
          <stop offset="0" stopColor="#ff9a6b" />
          <stop offset="0.5" stopColor="#e8452c" />
          <stop offset="1" stopColor="#a8221a" />
        </radialGradient>
        <linearGradient id={id("leaf")} x1="0" y1="0" x2="1" y2="1">
          {LEAF_STOPS}
        </linearGradient>
      </defs>
      <path d="M100 112 C100 86 96 60 92 22" stroke="#4f7f2e" strokeWidth="3" fill="none" strokeLinecap="round" />
      <Leaf x1={98} y1={92} x2={44} y2={74} w={14} fill={`url(#${id("leaf")})`} />
      <Leaf x1={97} y1={74} x2={148} y2={58} w={13} fill={`url(#${id("leaf")})`} />
      <Leaf x1={94} y1={50} x2={52} y2={32} w={11} fill={`url(#${id("leaf")})`} veins={2} />
      <path d="M95 40 C112 38 126 30 136 24" stroke="#4f7f2e" strokeWidth="2" fill="none" />
      {/* papery lantern-shaped calyx, opened to show the red berry */}
      <circle cx="147" cy="52" r="9" fill={`url(#${id("berry")})`} />
      <path
        d="M140 24 C128 32 126 46 132 56 C134 60 138 62 140 60 C141 52 144 46 147 44 C150 46 153 52 154 60 C156 62 160 60 162 56 C168 46 166 32 154 24 C150 22 144 22 140 24 Z"
        fill="#d8c27a"
        fillOpacity="0.9"
        stroke="#a8914a"
        strokeWidth="1"
      />
      <path d="M147 23 L147 44 M141 25 C136 36 136 48 138 58 M153 25 C158 36 158 48 156 58" stroke="#a8914a" strokeOpacity="0.7" strokeWidth="0.9" fill="none" />
      <path
        d="M100 112 C94 136 106 160 100 196 L104 196 C110 160 98 136 106 112 Z"
        fill={`url(#${id("root")})`}
      />
      <path d="M101 134 C88 142 78 148 64 168 M102 148 C115 156 124 164 136 184 M101 164 C93 172 87 180 83 194" stroke="#c7a46c" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M64 168 C60 174 58 180 58 188 M136 184 C140 188 142 192 142 198" stroke="#c7a46c" strokeWidth="2" fill="none" strokeLinecap="round" />
    </>
  ),

  boswellia: (id) => (
    <>
      <defs>
        <radialGradient id={id("resin")} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#fff1b8" />
          <stop offset="0.4" stopColor="#f6c35a" />
          <stop offset="1" stopColor="#c97a1c" />
        </radialGradient>
        <linearGradient id={id("leaf")} x1="0" y1="0" x2="1" y2="1">
          {LEAF_STOPS}
        </linearGradient>
      </defs>
      <path d="M30 150 C60 118 92 80 150 26" stroke="#7a5532" strokeWidth="3" fill="none" strokeLinecap="round" />
      {Array.from({ length: 5 }, (_, i) => {
        const t = 0.2 + i * 0.15;
        const x = 30 + 120 * t;
        const y = 150 - 124 * t;
        return (
          <g key={i}>
            <Leaf x1={x} y1={y} x2={x - 28 + i * 2} y2={y - 14 - i} w={8} fill={`url(#${id("leaf")})`} veins={1} />
            <Leaf x1={x} y1={y} x2={x + 22 - i} y2={y + 14 - i * 2} w={8} fill={`url(#${id("leaf")})`} veins={1} />
          </g>
        );
      })}
      {[
        [130, 172, 12],
        [158, 178, 9],
        [110, 182, 8],
        [150, 150, 7],
        [176, 158, 6],
      ].map(([x, y, r], i) => (
        <g key={i}>
          <path d={drop(x, y, r)} fill={`url(#${id("resin")})`} stroke="#b06a18" strokeOpacity="0.4" strokeWidth="0.8" />
          <ellipse cx={x - r * 0.35} cy={y - r * 0.9} rx={r * 0.22} ry={r * 0.45} fill="#fffbe6" opacity="0.75" />
        </g>
      ))}
    </>
  ),

  bakuchiol: (id) => (
    <>
      <defs>
        <linearGradient id={id("leaf")} x1="0" y1="0" x2="1" y2="1">
          {LEAF_STOPS}
        </linearGradient>
        <radialGradient id={id("seed")} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#7a5a45" />
          <stop offset="1" stopColor="#2a1c14" />
        </radialGradient>
      </defs>
      <path d="M80 150 C82 168 90 182 100 196" stroke="#4f7f2e" strokeWidth="2.6" fill="none" />
      <path d={blob(78, 100, 46, 22, 1.6, 0.92, 1.08)} fill={`url(#${id("leaf")})`} stroke="#1f5a1c" strokeOpacity="0.35" />
      <path d="M78 148 L78 58 M78 130 Q58 118 44 110 M78 130 Q98 118 112 110 M78 110 Q60 96 44 84 M78 110 Q96 96 112 84 M78 90 Q66 78 58 68 M78 90 Q90 78 98 68" stroke="#e9f7c9" strokeOpacity="0.6" strokeWidth="1" fill="none" />
      <path d="M150 112 L150 28" stroke="#6b8a3a" strokeWidth="2" />
      {Array.from({ length: 7 }, (_, i) => {
        const y = 34 + i * 10;
        const side = i % 2 === 0 ? -1 : 1;
        return <path key={i} d={ellipse(150 + side * 7, y, 4.4, 6.6, side * 24)} fill="#9b6fc7" stroke="#6d4a99" strokeWidth="0.6" />;
      })}
      {[
        [128, 168],
        [142, 176],
        [156, 166],
        [134, 184],
        [150, 188],
        [166, 180],
      ].map(([x, y], i) => (
        <path key={i} d={ellipse(x, y, 7, 5, i * 30)} fill={`url(#${id("seed")})`} />
      ))}
    </>
  ),

  bacopa: (id) => (
    <>
      <defs>
        <linearGradient id={id("leaf")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8fd65e" />
          <stop offset="1" stopColor="#3a8a2c" />
        </linearGradient>
      </defs>
      <path d="M14 132 C44 112 70 150 100 130 S156 104 188 126" stroke="#4f8a2e" strokeWidth="3" fill="none" strokeLinecap="round" />
      {[
        [40, 124, -12],
        [72, 138, 6],
        [104, 128, -8],
        [136, 116, 4],
        [166, 116, 10],
      ].map(([x, y, tilt], i) => (
        <g key={i}>
          <path d={ellipse(x - 4 + tilt / 2, y - 15, 7, 13, tilt - 10)} fill={`url(#${id("leaf")})`} />
          <path d={ellipse(x + 4 + tilt / 2, y + 15, 7, 13, tilt + 10)} fill={`url(#${id("leaf")})`} />
        </g>
      ))}
      <path d="M104 128 C108 112 110 92 112 72" stroke="#4f8a2e" strokeWidth="2" fill="none" />
      <path d={blob(112, 62, 13, 5, 5, 1, 1, Math.PI / 2)} fill="#ffffff" stroke="#c9b8e8" strokeWidth="1" />
      <circle cx="112" cy="62" r="4" fill="#c7a6f0" />
      <path d="M72 138 C76 120 76 104 80 92" stroke="#4f8a2e" strokeWidth="1.6" fill="none" />
      <path d={blob(80, 86, 9, 5, 3.5, 1, 1, Math.PI / 2)} fill="#ffffff" stroke="#c9b8e8" strokeWidth="1" />
      <circle cx="80" cy="86" r="2.8" fill="#c7a6f0" />
    </>
  ),
};

export function Illustration({ slug, uid = "", className = "" }: { slug: string; uid?: string; className?: string }) {
  const draw = paint[slug] ?? paint.garcinia;
  const id = (name: string) => `il-${slug}-${uid}-${name}`;
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      {draw(id)}
    </svg>
  );
}
