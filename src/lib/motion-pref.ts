/**
 * Motion preference for the site.
 *
 * The client wants the full motion experience (smooth scroll, full-screen sections,
 * reveals) on every device, including Macs with the system "Reduce motion" setting on —
 * so the site does not follow `prefers-reduced-motion`. The footer "Reduce motion" switch
 * was removed (Nov 19); `html.pe-calm` (CSS and components key off it) is kept as the
 * off-switch, and a stored `pe-motion=calm` from the old switch is cleared at boot.
 */
export const MOTION_KEY = "pe-motion";

/** True when the visitor has switched motion off for this site. */
export const calmMotion = () =>
  typeof document !== "undefined" && document.documentElement.classList.contains("pe-calm");

/** Inline <head> script: clear the old footer switch's stored preference before first paint. */
export const motionBootScript = `try{localStorage.removeItem("${MOTION_KEY}")}catch(e){}`;
