import Image from "next/image";

/**
 * Approved Phyto Elements logo (client artwork, public/brand), always in its original colours.
 * The header and footer use the mark beside the wordmark.
 */
export function LogoMark({ className = "h-[38px] w-auto" }: { className?: string }) {
  return <Image src="/brand/mark.png" alt="" width={192} height={173} className={className} unoptimized aria-hidden="true" />;
}

export function Logo() {
  return (
    <span className="logo" role="img" aria-label="Phyto Elements">
      <span className="logo-set logo-pos">
        <Image src="/brand/mark.png" alt="" width={192} height={173} className="logo-mark" unoptimized priority />
        <Image src="/brand/wordmark.png" alt="" width={248} height={120} className="logo-word" unoptimized priority />
      </span>
    </span>
  );
}
