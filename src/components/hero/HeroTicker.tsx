"use client";

import { useEffect, useState } from "react";

type Stage = "lots" | "test" | "passed";
type Status = "awaiting" | "lots" | "test" | "passed";
const LABEL: Record<Status, string> = {
  awaiting: "Awaiting",
  lots: "Lot in",
  test: "Testing",
  passed: "Passed",
};

/**
 * Product ticker under the hero, linked to the lot animation above it (SpecimenHero sends
 * "pe:specimen"): extracts are numbered in the order the hero tests them; the one in the
 * hero shows Lot in → Testing → Passed, earlier ones stay Passed for the round, later ones
 * show Awaiting. When the round starts again from the first extract, everything resets.
 */
export function HeroTicker({ items }: { items: { slug: string; short: string; marker: string }[] }) {
  const [state, setState] = useState<{ index: number; stage: Stage }>({ index: 0, stage: "lots" });

  useEffect(() => {
    const now = (window as unknown as { __peSpecimen?: { index: number; stage: Stage } }).__peSpecimen;
    if (now) requestAnimationFrame(() => setState(now));
    const on = (e: Event) => setState((e as CustomEvent<{ index: number; stage: Stage }>).detail);
    window.addEventListener("pe:specimen", on);
    return () => window.removeEventListener("pe:specimen", on);
  }, []);

  const status = (i: number): Status =>
    i < state.index ? "passed" : i > state.index ? "awaiting" : state.stage === "passed" ? "passed" : state.stage;

  const row = (copy: number) =>
    items.map((p, i) => {
      const s = status(i);
      return (
        <span key={`${copy}-${p.slug}`} className={`ticker-item is-${s} ${i === state.index ? "is-current" : ""}`}>
          <span className="ticker-no">{String(i + 1).padStart(2, "0")}</span>
          <b>{p.short}</b> <span className="ticker-marker">{p.marker.split(/[,/(]/)[0].trim()}</span>
          <span className={`ticker-ok ticker-st is-${s}`}>{LABEL[s]}</span>
        </span>
      );
    });

  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        {row(0)}
        {row(1)}
      </div>
    </div>
  );
}
