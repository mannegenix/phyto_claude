"use client";

import { calmMotion } from "@/lib/motion-pref";

import { useEffect, useRef, useState } from "react";
import type { ProcessStage } from "@/content/types";

/**
 * "From source to seal" on Manufacturing & Quality: an auto-playing stepper — the steps
 * advance by themselves, the lot grid changes for each step, and visitors can click any step
 * or pause. Illustrative: no counts, no reject rates.
 */

/** Deterministic pseudo-random sequence (same output on server and client). */
function seq(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
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
  // "Interacting" = the visitor is actually using the stepper (moved the pointer over it,
  // or focused a control) in the last few seconds. A cursor that merely rests on screen
  // while the page scrolls underneath it no longer pauses the animation.
  const [interacting, setInteracting] = useState(false);
  const idle = useRef(0);
  const [reduced, setReduced] = useState(false);

  // Visibility, checked several ways so the stepper always starts when it is on screen —
  // including after leaving the page and coming back, scrolling back and forth, and inside
  // the full-screen sections (where a covered section still "intersects"):
  //  - IntersectionObserver for the quick start/stop
  //  - a light 700 ms check: on screen, not covered by another section, tab visible
  useEffect(() => {
    if (calmMotion()) requestAnimationFrame(() => setReduced(true));
    const el = root.current;
    if (!el) return;
    const check = () => {
      if (document.hidden) return setInView(false);
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const shown = Math.min(r.bottom, vh) - Math.max(r.top, 0);
      if (shown < Math.min(r.height, vh) * 0.35) return setInView(false);
      const x = Math.min(Math.max(r.left + r.width / 2, 1), window.innerWidth - 1);
      const y = Math.min(Math.max((Math.max(r.top, 0) + Math.min(r.bottom, vh)) / 2, 1), vh - 1);
      const hit = document.elementFromPoint(x, y);
      setInView(!hit || el.contains(hit) || !!hit.closest(".s2a"));
    };
    const io = new IntersectionObserver(check, { threshold: [0, 0.35, 0.7] });
    io.observe(el);
    const poll = window.setInterval(check, 700);
    document.addEventListener("visibilitychange", check);
    window.addEventListener("pageshow", check);
    requestAnimationFrame(check);
    return () => {
      io.disconnect();
      clearInterval(poll);
      document.removeEventListener("visibilitychange", check);
      window.removeEventListener("pageshow", check);
      clearTimeout(idle.current);
    };
  }, []);

  // Coming back into view after being away: replay the story from the first step.
  const wasInView = useRef(false);
  useEffect(() => {
    if (inView && !wasInView.current) requestAnimationFrame(() => setStep(0));
    wasInView.current = inView;
  }, [inView]);

  const touch = () => {
    setInteracting(true);
    clearTimeout(idle.current);
    idle.current = window.setTimeout(() => setInteracting(false), 3000);
  };
  const release = () => {
    clearTimeout(idle.current);
    setInteracting(false);
  };

  const running = playing && inView && !interacting && !reduced;
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
      onPointerMove={(e) => {
        // Real movement only (some browsers send a still "move" when the page scrolls).
        if (e.pointerType === "mouse" && (e.movementX || e.movementY)) touch();
      }}
      onPointerLeave={release}
      onFocus={touch}
      onBlur={release}
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
