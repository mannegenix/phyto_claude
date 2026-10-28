"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { ProcessStage } from "@/content/types";

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
        gsap.set(q(".funnel-seal"), { scale: 0.6, transformOrigin: "50% 50%" });
        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: { trigger: q(".funnel-steps")[0], start: "top 55%", end: "bottom 70%", scrub: 0.6 },
        });
        tl.to(q(".lot-screen"), { opacity: 0.07, y: 10, stagger: { each: 0.01, from: "random" }, duration: 0.6 }, 0.6)
          .to(q(".lot-test"), { opacity: 0.07, y: 10, stagger: { each: 0.008, from: "random" }, duration: 0.6 }, 1.6)
          .to(q(".lot-pass .lot-on"), { opacity: 1, duration: 0.5, stagger: { each: 0.008 } }, 2.6)
          .to(
            q(".lot-pass"),
            {
              x: (i: number, el: Element) => Number((el as SVGGElement).dataset.rx),
              y: (i: number, el: Element) => Number((el as SVGGElement).dataset.ry),
              duration: 0.9,
              stagger: 0.006,
            },
            3.5,
          )
          .to(q(".funnel-seal"), { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)" }, 4.1)
          .to({}, { duration: 0.4 });

        q(".funnel-step").forEach((el) => {
          ScrollTrigger.create({ trigger: el, start: "top 60%", end: "bottom 60%", toggleClass: "is-active" });
        });
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
