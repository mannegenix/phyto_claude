import Link from "next/link";
import { getCompany, getProducts } from "@/lib/content";
import { siteConfig } from "@/config/site";
import { Logo } from "./Logo";

export async function Footer() {
  const [products, { mailboxes }] = await Promise.all([getProducts(), getCompany()]);

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="grid content-start gap-4">
            <Link href="/" className="no-underline">
              <Logo />
            </Link>
            <p className="max-w-[34ch]">
              {siteConfig.tagline}. Bulk plant extracts, tested lot by lot, for Indian and export B2B buyers.
            </p>
          </div>
          <div>
            <h4>Products</h4>
            <ul className="grid gap-2">
              {products.map((p) => (
                <li key={p.slug}>
                  <Link href={`/products/${p.slug}`}>{p.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul className="grid gap-2">
              <li>
                <Link href="/about">About Phyto Elements</Link>
              </li>
              <li>
                <Link href="/operations">How we work</Link>
              </li>
              <li>
                <Link href="/quality">Testing &amp; Quality</Link>
              </li>
              <li>
                <Link href="/resources">Documents / Resources</Link>
              </li>
              <li>
                <Link href="/privacy">Privacy notice</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Write to us</h4>
            <ul className="mono grid gap-2 text-[0.84rem]">
              {mailboxes.map((m) => (
                <li key={m.address}>{m.address}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="legal">
          <span>
            © {new Date().getFullYear()} Phyto Elements · {siteConfig.domain}
          </span>
          <span>Registered legal name and address to be published after verification</span>
        </div>
      </div>
    </footer>
  );
}
