// Semua isi toko demo Lungsin. Lungsin adalah toko fiktif: produk, harga, stok, tarif ongkir, kebijakan, dan
// pesanan contoh di bawah ini rekaan untuk demo.
import { kain, cariKain } from './busana/kain.js';

export { kain, cariKain };

export const site = {
  nama: 'Lungsin',
  slug: 'lungsin',
  url: 'https://toko-lungsin.pintuweb.id',
  judul: 'Lungsin — Pakaian lurik tenun untuk sehari-hari',
  tagline: 'Pakaian harian dari kain lurik tenun, dijahit di Klaten',
  deskripsi:
    'Kemeja, blus, tunik, kulot, dan outer dari kain lurik tenunan ATBM, dijahit di Klaten. Tabel ukuran lengkap S–XXL. Toko online demo buatan PintuWeb.',
  kota: 'Klaten, Jawa Tengah',
  alamat: 'Jl. Benang Lungsin No. 7, Klaten, Jawa Tengah',
  email: 'halo@lungsin.example',
  jamLayanan: [
    ['Senin–Jumat', '08.30–16.30 WIB'],
    ['Sabtu', '09.00–13.00 WIB'],
    ['Minggu & libur nasional', 'Tutup'],
  ],
  kodePesanan: 'LGS',
  kodeTukar: 'TKR',
  batasBayarJam: 24,
  batasKemas: '13.00 WIB',
  hariTukar: 14,
  // Subsidi ongkir: belanja minimal sekian, ongkir dipotong paling banyak sekian.
  subsidi: { minimal: 500000, potongan: 25000 },
  bungkusKado: { biaya: 12000, berat: 80 },
  kemasan: { dasar: 120, perBarang: 30 },
  lebarKain: 110,
};

export const nav = [
  { href: '/koleksi', label: 'Koleksi' },
  { href: '/padu-padan', label: 'Padu-padan' },
  { href: '/lookbook', label: 'Lookbook' },
  { href: '/panduan-ukuran', label: 'Panduan ukuran' },
  { href: '/bantuan', label: 'Bantuan' },
];

export const kategori = [
  { id: 'atasan', nama: 'Atasan', ringkas: 'Kemeja, blus, dan tunik' },
  { id: 'luaran', nama: 'Luaran', ringkas: 'Outer dan jaket kerja' },
  { id: 'terusan', nama: 'Terusan', ringkas: 'Dress sebetis berpinggang karet' },
  { id: 'bawahan', nama: 'Bawahan', ringkas: 'Kulot, celana, dan rok lilit' },
  { id: 'aksesori', nama: 'Aksesori', ringkas: 'Kerudung, syal, dan tas' },
  { id: 'kain', nama: 'Kain potong', ringkas: 'Lurik per meter untuk dijahit sendiri' },
];

// Potongan: berapa sentimeter ukuran baju lebih besar dari ukuran badan (kelonggaran) yang kami anggap pas.
export const potongan = {
  pas: { nama: 'Pas badan', kelonggaran: [6, 12], ket: 'Mengikuti bentuk badan tanpa menempel. Lingkar dada baju 6–12 cm lebih besar dari lingkar dada badan.' },
  reguler: { nama: 'Reguler', kelonggaran: [8, 14], ket: 'Rapi untuk kerja, masih leluasa bergerak. Kelonggaran dada 8–14 cm.' },
  longgar: { nama: 'Longgar', kelonggaran: [14, 22], ket: 'Jatuh lurus dari bahu, tidak membentuk badan. Kelonggaran dada 14–22 cm.' },
  oversize: { nama: 'Oversize', kelonggaran: [22, 40], ket: 'Sengaja besar untuk dipakai berlapis. Kelonggaran dada lebih dari 22 cm.' },
};

export const labelUkur = {
  dada: 'Lingkar dada',
  pinggang: 'Lingkar pinggang',
  pinggul: 'Lingkar pinggul',
  panjang: 'Panjang',
  bahu: 'Lebar bahu',
  lengan: 'Panjang lengan',
  paha: 'Lingkar paha',
  ukuran: 'Ukuran',
};

// Cara mengukur tiap bagian badan (dipakai di panduan ukuran dan formulir ukuranku)
export const caraUkur = [
  { id: 'dada', nama: 'Lingkar dada', cara: 'Lingkarkan meteran di bagian dada yang paling penuh, lewat bawah ketiak. Meteran datar, tidak menekan, napas biasa.' },
  { id: 'pinggang', nama: 'Lingkar pinggang', cara: 'Lingkarkan di bagian badan yang paling ramping, biasanya sedikit di atas pusar.' },
  { id: 'pinggul', nama: 'Lingkar pinggul', cara: 'Berdiri dengan kaki rapat, lingkarkan meteran di bagian pinggul dan bokong yang paling lebar.' },
  { id: 'tinggi', nama: 'Tinggi badan', cara: 'Berdiri tegak tanpa alas kaki menempel dinding. Dipakai untuk memperkirakan di mana ujung baju jatuh.' },
];

