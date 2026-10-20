// Alat bantu jalur SVG untuk ilustrasi busana. Kanvas sosok 300 × 760, sumbu tengah x = 150.
// Jalur hanya memakai perintah absolut M L C Q Z supaya bisa dicerminkan dengan aman.

export const TENGAH = 150;

// Cerminkan jalur terhadap sumbu tengah (kanan ↔ kiri).
export function cermin(d, sumbu = TENGAH) {
  const token = d.match(/[MLCQZ]|-?\d*\.?\d+/g) || [];
  let out = '';
  let perintah = '';
  let k = 0;
  for (const t of token) {
    if (/[MLCQZ]/.test(t)) {
      perintah = t;
      k = 0;
      out += ` ${t}`;
      continue;
    }
    const n = Number(t);
    // Angka genap (x) dicerminkan, angka ganjil (y) tetap.
    const v = k % 2 === 0 ? 2 * sumbu - n : n;
    out += `${k % 2 === 0 ? ' ' : ','}${Math.round(v * 100) / 100}`;
    k++;
  }
  return out.trim().replace(/^ /, '');
}

// Jalur tertutup dari separuh kanan (dimulai dan diakhiri di sumbu tengah): kanan + cermin terbalik.
// `kanan` adalah daftar segmen setelah titik awal: [['M', x, y], ['C', x1,y1,x2,y2,x,y], ['L', x, y], ...]
export function simetris(kanan) {
  const titik = []; // daftar titik akhir tiap segmen + kontrolnya
  let d = '';
  for (const seg of kanan) d += `${seg[0]} ${seg.slice(1).join(' ')} `;
  // Separuh kiri: telusuri segmen dari belakang, cerminkan, dan balik urutan titik kontrol.
  const segs = kanan.map((s) => ({ c: s[0], v: s.slice(1) }));
  let kiri = '';
  for (let i = segs.length - 1; i > 0; i--) {
    const s = segs[i];
    const awal = ujung(segs[i - 1]); // titik awal segmen ini = ujung segmen sebelumnya
    const m = (x) => 2 * TENGAH - x;
    if (s.c === 'L') kiri += `L ${m(awal[0])} ${awal[1]} `;
    else if (s.c === 'C') {
      const [x1, y1, x2, y2] = s.v;
      kiri += `C ${m(x2)} ${y2} ${m(x1)} ${y1} ${m(awal[0])} ${awal[1]} `;
    } else if (s.c === 'Q') {
      const [x1, y1] = s.v;
      kiri += `Q ${m(x1)} ${y1} ${m(awal[0])} ${awal[1]} `;
    }
  }
  void titik;
  return `${d}${kiri}Z`.replace(/\s+/g, ' ').trim();
}

function ujung(s) {
  const v = s.v;
  return [v[v.length - 2], v[v.length - 1]];
}

export const r1 = (n) => Math.round(n * 10) / 10;
