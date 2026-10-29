"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { ProcessStage } from "@/content/types";
import { panelTop } from "@/components/motion/PanelScroll";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Fate = "screen" | "test" | "pass";
type Dot = { x: number; y: number; fate: Fate; tone: number; rx: number; ry: number };

const COLS = 12;
const ROWS = 8;

/** Deterministic lot grid: which dots drop out at screening, at testing, and which pass. */
function buildDots(): Dot[] {
  const dots: Dot[] = [];
  let s = 7;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  for (let r = 0; r < ROWS; r += 1) {
    for (let c = 0; c < COLS; c += 1) {
      const v = rnd();
      dots.push({
        x: 38 + c * 26,
        y: 52 + r * 26,
        fate: v < 0.24 ? "screen" : v < 0.6 ? "test" : "pass",
        tone: Math.floor(rnd() * 4),
        rx: 0,
        ry: 0,
      });
    }
  }
  const passing = dots.filter((d) => d.fate === "pass");
  passing.forEach((d, i) => {
    const ring = i % 2 === 0 ? 74 : 56;
    const a = (i / passing.length) * Math.PI * 2 - Math.PI / 2;
    d.rx = 181 + Math.cos(a) * ring - d.x;
    d.ry = 143 + Math.sin(a) * ring - d.y;
  });
  return dots;
}

const DOTS = buildDots();

/**
 * "From source to seal": the stages scroll on one side while a field of lots on the
 * other is narrowed down. Some drop out at screening, more at testing, and the lots
 * that pass close into the Phyto Elements seal. Illustrative, not a reject rate.
 */
export function QualityFunnel({ stages }: { stages: ProcessStage[] }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(root);
        const el = root.current;
        const section = el?.closest<HTMLElement>(".s2s") ?? el;
        if (!el || !section) return;
        const steps = q(".funnel-step");
        const n = steps.length;
        // Pinned mode: the section is (n + 1) screens tall and each screen is one step;
        // the last screen is "seal formed" (the pause), then the next gesture moves on.
        const pinned = () => document.documentElement.classList.contains("has-panels");

        gsap.set(q(".funnel-seal"), { scale: 0.6, transformOrigin: "50% 50%" });
        const setActive = (progress: number) => {
          const units = progress * n;
          const idx = Math.min(n - 1, Math.max(0, Math.round(units)));
          steps.forEach((s, i) => s.classList.toggle("is-active", i === idx));
          el.classList.toggle("is-complete", units > n - 0.4);
        };
        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: section,
            start: () => {
              const top = pinned() ? panelTop(section) : undefined;
              return top === undefined ? "top 45%" : top;
            },
            end: () => {
              const top = pinned() ? panelTop(section) : undefined;
              return top === undefined ? "bottom 75%" : top + section.offsetHeight - window.innerHeight;
            },
            scrub: pinned() ? 0.4 : 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => setActive(self.progress),
          },
        });
        // Each change finishes as its step settles: 1 Screen, 2 Test, 3 Pass, 4 Label, 5 Seal formed.
        tl.to(q(".lot-screen"), { opacity: 0.07, y: 10, stagger: { each: 0.008, from: "random" }, duration: 0.5 }, 0.4)
          .to(q(".lot-test"), { opacity: 0.07, y: 10, stagger: { each: 0.006, from: "random" }, duration: 0.5 }, 1.4)
          .to(q(".lot-pass .lot-on"), { opacity: 1, duration: 0.5, stagger: { each: 0.006 } }, 2.4)
          .to(
            q(".lot-pass"),
            {
              x: (i: number, t: Element) => Number((t as SVGGElement).dataset.rx),
              y: (i: number, t: Element) => Number((t as SVGGElement).dataset.ry),
              duration: 0.55,
              stagger: 0.004,
            },
            3.35,
          )
          .to(q(".funnel-seal"), { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)" }, n - 0.6)
          .to({}, { duration: 0.1 }, n - 0.1);
        setActive(0);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="funnel">
      <ol className="funnel-steps">
        {stages.map((s, i) => (
          <li key={s.title} className="funnel-step">
            <span className="funnel-num">{String(i + 1).padStart(2, "0")}</span>
            <h3>{s.title}</h3>
            <p>{s.body}</p>
          </li>
        ))}
      </ol>
      <div className="funnel-panel" aria-hidden="true">
        <div className="funnel-card">
          <div className="funnel-head">
            <span>Incoming lots</span>
            <span>Illustrative</span>
          </div>
          <svg viewBox="0 0 362 286" className="funnel-svg">
            {DOTS.map((d, i) => (
              <g key={i} className={`lot lot-${d.fate}`} data-rx={d.rx} data-ry={d.ry}>
                <circle cx={d.x} cy={d.y} r={7.5} className={`lot-off tone-${d.tone}`} />
                {d.fate === "pass" && <circle cx={d.x} cy={d.y} r={7.5} className="lot-on" />}
              </g>
            ))}
            <g className="funnel-seal">
              <circle cx={181} cy={143} r={38} className="seal-ring" />
              <text x={181} y={139} textAnchor="middle" className="seal-t1">
                PHYTO
              </text>
              <text x={181} y={155} textAnchor="middle" className="seal-t2">
                PASSED
              </text>
            </g>
          </svg>
          <div className="funnel-hint" aria-hidden="true">
            Every lot checked · scroll to continue ↓
          </div>
          <div className="funnel-legend">
            <span>
              <i className="lg-raw" /> Sourced
            </span>
            <span>
              <i className="lg-out" /> Did not meet spec
            </span>
            <span>
              <i className="lg-pass" /> Passed · labelled
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
