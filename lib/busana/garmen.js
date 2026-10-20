// Pustaka garmen tampak depan untuk templat tubuh 300 × 760 (lihat tubuh.js).
// Tiap garmen mengembalikan lapisan SVG: belakang (di balik tubuh), badan, lengan (di atas lengan tubuh), depan.
// Garmen yang sama dipakai di manekin, sosok lookbook, dan gantungan, jadi warnanya selalu ikut kain yang dipilih.
import { cermin, simetris } from './jalur.js';
import { idPola, cariKain } from './kain.js';

const TINTA = '#0d1426';

function isi(kainId, arah = '') {
  return `url(#${idPola(kainId, arah)})`;
}

// Satu potong kain: isi pola, bayangan, dan garis tepi tipis.
export function potong(d, kainId, { arah = '', bayang = 'sisi', tepi = 0.28, kilau = false, gelap = 0 } = {}) {
  let s = `<path d="${d}" fill="${isi(kainId, arah)}"/>`;
  if (gelap) s += `<path d="${d}" fill="${TINTA}" fill-opacity="${gelap}"/>`;
  if (bayang) s += `<path d="${d}" fill="url(#g-${bayang})"/>`;
  if (kilau) s += `<path d="${d}" fill="url(#g-kilau)"/>`;
  if (tepi) s += `<path d="${d}" fill="none" stroke="${TINTA}" stroke-opacity="${tepi}" stroke-width=".8" stroke-linejoin="round"/>`;
  return s;
}

// Garis lipatan dan jahitan
const lipat = (d, o = 0.16, w = 1.1) => `<path d="${d}" fill="none" stroke="${TINTA}" stroke-opacity="${o}" stroke-width="${w}" stroke-linecap="round"/>`;
const terang = (d, o = 0.12, w = 1.4) => `<path d="${d}" fill="none" stroke="#fff" stroke-opacity="${o}" stroke-width="${w}" stroke-linecap="round"/>`;
const jahit = (d, o = 0.42) => `<path d="${d}" fill="none" stroke="${TINTA}" stroke-opacity="${o}" stroke-width=".55" stroke-dasharray="1.8 1.4" stroke-linecap="round"/>`;

// Kancing batok kelapa (warna cokelat tua) supaya terlihat di kain gelap maupun terang
function kancing(x, y, r = 2.5) {
  return (
    `<circle cx="${x}" cy="${y}" r="${r}" fill="#5a3b25"/><circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#f3e9d6" stroke-opacity=".55" stroke-width=".5"/>` +
    `<circle cx="${x - 0.7}" cy="${y - 0.6}" r=".45" fill="#f3e9d6" fill-opacity=".7"/><circle cx="${x + 0.7}" cy="${y + 0.6}" r=".45" fill="#f3e9d6" fill-opacity=".7"/>`
  );
}

const kanan = (d) => [d, cermin(d)];

// Bagian dalam garmen yang terlihat dari bukaan leher saat tergantung (tanpa tubuh)
function dalamLeher(kainId, d) {
  return potong(d, kainId, { bayang: 'turun', tepi: 0.2, gelap: 0.38 });
}

// ---------------------------------------------------------------------------------------------
// KEMEJA TERAS: kemeja kotak lengan pendek, kerah rebah (kerah piyama), saku dada, belahan samping.
function kemejaTeras(k, { gantung }) {
  const badan = simetris([
    ['M', 150, 184],
    ['L', 157, 136],
    ['C', 158, 128, 159, 122, 162, 118],
    ['C', 176, 122, 194, 128, 208, 136],
    ['C', 210, 150, 211, 170, 211, 196],
    ['C', 211, 250, 210, 310, 209, 346],
    ['C', 196, 351, 172, 354, 150, 354],
  ]);
  const [lenganKa, lenganKi] = kanan(
    'M 206 135 C 215 137 222 146 225 160 C 228 184 232 210 236 236 C 226 242 214 245 203 246 C 205 230 208 214 210 197 C 210 176 208 152 206 135 Z',
  );
  const [mansetKa, mansetKi] = kanan('M 203 246 C 214 245 226 242 236 236 L 237 242 C 227 248 214 251 202.5 252 Z');
  const [kerahKa, kerahKi] = kanan(
    'M 150 186 L 168 150 L 181 162 C 184 150 186 140 186 133 C 180 126 172 121 164 116 C 161 114 159 112 158 110 C 157 116 156 124 156 134 C 155 152 152 170 150 186 Z',
  );
  let belakang = '';
  if (gantung) belakang += dalamLeher(k, 'M 141 108 L 159 108 C 163 130 158 160 150 186 C 142 160 137 130 141 108 Z');
  belakang += potong('M 139 104 L 161 104 L 163 115 C 156 117 144 117 137 115 Z', k, { arah: 'h', bayang: 'turun', tepi: 0.3 });

  let s = potong(badan, k, { bayang: 'sisi', kilau: true });
  // Belahan kancing: tepi panel kanan menumpang di kiri
  s += lipat('M 152.6 186 L 152.6 353', 0.34, 0.8) + jahit('M 155.6 190 L 155.6 352', 0.38);
  for (const y of [204, 230, 256, 282, 308, 334]) s += kancing(150.2, y);
  // Saku dada (kain mendatar)
  const saku = 'M 166 204 L 188 203 L 188.5 226 C 188.5 229 186.5 231 183.5 231 L 170.5 231.5 C 167.6 231.5 166 229.6 166 227 Z';
  s += potong(saku, k, { arah: 'h', bayang: 'turun', tepi: 0.32 }) + jahit('M 166.8 207 L 187.6 206.2', 0.4);
  // Belahan samping & lipatan lembut
  s += lipat('M 209 334 L 205.5 346', 0.3, 0.8) + lipat('M 91 334 L 94.5 346', 0.3, 0.8);
  s += lipat('M 196 200 C 194 230 196 270 199 300', 0.1, 1.6) + lipat('M 104 200 C 106 230 104 270 101 300', 0.1, 1.6);
  s += lipat('M 170 280 C 172 300 171 324 168 348', 0.08, 1.4) + lipat('M 130 280 C 128 300 129 324 132 348', 0.08, 1.4);
  s += jahit('M 104 349 C 120 351.5 136 352.6 150 352.6 C 164 352.6 180 351.5 196 349', 0.32);

  let kerah = potong(kerahKa, k, { arah: 'kka', bayang: 'turun', tepi: 0.4 }) + potong(kerahKi, k, { arah: 'kki', bayang: 'turun', tepi: 0.4 });
  kerah += lipat('M 168 150 L 181 162', 0.35, 0.7) + lipat('M 132 150 L 119 162', 0.35, 0.7);
  // bayangan di bawah kerah
  kerah = lipat('M 169 164 C 174 170 178 172 182 168', 0.16, 2.2) + lipat('M 131 164 C 126 170 122 172 118 168', 0.16, 2.2) + kerah;

  let lengan = potong(lenganKa, k, { arah: 'ka', bayang: 'sisi' }) + potong(lenganKi, k, { arah: 'ki', bayang: 'sisi' });
  lengan += potong(mansetKa, k, { arah: 'kka', bayang: 'turun', tepi: 0.3 }) + potong(mansetKi, k, { arah: 'kki', bayang: 'turun', tepi: 0.3 });
  lengan += lipat('M 212 160 C 216 180 220 205 224 228', 0.12, 1.4) + lipat('M 88 160 C 84 180 80 205 76 228', 0.12, 1.4);
  return { belakang, badan: s + kerah, lengan };
}


