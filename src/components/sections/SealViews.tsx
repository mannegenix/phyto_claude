"use client";

import { useEffect, useRef, useState } from "react";
import type { ProcessStage } from "@/content/types";

/**
 * One-screen "From source to seal" layouts (replace the pinned scroll-through version):
 *  - SealPipeline (homepage): the whole journey at a glance — a stream of lots that
 *    narrows at each check and ends in the Phyto Passed seal, with the step cards under
 *    it. The highlight moves across the steps on its own; nothing needs a click.
 *  - SealStepper (Manufacturing & Quality): an auto-playing stepper — the steps advance by
 *    themselves, the lot grid changes for each step, and visitors can click any step or pause.
 * Both are illustrative: no counts, no reject rates.
 */

/** Deterministic pseudo-random sequence (same output on server and client). */
function seq(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

// ── B · Pipeline at a glance ───────────────────────────────────────────────────
const PIPE_COUNTS = [26, 20, 14, 9, 9];

export function SealPipeline({ stages }: { stages: ProcessStage[] }) {
  const n = stages.length;
  return (
    <div className="s2p" style={{ ["--n" as string]: n }}>
      <div className="s2p-stream" aria-hidden="true">
        {stages.map((s, i) => {
          const rnd = seq(3 + i * 11);
          const count = PIPE_COUNTS[Math.min(i, PIPE_COUNTS.length - 1)];
          const last = i === n - 1;
          return (
            <div key={s.title} className={`s2p-seg ${last ? "is-end" : ""}`} style={{ ["--i" as string]: i }}>
              {Array.from({ length: count }, (_, k) => {
                const kind = i === n - 2 && k > 5 ? "x" : i >= n - 2 ? "ok" : i === n - 3 ? "t" : "raw";
                return (
                  <i
                    key={k}
                    className={`s2p-lot is-${kind}`}
                    style={{
                      left: `${8 + rnd() * 78}%`,
                      top: `${10 + rnd() * 80}%`,
                      ["--d" as string]: `${(rnd() * -6).toFixed(2)}s`,
                    }}
                  />
                );
              })}
            </div>
          );
        })}
        <span className="s2p-seal">
          Phyto
          <b>Passed</b>
        </span>
      </div>
      <ol className="s2p-cards">
        {stages.map((s, i) => (
          <li key={s.title} className="s2p-card" style={{ ["--i" as string]: i }}>
            <span className="s2p-num">{String(i + 1).padStart(2, "0")}</span>
            <h3>{s.title}</h3>
            <p>{s.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

// ── A · Auto-playing stepper ───────────────────────────────────────────────────
const STEP_MS = 3600;
const COLS = 14;
const ROWS = 7;
type Fate = "screen" | "test" | "pass";
const LOTS: { fate: Fate; x: number; y: number }[] = (() => {
  const rnd = seq(7);
  const out: { fate: Fate; x: number; y: number }[] = [];
  for (let r = 0; r < ROWS; r += 1)
    for (let c = 0; c < COLS; c += 1) {
      const v = rnd();
      out.push({ fate: v < 0.24 ? "screen" : v < 0.6 ? "test" : "pass", x: 20 + c * 34, y: 20 + r * 34 });
    }
  return out;
})();

/** What a lot looks like at each step (0 Source … 4 Label and supply). */
function lotState(fate: Fate, step: number) {
  if (step === 0) return "raw";
  if (step === 1) return fate === "screen" ? "out" : "raw";
  if (step === 2) return fate === "screen" ? "out" : "test";
  return fate === "pass" ? "pass" : "out";
}

export function SealStepper({ stages }: { stages: ProcessStage[] }) {
  const n = stages.length;
  const root = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [inView, setInView] = useState(false);
  const [hover, setHover] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    const el = root.current;
    const io = el ? new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 }) : null;
    if (el && io) io.observe(el);
    return () => {
      mq.removeEventListener("change", sync);
      io?.disconnect();
    };
  }, []);

  const running = playing && inView && !hover && !reduced;
  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(() => setStep((s) => (s + 1) % n), STEP_MS);
    return () => window.clearTimeout(t);
  }, [running, step, n]);

  const go = (i: number) => setStep(((i % n) + n) % n);
  const sealed = step === n - 1;

  return (
    <div
      ref={root}
      className={`s2a ${running ? "is-running" : ""}`}
      style={{ ["--step-ms" as string]: `${STEP_MS}ms` }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <ol className="s2a-rail">
        {stages.map((s, i) => (
          <li key={s.title} className={i < step ? "is-done" : i === step ? "is-on" : ""}>
            <button type="button" onClick={() => go(i)} aria-current={i === step ? "step" : undefined}>
              <span className="s2a-n">{String(i + 1).padStart(2, "0")}</span>
              <span className="s2a-t">{s.title}</span>
              {i === step && <span className="s2a-bar" key={`${step}-${running}`} aria-hidden="true" />}
            </button>
          </li>
        ))}
      </ol>
      <div className="s2a-body">
        <div className="s2a-copy" aria-live="polite">
          <span className="s2a-k">
            Step {String(step + 1).padStart(2, "0")} of {String(n).padStart(2, "0")}
          </span>
          <h3>{stages[step].title}</h3>
          <p>{stages[step].body}</p>
          <div className="s2a-ctrl">
            <button type="button" onClick={() => go(step - 1)}>
              ‹ Prev
            </button>
            {!reduced && (
              <button type="button" className="is-play" onClick={() => setPlaying((p) => !p)}>
                {playing ? "❚❚ Pause" : "▶ Play"}
              </button>
            )}
            <button type="button" onClick={() => go(step + 1)}>
              Next ›
            </button>
          </div>
        </div>
        <div className="s2a-field" aria-hidden="true">
          <div className="s2a-fh">
            <span>Incoming lots</span>
            <span>Illustrative</span>
          </div>
          <svg viewBox={`0 0 ${COLS * 34 + 6} ${ROWS * 34 + 6}`} className="s2a-svg">
            {LOTS.map((l, i) => (
              <circle key={i} cx={l.x} cy={l.y} r={10} className={`s2a-lot is-${lotState(l.fate, step)}`} />
            ))}
            <g className={`s2a-seal ${sealed ? "is-on" : ""}`}>
              <circle cx={(COLS * 34 + 6) / 2} cy={(ROWS * 34 + 6) / 2} r={52} />
              <text x={(COLS * 34 + 6) / 2} y={(ROWS * 34 + 6) / 2 - 4} textAnchor="middle">
                PHYTO
              </text>
              <text x={(COLS * 34 + 6) / 2} y={(ROWS * 34 + 6) / 2 + 16} textAnchor="middle" className="b">
                PASSED
              </text>
            </g>
          </svg>
          <div className="s2a-legend">
            <span>
              <i className="is-raw" /> Sourced
            </span>
            <span>
              <i className="is-test" /> Under test
            </span>
            <span>
              <i className="is-out" /> Did not meet spec
            </span>
            <span>
              <i className="is-pass" /> Passed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
