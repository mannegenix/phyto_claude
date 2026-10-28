import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="wrap grid max-w-[60ch] gap-4">
        <span className="eyebrow">404</span>
        <h1 className="text-[clamp(2rem,4vw,3rem)]">We couldn&apos;t find that page</h1>
        <p className="muted">The page may have moved. Browse our extracts or contact the sales team.</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/products" className="btn">
            View products
          </Link>
          <Link href="/contact" className="btn btn-ghost">
            Contact us
          </Link>
        </div>
      </div>
    </section>
  );
}