// stok: { [kain]: [stok ukuran pertama, kedua, ...] } mengikuti urutan `ukuran`.
// tambahanKain: selisih harga untuk kain tertentu (dikalikan meter pada kain potong).
// Ukuran baju dalam cm, diukur dari baju (bukan badan). Pinggang karet ditulis [tanpa ditarik, ditarik penuh].
export const produk = [
  {
    slug: 'kemeja-teras',
    nama: 'Kemeja Teras',
    jenis: 'kemeja-teras',
    kategori: 'atasan',
    urutan: 1,
    ringkas: 'Kemeja kotak lengan pendek berkerah rebah, enak dipakai tanpa dimasukkan.',
    deskripsi:
      'Kemeja santai untuk dipakai sehari-hari: kerah rebah yang tetap rapi walau kancing atas dibuka, satu saku dada yang dipotong melintang, dan belahan kecil di kedua sisi supaya ujungnya jatuh lurus di luar celana.',
    detail: ['Kerah rebah (kerah piyama)', 'Kancing batok kelapa', 'Saku dada dipotong melintang', 'Belahan samping 4 cm'],
    potongan: 'longgar',
    acuan: 'dada',
    lengan: 'pendek',
    tertutup: false,
    kain: ['gerimis-nila', 'pematang-soga', 'cacah-lumut', 'kotak-bata'],
    tambahanKain: {},
    harga: 245000,
    ukuran: [
      { id: 'S', dada: 108, panjang: 68, bahu: 47, lengan: 22, berat: 230 },
      { id: 'M', dada: 114, panjang: 70, bahu: 49, lengan: 23, berat: 245 },
      { id: 'L', dada: 120, panjang: 72, bahu: 51, lengan: 24, berat: 260 },
      { id: 'XL', dada: 126, panjang: 74, bahu: 53, lengan: 25, berat: 275 },
      { id: 'XXL', dada: 132, panjang: 76, bahu: 55, lengan: 26, berat: 290 },
    ],
    stok: {
      'gerimis-nila': [4, 7, 6, 3, 1],
      'pematang-soga': [2, 5, 4, 2, 0],
      'cacah-lumut': [3, 4, 0, 2, 2],
      'kotak-bata': [1, 3, 3, 1, 0],
    },
    padanan: ['celana-tali', 'kulot-lebar'],
    baru: false,
  },
  {
    slug: 'kemeja-lajur-panjang',
    nama: 'Kemeja Lajur Panjang',
    jenis: 'kemeja-panjang',
    kategori: 'atasan',
    urutan: 3,
    ringkas: 'Kemeja lengan panjang berkerah runcing untuk kerja dan acara resmi santai.',
    deskripsi:
      'Potongan reguler yang rapi dimasukkan ke celana atau dibiarkan di luar. Kerahnya berdiri dengan kaki kerah, manset berkancing satu, dan ujung bawah melengkung supaya tidak keluar saat dipakai duduk.',
    detail: ['Kerah runcing dengan kaki kerah', 'Manset satu kancing', 'Ujung bawah melengkung', 'Delapan kancing batok kelapa'],
    potongan: 'reguler',
    acuan: 'dada',
    lengan: 'panjang',
    tertutup: true,
    kain: ['gerimis-nila', 'polos-arang', 'lajur-kunyit'],
    tambahanKain: {},
    harga: 289000,
    ukuran: [
      { id: 'S', dada: 100, panjang: 72, bahu: 43, lengan: 58, berat: 270 },
      { id: 'M', dada: 106, panjang: 74, bahu: 45, lengan: 59, berat: 285 },
      { id: 'L', dada: 112, panjang: 76, bahu: 47, lengan: 60, berat: 300 },
      { id: 'XL', dada: 118, panjang: 78, bahu: 49, lengan: 61, berat: 315 },
      { id: 'XXL', dada: 124, panjang: 80, bahu: 51, lengan: 62, berat: 330 },
    ],
    stok: {
      'gerimis-nila': [2, 6, 5, 4, 2],
      'polos-arang': [3, 4, 4, 2, 1],
      'lajur-kunyit': [1, 2, 2, 0, 0],
    },
    padanan: ['celana-tali', 'jaket-kerja'],
    baru: false,
  },
  {
    slug: 'blus-shanghai',
    nama: 'Blus Shanghai',
    jenis: 'blus-shanghai',
    kategori: 'atasan',
    urutan: 2,
    ringkas: 'Blus kerah shanghai dengan kancing tali dan lengan tiga perempat.',
    deskripsi:
      'Kerah berdiri setinggi 3 cm dan empat kancing tali di belahan dada, mengambil bentuk baju lama dengan potongan yang lebih longgar. Lengan tiga perempat tidak mengganggu saat bekerja, dan belahan samping membuatnya pas dipakai dengan rok atau kulot.',
    detail: ['Kerah shanghai 3 cm', 'Empat kancing tali (kain)', 'Lengan tiga perempat', 'Belahan samping 6 cm'],
    potongan: 'longgar',
    acuan: 'dada',
    lengan: 'tiga perempat',
    tertutup: false,
    kain: ['lajur-senja', 'gerimis-nila', 'kotak-bata'],
    tambahanKain: { 'lajur-senja': 15000 },
    harga: 239000,
    ukuran: [
      { id: 'S', dada: 98, panjang: 62, bahu: 40, lengan: 40, berat: 210 },
      { id: 'M', dada: 104, panjang: 63, bahu: 42, lengan: 41, berat: 220 },
      { id: 'L', dada: 110, panjang: 64, bahu: 44, lengan: 42, berat: 230 },
      { id: 'XL', dada: 116, panjang: 65, bahu: 46, lengan: 43, berat: 240 },
    ],
    stok: {
      'lajur-senja': [3, 5, 2, 1],
      'gerimis-nila': [4, 4, 3, 2],
      'kotak-bata': [0, 2, 3, 1],
    },
    padanan: ['rok-lilit', 'kulot-lebar'],
    baru: true,
  },
  {
    slug: 'tunik-kebun',
    nama: 'Tunik Kebun',
    jenis: 'tunik-kebun',
    kategori: 'atasan',
    urutan: 4,
    ringkas: 'Tunik selutut berlengan panjang, longgar dan menutup panggul.',
    deskripsi:
      'Tunik panjang yang menutup panggul dengan potongan sedikit melebar ke bawah. Kerah shanghai, kancing sampai dada, belahan samping tinggi supaya leluasa melangkah, dan saku di kedua sisi yang tersembunyi di jahitan.',
    detail: ['Panjang ±100 cm, sekitar lutut', 'Saku di jahitan samping', 'Belahan samping 26 cm', 'Ramah dipakai dengan kerudung'],
    potongan: 'longgar',
    acuan: 'dada',
    lengan: 'panjang',
    tertutup: true,
    kain: ['cacah-lumut', 'polos-arang', 'gerimis-nila'],
    tambahanKain: {},
    harga: 319000,
    ukuran: [
      { id: 'S', dada: 102, pinggul: 112, panjang: 98, lengan: 56, berat: 330 },
      { id: 'M', dada: 108, pinggul: 118, panjang: 100, lengan: 57, berat: 345 },
      { id: 'L', dada: 114, pinggul: 124, panjang: 102, lengan: 58, berat: 360 },
      { id: 'XL', dada: 120, pinggul: 130, panjang: 104, lengan: 59, berat: 375 },
      { id: 'XXL', dada: 126, pinggul: 136, panjang: 106, lengan: 60, berat: 390 },
    ],
    stok: {
      'cacah-lumut': [2, 4, 4, 3, 1],
      'polos-arang': [3, 5, 4, 2, 2],
      'gerimis-nila': [1, 3, 2, 2, 0],
    },
    padanan: ['kulot-lebar', 'kerudung-segi-empat'],
    baru: false,
  },
  {
    slug: 'outer-sore',
    nama: 'Outer Sore',
    jenis: 'outer-sore',
    kategori: 'luaran',
    urutan: 5,
    ringkas: 'Luaran panjang model kimono yang dipakai terbuka di atas baju apa saja.',
    deskripsi:
      'Luaran sepanjang betis dengan pita kerah lebar yang dipotong melintang, jadi garis kainnya berlawanan arah dengan badan. Lengan lebar tiga perempat muat dipakai di atas kemeja berlengan panjang.',
    detail: ['Dipakai terbuka, tanpa kancing', 'Pita kerah melintang', 'Lengan lebar tiga perempat', 'Dua ukuran: S/M dan L/XL'],
    potongan: 'oversize',
    acuan: 'dada',
    lengan: 'tiga perempat',
    tertutup: true,
    kain: ['lajur-senja', 'pematang-soga', 'polos-arang'],
    tambahanKain: { 'lajur-senja': 15000 },
    harga: 349000,
    ukuran: [
      { id: 'S/M', dada: 124, panjang: 104, lengan: 44, berat: 420 },
      { id: 'L/XL', dada: 136, panjang: 108, lengan: 46, berat: 460 },
    ],
    stok: {
      'lajur-senja': [3, 2],
      'pematang-soga': [4, 3],
      'polos-arang': [5, 4],
    },
    padanan: ['terusan-pasar', 'blus-shanghai'],
    baru: true,
  },
  {
    slug: 'jaket-kerja',
    nama: 'Jaket Kerja',
    jenis: 'jaket-kerja',
    kategori: 'luaran',
    urutan: 6,
    ringkas: 'Jaket kotak sepinggul dengan tiga saku tempel, dari lurik yang lebih tebal.',
    deskripsi:
      'Jaket kerja model lama yang dipakai di atas kaus atau kemeja. Dijahit dari lurik tenun rapat yang lebih tebal dari kain kemeja kami, dengan tiga saku tempel, lima kancing, dan jahitan tindas ganda di bahu.',
    detail: ['Lurik tenun rapat ±220 g/m²', 'Tiga saku tempel', 'Lima kancing batok kelapa', 'Jahitan tindas ganda'],
    potongan: 'longgar',
    acuan: 'dada',
    lengan: 'panjang',
    tertutup: true,
    kain: ['polos-arang', 'gerimis-nila'],
    tambahanKain: {},
    harga: 389000,
    ukuran: [
      { id: 'S', dada: 112, panjang: 68, bahu: 48, lengan: 60, berat: 560 },
      { id: 'M', dada: 118, panjang: 70, bahu: 50, lengan: 61, berat: 590 },
      { id: 'L', dada: 124, panjang: 72, bahu: 52, lengan: 62, berat: 620 },
      { id: 'XL', dada: 130, panjang: 74, bahu: 54, lengan: 63, berat: 650 },
    ],
    stok: {
      'polos-arang': [2, 3, 3, 1],
      'gerimis-nila': [1, 2, 0, 1],
    },
    padanan: ['kemeja-teras', 'celana-tali'],
    baru: false,
  },
  {
    slug: 'terusan-pasar',
    nama: 'Terusan Pasar',
    jenis: 'terusan-pasar',
    kategori: 'terusan',
    urutan: 7,
    ringkas: 'Dress sebetis berpinggang karet dengan lengan sesiku dan saku samping.',
    deskripsi:
      'Badan atas yang pas, pinggang karet yang mengikuti badan, dan rok lebar sebetis. Kancing di belahan dada memudahkan dipakai, dan saku di kedua sisi cukup untuk ponsel dan dompet kecil.',
    detail: ['Pinggang karet berkerut', 'Kancing belahan dada', 'Saku di jahitan samping', 'Panjang ±120 cm, sebetis'],
    potongan: 'pas',
    acuan: 'dada',
    lengan: 'sesiku',
    tertutup: false,
    kain: ['kotak-bata', 'gerimis-nila', 'lajur-senja'],
    tambahanKain: { 'lajur-senja': 15000 },
    harga: 369000,
    ukuran: [
      { id: 'S', dada: 92, pinggang: [64, 82], panjang: 118, lengan: 30, berat: 400 },
      { id: 'M', dada: 98, pinggang: [70, 88], panjang: 120, lengan: 31, berat: 420 },
      { id: 'L', dada: 104, pinggang: [76, 94], panjang: 122, lengan: 32, berat: 440 },
      { id: 'XL', dada: 110, pinggang: [82, 100], panjang: 124, lengan: 33, berat: 460 },
    ],
    stok: {
      'kotak-bata': [2, 3, 2, 1],
      'gerimis-nila': [3, 4, 3, 2],
      'lajur-senja': [1, 2, 1, 0],
    },
    padanan: ['outer-sore', 'tas-jinjing'],
    baru: false,
  },
  {
    slug: 'kulot-lebar',
    nama: 'Kulot Lebar',
    jenis: 'kulot-lebar',
    kategori: 'bawahan',
    urutan: 8,
    ringkas: 'Kulot sebetis berkaki lebar dengan pinggang karet dan lipit depan.',
    deskripsi:
      'Dari jauh terlihat seperti rok, saat melangkah tetap celana. Pinggang karetnya lebar dan tidak menekan, ada lipit di depan supaya kain jatuh rapi, dan saku miring di kedua sisi.',
    detail: ['Pinggang karet 4 cm', 'Lipit depan', 'Saku miring', 'Panjang ±90 cm, sebetis'],
    potongan: 'longgar',
    acuan: 'pinggul',
    kelonggaran: [16, 40],
    tertutup: true,
    kain: ['polos-arang', 'gerimis-nila', 'pematang-soga'],
    tambahanKain: {},
    harga: 229000,
    ukuran: [
      { id: 'S', pinggang: [62, 80], pinggul: 112, panjang: 88, berat: 330 },
      { id: 'M', pinggang: [68, 86], pinggul: 118, panjang: 90, berat: 345 },
      { id: 'L', pinggang: [74, 92], pinggul: 124, panjang: 92, berat: 360 },
      { id: 'XL', pinggang: [80, 98], pinggul: 130, panjang: 94, berat: 375 },
    ],
    stok: {
      'polos-arang': [4, 6, 5, 3],
      'gerimis-nila': [2, 3, 2, 2],
      'pematang-soga': [1, 2, 2, 0],
    },
    padanan: ['blus-shanghai', 'tunik-kebun'],
    baru: false,
  },
  {
    slug: 'celana-tali',
    nama: 'Celana Lurus Tali',
    jenis: 'celana-tali',
    kategori: 'bawahan',
    urutan: 9,
    ringkas: 'Celana lurus semata kaki dengan pinggang karet bertali serut.',
    deskripsi:
      'Celana sehari-hari yang bisa dipakai ke kantor santai maupun jalan pagi. Pinggang karet dengan tali serut, kaki lurus dengan garis setrika, dan dua saku samping yang cukup dalam.',
    detail: ['Pinggang karet + tali serut', 'Kaki lurus, garis setrika', 'Dua saku samping', 'Panjang ±100 cm'],
    potongan: 'reguler',
    acuan: 'pinggul',
    kelonggaran: [8, 16],
    tertutup: true,
    kain: ['polos-arang', 'cacah-lumut'],
    tambahanKain: {},
    harga: 259000,
    ukuran: [
      { id: 'S', pinggang: [64, 82], pinggul: 100, paha: 62, panjang: 98, berat: 380 },
      { id: 'M', pinggang: [70, 88], pinggul: 106, paha: 65, panjang: 100, berat: 395 },
      { id: 'L', pinggang: [76, 94], pinggul: 112, paha: 68, panjang: 102, berat: 410 },
      { id: 'XL', pinggang: [82, 100], pinggul: 118, paha: 71, panjang: 104, berat: 425 },
    ],
    stok: {
      'polos-arang': [3, 5, 4, 2],
      'cacah-lumut': [2, 2, 1, 1],
    },
    padanan: ['kemeja-teras', 'kemeja-lajur-panjang'],
    baru: false,
  },
  {
    slug: 'rok-lilit',
    nama: 'Rok Lilit Tali',
    jenis: 'rok-lilit',
    kategori: 'bawahan',
    urutan: 10,
    ringkas: 'Rok lilit sebetis dengan tali di pinggang, satu ukuran yang bisa diatur.',
    deskripsi:
      'Rok yang dililitkan lalu diikat di sisi pinggang, jadi satu ukuran cukup untuk lingkar pinggang 60–100 cm. Tumpukan kainnya lebar, sehingga tetap tertutup saat duduk maupun berjalan.',
    detail: ['Satu ukuran, pinggang 60–100 cm', 'Tali diikat di samping', 'Tumpukan kain 30 cm', 'Panjang ±86 cm'],
    potongan: 'longgar',
    acuan: 'pinggang',
    tertutup: true,
    kain: ['lajur-senja', 'kotak-bata', 'lajur-kunyit', 'polos-arang'],
    tambahanKain: { 'lajur-senja': 15000 },
    harga: 219000,
    ukuran: [{ id: 'Satu ukuran', pinggang: [60, 100], panjang: 86, berat: 300 }],
    stok: {
      'lajur-senja': [4],
      'kotak-bata': [3],
      'lajur-kunyit': [5],
      'polos-arang': [2],
    },
    padanan: ['blus-shanghai', 'kemeja-teras'],
    baru: false,
  },
  {
    slug: 'kerudung-segi-empat',
    nama: 'Kerudung Segi Empat',
    jenis: 'kerudung',
    kategori: 'aksesori',
    urutan: 11,
    ringkas: 'Kerudung segi empat 115 cm dari lurik tipis yang tidak licin.',
    deskripsi:
      'Ditenun lebih renggang dari kain kemeja sehingga ringan dan mudah dibentuk. Permukaannya tidak licin, jadi tidak gampang bergeser, dan keempat tepinya dijahit som kecil.',
    detail: ['Lurik tipis ±110 g/m²', 'Ukuran 115 × 115 cm', 'Tepi dijahit som', 'Tidak licin, mudah dibentuk'],
    potongan: null,
    acuan: null,
    tertutup: true,
    kain: ['gerimis-nila', 'polos-arang', 'lajur-kunyit', 'cacah-lumut'],
    tambahanKain: {},
    harga: 89000,
    ukuran: [{ id: '115 × 115 cm', berat: 110 }],
    stok: { 'gerimis-nila': [6], 'polos-arang': [5], 'lajur-kunyit': [3], 'cacah-lumut': [4] },
    padanan: ['tunik-kebun', 'kulot-lebar'],
    baru: false,
  },
  {
    slug: 'syal-lurik',
    nama: 'Syal Lurik',
    jenis: 'syal',
    kategori: 'aksesori',
    urutan: 12,
    ringkas: 'Syal panjang berumbai dari sisa benang lungsin.',
    deskripsi:
      'Kedua ujungnya dibiarkan berumbai dari benang lungsin yang tersisa setelah kain dilepas dari alat tenun, lalu dipilin supaya tidak terurai. Hangat di ruangan berpendingin tanpa terasa tebal.',
    detail: ['Ukuran 40 × 180 cm', 'Rumbai benang dipilin', 'Ringan, tidak gatal', 'Bisa dililit atau digantung'],
    potongan: null,
    acuan: null,
    tertutup: false,
    kain: ['lajur-senja', 'gerimis-nila', 'pematang-soga'],
    tambahanKain: {},
    harga: 79000,
    ukuran: [{ id: '40 × 180 cm', berat: 120 }],
    stok: { 'lajur-senja': [5], 'gerimis-nila': [4], 'pematang-soga': [0] },
    padanan: ['blus-shanghai', 'outer-sore'],
    baru: false,
  },
  {
    slug: 'tas-jinjing',
    nama: 'Tas Jinjing',
    jenis: 'tas-jinjing',
    kategori: 'aksesori',
    urutan: 13,
    ringkas: 'Tas jinjing berlapis dalam, dari potongan kain sisa jahitan baju.',
    deskripsi:
      'Dijahit dari potongan kain yang tersisa setelah pola baju dipotong, jadi letak garisnya bisa sedikit berbeda dari gambar. Berlapis kain blacu di dalam, dengan satu saku kecil dan tali yang muat di bahu.',
    detail: ['Ukuran 38 × 40 cm', 'Tali bahu 70 cm', 'Lapisan dalam blacu', 'Satu saku dalam'],
    potongan: null,
    acuan: null,
    tertutup: false,
    kain: ['kotak-bata', 'pematang-soga', 'gerimis-nila'],
    tambahanKain: {},
    harga: 119000,
    ukuran: [{ id: '38 × 40 cm', berat: 260 }],
    stok: { 'kotak-bata': [3], 'pematang-soga': [4], 'gerimis-nila': [2] },
    padanan: ['terusan-pasar', 'kemeja-teras'],
    baru: false,
  },
  {
    slug: 'kain-lurik-meteran',
    nama: 'Kain Lurik per Meter',
    jenis: 'kain',
    kategori: 'kain',
    urutan: 14,
    ringkas: 'Kain lurik lebar 110 cm, dipotong per meter untuk dijahit sendiri.',
    deskripsi:
      'Kain yang sama dengan yang kami pakai untuk baju, sudah dicuci sekali dan dijemur sebelum dipotong sehingga susutnya tinggal sedikit. Dipotong lurus mengikuti benang pakan, dengan pinggiran kain (tepi tenun) di kedua sisi.',
    detail: ['Lebar 110 cm', 'Sudah dicuci sekali', 'Dipotong mengikuti benang pakan', 'Untuk kemeja ±2 m, kulot ±2,5 m'],
    potongan: null,
    acuan: null,
    tertutup: false,
    kain: ['gerimis-nila', 'pematang-soga', 'cacah-lumut', 'kotak-bata', 'lajur-senja', 'polos-arang', 'lajur-kunyit'],
    tambahanKain: { 'lajur-senja': 10000 },
    harga: 68000,
    ukuran: [
      { id: '1 meter', meter: 1, harga: 68000, berat: 170 },
      { id: '2 meter', meter: 2, harga: 132000, berat: 340 },
      { id: '3 meter', meter: 3, harga: 192000, berat: 510 },
    ],
    stok: {
      'gerimis-nila': [12, 8, 5],
      'pematang-soga': [9, 6, 3],
      'cacah-lumut': [10, 6, 4],
      'kotak-bata': [6, 4, 2],
      'lajur-senja': [5, 3, 1],
      'polos-arang': [14, 9, 6],
      'lajur-kunyit': [7, 4, 0],
    },
    padanan: [],
    baru: false,
  },
];

