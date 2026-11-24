# Phyto Elements website: outstanding steps

In priority order. Update this file whenever an item is done, added or reprioritised
(tick it, move it to "Done", note the date). Owner: **Abhi** (settings, testing, client),
**Client** (information to supply), **Dev** (code changes).

Last updated: 24 Nov 2026

## 1. Now

- [ ] **Decide on search-engine indexing** (Abhi). The live build currently has
      `NEXT_PUBLIC_ALLOW_INDEXING=true`, so robots.txt allows crawlers and pages carry no
      noindex. If the site is not signed off yet: set it to `false` in Cloudflare
      (Settings › Build › Variables) and Retry build. If it is: go to step 6.
- [ ] **Test both enquiry forms end to end** (Abhi). From /sample and /contact (Turnstile
      ticked): the email arrives in the Zoho inbox from info@phytoelements.in, the subject
      starts "Website enquiry [ref]", and Reply goes to the visitor's address.

## 2. Client sign-off

- [ ] **Client review of the live site** (Client). Latest changes: standard scrolling, hero
      step spacing, hero product strip hidden, Lime tag summary card, 404/500 pages, share
      images.
- [ ] **Hero product strip** (Client). Hidden for now: bring back or delete.

## 3. Legal pages (waiting on the client)

- [ ] **Client supplies the policy details** (Client): legal entity name, CIN / GST,
      registered address; Grievance Officer name and email (DPDP Act); markets served
      (EU / UK / US → GDPR wording); how long enquiry data is kept; marketing-email opt-in or
      not; who data is shared with (Zoho, Resend, Cloudflare, any CRM or distributors);
      governing law and courts; product disclaimer, quotation / terms-of-sale basis, sample
      policy; image rights; effective date.
- [ ] **Write Privacy, Terms and Cookies pages** (Dev), then set
      `siteConfig.legalPagesLive = true` (restores footer links, consent-line link, sitemap
      entry).

## 4. Go-live

- [ ] **Open to search engines** (Abhi): `NEXT_PUBLIC_ALLOW_INDEXING=true` (if reset in step 1)
      and Retry build; check /robots.txt says `Allow: /`.
- [ ] **Google Search Console** (Abhi): add the domain property (DNS TXT record in
      Cloudflare), submit `https://phytoelements.in/sitemap.xml`, request indexing of the
      homepage and product pages.
- [ ] **Bing Webmaster Tools** (Abhi): import from Search Console, submit the sitemap.
- [ ] **Check share previews** (Abhi): paste the homepage and a product link into WhatsApp /
      LinkedIn (LinkedIn Post Inspector refreshes its cache).

## 5. Phase 2

- [ ] **GA4 analytics** (Dev + Abhi): GA4 property, tag, and an enquiry conversion from the
      form's existing `pe:enquiry-sent` event. Needs the Cookies page and a consent banner.
- [ ] **SEO content plan** (Dev + Client): target keywords per extract and buyer type, FAQ /
      guide pages, internal linking. No new claims without client approval.
- [ ] **AI chat assistant** like mannegenix.com (Dev): built fresh; answers only from site
      content; new API key and on/off setting at build time.
- [ ] **Acknowledgement email to enquirers** (Dev, optional): automatic reply from info@ with
      the reference number.

## 6. After launch (housekeeping)

- [ ] **DMARC** (Abhi, 2–4 weeks after launch): when Cloudflare DMARC reports show only Zoho
      and Resend sending as phytoelements.in, move `p=none` → `p=quarantine`.
- [ ] **New products** (Dev, each time): add to `src/content/products.ts` with photos, then
      run `node --experimental-strip-types scripts/og-images.mts` for its share image.

## Done

- 24 Nov: Cloudflare tidy-up (unused variables and the old chat key removed; workers.dev and
  Preview URLs disabled).
- 24 Nov: email (Zoho inbox + Resend from info@), Turnstile, Cloudflare Web Analytics,
  production domain only, 404 / 500 pages, Logo look only, hero by screen size, unused code
  and themes removed, standard scrolling, hero overlap fixes, legal pages hidden, Lime tag
  summary card, canonical URLs, share images, structured data, manifest, llms.txt.