// ---------------------------------------------------------------------------------------------
// KEMEJA LAJUR PANJANG: potongan reguler, kerah runcing berdiri, lengan panjang bermanset, ujung melengkung.
function kemejaPanjang(k, { gantung }) {
  const badan = simetris([
    ['M', 150, 116],
    ['L', 161, 113],
    ['C', 174, 120, 190, 128, 203, 136],
    ['C', 206, 150, 205, 172, 202, 196],
    ['C', 203, 226, 199, 246, 198, 266],
    ['C', 198, 290, 201, 316, 201, 346],
    ['C', 196, 356, 176, 365, 150, 368],
  ]);
  const [lenganKa, lenganKi] = kanan(
    'M 202 135 C 210 138 214 146 216 158 C 220 192 225 232 229 270 C 232 296 235 322 238 348 L 216.5 352 C 214 330 210.5 306 207 284 C 203.5 258 201 230 199.5 198 C 201 176 203 154 202 135 Z',
  );
  const [mansetKa, mansetKi] = kanan('M 218 350 L 238 346 L 239.5 362 L 219.5 365.5 Z');
  const [kerahKa, kerahKi] = kanan('M 150 118 C 154 117 158 114 160.5 110 C 163 113 166 118 168.5 124 L 159 139 C 157 131 154 124 150 120 Z');
  let belakang = '';
  if (gantung) belakang += dalamLeher(k, 'M 141 106 L 159 106 L 160 118 L 140 118 Z');
  // kerah berdiri (pita leher)
  const tegak = 'M 138.5 104 C 146 106.5 154 106.5 161.5 104 L 162 114 C 155 117 145 117 138 114 Z';
  let s = potong(badan, k, { bayang: 'sisi', kilau: true });
  s += lipat('M 152.6 120 L 152.6 366', 0.34, 0.8) + jahit('M 155.6 124 L 155.6 364', 0.38);
  for (const y of [146, 174, 202, 230, 258, 286, 314, 342]) s += kancing(150.2, y, 2.3);
  s += lipat('M 189 200 C 188 230 190 262 193 296', 0.1, 1.5) + lipat('M 111 200 C 112 230 110 262 107 296', 0.1, 1.5);
  s += lipat('M 176 270 C 178 300 177 330 174 360', 0.08, 1.4) + lipat('M 124 270 C 122 300 123 330 126 360', 0.08, 1.4);
  s += jahit('M 104 348 C 112 356 130 362 150 364.5 C 170 362 188 356 196 348', 0.32);
  let kerah = potong(tegak, k, { arah: 'h', bayang: 'turun', tepi: 0.4 });
  kerah += potong(kerahKa, k, { arah: 'kka', bayang: 'turun', tepi: 0.42 }) + potong(kerahKi, k, { arah: 'kki', bayang: 'turun', tepi: 0.42 });
  kerah += kancing(150.2, 116, 2);
  kerah = lipat('M 159 141 C 163 139 166 134 168 127', 0.18, 2) + lipat('M 141 141 C 137 139 134 134 132 127', 0.18, 2) + kerah;
  let lengan = potong(lenganKa, k, { arah: 'ka', bayang: 'sisi' }) + potong(lenganKi, k, { arah: 'ki', bayang: 'sisi' });
  lengan += lipat('M 212 220 C 216 240 219 258 221 276', 0.13, 1.4) + lipat('M 88 220 C 84 240 81 258 79 276', 0.13, 1.4);
  lengan += lipat('M 216 300 C 220 310 224 318 228 322', 0.11, 1.3) + lipat('M 84 300 C 80 310 76 318 72 322', 0.11, 1.3);
  lengan += potong(mansetKa, k, { arah: 'h', bayang: 'turun', tepi: 0.4 }) + potong(mansetKi, k, { arah: 'h', bayang: 'turun', tepi: 0.4 });
  lengan += kancing(229, 357, 1.7) + kancing(71, 357, 1.7);
  return { belakang, badan: s + kerah, lengan };
}