// Padanan pilihan: ditampilkan di beranda, lookbook, dan dipakai sebagai titik awal padu-padan.
export const padanan = [
  {
    id: 'senin-rapat',
    nama: 'Senin, rapat pagi',
    ket: 'Kemeja berlengan panjang yang rapi tanpa terasa kaku, dengan celana gelap yang menyeimbangkan garisnya.',
    lapis: [
      { slug: 'kemeja-lajur-panjang', kain: 'gerimis-nila' },
      { slug: 'celana-tali', kain: 'polos-arang' },
    ],
    sosok: { kulit: 'sawo', rambut: 'pendek', sepatu: '#2b2a2d' },
    latar: 'jendela',
  },
  {
    id: 'pasar-sabtu',
    nama: 'Pasar Sabtu pagi',
    ket: 'Tunik selutut dan kulot lebar: tertutup, adem, dan leluasa saat berjalan di antara lapak.',
    lapis: [
      { slug: 'tunik-kebun', kain: 'cacah-lumut' },
      { slug: 'kulot-lebar', kain: 'polos-arang' },
      { slug: 'kerudung-segi-empat', kain: 'lajur-kunyit' },
      { slug: 'tas-jinjing', kain: 'kotak-bata' },
    ],
    sosok: { kulit: 'langsat', rambut: 'sanggul', sepatu: '#6d4a33' },
    latar: 'pasar',
  },
  {
    id: 'kondangan-sore',
    nama: 'Kondangan sore',
    ket: 'Terusan kotak bata dengan luaran polos di atasnya, supaya warnanya menonjol tanpa berlebihan.',
    lapis: [
      { slug: 'terusan-pasar', kain: 'kotak-bata' },
      { slug: 'outer-sore', kain: 'polos-arang' },
    ],
    sosok: { kulit: 'kuning', rambut: 'sanggul', sepatu: '#8a3b2a' },
    latar: 'teras',
  },
  {
    id: 'kereta-mudik',
    nama: 'Naik kereta pulang kampung',
    ket: 'Berlapis untuk gerbong yang dingin: kemeja santai, jaket kerja, dan celana yang tidak mudah kusut.',
    lapis: [
      { slug: 'kemeja-teras', kain: 'pematang-soga' },
      { slug: 'jaket-kerja', kain: 'polos-arang' },
      { slug: 'celana-tali', kain: 'cacah-lumut' },
    ],
    sosok: { kulit: 'gelap', rambut: 'ikat', sepatu: '#2b2a2d' },
    latar: 'kereta',
  },
  {
    id: 'kedai-kopi',
    nama: 'Kerja dari kedai kopi',
    ket: 'Blus lajur senja dengan rok lilit polos, lalu syal untuk ruangan yang pendinginnya terlalu kencang.',
    lapis: [
      { slug: 'blus-shanghai', kain: 'lajur-senja' },
      { slug: 'rok-lilit', kain: 'polos-arang' },
      { slug: 'syal-lurik', kain: 'gerimis-nila' },
    ],
    sosok: { kulit: 'sawo', rambut: 'bob', sepatu: '#3b2a20' },
    latar: 'kedai',
  },
];

