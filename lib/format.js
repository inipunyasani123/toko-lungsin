// Format angka, berat, ukuran, dan waktu. Semua waktu ditampilkan dalam WIB (Asia/Jakarta).

const angka = new Intl.NumberFormat('id-ID');

export function rupiah(n) {
  return `Rp${angka.format(Math.round(n || 0))}`;
}

// "Rp245 rb", "Rp1,2 jt" untuk label sempit
export function rupiahRingkas(n) {
  if (n >= 1000000) return `Rp${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 1 }).format(n / 1000000)} jt`;
  if (n >= 1000) return `Rp${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(n / 1000)} rb`;
  return `Rp${n}`;
}

export function gram(g) {
  if (g >= 1000) return `${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 }).format(g / 1000)} kg`;
  return `${angka.format(g)} g`;
}

export function cm(n) {
  if (Array.isArray(n)) return `${angka.format(n[0])}–${angka.format(n[1])} cm`;
  return `${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 1 }).format(n)} cm`;
}

export const ZONA_WAKTU = 'Asia/Jakarta';

const fmtTanggalJam = new Intl.DateTimeFormat('id-ID', {
  timeZone: ZONA_WAKTU,
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});
const fmtTanggal = new Intl.DateTimeFormat('id-ID', { timeZone: ZONA_WAKTU, weekday: 'long', day: 'numeric', month: 'long' });
const fmtTanggalSaja = new Intl.DateTimeFormat('id-ID', { timeZone: ZONA_WAKTU, day: 'numeric', month: 'long', year: 'numeric' });
const fmtTanggalPendek = new Intl.DateTimeFormat('id-ID', { timeZone: ZONA_WAKTU, day: 'numeric', month: 'short' });
const fmtHariPendek = new Intl.DateTimeFormat('id-ID', { timeZone: ZONA_WAKTU, weekday: 'short' });
const fmtKunci = new Intl.DateTimeFormat('en-CA', { timeZone: ZONA_WAKTU, year: 'numeric', month: '2-digit', day: '2-digit' });

// "15 Okt 2026, 14.05 WIB"
export function waktuWIB(ms) {
  if (!ms) return '';
  return `${fmtTanggalJam.format(new Date(ms))} WIB`;
}

// "Kamis, 22 Oktober"
export function tanggalPanjang(ms) {
  return fmtTanggal.format(new Date(ms));
}

// "22 Oktober 2026"
export function tanggalSaja(ms) {
  return fmtTanggalSaja.format(new Date(ms));
}

export function tanggalPendek(ms) {
  return fmtTanggalPendek.format(new Date(ms));
}

export function hariPendek(ms) {
  return fmtHariPendek.format(new Date(ms));
}

// Kunci tanggal kalender WIB, mis. "2026-10-15".
export function kunciHariWIB(ms) {
  return fmtKunci.format(new Date(ms));
}

export function bagianWIB(ms) {
  const d = new Date(ms + 7 * 3600 * 1000);
  return { tahun: d.getUTCFullYear(), bulan: d.getUTCMonth() + 1, hari: d.getUTCDate(), hariMinggu: d.getUTCDay() };
}

// Awal hari (00.00 WIB) untuk waktu tertentu, dalam milidetik UTC.
export function awalHariWIB(ms) {
  const { tahun, bulan, hari } = bagianWIB(ms);
  return Date.UTC(tahun, bulan - 1, hari) - 7 * 3600 * 1000;
}

export function sensorHP(hp) {
  const bersih = String(hp || '').replace(/\D/g, '');
  if (bersih.length < 6) return bersih;
  return `${bersih.slice(0, 4)}••••${bersih.slice(-4)}`;
}

// "3 hari lagi", "hari ini", "lewat 2 hari"
export function sisaHari(sampaiMs, sekarang) {
  const selisih = Math.ceil((awalHariWIB(sampaiMs) - awalHariWIB(sekarang)) / 86400000);
  if (selisih > 1) return `${selisih} hari lagi`;
  if (selisih === 1) return 'besok';
  if (selisih === 0) return 'hari ini';
  return `lewat ${-selisih} hari`;
}
