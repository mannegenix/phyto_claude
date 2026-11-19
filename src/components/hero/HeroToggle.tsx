"use client";

import { useEffect, useState } from "react";
import { HERO_KEY } from "@/lib/hero-pref";

/**
 * Review switch at the top left of the homepage hero: "Dev 2" (the current lot-testing
 * hero, default) or "Dev 1" (the photo-slit hero layout from dev1.phytoelements.in with
 * the same copy). Stored on the device; applied before paint as html.hero-dev1.
 */

export function HeroToggle() {
  const [v, setV] = useState<"dev1" | "dev2">("dev2");
  useEffect(() => {
    requestAnimationFrame(() => setV(document.documentElement.classList.contains("hero-dev1") ? "dev1" : "dev2"));
  }, []);
  const pick = (next: "dev1" | "dev2") => {
    document.documentElement.classList.toggle("hero-dev1", next === "dev1");
    try {
      if (next === "dev1") localStorage.setItem(HERO_KEY, "dev1");
      else localStorage.removeItem(HERO_KEY);
    } catch {
      /* storage unavailable */
    }
    setV(next);
  };
  return (
    <div className="hero-toggle" role="group" aria-label="Hero design">
      {(["dev1", "dev2"] as const).map((k) => (
        <button key={k} type="button" aria-pressed={v === k} onClick={() => pick(k)}>
          {k === "dev1" ? "Dev 1" : "Dev 2"}
        </button>
      ))}
    </div>
  );
}