export const zonaOngkir = [
  {
    id: 'z1',
    nama: 'Zona 1',
    cakupan: 'Jawa Tengah dan DI Yogyakarta',
    provinsi: ['Jawa Tengah', 'DI Yogyakarta'],
    layanan: { reguler: { perKg: 8000, estimasi: '1–2 hari' }, kilat: { perKg: 15000, estimasi: '1 hari' } },
  },
  {
    id: 'z2',
    nama: 'Zona 2',
    cakupan: 'Jawa lainnya dan Bali',
    provinsi: ['DKI Jakarta', 'Jawa Barat', 'Banten', 'Jawa Timur', 'Bali'],
    layanan: { reguler: { perKg: 12000, estimasi: '2–3 hari' }, kilat: { perKg: 22000, estimasi: '1–2 hari' } },
  },
  {
    id: 'z3',
    nama: 'Zona 3',
    cakupan: 'Sumatra, Kalimantan, Sulawesi, NTB',
    provinsi: [
      'Aceh', 'Sumatera Utara', 'Sumatera Barat', 'Riau', 'Kepulauan Riau', 'Jambi', 'Sumatera Selatan',
      'Kepulauan Bangka Belitung', 'Bengkulu', 'Lampung', 'Nusa Tenggara Barat', 'Kalimantan Barat',
      'Kalimantan Tengah', 'Kalimantan Selatan', 'Kalimantan Timur', 'Kalimantan Utara', 'Sulawesi Utara',
      'Gorontalo', 'Sulawesi Tengah', 'Sulawesi Barat', 'Sulawesi Selatan', 'Sulawesi Tenggara',
    ],
    layanan: { reguler: { perKg: 24000, estimasi: '3–5 hari' }, kilat: { perKg: 40000, estimasi: '2–3 hari' } },
  },
  {
    id: 'z4',
    nama: 'Zona 4',
    cakupan: 'NTT, Maluku, Papua',
    provinsi: [
      'Nusa Tenggara Timur', 'Maluku', 'Maluku Utara', 'Papua', 'Papua Barat', 'Papua Barat Daya', 'Papua Tengah',
      'Papua Pegunungan', 'Papua Selatan',
    ],
    layanan: { reguler: { perKg: 38000, estimasi: '5–8 hari' }, kilat: null },
  },
];