// ---------------------------------------------------------------------------------------------
// BLUS SHANGHAI: kerah shanghai (berdiri), kancing tali di belahan dada, lengan tiga perempat, belahan samping.
function blusShanghai(k, { gantung }) {
  const badan = simetris([
    ['M', 150, 117],
    ['L', 160, 114],
    ['C', 172, 120, 188, 127, 201, 135],
    ['C', 205, 150, 205, 172, 202, 192],
    ['C', 204, 230, 206, 280, 209, 336],
    ['C', 194, 342, 172, 345, 150, 345],
  ]);
  const [lenganKa, lenganKi] = kanan(
    'M 200 134 C 209 137 214 146 216 158 C 220 192 225 236 230 290 C 222 296 212 299 204 300 C 205 270 204 238 201 196 C 202 172 202 152 200 134 Z',
  );
  const [ujungKa, ujungKi] = kanan('M 204 300 C 212 299 222 296 230 290 L 231.5 297 C 223 303 213 306 204 307 Z');
  const tegak = 'M 139 103 C 146 105.5 154 105.5 161 103 L 162 116 C 156 119.5 144 119.5 138 116 Z';
  let belakang = '';
  if (gantung) belakang += dalamLeher(k, 'M 141 106 L 159 106 L 160 118 L 140 118 Z');
  let s = potong(badan, k, { bayang: 'sisi', kilau: true });
  // belahan dada sampai di atas pinggang
  s += lipat('M 150 118 L 150 212', 0.34, 0.8) + jahit('M 146.8 120 L 146.8 210 C 148 214 152 214 153.2 210 L 153.2 120', 0.36);
  for (const y of [134, 156, 178, 200]) s += `<path d="M 144.5 ${y} L 155.5 ${y}" stroke="#2a1d14" stroke-opacity=".75" stroke-width="1.6" stroke-linecap="round"/><circle cx="144" cy="${y}" r="1.9" fill="#3a2a1d"/>`;
  s += lipat('M 209 318 L 206 341', 0.3, 0.8) + lipat('M 91 318 L 94 341', 0.3, 0.8);
  s += lipat('M 190 210 C 192 240 195 280 198 320', 0.1, 1.6) + lipat('M 110 210 C 108 240 105 280 102 320', 0.1, 1.6);
  s += lipat('M 168 250 C 170 280 171 310 170 340', 0.07, 1.4) + lipat('M 132 250 C 130 280 129 310 130 340', 0.07, 1.4);
  s += jahit('M 98 339 C 120 342.5 136 343.2 150 343.2 C 164 343.2 180 342.5 202 339', 0.32);
  const kerah = potong(tegak, k, { arah: 'h', bayang: 'turun', tepi: 0.42 }) + jahit('M 139.6 112.5 C 146 115.6 154 115.6 160.4 112.5', 0.35);
  let lengan = potong(lenganKa, k, { arah: 'ka', bayang: 'sisi' }) + potong(lenganKi, k, { arah: 'ki', bayang: 'sisi' });
  lengan += potong(ujungKa, k, { arah: 'kka', bayang: 'turun', tepi: 0.32 }) + potong(ujungKi, k, { arah: 'kki', bayang: 'turun', tepi: 0.32 });
  lengan += lipat('M 211 200 C 215 226 219 252 222 280', 0.13, 1.4) + lipat('M 89 200 C 85 226 81 252 78 280', 0.13, 1.4);
  return { belakang, badan: s + kerah, lengan };
}

// ---------------------------------------------------------------------------------------------
// TUNIK KEBUN: panjang selutut, kerah shanghai, lengan panjang longgar, belahan samping tinggi, saku samping.
function tunikKebun(k, { gantung }) {
  const badan = simetris([
    ['M', 150, 117],
    ['L', 160, 114],
    ['C', 173, 121, 189, 128, 203, 136],
    ['C', 207, 150, 207, 172, 204, 194],
    ['C', 207, 260, 212, 330, 214, 380],
    ['C', 217, 430, 220, 476, 222, 512],
    ['C', 200, 518, 176, 520, 150, 520],
  ]);
  const [lenganKa, lenganKi] = kanan(
    'M 202 135 C 211 138 216 147 218 160 C 223 200 229 250 234 300 C 236 318 238 334 240 350 L 215 355 C 212.5 334 209 310 205.5 288 C 202.5 258 201 226 201 198 C 202.5 176 204 154 202 135 Z',
  );
  const [ujungKa, ujungKi] = kanan('M 216 355 L 240 350 L 241.5 360 L 217 365 Z');
  const tegak = 'M 139 103 C 146 105.5 154 105.5 161 103 L 162 116 C 156 119.5 144 119.5 138 116 Z';
  let belakang = '';
  if (gantung) belakang += dalamLeher(k, 'M 141 106 L 159 106 L 160 118 L 140 118 Z');
  let s = potong(badan, k, { bayang: 'sisi', kilau: true });
  s += lipat('M 150 118 L 150 198', 0.3, 0.8);
  for (const y of [132, 152, 172, 192]) s += kancing(150.2, y, 2.1);
  // belahan samping tinggi + saku samping
  s += lipat('M 219 440 L 221.5 512', 0.36, 0.9) + lipat('M 81 440 L 78.5 512', 0.36, 0.9);
  s += lipat('M 206 330 C 204 346 203 360 203 372', 0.22, 0.9) + lipat('M 94 330 C 96 346 97 360 97 372', 0.22, 0.9);
  s += lipat('M 188 210 C 192 280 198 360 204 440', 0.09, 1.8) + lipat('M 112 210 C 108 280 102 360 96 440', 0.09, 1.8);
  s += lipat('M 170 290 C 173 360 176 430 178 512', 0.08, 1.5) + lipat('M 130 290 C 127 360 124 430 122 512', 0.08, 1.5);
  s += jahit('M 80 513 C 110 517 132 518 150 518 C 168 518 190 517 220 513', 0.32);
  const kerah = potong(tegak, k, { arah: 'h', bayang: 'turun', tepi: 0.42 }) + jahit('M 139.6 112.5 C 146 115.6 154 115.6 160.4 112.5', 0.35);
  let lengan = potong(lenganKa, k, { arah: 'ka', bayang: 'sisi' }) + potong(lenganKi, k, { arah: 'ki', bayang: 'sisi' });
  lengan += potong(ujungKa, k, { arah: 'h', bayang: 'turun', tepi: 0.34 }) + potong(ujungKi, k, { arah: 'h', bayang: 'turun', tepi: 0.34 });
  lengan += lipat('M 213 220 C 218 250 222 280 225 310', 0.13, 1.4) + lipat('M 87 220 C 82 250 78 280 75 310', 0.13, 1.4);
  return { belakang, badan: s + kerah, lengan };
}

