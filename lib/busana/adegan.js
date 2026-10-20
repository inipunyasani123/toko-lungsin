// Latar adegan lookbook (kanvas 600 × 760). Sosok 300 × 760 ditempatkan di tengah (geser 150).
// Gaya datar dan teduh supaya busana tetap jadi pusat perhatian.

const lantai = (warna, garis) =>
  `<rect x="0" y="690" width="600" height="70" fill="${warna}"/><rect x="0" y="690" width="600" height="3" fill="${garis}" fill-opacity=".6"/>`;

const tanaman = (x, y, s = 1, daun = '#4f6a3c', pot = '#b4532f') => {
  let d = '';
  const helai = [
    [-34, -120, -6], [-18, -150, 4], [6, -168, 10], [26, -140, 18], [40, -104, 22], [-44, -86, -12], [14, -110, 12],
  ];
  for (const [dx, dy, r] of helai) {
    d += `<path d="M ${x} ${y - 40 * s} Q ${x + (dx / 2) * s} ${y + (dy / 2) * s - 20 * s} ${x + dx * s} ${y + dy * s}" fill="none" stroke="${daun}" stroke-width="${3 * s}" stroke-linecap="round"/>`;
    d += `<ellipse cx="${x + dx * s}" cy="${y + dy * s}" rx="${9 * s}" ry="${20 * s}" transform="rotate(${r * 3} ${x + dx * s} ${y + dy * s})" fill="${daun}"/>`;
  }
  d += `<path d="M ${x - 30 * s} ${y - 44 * s} L ${x + 30 * s} ${y - 44 * s} L ${x + 22 * s} ${y} L ${x - 22 * s} ${y} Z" fill="${pot}"/>`;
  d += `<rect x="${x - 33 * s}" y="${y - 50 * s}" width="${66 * s}" height="${9 * s}" rx="${2 * s}" fill="${pot}"/><rect x="${x - 33 * s}" y="${y - 50 * s}" width="${66 * s}" height="${9 * s}" rx="${2 * s}" fill="#000" fill-opacity=".12"/>`;
  return d;
};