export const layananKirim = [
  { id: 'reguler', nama: 'Reguler', ket: 'Lebih hemat' },
  { id: 'kilat', nama: 'Kilat', ket: 'Lebih cepat' },
];

export const provinsi = [
  'Aceh', 'Sumatera Utara', 'Sumatera Barat', 'Riau', 'Kepulauan Riau', 'Jambi', 'Sumatera Selatan',
  'Kepulauan Bangka Belitung', 'Bengkulu', 'Lampung', 'DKI Jakarta', 'Jawa Barat', 'Banten', 'Jawa Tengah',
  'DI Yogyakarta', 'Jawa Timur', 'Bali', 'Nusa Tenggara Barat', 'Nusa Tenggara Timur', 'Kalimantan Barat',
  'Kalimantan Tengah', 'Kalimantan Selatan', 'Kalimantan Timur', 'Kalimantan Utara', 'Sulawesi Utara',
  'Gorontalo', 'Sulawesi Tengah', 'Sulawesi Barat', 'Sulawesi Selatan', 'Sulawesi Tenggara', 'Maluku',
  'Maluku Utara', 'Papua', 'Papua Barat', 'Papua Barat Daya', 'Papua Tengah', 'Papua Pegunungan', 'Papua Selatan',
];

export const metodeBayar = [
  {
    id: 'transfer',
    nama: 'Transfer bank',
    ket: 'Nomor rekening contoh muncul setelah pesanan dibuat.',
    instruksi: 'Transfer ke rekening contoh 000-0000-000 a.n. Lungsin Demo. Nomor ini tidak aktif, jadi jangan benar-benar mentransfer.',
  },
  {
    id: 'qris',
    nama: 'QRIS',
    ket: 'Kode QR contoh muncul setelah pesanan dibuat.',
    instruksi: 'Di toko sungguhan, kode QR muncul di sini untuk dipindai dari aplikasi bank atau dompet digital. Di demo ini tidak ada kode yang bisa dipindai.',
  },
  {
    id: 'ewallet',
    nama: 'Dompet digital',
    ket: 'Tautan bayar contoh, tidak menarik saldo apa pun.',
    instruksi: 'Di toko sungguhan, tombol bayar membuka aplikasi dompet digital. Di demo ini tidak ada saldo yang ditarik.',
  },
];

