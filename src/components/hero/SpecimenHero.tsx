"use client";

import { useEffect, useRef, useState } from "react";
import { botanicalPaths } from "@/components/botanicals/shapes";
import { BotanicalArt } from "@/components/botanicals/BotanicalArt";

export type SpecimenItem = {
  slug: string;
  code: string;
  name: string;
  marker: string;
  plantPart: string;
  swatch: string;
};

/** Particles per cycle; about a third pass the gate and form the botanical. Illustrative only. */
const COUNT = 2400;
const PASS_SHARE = 0.4;
const SHAPE_SAMPLE = 320;

/**
 * Cycle timing (seconds). "staged" (a route sets `--specimen-mode: staged`, e.g. AltHome)
 * is slower and reads as three clear steps: the lots wait on the left (Lots in), cross the
 * gate where each passing lot flashes the test colour (Test), then form the botanical
 * (Passed). The step labels light up in turn.
 */
type Timing = {
  cycle: number;
  start: number;
  spread: number;
  toGate: number;
  toShape: number;
  dissolveAt: number;
  testAt: number;
  passedAt: number;
  flash: number;
  size: number;
  /** Lots drawn this cycle (≤ COUNT) and the share that pass. */
  count: number;
  passShare: number;
  /** Draw lots as round dots (finer than squares). */
  round: boolean;
};
const NORMAL: Timing = {
  cycle: 8.6,
  start: 0.4,
  spread: 2.4,
  toGate: 0.9,
  toShape: 1.5,
  dissolveAt: 7.4,
  testAt: 1.3,
  passedAt: 3.6,
  flash: 0,
  size: 1,
  count: COUNT,
  passShare: PASS_SHARE,
  round: false,
};
const STAGED: Timing = {
  cycle: 13.4,
  start: 2,
  spread: 1.8,
  toGate: 1.5,
  toShape: 2.3,
  dissolveAt: 12,
  testAt: 2.8,
  passedAt: 7.2,
  flash: 0.55,
  size: 1.25,
  count: 1150,
  passShare: 0.52,
  round: true,
};
type Stage = "lots" | "test" | "passed";

type Colors = {
  pass: string;
  raw: string;
  reject: string;
  line: string;
  test: string;
  glow: boolean;
  outline: string;
  staged: boolean;
};

const easeIn = (t: number) => t * t * t;
const easeOut = (t: number) => 1 - (1 - t) ** 3;
const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);

/** Samples points on the botanical line drawing, normalised to 0..1. */
function sampleShape(slug: string, count: number): Float32Array {
  const c = document.createElement("canvas");
  c.width = SHAPE_SAMPLE;
  c.height = SHAPE_SAMPLE;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  const out = new Float32Array(count * 2);
  if (!ctx) return out;
  ctx.scale(SHAPE_SAMPLE / 200, SHAPE_SAMPLE / 200);
  ctx.lineWidth = 1.6;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = "#000";
  for (const d of botanicalPaths(slug)) ctx.stroke(new Path2D(d));
  const data = ctx.getImageData(0, 0, SHAPE_SAMPLE, SHAPE_SAMPLE).data;
  const hits: number[] = [];
  for (let i = 3; i < data.length; i += 4) if (data[i] > 90) hits.push((i - 3) / 4);
  for (let k = 0; k < count; k += 1) {
    const idx = hits.length ? hits[Math.floor(Math.random() * hits.length)] : 0;
    out[k * 2] = ((idx % SHAPE_SAMPLE) + Math.random()) / SHAPE_SAMPLE;
    out[k * 2 + 1] = (Math.floor(idx / SHAPE_SAMPLE) + Math.random()) / SHAPE_SAMPLE;
  }
  return out;
}

function readColors(): Colors {
  const cs = getComputedStyle(document.documentElement);
  const v = (name: string, fallback: string) => cs.getPropertyValue(name).trim() || fallback;
  return {
    pass: v("--specimen-pass", v("--accent", "#2b8530")),
    raw: v("--specimen-raw", v("--muted", "#777")),
    reject: v("--specimen-reject", v("--muted", "#888")),
    line: v("--specimen-line", v("--label", "#2b8530")),
    test: v("--specimen-test", v("--specimen-pass", v("--accent", "#2b8530"))),
    glow: v("--specimen-glow", "0") === "1",
    outline: v("--specimen-outline", ""),
    staged: v("--specimen-mode", "") === "staged",
  };
}

/**
 * Homepage hero visual: "The Living Specimen".
 * Mixed raw lots drift in on the left, cross a test gate, and only the lots that
 * pass travel on to form the botanical. Rejected lots fall away. The products
 * take turns. Pauses off screen; shows a still drawing for reduced motion or no JS.
 */
