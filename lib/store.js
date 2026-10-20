'use client';

// Penyimpanan di browser (localStorage) untuk keranjang, pesanan, stok, dan profil ukuran.
// Tidak ada server: semua data demo hidup di browser pengunjung.
import { useCallback, useSyncExternalStore } from 'react';
import { cariProduk, site } from './data';
import { stokVarian, kunciVarian } from './katalog';
import {
  buatKode,
  normalKode,
  pesananContoh,
  rakitPesanan,
  rakitTukar,
  terapkanStatus,
  terapkanStatusTukar,
  indeksTukar,
  NOMOR_AWAL_CONTOH,
  NOMOR_AWAL_TUKAR,
} from './pesanan';

export const KUNCI = {
  keranjang: 'lungsin.cart.v1',
  pesanan: 'lungsin.orders.v1',
  inventaris: 'lungsin.inventory.v1',
  nomor: 'lungsin.seq.v1',
  nomorTukar: 'lungsin.seq-exchange.v1',
  contoh: 'lungsin.seeded.v1',
  profil: 'lungsin.measurements.v1',
};

const KOSONG_LIST = Object.freeze([]);
const KOSONG_OBJ = Object.freeze({});

const cadangan = new Map(); // dipakai bila localStorage tidak bisa diakses
const cache = new Map();
const pendengar = new Map();

function ambilMentah(kunci) {
  try {
    const v = window.localStorage.getItem(kunci);
    if (v !== null) return v;
  } catch {
    /* mode privat atau penyimpanan diblokir */
  }
  return cadangan.has(kunci) ? cadangan.get(kunci) : null;
}

function simpanMentah(kunci, mentah) {
  cadangan.set(kunci, mentah);
  try {
    if (mentah === null) window.localStorage.removeItem(kunci);
    else window.localStorage.setItem(kunci, mentah);
  } catch {
    /* tetap jalan dari cadangan memori */
  }
}

function baca(kunci, awal) {
  const mentah = typeof window === 'undefined' ? null : ambilMentah(kunci);
  const c = cache.get(kunci);
  if (c && c.mentah === mentah) return c.nilai;
  let nilai = awal;
  if (mentah) {
    try {
      nilai = JSON.parse(mentah);
    } catch {
      nilai = awal;
    }
  }
  cache.set(kunci, { mentah, nilai });
  return nilai;
}

function kabari(kunci) {
  const set = pendengar.get(kunci);
  if (set) for (const fn of [...set]) fn();
}

function tulis(kunci, nilai) {
  simpanMentah(kunci, nilai === null ? null : JSON.stringify(nilai));
  cache.delete(kunci);
  kabari(kunci);
}

function langganan(kunci, fn) {
  let set = pendengar.get(kunci);
  if (!set) {
    set = new Set();
    pendengar.set(kunci, set);
  }
  set.add(fn);
  const dariTabLain = (e) => {
    if (e.key === kunci || e.key === null) {
      cache.delete(kunci);
      fn();
    }
  };
  window.addEventListener('storage', dariTabLain);
  return () => {
    set.delete(fn);
    window.removeEventListener('storage', dariTabLain);
  };
}

function useSimpanan(kunci, awal) {
  const sub = useCallback((fn) => langganan(kunci, fn), [kunci]);
  const get = useCallback(() => baca(kunci, awal), [kunci, awal]);
  return useSyncExternalStore(sub, get, () => awal);
}

const tanpaLangganan = () => () => {};

// true setelah halaman terpasang di browser (data localStorage sudah terbaca).
export function useTerpasang() {
  return useSyncExternalStore(tanpaLangganan, () => true, () => false);
}

export function useKeranjang() {
  return useSimpanan(KUNCI.keranjang, KOSONG_LIST);
}

export function usePesanan() {
  return useSimpanan(KUNCI.pesanan, KOSONG_LIST);
}

export function useInventaris() {
  return useSimpanan(KUNCI.inventaris, KOSONG_OBJ);
}

export function useProfil() {
  return useSimpanan(KUNCI.profil, KOSONG_OBJ);
}

// ---------- Profil ukuran ("Ukuranku") ----------

export function simpanProfil(profil) {
  const bersih = {};
  for (const k of ['dada', 'pinggang', 'pinggul', 'tinggi']) {
    const n = Number(String(profil[k] ?? '').replace(',', '.'));
    if (Number.isFinite(n) && n > 0) bersih[k] = Math.round(n * 10) / 10;
  }
  tulis(KUNCI.profil, Object.keys(bersih).length ? { ...bersih, disimpan: Date.now() } : null);
}

export function hapusProfil() {
  tulis(KUNCI.profil, null);
}

// ---------- Data contoh ----------