export const statusPesanan = [
  { id: 'menunggu', label: 'Menunggu pembayaran', ket: 'Pesanan dibuat dan menunggu dibayar.' },
  { id: 'dibayar', label: 'Dibayar', ket: 'Pembayaran diterima.' },
  { id: 'dikemas', label: 'Dikemas', ket: 'Baju dilipat, diberi kertas, dan dimasukkan ke kantong kertas.' },
  { id: 'dikirim', label: 'Dikirim', ket: 'Paket sudah di tangan kurir.' },
  { id: 'diterima', label: 'Diterima', ket: 'Paket sampai. Masa tukar ukuran dihitung dari sini.' },
];

export const statusTukar = [
  { id: 'diajukan', label: 'Diajukan', ket: 'Permintaan tukar ukuran masuk. Ukuran baru sudah kami sisihkan.' },
  { id: 'disetujui', label: 'Disetujui', ket: 'Kirim balik barang lama ke alamat bengkel. Ongkir kirim balik ditanggung pembeli.' },
  { id: 'diterima-toko', label: 'Barang lama diterima', ket: 'Barang lama sampai di bengkel dan sudah kami periksa.' },
  { id: 'dikirim', label: 'Ukuran baru dikirim', ket: 'Ongkir pengiriman ukuran baru kami tanggung.' },
  { id: 'selesai', label: 'Selesai', ket: 'Ukuran baru sudah diterima.' },
];

