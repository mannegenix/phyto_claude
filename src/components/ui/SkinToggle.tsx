"use client";

import { useEffect, useState } from "react";
import { currentSkin, setSkin, type Skin } from "@/lib/skin-pref";

/** Footer switch between the Light and Gradient looks (stored on this device). */
export function SkinToggle() {
  const [skin, setLocal] = useState<Skin>("light");
  useEffect(() => {
    requestAnimationFrame(() => setLocal(currentSkin()));
  }, []);
  const pick = (s: Skin) => {
    setSkin(s);
    setLocal(s);
  };
  return (
    <span className="skin-toggle" role="group" aria-label="Site colours">
      {(["light", "gradient"] as const).map((s) => (
        <button key={s} type="button" aria-pressed={skin === s} onClick={() => pick(s)}>
          {s === "light" ? "Light" : "Gradient"}
        </button>
      ))}
    </span>
  );
}
