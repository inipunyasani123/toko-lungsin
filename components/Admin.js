'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ContohKain } from './Busana';
import { produk, statusPesanan, statusTukar, cariKain } from '@/lib/data';
import { stokVarian, produkAktif, kunciVarian, semuaVarian } from '@/lib/katalog';
import { ringkasPenjualan, labelStatus, labelTukar } from '@/lib/pesanan';
import { rupiah, rupiahRingkas, waktuWIB, tanggalPanjang, hariPendek, tanggalPendek } from '@/lib/format';
import { usePesanan, useInventaris, useTerpasang, ubahStatusPesanan, ubahStatusTukar, aturStok, aturAktif, kembalikanDataContoh } from '@/lib/store';

const BATAS_MENIPIS = 1;
const URUT_UKURAN = ['S', 'S/M', 'M', 'L', 'L/XL', 'XL', 'XXL'];

function Ubin({ label, nilai, catatan }) {
  return (
    <div className="rounded-[6px] border border-garis bg-putih p-4 sm:p-5">
      <p className="text-[0.9rem] text-tinta-2">{label}</p>
      <p className="mt-1 text-[1.3rem] font-semibold leading-tight tracking-tight [overflow-wrap:anywhere] sm:text-[1.8rem]">{nilai}</p>
      {catatan && <p className="mt-1 text-[0.85rem] text-tinta-3">{catatan}</p>}
    </div>
  );
}