// ---------------------------------------------------------------------------------------------
// OUTER SORE: luaran panjang model kimono, bagian depan terbuka, pita kerah lebar, lengan lebar tiga perempat.
function outerSore(k, { gantung }) {
  const [panelKa, panelKi] = kanan(
    'M 162 110 C 177 119 195 128 210 136 C 213 152 214 176 214 200 C 216 290 218 400 220 540 C 206 543 190 545 177 545 C 175 440 172 320 170 240 C 168.5 200 167 170 166 150 C 165 136 163.5 122 162 110 Z',
  );
  const [pitaKa, pitaKi] = kanan(
    'M 162 110 C 163 105 160 101 156 100.5 C 152.5 100.3 150.4 103 150.6 107 C 152 120 154 136 156 150 C 157.5 180 159 210 160 240 C 162 320 164 440 166 545 L 177 545 C 175 440 172 320 170 240 C 168.5 200 167 170 166 150 C 165 136 163.5 122 162 110 Z',
  );
  const [lenganKa, lenganKi] = kanan(
    'M 208 135 C 218 138 226 148 229 164 C 234 206 240 256 246 312 C 232 320 216 324 204 325 C 206 290 208 250 211 205 C 212 180 211 156 208 135 Z',
  );
  let belakang = '';
  if (gantung) belakang += dalamLeher(k, 'M 140 104 L 160 104 C 166 200 170 400 172 545 L 128 545 C 130 400 134 200 140 104 Z');
  let s = potong(panelKa, k, { bayang: 'sisi', kilau: true }) + potong(panelKi, k, { bayang: 'sisi', kilau: true });
  s += lipat('M 196 200 C 199 300 202 420 205 540', 0.1, 1.8) + lipat('M 104 200 C 101 300 98 420 95 540', 0.1, 1.8);
  s += lipat('M 178 300 C 179 380 180 460 181 544', 0.08, 1.5) + lipat('M 122 300 C 121 380 120 460 119 544', 0.08, 1.5);
  s += jahit('M 166 541 C 182 541.6 200 541 218 537', 0.32) + jahit('M 134 541 C 118 541.6 100 541 82 537', 0.32);
  // pita kerah (kain mendatar) + bayangan ke dalam
  let pita = lipat('M 158 152 C 160 240 162 400 165 545', 0.22, 2.6) + lipat('M 142 152 C 140 240 138 400 135 545', 0.22, 2.6);
  pita += potong(pitaKa, k, { arah: 'h', bayang: 'turun', tepi: 0.38 }) + potong(pitaKi, k, { arah: 'h', bayang: 'turun', tepi: 0.38 });
  pita += jahit('M 160.4 114 C 162.6 140 164.6 190 166 240 C 168 330 170 440 172 543', 0.3) + jahit('M 139.6 114 C 137.4 140 135.4 190 134 240 C 132 330 130 440 128 543', 0.3);
  let lengan = potong(lenganKa, k, { arah: 'kka', bayang: 'sisi' }) + potong(lenganKi, k, { arah: 'kki', bayang: 'sisi' });
  lengan += lipat('M 215 190 C 220 230 226 270 231 314', 0.13, 1.6) + lipat('M 85 190 C 80 230 74 270 69 314', 0.13, 1.6);
  lengan += jahit('M 205 320.5 C 218 319.5 232 316 244.6 308.6', 0.3) + jahit('M 95 320.5 C 82 319.5 68 316 55.4 308.6', 0.3);
  return { belakang, badan: s + pita, lengan };
}

