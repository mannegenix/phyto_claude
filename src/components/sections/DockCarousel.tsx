"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { DockStage } from "@/content/types";
import { useDragScroll } from "@/lib/useDragScroll";

/**
 * "From sourcing to your dock" (from the client's earlier site, dev1): an editorial photo
 * carousel, one stage per slide — white text panel overlapping a large photo — with named
 * stage tabs, a status label and arrows. Drag, swipe, tabs or arrows to move.
 */
export function DockCarousel({
  head,
  stages,
}: {
  head: { eyebrow: string; title: string; titleEm: string; intro: string };
  stages: DockStage[];
}) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const goTo = useCallback((i: number) => {
    const el = track.current;
    const slide = el?.children[i] as HTMLElement | undefined;
    if (!el || !slide) return;
    el.scrollTo({ left: slide.offsetLeft - el.offsetLeft - parseFloat(getComputedStyle(el).paddingLeft), behavior: "smooth" });
  }, []);

  const settle = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const pad = parseFloat(getComputedStyle(el).paddingLeft);
    let best = 0;
    let dist = Infinity;
    [...el.children].forEach((c, i) => {
      const d = Math.abs((c as HTMLElement).offsetLeft - el.offsetLeft - pad - el.scrollLeft);
      if (d < dist) {
        dist = d;
        best = i;
      }
    });
    goTo(best);
  }, [goTo]);
  useDragScroll(track, settle);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const pad = parseFloat(getComputedStyle(el).paddingLeft);
        let best = 0;
        let dist = Infinity;
        [...el.children].forEach((c, i) => {
          const d = Math.abs((c as HTMLElement).offsetLeft - el.offsetLeft - pad - el.scrollLeft);
          if (d < dist) {
            dist = d;
            best = i;
          }
        });
        if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 4) best = el.children.length - 1;
        setActive(best);
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="section dock-sec">
      <div className="wrap dock-head">
        <div>
          <span className="eyebrow">{head.eyebrow}</span>
          <h2>
            {head.title}
            <br />
            <em>{head.titleEm}</em>
          </h2>
        </div>
        <p>{head.intro}</p>
      </div>
      <div className="dock-carousel" role="region" aria-roledescription="carousel" aria-label={head.eyebrow}>
        <div ref={track} className="dock-track" tabIndex={0}>
          {stages.map((s, i) => (
            <article
              key={s.label}
              className={`dock-slide ${i === active ? "is-active" : ""}`}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${stages.length}: ${s.title}`}
            >
              <div className="dock-image">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.image} alt={s.alt} width={1536} height={1024} loading="lazy" draggable={false} />
              </div>
              <div className="dock-panel">
                <span className="eyebrow">{s.eyebrow}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                {s.detail && <p className="dock-detail">{s.detail}</p>}
                <Link href={s.cta.href} className="btn" tabIndex={i === active ? 0 : -1}>
                  {s.cta.label} <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
        <div className="wrap dock-controls">
          <div className="dock-tabs" aria-label="Stages">
            {stages.map((s, i) => (
              <button
                key={s.label}
                type="button"
                aria-current={i === active ? "true" : undefined}
                aria-label={`Show ${s.title}`}
                onClick={() => goTo(i)}
              >
                <span>{s.label}</span>
                <i />
              </button>
            ))}
          </div>
          <p className="dock-status" aria-live="polite">
            {String(active + 1).padStart(2, "0")} / {String(stages.length).padStart(2, "0")} · {stages[active].label}
          </p>
          <div className="dock-arrows">
            <button type="button" aria-label="Previous stage" disabled={active === 0} onClick={() => goTo(active - 1)}>
              ←
            </button>
            <button
              type="button"
              aria-label="Next stage"
              disabled={active === stages.length - 1}
              onClick={() => goTo(active + 1)}
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