export function SpecimenHero({ items }: { items: SpecimenItem[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [index, setIndex] = useState(0);
  const [passed, setPassed] = useState(false);
  const [stage, setStage] = useState<Stage>("lots");
  const [live, setLive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !wrap || !ctx || items.length === 0) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let colors = readColors();
    let T: Timing = colors.staged ? STAGED : NORMAL;
    let W = 0;
    let H = 0;
    let dpr = 1;

    // Per-particle state, re-rolled every cycle.
    const homeX = new Float32Array(COUNT);
    const homeY = new Float32Array(COUNT);
    const delay = new Float32Array(COUNT);
    const seed = new Float32Array(COUNT);
    const target = new Int32Array(COUNT); // -1 = rejected, otherwise index into shape points
    let shape: Float32Array = new Float32Array(0);
    let product = 0;
    let swatch = items[0].swatch;

    const roll = (p: number) => {
      product = p;
      swatch = items[p].swatch;
      const n = T.count;
      const passCount = Math.round(n * T.passShare);
      shape = sampleShape(items[p].slug, passCount);
      let assigned = 0;
      for (let i = 0; i < n; i += 1) {
        homeX[i] = Math.random();
        homeY[i] = Math.random();
        delay[i] = Math.random() * T.spread;
        seed[i] = Math.random() * 1000;
        const remaining = n - i;
        const pass = Math.random() < (passCount - assigned) / remaining;
        target[i] = pass ? assigned++ : -1;
      }
    };

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      W = r.width;
      H = r.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
    };

    const draw = (tau: number, time: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      const gateX = W * 0.4;
      const gateTop = H * 0.12;
      const gateBottom = H * 0.88;
      const size = Math.min(W * 0.56, H * 0.84);
      const sx = W * 0.71 - size / 2;
      const sy = H * 0.5 - size / 2;
      const fadeIn = clamp01(tau / 0.6);
      const dissolve = clamp01((tau - T.dissolveAt) / (T.cycle - T.dissolveAt));
      const testing = tau > T.testAt && tau < T.passedAt;

      // Test gate: a dashed rule with a scanning highlight (brighter while lots are tested).
      ctx.globalAlpha = colors.staged ? (testing ? 0.95 : 0.5) : 0.45;
      ctx.strokeStyle = colors.test;
      ctx.lineWidth = colors.staged ? (testing ? 2.2 : 1.4) : 1;
      ctx.setLineDash([3, 5]);
      ctx.beginPath();
      ctx.moveTo(gateX, gateTop);
      ctx.lineTo(gateX, gateBottom);
      ctx.stroke();
      ctx.setLineDash([]);
      const scanY = gateTop + (Math.sin(time * 1.4) * 0.5 + 0.5) * (gateBottom - gateTop - 70);
      const grad = ctx.createLinearGradient(0, scanY, 0, scanY + 70);
      grad.addColorStop(0, "transparent");
      grad.addColorStop(0.5, colors.test);
      grad.addColorStop(1, "transparent");
      ctx.globalAlpha = 0.9;
      ctx.strokeStyle = grad;
      ctx.lineWidth = colors.staged ? 4 : 2;
      ctx.beginPath();
      ctx.moveTo(gateX, scanY);
      ctx.lineTo(gateX, scanY + 70);
      ctx.stroke();

      for (let i = 0; i < T.count; i += 1) {
        const hx = W * (0.03 + homeX[i] * 0.31) + Math.sin(time * 0.7 + seed[i]) * 4;
        const hy = H * (0.14 + homeY[i] * 0.72) + Math.cos(time * 0.6 + seed[i]) * 4;
        const gy = gateTop + (0.06 + homeY[i] * 0.88) * (gateBottom - gateTop);
        const u = reduce ? 99 : tau - T.start - delay[i];
        let x = hx;
        let y = hy;
        let a = (colors.staged ? 0.95 : 0.7) * fadeIn;
        let color = i % 3 === 0 ? colors.raw : swatch;
        let r = 1.7 * T.size;

        if (u >= 0 && u < T.toGate) {
          const p = easeIn(u / T.toGate);
          x = hx + (gateX - hx) * p;
          y = hy + (gy - hy) * p;
          a = colors.staged ? 0.95 : 0.7 + 0.25 * p;
        } else if (u >= T.toGate) {
          const t = target[i];
          if (t >= 0) {
            const e = easeOut(clamp01((u - T.toGate) / T.toShape));
            const tx = sx + shape[t * 2] * size + Math.sin(time * 1.3 + seed[i]) * 0.7;
            const ty = sy + shape[t * 2 + 1] * size + Math.cos(time * 1.1 + seed[i]) * 0.7;
            x = gateX + (tx - gateX) * e;
            y = gy + (ty - gy) * e;
            // Staged: a lot that passes the gate flashes the test colour first.
            color = T.flash && u - T.toGate < T.flash ? colors.test : colors.pass;
            r = 1.9 * T.size;
            a = 0.95 * (1 - dissolve);
            if (dissolve > 0) {
              x += (x - (sx + size / 2)) * dissolve * 0.35;
              y += (y - (sy + size / 2)) * dissolve * 0.35;
            }
          } else {
            const dt = u - T.toGate;
            x = gateX - dt * (14 + (seed[i] % 18));
            y = gy + 150 * dt * dt;
            color = colors.reject;
            a = 0.6 * (1 - clamp01(dt / 1.1));
          }
        }
        if (a <= 0.01) continue;
        if (T.round) {
          // Staged (over a photo): a fine round dot with a thin dark rim; passed lots glow.
          if (color === colors.pass) {
            ctx.globalAlpha = a * 0.22;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, r * 2.6, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          if (colors.outline) {
            ctx.globalAlpha = a * 0.5;
            ctx.lineWidth = 0.8;
            ctx.strokeStyle = colors.outline;
            ctx.stroke();
          }
          ctx.globalAlpha = a;
          ctx.fillStyle = color;
          ctx.fill();
          continue;
        }
        if (colors.glow && color === colors.pass) {
          // Lab green: a soft halo under each passed particle, added light rather than paint.
          ctx.globalCompositeOperation = "lighter";
          ctx.globalAlpha = a * 0.12;
          ctx.fillStyle = color;
          ctx.fillRect(x - r * 2.5, y - r * 2.5, r * 5, r * 5);
          ctx.globalCompositeOperation = "source-over";
        }
        ctx.globalAlpha = a;
        ctx.fillStyle = color;
        ctx.fillRect(x - r / 2, y - r / 2, r, r);
      }
      ctx.globalAlpha = 1;
    };

    resize();
    roll(0);
    colors = readColors();

    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) draw(T.cycle - 1.4, 0);
    });
    ro.observe(wrap);

    const mo = new MutationObserver(() => {
      colors = readColors();
      T = colors.staged ? STAGED : NORMAL;
      if (reduce) draw(T.cycle - 1.4, 0);
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    let raf = 0;
    let visible = true;
    let last = performance.now();
    let clock = 0;
    let cycle = 0;
    let wasPassed = false;
    let wasStage: Stage = "lots";

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      clock += dt;
      const nextCycle = Math.floor(clock / T.cycle);
      if (nextCycle !== cycle) {
        cycle = nextCycle;
        const p = (product + 1) % items.length;
        roll(p);
        setIndex(p);
      }
      const tau = clock - cycle * T.cycle;
      const isPassed = tau > T.passedAt && tau < T.dissolveAt;
      if (isPassed !== wasPassed) {
        wasPassed = isPassed;
        setPassed(isPassed);
      }
      const st: Stage = tau >= T.passedAt ? "passed" : tau >= T.testAt ? "test" : "lots";
      if (st !== wasStage) {
        wasStage = st;
        setStage(st);
      }
      draw(tau, clock);
      raf = visible && !document.hidden ? requestAnimationFrame(frame) : 0;
    };

    const start = () => {
      if (raf || reduce) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    io.observe(wrap);
    const onVisibility = () => {
      if (!document.hidden) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    requestAnimationFrame(() => setLive(true));
    if (reduce) {
      requestAnimationFrame(() => {
        setPassed(true);
        setStage("passed");
      });
      draw(T.cycle - 1.4, 0);
    } else {
      start();
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [items]);

  const item = items[index] ?? items[0];

  return (
    <div className="specimen" aria-hidden="true">
      <div ref={wrapRef} className="specimen-stage" data-stage={stage}>
        {!live && <BotanicalArt slug={items[0]?.slug ?? "garcinia"} className="specimen-still" />}
        <canvas ref={canvasRef} className="specimen-canvas" />
        <span className={`specimen-label is-lots ${stage === "lots" ? "is-on" : ""}`} style={{ left: "3%" }}>
          01 · Lots in
        </span>
        <span
          className={`specimen-label is-test ${stage === "test" ? "is-on" : ""}`}
          style={{ left: "40%", transform: "translateX(-50%)" }}
        >
          02 · Test
        </span>
        <span
          className={`specimen-label is-pass ${stage === "passed" ? "is-on" : ""}`}
          style={{ left: "71%", transform: "translateX(-50%)" }}
        >
          03 · Passed
        </span>
      </div>
      {item && (
        <div className="specimen-card" key={item.slug}>
          <span className="specimen-name">{item.name}</span>
          <span className="specimen-meta">
            {item.plantPart} · {item.marker.split(",")[0]}
          </span>
          <span className={`specimen-status ${passed ? "is-passed" : ""}`}>
            {passed ? "Meets specification · labelled" : "Testing against specification…"}
          </span>
        </div>
      )}
    </div>
  );
}
