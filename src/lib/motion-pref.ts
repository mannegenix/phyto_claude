/**
 * Motion preference for the site.
 *
 * The client wants the full motion experience (smooth scroll, full-screen sections,
 * reveals) on every device, including Macs with the system "Reduce motion" setting on —
 * so the site does not follow `prefers-reduced-motion`. Visitors who want less motion use
 * the "Reduce motion" switch in the footer: it stores `pe-motion=calm` and the boot script
 * adds `html.pe-calm` before first paint; CSS and components key off that class.
 */
export const MOTION_KEY = "pe-motion";

/** True when the visitor has switched motion off for this site. */
export const calmMotion = () =>
  typeof document !== "undefined" && document.documentElement.classList.contains("pe-calm");

/** Inline <head> script: apply the stored preference before first paint. */
export const motionBootScript = `try{if(localStorage.getItem("${MOTION_KEY}")==="calm")document.documentElement.classList.add("pe-calm")}catch(e){}`;

export function setCalmMotion(on: boolean) {
  try {
    if (on) localStorage.setItem(MOTION_KEY, "calm");
    else localStorage.removeItem(MOTION_KEY);
  } catch {}
  // Every motion component reads the preference when it starts: reload to apply cleanly.
  location.reload();
}
