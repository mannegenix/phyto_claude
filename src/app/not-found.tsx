import type { Metadata } from "next";
import Link from "next/link";
import { getProducts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/** 404: the address is wrong or old. Point people back to the range, the request and the team. */
export default async function NotFound() {
  const products = await getProducts();
  return (
    <section className="section sys-page">
      <span className="sys-code" aria-hidden="true">
        404
      </span>
      <div className="wrap sys-grid">
        <div className="sys-copy">
          <span className="eyebrow">Error 404 · Page not found</span>
          <h1>
            This page isn&apos;t in <span className="hl">our range</span>
          </h1>
          <p className="lede">
            The link may be old, or the page has moved. Every extract we offer is listed here, and our team is one
            email away.
          </p>
          <div className="sys-actions">
            <Link href="/products" className="btn">
              View all products
            </Link>
            <Link href="/sample" className="btn btn-ghost">
              Request a Sample
            </Link>
          </div>
          <nav className="sys-links" aria-label="Popular pages">
            <span>Popular pages</span>
            <Link href="/">Home</Link>
            <Link href="/manufacturing">Manufacturing &amp; Quality</Link>
            <Link href="/operations">How we work</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </div>
        <ul className="sys-products" aria-label="Our extracts">
          {products.map((p) => (
            <li key={p.slug}>
              <Link href={`/products/${p.slug}`}>
                {p.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image} alt="" width={96} height={96} loading="lazy" />
                )}
                <span>
                  <b>{p.name}</b>
                  <small>{p.marker.split(",")[0]}</small>
                </span>
                <i aria-hidden="true">→</i>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
