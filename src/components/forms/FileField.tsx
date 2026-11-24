"use client";

import { useRef, useState } from "react";

const size = (b: number) =>
  b < 1024 * 1024 ? `${Math.max(1, Math.round(b / 1024))} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`;

/**
 * File upload for the enquiry form: a drop zone with a "Choose file" button, and once a file
 * is picked, a row with its name, size and Remove. The real <input type="file" name=…> stays
 * in the form (visually hidden, still focusable), so the form submits it as before.
 * Type and size are checked here for quick feedback; the server checks them again.
 */
export function FileField({
  id,
  name,
  accept,
  maxBytes,
  hint,
  error,
}: {
  id: string;
  name: string;
  accept: string[];
  maxBytes: number;
  hint: string;
  error?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [problem, setProblem] = useState<string | undefined>();
  const [over, setOver] = useState(false);

  const take = (f: File | null) => {
    setProblem(undefined);
    if (!f) return setFile(null);
    const ext = `.${f.name.split(".").pop()?.toLowerCase()}`;
    if (!accept.includes(ext)) {
      setProblem("Please choose a PDF, Word or Excel file.");
    } else if (f.size > maxBytes) {
      setProblem(`That file is ${size(f.size)}; the limit is ${size(maxBytes)}.`);
    }
    setFile(f);
  };

  const clear = () => {
    if (input.current) input.current.value = "";
    setFile(null);
    setProblem(undefined);
    input.current?.focus();
  };

  const msg = problem ?? error;

  return (
    <>
      <input
        ref={input}
        id={id}
        name={name}
        type="file"
        accept={accept.join(",")}
        className="sr-only"
        aria-describedby={`${id}-hint`}
        onChange={(e) => take(e.target.files?.[0] ?? null)}
      />
      {file ? (
        <div className="file-row" data-invalid={msg ? true : undefined}>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
            <path d="M14 3v5h5" />
          </svg>
          <span className="file-name" title={file.name}>
            {file.name}
          </span>
          <span className="file-size">{size(file.size)}</span>
          <button type="button" className="file-act" onClick={() => input.current?.click()}>
            Change
          </button>
          <button type="button" className="file-act" onClick={clear} aria-label={`Remove ${file.name}`}>
            Remove
          </button>
        </div>
      ) : (
        <div
          className="file-drop"
          data-over={over || undefined}
          onDragOver={(e) => {
            e.preventDefault();
            setOver(true);
          }}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setOver(false);
            const f = e.dataTransfer.files?.[0];
            if (!f || !input.current) return;
            const dt = new DataTransfer();
            dt.items.add(f);
            input.current.files = dt.files;
            take(f);
          }}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <path d="M12 16V4M7 9l5-5 5 5" />
            <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
          </svg>
          <button type="button" className="btn btn-ghost file-btn" onClick={() => input.current?.click()}>
            Choose file
          </button>
          <span className="file-hint" id={`${id}-hint`}>
            or drag it here · {hint}
          </span>
        </div>
      )}
      {msg && <span className="err">{msg}</span>}
    </>
  );
}
