import Image from "next/image";

/**
 * Approved Phyto Elements logo (client artwork, public/brand). The header and footer use
 * the mark beside the wordmark; `logo-neg` is the reversed version for dark surfaces,
 * switched in CSS (components.css, "Logo").
 */
export function LogoMark({ className = "h-[38px] w-auto" }: { className?: string }) {
  return <Image src="/brand/mark.png" alt="" width={192} height={173} className={className} unoptimized aria-hidden="true" />;
}

function Lockup({ neg = false }: { neg?: boolean }) {
  const s = neg ? "-reverse" : "";
  return (
    <span className={`logo-set ${neg ? "logo-neg" : "logo-pos"}`}>
      <Image src={`/brand/mark${s}.png`} alt="" width={192} height={173} className="logo-mark" unoptimized priority />
      <Image src={`/brand/wordmark${s}.png`} alt="" width={248} height={120} className="logo-word" unoptimized priority />
    </span>
  );
}

export function Logo() {
  return (
    <span className="logo" role="img" aria-label="Phyto Elements">
      <Lockup />
      <Lockup neg />
    </span>
  );
}
