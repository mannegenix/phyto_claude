/**
 * Homepage hero choice (review toggle) → html.hero-dev1.
 * Default by screen: Dev 1 (photo slits) on phones and tablets (≤1120px), Dev 2 (lot-testing
 * scene) on laptops and desktops, 13-inch included. A visitor's pick is stored and wins.
 */
export const HERO_KEY = "pe-hero";
export const HERO_SMALL = "(max-width: 1120px)";
export const heroBootScript = `try{var v=null;try{v=localStorage.getItem("${HERO_KEY}")}catch(e){}if(v==="dev1"||(v!=="dev2"&&matchMedia("${HERO_SMALL}").matches))document.documentElement.classList.add("hero-dev1")}catch(e){}`;
