"use client";

const BUTTONS = [
  { type: "Specifications", label: "Request Specifications", primary: true },
  { type: "Sample", label: "Request a Sample" },
  { type: "Quote", label: "Request a Quote" },
] as const;

/** Product-page CTAs: switch the enquiry form's request type and scroll to the form itself. */
export function EnquiryButtons() {
  return (
    <div className="flex flex-wrap gap-2.5">
      {BUTTONS.map((b) => (
        <a
          key={b.type}
          href="#enquiry-form"
          className={`btn ${"primary" in b ? "" : "btn-ghost"}`}
          onClick={() => window.dispatchEvent(new CustomEvent("pe:set-enquiry-type", { detail: b.type }))}
        >
          {b.label}
        </a>
      ))}
    </div>
  );
}
