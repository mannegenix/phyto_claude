/**
 * Site look chosen in the footer: "light" (Verdan light, the default) or "gradient" (the
 * blue → cyan → lime brand gradient from dev1.phytoelements.in on buttons, bands and the
 * footer). Stored on this device; applied before paint as html.pe-gradient.
 */
export const SKIN_KEY = "pe-skin";
export type Skin = "light" | "gradient";

export const skinBootScript = `try{if(localStorage.getItem("${SKIN_KEY}")==="gradient")document.documentElement.classList.add("pe-gradient")}catch(e){}`;

export function currentSkin(): Skin {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("pe-gradient") ? "gradient" : "light";
}

export function setSkin(skin: Skin) {
  document.documentElement.classList.toggle("pe-gradient", skin === "gradient");
  try {
    if (skin === "gradient") localStorage.setItem(SKIN_KEY, "gradient");
    else localStorage.removeItem(SKIN_KEY);
  } catch {
    /* storage unavailable: the choice lasts for this page only */
  }
}
