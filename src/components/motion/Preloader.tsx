import { getProducts } from "@/lib/content";
import { Illustration } from "@/components/botanicals/Illustration";
import { LeafDropArt } from "./LeafDropArt";

/**
 * Preloader: a full "lot release" screen. A drop falls from a leaf into a bottle,
 * a counter runs to 100 %, the five checks tick through, and the six extracts are
 * marked tested. Pure CSS animation (see motion.css), so it never blocks content
 * when JavaScript fails. Plays once per browser session; never for reduced motion.
 */
export const preloaderBootScript = `try{var s=sessionStorage;if(s.getItem("pe-intro"))document.documentElement.classList.add("pe-seen");else s.setItem("pe-intro","1")}catch(e){}`;

const STATUS = [
  "lot.intake  ·  sourced from qualified producers",
  "lot.screen  ·  documents and acceptance criteria",
  "lot.test    ·  identity · purity · potency · safety · stability",
  "lot.release ·  passed · labelled Phyto Elements",
];

export async function Preloader() {
  const products = await getProducts();
  return (
    <div className="preloader" aria-hidden="true">
      <div className="pl-photo" />
      <span className="pl-corner pl-tl" />
      <span className="pl-corner pl-tr" />
      <span className="pl-corner pl-bl" />
      <span className="pl-corner pl-br" />

      <header className="pl-top">
        <span>
          <b>Phyto Elements</b> / <em>Quality lab</em>
        </span>
        <span className="pl-online">Lot release sequence · online</span>
      </header>

      <div className="pl-center">
        <LeafDropArt id="pl" className="pl-art" />
        <div className="pl-readout">
          <div className="pl-count">
            <span className="pl-num" />
            <span className="pl-pct">%</span>
          </div>
          <div className="pl-bar">
            <i />
          </div>
          <div className="pl-status">
            {STATUS.map((s, i) => (
              <span key={s} style={{ ["--i" as string]: i }}>
                [{s}]
              </span>
            ))}
          </div>
          <ul className="pl-products">
            {products.map((p, i) => (
              <li key={p.slug} style={{ ["--i" as string]: i, ["--sw" as string]: p.swatch }}>
                <span className="pl-orb">
                  <Illustration slug={p.slug} uid="pl" />
                </span>
                <span className="pl-code">{p.code}</span>
                <span className="pl-ok">Tested</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <footer className="pl-foot">
        <span>© {new Date().getFullYear()} Phyto Elements · Sourced widely. Tested rigorously.</span>
        <span>Lot release system</span>
      </footer>
    </div>
  );
}
