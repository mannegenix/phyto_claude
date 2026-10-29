/**
 * A leaf releasing a drop of extract into a glass bottle. Used by the section
 * transition (animated via .drop-fx.is-dropping) and the preloader (looping).
 * Pure SVG; animation lives in motion.css. `id` keeps gradient ids unique.
 */
export function LeafDropArt({ id = "ld", className = "" }: { id?: string; className?: string }) {
  const g = (n: string) => `${id}-${n}`;
  return (
    <svg viewBox="0 0 240 360" className={`leafdrop ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id={g("leaf")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: "#9be26a" }} />
          <stop offset="1" style={{ stopColor: "#2f7d24" }} />
        </linearGradient>
        <radialGradient id={g("drop")} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" style={{ stopColor: "#ffffff", stopOpacity: 0.95 }} />
          <stop offset="0.35" style={{ stopColor: "var(--accent)" }} />
          <stop offset="1" style={{ stopColor: "var(--accent-text)" }} />
        </radialGradient>
        <linearGradient id={g("glass")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" style={{ stopColor: "#ffffff", stopOpacity: 0.55 }} />
          <stop offset="0.5" style={{ stopColor: "#ffffff", stopOpacity: 0.12 }} />
          <stop offset="1" style={{ stopColor: "#ffffff", stopOpacity: 0.45 }} />
        </linearGradient>
        <linearGradient id={g("liquid")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--pop)" }} />
          <stop offset="1" style={{ stopColor: "var(--accent-text)" }} />
        </linearGradient>
        <clipPath id={g("body")}>
          <path d="M84 214 Q84 204 96 204 L144 204 Q156 204 156 214 L156 322 Q156 336 142 336 L98 336 Q84 336 84 322 Z" />
        </clipPath>
      </defs>

      {/* stem and leaf, tip pointing down at (120, 92) */}
      <path d="M150 6 C146 22 140 34 132 44" stroke="#4f7f2e" strokeWidth="3" fill="none" strokeLinecap="round" />
      <g className="ld-leaf">
        <path d="M132 44 C162 52 150 84 120 92 C98 78 104 48 132 44 Z" fill={`url(#${g("leaf")})`} />
        <path d="M132 44 C128 62 124 78 120 92" stroke="#eaf8d0" strokeOpacity="0.8" strokeWidth="1.3" fill="none" />
        <path d="M129 58 L141 60 M126 70 L137 74 M124 80 L111 74 M127 64 L114 58" stroke="#eaf8d0" strokeOpacity="0.5" strokeWidth="0.9" fill="none" />
      </g>

      {/* the drop */}
      <g className="ld-drop">
        <path d="M120 92 C124 101 130 107 130 115 A10 10 0 0 1 110 115 C110 107 116 101 120 92Z" fill={`url(#${g("drop")})`} />
      </g>

      {/* bottle: neck, glass body, liquid, label */}
      <rect x="108" y="186" width="24" height="20" rx="4" fill="#ffffff" fillOpacity="0.35" stroke="var(--accent-text)" strokeOpacity="0.45" />
      <g clipPath={`url(#${g("body")})`}>
        <rect x="80" y="200" width="80" height="140" fill="#ffffff" fillOpacity="0.28" />
        <g className="ld-liquid">
          <path d="M70 282 Q100 274 120 282 T170 282 V350 H70 Z" fill={`url(#${g("liquid")})`} fillOpacity="0.9" />
          <ellipse className="ld-ripple ld-ripple-1" cx="120" cy="282" rx="22" ry="4" fill="none" stroke="#ffffff" strokeWidth="1.6" />
          <ellipse className="ld-ripple ld-ripple-2" cx="120" cy="282" rx="22" ry="4" fill="none" stroke="var(--splash)" strokeWidth="1.6" />
        </g>
        <rect x="84" y="204" width="72" height="132" fill={`url(#${g("glass")})`} />
      </g>
      <path
        d="M84 214 Q84 204 96 204 L144 204 Q156 204 156 214 L156 322 Q156 336 142 336 L98 336 Q84 336 84 322 Z"
        fill="none"
        stroke="var(--accent-text)"
        strokeOpacity="0.55"
        strokeWidth="1.6"
      />
      <rect x="92" y="238" width="56" height="26" rx="3" fill="#ffffff" fillOpacity="0.85" />
      <rect x="92" y="258" width="56" height="3" fill="var(--splash)" />
      <text x="120" y="252" textAnchor="middle" className="ld-label">
        PHYTO · TESTED
      </text>
      <path d="M92 214 L92 326" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="3" strokeLinecap="round" />

      {/* splash droplets at the neck */}
      <g className="ld-splash">
        <circle cx="112" cy="190" r="2.4" />
        <circle cx="128" cy="188" r="2" />
        <circle cx="120" cy="182" r="1.6" />
      </g>
    </svg>
  );
}