// ---------------------------------------------------------------------------------------------
// JAKET KERJA: jaket kotak sepinggul, kerah kemeja, tiga saku tempel, lengan panjang bermanset sederhana.
function jaketKerja(k, { gantung }) {
  const badan = simetris([
    ['M', 150, 150],
    ['L', 157, 128],
    ['C', 158, 122, 159, 118, 162, 115],
    ['C', 177, 121, 195, 128, 210, 136],
    ['C', 213, 152, 213, 176, 212, 198],
    ['C', 213, 250, 213, 300, 212, 352],
    ['C', 196, 357, 172, 359, 150, 359],
  ]);
  const [lenganKa, lenganKi] = kanan(
    'M 208 135 C 218 137 224 146 227 160 C 231 196 235 240 239 282 C 241 304 243 326 244 348 L 216 353 C 214 330 212 306 210 284 C 207 256 205 228 205 200 C 207 178 209 156 208 135 Z',
  );
  const [mansetKa, mansetKi] = kanan('M 216 352 L 244 346.5 L 245.5 359.5 L 217.5 365 Z');
  const [kerahKa, kerahKi] = kanan(
    'M 150 152 L 162 132 L 177 142 C 179 133 180 127 180 122 C 174 118 167 114 161 110 C 159 109 158 108 157.6 107 C 157 113 156.6 120 156.6 128 C 155.4 138 152.6 146 150 152 Z',
  );
  let belakang = '';
  if (gantung) belakang += dalamLeher(k, 'M 141 106 L 159 106 C 161 124 157 140 150 152 C 143 140 139 124 141 106 Z');
  belakang += potong('M 138.5 102 L 161.5 102 L 163 113 C 156 115 144 115 137 113 Z', k, { arah: 'h', bayang: 'turun', tepi: 0.3 });
  let s = potong(badan, k, { bayang: 'sisi', kilau: true, gelap: 0.06 });
  s += lipat('M 153 152 L 153 358', 0.38, 0.9) + jahit('M 156.4 156 L 156.4 356', 0.42);
  for (const y of [170, 208, 246, 284, 322]) s += kancing(150.2, y, 2.8);
  // tiga saku tempel
  const sakuDada = 'M 168 186 L 194 185 L 194.5 210 C 194.5 213 192.5 215 189.5 215 L 172.5 215.5 C 169.6 215.5 168 213.6 168 211 Z';
  const [sakuBawahKa, sakuBawahKi] = kanan('M 164 268 L 202 267 L 202.5 314 C 202.5 318 200 320 196 320 L 170 320.5 C 166.4 320.5 164 318.4 164 315 Z');
  s += potong(sakuDada, k, { arah: 'h', bayang: 'turun', tepi: 0.4 }) + jahit('M 168.8 189 L 193.6 188.2', 0.45);
  s += potong(sakuBawahKa, k, { arah: 'h', bayang: 'turun', tepi: 0.4 }) + potong(sakuBawahKi, k, { arah: 'h', bayang: 'turun', tepi: 0.4 });
  s += jahit('M 164.8 271 L 201.6 270.2', 0.45) + jahit('M 135.2 271 L 98.4 270.2', 0.45);
  s += lipat('M 198 220 C 197 250 199 280 201 300', 0.1, 1.6) + lipat('M 102 220 C 103 250 101 280 99 300', 0.1, 1.6);
  s += jahit('M 90 353 C 118 356.6 134 357.2 150 357.2 C 166 357.2 182 356.6 210 353', 0.34);
  let kerah = potong(kerahKa, k, { arah: 'kka', bayang: 'turun', tepi: 0.42 }) + potong(kerahKi, k, { arah: 'kki', bayang: 'turun', tepi: 0.42 });
  kerah = lipat('M 163 146 C 168 150 172 150 176 146', 0.18, 2.2) + lipat('M 137 146 C 132 150 128 150 124 146', 0.18, 2.2) + kerah;
  let lengan = potong(lenganKa, k, { arah: 'ka', bayang: 'sisi', gelap: 0.06 }) + potong(lenganKi, k, { arah: 'ki', bayang: 'sisi', gelap: 0.06 });
  lengan += lipat('M 217 230 C 221 260 224 290 227 318', 0.14, 1.5) + lipat('M 83 230 C 79 260 76 290 73 318', 0.14, 1.5);
  lengan += potong(mansetKa, k, { arah: 'h', bayang: 'turun', tepi: 0.42 }) + potong(mansetKi, k, { arah: 'h', bayang: 'turun', tepi: 0.42 });
  return { belakang, badan: s + kerah, lengan };
}


// ---------------------------------------------------------------------------------------------
// Ban pinggang karet berkerut (dipakai kulot, celana, terusan)
function banKaret(k, y = 255, tinggi = 15, lebar = 39) {
  const kiri = 150 - lebar;
  const kananX = 150 + lebar;
  const d = `M ${kiri} ${y} C ${kiri + 18} ${y + 3} ${kananX - 18} ${y + 3} ${kananX} ${y} L ${kananX + 1.5} ${y + tinggi} C ${kananX - 18} ${y + tinggi + 3} ${kiri + 18} ${y + tinggi + 3} ${kiri - 1.5} ${y + tinggi} Z`;
  let s = potong(d, k, { arah: 'h', bayang: 'turun', tepi: 0.4 });
  for (let x = kiri + 4; x < kananX - 2; x += 4.2) s += lipat(`M ${x} ${y + 2.5} L ${x + 0.6} ${y + tinggi - 1}`, 0.16, 0.8);
  return s;
}

