"use client";

import { useEffect } from "react";

/**
 * The site uses the browser's standard scrolling everywhere (no smooth-scroll library, no
 * scroll-driven effects). One click behaviour is kept: a link to the page you are already
 * on (logo or Home on the homepage, Products on /products …) glides back to the top instead
 * of reloading, so the preloader does not replay.
 */
export function SamePageTop() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!a || a.getAttribute("target") === "_blank") return;
      const url = new URL((a as HTMLAnchorElement).href, location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || url.hash) return;
      e.preventDefault();
      if (location.hash) history.pushState(null, "", url.pathname + url.search);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
  return null;
}
