"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Snap from "lenis/snap";
import { getLenis } from "./SmoothScroll";

gsap.registerPlugin(ScrollTrigger);

/** Each wheel gesture moves this far inside a section taller than the screen. */
const STEP = 1;
/** Glide time for one screen (seconds). Slower reads calmer and lets the reveal finish. */
const GLIDE = 1.1;
/** A new wheel gesture starts after this much quiet (ms); trackpad momentum is swallowed. */
const QUIET = 200;
const ease = (t: number) => 1 - Math.pow(1 - t, 4);

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
 * section is held in place and uncovered by a circle growing from the centre of the
 * screen, with a ripple ring on its edge, while the section underneath stays still.
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
    let snapList: number[] = [];

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
      snapList = Array.from(new Set(snaps)).sort((a, b) => a - b);

      if (lenis) {
        // Touch: Lenis snap settles a swipe on the next screen. Wheel is stepped below.
        snap?.destroy();
        snap = new Snap(lenis, {
          type: "lock",
          distanceThreshold: 1e6,
          duration: GLIDE,
          easing: ease,
          debounce: 60,
        });
        snapList.forEach((v) => snap?.add(v));
      }
      ScrollTrigger.refresh();
    };

    const vh = () => window.innerHeight;

    // Each incoming section gets a ripple ring that rides the edge of the reveal.
    const rings = panels.map((p, i) => {
      if (i === 0) return null;
      const ring = document.createElement("span");
      ring.className = "rip-ring";
      ring.setAttribute("aria-hidden", "true");
      p.appendChild(ring);
      return ring;
    });

    /**
     * The reveal, driven straight from the scroll position (no tweens to fall behind):
     * while the snap glides from section i-1 to i, section i is held in place over the
     * screen and uncovered only through a circle growing from the centre. The section
     * underneath stays still, so nothing slides in ahead of the ripple.
     */
    const state: { p: number; covered: boolean }[] = [];
    const update = () => {
      const y = window.scrollY;
      const h = vh();
      const w = window.innerWidth;
      const maxR = Math.hypot(w / 2, h / 2) + 24;
      panels.forEach((p, i) => {
        const prev = state[i] ?? { p: -1, covered: false };
        const covered = i < panels.length - 1 && tops[i + 1] !== undefined && y >= tops[i + 1] + 2;
        if (covered !== prev.covered) p.classList.toggle("is-covered", covered);
        // The reveal runs from the moment the previous section is fully settled (wavy
        // edges overlap a little) until this section reaches the top of the screen.
        let prog = 1;
        let len = h;
        if (i > 0 && tops[i] !== undefined) {
          const settled = tops[i - 1] + Math.max(0, heights[i - 1] - h);
          const start = Math.max(tops[i] - h, settled);
          len = Math.max(1, tops[i] - start);
          prog = Math.min(1, Math.max(0, (y - start) / len));
          // Snap points are rounded to whole pixels: treat the last pixel either side as rest.
          if (y - start < 2) prog = 0;
          else if (tops[i] - y < 2) prog = 1;
        }
        if (prog !== prev.p) {
          if (i > 0) {
            if (prog >= 1) {
              p.style.removeProperty("clip-path");
              p.style.removeProperty("translate");
              p.style.removeProperty("visibility");
            } else {
              const r = maxR * prog;
              p.style.translate = `0 ${-len * (1 - prog)}px`;
              p.style.clipPath = `circle(${r.toFixed(1)}px at 50% ${(h / 2).toFixed(0)}px)`;
              p.style.visibility = prog <= 0 ? "hidden" : "";
            }
            const ring = rings[i];
            if (ring) {
              const on = prog > 0.01 && prog < 0.99;
              ring.style.opacity = on ? String(0.9 * (1 - prog) + 0.1) : "0";
              ring.style.transform = `translate(-50%, -50%) scale(${((maxR * 2 * prog) / 100).toFixed(3)})`;
            }
            p.style.setProperty("--rip-p", prog.toFixed(3));
          }
        }
        state[i] = { p: prog, covered };
      });
    };
    let raf = 0;
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(() => {
        raf = 0;
        update();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const ctx = gsap.context(() => {});

    /**
     * Wheel stepping: one gesture moves exactly one screen. Lenis snap alone reacted to
     * every pause in the wheel stream, so a fast trackpad flick (whose momentum keeps
     * sending events for a second or more) opened a section and ran straight on to the
     * next. Here the first event of a gesture starts the glide; everything after it is
     * swallowed until the glide ends and the wheel has been quiet, unless a clearly new
     * flick arrives (a sharp rise in speed) after the glide.
     */
    let gliding = false;
    let lastWheel = 0;
    let lastAbs = 0;
    const step = (dir: number) => {
      if (!lenis) return;
      const y = lenis.targetScroll ?? window.scrollY;
      const target = dir > 0 ? snapList.find((v) => v > y + 4) : [...snapList].reverse().find((v) => v < y - 4);
      if (target === undefined) return;
      gliding = true;
      lenis.scrollTo(target, {
        duration: GLIDE,
        easing: ease,
        lock: true,
        onComplete: () => {
          gliding = false;
        },
      });
    };
    if (lenis) {
      lenis.options.virtualScroll = ({ deltaY, event }) => {
        if (!event.type.includes("wheel") || event.ctrlKey || lenis.isStopped) return true;
        if (event.composedPath().some((n) => n instanceof HTMLElement && n.hasAttribute("data-lenis-prevent")))
          return true;
        if (event.cancelable) event.preventDefault();
        const now = performance.now();
        const abs = Math.abs(deltaY);
        const gap = now - lastWheel;
        const fresh = gap > QUIET || (!gliding && abs > Math.max(10, lastAbs * 1.5));
        lastWheel = now;
        lastAbs = abs;
        if (!gliding && fresh && abs >= 2) step(Math.sign(deltaY));
        return false;
      };
    }

    const relayout = () => {
      layout();
      state.length = 0;
      update();
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
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      snap?.destroy();
      if (lenis) lenis.options.virtualScroll = undefined;
      ctx.revert();
      panels.forEach((p) => {
        p.classList.remove("panel", "is-covered");
        p.style.removeProperty("clip-path");
        p.style.removeProperty("translate");
        p.style.removeProperty("visibility");
        p.style.removeProperty("--rip-p");
        p.querySelectorAll(":scope > .rip-ring").forEach((r) => r.remove());
        p.style.removeProperty("z-index");
        p.style.removeProperty("--panel-top");
      });
      root.classList.remove("has-panels");
    };
  }, [pathname]);

  return (
    <div ref={fx} hidden />
  );
}