// KULOT LEBAR: pinggang karet, kaki lebar sebetis, lipit depan, saku samping.
function kulotLebar(k, { gantung }) {
  const [kakiKa, kakiKi] = kanan(
    'M 150 268 L 190 268 C 197 288 202 310 203 334 C 207 400 213 500 219 600 C 198 604 176 605 154 604 C 153 540 152 470 151 404 C 150.5 360 150 310 150 268 Z',
  );
  let s = '';
  // bagian dalam kaki celana yang terlihat di celah antar-kaki
  s += `<path d="M 150 398 L 156 605 L 144 605 Z" fill="${TINTA}" fill-opacity=".55"/>`;
  s += potong(kakiKa, k, { bayang: 'sisi', kilau: true }) + potong(kakiKi, k, { bayang: 'sisi', kilau: true });
  s += lipat('M 151 404 L 154.5 603', 0.3, 0.9) + lipat('M 149 404 L 145.5 603', 0.3, 0.9);
  // lipit depan dan garis jatuh kain
  s += lipat('M 172 271 L 174 322', 0.3, 0.9) + lipat('M 128 271 L 126 322', 0.3, 0.9);
  s += lipat('M 176 330 C 180 420 184 510 187 603', 0.1, 1.8) + lipat('M 124 330 C 120 420 116 510 113 603', 0.1, 1.8);
  s += lipat('M 200 380 C 204 450 208 530 212 600', 0.1, 1.6) + lipat('M 100 380 C 96 450 92 530 88 600', 0.1, 1.6);
  s += lipat('M 189 272 C 195 288 199 300 201 316', 0.3, 0.9) + lipat('M 111 272 C 105 288 101 300 99 316', 0.3, 0.9);
  s += jahit('M 155 599 C 176 600 198 599 218 595', 0.32) + jahit('M 145 599 C 124 600 102 599 82 595', 0.32);
  s += banKaret(k, 255, 15, 39);
  return { belakang: gantung ? '' : '', badan: s, lengan: '' };
}

// CELANA LURUS TALI: pinggang karet bertali, kaki lurus semata kaki, garis setrika.
function celanaTali(k) {
  const [kakiKa, kakiKi] = kanan(
    'M 150 268 L 190 268 C 196 288 201 310 201 334 C 201 380 198 450 195 528 C 194 580 193 640 192 690 C 180 692 168 692 156 691 C 155 640 154 580 154 528 C 153 470 152 430 151 390 C 150.5 350 150 310 150 268 Z',
  );
  let s = `<path d="M 150 388 L 157 692 L 143 692 Z" fill="${TINTA}" fill-opacity=".55"/>`;
  s += potong(kakiKa, k, { bayang: 'sisi', kilau: true }) + potong(kakiKi, k, { bayang: 'sisi', kilau: true });
  s += lipat('M 151 392 L 155.5 690', 0.3, 0.9) + lipat('M 149 392 L 144.5 690', 0.3, 0.9);
  s += lipat('M 175 300 C 175 420 174 560 174 690', 0.12, 1.6) + lipat('M 125 300 C 125 420 126 560 126 690', 0.12, 1.6);
  s += lipat('M 189 272 C 194 290 198 302 200 318', 0.3, 0.9) + lipat('M 111 272 C 106 290 102 302 100 318', 0.3, 0.9);
  s += lipat('M 160 600 C 168 606 180 606 190 601', 0.1, 1.4) + lipat('M 140 600 C 132 606 120 606 110 601', 0.1, 1.4);
  s += jahit('M 157 686.5 L 191 685.5', 0.32) + jahit('M 143 686.5 L 109 685.5', 0.32);
  s += banKaret(k, 255, 15, 39);
  // tali serut
  s += '<path d="M 148 266 C 147 280 144 292 142 304" fill="none" stroke="#efe6d3" stroke-width="2" stroke-linecap="round"/><path d="M 152 266 C 153 282 156 294 158 306" fill="none" stroke="#efe6d3" stroke-width="2" stroke-linecap="round"/>';
  s += '<path d="M 148 266 C 147 280 144 292 142 304 M 152 266 C 153 282 156 294 158 306" fill="none" stroke="#0d1426" stroke-opacity=".3" stroke-width="2.8" stroke-linecap="round" transform="translate(.6 .6)" opacity=".5"/>';
  s += '<circle cx="142" cy="305" r="2.4" fill="#e3d8c2"/><circle cx="158" cy="307" r="2.4" fill="#e3d8c2"/>';
  return { badan: s };
}

// ROK LILIT TALI: rok lilit semi-A sebetis, tali di pinggang kanan, tumpukan kain tampak di sisi.
function rokLilit(k) {
  const bawah = 'M 111 266 C 130 268 170 268 189 266 C 199 300 208 360 214 420 C 218 480 221 540 224 590 C 190 597 110 597 76 590 C 79 540 82 480 86 420 C 92 360 101 300 111 266 Z';
  const atas = 'M 111 266 C 130 268 160 268 176 267 C 182 340 190 460 200 595 C 160 598 110 597 76 590 C 79 540 82 480 86 420 C 92 360 101 300 111 266 Z';
  let s = potong(bawah, k, { bayang: 'sisi', gelap: 0.18 });
  s += lipat('M 200 595 C 191 460 183 340 177 268', 0.25, 3.2);
  s += potong(atas, k, { bayang: 'sisi', kilau: true });
  s += lipat('M 120 330 C 112 420 104 510 98 592', 0.1, 1.8) + lipat('M 150 320 C 150 420 151 500 151 596', 0.08, 1.6);
  s += lipat('M 168 330 C 172 420 178 500 182 596', 0.1, 1.6);
  s += jahit('M 80 586 C 110 592 160 593 199 591', 0.32);
  const ban = 'M 110 256 C 130 259 170 259 190 256 L 191 268 C 170 271 130 271 109 268 Z';
  s += potong(ban, k, { arah: 'h', bayang: 'turun', tepi: 0.4 });
  // simpul tali dan dua ujung tali yang menjuntai
  s += potong('M 186 258 C 190 255 196 256 198 260 C 200 265 196 270 191 270 C 186 270 183 263 186 258 Z', k, { arah: 'd1', bayang: 'turun', tepi: 0.45 });
  s += potong('M 190 268 L 197 268 C 199 290 201 310 204 334 L 197 336 C 194 312 192 290 190 268 Z', k, { arah: 'ka', bayang: 'sisi', tepi: 0.4 });
  s += potong('M 195 266 L 201 264 C 206 282 210 298 215 318 L 209 321 C 205 302 200 284 195 266 Z', k, { arah: 'kka', bayang: 'sisi', tepi: 0.4 });
  return { badan: s };
}

