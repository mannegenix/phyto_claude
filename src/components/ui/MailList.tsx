"use client";

import { useState } from "react";
import type { Mailbox } from "@/content/types";

function CopyButton({ text }: { text: string }) {
  const [state, setState] = useState<"idle" | "copied">("idle");
  return (
    <button
      type="button"
      className="mono rounded-brand border border-line bg-surface px-2.5 py-1.5 text-[0.78rem] text-ink hover:border-accent"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setState("copied");
          setTimeout(() => setState("idle"), 1600);
        } catch {}
      }}
    >
      {state === "copied" ? "Copied" : "Copy"}
    </button>
  );
}

export function MailList({ mailboxes }: { mailboxes: Mailbox[] }) {
  return (
    <div className="border-t border-line">
      {mailboxes.map((m) => (
        <div key={m.address} className="mail">
          <a className="mail-addr no-underline" href={`mailto:${m.address}`}>
            {m.address}
          </a>
          <div>
            <div className="text-[0.9rem] font-semibold">{m.label}</div>
            <p className="text-[0.88rem] text-muted">{m.use}</p>
          </div>
          <CopyButton text={m.address} />
        </div>
      ))}
    </div>
  );
}
