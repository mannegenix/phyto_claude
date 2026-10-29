"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Snap from "lenis/snap";
import { getLenis } from "./SmoothScroll";

gsap.registerPlugin(ScrollTrigger);

/** Each wheel gesture moves this far inside a section taller than the screen. */
const STEP = 0.85;

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

    const ctx = gsap.context(() => {
      panels.forEach((p, i) => {
        const content = p.querySelector<HTMLElement>(":scope > .wrap");
        if (i > 0) {
          // A drop falls whenever a new section starts to rise.
          ScrollTrigger.create({ trigger: p, start: "top 80%", onEnter: drop, onLeaveBack: drop });
          if (content) {
            gsap.fromTo(
              content,
              { y: () => window.innerHeight * 0.1 },
              {
                y: 0,
                ease: "none",
                scrollTrigger: { trigger: p, start: "top bottom", end: "clamp(top top)", scrub: true },
              },
            );
          }
        }
        const next = panels[i + 1];
        if (next && content) {
          gsap.to(content, {
            scale: 0.94,
            yPercent: -3,
            opacity: 0.45,
            ease: "none",
            scrollTrigger: { trigger: next, start: "top bottom", end: "clamp(top top)", scrub: true },
          });
        }
      });
    });

    const id = requestAnimationFrame(() => requestAnimationFrame(layout));
    let t = 0;
    const ro = new ResizeObserver(() => {
      clearTimeout(t);
      t = window.setTimeout(layout, 150);
    });
    ro.observe(main);

    return () => {
      cancelAnimationFrame(id);
      clearTimeout(t);
      ro.disconnect();
      snap?.destroy();
      ctx.revert();
      panels.forEach((p) => {
        p.classList.remove("panel");
        p.style.removeProperty("z-index");
        p.style.removeProperty("--panel-top");
      });
      root.classList.remove("has-panels");
    };
  }, [pathname]);

  return (
    <div ref={fx} className="drop-fx" aria-hidden="true">
      <svg viewBox="0 0 200 260">
        <defs>
          <radialGradient id="drop-fx-fill" cx="0.35" cy="0.3" r="0.8">
            <stop offset="0" style={{ stopColor: "#ffffff", stopOpacity: 0.95 }} />
            <stop offset="0.35" style={{ stopColor: "var(--accent)" }} />
            <stop offset="1" style={{ stopColor: "var(--accent-text)" }} />
          </radialGradient>
        </defs>
        <ellipse className="dfx-ring dfx-ring-1" cx="100" cy="200" rx="70" ry="14" />
        <ellipse className="dfx-ring dfx-ring-2" cx="100" cy="200" rx="70" ry="14" />
        <ellipse className="dfx-ring dfx-ring-3" cx="100" cy="200" rx="70" ry="14" />
        <g className="dfx-drop">
          <path d="M100 20 C106 36 118 48 118 62 A18 18 0 0 1 82 62 C82 48 94 36 100 20Z" fill="url(#drop-fx-fill)" />
        </g>
        <g className="dfx-splash">
          <circle cx="86" cy="192" r="3" />
          <circle cx="114" cy="190" r="2.5" />
          <circle cx="100" cy="184" r="2" />
        </g>
      </svg>
    </div>
  );
}
