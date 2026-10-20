// Diagram cara mengukur badan di manekin: lingkar dada, pinggang, pinggul, dan tinggi badan.
import { svgTubuh, svgLengan, svgTangan } from '@/lib/busana/tubuh';

const GARIS = [
  { y: 194, rx: 52, label: 'Lingkar dada', no: 1 },
  { y: 262, rx: 38, label: 'Lingkar pinggang', no: 2 },
  { y: 330, rx: 52, label: 'Lingkar pinggul', no: 3 },
];

export default function DiagramUkur({ className = '' }) {
  let s = svgTubuh({ mode: 'manekin', alas: true }) + svgLengan({ mode: 'manekin' }) + svgTangan({ mode: 'manekin' });
  for (const g of GARIS) {
    s += `<ellipse cx="150" cy="${g.y}" rx="${g.rx}" ry="7" fill="none" stroke="#e3a62a" stroke-width="5"/>`;
    s += `<ellipse cx="150" cy="${g.y}" rx="${g.rx}" ry="7" fill="none" stroke="#774b00" stroke-width="1" stroke-dasharray="2 3"/>`;
    s += `<circle cx="${150 + g.rx + 26}" cy="${g.y}" r="11" fill="#1d3157"/><text x="${150 + g.rx + 26}" y="${g.y + 4.5}" font-size="13" font-weight="700" fill="#fff" text-anchor="middle">${g.no}</text>`;
    s += `<path d="M ${150 + g.rx + 2} ${g.y} L ${150 + g.rx + 15} ${g.y}" stroke="#1d3157" stroke-width="1.5"/>`;
  }
  s += '<path d="M 40 24 L 40 714" stroke="#1d3157" stroke-width="2"/><path d="M 32 24 L 48 24 M 32 714 L 48 714" stroke="#1d3157" stroke-width="2"/>';
  s += '<circle cx="40" cy="370" r="11" fill="#1d3157"/><text x="40" y="374.5" font-size="13" font-weight="700" fill="#fff" text-anchor="middle">4</text>';
  return (
    <svg
      viewBox="10 10 280 730"
      className={className}
      role="img"
      aria-label="Manekin dengan tanda tempat mengukur: 1 lingkar dada, 2 lingkar pinggang, 3 lingkar pinggul, 4 tinggi badan"
      dangerouslySetInnerHTML={{ __html: s }}
    />
  );
}
