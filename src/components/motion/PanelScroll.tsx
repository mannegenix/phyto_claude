"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Snap from "lenis/snap";
import { getLenis } from "./SmoothScroll";
import { LeafDropArt } from "./LeafDropArt";

gsap.registerPlugin(ScrollTrigger);

/** Each wheel gesture moves this far inside a section taller than the screen. */
const STEP = 0.85;

/**
 * Natural (unstuck) document position of each panel, computed from the layout once
 * per resize. Animations use these numbers rather than measuring sticky elements,
 * which report their stuck position and would make timings drift further down the page.
 */
const naturalTops = new WeakMap<Element, number>();
export const panelTop = (el: Element) => naturalTops.get(el);

/**
 * Full-screen section mode.
 *
 * Every top-level section becomes a panel that fills the screen and stays put
 * (sticky) while the next one rises over it, so the page reads as a series of
 * screens rather than one long scroll. A wheel gesture moves one screen (Lenis
 * snap, "lock"); sections taller than the screen are stepped through. Incoming
 * content drifts up, outgoing content recedes, and a drop of extract falls into
 * the incoming section's liquid edge.
 *
 * Off for reduced motion and inside the review compare panes. Without JavaScript
 * the page is an ordinary scrolling page.
 */
export function PanelScroll() {
  const pathname = usePathname();
  const fx = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || root.classList.contains("pe-embed")) return;

    const main = document.querySelector("main");
    if (!main) return;
    const panels = Array.from(main.querySelectorAll<HTMLElement>(":scope > section, :scope > div > section"));
    if (panels.length < 2) return;

    root.classList.add("has-panels");
    panels.forEach((p, i) => {
      p.classList.add("panel");
      p.style.zIndex = String(i + 1);
    });

    let snap: Snap | null = null;
    const lenis = getLenis();

    const drop = () => {
      const el = fx.current;
      if (!el) return;
      el.classList.remove("is-dropping");
      void el.offsetWidth; // restart the CSS animation
      el.classList.add("is-dropping");
    };

    const tops: number[] = [];
    const heights: number[] = [];

    const layout = () => {
      const vh = window.innerHeight;
      // Natural (unstuck) document positions, from the main element and each panel's flow.
      // The first panel starts after whatever precedes it (a page header), or at main's top.
      const before = panels[0].previousElementSibling as HTMLElement | null;
      let y = before
        ? before.getBoundingClientRect().bottom + window.scrollY + (parseFloat(getComputedStyle(panels[0]).marginTop) || 0)
        : main.getBoundingClientRect().top + window.scrollY;
      const snaps: number[] = [];
      panels.forEach((p, i) => {
        const cs = getComputedStyle(p);
        // The first panel's margin collapses into <main>, so it is already in main's position.
        if (i > 0) y += parseFloat(cs.marginTop) || 0;
        const h = p.offsetHeight;
        tops[i] = y;
        heights[i] = h;
        naturalTops.set(p, y);
        // Tall panels scroll through, then stick at their bottom while the next one covers them.
        p.style.setProperty("--panel-top", `${Math.min(0, vh - h)}px`);
        if (i === 0 && y > 4) snaps.push(0);
        snaps.push(Math.max(0, Math.round(y)));
        const declared = Number(p.dataset.steps);
        if (declared > 1 && h > vh) {
          // A pinned step-by-step section: one snap per step, evenly through its scroll length.
          for (let k = 1; k < declared; k += 1) snaps.push(Math.round(y + ((h - vh) * k) / (declared - 1)));
        } else if (h - vh > 60) {
          for (let s = y + vh * STEP; s < y + h - vh - 60; s += vh * STEP) snaps.push(Math.round(s));
          snaps.push(Math.round(y + h - vh));
        }
        y += h + (parseFloat(cs.marginBottom) || 0);
      });
      snaps.push(Math.round(document.documentElement.scrollHeight - vh));

      if (lenis) {
        snap?.destroy();
        snap = new Snap(lenis, {
          type: "lock",
          // Lock: every gesture goes to the next or previous screen, however far it is.
          distanceThreshold: 1e6,
          duration: 1.15,
          easing: (t) => 1 - Math.pow(1 - t, 4),
          debounce: 60,
        });
        Array.from(new Set(snaps))
          .sort((a, b) => a - b)
          .forEach((v) => snap?.add(v));
      }
      ScrollTrigger.refresh();
    };

    const vh = () => window.innerHeight;
    const ctx = gsap.context(() => {
      panels.forEach((p, i) => {
        const content = p.querySelector<HTMLElement>(":scope > .wrap");
        if (i > 0) {
          // A drop falls whenever a new section starts to rise.
          ScrollTrigger.create({
            start: () => tops[i] - vh() * 0.8,
            end: () => tops[i] + 1,
            onEnter: drop,
            onLeaveBack: drop,
          });
          if (content) {
            gsap.fromTo(
              content,
              { y: () => vh() * 0.1 },
              {
                y: 0,
                ease: "none",
                scrollTrigger: { start: () => tops[i] - vh(), end: () => tops[i], scrub: true, invalidateOnRefresh: true },
              },
            );
          }
        }
        const next = panels[i + 1];
        if (next && content) {
          // A 3D canvas measures its on-screen size, so it must not be scaled mid-animation.
          const hasCanvas = !!content.querySelector("canvas, .flag-art");
          gsap.to(content, {
            scale: hasCanvas ? 1 : 0.94,
            yPercent: -3,
            opacity: 0.45,
            ease: "none",
            scrollTrigger: {
              // Starts only once this section is fully settled (wavy edges overlap a little).
              start: () => Math.max(tops[i + 1] - vh(), tops[i] + heights[i] - vh()) + 1,
              end: () => tops[i + 1],
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
        }
      });
    });

    // Sections fully covered by the next one are hidden, so only the visible pair repaints.
    let covered: boolean[] = [];
    const updateCovered = () => {
      const y = window.scrollY;
      panels.forEach((p, i) => {
        const c = i < panels.length - 1 && tops[i + 1] !== undefined && y >= tops[i + 1] + 2;
        if (c !== covered[i]) {
          covered[i] = c;
          p.classList.toggle("is-covered", c);
        }
      });
    };
    window.addEventListener("scroll", updateCovered, { passive: true });

    const relayout = () => {
      layout();
      covered = [];
      updateCovered();
    };
    const id = requestAnimationFrame(() => requestAnimationFrame(relayout));
    // Re-measure only when the page really changes size (not on every inner animation).
    let t = 0;
    let lastH = 0;
    let lastW = 0;
    const ro = new ResizeObserver(() => {
      const h = main.offsetHeight;
      const w = window.innerWidth;
      if (Math.abs(h - lastH) < 2 && w === lastW) return;
      lastH = h;
      lastW = w;
      clearTimeout(t);
      t = window.setTimeout(relayout, 150);
    });
    ro.observe(main);

    return () => {
      cancelAnimationFrame(id);
      clearTimeout(t);
      ro.disconnect();
      window.removeEventListener("scroll", updateCovered);
      snap?.destroy();
      ctx.revert();
      panels.forEach((p) => {
        p.classList.remove("panel", "is-covered");
        p.style.removeProperty("z-index");
        p.style.removeProperty("--panel-top");
      });
      root.classList.remove("has-panels");
    };
  }, [pathname]);

  return (
    <div ref={fx} className="drop-fx" aria-hidden="true">
      <LeafDropArt id="dfx" />
    </div>
  );
}
