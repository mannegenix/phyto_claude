"use client";

import { useEffect, useRef, useState } from "react";

type Option = { id: string; label: string };
type Page = { path: string; label: string };

const FRAME = { desktop: 1440, mobile: 390 } as const;
type Mode = keyof typeof FRAME;

function Pane({
  src,
  mode,
  onFrame,
}: {
  src: string;
  mode: Mode;
  onFrame: (el: HTMLIFrameElement | null) => void;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const frameW = FRAME[mode];
  const scale = size.w ? Math.min(1, size.w / frameW) : 1;
  return (
    <div ref={box} className="compare-pane">
      {size.w > 0 && (
        <iframe
          ref={onFrame}
          src={src}
          title="Preview"
          style={{
            width: frameW,
            height: size.h / scale,
            transform: `scale(${scale})`,
            left: mode === "mobile" ? Math.max(0, (size.w - frameW * scale) / 2) : 0,
          }}
        />
      )}
    </div>
  );
}

/** Two iframes of the same page in different colour routes, scroll-synced. */
export function ComparePanes({
  themes,
  pages,
  left: initialLeft,
  right: initialRight,
}: {
  themes: Option[];
  pages: Page[];
  left: string;
  right: string;
}) {
  const [left, setLeft] = useState(initialLeft);
  const [right, setRight] = useState(initialRight);
  const [path, setPath] = useState("/");
  const [mode, setMode] = useState<Mode>("desktop");
  const [sync, setSync] = useState(true);
  const [leftFrame, setLeftFrame] = useState<HTMLIFrameElement | null>(null);
  const [rightFrame, setRightFrame] = useState<HTMLIFrameElement | null>(null);
  const syncRef = useRef(sync);

  useEffect(() => {
    syncRef.current = sync;
  }, [sync]);

  // Scroll sync: whichever pane scrolls drives the other, by scroll proportion.
  useEffect(() => {
    let lock = -1;
    const cleanups: (() => void)[] = [];
    const pair = [leftFrame, rightFrame] as const;
    const attach = (i: 0 | 1) => {
      const f = pair[i];
      if (!f) return;
      const bind = () => {
        const w = f.contentWindow;
        if (!w) return;
        const onScroll = () => {
          if (!syncRef.current) return;
          if (lock !== -1 && lock !== i) return;
          lock = i;
          const other = pair[i === 0 ? 1 : 0]?.contentWindow;
          if (other) {
            const max = w.document.documentElement.scrollHeight - w.innerHeight;
            const omax = other.document.documentElement.scrollHeight - other.innerHeight;
            other.scrollTo(0, max > 0 ? (w.scrollY / max) * omax : 0);
          }
          requestAnimationFrame(() => requestAnimationFrame(() => (lock = -1)));
        };
        w.addEventListener("scroll", onScroll, { passive: true });
        cleanups.push(() => w.removeEventListener("scroll", onScroll));
      };
      f.addEventListener("load", bind);
      cleanups.push(() => f.removeEventListener("load", bind));
      if (f.contentDocument?.readyState === "complete") bind();
    };
    attach(0);
    attach(1);
    return () => cleanups.forEach((c) => c());
  }, [leftFrame, rightFrame]);

  const src = (theme: string) => `${path}${path.includes("?") ? "&" : "?"}theme=${theme}&embed=1`;
  const picker = (value: string, set: (v: string) => void, label: string) => (
    <label className="compare-field">
      <span>{label}</span>
      <select value={value} onChange={(e) => set(e.target.value)}>
        {themes.map((t) => (
          <option key={t.id} value={t.id}>
            {t.label}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <div className="compare">
      <div className="compare-bar">
        <b className="compare-title">Compare routes</b>
        {picker(left, setLeft, "Left")}
        <button
          type="button"
          className="compare-btn"
          onClick={() => {
            setLeft(right);
            setRight(left);
          }}
          title="Swap sides"
        >
          ⇄
        </button>
        {picker(right, setRight, "Right")}
        <label className="compare-field">
          <span>Page</span>
          <select value={path} onChange={(e) => setPath(e.target.value)}>
            {pages.map((p) => (
              <option key={p.path} value={p.path}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <div className="compare-seg" role="group" aria-label="Device">
          {(["desktop", "mobile"] as const).map((m) => (
            <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)}>
              {m === "desktop" ? "Desktop" : "Mobile"}
            </button>
          ))}
        </div>
        <label className="compare-check">
          <input type="checkbox" checked={sync} onChange={(e) => setSync(e.target.checked)} /> Sync scroll
        </label>
      </div>
      <div className="compare-grid">
        <Pane key={`l-${left}-${path}-${mode}`} src={src(left)} mode={mode} onFrame={setLeftFrame} />
        <Pane key={`r-${right}-${path}-${mode}`} src={src(right)} mode={mode} onFrame={setRightFrame} />
      </div>
    </div>
  );
}
