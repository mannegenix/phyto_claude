"use client";

import { useSyncExternalStore } from "react";
import { THEMES, type ThemeId } from "@/config/site";

const KEY = "pe-theme";

/** The <html data-theme> attribute is the source of truth; this subscribes to it. */
function subscribe(onChange: () => void) {
  const mo = new MutationObserver(onChange);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}

function applyTheme(id: ThemeId) {
  document.documentElement.dataset.theme = id;
  try {
    localStorage.setItem(KEY, id);
  } catch {}
}

/**
 * Colour-route switcher for client reviews. Rendered only when
 * NEXT_PUBLIC_SHOW_THEME_SWITCHER=true. The production site uses siteConfig.defaultTheme.
 */
export function ThemeSwitcher({ initial }: { initial: ThemeId }) {
  const theme = useSyncExternalStore(
    subscribe,
    () => (document.documentElement.dataset.theme as ThemeId) ?? initial,
    () => initial,
  );

  return (
    <div
      role="group"
      aria-label="Colour route"
      className="theme-switcher fixed bottom-4 left-4 z-40 flex items-center gap-1 rounded-full border border-line bg-surface p-1.5 text-[0.78rem] font-medium text-ink shadow-[0_10px_30px_-12px_rgba(0,0,0,.3)]"
    >
      <span className="hidden px-2 text-muted md:inline">Colour route</span>
      {THEMES.map((t) => (
        <button
          key={t.id}
          type="button"
          title={t.label}
          aria-pressed={theme === t.id}
          onClick={() => applyTheme(t.id)}
          className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 aria-pressed:bg-sunk aria-pressed:shadow-[inset_0_0_0_1px_var(--line)]"
        >
          <i
            className="block size-3 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,.12)]"
            style={{
              background: `linear-gradient(90deg, ${t.swatch
                .map((c, i, a) => `${c} ${(i / a.length) * 100}% ${((i + 1) / a.length) * 100}%`)
                .join(", ")})`,
            }}
          />
          <b className="hidden font-semibold md:inline">{t.label}</b>
        </button>
      ))}
    </div>
  );
}

/** Inline script that applies the saved review theme before first paint (avoids a flash). */
export const themeBootScript = `try{var d=document.documentElement,q=new URLSearchParams(location.search),t=q.get("theme")||localStorage.getItem("${KEY}");if(t)d.dataset.theme=t;if(q.get("embed")){d.classList.add("pe-embed","pe-seen")}}catch(e){}`;
