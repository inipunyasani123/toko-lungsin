// Meteran jahit sebagai grafik: ukuran baju tiap size dibandingkan dengan ukuran badan dan rentang kelonggaran yang pas.
// rinci = [{ ukuran, ukur, zona }], badan = cm, target = [min, maks] kelonggaran, pilih = ukuran yang disarankan.
export default function PitaUkur({ rinci, badan, target, pilih, nama = 'dada', className = '', W = 640 }) {
  const nilai = rinci.map((r) => r.ukur);
  const awal = Math.floor((Math.min(badan, ...nilai) - 6) / 5) * 5;
  const akhir = Math.ceil((Math.max(badan + target[1], ...nilai) + 6) / 5) * 5;
  const kiri = 14;
  const kanan = W - 14;
  const x = (cm) => kiri + ((cm - awal) / (akhir - awal)) * (kanan - kiri);
  const tick = [];
  for (let c = awal; c <= akhir; c++) {
    const besar = c % 10 === 0;
    const sedang = c % 5 === 0;
    tick.push(
      <line key={c} x1={x(c)} x2={x(c)} y1={86} y2={86 + (besar ? 15 : sedang ? 10 : 5)} stroke="#141b2d" strokeOpacity={besar ? 0.85 : 0.55} strokeWidth={besar ? 1.4 : 1} />,
    );
    if (besar) tick.push(<text key={`t${c}`} x={x(c) + 3} y={118} fontSize="12" fontWeight="600" fill="#141b2d">{c}</text>);
  }
  const ringkas = `Lingkar ${nama} badan ${badan} cm. ${rinci.map((r) => `${r.ukuran}: ${r.ukur} cm`).join(', ')}. Rentang pas ${badan + target[0]}–${badan + target[1]} cm.${pilih ? ` Disarankan ${pilih}.` : ''}`;
  return (
    <svg viewBox={`0 0 ${W} 132`} className={className} role="img" aria-label={ringkas}>
      {/* rentang pas */}
      <rect x={x(badan + target[0])} y={22} width={Math.max(2, x(badan + target[1]) - x(badan + target[0]))} height={62} rx="4" fill="#3e5a2d" fillOpacity=".14" />
      <text x={x(badan + target[0]) + 5} y={34} fontSize="11.5" fontWeight="600" fill="#2f4722">rentang pas</text>
      {/* pita */}
      <rect x={kiri - 8} y={84} width={kanan - kiri + 16} height={40} rx="3" fill="#e3a62a" />
      {tick}
      {/* badan */}
      <line x1={x(badan)} x2={x(badan)} y1={14} y2={124} stroke="#a2322a" strokeWidth="2.4" />
      <text x={x(badan)} y={10} fontSize="12" fontWeight="700" fill="#a2322a" textAnchor={x(badan) < 80 ? 'start' : 'middle'}>
        badanmu {badan}
      </text>
      {/* ukuran baju */}
      {rinci.map((r, i) => {
        const dipilih = r.ukuran === pilih;
        const y = 46 + (i % 2) * 16;
        return (
          <g key={r.ukuran}>
            <line x1={x(r.ukur)} x2={x(r.ukur)} y1={y + 9} y2={86} stroke="#1d3157" strokeWidth={dipilih ? 2.2 : 1.2} strokeOpacity={dipilih ? 1 : 0.55} />
            <rect x={x(r.ukur) - 17} y={y - 9} width="34" height="18" rx="9" fill={dipilih ? '#1d3157' : '#fffdf8'} stroke="#1d3157" strokeWidth="1.3" />
            <text x={x(r.ukur)} y={y + 4.2} fontSize="11.5" fontWeight="700" textAnchor="middle" fill={dipilih ? '#fff' : '#1d3157'}>
              {r.ukuran}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
