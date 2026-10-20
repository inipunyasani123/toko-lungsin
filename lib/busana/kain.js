// Tujuh kain lurik Lungsin dan pola SVG-nya. Satu sumber untuk ilustrasi busana, contoh kain, og.jpg, dan saringan.
// Lungsin = benang memanjang (vertikal), pakan = benang melintang. Garis lungsin tampil tegak, garis pakan mendatar,
// dan di persilangan keduanya warnanya berbaur (pakan digambar setengah tembus).

export const kain = [
  {
    id: 'gerimis-nila',
    nama: 'Gerimis Nila',
    keluarga: 'lajur',
    ringkas: 'Nila tua dengan garis putih tipis yang rapat',
    catatan:
      'Garis putih setipis rambut berjajar rapat di atas dasar nila, seperti gerimis yang dilihat dari jendela. Dari jauh tampak polos, dari dekat baru kelihatan garisnya.',
    rawat: 'Nila bisa sedikit luntur di dua cucian pertama. Cuci terpisah dengan air dingin.',
    dasar: '#1d3157',
    tua: '#13213d',
    muda: '#dfe5ef',
    // [lebar, warna] berulang dari kiri ke kanan
    lungsin: [[5.2, '#1d3157'], [0.55, '#e9e4d6'], [2.2, '#1d3157'], [0.55, '#e9e4d6'], [5.2, '#1d3157'], [0.9, '#2f4a7a']],
    pakan: null,
    tambahan: 0,
  },
  {
    id: 'pematang-soga',
    nama: 'Pematang Soga',
    keluarga: 'lajur',
    ringkas: 'Cokelat soga dengan lajur krem lebar',
    catatan:
      'Lajur krem yang lebar diapit garis karat, berselang dengan bidang cokelat soga. Polanya tegas dan tenang, cocok untuk kemeja dan tas.',
    rawat: 'Warna soga cukup stabil. Jemur di tempat teduh supaya lajur krem tidak menguning.',
    dasar: '#6f4326',
    tua: '#4b2c18',
    muda: '#efe3d4',
    lungsin: [[7, '#6f4326'], [0.8, '#b8562f'], [0.6, '#6f4326'], [4.6, '#e8dcc4'], [0.6, '#6f4326'], [0.8, '#b8562f'], [7, '#6f4326'], [1.2, '#3a2416']],
    pakan: null,
    tambahan: 0,
  },
  {
    id: 'cacah-lumut',
    nama: 'Cacah Lumut',
    keluarga: 'cacah',
    ringkas: 'Kotak kecil hijau lumut dan krem',
    catatan:
      'Garis krem berjalan ke dua arah sehingga membentuk kotak-kotak kecil. Hijau lumutnya teduh dan mudah dipadukan dengan nila atau arang.',
    rawat: 'Setrika dari sisi dalam supaya permukaan kotak tidak mengilap.',
    dasar: '#4f6a3c',
    tua: '#34472a',
    muda: '#e3e9da',
    lungsin: [[3.4, '#4f6a3c'], [1.1, '#e6dfc9'], [3.4, '#4f6a3c'], [0.5, '#2c3c22']],
    pakan: [[3.4, null], [1.1, '#e6dfc9'], [3.4, null], [0.5, '#2c3c22']],
    tambahan: 0,
  },
  {
    id: 'kotak-bata',
    nama: 'Kotak Bata',
    keluarga: 'cacah',
    ringkas: 'Kotak besar merah bata, nila, dan krem',
    catatan:
      'Kotak besar yang dibentuk lajur nila dan garis krem di atas merah bata. Paling mencolok di antara kain kami, jadi enak dipakai sebagai pusat perhatian.',
    rawat: 'Merah bata bisa luntur ke kain putih. Cuci terpisah di tiga cucian pertama.',
    dasar: '#a5432e',
    tua: '#73291b',
    muda: '#f3e0d8',
    lungsin: [[6, '#a5432e'], [2.6, '#233a63'], [0.7, '#a5432e'], [0.7, '#eadfc9'], [0.7, '#a5432e'], [2.6, '#233a63'], [6, '#a5432e']],
    pakan: [[6, null], [2.6, '#233a63'], [0.7, null], [0.7, '#eadfc9'], [0.7, null], [2.6, '#233a63'], [6, null]],
    tambahan: 0,
  },
  {
    id: 'lajur-senja',
    nama: 'Lajur Senja',
    keluarga: 'lajur',
    ringkas: 'Lajur warna-warni karat, kunyit, nila, dan krem',
    catatan:
      'Kain dengan benang lungsin paling banyak warna: karat, kunyit, nila, krem, dan soga berganti-ganti. Butuh waktu memasang benang paling lama, karena itu harganya sedikit lebih tinggi.',
    rawat: 'Banyak warna dalam satu kain, jadi selalu cuci terpisah dan jangan direndam lama.',
    dasar: '#b4532f',
    tua: '#7a3418',
    muda: '#f5e4d6',
    lungsin: [
      [3.2, '#b4532f'], [0.6, '#eadfc9'], [1.6, '#e0a42b'], [0.6, '#eadfc9'], [2.6, '#233a63'], [0.9, '#6f4326'],
      [3.2, '#b4532f'], [0.5, '#233a63'], [2.2, '#eadfc9'], [0.5, '#233a63'], [1.4, '#e0a42b'], [0.9, '#6f4326'],
    ],
    pakan: null,
    tambahan: 15000,
  },
  {
    id: 'polos-arang',
    nama: 'Polos Arang',
    keluarga: 'polos',
    ringkas: 'Abu arang polos dengan tekstur benang',
    catatan:
      'Tanpa lajur, tapi benang tenunnya tetap kelihatan: ada bagian yang sedikit lebih tebal dan lebih terang. Kain paling serba bisa untuk bawahan dan luaran.',
    rawat: 'Paling bandel di antara kain kami. Tetap cuci dengan air dingin supaya warnanya awet.',
    dasar: '#33363d',
    tua: '#202227',
    muda: '#e4e4e2',
    lungsin: [[1.3, '#33363d'], [0.5, '#3d4048'], [2.1, '#33363d'], [0.4, '#2a2c32'], [1.6, '#33363d'], [0.5, '#3b3e46']],
    pakan: [[1.7, null], [0.45, '#43464e'], [2.6, null], [0.4, '#2b2d33'], [1.4, null]],
    serat: true,
    tambahan: 0,
  },
  {
    id: 'lajur-kunyit',
    nama: 'Lajur Kunyit',
    keluarga: 'lajur',
    ringkas: 'Krem dengan lajur kunyit dan garis nila',
    catatan:
      'Dasar krem yang terang dengan lajur kuning kunyit dan garis nila tipis di kedua sisinya. Paling ringan dipandang, enak untuk kerudung dan rok.',
    rawat: 'Krem mudah ternoda. Bersihkan noda secepatnya dengan air dingin, jangan air panas.',
    dasar: '#ebe2cc',
    tua: '#cfc2a3',
    muda: '#f6f1e4',
    lungsin: [[5, '#ebe2cc'], [0.6, '#233a63'], [0.8, '#ebe2cc'], [3.2, '#d99c22'], [0.8, '#ebe2cc'], [0.6, '#233a63'], [5, '#ebe2cc'], [0.6, '#c9b991']],
    pakan: null,
    tambahan: 0,
  },
];

