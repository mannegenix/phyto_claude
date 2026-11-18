"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Page dots under every `.rail` while it is a horizontal swipe rail (phones; see
 * styles/mobile.css). Tells visitors there is more to swipe and where they are.
 */
export function RailDots() {
  const pathname = usePathname();

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    let cleanups: (() => void)[] = [];

    const teardown = () => {
      cleanups.forEach((c) => c());
      cleanups = [];
    };

    const setup = () => {
      teardown();
      if (!mq.matches) return;
      document.querySelectorAll<HTMLElement>("main .rail").forEach((rail) => {
        const items = [...rail.children] as HTMLElement[];
        if (items.length < 2) return;
        const dots = document.createElement("div");
        dots.className = "rail-dots";
        dots.setAttribute("aria-hidden", "true");
        items.forEach(() => dots.appendChild(document.createElement("i")));
        rail.after(dots);

        let raf = 0;
        const update = () => {
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(() => {
            const left = rail.getBoundingClientRect().left;
            let best = 0;
            let dist = Infinity;
            items.forEach((it, i) => {
              const d = Math.abs(it.getBoundingClientRect().left - left - 16);
              if (d < dist) {
                dist = d;
                best = i;
              }
            });
            // At the very end the last cards can't reach the start: light the last dot.
            if (rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4) best = items.length - 1;
            [...dots.children].forEach((d, i) => d.classList.toggle("on", i === best));
          });
        };
        update();
        rail.addEventListener("scroll", update, { passive: true });
        cleanups.push(() => {
          rail.removeEventListener("scroll", update);
          cancelAnimationFrame(raf);
          dots.remove();
        });
      });
    };

    // Wait a frame so the new page's sections are in place.
    const t = window.setTimeout(setup, 120);
    mq.addEventListener("change", setup);
    return () => {
      window.clearTimeout(t);
      mq.removeEventListener("change", setup);
      teardown();
    };
  }, [pathname]);

  return null;
}
