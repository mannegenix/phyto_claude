"use client";

import { useEffect, useState } from "react";
import { currentSkin, setSkin, SKINS, DEFAULT_SKIN, type Skin } from "@/lib/skin-pref";

const LABEL: Record<Skin, string> = { light: "Light", gradient: "Gradient", logo: "Logo" };

/** Footer switch between the site looks (stored on this device). */
export function SkinToggle() {
  const [skin, setLocal] = useState<Skin>(DEFAULT_SKIN);
  useEffect(() => {
    requestAnimationFrame(() => setLocal(currentSkin()));
  }, []);
  const pick = (s: Skin) => {
    setSkin(s);
    setLocal(s);
  };
  return (
    <span className="skin-toggle" role="group" aria-label="Site colours">
      {SKINS.map((s) => (
        <button key={s} type="button" aria-pressed={skin === s} onClick={() => pick(s)}>
          {LABEL[s]}
        </button>
      ))}
    </span>
  );
}
