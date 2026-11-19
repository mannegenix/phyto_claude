/** Homepage hero choice (review toggle): "dev2" (default) or "dev1" → html.hero-dev1. */
export const HERO_KEY = "pe-hero";
export const heroBootScript = `try{if(localStorage.getItem("${HERO_KEY}")==="dev1")document.documentElement.classList.add("hero-dev1")}catch(e){}`;
