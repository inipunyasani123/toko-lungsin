// Logika katalog: varian (kain × ukuran), harga, stok (data dasar + perubahan dari dasbor), dan saringan.
import { produk, kategori, cariProduk, cariKain } from './data.js';

export function kunciVarian(kainId, ukuranId) {
  return `${kainId}/${ukuranId}`;
}

export function cariUkuran(p, ukuranId) {
  return p.ukuran.find((u) => u.id === ukuranId) || p.ukuran[0];
}

export function hargaVarian(p, kainId, ukuranId) {
  const u = cariUkuran(p, ukuranId);
  const dasar = u.harga ?? p.harga;
  const tambahan = (p.tambahanKain || {})[kainId] || 0;
  return dasar + tambahan * (u.meter || 1);
}

export function beratVarian(p, ukuranId) {
  return cariUkuran(p, ukuranId).berat;
}

export function satuUkuran(p) {
  return p.ukuran.length === 1;
}

export function labelVarian(p, kainId, ukuranId) {
  const k = cariKain(kainId);
  return `${k ? k.nama : kainId} · ${ukuranId}`;
}

export function stokDasar(p, kainId, ukuranId) {
  const i = p.ukuran.findIndex((u) => u.id === ukuranId);
  const baris = p.stok[kainId];
  if (!baris || i < 0) return 0;
  return baris[i] ?? 0;
}

// inventaris = { [slug]: { aktif?: boolean, stok?: { [kunciVarian]: number } } }
export function stokVarian(p, kainId, ukuranId, inventaris) {
  const ubah = inventaris?.[p.slug]?.stok?.[kunciVarian(kainId, ukuranId)];
  return typeof ubah === 'number' ? ubah : stokDasar(p, kainId, ukuranId);
}

export function produkAktif(p, inventaris) {
  const a = inventaris?.[p.slug]?.aktif;
  return a === undefined ? true : a;
}

export function semuaVarian(p) {
  const hasil = [];
  for (const k of p.kain) for (const u of p.ukuran) hasil.push({ kain: k, ukuran: u.id, kunci: kunciVarian(k, u.id) });
  return hasil;
}

export function totalStok(p, inventaris) {
  return semuaVarian(p).reduce((n, v) => n + stokVarian(p, v.kain, v.ukuran, inventaris), 0);
}

export function stokKain(p, kainId, inventaris) {
  return p.ukuran.reduce((n, u) => n + stokVarian(p, kainId, u.id, inventaris), 0);
}

export function stokUkuran(p, ukuranId, inventaris) {
  return p.kain.reduce((n, k) => n + stokVarian(p, k, ukuranId, inventaris), 0);
}

export function rentangHarga(p) {
  const harga = [];
  for (const k of p.kain) for (const u of p.ukuran) harga.push(hargaVarian(p, k, u.id));
  return { min: Math.min(...harga), max: Math.max(...harga) };
}

export function hargaTermurah(p) {
  return rentangHarga(p).min;
}

// Varian pertama yang masih ada stoknya. Ukuran tengah didahulukan karena paling sering dicari.
export function varianAwal(p, inventaris, kainPilihan) {
  const urutU = [...p.ukuran.keys()].sort((a, b) => Math.abs(a - (p.ukuran.length - 1) / 2) - Math.abs(b - (p.ukuran.length - 1) / 2));
  const daftarKain = kainPilihan && p.kain.includes(kainPilihan) ? [kainPilihan, ...p.kain.filter((k) => k !== kainPilihan)] : p.kain;
  for (const k of daftarKain) {
    for (const i of urutU) {
      if (stokVarian(p, k, p.ukuran[i].id, inventaris) > 0) return { kain: k, ukuran: p.ukuran[i].id };
    }
  }
  return { kain: daftarKain[0], ukuran: p.ukuran[urutU[0]].id };
}

export function hitungPerKategori() {
  const hasil = {};
  for (const k of kategori) hasil[k.id] = produk.filter((p) => p.kategori === k.id).length;
  return hasil;
}