export const alasanTukar = [
  { id: 'kebesaran', label: 'Kebesaran' },
  { id: 'kekecilan', label: 'Kekecilan' },
  { id: 'panjang', label: 'Panjangnya kurang pas' },
  { id: 'lain', label: 'Alasan lain' },
];

export const faq = [
  {
    grup: 'Ukuran dan tukar ukuran',
    id: 'ukuran',
    isi: [
      {
        t: 'Bagaimana memilih ukuran yang pas?',
        j: 'Ukur lingkar dada, pinggang, dan pinggul badanmu, lalu simpan di Ukuranku. Setiap halaman produk akan menandai ukuran yang paling dekat dengan potongan baju itu dan menjelaskan alasannya. Semua angka di tabel ukuran kami diukur dari baju, bukan dari badan.',
      },
      {
        t: 'Bolehkah tukar ukuran?',
        j: 'Boleh, sekali untuk setiap barang, dalam 14 hari setelah paket diterima. Barang belum dicuci atau dipakai keluar rumah, dan label masih terpasang. Ajukan dari halaman pesanan; ukuran baru langsung kami sisihkan selama stoknya ada.',
      },
      {
        t: 'Siapa yang menanggung ongkir tukar ukuran?',
        j: 'Ongkir mengirim balik barang lama ke bengkel kami ditanggung pembeli. Ongkir mengirim ukuran baru ke alamatmu kami tanggung.',
      },
      {
        t: 'Kalau ukuran yang kuinginkan habis?',
        j: 'Kamu bisa memilih kain lain di ukuran yang sama, atau mengembalikan barang dan menerima pengembalian dana penuh di luar ongkir pengiriman awal.',
      },
      {
        t: 'Apakah kain lurik akan menyusut?',
        j: 'Kain kami cuci dan jemur sekali sebelum dipotong, jadi susut yang tersisa sekitar 1–2 persen. Cuci dengan air dingin dan jangan dikeringkan dengan mesin pengering supaya ukurannya tetap.',
      },
    ],
  },
  {
    grup: 'Pengiriman',
    id: 'pengiriman',
    isi: [
      {
        t: 'Dari mana pesanan dikirim?',
        j: 'Dari bengkel jahit kami di Klaten, Jawa Tengah. Ongkir dihitung otomatis di checkout dari provinsi tujuan dan berat kiriman. Angka di toko demo ini contoh tarif, bukan tarif kurir sungguhan.',
      },
      {
        t: 'Kapan pesanan dikemas?',
        j: 'Pesanan yang dibayar sebelum pukul 13.00 WIB pada hari kerja dikemas hari itu juga. Pesanan setelahnya dikemas pada hari kerja berikutnya.',
      },
      {
        t: 'Ada potongan ongkir?',
        j: 'Ada. Untuk belanja minimal Rp500.000, ongkir dipotong sampai Rp25.000. Potongannya langsung terlihat di keranjang dan checkout.',
      },
      {
        t: 'Bisa dibungkus untuk hadiah?',
        j: 'Bisa. Pilih bungkus kado di checkout (Rp12.000): baju dibungkus dengan potongan kain lurik sisa jahitan dan diikat tali, tanpa nota harga di dalam paket.',
      },
    ],
  },
  {
    grup: 'Pembayaran',
    id: 'pembayaran',
    isi: [
      {
        t: 'Cara bayar apa saja yang tersedia?',
        j: 'Transfer bank, QRIS, dan dompet digital. Pesanan menunggu pembayaran selama 24 jam, setelah itu stoknya dilepas lagi.',
      },
      {
        t: 'Apakah bisa bayar di tempat (COD)?',
        j: 'Belum. Karena setiap baju bisa ditukar ukurannya, kami memilih pembayaran di muka supaya stok ukuran pengganti bisa langsung disisihkan.',
      },
    ],
  },
  {
    grup: 'Perawatan kain',
    id: 'perawatan',
    isi: [
      {
        t: 'Kenapa warnanya sedikit luntur di cucian pertama?',
        j: 'Benang lurik dicelup sebelum ditenun, dan sisa pewarna yang belum terikat bisa keluar di dua atau tiga cucian pertama. Cuci terpisah dengan air dingin, jangan direndam lama, dan jemur di tempat teduh.',
      },
      {
        t: 'Bolehkah dicuci dengan mesin?',
        j: 'Boleh, dengan putaran lembut, air dingin, dan baju dibalik. Hindari pemutih dan pengering mesin. Kerudung dan syal lebih awet dicuci tangan.',
      },
      {
        t: 'Bagaimana menyetrikanya?',
        j: 'Setrika dengan panas sedang dari sisi dalam selagi kain masih sedikit lembap. Dari sisi luar, lurik yang gelap bisa jadi mengilap.',
      },
    ],
  },
  {
    grup: 'Tentang toko demo ini',
    id: 'demo',
    isi: [
      {
        t: 'Apakah Lungsin toko sungguhan?',
        j: 'Bukan. Lungsin adalah toko fiktif untuk demo. Produk, harga, stok, alamat, dan pesanan contohnya rekaan, dan tidak ada barang yang benar-benar dikirim.',
      },
      {
        t: 'Apakah pembayaran di situs ini sungguhan?',
        j: 'Tidak. Transfer bank, QRIS, dan dompet digital hanya contoh alur. Tidak ada uang yang ditarik, dan tombol "Simulasikan pembayaran" hanya mengubah status pesanan di browser kamu.',
      },
      {
        t: 'Di mana data pesanan dan ukuranku disimpan?',
        j: 'Hanya di browser yang kamu pakai (localStorage). Tidak ada yang dikirim ke server. Menghapus data situs di browser akan menghapus keranjang, pesanan, ukuran tersimpan, dan perubahan stok.',
      },
    ],
  },
];

export function cariProduk(slug) {
  return produk.find((p) => p.slug === slug);
}

export function cariKategori(id) {
  return kategori.find((k) => k.id === id);
}

export function cariPadanan(id) {
  return padanan.find((p) => p.id === id);
}
