import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";

/** Internal "verify before launch" note. Renders only when NEXT_PUBLIC_SHOW_REVIEW_NOTES=true. */
export function ReviewNote({ children }: { children: ReactNode }) {
  if (!siteConfig.showReviewNotes) return null;
  return (
    <div className="rnote">
      <b>Review before launch</b>
      {children}
    </div>
  );
}
