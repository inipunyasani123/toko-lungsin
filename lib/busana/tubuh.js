// Tubuh dasar: manekin pajang (tanpa wajah) dan sosok ilustrasi untuk lookbook. Kanvas 300 × 760.
// Satu templat tubuh dipakai semua busana, jadi setiap garmen pas di manekin maupun sosok.
import { cermin, simetris } from './jalur.js';

// Titik acuan (dipakai garmen supaya pas di badan)
export const T = {
  leherAtas: 92,
  bahu: 124, // pangkal leher (HPS)
  ujungBahu: 140,
  ketiak: 182,
  dada: 194,
  pinggang: 262,
  panggul: 330,
  selangkang: 372,
  lutut: 528,
  betis: 600,
  mataKaki: 688,
  telapak: 712,
};

export const BADAN = simetris([
  ['M', 150, 96],
  ['L', 160, 96],
  ['C', 160.5, 106, 161, 114, 163, 120],
  ['C', 168, 124, 184, 127, 194, 131],
  ['C', 201, 134, 205, 141, 205, 150],
  ['C', 205, 160, 200, 170, 197, 182],
  ['C', 199, 198, 196, 220, 190, 238],
  ['C', 187, 248, 185, 256, 186, 264],
  ['C', 188, 286, 197, 304, 199, 326],
  ['C', 200, 342, 196, 356, 188, 364],
  ['C', 176, 374, 162, 377, 150, 377],
]);

// Kaki kanan (sisi kanan gambar); kaki kiri = cermin.
export const KAKI_KANAN =
  'M 150 352 L 196 340 C 199 380 194 430 188 470 C 185 492 184 512 185 528 C 186 548 184 572 182 600 C 180 630 177 660 175 688 L 160 690 C 158 662 156 634 155 604 C 154 578 153 552 154 528 C 155 500 153 470 152 440 C 151 410 150 380 150 352 Z';
export const KAKI_KIRI = cermin(KAKI_KANAN);

export const TELAPAK_KANAN = 'M 159.5 684 L 175.5 683 C 179 690 183 698 186 704 C 188 710 184 714 177 714 L 163 714 C 157 714 156 709 157 702 C 158 696 159 690 159.5 684 Z';
export const TELAPAK_KIRI = cermin(TELAPAK_KANAN);

// Lengan kanan: dari bulatan bahu turun ke pergelangan, menjauh sedikit dari badan.
export const LENGAN_KANAN =
  'M 193 137 C 202 136 208 142 210 152 C 214 174 217 210 220 246 C 222 262 225 280 228 298 C 231 318 233 338 234 358 L 219 360 C 217 340 214 320 211 302 C 209 288 207 274 205 260 C 202 236 201 212 198 190 C 196 172 190 152 193 137 Z';
export const LENGAN_KIRI = cermin(LENGAN_KANAN);

export const TANGAN_KANAN =
  'M 219 357 L 234 356 C 236.5 367 238 380 237.5 392 C 237 402 235.5 410 231.5 414.5 C 228 418 223 417 221 412 C 219 405 218 397 218 387 C 218 377 218.3 367 219 357 Z';
export const TANGAN_KIRI = cermin(TANGAN_KANAN);

export const KEPALA = 'M 150 24 C 168 24 179 39 179 60 C 179 80 168 99 150 101 C 132 99 121 80 121 60 C 121 39 132 24 150 24 Z';

// Garis sambungan manekin (leher, bahu, pergelangan, lutut): tipis, memberi kesan boneka pajang.
const SAMBUNGAN = [
  'M 140 108 C 146 111 154 111 160 108',
  'M 197 140 C 201 146 203 154 204 162',
  'M 103 140 C 99 146 97 154 96 162',
  'M 219 353 C 224 355 229 355 234 353',
  'M 81 353 C 76 355 71 355 66 353',
  'M 156 527 C 166 531 176 531 185 527',
  'M 144 527 C 134 531 124 531 115 527',
];

export const WARNA_KULIT = {
  sawo: '#9a6340',
  kuning: '#d9a980',
  langsat: '#e6bf98',
  gelap: '#6e4429',
};

