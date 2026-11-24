import { siteConfig } from "@/config/site";
import { enquiryAck as copy } from "@/content/emails";

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

/** Logo colours (email clients need inline hex values). */
const G = "#02584a";
const L = "#94de03";
const Y = "#fdce18";
const MUTED = "#4f7a71";

export type AckInput = {
  reference: string;
  name: string;
  type: string;
  productName: string;
  grade: string;
  quantity: string;
  sample: string;
  attachmentName?: string;
};

/**
 * Acknowledgement email to the enquirer (Option B: a copy of their request for their records).
 * Only fields they entered are echoed (not the free-text message); everything is escaped.
 */
export function buildAckEmail(a: AckInput) {
  const first = a.name.trim().split(/\s+/)[0] || a.name;
  const request = copy.requestNames[a.type] ?? "enquiry";
  const rows: [string, string][] = [
    ["Reference", a.reference],
    ["Request", a.type],
    ["Product", a.productName],
    ...(a.grade ? ([["Grade / specification", a.grade.slice(0, 200)]] as [string, string][]) : []),
    ["Quantity", a.quantity],
    ["Sample required", a.sample],
    ...(a.attachmentName ? ([["Your attachment", a.attachmentName]] as [string, string][]) : []),
  ];
  const intro = copy.intro.replace("{request}", request);
  const subject = `Your enquiry [${a.reference}]: ${a.productName}`;

  const table = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:7px 12px 7px 0;color:${MUTED};width:44%;border-bottom:1px solid #eef3e6;vertical-align:top">${k}</td><td style="padding:7px 0;font-weight:bold;border-bottom:1px solid #eef3e6">${esc(v)}</td></tr>`,
    )
    .join("");

  const html = `<!doctype html><html><body style="margin:0;background:#f3f6ee">
<div style="background:#f3f6ee;padding:28px 12px;font-family:Arial,Helvetica,sans-serif;color:${G}">
<div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #e1ead6">
<div style="height:6px;background:${L};border-right:180px solid ${Y}"></div>
<div style="padding:26px 34px 6px"><img src="${siteConfig.url}/brand/logo.png" alt="Phyto Elements" width="49" height="64" style="display:block;height:64px;width:auto"></div>
<div style="padding:10px 34px 30px;font-size:15px;line-height:1.6">
<p style="margin:0 0 14px">Dear ${esc(first)},</p>
<p style="margin:0 0 14px">${esc(intro)}</p>
<table role="presentation" style="width:100%;border-collapse:collapse;font-size:14px;margin:6px 0 18px">${table}</table>
<p style="margin:0 0 14px">${esc(copy.next).replace("{reference}", `<b style="white-space:nowrap">${esc(a.reference)}</b>`)}</p>
<p style="margin:0">${esc(copy.signOff)}</p>
</div>
<div style="padding:18px 34px;background:#f6fbe9;border-top:1px solid #e6f0d4;font-size:12px;line-height:1.6;color:#3f6b62">
${esc(siteConfig.name)} · Hyderabad, India · <a href="${siteConfig.url}" style="color:${G}">phytoelements.in</a><br>
${esc(copy.footer)} <a href="${siteConfig.url}/privacy" style="color:${G}">Privacy Policy</a>
</div></div></div></body></html>`;

  const text = [
    `Dear ${first},`,
    "",
    intro,
    "",
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    copy.next.replace("{reference}", a.reference),
    "",
    copy.signOff,
    "",
    `${siteConfig.name} · Hyderabad, India · ${siteConfig.url}`,
    `${copy.footer} Privacy Policy: ${siteConfig.url}/privacy`,
  ].join("\n");

  return { subject, html, text };
}
