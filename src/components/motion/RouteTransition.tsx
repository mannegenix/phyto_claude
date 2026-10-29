"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { LeafDropArt } from "./LeafDropArt";

/**
 * Page-to-page transition: clicking an internal link to another page covers the
 * screen; when the new page is in place, a drop of extract falls from a leaf into
 * the bottle and the cover lifts. Full page loads use the preloader instead.
 * Skipped for reduced motion, new-tab clicks and same-page anchors.
 */
export function RouteTransition() {
  const pathname = usePathname();
  const el = useRef<HTMLDivElement>(null);
  const covering = useRef(false);
  const timers = useRef<number[]>([]);

  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (document.documentElement.classList.contains("pe-embed")) return;
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      const node = el.current;
      if (!node) return;
      clear();
      covering.current = true;
      node.classList.remove("is-dropping", "is-lifting");
      node.classList.add("is-covering");
      // Never leave the cover up if navigation stalls.
      timers.current.push(
        window.setTimeout(() => {
          covering.current = false;
          node.classList.remove("is-covering");
        }, 6000),
      );
    };
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      clear();
    };
  }, []);

  useEffect(() => {
    const node = el.current;
    if (!node || !covering.current) return;
    covering.current = false;
    clear();
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        node.classList.add("is-dropping");
        timers.current.push(
          window.setTimeout(() => node.classList.add("is-lifting"), 1150),
          window.setTimeout(() => node.classList.remove("is-covering", "is-dropping", "is-lifting"), 1700),
        );
      }),
    );
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return (
    <div ref={el} className="route-fx" aria-hidden="true">
      <div className="route-fx-art">
        <LeafDropArt id="rt" />
      </div>
    </div>
  );
}