const LATAR = {
  // Ruang rapat: jendela besar berkusen dan tanaman di pot
  jendela: () =>
    `<rect width="600" height="760" fill="#dfe5ef"/>` +
    `<linearGradient id="a-langit" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bcd0e6"/><stop offset="1" stop-color="#eef2f6"/></linearGradient>` +
    `<rect x="36" y="70" width="200" height="420" fill="url(#a-langit)"/>` +
    `<path d="M 60 420 L 110 330 L 150 380 L 190 300 L 236 360 L 236 490 L 36 490 L 36 440 Z" fill="#a9bdd3"/>` +
    `<rect x="36" y="70" width="200" height="420" fill="none" stroke="#f7f5ef" stroke-width="10"/>` +
    `<rect x="131" y="70" width="10" height="420" fill="#f7f5ef"/><rect x="36" y="260" width="200" height="8" fill="#f7f5ef"/>` +
    `<rect x="26" y="488" width="220" height="12" fill="#c9d3e1"/>` +
    lantai('#c7cfdb', '#9aa6b8') +
    tanaman(510, 690, 1.05),
  // Pasar pagi: tenda bergaris lurik dan peti buah
  pasar: () =>
    `<rect width="600" height="760" fill="#f1e2c9"/>` +
    `<rect x="0" y="0" width="600" height="96" fill="#e9d6b5"/>` +
    Array.from({ length: 12 }, (_, i) => `<path d="M ${i * 50} 40 L ${i * 50 + 50} 40 L ${i * 50 + 50} 112 Q ${i * 50 + 25} 128 ${i * 50} 112 Z" fill="${i % 2 ? '#f6ecd9' : '#b4532f'}"/>`).join('') +
    `<rect x="0" y="34" width="600" height="8" fill="#6f4326"/>` +
    `<rect x="40" y="540" width="120" height="150" fill="#c99a63"/><rect x="40" y="540" width="120" height="150" fill="none" stroke="#9c6d3c" stroke-width="4"/><path d="M 40 590 L 160 590 M 40 640 L 160 640" stroke="#9c6d3c" stroke-width="3"/>` +
    Array.from({ length: 7 }, (_, i) => `<circle cx="${56 + i * 15}" cy="${532 - (i % 2) * 8}" r="11" fill="${i % 3 === 0 ? '#e3a62a' : i % 3 === 1 ? '#d46a3a' : '#7d9a4a'}"/>`).join('') +
    `<rect x="456" y="580" width="110" height="110" fill="#c99a63"/><rect x="456" y="580" width="110" height="110" fill="none" stroke="#9c6d3c" stroke-width="4"/>` +
    Array.from({ length: 6 }, (_, i) => `<ellipse cx="${472 + i * 16}" cy="${572 - (i % 2) * 6}" rx="10" ry="13" fill="#5f7d3a"/>`).join('') +
    lantai('#d8c4a3', '#b49c78'),
  // Teras kondangan: tiang kayu, lampu gantung, dan pot bunga
  teras: () =>
    `<rect width="600" height="760" fill="#e9dfd3"/>` +
    `<rect x="40" y="0" width="34" height="690" fill="#8a5a36"/><rect x="40" y="0" width="10" height="690" fill="#fff" fill-opacity=".12"/>` +
    `<rect x="526" y="0" width="34" height="690" fill="#8a5a36"/><rect x="526" y="0" width="10" height="690" fill="#fff" fill-opacity=".12"/>` +
    `<rect x="0" y="40" width="600" height="22" fill="#7a4e2e"/>` +
    `<path d="M 300 62 L 300 120" stroke="#3b3f4a" stroke-width="2"/><path d="M 278 120 L 322 120 L 312 150 L 288 150 Z" fill="#e3a62a"/><ellipse cx="300" cy="158" rx="40" ry="10" fill="#fff6d8" fill-opacity=".6"/>` +
    lantai('#cdbba8', '#a9937c') +
    tanaman(120, 690, 0.8, '#5c7a41', '#6f4326') +
    tanaman(474, 690, 0.8, '#5c7a41', '#6f4326'),
  // Gerbong kereta: deretan jendela membulat dan sandaran kursi
  kereta: () =>
    `<rect width="600" height="760" fill="#dfe3dc"/>` +
    `<rect x="0" y="0" width="600" height="60" fill="#c9cfc6"/>` +
    [30, 230, 430]
      .map(
        (x) =>
          `<rect x="${x}" y="110" width="140" height="190" rx="26" fill="#b9cbd6"/><path d="M ${x} 250 L ${x + 50} 205 L ${x + 90} 235 L ${x + 140} 190 L ${x + 140} 274 Q ${x + 140} 300 ${x + 114} 300 L ${x + 26} 300 Q ${x} 300 ${x} 274 Z" fill="#8fae7e"/><rect x="${x}" y="110" width="140" height="190" rx="26" fill="none" stroke="#f3f1ea" stroke-width="9"/>`,
      )
      .join('') +
    `<rect x="0" y="320" width="600" height="14" fill="#b7bdb3"/>` +
    `<rect x="12" y="430" width="120" height="260" rx="14" fill="#2b4472"/><rect x="12" y="430" width="120" height="26" rx="10" fill="#3d5a8f"/>` +
    `<rect x="468" y="430" width="120" height="260" rx="14" fill="#2b4472"/><rect x="468" y="430" width="120" height="26" rx="10" fill="#3d5a8f"/>` +
    lantai('#a9ad9f', '#868a7d'),
  // Kedai kopi: lampu gantung, rak, dan meja kecil
  kedai: () =>
    `<rect width="600" height="760" fill="#efe0d6"/>` +
    `<rect x="30" y="150" width="160" height="10" fill="#8a5a36"/><rect x="30" y="250" width="160" height="10" fill="#8a5a36"/>` +
    `<rect x="44" y="112" width="26" height="38" rx="3" fill="#e9dfcc"/><rect x="80" y="122" width="30" height="28" rx="3" fill="#b4532f"/><rect x="120" y="106" width="22" height="44" rx="3" fill="#33363d"/><rect x="150" y="118" width="28" height="32" rx="3" fill="#e3a62a"/>` +
    `<rect x="50" y="212" width="36" height="38" rx="4" fill="#1d3157"/><rect x="96" y="220" width="30" height="30" rx="4" fill="#e9dfcc"/><rect x="136" y="210" width="40" height="40" rx="4" fill="#6f4326"/>` +
    [380, 470]
      .map((x) => `<path d="M ${x} 0 L ${x} 110" stroke="#3b3f4a" stroke-width="2"/><path d="M ${x - 24} 110 L ${x + 24} 110 L ${x + 16} 140 L ${x - 16} 140 Z" fill="#1d3157"/><ellipse cx="${x}" cy="146" rx="26" ry="7" fill="#fff6d8" fill-opacity=".7"/>`)
      .join('') +
    `<rect x="440" y="560" width="130" height="12" rx="3" fill="#6f4326"/><rect x="498" y="572" width="14" height="118" fill="#4b2c18"/><path d="M 470 690 L 540 690 L 530 680 L 480 680 Z" fill="#4b2c18"/>` +
    `<path d="M 470 538 L 494 538 L 492 560 L 472 560 Z" fill="#f7f5ef"/><path d="M 494 544 Q 502 548 494 554" fill="none" stroke="#f7f5ef" stroke-width="3"/>` +
    lantai('#d3bfb1', '#ae9888'),
};

export function svgLatar(nama) {
  return (LATAR[nama] || LATAR.jendela)();
}