export function produkDenganKain(kainId) {
  return produk.filter((p) => p.kain.includes(kainId));
}

export function produkTerkait(p, n = 4) {
  const padan = (p.padanan || []).map(cariProduk).filter(Boolean);
  const sama = produk.filter((x) => x.slug !== p.slug && x.kategori === p.kategori && !padan.includes(x));
  const kainSama = produk.filter((x) => x.slug !== p.slug && !padan.includes(x) && !sama.includes(x) && x.kain.some((k) => p.kain.includes(k)));
  return [...padan, ...sama, ...kainSama].slice(0, n);
}

// Semua label ukuran huruf yang dipakai, untuk saringan "ada di ukuranku"
export const UKURAN_HURUF = ['S', 'M', 'L', 'XL', 'XXL'];

export function cocokUkuran(p, huruf) {
  if (satuUkuran(p)) return true;
  return p.ukuran.some((u) => u.id === huruf || u.id.split('/').includes(huruf));
}

export const rentangFilter = [
  { id: 'bawah-150', label: 'Di bawah Rp150.000', min: 0, max: 149999 },
  { id: '150-300', label: 'Rp150.000–Rp300.000', min: 150000, max: 300000 },
  { id: 'atas-300', label: 'Di atas Rp300.000', min: 300001, max: Infinity },
];

export const urutan = [
  { id: 'pilihan', label: 'Pilihan kami' },
  { id: 'baru', label: 'Terbaru' },
  { id: 'termurah', label: 'Harga terendah' },
  { id: 'termahal', label: 'Harga tertinggi' },
  { id: 'nama', label: 'Nama A–Z' },
];

function normal(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

// filter = { q, kategori: [], kain: [], ukuran: '', harga: '', tertutup: false, urut: '' }
export function saringProduk(daftar, filter, inventaris) {
  const kata = normal(filter.q).split(/\s+/).filter(Boolean);
  const rentang = rentangFilter.find((r) => r.id === filter.harga);
  let hasil = daftar.filter((p) => {
    if (!produkAktif(p, inventaris)) return false;
    if (filter.kategori?.length && !filter.kategori.includes(p.kategori)) return false;
    if (filter.kain?.length && !p.kain.some((k) => filter.kain.includes(k))) return false;
    if (filter.tertutup && !p.tertutup) return false;
    if (filter.ukuran) {
      if (!cocokUkuran(p, filter.ukuran)) return false;
      // ukuran itu harus masih ada stoknya di salah satu kain (yang disaring, bila ada)
      const kainCek = filter.kain?.length ? p.kain.filter((k) => filter.kain.includes(k)) : p.kain;
      const uk = satuUkuran(p) ? [p.ukuran[0]] : p.ukuran.filter((u) => u.id === filter.ukuran || u.id.split('/').includes(filter.ukuran));
      if (!uk.some((u) => kainCek.some((k) => stokVarian(p, k, u.id, inventaris) > 0))) return false;
    }
    if (rentang) {
      const { min, max } = rentangHarga(p);
      if (max < rentang.min || min > rentang.max) return false;
    }
    if (kata.length) {
      const kat = kategori.find((k) => k.id === p.kategori);
      const teks = normal([p.nama, p.ringkas, kat?.nama, p.lengan, ...p.kain.map((k) => cariKain(k)?.nama), ...p.detail].join(' '));
      if (!kata.every((k) => teks.includes(k))) return false;
    }
    return true;
  });
  const urut = filter.urut || 'pilihan';
  hasil = [...hasil].sort((a, b) => {
    if (urut === 'termurah') return hargaTermurah(a) - hargaTermurah(b);
    if (urut === 'termahal') return rentangHarga(b).max - rentangHarga(a).max;
    if (urut === 'baru') return Number(b.baru) - Number(a.baru) || a.urutan - b.urutan;
    if (urut === 'nama') return a.nama.localeCompare(b.nama, 'id');
    return a.urutan - b.urutan;
  });
  return hasil;
}

export { cariProduk };
