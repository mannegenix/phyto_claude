"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

/** Value of the "Other" option: always listed, never filtered out. */
export const OTHER = "OTHER";

export type SearchOption = {
  value: string;
  /** Text in the list. */
  label: string;
  /** Short text in the closed field (defaults to label). */
  short?: string;
  /** Extra words that should match a search (codes, alternative names). */
  keywords?: string;
  /** Listed first among equally good matches (e.g. the United States for +1). */
  rank?: number;
  /** Draws a divider under this option (after the pinned ones). */
  divider?: boolean;
};

/**
 * A dropdown with a search box at the top (combobox + listbox pattern): type to filter,
 * ↑/↓ to move, Enter to pick, Esc to close. Used for country and phone code.
 */
export function SearchSelect({
  id,
  value,
  options,
  onChange,
  placeholder,
  searchPlaceholder = "Search…",
  invalid,
  className = "",
  describedBy,
}: {
  id: string;
  value: string;
  options: SearchOption[];
  onChange: (value: string) => void;
  placeholder: string;
  searchPlaceholder?: string;
  invalid?: boolean;
  className?: string;
  describedBy?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const listId = useId();
  const selected = options.find((o) => o.value === value);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^\+/, "");
    if (!q) return options;
    // Words that start with the search come first (so "+97" lists +971 before +297);
    // "Other" always stays at the end so anything missing can still be typed in.
    const starts: SearchOption[] = [];
    const contains: SearchOption[] = [];
    for (const o of options) {
      if (o.value === OTHER) continue;
      const text = `${o.label} ${o.keywords ?? ""}`.toLowerCase().replace(/\+/g, "");
      if (text.split(/[\s(),.-]+/).some((w) => w.startsWith(q)) || text.startsWith(q)) starts.push(o);
      else if (text.includes(q)) contains.push(o);
    }
    const byRank = (a: SearchOption, b: SearchOption) => (b.rank ?? 0) - (a.rank ?? 0);
    return [...starts.sort(byRank), ...contains, ...options.filter((o) => o.value === OTHER)];
  }, [options, query]);

  // Close when clicking or tabbing outside.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  // Open: clear the search, highlight the current choice, focus the search box.
  const show = () => {
    const i = Math.max(
      0,
      options.findIndex((o) => o.value === value),
    );
    setQuery("");
    setActive(i);
    setOpen(true);
    requestAnimationFrame(() => {
      search.current?.focus();
      list.current?.querySelector<HTMLElement>(`[data-i="${i}"]`)?.scrollIntoView({ block: "nearest" });
    });
  };

  const pick = (o: SearchOption) => {
    onChange(o.value);
    setOpen(false);
    requestAnimationFrame(() => root.current?.querySelector<HTMLButtonElement>("button")?.focus());
  };

  const move = (d: number) => {
    const n = Math.min(Math.max(active + d, 0), shown.length - 1);
    setActive(n);
    list.current?.querySelector<HTMLElement>(`[data-i="${n}"]`)?.scrollIntoView({ block: "nearest" });
  };

  return (
    <div ref={root} className={`ss ${className}`} data-open={open || undefined}>
      <button
        type="button"
        id={id}
        className="input ss-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        data-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            if (!open) show();
          }
        }}
      >
        <span className={selected ? "" : "ss-ph"}>{selected ? (selected.short ?? selected.label) : placeholder}</span>
        <svg aria-hidden="true" viewBox="0 0 12 8" width="12" height="8">
          <path d="M1 1.5 6 6.5l5-5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </button>
      {open && (
        <div className="ss-pop">
          <input
            ref={search}
            className="input ss-search"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={shown[active] ? `${listId}-${active}` : undefined}
            aria-label={searchPlaceholder}
            placeholder={searchPlaceholder}
            value={query}
            autoComplete="off"
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
              list.current?.scrollTo({ top: 0 });
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                move(1);
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                move(-1);
              } else if (e.key === "Enter") {
                e.preventDefault();
                if (shown[active]) pick(shown[active]);
              } else if (e.key === "Escape") {
                e.preventDefault();
                setOpen(false);
                root.current?.querySelector<HTMLButtonElement>("button")?.focus();
              } else if (e.key === "Tab") setOpen(false);
            }}
          />
          <ul ref={list} id={listId} role="listbox" className="ss-list" data-lenis-prevent>
            {shown.map((o, i) => (
              <li
                key={o.value}
                id={`${listId}-${i}`}
                data-i={i}
                role="option"
                aria-selected={o.value === value}
                className={["ss-opt", i === active && "is-active", o.divider && !query && "ss-div"]
                  .filter(Boolean)
                  .join(" ")}
                onPointerEnter={() => setActive(i)}
                onPointerDown={(e) => e.preventDefault()}
                onClick={() => pick(o)}
              >
                {o.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