export function cariKain(id) {
  return kain.find((k) => k.id === id);
}

const jumlah = (arr) => arr.reduce((n, [w]) => n + w, 0);
const b = (n) => Math.round(n * 100) / 100;

// Isi satu ubin pola (tanpa elemen <pattern> pembungkusnya). Dipakai oleh defs global dan oleh contoh kain mandiri.
export function isiUbin(k) {
  const W = b(jumlah(k.lungsin));
  const H = b(k.pakan ? jumlah(k.pakan) : 6);
  let s = `<rect width="${W}" height="${H}" fill="${k.dasar}"/>`;
  let x = 0;
  for (const [w, c] of k.lungsin) {
    if (c !== k.dasar) s += `<rect x="${b(x)}" width="${b(w)}" height="${H}" fill="${c}"/>`;
    x += w;
  }
  if (k.pakan) {
    let y = 0;
    for (const [h, c] of k.pakan) {
      if (c) s += `<rect y="${b(y)}" width="${W}" height="${b(h)}" fill="${c}" fill-opacity=".55"/>`;
      y += h;
    }
  }
  // Tekstur anyaman polos: garis rambut lungsin terang dan pakan gelap, jaraknya ±1,2 satuan.
  const langkah = 1.2;
  for (let i = 0.3; i < W; i += langkah) s += `<rect x="${b(i)}" width=".35" height="${H}" fill="#fff" fill-opacity=".06"/>`;
  for (let j = 0.5; j < H; j += langkah) s += `<rect y="${b(j)}" width="${W}" height=".4" fill="#000" fill-opacity=".07"/>`;
  if (k.serat) {
    // Serat benang yang sedikit lebih tebal (slub) pada kain polos.
    const titik = [[0.6, 0.9, 1.4], [3.1, 2.6, 1.1], [5.2, 4.4, 1.7], [1.9, 5.5, 0.9], [4.4, 1.2, 1.2]];
    for (const [tx, ty, tw] of titik) {
      if (tx < W && ty < H) s += `<rect x="${tx}" y="${ty}" width="${tw}" height=".45" rx=".2" fill="#8a8d95" fill-opacity=".35"/>`;
    }
  }
  return { W, H, isi: s };
}

