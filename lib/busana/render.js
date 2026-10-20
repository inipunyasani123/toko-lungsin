// Perakit ilustrasi: menumpuk tubuh + garmen dalam urutan yang benar dan menghasilkan string SVG.
// Dipakai komponen React (lewat dangerouslySetInnerHTML), skrip og.jpg, dan uji visual.
import { svgTubuh, svgLengan, svgTangan, svgRambutDepan } from './tubuh.js';
import { svgGarmen, GARMEN } from './garmen.js';
import { svgDefs } from './kain.js';

const URUT_SLOT = { bawahan: 1, terusan: 2, atasan: 3, luaran: 4, aksesori: 5 };

// Gantungan jepit untuk bawahan: kait di atas, bilah dengan dua penjepit di ban pinggang.
function gantunganJepit() {
  return (
    '<path d="M 150 238 L 150 222 C 150 215 156 212 158.5 207 C 161 201.5 157.5 195 151 195 C 146 195 143 198.5 143 203" fill="none" stroke="#7d8290" stroke-width="2.4" stroke-linecap="round"/>' +
    '<path d="M 104 238 L 196 238 L 196 243 L 104 243 Z" fill="#6b7080"/><path d="M 104 238 L 196 238 L 196 239.6 L 104 239.6 Z" fill="#fff" fill-opacity=".35"/>' +
    '<path d="M 118 241 L 128 241 L 129 262 L 117 262 Z" fill="#8a8f9c"/><path d="M 172 241 L 182 241 L 183 262 L 171 262 Z" fill="#8a8f9c"/>'
  );
}

function gantungan() {
  // kait logam + bilah kayu (bilah tertutup kain, hanya kait yang terlihat di atas leher)
  return (
    '<path d="M 150 112 L 150 96 C 150 89 156 86 158.5 81 C 161 75.5 157.5 69 151 69 C 146 69 143 72.5 143 77" fill="none" stroke="#7d8290" stroke-width="2.4" stroke-linecap="round"/>' +
    '<path d="M 150 112 L 150 96 C 150 89 156 86 158.5 81 C 161 75.5 157.5 69 151 69 C 146 69 143 72.5 143 77" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width=".8" stroke-linecap="round"/>' +
    '<path d="M 143 106 L 157 106 L 158.5 116 L 141.5 116 Z" fill="url(#g-kayu)"/>'
  );
}

/**
 * @param {object} o
 * @param {'manekin'|'sosok'|'gantung'} o.mode
 * @param {{jenis:string,kain:string}[]} o.lapis  garmen yang dipakai
 * @param {{kulit?:string,rambut?:string,sepatu?:string}} [o.sosok]
 * @param {boolean} [o.alas]  bayangan lantai / tiang manekin
 * @param {boolean} [o.defs]  sertakan definisi pola di dalam SVG (untuk SVG mandiri, mis. og.jpg)
 */
export function svgBusana({ mode = 'manekin', lapis = [], sosok = {}, alas = true, defs = false } = {}) {
  const urut = [...lapis].filter((l) => GARMEN[l.jenis]).sort((a, b) => URUT_SLOT[GARMEN[a.jenis].slot] - URUT_SLOT[GARMEN[b.jenis].slot]);
  const gantung = mode === 'gantung';
  const g = urut.map((l) => svgGarmen(l.jenis, l.kain, { gantung, mode }));
  const berkerudung = urut.some((l) => l.jenis === 'kerudung');
  const t = { mode, kulit: sosok.kulit || 'sawo', rambut: berkerudung ? '' : sosok.rambut || 'pendek', sepatu: sosok.sepatu };
  let s = defs ? `<defs>${svgDefs()}</defs>` : '';
  if (gantung) {
    const bawahSaja = urut.length > 0 && urut.every((l) => GARMEN[l.jenis].slot === 'bawahan');
    if (!bawahSaja) s += gantungan();
    s += g.map((x) => x.belakang).join('') + g.map((x) => x.badan).join('') + g.map((x) => x.lengan).join('') + g.map((x) => x.depan).join('');
    if (bawahSaja) s += gantunganJepit();
    return s;
  }
  // tubuh tanpa alas dulu supaya garmen belakang bisa disisipkan di antara rambut belakang dan tubuh
  if (alas) s += svgTubuh({ ...t, hanyaAlas: true });
  s += g.map((x) => x.belakang).join('');
  s += svgTubuh({ ...t, alas: false });
  // Lengan dan tangan di belakang badan garmen: lengan tergantung sedikit di balik sisi baju yang longgar.
  s += svgLengan(t);
  s += svgTangan(t);
  // per garmen (dalam ke luar): badan lalu lengannya, supaya lengan baju dalam tertutup luaran
  s += g.map((x) => x.badan + x.lengan).join('');
  s += g.map((x) => x.depan).join('');
  s += svgRambutDepan(t);
  return s;
}