export function pastikanContoh() {
  if (typeof window === 'undefined') return;
  if (ambilMentah(KUNCI.contoh)) return;
  const sekarang = Date.now();
  const contoh = pesananContoh(sekarang);
  const lama = baca(KUNCI.pesanan, KOSONG_LIST).filter((p) => !p.contoh);
  tulis(KUNCI.pesanan, [...contoh, ...lama].sort((a, b) => b.dibuat - a.dibuat));
  tulis(KUNCI.nomor, Math.max(Number(baca(KUNCI.nomor, 0)) || 0, NOMOR_AWAL_CONTOH + contoh.length - 1));
  const jumlahTukar = contoh.reduce((n, p) => n + (p.tukar?.length || 0), 0);
  tulis(KUNCI.nomorTukar, Math.max(Number(baca(KUNCI.nomorTukar, 0)) || 0, NOMOR_AWAL_TUKAR + jumlahTukar - 1));
  tulis(KUNCI.contoh, { waktu: sekarang });
}

export function kembalikanDataContoh() {
  tulis(KUNCI.inventaris, null);
  tulis(KUNCI.pesanan, null);
  tulis(KUNCI.nomor, null);
  tulis(KUNCI.nomorTukar, null);
  tulis(KUNCI.contoh, null);
  pastikanContoh();
}

// ---------- Keranjang ----------

export function itemKunci(it) {
  return `${it.slug}|${kunciVarian(it.kain, it.ukuran)}`;
}

export function tambahKeKeranjang({ slug, kain, ukuran, qty }) {
  const p = cariProduk(slug);
  if (!p) return { ok: false };
  const stok = stokVarian(p, kain, ukuran, baca(KUNCI.inventaris, KOSONG_OBJ));
  const daftar = [...baca(KUNCI.keranjang, KOSONG_LIST)];
  const kunci = itemKunci({ slug, kain, ukuran });
  const i = daftar.findIndex((it) => itemKunci(it) === kunci);
  const sudah = i >= 0 ? daftar[i].qty : 0;
  const baru = Math.min(stok, sudah + qty);
  if (baru <= sudah) return { ok: false, stok, sudah };
  if (i >= 0) daftar[i] = { ...daftar[i], qty: baru };
  else daftar.push({ slug, kain, ukuran, qty: baru, ditambah: Date.now() });
  tulis(KUNCI.keranjang, daftar);
  return { ok: true, qty: baru, ditambahkan: baru - sudah, terpotong: baru < sudah + qty };
}

// Tambah beberapa barang sekaligus (padu-padan). Mengembalikan ringkasan per barang.
export function tambahBanyak(daftarItem) {
  return daftarItem.map((it) => ({ ...it, hasil: tambahKeKeranjang(it) }));
}

export function ubahJumlah(kunci, qty) {
  tulis(
    KUNCI.keranjang,
    baca(KUNCI.keranjang, KOSONG_LIST).map((it) => (itemKunci(it) === kunci ? { ...it, qty: Math.max(1, qty) } : it)),
  );
}

// Ganti ukuran langsung di keranjang; baris digabung bila ukuran itu sudah ada.
export function gantiUkuran(kunci, ukuranBaru) {
  const daftar = baca(KUNCI.keranjang, KOSONG_LIST);
  const lama = daftar.find((it) => itemKunci(it) === kunci);
  if (!lama) return { ok: false };
  const p = cariProduk(lama.slug);
  const stok = stokVarian(p, lama.kain, ukuranBaru, baca(KUNCI.inventaris, KOSONG_OBJ));
  if (stok <= 0) return { ok: false, stok };
  const kunciBaru = itemKunci({ ...lama, ukuran: ukuranBaru });
  const ada = daftar.find((it) => itemKunci(it) === kunciBaru);
  let hasil;
  if (ada) {
    const qty = Math.min(stok, ada.qty + lama.qty);
    hasil = daftar.filter((it) => itemKunci(it) !== kunci).map((it) => (itemKunci(it) === kunciBaru ? { ...it, qty } : it));
  } else {
    hasil = daftar.map((it) => (itemKunci(it) === kunci ? { ...it, ukuran: ukuranBaru, qty: Math.min(stok, it.qty) } : it));
  }
  tulis(KUNCI.keranjang, hasil);
  return { ok: true, terpotong: lama.qty > stok };
}

export function hapusItem(kunci) {
  tulis(
    KUNCI.keranjang,
    baca(KUNCI.keranjang, KOSONG_LIST).filter((it) => itemKunci(it) !== kunci),
  );
}

export function kosongkanKeranjang() {
  tulis(KUNCI.keranjang, []);
}

// ---------- Pesanan ----------

function ubahStok(inv, slug, kain, ukuran, delta) {
  const p = cariProduk(slug);
  if (!p) return;
  const sisa = stokVarian(p, kain, ukuran, inv);
  inv[slug] = inv[slug] || {};
  inv[slug].stok = { ...(inv[slug].stok || {}), [kunciVarian(kain, ukuran)]: Math.max(0, sisa + delta) };
}

