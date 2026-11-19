import type { Product } from "@/content/types";

const OnRequest = () => <span className="req">Shared on request</span>;

/** Representative specification summary (client-supplied values; missing values render as "Shared on request"). */
export function SpecSheet({ product }: { product: Product }) {
  const s = product.spec ?? {};
  const rows: [string, React.ReactNode][] = [
    ["Product", product.name],
    ["Botanical source", <i key="b">{product.botanicalSource}</i>],
    ["Plant part", product.plantPart],
    ["Extract type", s.extractType ?? <OnRequest />],
    ["Quality marker", product.marker],
    ["Grade / assay", s.gradeAssay ?? <OnRequest />],
    ["Appearance", s.appearance ?? <OnRequest />],
  ];
  // Optional rows: shown only when the product has a value.
  const optional: [string, string | undefined][] = [
    ["CAS number", s.cas],
    ["Extraction solvent", s.solvent],
    ["Particle size", s.particleSize],
    ["Solubility", s.solubility],
    ["Loss on drying", s.lossOnDrying],
    ["Heavy metals", s.heavyMetals],
    ["Microbial limits", s.microbial],
    ["Storage", s.storage],
    ["Shelf life", s.shelfLife],
  ];
  for (const [k, v] of optional) if (v) rows.push([k, v]);
  rows.push(["MOQ", s.moq ?? <OnRequest key="moq" />]);
  return (
    <div className="sheet">
      <div className="sheet-h">
        <span>Product specification summary</span>
        <span>Representative · not a lot COA</span>
      </div>
      <div className="overflow-x-auto">
        <table>
          <tbody>
            {rows.map(([k, v]) => (
              <tr key={k}>
                <th scope="row">{k}</th>
                <td>{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="sheet-f">
        Representative specification. Lot-specific values are confirmed in the Certificate of Analysis supplied
        with each lot.
      </div>
    </div>
  );
}
