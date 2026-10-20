// Fungsi murni untuk pesanan dan tukar ukuran: kode, status, ringkasan penjualan, dan pesanan contoh.
import { site, statusPesanan, statusTukar, cariProduk } from './data.js';
import { hargaVarian, beratVarian, labelVarian } from './katalog.js';
import { hitungOngkir } from './ongkir.js';
import { bagianWIB, awalHariWIB, kunciHariWIB } from './format.js';

export const HARI = 86400000;

export function indeksStatus(id) {
  return statusPesanan.findIndex((s) => s.id === id);
}

export function labelStatus(id) {
  return statusPesanan.find((s) => s.id === id)?.label || id;
}

export function indeksTukar(id) {
  return statusTukar.findIndex((s) => s.id === id);
}

export function labelTukar(id) {
  return statusTukar.find((s) => s.id === id)?.label || id;
}

export function buatKode(awalan, nomor, ms) {
  const { tahun, bulan } = bagianWIB(ms);
  return `${awalan}-${String(tahun).slice(-2)}${String(bulan).padStart(2, '0')}-${String(nomor).padStart(4, '0')}`;
}

export function normalKode(kode) {
  return String(kode || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
}

export function waktuStatus(pesanan, statusId) {
  return pesanan.riwayat.find((r) => r.status === statusId)?.waktu || null;
}

// Pindah status. Maju beberapa langkah sekaligus: langkah yang dilewati ikut dicatat dengan waktu yang sama.
// Mundur: catatan sesudahnya dihapus.
export function terapkanStatus(pesanan, statusBaru, waktu) {
  const target = indeksStatus(statusBaru);
  if (target < 0) return pesanan;
  const riwayat = [];
  for (let i = 0; i <= target; i++) {
    const id = statusPesanan[i].id;
    riwayat.push(pesanan.riwayat.find((r) => r.status === id) || { status: id, waktu });
  }
  let resi = pesanan.resi;
  if (target >= indeksStatus('dikirim') && !resi) resi = `CONTOH-${normalKode(pesanan.kode).slice(-8)}${pesanan.kirim.layanan === 'kilat' ? 'K' : 'R'}`;
  if (target < indeksStatus('dikirim')) resi = null;
  return { ...pesanan, status: statusBaru, riwayat, resi };
}

export function hitungItem(slug, kainId, ukuranId, qty) {
  const p = cariProduk(slug);
  return {
    slug,
    nama: p.nama,
    jenis: p.jenis,
    kain: kainId,
    ukuran: ukuranId,
    label: labelVarian(p, kainId, ukuranId),
    harga: hargaVarian(p, kainId, ukuranId),
    berat: beratVarian(p, ukuranId),
    qty,
  };
}

export function rakitPesanan({ kode, dibuat, pembeli, items, layanan, kado, metode, contoh = false }) {
  const subtotal = items.reduce((n, it) => n + it.harga * it.qty, 0);
  const beratBarang = items.reduce((n, it) => n + it.berat * it.qty, 0);
  const jumlahBarang = items.reduce((n, it) => n + it.qty, 0);
  const o = hitungOngkir({ beratBarang, jumlahBarang, provinsi: pembeli.provinsi, layanan, kado, subtotal });
  return {
    kode,
    dibuat,
    status: 'menunggu',
    riwayat: [{ status: 'menunggu', waktu: dibuat }],
    pembeli,
    items,
    kirim: {
      layanan,
      zona: o.zona?.id || null,
      zonaNama: o.zona ? `${o.zona.nama} · ${o.zona.cakupan}` : '',
      estimasi: o.estimasi,
      perKg: o.perKg,
      kgTagih: o.kgTagih,
      beratBarang,
      beratKemasan: o.beratKemasan,
      beratKado: o.beratKado,
      beratTotal: o.beratTotal,
      ongkir: o.ongkir,
      potongan: o.potongan,
      kado,
      biayaKado: o.biayaKado,
    },
    bayar: { metode },
    subtotal,
    total: subtotal + o.ongkir - o.potongan + o.biayaKado,
    resi: null,
    tukar: [],
    contoh,
  };
}

// ---------- Tukar ukuran ----------

// Batas akhir tukar ukuran: N hari setelah paket diterima.
export function batasTukar(pesanan) {
  const t = waktuStatus(pesanan, 'diterima');
  return t ? t + site.hariTukar * HARI : null;
}

// { boleh: boolean, alasan: string, sampai?: ms }
export function bolehTukar(pesanan, sekarang) {
  if (indeksStatus(pesanan.status) < indeksStatus('diterima')) {
    return { boleh: false, alasan: 'Tukar ukuran bisa diajukan setelah paket diterima.' };
  }
  const sampai = batasTukar(pesanan);
  if (sampai && sekarang > sampai) return { boleh: false, alasan: `Masa tukar ${site.hariTukar} hari sudah lewat.`, sampai };
  return { boleh: true, alasan: '', sampai };
}

// Barang yang masih bisa ditukar: belum pernah diajukan tukar dan punya lebih dari satu ukuran.
export function itemBisaTukar(pesanan) {
  return pesanan.items
    .map((it, i) => ({ ...it, indeks: i }))
    .filter((it) => {
      const p = cariProduk(it.slug);
      return p && p.ukuran.length > 1 && !(pesanan.tukar || []).some((t) => t.indeks === it.indeks);
    });
}

export function rakitTukar({ kode, dibuat, indeks, item, ke, alasan, catatan = '' }) {
  return {
    kode,
    dibuat,
    indeks,
    slug: item.slug,
    nama: item.nama,
    kain: item.kain,
    dari: item.ukuran,
    ke,
    alasan,
    catatan,
    status: 'diajukan',
    riwayat: [{ status: 'diajukan', waktu: dibuat }],
  };
}

export function terapkanStatusTukar(tukar, statusBaru, waktu) {
  const target = indeksTukar(statusBaru);
  if (target < 0) return tukar;
  const riwayat = [];
  for (let i = 0; i <= target; i++) {
    const id = statusTukar[i].id;
    riwayat.push(tukar.riwayat.find((r) => r.status === id) || { status: id, waktu });
  }
  return { ...tukar, status: statusBaru, riwayat };
}

// ---------- Ringkasan untuk dasbor ----------

// Penjualan dihitung dari pesanan yang sudah dibayar, per hari kalender WIB, plus sebaran ukuran yang dipesan.
export function ringkasPenjualan(daftar, sekarang) {
  const iDibayar = indeksStatus('dibayar');
  const hariIni = awalHariWIB(sekarang);
  const hari = [];
  for (let i = 6; i >= 0; i--) {
    const awal = hariIni - i * HARI;
    hari.push({ kunci: kunciHariWIB(awal + 3600000), awal, total: 0, jumlah: 0 });
  }
  const peta = Object.fromEntries(hari.map((h) => [h.kunci, h]));
  const ukuran = {};
  let menunggu = 0;
  let tukarAktif = 0;
  for (const p of daftar) {
    tukarAktif += (p.tukar || []).filter((t) => t.status !== 'selesai').length;
    if (indeksStatus(p.status) < iDibayar) {
      menunggu += 1;
      continue;
    }
    const t = waktuStatus(p, 'dibayar') || p.dibuat;
    const h = peta[kunciHariWIB(t)];
    if (h) {
      h.total += p.total;
      h.jumlah += 1;
      for (const it of p.items) {
        const prod = cariProduk(it.slug);
        if (!prod || prod.ukuran.length === 1) continue;
        ukuran[it.ukuran] = (ukuran[it.ukuran] || 0) + it.qty;
      }
    }
  }
  const akhir = hari[hari.length - 1];
  return {
    hari,
    hariIni: { total: akhir.total, jumlah: akhir.jumlah },
    tujuhHari: { total: hari.reduce((n, h) => n + h.total, 0), jumlah: hari.reduce((n, h) => n + h.jumlah, 0) },
    ukuran,
    menunggu,
    tukarAktif,
  };
}

// ---------- Pesanan contoh (relatif terhadap kunjungan pertama, WIB) ----------
export const NOMOR_AWAL_CONTOH = 112;
export const NOMOR_AWAL_TUKAR = 17;

export function pesananContoh(sekarang) {
  const hari = (n, jam, menit) => awalHariWIB(sekarang) - n * HARI + (jam * 60 + menit) * 60000;
  const menitLalu = (m) => sekarang - m * 60000;
  const rencana = [
    {
      dibuat: hari(24, 9, 41),
      pembeli: { nama: 'Rendra Saputra', hp: '081200007112', provinsi: 'Jawa Timur', kota: 'Kota Malang', alamat: 'Jl. Sawo No. 12 (alamat contoh)', kodePos: '65145' },
      items: [hitungItem('kemeja-teras', 'cacah-lumut', 'L', 1), hitungItem('celana-tali', 'polos-arang', 'L', 1)],
      layanan: 'reguler', kado: false, metode: 'transfer',
      langkah: [['dibayar', hari(24, 10, 15)], ['dikemas', hari(23, 9, 30)], ['dikirim', hari(23, 15, 10)], ['diterima', hari(21, 13, 22)]],
    },
    {
      dibuat: hari(11, 20, 5),
      pembeli: { nama: 'Laras Wijayanti', hp: '085600007113', provinsi: 'DKI Jakarta', kota: 'Jakarta Selatan', alamat: 'Jl. Kemuning Raya No. 4 (alamat contoh)', kodePos: '12160' },
      items: [hitungItem('blus-shanghai', 'lajur-senja', 'M', 1), hitungItem('rok-lilit', 'polos-arang', 'Satu ukuran', 1)],
      layanan: 'kilat', kado: true, metode: 'qris',
      langkah: [['dibayar', hari(11, 20, 9)], ['dikemas', hari(10, 10, 40)], ['dikirim', hari(10, 16, 5)], ['diterima', hari(9, 11, 48)]],
      tukar: { indeks: 0, ke: 'L', alasan: 'kekecilan', dibuat: hari(8, 19, 30), langkah: [['disetujui', hari(7, 9, 12)], ['diterima-toko', hari(4, 14, 2)], ['dikirim', hari(3, 10, 30)]] },
    },
    {
      dibuat: hari(6, 7, 58),
      pembeli: { nama: 'Ayu Kartika', hp: '081300007114', provinsi: 'DI Yogyakarta', kota: 'Kabupaten Sleman', alamat: 'Jl. Kenari No. 21 (alamat contoh)', kodePos: '55281' },
      items: [hitungItem('tunik-kebun', 'cacah-lumut', 'M', 1), hitungItem('kulot-lebar', 'polos-arang', 'M', 1), hitungItem('kerudung-segi-empat', 'lajur-kunyit', '115 × 115 cm', 2)],
      layanan: 'reguler', kado: false, metode: 'ewallet',
      langkah: [['dibayar', hari(6, 8, 20)], ['dikemas', hari(6, 11, 5)], ['dikirim', hari(6, 15, 45)], ['diterima', hari(4, 12, 10)]],
    },
    {
      dibuat: hari(2, 19, 26),
      pembeli: { nama: 'Yusuf Hidayat', hp: '087800007115', provinsi: 'Sulawesi Selatan', kota: 'Kota Makassar', alamat: 'Jl. Cendana No. 9 (alamat contoh)', kodePos: '90111' },
      items: [hitungItem('jaket-kerja', 'polos-arang', 'L', 1), hitungItem('kemeja-lajur-panjang', 'gerimis-nila', 'L', 1)],
      layanan: 'reguler', kado: false, metode: 'transfer',
      langkah: [['dibayar', hari(2, 20, 2)], ['dikemas', hari(1, 9, 50)], ['dikirim', hari(1, 15, 30)]],
    },
    {
      dibuat: menitLalu(312),
      pembeli: { nama: 'Melati Anggraini', hp: '081900007116', provinsi: 'Bali', kota: 'Kota Denpasar', alamat: 'Jl. Teratai No. 17 (alamat contoh)', kodePos: '80234' },
      items: [hitungItem('terusan-pasar', 'kotak-bata', 'S', 1), hitungItem('outer-sore', 'polos-arang', 'S/M', 1), hitungItem('tas-jinjing', 'pematang-soga', '38 × 40 cm', 1)],
      layanan: 'kilat', kado: false, metode: 'qris',
      langkah: [['dibayar', menitLalu(300)]],
    },
    {
      dibuat: menitLalu(34),
      pembeli: { nama: 'Dimas Prakoso', hp: '082100007117', provinsi: 'Jawa Tengah', kota: 'Kota Semarang', alamat: 'Jl. Flamboyan No. 3 (alamat contoh)', kodePos: '50241' },
      items: [hitungItem('kain-lurik-meteran', 'gerimis-nila', '2 meter', 1), hitungItem('syal-lurik', 'lajur-senja', '40 × 180 cm', 1)],
      layanan: 'reguler', kado: false, metode: 'transfer',
      langkah: [],
    },
  ];
  let nomorTukar = NOMOR_AWAL_TUKAR;
  return rencana.map((r, i) => {
    let p = rakitPesanan({
      kode: buatKode(site.kodePesanan, NOMOR_AWAL_CONTOH + i, r.dibuat),
      dibuat: r.dibuat,
      pembeli: r.pembeli,
      items: r.items,
      layanan: r.layanan,
      kado: r.kado,
      metode: r.metode,
      contoh: true,
    });
    for (const [status, waktu] of r.langkah) p = terapkanStatus(p, status, waktu);
    if (r.tukar) {
      const it = p.items[r.tukar.indeks];
      let t = rakitTukar({ kode: buatKode(site.kodeTukar, nomorTukar++, r.tukar.dibuat), dibuat: r.tukar.dibuat, indeks: r.tukar.indeks, item: it, ke: r.tukar.ke, alasan: r.tukar.alasan });
      for (const [status, waktu] of r.tukar.langkah) t = terapkanStatusTukar(t, status, waktu);
      p = { ...p, tukar: [t] };
    }
    return p;
  });
}

export function cocokkanHP(pesanan, empatDigit) {
  const hp = String(pesanan.pembeli.hp || '').replace(/\D/g, '');
  return hp.slice(-4) === String(empatDigit || '').replace(/\D/g, '');
}
