# Phyto Elements website: outstanding steps

In priority order. Update this file whenever an item is done, added or reprioritised
(tick it, move it to "Done", note the date). Owner: **Abhi** (settings, testing, client),
**Client** (information to supply), **Dev** (code changes).

Last updated: 24 Nov 2026

## 1. Now

- Nothing open.

## 2. Client sign-off

- Nothing open.

## 3. Legal pages

- [x] **Client supplied the policy details** (24 Nov; "Queries: Terms, Privacy, Legal and
      others"). Partnership firm, registered address, Grievance Officer, Zoho, logistics
      sharing, analytics planned, no arbitration, quotes non-binding until PO, buyer handles
      import rules, effective 24 Nov 2026, sign-off Ashwin Jangalapalli.
- [ ] **Client's lawyer reviews** the Privacy Policy, Terms of Use and Cookie Notice
      (live since 24 Nov; copy in `src/content/legal.ts`) (Client, no follow-up from us;
      we update the text when they send changes).
- [ ] **Add GSTIN** to the policies once registered (Client, then Dev).

## 4. Go-live

- Nothing open.

## 5. Phase 2

- [ ] **GA4 analytics** (Dev + Abhi): GA4 property, tag, and an enquiry conversion from the
      form's existing `pe:enquiry-sent` event. Needs the Cookies page and a consent banner.
- [ ] **SEO content plan** (Dev + Client): target keywords per extract and buyer type, FAQ /
      guide pages, internal linking. No new claims without client approval.
- [ ] **AI chat assistant** like mannegenix.com (Dev): built fresh; answers only from site
      content; new API key and on/off setting at build time.

## 5b. Parked

- [ ] **Country from location** (Dev): optionally pre-select the country (and phone code) in the
      enquiry form from the visitor's location. Prefer Cloudflare's request country
      (`CF-IPCountry`, no permission prompt) over the browser's location permission; it must
      stay editable and be mentioned in the Privacy Policy if location data is used.

## 6. After launch (housekeeping)

- [ ] **DMARC** (Abhi, 2–4 weeks after launch): when Cloudflare DMARC reports show only Zoho
      and Resend sending as phytoelements.in, move `p=none` → `p=quarantine`.
- [ ] **New products** (Dev, each time): add to `src/content/products.ts` with photos, then
      run `node --experimental-strip-types scripts/og-images.mts` for its share image.

## Done

- 25 Nov: go-live done: Google Search Console (domain verified, sitemap submitted, key pages
  requested), Bing Webmaster Tools (imported), share previews checked on LinkedIn and WhatsApp.
- 25 Nov: enquiry forms tested end to end (enquiry, automatic copy, replies); Zoho SPF,
  DKIM and MX verified; client reviewed the live site.
- 24–25 Nov: enquiry form: required fields marked *, new file upload field; Turnstile fixed for
  menu navigation.
- 24 Nov: enquiry form: searchable country dropdown (India pinned, "Other" with text check) and
  phone split into a searchable code dropdown, filled from the country, plus the number.
- 24 Nov: automatic acknowledgement to enquirers (client chose Option B, a copy of their
  request for their records).
- 24 Nov: hero product strip: client asked to remove it; kept in the code, hidden (Abhi's
  call), so it can come back with one CSS line.
- 24 Nov: Privacy Policy, Terms of Use and Cookie Notice written from the client's answers
  and published; consent line covers current or future requirements; footer notes that
  images are illustrative (AI-generated).
- 24 Nov: indexing decided: the site stays open to search engines
  (`NEXT_PUBLIC_ALLOW_INDEXING=true`; live robots.txt allows crawlers, no noindex).
- 24 Nov: Cloudflare tidy-up (unused variables and the old chat key removed; workers.dev and
  Preview URLs disabled).
- 24 Nov: email (Zoho inbox + Resend from info@), Turnstile, Cloudflare Web Analytics,
  production domain only, 404 / 500 pages, Logo look only, hero by screen size, unused code
  and themes removed, standard scrolling, hero overlap fixes, legal pages hidden, Lime tag
  summary card, canonical URLs, share images, structured data, manifest, llms.txt.
