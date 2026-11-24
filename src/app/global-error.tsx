"use client";

/**
 * Last-resort error page, used only when the site layout itself fails to render. It cannot
 * rely on the site's styles, so it carries its own (logo colours on white).
 */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#ffffff",
          color: "#02584a",
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
          padding: "24px",
        }}
      >
        <main style={{ maxWidth: 520, textAlign: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo.png" alt="Phyto Elements" width={120} style={{ height: "auto" }} />
          <h1 style={{ fontSize: "1.8rem", margin: "24px 0 10px" }}>The site didn&apos;t load</h1>
          <p style={{ lineHeight: 1.6, margin: "0 0 22px" }}>
            Something went wrong on our side. Please try again, or email{" "}
            <a href="mailto:info@phytoelements.in" style={{ color: "#02584a", fontWeight: 700 }}>
              info@phytoelements.in
            </a>
            .
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              background: "#94de03",
              color: "#02584a",
              border: 0,
              borderRadius: 999,
              padding: "12px 24px",
              fontWeight: 700,
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
