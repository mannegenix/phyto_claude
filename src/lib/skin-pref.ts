/**
 * Site look. Since Nov 24 every visitor gets the Logo look: only the three logo colours on
 * white and pale tints (html.pe-logo, styles/logo.css). The look switch and the Gradient and
 * Light looks were removed; an older stored choice is cleared.
 */
export const skinBootScript = `(function(){try{localStorage.removeItem("pe-skin")}catch(e){}document.documentElement.classList.add("pe-logo")})()`;