// TERUSAN PASAR: badan atas pas, kerah bulat dengan belahan kancing, lengan sesiku, pinggang karet, rok A sebetis.
function terusanPasar(k, { gantung }) {
  const atas = simetris([
    ['M', 150, 128],
    ['C', 156, 127, 160, 122, 161, 114],
    ['C', 174, 121, 189, 128, 202, 136],
    ['C', 205, 150, 205, 172, 201, 194],
    ['C', 201, 220, 194, 244, 191, 262],
    ['L', 150, 264],
  ]);
  const rok = simetris([
    ['M', 150, 268],
    ['L', 191, 268],
    ['C', 199, 300, 207, 360, 213, 420],
    ['C', 218, 480, 223, 550, 227, 612],
    ['C', 200, 620, 176, 622, 150, 622],
  ]);
  const [lenganKa, lenganKi] = kanan(
    'M 200 134 C 210 136 216 144 219 156 C 223 182 227 214 231 252 C 222 258 212 261 203 262 C 205 240 204 218 201 196 C 202 174 202 152 200 134 Z',
  );
  const [ujungKa, ujungKi] = kanan('M 203 262 C 212 261 222 258 231 252 L 232.5 259 C 223 265 212 268 202.6 269 Z');
  let belakang = '';
  if (gantung) belakang += dalamLeher(k, 'M 141 108 C 146 112 154 112 159 108 L 159 128 C 154 133 146 133 141 128 Z');
  let s = potong(rok, k, { bayang: 'sisi', kilau: true });
  s += lipat('M 176 300 C 182 400 188 500 194 618', 0.1, 1.8) + lipat('M 124 300 C 118 400 112 500 106 618', 0.1, 1.8);
  s += lipat('M 160 290 C 161 400 162 500 163 620', 0.07, 1.6) + lipat('M 140 290 C 139 400 138 500 137 620', 0.07, 1.6);
  s += lipat('M 197 290 C 202 304 204 316 206 330', 0.3, 0.9) + lipat('M 103 290 C 98 304 96 316 94 330', 0.3, 0.9);
  s += jahit('M 76 607 C 110 616 136 618 150 618 C 164 618 190 616 224 607', 0.32);
  s += potong(atas, k, { bayang: 'sisi', kilau: true });
  s += lipat('M 152 128 L 152 176', 0.32, 0.8) + jahit('M 155 132 L 155 175', 0.36);
  for (const y of [140, 156, 172]) s += kancing(150.4, y, 2.1);
  s += jahit('M 139.4 117 C 144 125 156 125 160.6 117', 0.35);
  s += lipat('M 186 200 C 186 220 184 240 182 258', 0.12, 1.5) + lipat('M 114 200 C 114 220 116 240 118 258', 0.12, 1.5);
  s += banKaret(k, 259, 13, 41.5);
  let lengan = potong(lenganKa, k, { arah: 'ka', bayang: 'sisi' }) + potong(lenganKi, k, { arah: 'ki', bayang: 'sisi' });
  lengan += potong(ujungKa, k, { arah: 'kka', bayang: 'turun', tepi: 0.32 }) + potong(ujungKi, k, { arah: 'kki', bayang: 'turun', tepi: 0.32 });
  lengan += lipat('M 211 170 C 215 194 219 218 222 244', 0.13, 1.4) + lipat('M 89 170 C 85 194 81 218 78 244', 0.13, 1.4);
  return { belakang, badan: s, lengan };
}

// KERUDUNG SEGI EMPAT: dilipat segitiga, membingkai wajah, menjuntai menutup dada.
function kerudung(k) {
  const luar = 'M 150 13 C 171 13 185 29 187 52 C 189 72 186 90 184 104 C 194 112 206 124 212 140 C 216 156 214 180 210 204 C 196 224 172 236 150 238 C 128 236 104 224 90 204 C 86 180 84 156 88 140 C 94 124 106 112 116 104 C 114 90 111 72 113 52 C 115 29 129 13 150 13 Z';
  const wajah = 'M 150 33 C 165 33 174 46 174.5 62 C 175 80 166 96 150 97.5 C 134 96 125 80 125.5 62 C 126 46 135 33 150 33 Z';
  const belakang = potong('M 116 100 C 100 120 86 150 84 196 L 216 196 C 214 150 200 120 184 100 Z', k, { bayang: 'sisi', gelap: 0.25, tepi: 0 });
  let s = `<path d="${luar} ${wajah}" fill-rule="evenodd" fill="${isi(k, 'kka')}"/>`;
  s += `<path d="${luar} ${wajah}" fill-rule="evenodd" fill="url(#g-sisi)"/>`;
  s += `<path d="${luar} ${wajah}" fill-rule="evenodd" fill="none" stroke="${TINTA}" stroke-opacity=".3" stroke-width=".8"/>`;
  // lipatan yang memancar dari bawah dagu
  s += lipat('M 150 104 C 146 140 140 180 132 230', 0.16, 1.5) + lipat('M 154 104 C 160 140 168 180 176 228', 0.16, 1.5);
  s += lipat('M 140 102 C 124 130 108 160 98 198', 0.13, 1.5) + lipat('M 162 102 C 178 130 192 160 202 198', 0.13, 1.5);
  s += lipat('M 128 92 C 122 98 118 102 114 104', 0.2, 1.4) + lipat('M 172 92 C 178 98 182 102 186 104', 0.2, 1.4);
  s += `<path d="${wajah}" fill="none" stroke="${TINTA}" stroke-opacity=".22" stroke-width="2.4"/>`;
  s += jahit('M 92 202 C 108 222 130 233 150 235 C 170 233 192 222 208 202', 0.32);
  return { belakang, depan: s };
}

