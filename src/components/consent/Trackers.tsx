"use client";

import { useEffect } from "react";
import { siteConfig } from "@/config/site";
import { CONSENT_EVENT, readConsent, type Consent } from "@/lib/consent";

type Gtag = (...args: unknown[]) => void;
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
    _linkedin_partner_id?: string;
    _linkedin_data_partner_ids?: string[];
  }
}

function addScript(src: string) {
  if (document.querySelector(`script[src="${src}"]`)) return;
  const s = document.createElement("script");
  s.src = src;
  s.async = true;
  document.head.appendChild(s);
}

/** Google Analytics 4, set up with advertising features off and 13-month cookies. */
function startGA(id: string) {
  if (window.gtag) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // gtag.js reads the arguments object itself.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", id, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    cookie_expires: 60 * 60 * 24 * 395, // 13 months
  });
  addScript(`https://www.googletagmanager.com/gtag/js?id=${id}`);
}

/** LinkedIn Insight Tag. */
function startLinkedIn(id: string) {
  if (window._linkedin_partner_id) return;
  window._linkedin_partner_id = id;
  window._linkedin_data_partner_ids = [...(window._linkedin_data_partner_ids ?? []), id];
  addScript("https://snap.licdn.com/li.lms-analytics/insight.min.js");
}

/** Sends a GA4 event when analytics is running (never personal data). */
export function track(name: string, params: Record<string, string | number | boolean> = {}) {
  window.gtag?.("event", name, params);
}

/**
 * Loads trackers only after consent, and reports the site's own events:
 * enquiry_sent (from the form's `pe:enquiry-sent`), request_click, email_click.
 */
export function Trackers() {
  useEffect(() => {
    const { ga4, linkedin } = siteConfig.analytics;
    const apply = (c: Consent | null) => {
      if (c?.analytics && ga4) startGA(ga4);
      if (c?.marketing && linkedin) startLinkedIn(linkedin);
    };
    apply(readConsent());
    const onConsent = (e: Event) => apply((e as CustomEvent<Consent>).detail);

    const onEnquiry = (e: Event) => {
      const d = (e as CustomEvent<Record<string, string | boolean>>).detail ?? {};
      track("enquiry_sent", {
        request_type: String(d.type ?? ""),
        product: String(d.product ?? ""),
        sample_requested: Boolean(d.sample),
        has_attachment: Boolean(d.attachment),
        form_page: location.pathname,
      });
    };

    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest?.("a, button");
      if (!el) return;
      const href = el.getAttribute("href") ?? "";
      if (href.startsWith("mailto:")) return track("email_click", { page: location.pathname });
      const label = (el.textContent ?? "").trim();
      if (/^Request (a Sample|a Quote|Specifications|Sample)$/i.test(label))
        track("request_click", { label, page: location.pathname });
    };

    window.addEventListener(CONSENT_EVENT, onConsent);
    window.addEventListener("pe:enquiry-sent", onEnquiry);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener(CONSENT_EVENT, onConsent);
      window.removeEventListener("pe:enquiry-sent", onEnquiry);
      document.removeEventListener("click", onClick, true);
    };
  }, []);
  return null;
}