export function buatPesanan({ pembeli, items, layanan, kado, metode }) {
  const sekarang = Date.now();
  const nomor = (Number(baca(KUNCI.nomor, 0)) || NOMOR_AWAL_CONTOH - 1) + 1;
  const kode = buatKode(site.kodePesanan, nomor, sekarang);
  const pesanan = rakitPesanan({ kode, dibuat: sekarang, pembeli, items, layanan, kado, metode });
  const inv = structuredClone(baca(KUNCI.inventaris, KOSONG_OBJ));
  for (const it of items) ubahStok(inv, it.slug, it.kain, it.ukuran, -it.qty);
  tulis(KUNCI.inventaris, inv);
  tulis(KUNCI.pesanan, [pesanan, ...baca(KUNCI.pesanan, KOSONG_LIST)]);
  tulis(KUNCI.nomor, nomor);
  tulis(KUNCI.keranjang, []);
  return kode;
}

export function cariPesanan(daftar, kode) {
  const k = normalKode(kode);
  return daftar.find((p) => normalKode(p.kode) === k) || null;
}

export function ubahStatusPesanan(kode, status) {
  const sekarang = Date.now();
  tulis(
    KUNCI.pesanan,
    baca(KUNCI.pesanan, KOSONG_LIST).map((p) => (p.kode === kode ? terapkanStatus(p, status, sekarang) : p)),
  );
}

// Ajukan tukar ukuran: ukuran baru langsung disisihkan (stok berkurang satu).
export function ajukanTukar(kodePesanan, { indeks, ke, alasan, catatan }) {
  const sekarang = Date.now();
  const daftar = baca(KUNCI.pesanan, KOSONG_LIST);
  const o = daftar.find((p) => p.kode === kodePesanan);
  if (!o) return { ok: false };
  const item = o.items[indeks];
  const p = cariProduk(item?.slug);
  const inv = structuredClone(baca(KUNCI.inventaris, KOSONG_OBJ));
  if (!p || stokVarian(p, item.kain, ke, inv) < 1) return { ok: false, habis: true };
  const nomor = (Number(baca(KUNCI.nomorTukar, 0)) || NOMOR_AWAL_TUKAR - 1) + 1;
  const t = rakitTukar({ kode: buatKode(site.kodeTukar, nomor, sekarang), dibuat: sekarang, indeks, item, ke, alasan, catatan });
  ubahStok(inv, item.slug, item.kain, ke, -1);
  tulis(KUNCI.inventaris, inv);
  tulis(KUNCI.nomorTukar, nomor);
  tulis(
    KUNCI.pesanan,
    daftar.map((x) => (x.kode === kodePesanan ? { ...x, tukar: [...(x.tukar || []), t] } : x)),
  );
  return { ok: true, kode: t.kode };
}

// Ubah status tukar dari dasbor. Saat barang lama diterima, stok ukuran lama kembali satu.
export function ubahStatusTukar(kodePesanan, kodeTukar, status) {
  const sekarang = Date.now();
  const inv = structuredClone(baca(KUNCI.inventaris, KOSONG_OBJ));
  let ubahInv = false;
  const daftar = baca(KUNCI.pesanan, KOSONG_LIST).map((o) => {
    if (o.kode !== kodePesanan) return o;
    return {
      ...o,
      tukar: (o.tukar || []).map((t) => {
        if (t.kode !== kodeTukar) return t;
        const sebelum = indeksTukar(t.status) >= indeksTukar('diterima-toko');
        const sesudah = indeksTukar(status) >= indeksTukar('diterima-toko');
        if (sebelum !== sesudah) {
          ubahStok(inv, t.slug, t.kain, t.dari, sesudah ? 1 : -1);
          ubahInv = true;
        }
        return terapkanStatusTukar(t, status, sekarang);
      }),
    };
  });
  if (ubahInv) tulis(KUNCI.inventaris, inv);
  tulis(KUNCI.pesanan, daftar);
}

// ---------- Inventaris (dasbor) ----------

export function aturStok(slug, kunci, jumlah) {
  const inv = structuredClone(baca(KUNCI.inventaris, KOSONG_OBJ));
  inv[slug] = inv[slug] || {};
  inv[slug].stok = { ...(inv[slug].stok || {}), [kunci]: Math.max(0, Math.floor(Number(jumlah) || 0)) };
  tulis(KUNCI.inventaris, inv);
}

export function aturAktif(slug, aktif) {
  const inv = structuredClone(baca(KUNCI.inventaris, KOSONG_OBJ));
  inv[slug] = { ...(inv[slug] || {}), aktif };
  tulis(KUNCI.inventaris, inv);
}
