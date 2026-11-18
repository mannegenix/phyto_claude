"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { calmMotion } from "@/lib/motion-pref";

/**
 * Navigation above every `.rail` while it is a horizontal swipe rail (phones; see
 * styles/mobile.css): "Swipe" hint, position (01 / 06), progress bar and prev / next
 * buttons, so visitors can see there is more to the side. The first time a rail comes
 * into view it nudges sideways once to show that it moves.
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
        const n = items.length;
        if (n < 2) return;
        const pad = (v: number) => String(v).padStart(2, "0");

        const nav = document.createElement("div");
        nav.className = "rail-nav";
        nav.innerHTML = `
          <button type="button" class="rail-btn" data-dir="-1" aria-label="Previous">&#8592;</button>
          <div class="rail-mid">
            <div class="rail-meta"><span class="rail-hint">Swipe for more</span><span class="rail-count">01 / ${pad(n)}</span></div>
            <div class="rail-bar"><i></i></div>
          </div>
          <button type="button" class="rail-btn" data-dir="1" aria-label="Next">&#8594;</button>`;
        rail.before(nav);
        const count = nav.querySelector<HTMLElement>(".rail-count")!;
        const bar = nav.querySelector<HTMLElement>(".rail-bar i")!;
        const [prev, next] = nav.querySelectorAll<HTMLButtonElement>(".rail-btn");
        bar.style.width = `${100 / n}%`;

        let current = 0;
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
            const atEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4;
            if (atEnd) best = n - 1;
            current = best;
            count.textContent = `${pad(best + 1)} / ${pad(n)}`;
            bar.style.width = `${((best + 1) / n) * 100}%`;
            prev.disabled = rail.scrollLeft <= 4;
            next.disabled = atEnd;
            if (rail.scrollLeft > 10) nav.classList.add("is-used");
          });
        };
        const go = (dir: number) => {
          const target = items[Math.max(0, Math.min(n - 1, current + dir))];
          rail.scrollTo({ left: target.offsetLeft - rail.offsetLeft - 16, behavior: "smooth" });
        };
        const onClick = (e: Event) => {
          const b = (e.target as HTMLElement).closest<HTMLButtonElement>(".rail-btn");
          if (b) go(Number(b.dataset.dir));
        };
        nav.addEventListener("click", onClick);
        rail.addEventListener("scroll", update, { passive: true });
        update();

        // One sideways nudge the first time the rail is properly in view.
        let nudge = 0;
        const io = new IntersectionObserver(
          ([e]) => {
            if (!e.isIntersecting || calmMotion()) return;
            io.disconnect();
            if (rail.scrollLeft > 4) return;
            rail.classList.add("is-nudging");
            nudge = window.setTimeout(() => rail.classList.remove("is-nudging"), 1300);
          },
          { threshold: 0.7 },
        );
        io.observe(rail);

        // Filtered rails (product finder) change their cards: rebuild.
        let rebuild = 0;
        const mo = new MutationObserver(() => {
          window.clearTimeout(rebuild);
          rebuild = window.setTimeout(setup, 60);
        });
        mo.observe(rail, { childList: true });

        cleanups.push(() => {
          mo.disconnect();
          window.clearTimeout(rebuild);
          io.disconnect();
          window.clearTimeout(nudge);
          rail.classList.remove("is-nudging");
          rail.removeEventListener("scroll", update);
          nav.removeEventListener("click", onClick);
          cancelAnimationFrame(raf);
          nav.remove();
        });
      });
    };

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
