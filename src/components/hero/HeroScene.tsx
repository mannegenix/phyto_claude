"use client";

import { useEffect, useRef } from "react";

const RING_TEXT = "TESTED RIGOROUSLY · ONLY THE BEST CARRIES OUR NAME · PHYTO ELEMENTS · ";

/**
 * Immersive hero layers for the Lab green route: dot grid, instrument rings, rotating
 * ring text, a pulse and a vignette, each drifting at its own depth with the pointer.
 * Rendered for every route but only shown by lab.css, so other routes are unchanged.
 */
export function HeroScene() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const host = el?.parentElement;
    if (!el || !host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    const tick = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      el.style.setProperty("--mx", x.toFixed(4));
      el.style.setProperty("--my", y.toFixed(4));
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.0005 ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - 0.5;
      ty = (e.clientY - r.top) / r.height - 0.5;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    host.addEventListener("pointermove", onMove);
    return () => {
      host.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="hero-scene" aria-hidden="true">
      <div className="scene-layer scene-grid" style={{ ["--d" as string]: 0.4 }} />
      <div className="scene-layer scene-halo" style={{ ["--d" as string]: 0.1 }} />
      <div className="scene-layer scene-rings" style={{ ["--d" as string]: 0.18 }}>
        <svg viewBox="0 0 600 600">
          <circle cx="300" cy="300" r="290" className="ring ring-faint" />
          <circle cx="300" cy="300" r="236" className="ring ring-dash spin-slow" />
          <circle cx="300" cy="300" r="170" className="ring" />
          <circle cx="300" cy="300" r="118" className="ring ring-faint" />
          <path d="M300 0V64M300 536V600M0 300H64M536 300H600" className="ring" />
          <path d="M300 268V332M268 300H332" className="ring ring-strong" />
          <g className="ticks">
            {Array.from({ length: 60 }, (_, i) => (
              <line
                key={i}
                x1="300"
                y1={i % 5 === 0 ? 10 : 16}
                x2="300"
                y2="24"
                transform={`rotate(${i * 6} 300 300)`}
              />
            ))}
          </g>
        </svg>
      </div>
      <div className="scene-layer scene-text" style={{ ["--d" as string]: 0.3 }}>
        <svg viewBox="0 0 300 300" className="spin">
          <defs>
            <path id="hero-ring-path" d="M150 150m-112 0a112 112 0 1 1 224 0a112 112 0 1 1 -224 0" />
          </defs>
          <text>
            <textPath href="#hero-ring-path">{RING_TEXT + RING_TEXT}</textPath>
          </text>
        </svg>
      </div>
      <div className="scene-layer scene-pulse" style={{ ["--d" as string]: 0.1 }} />
      <div className="scene-layer scene-bits" style={{ ["--d" as string]: 0.5 }}>
        <span className="is-test" style={{ right: "4%", top: "20%" }}>ID · PU · PO · SA · ST</span>
        <span style={{ left: "56%", top: "84%" }}>SPECIMEN · LINE SCAN</span>
        <span style={{ right: "4%", top: "66%" }}>SPEC ▸ PASS</span>
      </div>
      <div className="scene-vignette" />
    </div>
  );
}
