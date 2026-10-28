"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Product } from "@/content/types";
import { ProductOrb } from "@/components/product/ProductOrb";

type Item = Pick<
  Product,
  "slug" | "code" | "name" | "short" | "role" | "botanicalSource" | "plantPart" | "marker" | "applications" | "swatch" | "image" | "intro"
>;

/**
 * Products page showcase: one large, colour-washed slide per extract. Swipe or
 * trackpad-scroll on touch, arrows / thumbnails / keyboard on desktop. No autoplay.
 */
export function ProductCarousel({ items }: { items: Item[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const goTo = useCallback((i: number) => {
    const el = track.current;
    const slide = el?.children[i] as HTMLElement | undefined;
    if (!el || !slide) return;
    el.scrollTo({ left: slide.offsetLeft - el.offsetLeft - (el.clientWidth - slide.clientWidth) / 2, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const mid = el.scrollLeft + el.clientWidth / 2;
        let best = 0;
        let dist = Infinity;
        Array.from(el.children).forEach((c, i) => {
          const s = c as HTMLElement;
          const d = Math.abs(s.offsetLeft - el.offsetLeft + s.clientWidth / 2 - mid);
          if (d < dist) {
            dist = d;
            best = i;
          }
        });
        setActive(best);
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(Math.min(items.length - 1, active + 1));
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(Math.max(0, active - 1));
    }
  };

  return (
    <div className="pc" aria-roledescription="carousel" aria-label="Our six extracts">
      <div ref={track} className="pc-track" tabIndex={0} onKeyDown={onKey}>
        {items.map((p, i) => (
          <article
            key={p.slug}
            className={`p-slide ${i === active ? "is-active" : ""}`}
            style={{ ["--sw" as string]: p.swatch }}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${items.length}: ${p.name}`}
          >
            <div className="p-slide-visual">
              <span className="p-slide-num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <ProductOrb product={p} size="xl" uid={`slide-${i}`} />
              <span className="p-slide-tested">Every lot tested</span>
            </div>
            <div className="p-slide-body">
              <div className="flex flex-wrap items-center gap-2">
                <span className="chip">{p.code}</span>
                <span className={`chip ${p.role === "Flagship product" ? "chip-flag" : ""}`}>{p.role}</span>
              </div>
              <h2 className="p-slide-name">{p.name}</h2>
              <p className="p-slide-src">
                <i>{p.botanicalSource.split(" (")[0]}</i> · {p.plantPart}
              </p>
              <p className="p-slide-intro">{p.intro}</p>
              <dl className="p-slide-facts">
                <div>
                  <dt>Quality marker</dt>
                  <dd>{p.marker.split(",")[0]}</dd>
                </div>
                <div>
                  <dt>Used in</dt>
                  <dd>{p.applications.slice(0, 2).join(", ")}</dd>
                </div>
              </dl>
              <div className="mt-2 flex flex-wrap gap-3">
                <Link href={`/products/${p.slug}`} className="btn" tabIndex={i === active ? 0 : -1}>
                  View specimen sheet
                </Link>
                <Link href="/sample" className="btn btn-ghost" tabIndex={i === active ? 0 : -1}>
                  Request a sample
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="pc-controls">
        <button
          type="button"
          className="pc-arrow"
          onClick={() => goTo(Math.max(0, active - 1))}
          disabled={active === 0}
          aria-label="Previous extract"
        >
          ←
        </button>
        <div className="pc-thumbs" role="tablist" aria-label="Choose an extract">
          {items.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              role="tab"
              aria-selected={i === active}
              className="pc-thumb"
              onClick={() => goTo(i)}
              style={{ ["--sw" as string]: p.swatch }}
            >
              <ProductOrb product={p} size="sm" uid={`thumb-${i}`} />
              <span>{p.short}</span>
            </button>
          ))}
        </div>
        <span className="pc-count mono" aria-live="polite">
          {String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </span>
        <button
          type="button"
          className="pc-arrow"
          onClick={() => goTo(Math.min(items.length - 1, active + 1))}
          disabled={active === items.length - 1}
          aria-label="Next extract"
        >
          →
        </button>
      </div>
    </div>
  );
}
