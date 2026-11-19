"use client";

import { useEffect } from "react";
import { fallBack, fxNative, probeFrameRate } from "@/lib/fx-guard";

/**
 * Watches for conditions that stall the scroll effects (see lib/fx-guard) and switches the
 * visit to ordinary scrolling: a slow frame rate after load, or a script error from this
 * site. Touch devices already scroll natively.
 */
export function FxGuard() {
  useEffect(() => {
    if (fxNative()) return;
    const touch = window.matchMedia("(max-width: 1120px), (hover: none) and (pointer: coarse)").matches;
    const stop = touch ? () => {} : probeFrameRate(() => fallBack("slow frame rate"));
    const ours = (file?: string) => !file || file.startsWith(location.origin);
    const onError = (e: ErrorEvent) => {
      if (ours(e.filename)) fallBack("script error");
    };
    window.addEventListener("error", onError);
    return () => {
      stop();
      window.removeEventListener("error", onError);
    };
  }, []);
  return null;
}
