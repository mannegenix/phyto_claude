"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV } from "@/config/site";
import { Logo } from "./Logo";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Transparent at the top of the page; frosted once the page scrolls.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname === href);

  return (
    <header className={`hdr ${pathname === "/" ? "on-hero" : ""} ${scrolled ? "is-scrolled" : ""} ${open ? "is-open" : ""}`}>
      <div className="wrap relative flex min-h-[68px] items-center gap-5">
        <Link href="/" aria-label="Phyto Elements home" className="flex-none no-underline">
          <Logo />
        </Link>

        <button
          type="button"
          className="hdr-menu ml-auto inline-flex rounded-brand border px-3 py-2 text-sm font-semibold min-[1121px]:hidden"
          aria-expanded={open}
          aria-controls="primary-nav"
          onClick={() => setOpen((v) => !v)}
        >
          Menu
        </button>

        <nav
          id="primary-nav"
          aria-label="Primary"
          className={`${open ? "flex" : "hidden"} absolute inset-x-0 top-full flex-col gap-0.5 border-b border-line bg-surface px-4 pt-2 pb-4 min-[1121px]:static min-[1121px]:ml-auto min-[1121px]:flex min-[1121px]:flex-row min-[1121px]:items-center min-[1121px]:border-0 min-[1121px]:bg-transparent min-[1121px]:p-0`}
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${"flag" in item && item.flag ? "flag" : ""}`}
              aria-current={isActive(item.href) ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/sample"
            className="btn btn-sm mt-2 min-[1121px]:mt-0 min-[1121px]:ml-2"
            onClick={() => setOpen(false)}
          >
            Request a Sample
          </Link>
        </nav>
      </div>
    </header>
  );
}
