// Tanda Lungsin: anyaman 3 × 3, benang lungsin nila menyilang benang pakan kunyit (atas-bawah bergantian).
export function TandaAnyam({ className = '', terang = false }) {
  const lungsin = terang ? '#f4efe3' : '#1d3157';
  const pakan = '#e3a62a';
  const sela = terang ? '#111b31' : '#f7f5ef';
  const pos = [3, 12, 21];
  let atas = '';
  // pada silang (i, j) yang genap, pakan di atas
  pos.forEach((x, i) =>
    pos.forEach((y, j) => {
      if ((i + j) % 2 === 0) atas += `<rect x="${x - 0.6}" y="${y}" width="7.2" height="6" fill="${pakan}" stroke="${sela}" stroke-width="1.1"/>`;
    }),
  );
  const isi =
    pos.map((y) => `<rect x="0.5" y="${y}" width="29" height="6" rx="1" fill="${pakan}"/>`).join('') +
    pos.map((x) => `<rect x="${x}" y="0.5" width="6" height="29" rx="1" fill="${lungsin}" stroke="${sela}" stroke-width="1.1"/>`).join('') +
    atas;
  return <svg viewBox="0 0 30 30" className={className} aria-hidden="true" focusable="false" dangerouslySetInnerHTML={{ __html: isi }} />;
}

export default function Logo({ className = '', terang = false, ukuran = 'sedang' }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <TandaAnyam terang={terang} className={ukuran === 'besar' ? 'h-11 w-11' : 'h-8 w-8 sm:h-9 sm:w-9'} />
      <span className={`font-display leading-none tracking-[-0.02em] ${ukuran === 'besar' ? 'text-[2.4rem]' : 'text-[1.45rem] sm:text-[1.6rem]'}`}>Lungsin</span>
    </span>
  );
}
