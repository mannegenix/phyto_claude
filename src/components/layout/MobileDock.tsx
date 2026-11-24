"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV } from "@/config/site";

type DockProduct = { slug: string; short: string; image?: string };

/**
 * Phones and tablets (below the desktop nav breakpoint): an app-style tab bar fixed at the
 * bottom of the screen, within thumb reach, and a "More" sheet that slides up with every
 * page, the extracts as photo tiles and the sample / email actions.
 */
const TABS = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/products", label: "Products", icon: "grid" },
  { href: "/manufacturing", label: "Quality", icon: "check" },
  { href: "/contact", label: "Contact", icon: "mail" },
] as const;

function Icon({ name }: { name: string }) {
  const p = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (name) {
    case "home":
      return (
        <svg {...p}>
          <path d="M3 11.5 12 4l9 7.5" />
          <path d="M5.5 10v9.5h13V10" />
          <path d="M10 19.5v-5h4v5" />
        </svg>
      );
    case "grid":
      return (
        <svg {...p}>
          <rect x="4" y="4" width="7" height="7" rx="2" />
          <rect x="13" y="4" width="7" height="7" rx="2" />
          <rect x="4" y="13" width="7" height="7" rx="2" />
          <rect x="13" y="13" width="7" height="7" rx="2" />
        </svg>
      );
    case "check":
      return (
        <svg {...p}>
          <path d="M12 3.5 19 6v5.5c0 4.2-3 7.6-7 9-4-1.4-7-4.8-7-9V6l7-2.5Z" />
          <path d="m8.8 12.2 2.3 2.3 4.2-4.6" />
        </svg>
      );
    case "mail":
      return (
        <svg {...p}>
          <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
          <path d="m4.5 7 7.5 6 7.5-6" />
        </svg>
      );
    case "close":
      return (
        <svg {...p}>
          <path d="m6.5 6.5 11 11M17.5 6.5l-11 11" />
        </svg>
      );
    default:
      return (
        <svg {...p}>
          <circle cx="6" cy="12" r="1.4" />
          <circle cx="12" cy="12" r="1.4" />
          <circle cx="18" cy="12" r="1.4" />
        </svg>
      );
  }
}

export function MobileDock({ products, email }: { products: DockProduct[]; email: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the sheet on navigation; lock the page behind it while it is open.
  useEffect(() => {
    requestAnimationFrame(() => setOpen(false));
  }, [pathname]);
  useEffect(() => {
    document.documentElement.classList.toggle("dock-sheet-open", open);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <nav className="dock" aria-label="Quick navigation">
        {TABS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="dock-tab"
            aria-current={isActive(t.href) && !open ? "page" : undefined}
          >
            <Icon name={t.icon} />
            <span>{t.label}</span>
          </Link>
        ))}
        <button
          type="button"
          className="dock-tab"
          aria-expanded={open}
          aria-controls="dock-sheet"
          aria-current={open ? "page" : undefined}
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? "close" : "more"} />
          <span>{open ? "Close" : "More"}</span>
        </button>
      </nav>

      <div className={`dock-scrim ${open ? "is-open" : ""}`} onClick={() => setOpen(false)} aria-hidden="true" />
      <div
        id="dock-sheet"
        className={`dock-sheet ${open ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!open}
      >
        <span className="dock-grab" aria-hidden="true" />
        <p className="dock-k">Pages</p>
        <ul className="dock-pages">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {item.label}
                <span aria-hidden="true">›</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="dock-k">Extracts</p>
        <ul className="dock-products">
          {products.map((p) => (
            <li key={p.slug}>
              <Link href={`/products/${p.slug}`} onClick={() => setOpen(false)}>
                {p.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image} alt="" width={56} height={56} loading="lazy" />
                )}
                <span>{p.short}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="dock-actions">
          <Link href="/sample" className="btn" onClick={() => setOpen(false)}>
            Request a Sample
          </Link>
          <a href={`mailto:${email}`} className="btn btn-ghost">
            {email}
          </a>
        </div>
      </div>
    </>
  );
}
