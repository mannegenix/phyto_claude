"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";

const MoleculeScene = dynamic(() => import("./MoleculeScene"), { ssr: false });

/**
 * Mounts the 3D scene only when it scrolls near the viewport, and only for
 * visitors without reduced-motion. Everyone else (and the first paint) sees `fallback`.
 * This keeps three.js out of the initial page load entirely.
 */
export function LazyScene({ fallback }: { fallback: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="absolute inset-0">
      {show ? <MoleculeScene /> : fallback}
    </div>
  );
}
