// Foto asli (CC0 / domain publik) untuk kartu dan galeri produk. Asal tiap foto ada di public/images/SUMBER.md.
// Foto adalah gambaran jenis dan gaya, bukan foto persis stok tiap kain: warna kain pilihan pembeli tetap
// ditampilkan lewat contoh kain dan ilustrasi manekin. Produk tanpa foto yang cocok tetap memakai ilustrasi.
export const fotoProduk = {
  'kemeja-teras': { src: '/images/katalog-kemeja-teras.webp', alt: 'Kemeja kotak halus terlipat rapi di atas kain handuk, difoto dari atas' },
  'kemeja-lajur-panjang': { src: '/images/katalog-kemeja-lajur-panjang.webp', alt: 'Kemeja lengan panjang bergaris abu-abu terlipat, difoto dari atas' },
  'blus-shanghai': { src: '/images/katalog-blus-shanghai.webp', alt: 'Kemeja bergaris tipis ungu dan merah muda terlipat, difoto dari atas' },
  'tunik-kebun': { src: '/images/katalog-tunik-kebun.webp', alt: 'Kemeja kotak hijau muda terlipat, difoto dari atas' },
  'outer-sore': { src: '/images/katalog-outer-sore.webp', alt: 'Kemeja dan outer berwarna netral tergantung di rak baju' },
  'jaket-kerja': { src: '/images/katalog-jaket-kerja.webp', alt: 'Jaket denim, outer nila, dan kemeja tergantung berdampingan di rak baju' },
  'terusan-pasar': { src: '/images/katalog-terusan-pasar.webp', alt: 'Terusan katun bergaris biru dan putih berkancing depan, dibentangkan datar dan difoto dari atas' },
  'rok-lilit': { src: '/images/katalog-rok-lilit.webp', alt: 'Rok panjang katun cokelat bergaris halus pada rangka pajang, tampak dari dekat' },
  'kerudung-segi-empat': { src: '/images/katalog-kerudung-segi-empat.webp', alt: 'Kain segi empat merah bermotif paisley, tampak dari dekat' },
  'tas-jinjing': { src: '/images/katalog-tas-jinjing.webp', alt: 'Tas jinjing kain tenun bermotif bunga dengan tali kulit, difoto dari depan' },
  'celana-tali': { src: '/images/katalog-celana-tali.webp', alt: 'Celana panjang hitam bergaris tipis putih, dibentangkan datar dan difoto dari atas' },
  'kulot-lebar': { src: '/images/katalog-kulot-lebar.webp', alt: 'Bagian kaki celana lebar hitam bergaris tipis putih, difoto dari atas' },
  'syal-lurik': { src: '/images/katalog-syal-lurik.webp', alt: 'Kain bergaris hitam putih terlipat, tampak dari dekat' },
  'kain-lurik-meteran': { src: '/images/katalog-kain-lurik-meteran.webp', alt: 'Tenunan bergaris warna-warni di atas dasar zaitun, difoto utuh' },
};

export const cariFoto = (slug) => fotoProduk[slug] || null;