// Batang penjualan per hari (satu seri, satu warna). Tooltip saat disorot/difokus, tabel sebagai pengganti.
function GrafikTujuhHari({ hari }) {
  const [aktif, setAktif] = useState(null);
  const maks = Math.max(...hari.map((h) => h.total), 1);
  const atas = maks <= 500000 ? 500000 : Math.ceil(maks / 500000) * 500000;
  return (
    <figure className="m-0">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="font-semibold">Penjualan per hari, 7 hari terakhir</span>
        <span className="text-[0.85rem] text-tinta-3">Pesanan yang sudah dibayar, per tanggal WIB</span>
      </figcaption>
      <div className="relative mt-5 grid grid-cols-[3.4rem_1fr] gap-2">
        <div className="relative h-[180px]" aria-hidden="true">
          {[atas, atas / 2, 0].map((v, i) => (
            <span key={v} className="absolute right-0 -translate-y-1/2 text-[0.75rem] tabular-nums text-tinta-3" style={{ top: `${i * 50}%` }}>
              {rupiahRingkas(v)}
            </span>
          ))}
        </div>
        <div className="relative h-[180px]">
          {[0, 50, 100].map((t) => (
            <span key={t} aria-hidden="true" className="absolute inset-x-0 h-px bg-garis" style={{ top: `${t}%` }} />
          ))}
          <ul className="absolute inset-0 grid grid-cols-7 items-end">
            {hari.map((h, i) => {
              const tinggi = (h.total / atas) * 100;
              const hariIni = i === hari.length - 1;
              return (
                <li key={h.kunci} className="relative flex h-full items-end justify-center">
                  <div
                    role="img"
                    tabIndex={0}
                    aria-label={`${tanggalPanjang(h.awal + 3600000)}: ${rupiah(h.total)}, ${h.jumlah} pesanan`}
                    onPointerEnter={() => setAktif(i)}
                    onPointerLeave={() => setAktif(null)}
                    onFocus={() => setAktif(i)}
                    onBlur={() => setAktif(null)}
                    className="relative flex h-full w-full cursor-default items-end justify-center rounded-sm"
                  >
                    <span className={`block w-[min(22px,58%)] rounded-t-[4px] ${hariIni ? 'bg-nila' : 'bg-nila-3/70'} ${aktif === i ? 'opacity-80' : ''}`} style={{ height: `${Math.max(tinggi, h.total ? 2 : 0)}%` }} />
                  </div>
                  {aktif === i && (
                    <span role="presentation" className={`pointer-events-none absolute bottom-full z-10 mb-2 w-max max-w-[11rem] rounded-[6px] bg-tinta px-2.5 py-1.5 text-[0.78rem] text-white shadow-lg ${i > 3 ? 'right-0' : 'left-0'}`}>
                      <span className="block font-semibold">{rupiah(h.total)}</span>
                      <span className="block">
                        {h.jumlah} pesanan · {tanggalPendek(h.awal + 3600000)}
                      </span>
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
        <span />
        <ul className="grid grid-cols-7" aria-hidden="true">
          {hari.map((h, i) => (
            <li key={h.kunci} className={`text-center text-[0.75rem] leading-tight ${i === hari.length - 1 ? 'font-semibold text-tinta' : 'text-tinta-3'}`}>
              {i === hari.length - 1 ? 'Hari ini' : hariPendek(h.awal + 3600000)}
              <span className="block tabular-nums">{tanggalPendek(h.awal + 3600000)}</span>
            </li>
          ))}
        </ul>
      </div>
      <details className="mt-4 text-[0.9rem]">
        <summary className="cursor-pointer underline underline-offset-4">Lihat sebagai tabel</summary>
        <table className="mt-2 w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-tinta">
              <th scope="col" className="py-1.5 pe-3 font-semibold">Tanggal</th>
              <th scope="col" className="py-1.5 pe-3 text-end font-semibold">Pesanan</th>
              <th scope="col" className="py-1.5 text-end font-semibold">Penjualan</th>
            </tr>
          </thead>
          <tbody>
            {hari.map((h) => (
              <tr key={h.kunci} className="border-b border-garis">
                <td className="py-1.5 pe-3">{tanggalPanjang(h.awal + 3600000)}</td>
                <td className="py-1.5 pe-3 text-end tabular-nums">{h.jumlah}</td>
                <td className="py-1.5 text-end tabular-nums">{rupiah(h.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}

// Sebaran ukuran yang dipesan: batang mendatar dengan label langsung (satu seri).
function SebaranUkuran({ ukuran }) {
  const baris = URUT_UKURAN.filter((u) => ukuran[u]).map((u) => ({ u, n: ukuran[u] }));
  const maks = Math.max(1, ...baris.map((b) => b.n));
  const total = baris.reduce((n, b) => n + b.n, 0);
  return (
    <figure className="m-0">
      <figcaption className="font-semibold">Ukuran yang dipesan, 7 hari terakhir</figcaption>
      <p className="text-[0.85rem] text-tinta-3">Jumlah barang dari pesanan yang sudah dibayar. Bantu menentukan ukuran mana yang dijahit lebih banyak.</p>
      {baris.length ? (
        <ul className="mt-4 grid gap-2.5">
          {baris.map((b) => (
            <li key={b.u} className="grid grid-cols-[3rem_1fr_3.2rem] items-center gap-3 text-[0.9rem]">
              <span className="font-semibold">{b.u}</span>
              <span className="h-4 rounded-[2px] bg-kapas" aria-hidden="true">
                <span className="block h-full rounded-e-[4px] bg-nila" style={{ width: `${(b.n / maks) * 100}%` }} />
              </span>
              <span className="text-end tabular-nums">
                {b.n} <span className="sr-only">barang, </span>
                <span className="text-tinta-3">· {Math.round((b.n / total) * 100)}%</span>
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-tinta-2">Belum ada barang berukuran yang dibayar dalam 7 hari terakhir.</p>
      )}
    </figure>
  );
}

function InputStok({ nilai, onSimpan, label }) {
  const [teks, setTeks] = useState(String(nilai));
  const [fokus, setFokus] = useState(false);
  useEffect(() => {
    if (!fokus) setTeks(String(nilai));
  }, [nilai, fokus]);
  return (
    <input
      type="number"
      inputMode="numeric"
      min={0}
      step={1}
      aria-label={label}
      value={teks}
      onFocus={() => setFokus(true)}
      onBlur={() => {
        setFokus(false);
        if (teks.trim() === '' || Number.isNaN(Number(teks))) setTeks(String(nilai));
      }}
      onChange={(e) => {
        setTeks(e.target.value);
        const n = Number(e.target.value);
        if (e.target.value.trim() !== '' && Number.isInteger(n) && n >= 0) onSimpan(n);
      }}
      className={`isian min-h-10 w-[4.2rem] px-2 py-1.5 text-center tabular-nums ${nilai === 0 ? 'border-secang text-secang' : nilai <= BATAS_MENIPIS ? 'border-kunyit-tua' : ''}`}
    />
  );
}

export default function Admin() {
  const terpasang = useTerpasang();
  const daftar = usePesanan();
  const inv = useInventaris();
  const [saring, setSaring] = useState('semua');
  const [yakin, setYakin] = useState(false);
  const [pesan, setPesan] = useState('');

  if (!terpasang) {
    return (
      <div className="wadah pb-20">
        <p className="text-tinta-2" role="status">
          Memuat data di browser ini…
        </p>
      </div>
    );
  }

  const r = ringkasPenjualan(daftar, Date.now());
  const tampil = saring === 'semua' ? daftar : daftar.filter((p) => p.status === saring);
  const tukar = daftar.flatMap((o) => (o.tukar || []).map((t) => ({ ...t, pesanan: o })));
  const menipis = [];
  for (const p of produk) for (const v of semuaVarian(p)) {
    const s = stokVarian(p, v.kain, v.ukuran, inv);
    if (s <= BATAS_MENIPIS) menipis.push({ p, v, s });
  }
  menipis.sort((a, b) => a.s - b.s);

  const ubahStatus = (kode, status) => {
    ubahStatusPesanan(kode, status);
    setPesan(`Status ${kode} diubah menjadi ${labelStatus(status)}.`);
  };

  return (
    <div className="wadah grid gap-14 pb-20">
      <div role="status" aria-live="polite" className="sr-only">
        {pesan}
      </div>

      <section aria-labelledby="judul-ringkas">
        <h2 id="judul-ringkas" className="text-[1.8rem] sm:text-[2.3rem]">
          Ringkasan
        </h2>
        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Ubin label="Penjualan hari ini" nilai={rupiah(r.hariIni.total)} catatan={`${r.hariIni.jumlah} pesanan dibayar`} />
          <Ubin label="7 hari terakhir" nilai={rupiah(r.tujuhHari.total)} catatan={`${r.tujuhHari.jumlah} pesanan dibayar`} />
          <Ubin label="Menunggu pembayaran" nilai={r.menunggu} catatan="pesanan" />
          <Ubin label="Tukar ukuran berjalan" nilai={r.tukarAktif} catatan="pengajuan belum selesai" />
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-12">
          <div className="rounded-[6px] border border-garis bg-putih p-4 sm:p-6 lg:col-span-7">
            <GrafikTujuhHari hari={r.hari} />
          </div>
          <div className="rounded-[6px] border border-garis bg-putih p-4 sm:p-6 lg:col-span-5">
            <SebaranUkuran ukuran={r.ukuran} />
          </div>
        </div>
      </section>

      <section aria-labelledby="judul-pesanan">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="judul-pesanan" className="text-[1.8rem] sm:text-[2.3rem]">
            Pesanan
          </h2>
          <label className="flex items-center gap-2 text-[0.92rem]">
            <span className="text-tinta-2">Tampilkan</span>
            <select className="isian min-h-10 w-auto py-1.5" value={saring} onChange={(e) => setSaring(e.target.value)}>
              <option value="semua">Semua status ({daftar.length})</option>
              {statusPesanan.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label} ({daftar.filter((p) => p.status === s.id).length})
                </option>
              ))}
            </select>
          </label>
        </div>
        <ul className="mt-5 grid gap-3" aria-label={`Daftar pesanan, ${tampil.length} pesanan`}>
          {tampil.map((p) => (
            <li key={p.kode} className="grid gap-3 rounded-[6px] border border-garis bg-putih p-4 md:grid-cols-[11rem_1fr_8rem_13rem] md:items-center">
              <div>
                <Link href={`/pesanan/${p.kode}`} className="label inline-block py-1.5 whitespace-nowrap text-[0.8rem] text-nila underline underline-offset-2">
                  {p.kode}
                </Link>
                <p className="mt-0.5 text-[0.82rem] text-tinta-3">
                  {waktuWIB(p.dibuat)}
                  {p.contoh ? ' · contoh' : ''}
                </p>
              </div>
              <div className="min-w-0">
                <p className="font-medium">
                  {p.pembeli.nama} <span className="text-[0.85rem] font-normal text-tinta-3">· {p.pembeli.kota}</span>
                </p>
                <p className="flex flex-wrap gap-x-3 gap-y-1 text-[0.84rem] text-tinta-2">
                  {p.items.map((it) => (
                    <span key={`${it.slug}-${it.kain}-${it.ukuran}`} className="inline-flex items-center gap-1.5">
                      <ContohKain kain={it.kain} className="h-3.5 w-3.5 rounded-[2px]" />
                      {it.qty}× {it.nama} {it.ukuran.length <= 4 ? it.ukuran : ''}
                    </span>
                  ))}
                </p>
              </div>
              <p className="font-semibold tabular-nums md:text-end">{rupiah(p.total)}</p>
              <select className="isian min-h-10 py-1.5" aria-label={`Status ${p.kode}`} value={p.status} onChange={(e) => ubahStatus(p.kode, e.target.value)}>
                {statusPesanan.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </li>
          ))}
          {!tampil.length && <li className="rounded-[6px] border border-garis bg-putih p-4 text-tinta-2">Tidak ada pesanan dengan status ini.</li>}
        </ul>
        <p className="mt-2 text-[0.85rem] text-tinta-3">Mengubah status ke tahap yang lebih jauh ikut mengisi tahap yang terlewat. Resi contoh dibuat saat status Dikirim.</p>
      </section>

      <section aria-labelledby="judul-tukar">
        <h2 id="judul-tukar" className="text-[1.8rem] sm:text-[2.3rem]">
          Tukar ukuran
        </h2>
        <p className="mt-2 max-w-2xl text-tinta-2">Ukuran pengganti disisihkan saat pengajuan masuk. Saat status Barang lama diterima, stok ukuran lama kembali satu.</p>
        <ul className="mt-5 grid gap-3 md:grid-cols-2">
          {tukar.map((t) => (
            <li key={t.kode} className="rounded-[6px] border border-garis bg-putih p-4">
              <p className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="label text-[0.8rem] text-nila">{t.kode}</span>
                <Link href={`/pesanan/${t.pesanan.kode}`} className="inline-block py-0.5 text-[0.85rem] text-tinta-2 underline underline-offset-2">
                  {t.pesanan.kode}
                </Link>
              </p>
              <p className="mt-1">
                {t.nama} · {cariKain(t.kain)?.nama}: <span className="font-semibold">{t.dari}</span> → <span className="font-semibold">{t.ke}</span>
              </p>
              <p className="text-[0.84rem] text-tinta-3">
                {t.pesanan.pembeli.nama} · diajukan {waktuWIB(t.dibuat)}
              </p>
              <select
                className="isian mt-3 min-h-10 py-1.5"
                aria-label={`Status tukar ${t.kode}`}
                value={t.status}
                onChange={(e) => {
                  ubahStatusTukar(t.pesanan.kode, t.kode, e.target.value);
                  setPesan(`Status ${t.kode} diubah menjadi ${labelTukar(e.target.value)}.`);
                }}
              >
                {statusTukar.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </li>
          ))}
          {!tukar.length && <li className="rounded-[6px] border border-garis bg-putih p-4 text-tinta-2">Belum ada pengajuan tukar ukuran.</li>}
        </ul>
      </section>

      <section aria-labelledby="judul-menipis" className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 id="judul-menipis" className="text-[1.8rem] sm:text-[2.3rem]">
            Stok menipis
          </h2>
          <p className="mt-2 text-tinta-2">Pilihan kain dan ukuran dengan stok {BATAS_MENIPIS} atau kosong. Pesanan baru mengurangi stok otomatis.</p>
        </div>
        <ul className="grid content-start gap-2 sm:grid-cols-2 lg:col-span-8">
          {menipis.slice(0, 14).map(({ p, v, s }) => (
            <li key={`${p.slug}-${v.kunci}`} className="flex items-center justify-between gap-3 rounded-[6px] border border-garis bg-putih px-3.5 py-2.5">
              <span className="flex min-w-0 items-center gap-2.5">
                <ContohKain kain={v.kain} className="h-7 w-7 shrink-0 rounded-[4px]" />
                <span className="min-w-0">
                  <a href={`#stok-${p.slug}`} className="block py-0.5 truncate font-medium leading-snug hover:underline">
                    {p.nama}
                  </a>
                  <span className="block text-[0.84rem] text-tinta-2">
                    {cariKain(v.kain).nama} · {v.ukuran}
                  </span>
                </span>
              </span>
              <span className={`label shrink-0 text-[0.75rem] ${s === 0 ? 'text-secang' : 'text-kunyit-tua'}`}>{s === 0 ? 'Habis' : `Sisa ${s}`}</span>
            </li>
          ))}
          {menipis.length > 14 && <li className="text-[0.9rem] text-tinta-2">dan {menipis.length - 14} pilihan lain.</li>}
        </ul>
      </section>

      <section aria-labelledby="judul-stok">
        <h2 id="judul-stok" className="text-[1.8rem] sm:text-[2.3rem]">
          Stok per kain dan ukuran
        </h2>
        <p className="mt-2 max-w-2xl text-tinta-2">Ubah angka untuk menyimpan langsung. Produk yang dinonaktifkan hilang dari koleksi dan tidak bisa dibeli.</p>
        <ul className="mt-6 grid gap-4 lg:grid-cols-2">
          {produk.map((p) => {
            const aktif = produkAktif(p, inv);
            return (
              <li key={p.slug} id={`stok-${p.slug}`} className={`scroll-mt-24 rounded-[6px] border p-4 sm:p-5 ${aktif ? 'border-garis bg-putih' : 'border-dashed border-garis-tua bg-kapas'}`}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-[1.05rem]">
                    <Link href={`/produk/${p.slug}`} className="hover:underline">
                      {p.nama}
                    </Link>
                  </h3>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={aktif}
                    aria-label={`Jual ${p.nama}`}
                    onClick={() => {
                      aturAktif(p.slug, !aktif);
                      setPesan(`${p.nama} ${aktif ? 'dinonaktifkan' : 'diaktifkan'}.`);
                    }}
                    className="flex min-h-10 items-center gap-2.5 rounded-[6px] px-1 text-[0.9rem]"
                  >
                    <span className={`relative inline-block h-6 w-11 shrink-0 rounded-full transition-colors ${aktif ? 'bg-lumut' : 'bg-tinta-3'}`} aria-hidden="true">
                      <span className={`absolute left-0 top-0.5 block h-5 w-5 rounded-full bg-putih shadow transition-transform ${aktif ? 'translate-x-[1.375rem]' : 'translate-x-0.5'}`} />
                    </span>
                    <span>{aktif ? 'Dijual' : 'Nonaktif'}</span>
                  </button>
                </div>
                <div className="mt-3 overflow-x-auto" tabIndex={0} role="region" aria-label={`Stok ${p.nama}`}>
                  <table className="border-collapse text-[0.88rem]">
                    <thead>
                      <tr>
                        <th scope="col" className="pb-2 pe-3 text-left font-medium text-tinta-2">
                          Kain
                        </th>
                        {p.ukuran.map((u) => (
                          <th key={u.id} scope="col" className="whitespace-nowrap px-1.5 pb-2 text-center font-medium text-tinta-2">
                            {u.id}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {p.kain.map((k) => (
                        <tr key={k}>
                          <th scope="row" className="py-1 pe-3 text-left font-normal">
                            <span className="flex items-center gap-2 whitespace-nowrap">
                              <ContohKain kain={k} className="h-4 w-4 rounded-[2px]" />
                              {cariKain(k).nama}
                            </span>
                          </th>
                          {p.ukuran.map((u) => (
                            <td key={u.id} className="px-1.5 py-1 text-center">
                              <InputStok nilai={stokVarian(p, k, u.id, inv)} label={`Stok ${p.nama}, ${cariKain(k).nama}, ${u.id}`} onSimpan={(n) => aturStok(p.slug, kunciVarian(k, u.id), n)} />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="judul-reset" className="rounded-[6px] border-2 border-dashed border-garis-tua p-5 sm:p-6">
        <h2 id="judul-reset" className="font-sans text-xl font-semibold tracking-normal">
          Kembalikan data contoh
        </h2>
        <p className="mt-2 max-w-2xl text-tinta-2">
          Menghapus pesanan buatanmu, pengajuan tukar, dan semua perubahan stok di browser ini, lalu membuat ulang pesanan contoh dengan tanggal relatif hari ini. Keranjang
          dan ukuran tersimpan tidak ikut dihapus.
        </p>
        {yakin ? (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <p className="font-medium">Yakin? Ini tidak bisa dibatalkan.</p>
            <button
              type="button"
              className="tombol tombol-nila"
              onClick={() => {
                kembalikanDataContoh();
                setYakin(false);
                setSaring('semua');
                setPesan('Data contoh dikembalikan.');
              }}
            >
              Ya, kembalikan
            </button>
            <button type="button" className="tombol tombol-garis" onClick={() => setYakin(false)}>
              Batal
            </button>
          </div>
        ) : (
          <button type="button" className="tombol tombol-garis mt-4" onClick={() => setYakin(true)}>
            Kembalikan data contoh
          </button>
        )}
        {pesan === 'Data contoh dikembalikan.' && <p className="mt-3 font-medium text-lumut">Data contoh sudah dikembalikan.</p>}
      </section>
    </div>
  );
}