// Rambut tampak depan: bagian belakang (di balik kepala) dan bagian depan (di atas kepala).
export const RAMBUT = {
  sanggul: {
    belakang: 'M 150 14 C 163 14 170 22 170 31 C 170 38 165 42 158 43 L 142 43 C 135 42 130 38 130 31 C 130 22 137 14 150 14 Z',
    depan: 'M 150 22 C 170 22 182 37 181 58 C 176 47 166 38 150 37 C 134 38 124 47 119 58 C 118 37 130 22 150 22 Z',
  },
  pendek: {
    belakang: '',
    depan: 'M 150 20 C 171 20 183 36 181 58 L 178 66 C 177 52 170 42 158 40 C 150 44 138 46 124 54 L 121 64 C 117 38 130 20 150 20 Z',
  },
  bob: {
    belakang: 'M 150 22 C 174 22 186 40 185 66 C 185 82 182 94 176 102 L 124 102 C 118 94 115 82 115 66 C 114 40 126 22 150 22 Z',
    depan: 'M 150 21 C 172 21 184 37 183 60 C 180 50 172 41 160 39 C 154 46 140 50 122 54 C 120 37 131 21 150 21 Z',
  },
  ikat: {
    belakang: 'M 176 44 C 184 50 188 62 187 76 C 186 88 182 96 178 102 C 176 90 177 74 172 60 Z',
    depan: 'M 150 21 C 171 21 183 36 181 58 C 177 47 167 39 151 39 C 136 39 125 46 120 57 C 118 36 130 21 150 21 Z',
  },
};

export function svgTubuh({ mode = 'manekin', kulit = 'sawo', rambut = 'pendek', sepatu = '#2b2a2d', alas = true, hanyaAlas = false, tanpaKepala = false } = {}) {
  const manekin = mode === 'manekin';
  const isi = manekin ? 'url(#g-manekin)' : WARNA_KULIT[kulit] || kulit;
  const garisTepi = '';
  let s = '';
  if (alas) {
    s += '<ellipse cx="150" cy="716" rx="62" ry="9" fill="url(#g-lantai)"/>';
    if (manekin) {
      s += '<ellipse cx="150" cy="722" rx="46" ry="6.5" fill="#2b2f38"/><ellipse cx="150" cy="720.5" rx="46" ry="5.5" fill="#434854"/>';
      s += '<rect x="148.6" y="560" width="2.8" height="160" fill="#555a66"/>';
    }
  }
  if (hanyaAlas) return s;
  const rb = RAMBUT[rambut];
  if (!manekin && rb?.belakang && !tanpaKepala) s += `<path d="${rb.belakang}" fill="#1c1714"/>`;
  s += `<path d="${KAKI_KANAN}" fill="${isi}" ${garisTepi}/><path d="${KAKI_KIRI}" fill="${isi}" ${garisTepi}/>`;
  s += `<path d="${BADAN}" fill="${isi}" ${garisTepi}/>`;
  if (!tanpaKepala) s += `<path d="${KEPALA}" fill="${isi}" ${garisTepi}/>`;
  if (manekin) {
    s += `<path d="${TELAPAK_KANAN}" fill="${isi}" ${garisTepi}/><path d="${TELAPAK_KIRI}" fill="${isi}" ${garisTepi}/>`;
  } else {
    s += `<path d="${TELAPAK_KANAN}" fill="${sepatu}"/><path d="${TELAPAK_KIRI}" fill="${sepatu}"/>`;
    // bayangan halus di bawah dagu
    if (!tanpaKepala) s += '<path d="M 138 100 C 145 104 155 104 162 100 L 161 108 C 154 111 146 111 139 108 Z" fill="#000" fill-opacity=".12"/>';
  }
  return s;
}

export function svgLengan({ mode = 'manekin', kulit = 'sawo' } = {}) {
  const manekin = mode === 'manekin';
  const isi = manekin ? 'url(#g-manekin)' : WARNA_KULIT[kulit] || kulit;
  const garisTepi = '';
  return `<path d="${LENGAN_KANAN}" fill="${isi}" ${garisTepi}/><path d="${LENGAN_KIRI}" fill="${isi}" ${garisTepi}/>`;
}

export function svgTangan({ mode = 'manekin', kulit = 'sawo' } = {}) {
  const manekin = mode === 'manekin';
  const isi = manekin ? 'url(#g-manekin)' : WARNA_KULIT[kulit] || kulit;
  const garisTepi = '';
  let s = `<path d="${TANGAN_KANAN}" fill="${isi}" ${garisTepi}/><path d="${TANGAN_KIRI}" fill="${isi}" ${garisTepi}/>`;
  if (manekin) s += SAMBUNGAN.map((d) => `<path d="${d}" fill="none" stroke="#9d917d" stroke-width=".7" stroke-linecap="round"/>`).join('');
  return s;
}

export function svgRambutDepan({ mode, rambut }) {
  if (mode === 'manekin') return '';
  const rb = RAMBUT[rambut];
  return rb?.depan ? `<path d="${rb.depan}" fill="#211b17"/>` : '';
}
