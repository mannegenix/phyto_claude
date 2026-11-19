/**
 * Safety net for the scroll effects (full-screen sections, circle reveal, smooth wheel,
 * hero canvas). On some office laptops — old browsers, slow integrated graphics, hardware
 * acceleration off — they can stall. When that is detected the site drops to ordinary
 * scrolling (html.pe-native) for the rest of the visit instead of leaving a broken scroll.
 *
 * Triggers:
 *  - boot: the browser lacks features the effects need (checked before paint)
 *  - frame-rate probe: the page renders below about 25 fps after load
 *  - watchdog: several wheel gestures in a row that do not move the page
 *  - a script error
 * The fallback is remembered for the browser tab (sessionStorage), so the next page
 * starts in ordinary scrolling too.
 */
export const FX_KEY = "pe-native";
export const FX_EVENT = "pe:fallback";

/** Inline <head> script: feature check + remembered fallback, before first paint. */
export const fxBootScript = `(function(){var h=document.documentElement;try{var ok=window.CSS&&CSS.supports&&CSS.supports("height","100svh")&&CSS.supports("clip-path","circle(10px at 50% 50%)")&&CSS.supports("position","sticky")&&CSS.supports("color","color-mix(in srgb, red, blue)")&&"IntersectionObserver" in window&&"ResizeObserver" in window&&typeof requestAnimationFrame==="function";var stored=false;try{stored=sessionStorage.getItem("${FX_KEY}")==="1"}catch(e){}if(!ok){h.classList.add("pe-native","pe-calm")}else if(stored){h.classList.add("pe-native")}}catch(e){h.classList.add("pe-native","pe-calm")}})()`;

export const fxNative = () =>
  typeof document !== "undefined" && document.documentElement.classList.contains("pe-native");

/** Switch the rest of the visit to ordinary scrolling. Safe to call more than once. */
export function fallBack(reason: string) {
  if (typeof document === "undefined" || fxNative()) return;
  document.documentElement.classList.add("pe-native");
  try {
    sessionStorage.setItem(FX_KEY, "1");
  } catch {
    /* storage unavailable: lasts for this page */
  }
  console.info(`[phyto] scroll effects off (${reason}); using standard scrolling`);
  window.dispatchEvent(new CustomEvent(FX_EVENT, { detail: reason }));
}

/**
 * Measure the frame rate for a short moment once the page is idle. Calls `onSlow` when
 * the median frame takes longer than `limitMs` (default 40 ms, i.e. under 25 fps).
 */
export function probeFrameRate(onSlow: () => void, limitMs = 40, frames = 45) {
  let raf = 0;
  let last = 0;
  const gaps: number[] = [];
  const tick = (t: number) => {
    if (last) gaps.push(t - last);
    last = t;
    if (gaps.length < frames) {
      raf = requestAnimationFrame(tick);
      return;
    }
    if (document.hidden) return;
    gaps.sort((a, b) => a - b);
    const median = gaps[Math.floor(gaps.length / 2)];
    if (median > limitMs) onSlow();
  };
  // Start after the preloader and first paint have settled.
  const start = window.setTimeout(() => {
    if (!document.hidden) raf = requestAnimationFrame(tick);
  }, 3500);
  return () => {
    clearTimeout(start);
    cancelAnimationFrame(raf);
  };
}
