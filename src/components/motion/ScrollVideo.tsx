"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { drawPlaceholder } from "./scroll-video-placeholder";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export type ScrollStep = { title: string; body: string };

type Manifest = { frames: number; width: number; height: number; pattern: string };

/**
 * Sticky split-screen scroll: the media panel stays pinned while the step panels
 * scroll past, and the video frame is scrubbed by scroll position.
 *
 * Video source: an image sequence in /public/sequences/<name>/ produced by
 * `npm run frames -- <video.mp4> <name>` (see scripts/extract-frames.mjs).
 * Until that exists, a procedural placeholder animation is drawn instead.
 */
export function ScrollVideo({ steps, sequence = "process" }: { steps: ScrollStep[]; sequence?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const progressBars = useRef<HTMLElement[]>([]);
  const frames = useRef<(HTMLImageElement | undefined)[]>([]);
  const manifest = useRef<Manifest | null>(null);
  const progress = useRef(0);
  const [active, setActive] = useState(0);

  // Load the frame manifest + frames progressively (first frame first, the rest when idle).
  useEffect(() => {
    let cancelled = false;
    fetch(`/sequences/${sequence}/manifest.json`)
      .then((r) => (r.ok ? (r.json() as Promise<Manifest>) : null))
      .then((m) => {
        if (!m || !m.frames || cancelled) return;
        manifest.current = m;
        const load = (i: number) =>
          new Promise<void>((resolve) => {
            const img = new Image();
            img.decoding = "async";
            img.src = `/sequences/${sequence}/${m.pattern.replace("%04d", String(i + 1).padStart(4, "0"))}`;
            img.onload = () => {
              frames.current[i] = img;
              resolve();
            };
            img.onerror = () => resolve();
          });
        load(0).then(async () => {
          render();
          for (let i = 1; i < m.frames && !cancelled; i += 1) await load(i);
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sequence]);

  function render() {
    const c = canvas.current;
    if (!c) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const { width, height } = c.getBoundingClientRect();
    if (c.width !== Math.round(width * dpr)) {
      c.width = Math.round(width * dpr);
      c.height = Math.round(height * dpr);
    }
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const p = progress.current;
    const m = manifest.current;

    if (m && frames.current[0]) {
      // Nearest loaded frame at or before the target.
      let i = Math.min(m.frames - 1, Math.round(p * (m.frames - 1)));
      while (i > 0 && !frames.current[i]) i -= 1;
      const img = frames.current[i]!;
      const scale = Math.max(c.width / img.naturalWidth, c.height / img.naturalHeight); // cover
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      ctx.drawImage(img, (c.width - w) / 2, (c.height - h) / 2, w, h);
    } else {
      drawPlaceholder(ctx, c.width, c.height, p, steps.length);
    }
  }

  useGSAP(
    () => {
      const st = ScrollTrigger.create({
        trigger: root.current!.querySelector(".split-steps"),
        start: "top 60%",
        end: "bottom 60%",
        scrub: 0.4,
        onUpdate: (self) => {
          progress.current = self.progress;
          const idx = Math.min(steps.length - 1, Math.floor(self.progress * steps.length));
          setActive(idx);
          progressBars.current.forEach((bar, i) => {
            const local = gsap.utils.clamp(0, 1, self.progress * steps.length - i);
            bar.style.width = `${local * 100}%`;
          });
          render();
        },
      });
      const onResize = () => render();
      window.addEventListener("resize", onResize);
      render();
      return () => {
        window.removeEventListener("resize", onResize);
        st.kill();
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className="split">
      <div className="split-grid">
        <div className="split-steps order-2 min-[901px]:order-1">
          {steps.map((s, i) => (
            <article key={s.title} className="split-step" data-active={active === i}>
              <span className="num">
                {String(i + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
              </span>
              <h3>{s.title}</h3>
              <p className="lede">{s.body}</p>
            </article>
          ))}
        </div>
        <div className="split-media order-1 min-[901px]:order-2">
          <canvas ref={canvas} aria-label="Process animation from raw botanical to packed batch" role="img" />
          <div className="split-progress" aria-hidden="true">
            {steps.map((s, i) => (
              <i key={s.title}>
                <b
                  ref={(el) => {
                    if (el) progressBars.current[i] = el;
                  }}
                />
              </i>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
