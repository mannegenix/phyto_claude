"use client";

import { useEffect } from "react";
import { HERO_SMALL } from "@/lib/hero-pref";

/** Keeps the homepage hero matched to the screen when it is resized or rotated (lib/hero-pref). */
export function HeroMode() {
  useEffect(() => {
    const mq = window.matchMedia(HERO_SMALL);
    const sync = () => document.documentElement.classList.toggle("hero-dev1", mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return null;
}
