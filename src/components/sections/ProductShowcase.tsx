"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import type { Product, TestPillar } from "@/content/types";
import { ProductOrb } from "@/components/product/ProductOrb";
import { LazyScene } from "@/components/three/LazyScene";
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

const FAMILY: Record<string, string> = {
  garcinia: "Hydroxycitric acid family",
  curcumin: "Curcuminoid family",
  ashwagandha: "Withanolide family",
  boswellia: "Boswellic acid family",
  bakuchiol: "Bakuchiol (meroterpene)",
  bacopa: "Bacoside family",
};

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Homepage "Six extracts, one standard" on the bright green scene.
 * Intro: the six product spheres circle above a lab flask and drop into it one by
 * one; the flask glows "tested" and gives way to six glass cards. A card opens a
 * glass lightbox that grows out of the card (across, then down) with the extract's
 * 3D model and details, and Previous / Next to move through all six.
 *
 * Scrolling is held while the intro plays (from the moment the screen has settled
 * until the cards are in), so nobody scrolls past the products mid-animation. Until
 * a visitor opens a card, the flagship card carries a pulsing "Click to explore" cue.
 */
export function ProductShowcase({ items, pillars }: { items: Item[]; pillars: TestPillar[] }) {
  const root = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"cards" | "armed" | "playing">("cards");
  // Has this visitor opened a card yet (this session)? Until then the cards invite a click.
  const [explored, setExplored] = useState(true);
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("pe-explored") === "1";
    } catch {}
    if (!seen) requestAnimationFrame(() => setExplored(false));
  }, []);

  // ── Intro: spheres into the flask, then the cards ─────────────────────────
  useEffect(() => {
    const el = root.current;
    if (!el || reduced() || document.documentElement.classList.contains("pe-embed")) return;
    const r = el.getBoundingClientRect();
    // Already on screen, or back from a product page (#products): just show the cards.
    if (r.top < window.innerHeight * 0.5 || location.hash === "#products") return;
    setPhase("armed");
    let tl: gsap.core.Timeline | null = null;
    let held = false;
    let holdRaf = 0;
    // Hold scrolling once the incoming glide has settled on this screen.
    const hold = () => {
      const lenis = getLenis();
      if (!lenis) return;
      if (lenis.isScrolling) {
        holdRaf = requestAnimationFrame(hold);
        return;
      }
      lenis.stop();
      held = true;
    };
    const release = () => {
      cancelAnimationFrame(holdRaf);
      if (held) getLenis()?.start();
      held = false;
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        setPhase("playing");
        hold();
        const q = gsap.utils.selector(el);
        const orbs = q(".sc-drop");
        const flask = q(".sc-flask")[0];
        const liquid = q(".sc-liquid")[0];
        const glow = q(".sc-flask-glow")[0];
        const stage = q(".sc-intro")[0] as HTMLElement;
        const w = stage.clientWidth;
        const h = stage.clientHeight;
        const cx = w / 2;
        const neckY = h * 0.42;
        const ringR = Math.min(w * 0.32, 260);
        const ringY = h * 0.2;
        tl = gsap.timeline({
          delay: 0.55,
          onComplete: () => {
            release();
            setPhase("cards");
            requestAnimationFrame(() => gsap.set(q(".sc-card"), { clearProps: "opacity,transform" }));
          },
        });
        orbs.forEach((o, i) => {
          const a = (i / orbs.length) * Math.PI * 2 - Math.PI / 2;
          gsap.set(o, { x: cx + Math.cos(a) * ringR, y: ringY + Math.sin(a) * ringR * 0.35, scale: 0.6, opacity: 0 });
        });
        tl.to(orbs, { opacity: 1, scale: 1, duration: 0.4, stagger: 0.06, ease: "back.out(1.6)" });
        // circle once above the flask
        const spin = { t: 0 };
        tl.to(
          spin,
          {
            t: 1,
            duration: 1.3,
            ease: "power1.inOut",
            onUpdate: () => {
              orbs.forEach((o, i) => {
                const a = (i / orbs.length + spin.t) * Math.PI * 2 - Math.PI / 2;
                gsap.set(o, { x: cx + Math.cos(a) * ringR, y: ringY + Math.sin(a) * ringR * 0.35 });
              });
            },
          },
          ">-0.1",
        );
        // drop in one by one
        orbs.forEach((o, i) => {
          const at = 1.55 + i * 0.26;
          tl!
            .to(o, { x: cx, y: neckY - 30, scale: 0.55, duration: 0.32, ease: "power2.in" }, at)
            .to(o, { y: h * 0.7, scale: 0.35, opacity: 0, duration: 0.3, ease: "power2.in" }, at + 0.3)
            .to(liquid, { attr: { y: 210 - (i + 1) * 9 }, duration: 0.3, ease: "power2.out" }, at + 0.5)
            .fromTo(
              q(".sc-splash")[0],
              { scale: 0.3, opacity: 1 },
              { scale: 1.6, opacity: 0, duration: 0.45, ease: "power2.out" },
              at + 0.5,
            );
        });
        tl.to(glow, { opacity: 1, duration: 0.35 }, ">-0.1")
          .to(q(".sc-flask-tag")[0], { opacity: 1, y: 0, duration: 0.3 }, "<")
          .to(flask, { scale: 0.7, opacity: 0, duration: 0.45, ease: "power2.in" }, "+=0.45")
          .set(stage, { display: "none" })
          .fromTo(
            q(".sc-card"),
            { opacity: 0, y: 34, scale: 0.92 },
            { opacity: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.08, ease: "power3.out" },
          );
        tl.timeScale(1.3);
      },
      { threshold: 0.55 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      tl?.kill();
      release();
    };
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
    if (location.pathname === "/") history.replaceState(history.state, "", "/#products");
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
      motion.current = gsap
        .timeline()
        .to(panel, { z: -160, rotationY: -10, scale: 0.92, duration: fast ? 0 : 0.32, ease: "power2.inOut" })
        .to(panel, {
          left: innerWidth / 2 - r.width / 2,
          top: innerHeight / 2 - r.height / 2,
          z: 0,
          rotationY: 0,
          scale: 1,
          duration: fast ? 0 : 0.55,
          ease: "power2.inOut",
        })
        // expand across, then down
        .to(panel, { left: (innerWidth - W) / 2, width: W, duration: fast ? 0 : 0.55, ease: "power3.inOut" })
        .to(panel, { top: (innerHeight - H) / 2, height: H, borderRadius: 26, duration: fast ? 0 : 0.55, ease: "power3.inOut" })
        .to(content, { autoAlpha: 1, duration: fast ? 0 : 0.45 }, "-=0.2")
        .to(chrome, { autoAlpha: 1, duration: fast ? 0 : 0.35 }, "<");
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
          <h2>Six extracts, one standard</h2>
          <p className="lede">
            Garcinia Cambogia leads; five more extracts are held to exactly the same test. Open any extract to see its
            source, quality marker and 3D model.
          </p>
        </div>

        <div className={`sc-stage is-${phase} ${explored ? "" : "is-invite"}`}>
          <div className="sc-intro" aria-hidden="true">
            {items.map((x, i) => (
              <div key={x.slug} className="sc-drop">
                <ProductOrb product={x} size="sm" uid={`drop-${i}`} />
              </div>
            ))}
            <div className="sc-flask">
              <svg viewBox="0 0 200 240">
                <defs>
                  <clipPath id="sc-flask-clip">
                    <path d="M82 20 H118 V86 L176 206 Q182 222 164 224 H36 Q18 222 24 206 L82 86 Z" />
                  </clipPath>
                  <linearGradient id="sc-liq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" style={{ stopColor: "var(--pop)" }} />
                    <stop offset="1" style={{ stopColor: "var(--accent-text)" }} />
                  </linearGradient>
                </defs>
                <ellipse className="sc-flask-glow" cx="100" cy="160" rx="96" ry="76" />
                <g clipPath="url(#sc-flask-clip)">
                  <rect x="0" y="0" width="200" height="240" fill="rgb(255 255 255 / 0.16)" />
                  <rect className="sc-liquid" x="0" y="210" width="200" height="60" fill="url(#sc-liq)" />
                  <ellipse className="sc-splash" cx="100" cy="186" rx="34" ry="7" fill="none" stroke="#fff" strokeWidth="2" />
                </g>
                <path
                  d="M82 20 H118 V86 L176 206 Q182 222 164 224 H36 Q18 222 24 206 L82 86 Z"
                  fill="none"
                  stroke="rgb(255 255 255 / 0.85)"
                  strokeWidth="2.4"
                  strokeLinejoin="round"
                />
                <path d="M76 20 H124" stroke="rgb(255 255 255 / 0.9)" strokeWidth="5" strokeLinecap="round" />
                <path d="M92 100 L46 196" stroke="rgb(255 255 255 / 0.45)" strokeWidth="4" strokeLinecap="round" />
                {[150, 170, 190].map((y) => (
                  <path key={y} d={`M${150 - (y - 150) * 0.1} ${y} H${162 - (y - 150) * 0.1}`} stroke="rgb(255 255 255 / 0.6)" strokeWidth="1.5" />
                ))}
              </svg>
              <span className="sc-flask-tag">Every lot tested</span>
            </div>
          </div>

          <ul className="sc-grid">
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
                    <span className="mono">{x.code}</span>
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
                <span className="lb-num">{p.code.slice(3)}</span>
                <div className="lb-model">
                  <LazyScene
                    variant={p.slug}
                    tint={p.swatch}
                    fallback={
                      <div className="grid size-full place-items-center">
                        <ProductOrb product={p} size="xl" uid="lb-fallback" />
                      </div>
                    }
                  />
                </div>
                <div className="lb-media-cap">
                  <span>3D · {FAMILY[p.slug] ?? p.marker} · illustrative</span>
                  <span>Drag to rotate</span>
                </div>
              </div>
              <div className="lb-copy">
                <div className="flex flex-wrap items-center gap-2">
                  <ProductOrb product={p} size="sm" uid="lb-orb" />
                  <span className="lb-eyebrow">
                    {p.flagship ? "Flagship" : p.role.replace(" product", "")} · {p.code}
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
                    Request a sample
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
