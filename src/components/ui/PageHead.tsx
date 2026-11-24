import Link from "next/link";
import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";

/** Page titles end on a word marked in the logo's sun yellow (see .page-head .hl). */
function withHighlight(title: ReactNode) {
  if (typeof title !== "string") return title;
  const i = title.lastIndexOf(" ");
  if (i < 0) return <span className="hl">{title}</span>;
  return (
    <>
      {title.slice(0, i + 1)}
      <span className="hl">{title.slice(i + 1)}</span>
    </>
  );
}

export function PageHead({
  title,
  lede,
  crumbs = [],
  children,
}: {
  title: ReactNode;
  lede?: ReactNode;
  crumbs?: { href?: string; label: string }[];
  children?: ReactNode;
}) {
  // Breadcrumb structured data, from the same crumbs the visitor sees.
  const trail = [{ label: "Home", href: "/" }, ...crumbs];
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: `${siteConfig.url}${c.href === "/" ? "" : c.href}` } : {}),
    })),
  };
  return (
    <div className="page-head">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <div className="wrap">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          {crumbs.map((c) => (
            <span key={c.label} className="flex gap-2">
              <span aria-hidden="true">/</span>
              {c.href ? <Link href={c.href}>{c.label}</Link> : <span>{c.label}</span>}
            </span>
          ))}
        </nav>
        <h1>{withHighlight(title)}</h1>
        {lede && <p className="lede">{lede}</p>}
        {children}
      </div>
    </div>
  );
}
