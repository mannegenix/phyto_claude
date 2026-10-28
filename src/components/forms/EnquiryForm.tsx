"use client";

import Script from "next/script";
import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { submitEnquiry } from "@/app/actions/enquiry";
import { ENQUIRY_TYPES, SPEC_FILE_TYPES, TIMELINES, UNITS, type EnquiryState } from "@/lib/enquiry-schema";

type ProductOption = { slug: string; name: string };

const TYPE_LABEL: Record<(typeof ENQUIRY_TYPES)[number], string> = {
  Specifications: "Request specifications",
  Sample: "Request a sample",
  Quote: "Request a quote",
};

const turnstileKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

function FieldError({ msg }: { msg?: string }) {
  return msg ? <span className="err">{msg}</span> : null;
}

export function EnquiryForm({
  products,
  customers,
  preselect = "",
  defaultType = "Quote",
}: {
  products: ProductOption[];
  customers: string[];
  preselect?: string;
  defaultType?: (typeof ENQUIRY_TYPES)[number];
}) {
  const [state, action, pending] = useActionState<EnquiryState, FormData>(submitEnquiry, { status: "idle" });
  const [type, setType] = useState(defaultType);
  const formRef = useRef<HTMLFormElement>(null);
  const errors = state.status === "error" ? (state.fieldErrors ?? {}) : {};

  // Product pages' "Request a sample / quote" buttons dispatch this event to switch the request type.
  useEffect(() => {
    const onSet = (e: Event) => {
      const t = (e as CustomEvent<(typeof ENQUIRY_TYPES)[number]>).detail;
      if (ENQUIRY_TYPES.includes(t)) setType(t);
    };
    window.addEventListener("pe:set-enquiry-type", onSet);
    return () => window.removeEventListener("pe:set-enquiry-type", onSet);
  }, []);

  if (state.status === "success") {
    return (
      <div className="enq" role="status">
        <div className="fld-full grid gap-2.5 rounded-brand border border-[var(--ok)] p-5">
          <h4 className="text-[1.2rem] text-[var(--ok)]">Enquiry received</h4>
          <p>
            Thank you, {state.name}. Our team will reply to <b>{state.email}</b>.
          </p>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[0.88rem]">
            <dt className="mono text-[0.72rem] text-muted uppercase">Reference</dt>
            <dd className="mono">{state.reference}</dd>
            <dt className="mono text-[0.72rem] text-muted uppercase">Product</dt>
            <dd>{state.productName}</dd>
            <dt className="mono text-[0.72rem] text-muted uppercase">Routed to</dt>
            <dd className="mono">{state.routedTo}</dd>
          </dl>
        </div>
      </div>
    );
  }

  const field = (name: keyof typeof errors) => ({
    "data-invalid": errors[name] ? true : undefined,
  });

  return (
    <form
      ref={formRef}
      className="enq"
      noValidate
      onSubmit={(e) => {
        // Submit manually so React doesn't reset the fields when validation fails.
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(() => action(fd));
      }}
    >
      {turnstileKey && <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />}

      <fieldset className="fld fld-full border-0 p-0">
        <legend>I&apos;d like to</legend>
        <div className="seg">
          {ENQUIRY_TYPES.map((t) => (
            <label key={t}>
              <input type="radio" name="type" value={t} checked={type === t} onChange={() => setType(t)} />{" "}
              {TYPE_LABEL[t]}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="fld" {...field("name")}>
        <label htmlFor="enq-name">Full name</label>
        <input className="input" id="enq-name" name="name" autoComplete="name" required />
        <FieldError msg={errors.name} />
      </div>
      <div className="fld" {...field("company")}>
        <label htmlFor="enq-company">Company name</label>
        <input className="input" id="enq-company" name="company" autoComplete="organization" required />
        <FieldError msg={errors.company} />
      </div>
      <div className="fld" {...field("email")}>
        <label htmlFor="enq-email">Business email</label>
        <input className="input" id="enq-email" name="email" type="email" autoComplete="email" required />
        <FieldError msg={errors.email} />
      </div>
      <div className="fld" {...field("phone")}>
        <label htmlFor="enq-phone">
          Phone / WhatsApp <span className="opt">with country code</span>
        </label>
        <input
          className="input"
          id="enq-phone"
          name="phone"
          type="tel"
          placeholder="+91 …"
          autoComplete="tel"
          required
        />
        <FieldError msg={errors.phone} />
      </div>
      <div className="fld" {...field("country")}>
        <label htmlFor="enq-country">Country</label>
        <input className="input" id="enq-country" name="country" autoComplete="country-name" required />
        <FieldError msg={errors.country} />
      </div>
      <div className="fld" {...field("product")}>
        <label htmlFor="enq-product">Product of interest</label>
        <select className="input" id="enq-product" name="product" defaultValue={preselect} required>
          <option value="">Select a product</option>
          {products.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.name}
            </option>
          ))}
          <option value="other">Other / multiple products</option>
        </select>
        <FieldError msg={errors.product} />
      </div>
      <div className="fld">
        <label htmlFor="enq-grade">Required grade / specification</label>
        <input className="input" id="enq-grade" name="grade" placeholder="e.g. marker %, mesh size, solvent limits" />
      </div>
      <div className="fld" {...field("quantity")}>
        <label htmlFor="enq-qty">Required quantity</label>
        <div className="grid grid-cols-[1fr_120px] gap-2">
          <input className="input" id="enq-qty" name="quantity" inputMode="decimal" placeholder="e.g. 500" required />
          <select className="input" name="unit" aria-label="Unit" defaultValue="kg">
            {UNITS.map((u) => (
              <option key={u}>{u}</option>
            ))}
          </select>
        </div>
        <FieldError msg={errors.quantity} />
      </div>
      <div className="fld">
        <label htmlFor="enq-app">Application / industry</label>
        <select className="input" id="enq-app" name="application" defaultValue="">
          <option value="">Select</option>
          {customers.map((c) => (
            <option key={c}>{c}</option>
          ))}
          <option>Other</option>
        </select>
      </div>
      <div className="fld">
        <label htmlFor="enq-time">Target purchase timeline</label>
        <select className="input" id="enq-time" name="timeline" defaultValue="">
          <option value="">Select</option>
          {TIMELINES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <fieldset className="fld fld-full border-0 p-0">
        <legend>Sample required?</legend>
        <div className="seg">
          <label>
            <input type="radio" name="sample" value="Yes" defaultChecked={type === "Sample"} key={`y-${type}`} /> Yes
          </label>
          <label>
            <input type="radio" name="sample" value="No" defaultChecked={type !== "Sample"} key={`n-${type}`} /> No
          </label>
        </div>
      </fieldset>
      <div className="fld fld-full">
        <label htmlFor="enq-msg">
          Message / additional requirements <span className="opt">optional</span>
        </label>
        <textarea
          className="input min-h-[110px]"
          id="enq-msg"
          name="message"
          placeholder="Packing preference, documents needed, destination port, regulatory requirements…"
        />
      </div>
      <div className="fld fld-full" {...field("spec")}>
        <label htmlFor="enq-file">
          Attach your specification <span className="opt">optional · PDF, Word or Excel · max 5 MB</span>
        </label>
        <input className="input" id="enq-file" name="spec" type="file" accept={SPEC_FILE_TYPES.join(",")} />
        <FieldError msg={errors.spec} />
      </div>

      {/* Honeypot: hidden from people, filled by bots. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="fld fld-full" {...field("consent")}>
        <label className="flex items-start gap-2.5 text-[0.88rem] font-normal text-muted">
          <input type="checkbox" name="consent" className="mt-1 accent-[var(--accent)]" required />
          <span>
            I agree to be contacted by Phyto Elements about this enquiry and acknowledge the{" "}
            <a href="/privacy">privacy notice</a>.
          </span>
        </label>
        <FieldError msg={errors.consent} />
      </div>

      {turnstileKey && <div className="cf-turnstile fld-full" data-sitekey={turnstileKey} />}

      <div className="fld-full flex flex-wrap items-center justify-between gap-3.5">
        <small className="max-w-[44ch] text-[0.8rem] text-muted">
          {state.status === "error" && state.message ? (
            <span className="err">{state.message}</span>
          ) : (
            "Enquiries go to sales@phytoelements.in. Sample requests are copied to samples@phytoelements.in."
          )}
        </small>
        <button className="btn" type="submit" disabled={pending}>
          {pending ? "Sending…" : "Send enquiry"}
        </button>
      </div>
    </form>
  );
}