// SYAL: melilit leher sekali, dua ujung berumbai menjuntai di depan.
function syal(k) {
  let s = '';
  const ekorKa = 'M 157 118 L 172 115 C 175 180 179 250 182 326 L 163 328 C 162 258 160 188 157 118 Z';
  const ekorKi = 'M 143 120 L 128 117 C 125 175 121 236 118 296 L 136 298 C 138 238 140 178 143 120 Z';
  s += potong(ekorKi, k, { arah: 'kki', bayang: 'sisi', tepi: 0.36 });
  s += potong(ekorKa, k, { arah: 'kka', bayang: 'sisi', tepi: 0.36 });
  const rumbai = (x0, x1, y0, y1) => {
    let r = '';
    for (let i = 0; i <= 8; i++) {
      const t = i / 8;
      const x = x0 + (x1 - x0) * t;
      const y = y0 + (y1 - y0) * t;
      r += `<path d="M ${x} ${y} L ${x + 0.6} ${y + 8}" stroke="${cariKain(k).dasar}" stroke-width="1.3" stroke-linecap="round"/>`;
    }
    return r;
  };
  s += rumbai(118.5, 135.5, 296.5, 298.5) + rumbai(163.5, 181.5, 328.5, 326.5);
  const lilit = 'M 133 108 C 141 120 159 120 167 108 L 170 121 C 160 134 140 134 130 121 Z';
  s += lipat('M 132 124 C 142 134 158 134 168 124', 0.2, 2.4);
  s += potong(lilit, k, { arah: 'h', bayang: 'turun', tepi: 0.4 });
  s += lipat('M 140 122 C 146 126 154 126 160 122', 0.18, 1.2);
  return { belakang: potong('M 136 100 C 145 103 155 103 164 100 L 167 114 C 156 118 144 118 133 114 Z', k, { arah: 'h', gelap: 0.25, tepi: 0 }), depan: s };
}

// TAS JINJING: tas kain bersudut lembut, tali di bahu kanan.
function tasJinjing(k) {
  let s = '';
  const tali = 'M 187 128 L 197 126 L 232 300 L 222 302 Z';
  const tas = 'M 204 300 C 220 297 238 296 254 297 L 260 372 C 260.5 377 257.5 380 252.5 380.4 L 214 382 C 209 382 206 379.5 205.6 375 Z';
  s += lipat('M 206 304 C 222 300 238 299 254 300', 0.2, 2.4);
  s += potong(tas, k, { arah: 'ka', bayang: 'sisi', kilau: true, tepi: 0.42 });
  s += jahit('M 207 307 C 222 304 238 303 252.6 304', 0.42);
  s += lipat('M 230 312 C 232 334 233 352 233 372', 0.1, 1.6);
  s += potong(tali, k, { arah: 'kka', bayang: 'sisi', tepi: 0.42 });
  s += jahit('M 190 130 L 224 300', 0.36) + jahit('M 195 129 L 229.5 299.5', 0.36);
  return { depan: s };
}

export const GARMEN = {
  'kemeja-teras': { slot: 'atasan', gambar: kemejaTeras, batas: [76, 100, 237, 358] },
  'kemeja-panjang': { slot: 'atasan', gambar: kemejaPanjang, batas: [60, 100, 240, 368] },
  'blus-shanghai': { slot: 'atasan', gambar: blusShanghai, batas: [68, 100, 232, 346] },
  'tunik-kebun': { slot: 'atasan', gambar: tunikKebun, batas: [58, 100, 242, 521] },
  'outer-sore': { slot: 'luaran', gambar: outerSore, batas: [54, 100, 246, 546] },
  'jaket-kerja': { slot: 'luaran', gambar: jaketKerja, batas: [56, 100, 244, 366] },
  'terusan-pasar': { slot: 'terusan', gambar: terusanPasar, batas: [66, 100, 234, 623] },
  'kulot-lebar': { slot: 'bawahan', gambar: kulotLebar, batas: [78, 252, 222, 606] },
  'celana-tali': { slot: 'bawahan', gambar: celanaTali, batas: [96, 252, 204, 693] },
  'rok-lilit': { slot: 'bawahan', gambar: rokLilit, batas: [74, 252, 226, 598] },
  kerudung: { slot: 'aksesori', gambar: kerudung, batas: [82, 10, 218, 240] },
  syal: { slot: 'aksesori', gambar: syal, batas: [112, 98, 188, 340] },
  'tas-jinjing': { slot: 'aksesori', gambar: tasJinjing, batas: [184, 124, 262, 384] },
};

export function svgGarmen(jenis, kainId, opsi = {}) {
  const g = GARMEN[jenis];
  if (!g || !cariKain(kainId)) return { belakang: '', badan: '', lengan: '', depan: '' };
  const r = g.gambar(kainId, opsi);
  return { belakang: r.belakang || '', badan: r.badan || '', lengan: r.lengan || '', depan: r.depan || '' };
}
