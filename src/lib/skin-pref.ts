/**
 * Site look chosen in the footer:
 *  - "gradient" (default): the blue → cyan → lime brand gradient from dev1.phytoelements.in
 *    on the top menu, buttons and bands (html.pe-gradient, styles/gradient.css)
 *  - "logo": only the three logo colours on white and pale tints (html.pe-logo,
 *    styles/logo.css)
 *  - "light": plain Verdan light (no class)
 * A non-default choice is stored on the device; the look is applied before paint.
 */
export const SKIN_KEY = "pe-skin";
export const SKINS = ["light", "gradient", "logo"] as const;
export type Skin = (typeof SKINS)[number];
export const DEFAULT_SKIN: Skin = "gradient";

export const skinBootScript = `(function(){var h=document.documentElement,s="${DEFAULT_SKIN}";try{var v=localStorage.getItem("${SKIN_KEY}");if(v==="light"||v==="gradient"||v==="logo")s=v}catch(e){}if(s!=="light")h.classList.add("pe-"+s)})()`;

export function currentSkin(): Skin {
  if (typeof document === "undefined") return DEFAULT_SKIN;
  const c = document.documentElement.classList;
  return c.contains("pe-logo") ? "logo" : c.contains("pe-gradient") ? "gradient" : "light";
}

export function setSkin(skin: Skin) {
  const c = document.documentElement.classList;
  c.toggle("pe-gradient", skin === "gradient");
  c.toggle("pe-logo", skin === "logo");
  try {
    if (skin === DEFAULT_SKIN) localStorage.removeItem(SKIN_KEY);
    else localStorage.setItem(SKIN_KEY, skin);
  } catch {
    /* storage unavailable: the choice lasts for this page only */
  }
}
