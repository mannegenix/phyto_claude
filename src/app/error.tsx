"use client";

import Link from "next/link";
import { useEffect } from "react";

/** 500: something failed while showing a page. Offer a retry, the homepage and the inbox. */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="section sys-page">
      <span className="sys-code" aria-hidden="true">
        500
      </span>
      <div className="wrap sys-grid is-single">
        <div className="sys-copy">
          <span className="eyebrow">Error 500 · Something went wrong</span>
          <h1>
            This page didn&apos;t <span className="hl">load</span>
          </h1>
          <p className="lede">
            Something went wrong on our side. Please try again. If it keeps happening, email us and we will reply
            with what you were looking for.
          </p>
          <div className="sys-actions">
            <button type="button" className="btn" onClick={() => reset()}>
              Try again
            </button>
            <Link href="/" className="btn btn-ghost">
              Go to the homepage
            </Link>
          </div>
          <p className="sys-mail">
            <a href="mailto:info@phytoelements.in">info@phytoelements.in</a>
            {error.digest && <span className="mono"> · Reference {error.digest}</span>}
          </p>
        </div>
      </div>
    </section>
  );
}
