"use client";

import { useMemo, useState } from "react";
import { OTHER, SearchSelect, type SearchOption } from "@/components/forms/SearchSelect";
import { Req } from "@/components/forms/Req";
import { ALIASES, COUNTRIES, MAIN_FOR_CODE, PINNED_ISO, countryByIso } from "@/lib/countries";
import { COUNTRY_TEXT, DIAL_TEXT, PHONE_NUMBER } from "@/lib/enquiry-schema";

/** Pinned countries first, then A–Z, then "Other". */
function ordered() {
  const pinned = PINNED_ISO.map((iso) => countryByIso(iso)!).filter(Boolean);
  const rest = COUNTRIES.filter((c) => !PINNED_ISO.includes(c.iso));
  return { pinned, rest };
}

/**
 * Country (searchable dropdown) and phone (code dropdown + number). Picking a country fills its
 * dialling code; both can be changed. "Other" opens a text box, checked as you type.
 * Submits the same fields as before: `country` (a name) and `phone` ("+91 98xxx xxxxx").
 */
export function CountryPhone({ countryError, phoneError }: { countryError?: string; phoneError?: string }) {
  const [countryIso, setCountryIso] = useState("");
  const [otherCountry, setOtherCountry] = useState("");
  const [dialIso, setDialIso] = useState("");
  const [otherDial, setOtherDial] = useState("");
  const [number, setNumber] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const { countryOptions, dialOptions } = useMemo(() => {
    const { pinned, rest } = ordered();
    const all = [...pinned, ...rest];
    const countryOptions: SearchOption[] = [
      ...all.map((c, i) => ({
        value: c.iso,
        label: c.name,
        keywords: `${c.iso} ${c.dial} ${ALIASES[c.iso] ?? ""}`,
        divider: i === pinned.length - 1,
      })),
      { value: OTHER, label: "Other (type it in)", short: "Other" },
    ];
    const dialOptions: SearchOption[] = [
      ...all.map((c, i) => ({
        value: c.iso,
        label: `${c.dial}  ${c.name}`,
        short: `${c.dial} ${c.iso}`,
        rank: MAIN_FOR_CODE.includes(c.iso) ? 1 : 0,
        keywords: `${c.iso} ${ALIASES[c.iso] ?? ""}`,
        divider: i === pinned.length - 1,
      })),
      { value: OTHER, label: "Other code (type it in)", short: "Other" },
    ];
    return { countryOptions, dialOptions };
  }, []);

  const countryName = countryIso === OTHER ? otherCountry.trim() : (countryByIso(countryIso)?.name ?? "");
  const dial =
    dialIso === OTHER
      ? otherDial.trim()
        ? `+${otherDial.trim().replace(/^\+/, "")}`
        : ""
      : (countryByIso(dialIso)?.dial ?? "");
  const phone = dial && number.trim() ? `${dial} ${number.trim()}` : number.trim();

  // Checks as you type (after leaving the field); the server checks the same rules again.
  const otherCountryErr =
    countryIso === OTHER && touched.otherCountry && !COUNTRY_TEXT.test(otherCountry.trim())
      ? "Use letters only, e.g. Somaliland."
      : undefined;
  const otherDialErr =
    dialIso === OTHER && touched.otherDial && !DIAL_TEXT.test(otherDial.trim())
      ? "Use + and 1 to 4 digits, e.g. +882."
      : undefined;
  const numberErr =
    touched.number && number.trim() && !PHONE_NUMBER.test(number.trim())
      ? "Use digits only (spaces or dashes allowed), 4 to 14 digits."
      : undefined;

  return (
    <>
      <input type="hidden" name="country" value={countryName} />
      <input type="hidden" name="phone" value={phone} />

      <div className="fld" data-invalid={countryError || otherCountryErr ? true : undefined}>
        <label htmlFor="enq-country">
          Country <Req />
        </label>
        <SearchSelect
          id="enq-country"
          value={countryIso}
          options={countryOptions}
          placeholder="Select your country"
          searchPlaceholder="Search countries"
          invalid={Boolean(countryError)}
          onChange={(iso) => {
            setCountryIso(iso);
            // Fill the phone code to match (it stays editable).
            if (iso !== OTHER) setDialIso(iso);
          }}
        />
        {countryIso === OTHER && (
          <input
            className="input"
            aria-label="Your country"
            placeholder="Type your country"
            value={otherCountry}
            maxLength={60}
            autoComplete="country-name"
            onChange={(e) => setOtherCountry(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, otherCountry: true }))}
          />
        )}
        {(otherCountryErr || countryError) && <span className="err">{otherCountryErr ?? countryError}</span>}
      </div>

      <div className="fld" data-invalid={phoneError || otherDialErr || numberErr ? true : undefined}>
        <label htmlFor="enq-phone">
          Phone / WhatsApp <Req />
        </label>
        <div className="phone-row">
          <SearchSelect
            id="enq-dial"
            className="phone-code"
            value={dialIso}
            options={dialOptions}
            placeholder="Code"
            searchPlaceholder="Search code or country"
            invalid={Boolean(phoneError)}
            onChange={setDialIso}
          />
          {dialIso === OTHER && (
            <input
              className="input phone-other"
              aria-label="Country code"
              placeholder="+…"
              inputMode="tel"
              maxLength={5}
              value={otherDial}
              onChange={(e) => setOtherDial(e.target.value.replace(/[^\d+]/g, ""))}
              onBlur={() => setTouched((t) => ({ ...t, otherDial: true }))}
            />
          )}
          <input
            className="input"
            id="enq-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="Phone number"
            aria-label="Phone number"
            value={number}
            maxLength={20}
            onChange={(e) => setNumber(e.target.value.replace(/[^\d\s-]/g, ""))}
            onBlur={() => setTouched((t) => ({ ...t, number: true }))}
          />
        </div>
        {(otherDialErr || numberErr || phoneError) && (
          <span className="err">{otherDialErr ?? numberErr ?? phoneError}</span>
        )}
      </div>
    </>
  );
}
