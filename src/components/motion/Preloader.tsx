/**
 * "The Drop": a single drop of extract forms, falls and ripples out, then the
 * page is revealed. Pure CSS (see motion.css), so it never blocks content when
 * JavaScript fails. Plays once per browser session and never for reduced motion.
 */
export const preloaderBootScript = `try{var s=sessionStorage;if(s.getItem("pe-intro"))document.documentElement.classList.add("pe-seen");else s.setItem("pe-intro","1")}catch(e){}`;

export function Preloader() {
  return (
    <div className="preloader" aria-hidden="true">
      <svg viewBox="0 0 160 200" className="preloader-art">
        <ellipse className="pl-ripple pl-ripple-1" cx="80" cy="150" rx="46" ry="9" />
        <ellipse className="pl-ripple pl-ripple-2" cx="80" cy="150" rx="46" ry="9" />
        <line className="pl-surface" x1="20" y1="150" x2="140" y2="150" />
        <g className="pl-drop">
          <path d="M80 30 C84 42 92 50 92 60 A12 12 0 0 1 68 60 C68 50 76 42 80 30Z" />
        </g>
      </svg>
      <span className="preloader-word">Phyto Elements</span>
    </div>
  );
}