// Varian arah pola: tegak (bawaan), miring kiri/kanan untuk lengan, mendatar untuk ban pinggang dan manset.
export const ARAH = {
  '': '',
  ki: 'rotate(8)',
  ka: 'rotate(-8)',
  kki: 'rotate(18)',
  kka: 'rotate(-18)',
  h: 'rotate(90)',
  d1: 'rotate(38)',
  d2: 'rotate(-38)',
  z: 'scale(4.5)',
  zh: 'rotate(90) scale(4.5)',
};

export function idPola(kainId, arah = '') {
  return arah ? `k-${kainId}-${arah}` : `k-${kainId}`;
}

// Semua definisi bersama: pola tiap kain + turunannya, gradasi bayangan, dan pola tekstur kertas.
export function svgDefs() {
  let s = '';
  for (const k of kain) {
    const { W, H, isi } = isiUbin(k);
    s += `<pattern id="${idPola(k.id)}" patternUnits="userSpaceOnUse" width="${W}" height="${H}">${isi}</pattern>`;
    for (const [arah, t] of Object.entries(ARAH)) {
      if (!arah) continue;
      s += `<pattern id="${idPola(k.id, arah)}" href="#${idPola(k.id)}" xlink:href="#${idPola(k.id)}" patternTransform="${t}"/>`;
    }
  }
  s +=
    '<linearGradient id="g-sisi" x1="0" x2="1" y1="0" y2="0">' +
    '<stop offset="0" stop-color="#0d1426" stop-opacity=".26"/><stop offset=".2" stop-color="#0d1426" stop-opacity="0"/>' +
    '<stop offset=".78" stop-color="#0d1426" stop-opacity="0"/><stop offset="1" stop-color="#0d1426" stop-opacity=".3"/></linearGradient>' +
    '<linearGradient id="g-turun" x1="0" x2="0" y1="0" y2="1">' +
    '<stop offset="0" stop-color="#0d1426" stop-opacity=".2"/><stop offset=".22" stop-color="#0d1426" stop-opacity="0"/>' +
    '<stop offset=".85" stop-color="#0d1426" stop-opacity="0"/><stop offset="1" stop-color="#0d1426" stop-opacity=".14"/></linearGradient>' +
    '<linearGradient id="g-kilau" x1="0" x2="1" y1="0" y2="0">' +
    '<stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".38" stop-color="#fff" stop-opacity=".13"/>' +
    '<stop offset=".55" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
    '<linearGradient id="g-manekin" x1="0" x2="1" y1="0" y2="0">' +
    '<stop offset="0" stop-color="#a99c87"/><stop offset=".26" stop-color="#e3dbcc"/><stop offset=".5" stop-color="#f3eee5"/>' +
    '<stop offset=".8" stop-color="#ddd3c3"/><stop offset="1" stop-color="#ab9e89"/></linearGradient>' +
    '<radialGradient id="g-lantai" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#0d1426" stop-opacity=".28"/>' +
    '<stop offset="1" stop-color="#0d1426" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="g-kayu" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#c99a63"/><stop offset="1" stop-color="#9c6d3c"/></linearGradient>' +
    '<radialGradient id="g-sorot" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".12"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></radialGradient>';
  return s;
}
