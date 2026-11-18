"use client";

import { useEffect, useState } from "react";
import { calmMotion, setCalmMotion } from "@/lib/motion-pref";

/** Footer switch: visitors can turn the site's motion off (stored on this device). */
export function MotionToggle() {
  const [calm, setCalm] = useState(false);
  useEffect(() => {
    requestAnimationFrame(() => setCalm(calmMotion()));
  }, []);
  return (
    <button type="button" className="motion-toggle" aria-pressed={calm} onClick={() => setCalmMotion(!calm)}>
      {calm ? "Turn motion on" : "Reduce motion"}
    </button>
  );
}
