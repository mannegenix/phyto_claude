"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";
import { panelTop } from "./PanelScroll";

gsap.registerPlugin(ScrollTrigger);

let current: Lenis | null = null;
/** The active Lenis instance (null when smooth scrolling is off). */
export const getLenis = () => current;

/** Anchor targets land this far below the top, clearing the fixed header. */
const ANCHOR_GAP = 84;

/** Page Y for an anchor target, measured from the real scroll position. */
const anchorY = (el: Element) => Math.max(0, el.getBoundingClientRect().top + window.scrollY - ANCHOR_GAP);

/**
 * Jump to a #target once the page has settled. In full-screen section mode the target
 * is a panel: wait until PanelScroll has measured it and land exactly on its screen
 * (its natural top), since sticky panels report their stuck position.
 */
function jumpTo(target: Element, lenis: Lenis | null) {
  let frames = 0;
  let raf = 0;
  const go = () => {
    const panelMode = document.documentElement.classList.contains("has-panels");
    const top = panelTop(target.closest(".panel") ?? target);
    if (panelMode && top === undefined && frames++ < 60) {
      raf = requestAnimationFrame(go);
      return;
    }
    const y = top !== undefined ? Math.round(top) : anchorY(target);
    if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
    else window.scrollTo(0, y);
    ScrollTrigger.refresh();
  };
  raf = requestAnimationFrame(go);
  return () => cancelAnimationFrame(raf);
}

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger animations
 * (pinned sections, scroll-scrubbed video) stay perfectly in sync.
 * Disabled for visitors who prefer reduced motion.
 *
 * Navigation: a click while the scroll is still gliding must not carry that glide
 * onto the next page. Lenis is stopped on every internal link click, and each new
 * page starts at the top (or at its #anchor). Back/forward keeps the browser's
 * restored position.
 */
export function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const fromHistory = useRef(false);
  const firstRender = useRef(true);

  useEffect(() => {
    const onPop = () => {
      fromHistory.current = true;
    };
    window.addEventListener("popstate", onPop);

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      // Inside the review compare page the parent drives scrolling, so keep native scroll.
      document.documentElement.classList.contains("pe-embed")
    ) {
      return () => window.removeEventListener("popstate", onPop);
    }

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenisRef.current = lenis;
    current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Freeze any glide the moment an internal link to another page is clicked.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!a || a.getAttribute("target") === "_blank") return;
      const url = new URL((a as HTMLAnchorElement).href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname) {
        // Same-page #anchor: glide to it, just below the header.
        const target = url.hash ? document.getElementById(decodeURIComponent(url.hash.slice(1))) : null;
        if (!target) return;
        e.preventDefault();
        history.pushState(null, "", url.hash);
        lenis.scrollTo(anchorY(target), { force: true });
        return;
      }
      // Another page: freeze any glide so it is not carried onto the next page.
      lenis.scrollTo(window.scrollY, { immediate: true, force: true });
    };
    document.addEventListener("click", onClick, true);

    return () => {
      window.removeEventListener("popstate", onPop);
      document.removeEventListener("click", onClick, true);
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
      current = null;
    };
  }, []);

  // Every new page starts at the top (or its #anchor); back/forward keeps the restored position.
  useEffect(() => {
    const lenis = lenisRef.current;
    const back = fromHistory.current;
    fromHistory.current = false;
    // On first load (or reload) leave the browser's own position alone, except for #anchors.
    const initial = firstRender.current;
    firstRender.current = false;
    if (initial && !location.hash) return;

    let cancelJump: (() => void) | undefined;
    const id = requestAnimationFrame(() => {
      const hash = decodeURIComponent(location.hash.slice(1));
      const target = hash ? document.getElementById(hash) : null;
      if (target) {
        // A #section (including Back to "/#products" from a product page) lands on that section.
        cancelJump = jumpTo(target, lenis);
      } else if (back) {
        lenis?.scrollTo(window.scrollY, { immediate: true, force: true });
      } else if (lenis) {
        lenis.scrollTo(0, { immediate: true, force: true });
      } else {
        window.scrollTo(0, 0);
      }
      lenis?.resize();
      ScrollTrigger.refresh();
    });
    return () => {
      cancelAnimationFrame(id);
      cancelJump?.();
    };
  }, [pathname]);

  return null;
}
