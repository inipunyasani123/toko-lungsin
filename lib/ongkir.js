// Ongkir dari tabel contoh tarif (zona × berat). Bukan tarif kurir sungguhan.
import { zonaOngkir, site } from './data.js';

export function zonaUntuk(namaProvinsi) {
  return zonaOngkir.find((z) => z.provinsi.includes(namaProvinsi)) || null;
}

export function beratKemasan(jumlahBarang) {
  if (!jumlahBarang) return 0;
  return site.kemasan.dasar + site.kemasan.perBarang * jumlahBarang;
}

// Potongan ongkir untuk belanja di atas batas, tidak lebih dari ongkirnya sendiri.
export function subsidiOngkir(subtotal, ongkir) {
  if (subtotal < site.subsidi.minimal) return 0;
  return Math.min(site.subsidi.potongan, ongkir);
}

export function hitungOngkir({ beratBarang, jumlahBarang, provinsi, layanan = 'reguler', kado = false, subtotal = 0 }) {
  const zona = zonaUntuk(provinsi);
  const kemas = beratKemasan(jumlahBarang);
  const beratKado = kado ? site.bungkusKado.berat : 0;
  const total = beratBarang + kemas + beratKado;
  const kgTagih = Math.max(1, Math.ceil(total / 1000));
  const tarif = zona ? zona.layanan[layanan] : null;
  const ongkir = tarif ? kgTagih * tarif.perKg : 0;
  const potongan = tarif ? subsidiOngkir(subtotal, ongkir) : 0;
  return {
    zona,
    beratBarang,
    beratKemasan: kemas,
    beratKado,
    beratTotal: total,
    kgTagih,
    tersedia: Boolean(tarif),
    perKg: tarif ? tarif.perKg : 0,
    estimasi: tarif ? tarif.estimasi : '',
    ongkir,
    potongan,
    biayaKado: kado ? site.bungkusKado.biaya : 0,
  };
}
