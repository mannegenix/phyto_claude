"use client";

import { useEffect, useRef } from "react";

type TurnstileApi = {
  render: (el: HTMLElement, opts: { sitekey: string; action?: string }) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
let loading: Promise<void> | null = null;

/** Loads Cloudflare's script once per page session (explicit mode: it never scans the page itself). */
function loadTurnstile(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (!loading) {
    loading = new Promise<void>((resolve, reject) => {
      const s = document.createElement("script");
      s.src = SRC;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => {
        loading = null; // allow a retry on the next mount
        reject(new Error("Turnstile failed to load"));
      };
      document.head.appendChild(s);
    });
  }
  return loading;
}

/**
 * Cloudflare Turnstile spam check, rendered explicitly every time the form mounts, so it shows
 * on client-side navigation as well as on a full page load. It puts the hidden
 * `cf-turnstile-response` field inside the form. `resetSignal` changes after every submission
 * attempt: a token is single-use, so the widget fetches a fresh one for the next try.
 */
export function Turnstile({ siteKey, resetSignal }: { siteKey: string; resetSignal?: unknown }) {
  const box = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadTurnstile()
      .then(() => {
        if (cancelled || !box.current || !window.turnstile || widget.current) return;
        widget.current = window.turnstile.render(box.current, { sitekey: siteKey, action: "enquiry" });
      })
      .catch((err) => console.error(err));
    return () => {
      cancelled = true;
      if (widget.current && window.turnstile) window.turnstile.remove(widget.current);
      widget.current = null;
    };
  }, [siteKey]);

  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (widget.current && window.turnstile) window.turnstile.reset(widget.current);
  }, [resetSignal]);

  return <div ref={box} className="cf-turnstile fld-full" />;
}
