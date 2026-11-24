/**
 * Homepage hero by screen (no toggle since Nov 24) → html.hero-dev1:
 *  - Dev 1 (photo slits) on phones and tablets: ≤1120px wide, or a touch screen of any width
 *    (iPads in landscape included)
 *  - Dev 2 (lot-testing scene) on laptops and desktops, 13-inch and up
 * Applied before paint by the boot script and kept in step on resize / rotation by
 * hero/HeroMode.
 */
export const HERO_SMALL = "(max-width: 1120px), (hover: none) and (pointer: coarse)";
export const heroBootScript = `try{localStorage.removeItem("pe-hero");if(matchMedia("${HERO_SMALL}").matches)document.documentElement.classList.add("hero-dev1")}catch(e){}`;
