"use client";

import { calmMotion } from "@/lib/motion-pref";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import type { Product, TestPillar } from "@/content/types";
import { ProductOrb } from "@/components/product/ProductOrb";
import { getLenis } from "@/components/motion/SmoothScroll";

type Item = Pick<
  Product,
  | "slug"
  | "code"
  | "name"
  | "short"
  | "role"
  | "flagship"
  | "intro"
  | "botanicalSource"
  | "plantPart"
  | "marker"
  | "applications"
  | "swatch"
  | "image"
>;

const reduced = calmMotion;

/**
 * Homepage "Every extract, one standard": the product cards are shown straight away
 * (no intro animation, no scroll hold). A card opens a
 * glass lightbox that grows out of the card (across, then down) with the extract's
 * product photo and details, and Previous / Next to move through every product.
 *
 * Until a visitor opens a card, the flagship card carries a pulsing "Click to explore" cue.
 */
export function ProductShowcase({ items, pillars }: { items: Item[]; pillars: TestPillar[] }) {
  const root = useRef<HTMLDivElement>(null);
  // Has this visitor opened a card yet (this session)? Until then the cards invite a click.
  const [explored, setExplored] = useState(true);
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("pe-explored") === "1";
    } catch {}
    if (!seen) requestAnimationFrame(() => setExplored(false));
  }, []);

  // ── Lightbox ───────────────────────────────────────────────────────────────
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const motion = useRef<gsap.core.Timeline | null>(null);
  const origin = useRef<DOMRect | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);

  const openAt = (i: number, btn: HTMLButtonElement) => {
    if (!explored) {
      setExplored(true);
      try {
        sessionStorage.setItem("pe-explored", "1");
      } catch {}
    }
    opener.current = btn;
    origin.current = btn.getBoundingClientRect();
    setOpen(i);
  };

  const finishClose = useCallback(() => {
    motion.current = null;
    dialog.current?.close();
    setOpen(null);
    getLenis()?.start();
    document.documentElement.classList.remove("lb-open");
    opener.current?.focus({ preventScroll: true });
  }, []);

  /**
   * "View more": remember the products section as this history entry's URL (keeping
   * Next's own history state), so Back from the product page lands on the cards.
   */
  const viewMore = useCallback(() => {
    history.replaceState(history.state, "", `${location.pathname}#products`);
    finishClose();
  }, [finishClose]);

  const close = useCallback(() => {
    const tl = motion.current;
    if (tl && tl.duration() > 0) {
      tl.eventCallback("onReverseComplete", finishClose);
      tl.timeScale(2.2).reverse();
    } else finishClose();
  }, [finishClose]);

  // open animation (runs once per opening; switching products only swaps content)
  const isOpen = open !== null;
  useEffect(() => {
    if (!isOpen || !dialog.current) return;
    const modal = dialog.current;
    if (!modal.open) modal.showModal();
    getLenis()?.stop();
    document.documentElement.classList.add("lb-open");
    const panel = modal.querySelector<HTMLElement>(".lb-panel")!;
    const content = modal.querySelector<HTMLElement>(".lb-content")!;
    const chrome = modal.querySelectorAll<HTMLElement>(".lb-close, .lb-nav");
    const r = origin.current ?? new DOMRect(innerWidth / 2 - 150, innerHeight / 2 - 100, 300, 200);
    const W = Math.min(innerWidth * 0.92, 1240);
    const H = Math.min(innerHeight * 0.88, 820);
    const fast = reduced();
    const ctx = gsap.context(() => {
      gsap.set(panel, { left: r.left, top: r.top, width: r.width, height: r.height, borderRadius: 18 });
      gsap.set([content, ...chrome], { autoAlpha: 0 });
      // Grows straight out of the card in one quick move (about half a second).
      motion.current = gsap
        .timeline()
        .to(panel, {
          left: (innerWidth - W) / 2,
          top: (innerHeight - H) / 2,
          width: W,
          height: H,
          borderRadius: 26,
          duration: fast ? 0 : 0.42,
          ease: "power3.inOut",
        })
        .to(content, { autoAlpha: 1, duration: fast ? 0 : 0.22 }, "-=0.08")
        .to(chrome, { autoAlpha: 1, duration: fast ? 0 : 0.2 }, "<");
    }, modal);
    return () => ctx.revert();
  }, [isOpen]);

  // switch product inside the open lightbox
  const go = useCallback(
    (dir: 1 | -1) => {
      if (open === null) return;
      const next = (open + dir + items.length) % items.length;
      const content = dialog.current?.querySelector(".lb-content");
      if (!content || reduced()) {
        setOpen(next);
        return;
      }
      gsap.to(content, {
        autoAlpha: 0,
        x: -24 * dir,
        duration: 0.22,
        ease: "power1.in",
        onComplete: () => {
          setOpen(next);
          gsap.fromTo(content, { autoAlpha: 0, x: 24 * dir }, { autoAlpha: 1, x: 0, duration: 0.35, ease: "power2.out" });
        },
      });
    },
    [open, items.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go]);

  const p = open !== null ? items[open] : null;
  const prev = open !== null ? items[(open - 1 + items.length) % items.length] : null;
  const next = open !== null ? items[(open + 1) % items.length] : null;

  return (
    <section id="products" className="section band wave-top bgphoto bgphoto-leaf showcase">
      <div ref={root} className="wrap">
        <div className="sec-head">
          <span className="eyebrow">Portfolio</span>
          <h2>Every extract, one standard</h2>
          <p className="lede">
            Garcinia Cambogia leads, and every extract in our range is held to exactly the same test. Open any extract to see its
            source, quality marker and specification.
          </p>
        </div>

        <div className={`sc-stage is-cards ${explored ? "" : "is-invite"}`}>
          <ul className="sc-grid rail">
            {items.map((x, i) => (
              <li key={x.slug} className="sc-card" style={{ ["--sw" as string]: x.swatch, ["--k" as string]: i }}>
                {i === 0 && (
                  <span className="sc-tip" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="16" height="16">
                      <path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V10m0-1.5a1.5 1.5 0 0 1 3 0V11m0-1a1.5 1.5 0 0 1 3 0v4.5a6 6 0 0 1-6 6h-.6a6 6 0 0 1-4.9-2.6L4.6 14.4a1.5 1.5 0 0 1 2.4-1.8L9 15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="sc-hint-fine">Click to explore</span>
                    <span className="sc-hint-touch">Tap to explore</span>
                  </span>
                )}
                <button
                  type="button"
                  className="sc-card-btn"
                  onClick={(e) => openAt(i, e.currentTarget)}
                >
                  <span className="sc-card-top">
                    <span className={`sc-chip ${x.flagship ? "is-flag" : ""}`}>
                      {x.flagship ? "Flagship" : x.role.replace(" product", "")}
                    </span>
                  </span>
                  <span className="sc-card-main">
                    <ProductOrb product={x} size="md" uid={`sc-${i}`} />
                    <span className="grid gap-1 text-left">
                      <span className="sc-card-name">{x.name}</span>
                      <span className="sc-card-src">{x.botanicalSource.split(" (")[0]}</span>
                    </span>
                  </span>
                  <span className="sc-card-foot">
                    <span>{x.marker.split(",")[0]}</span>
                    <span className="sc-open">
                      Explore <span aria-hidden="true">+</span>
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <p className="sc-hint">
            <span className="sc-pulse" aria-hidden="true">
              <i />
            </span>
            <span className="sc-hint-fine">Click on a product to reveal</span>
            <span className="sc-hint-touch">Tap a product to reveal</span>
          </p>
        </div>
      </div>

      <dialog
        ref={dialog}
        className="lb"
        aria-labelledby="lb-title"
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
      >
        <button type="button" className="lb-dismiss" aria-label="Close extract preview" onClick={close} tabIndex={-1} />
        {p && prev && next && (
          <div className="lb-panel" style={{ ["--sw" as string]: p.swatch }}>
            <button type="button" className="lb-close" aria-label="Close extract preview" onClick={close}>
              ×
            </button>
            <div className="lb-content" data-lenis-prevent>
              <div className="lb-media">
                <div className="lb-model lb-photo">
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image.replace(".webp", "-wide.webp")} alt={`${p.short}: botanical and extract`} />
                  ) : (
                    <div className="grid size-full place-items-center">
                      <ProductOrb product={p} size="xl" uid="lb-fallback" />
                    </div>
                  )}
                </div>
                <div className="lb-media-cap">
                  <span>{p.marker}</span>
                  <span>Representative image</span>
                </div>
              </div>
              <div className="lb-copy">
                <div className="flex flex-wrap items-center gap-2">
                  <ProductOrb product={p} size="sm" uid="lb-orb" />
                  <span className="lb-eyebrow">
                    {p.flagship ? "Flagship" : p.role.replace(" product", "")}
                  </span>
                </div>
                <h2 id="lb-title">{p.name}</h2>
                <p className="lb-src">
                  <i>{p.botanicalSource.split(" (")[0]}</i> · {p.plantPart}
                </p>
                <p className="lb-intro">{p.intro}</p>
                <dl className="lb-facts">
                  <div>
                    <dt>Quality marker</dt>
                    <dd>{p.marker}</dd>
                  </div>
                  <div>
                    <dt>Used in</dt>
                    <dd>{p.applications.slice(0, 3).join(", ")}</dd>
                  </div>
                </dl>
                <div className="lb-checks" aria-label="Every lot is checked for">
                  {pillars.map((t) => (
                    <span key={t.code} title={t.title}>
                      <b>{t.code}</b> {t.title}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link href={`/products/${p.slug}`} className="btn" onClick={viewMore}>
                    View more <span aria-hidden="true">→</span>
                  </Link>
                  <Link href="/sample" className="btn btn-ghost" onClick={finishClose}>
                    Request a Sample
                  </Link>
                </div>
              </div>
            </div>
            <nav className="lb-nav" aria-label="Browse extracts">
              <button type="button" onClick={() => go(-1)}>
                <span aria-hidden="true">←</span>
                <span>
                  <small>Previous</small>
                  {prev.short}
                </span>
              </button>
              <button type="button" onClick={() => go(1)}>
                <span>
                  <small>Next</small>
                  {next.short}
                </span>
                <span aria-hidden="true">→</span>
              </button>
            </nav>
          </div>
        )}
      </dialog>
    </section>
  );
}
