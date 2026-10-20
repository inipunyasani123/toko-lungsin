// Logika pas badan: membandingkan ukuran baju dengan ukuran badan (profil "Ukuranku").
// Semua angka dalam cm. Hasilnya perkiraan; disampaikan apa adanya di halaman.
import { potongan as POTONGAN } from './data.js';
import { satuUkuran } from './katalog.js';

export const BATAS_PROFIL = {
  dada: [70, 150],
  pinggang: [50, 140],
  pinggul: [70, 160],
  tinggi: [130, 200],
};

export function profilLengkap(profil, kunci) {
  return kunci.every((k) => Number(profil?.[k]) > 0);
}

export function periksaProfil(f) {
  const g = {};
  for (const [k, [min, max]] of Object.entries(BATAS_PROFIL)) {
    const v = String(f[k] ?? '').trim();
    if (!v) continue; // boleh dikosongkan
    const n = Number(v.replace(',', '.'));
    if (!Number.isFinite(n)) g[k] = 'Tulis angka dalam sentimeter.';
    else if (n < min || n > max) g[k] = `Isi antara ${min} dan ${max} cm.`;
  }
  return g;
}

// Kelonggaran yang dianggap pas untuk produk ini: [min, maks] cm
export function kelonggaranProduk(p) {
  if (p.kelonggaran) return p.kelonggaran;
  return POTONGAN[p.potongan]?.kelonggaran || null;
}

function zona(selisih, [min, maks]) {
  if (selisih < min) return 'sempit';
  if (selisih > maks) return 'longgar';
  return 'pas';
}

/**
 * Rekomendasi ukuran untuk satu produk.
 * @returns {null | { ukuran: string|null, status: 'pas'|'mepet'|'besar'|'tidak-muat'|'satu', alasan: string, rinci: object[] }}
 * null bila produk tanpa ukuran badan (aksesori, kain) atau profil belum diisi untuk ukuran acuannya.
 */
export function rekomendasi(p, profil) {
  if (!p.acuan || !profil) return null;
  if (p.acuan === 'pinggang') {
    const b = Number(profil.pinggang);
    if (!b) return null;
    const u = p.ukuran[0];
    const [lo, hi] = u.pinggang;
    const muat = b >= lo && b <= hi;
    return {
      ukuran: muat ? u.id : null,
      status: muat ? 'satu' : 'tidak-muat',
      alasan: muat
        ? `Tali pinggangnya bisa diatur untuk lingkar ${lo}–${hi} cm, termasuk pinggangmu (${b} cm).`
        : `Tali pinggangnya hanya bisa diatur untuk lingkar ${lo}–${hi} cm, sedangkan pinggangmu ${b} cm.`,
      rinci: [],
    };
  }
  const acuan = p.acuan; // 'dada' atau 'pinggul'
  const badan = Number(profil[acuan]);
  if (!badan) return null;
  const target = kelonggaranProduk(p);
  const tengah = (target[0] + target[1]) / 2;
  const pinggangBadan = Number(profil.pinggang) || null;
  const rinci = p.ukuran.map((u) => {
    const selisih = u[acuan] - badan;
    let z = zona(selisih, target);
    // pinggang karet: badan harus di antara ukuran karet tanpa ditarik dan ditarik penuh
    let catatanPinggang = '';
    if (u.pinggang && pinggangBadan) {
      const [lo, hi] = u.pinggang;
      if (pinggangBadan < lo - 4) catatanPinggang = 'karet pinggang akan longgar';
      else if (pinggangBadan > hi) {
        catatanPinggang = 'karet pinggang terlalu kecil';
        z = 'sempit';
      }
    }
    return { ukuran: u.id, ukur: u[acuan], selisih, zona: z, catatanPinggang };
  });
  const pas = rinci.filter((r) => r.zona === 'pas');
  let pilih;
  let status;
  if (pas.length) {
    pilih = [...pas].sort((a, b) => Math.abs(a.selisih - tengah) - Math.abs(b.selisih - tengah))[0];
    status = 'pas';
  } else {
    const cukup = rinci.filter((r) => r.zona === 'longgar');
    if (cukup.length) {
      pilih = cukup[0]; // ukuran terkecil yang masih lebih longgar dari target
      status = 'besar';
    } else {
      pilih = rinci[rinci.length - 1];
      status = 'mepet';
    }
  }
  const nama = acuan === 'dada' ? 'dada' : 'pinggul';
  const namaPotongan = POTONGAN[p.potongan]?.nama.toLowerCase() || 'potongan ini';
  let alasan;
  if (status === 'pas')
    alasan = `Lingkar ${nama} baju ${pilih.ukur} cm, ${pilih.selisih} cm lebih besar dari ${nama}mu (${badan} cm). Untuk potongan ${namaPotongan}, kami menyarankan ${target[0]}–${target[1]} cm.`;
  else if (status === 'besar')
    alasan = `Ukuran terkecil pun ${pilih.selisih} cm lebih besar dari ${nama}mu, jadi akan terasa lebih longgar dari potongan aslinya.`;
  else
    alasan = `Ukuran terbesar hanya ${Math.max(pilih.selisih, 0)} cm lebih besar dari ${nama}mu, lebih sempit dari yang kami sarankan (${target[0]}–${target[1]} cm).`;
  if (pilih.catatanPinggang) alasan += ` Catatan: ${pilih.catatanPinggang}.`;
  return { ukuran: pilih.ukuran, status, alasan, rinci, badan, acuan, target };
}

// Perkiraan tinggi titik-titik badan dari lantai (proporsi rata-rata orang dewasa), dalam cm.
export function titikBadan(tinggi) {
  return {
    bahu: tinggi * 0.83, // pangkal leher-bahu, titik awal panjang baju
    pinggang: tinggi * 0.62,
    pinggul: tinggi * 0.52,
    selangkang: tinggi * 0.47,
    lutut: tinggi * 0.285,
    betis: tinggi * 0.18,
    mataKaki: tinggi * 0.045,
  };
}

// Di mana ujung baju/bawahan jatuh untuk tinggi badan tertentu.
export function jatuhUjung(p, ukuranId, tinggi) {
  if (!tinggi || (satuUkuran(p) && !p.ukuran[0].panjang)) return null;
  const u = p.ukuran.find((x) => x.id === ukuranId);
  if (!u?.panjang) return null;
  const t = titikBadan(tinggi);
  const bawahan = p.kategori === 'bawahan';
  const awal = bawahan ? t.pinggang : t.bahu;
  const ujung = awal - u.panjang;
  let letak;
  if (ujung >= t.pinggul + 6) letak = 'di atas pinggul';
  else if (ujung >= t.selangkang - 3) letak = 'sekitar pinggul';
  else if (ujung >= t.selangkang - 14) letak = 'menutup pangkal paha';
  else if (ujung >= t.lutut + 8) letak = 'di atas lutut';
  else if (ujung >= t.lutut - 6) letak = 'sekitar lutut';
  else if (ujung >= t.betis + 5) letak = 'di bawah lutut';
  else if (ujung >= t.betis - 6) letak = 'sekitar tengah betis';
  else if (ujung >= t.mataKaki + 3) letak = 'di atas mata kaki';
  else if (ujung >= 0) letak = 'semata kaki';
  else letak = 'menyentuh lantai';
  return { ujung: Math.round(ujung), awal: Math.round(awal), letak, titik: t, bawahan, panjang: u.panjang, tinggi };
}
