import type { Product } from "@/content/types";

const OnRequest = () => <span className="req">Shared on request</span>;

/** Representative specification summary. Unverified values render as "Shared on request". */
export function SpecSheet({ product }: { product: Product }) {
  const s = product.spec ?? {};
  const rows: [string, React.ReactNode][] = [
    ["Product", product.name],
    ["Botanical source", <i key="b">{product.botanicalSource}</i>],
    ["Plant part", product.plantPart],
    ["Extract type", s.extractType ?? <OnRequest />],
    ["Quality marker", product.marker],
    ["Grade / assay range", s.gradeAssay ?? <OnRequest />],
    ["Appearance", s.appearance ?? <OnRequest />],
    ["Packing", s.packing ?? <OnRequest />],
    ["MOQ", s.moq ?? <OnRequest />],
    ["Indicative lead time", s.leadTime ?? <OnRequest />],
  ];
  return (
    <div className="sheet">
      <div className="sheet-h">
        <span>PRODUCT SPECIFICATION SUMMARY · {product.code}</span>
        <span>Representative · not a batch COA</span>
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
        Grade, assay and physical parameters are confirmed in the product specification sheet. Batch-specific results
        appear only in the batch Certificate of Analysis.
      </div>
    </div>
  );
}
