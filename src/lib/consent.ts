/**
 * Cookie consent (client, Nov 2026). The visitor's choice is kept in the first-party cookie
 * `pe-consent` for 12 months (listed in the Cookie Notice). Analytics (Google Analytics 4) and
 * marketing (LinkedIn Insight Tag) load only after the matching choice is "yes".
 */
export type Consent = { v: 1; analytics: boolean; marketing: boolean; at: string };

export const CONSENT_COOKIE = "pe-consent";
export const CONSENT_EVENT = "pe:consent"; // fired with the new Consent after any change
export const OPEN_SETTINGS_EVENT = "pe:open-cookie-settings";
const MAX_AGE = 60 * 60 * 24 * 365; // 12 months

export function readConsent(): Consent | null {
  if (typeof document === "undefined") return null;
  const raw = document.cookie.split("; ").find((c) => c.startsWith(`${CONSENT_COOKIE}=`));
  if (!raw) return null;
  try {
    const c = JSON.parse(decodeURIComponent(raw.slice(CONSENT_COOKIE.length + 1))) as Consent;
    return c && c.v === 1 ? c : null;
  } catch {
    return null;
  }
}

/** Saves a choice. If something already running was switched off, its cookies are cleared and the page reloads. */
export function saveConsent(analytics: boolean, marketing: boolean) {
  const before = readConsent();
  const c: Consent = { v: 1, analytics, marketing, at: new Date().toISOString() };
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(c))}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax${secure}`;
  const withdrawn = (before?.analytics && !analytics) || (before?.marketing && !marketing);
  if (withdrawn) {
    clearTrackingCookies(!analytics, !marketing);
    location.reload();
    return;
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: c }));
}

function clearTrackingCookies(analytics: boolean, marketing: boolean) {
  const names = document.cookie.split("; ").map((c) => c.split("=")[0]);
  const host = location.hostname.replace(/^www\./, "");
  for (const n of names) {
    const hit =
      (analytics && /^_ga/.test(n)) || (marketing && /^(li_|_li|lms_|AnalyticsSyncHistory|UserMatchHistory)/i.test(n));
    if (!hit) continue;
    for (const d of ["", `; Domain=${host}`, `; Domain=.${host}`]) document.cookie = `${n}=; Max-Age=0; Path=/${d}`;
  }
}

export const openCookieSettings = () => window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT));
