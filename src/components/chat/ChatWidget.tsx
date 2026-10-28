"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";

const SUGGESTIONS = [
  "Which extracts do you manufacture?",
  "How do I request a sample?",
  "What documents do you provide?",
];

/**
 * Floating assistant, grounded in the site's approved content (see src/lib/chat-context.ts).
 * Enabled with NEXT_PUBLIC_CHAT_ENABLED=true plus ANTHROPIC_API_KEY on the server.
 */
export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error } = useChat();
  const busy = status === "submitted" || status === "streaming";

  const send = (text: string) => {
    if (!text.trim() || busy) return;
    sendMessage({ text: text.trim() });
    setInput("");
  };

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="flex h-[min(520px,70vh)] w-[min(380px,calc(100vw-32px))] flex-col overflow-hidden rounded-xl border border-line bg-surface text-ink shadow-[0_20px_50px_-20px_rgba(0,0,0,.4)]">
          <div className="flex items-center justify-between border-b border-line bg-sunk px-4 py-3">
            <div>
              <div className="font-display text-base font-semibold text-heading">Ask Phyto Elements</div>
              <div className="text-xs text-muted">Answers from our published product information</div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-brand px-2 py-1 text-sm text-muted hover:bg-paper"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4 text-[0.92rem]" aria-live="polite">
            {messages.length === 0 && (
              <div className="space-y-2">
                <p className="text-muted">Ask about our extracts, samples or documents.</p>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="block w-full rounded-brand border border-line px-3 py-2 text-left hover:border-accent"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                className={
                  m.role === "user"
                    ? "ml-8 rounded-lg bg-accent px-3 py-2 text-on-accent"
                    : "mr-8 rounded-lg bg-sunk px-3 py-2"
                }
              >
                {m.parts.map((p, i) =>
                  p.type === "text" ? (
                    <p key={i} className="whitespace-pre-wrap">
                      {p.text}
                    </p>
                  ) : null,
                )}
              </div>
            ))}
            {status === "submitted" && <div className="mr-8 rounded-lg bg-sunk px-3 py-2 text-muted">Thinking…</div>}
            {error && <p className="err">The assistant is unavailable. Please email sales@phytoelements.in.</p>}
          </div>

          <form
            className="flex gap-2 border-t border-line p-3"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <input
              className="input flex-1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question…"
              aria-label="Your question"
              maxLength={2000}
            />
            <button className="btn btn-sm" type="submit" disabled={busy}>
              Send
            </button>
          </form>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="btn rounded-full shadow-lg"
        aria-expanded={open}
      >
        {open ? "Close" : "Ask us"}
      </button>
    </div>
  );
}
