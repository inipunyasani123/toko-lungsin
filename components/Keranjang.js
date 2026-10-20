'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { GambarProduk } from './Busana';
import { cariProduk, cariKain, site } from '@/lib/data';
import { hargaVarian, beratVarian, labelVarian, stokVarian, produkAktif, satuUkuran } from '@/lib/katalog';
import { beratKemasan } from '@/lib/ongkir';
import { rupiah, gram } from '@/lib/format';
import { useKeranjang, useInventaris, useTerpasang, ubahJumlah, hapusItem, gantiUkuran, itemKunci } from '@/lib/store';

export function rakitIsiKeranjang(keranjang, inv) {
  return keranjang
    .map((it) => {
      const p = cariProduk(it.slug);
      if (!p) return null;
      const stok = stokVarian(p, it.kain, it.ukuran, inv);
      return {
        ...it,
        kunci: itemKunci(it),
        p,
        stok,
        aktif: produkAktif(p, inv),
        harga: hargaVarian(p, it.kain, it.ukuran),
        berat: beratVarian(p, it.ukuran),
        label: labelVarian(p, it.kain, it.ukuran),
      };
    })
    .filter(Boolean);
}

// Pita meteran menuju subsidi ongkir
export function PitaSubsidi({ subtotal }) {
  const { minimal, potongan } = site.subsidi;
  const persen = Math.min(100, (subtotal / minimal) * 100);
  const kurang = Math.max(0, minimal - subtotal);
  return (
    <div>
      <p className="text-[0.92rem]">
        {kurang > 0 ? (
          <>
            Tambah <span className="font-semibold">{rupiah(kurang)}</span> lagi untuk potongan ongkir sampai {rupiah(potongan)}.
          </>
        ) : (
          <span className="font-semibold text-lumut">Ongkirmu dipotong sampai {rupiah(potongan)}.</span>
        )}
      </p>
      <div className="relative mt-2 h-4 overflow-hidden rounded-[3px] bg-kunyit-muda" role="img" aria-label={`Belanja ${rupiah(subtotal)} dari ${rupiah(minimal)} untuk potongan ongkir`}>
        <div className="meteran absolute inset-y-0 left-0 rounded-[3px]" style={{ width: `${persen}%` }} />
      </div>
    </div>
  );
}

function Stepper({ it }) {
  const maks = Math.max(1, it.stok);
  return (
    <div className="flex items-stretch rounded-[6px] border-[1.5px] border-garis-tua bg-putih" role="group" aria-label={`Jumlah ${it.p.nama}`}>
      <button type="button" className="min-h-10 w-10 text-lg disabled:text-tinta-3" onClick={() => ubahJumlah(it.kunci, it.qty - 1)} disabled={it.qty <= 1} aria-label={`Kurangi ${it.p.nama}`}>
        −
      </button>
      <span className="flex w-9 items-center justify-center font-semibold tabular-nums" aria-live="polite">
        <span className="sr-only">Jumlah: </span>
        {it.qty}
      </span>
      <button type="button" className="min-h-10 w-10 text-lg disabled:text-tinta-3" onClick={() => ubahJumlah(it.kunci, it.qty + 1)} disabled={it.qty >= maks} aria-label={`Tambah ${it.p.nama}`}>
        +
      </button>
    </div>
  );
}

function PilihUkuranBaris({ it, inv, onPesan }) {
  if (satuUkuran(it.p)) return <p className="text-[0.9rem] text-tinta-2">{it.ukuran}</p>;
  return (
    <label className="flex items-center gap-2 text-[0.9rem]">
      <span className="text-tinta-2">Ukuran</span>
      <select
        className="isian min-h-10 w-auto py-1.5"
        value={it.ukuran}
        onChange={(e) => {
          const r = gantiUkuran(it.kunci, e.target.value);
          onPesan(r.ok ? `${it.p.nama} diganti ke ukuran ${e.target.value}${r.terpotong ? ', jumlahnya disesuaikan dengan stok' : ''}.` : 'Ukuran itu sedang habis.');
        }}
        aria-label={`Ukuran ${it.p.nama}`}
      >
        {it.p.ukuran.map((u) => {
          const s = stokVarian(it.p, it.kain, u.id, inv);
          return (
            <option key={u.id} value={u.id} disabled={s <= 0 && u.id !== it.ukuran}>
              {u.id}
              {s <= 0 ? ' (habis)' : s <= 2 ? ` (tinggal ${s})` : ''}
            </option>
          );
        })}
      </select>
    </label>
  );
}

export default function Keranjang() {
  const terpasang = useTerpasang();
  const keranjang = useKeranjang();
  const inv = useInventaris();
  const [pesan, setPesan] = useState('');
  const isi = rakitIsiKeranjang(keranjang, inv);

  useEffect(() => {
    for (const it of isi) if (it.stok > 0 && it.qty > it.stok) ubahJumlah(it.kunci, it.stok);
  }, [isi]);

  if (!terpasang) {
    return (
      <div className="wadah pb-24">
        <p className="text-tinta-2">Memuat keranjang…</p>
      </div>
    );
  }

  if (!isi.length) {
    return (
      <div className="wadah pb-24">
        <div className="rounded-[6px] border border-dashed border-garis-tua bg-putih p-6 sm:p-10">
          <h2 className="text-[1.8rem] sm:text-[2.2rem]">Keranjangmu masih kosong</h2>
          <p className="mt-2 max-w-md text-tinta-2">Mulai dari padanan pilihan, atau lihat semua baju di rak.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/koleksi" className="tombol tombol-nila">
              Lihat koleksi
            </Link>
            <Link href="/padu-padan" className="tombol tombol-garis">
              Susun padanan
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = isi.reduce((n, it) => n + it.harga * it.qty, 0);
  const berat = isi.reduce((n, it) => n + it.berat * it.qty, 0);
  const jumlah = isi.reduce((n, it) => n + it.qty, 0);
  const masalah = isi.filter((it) => it.stok <= 0 || !it.aktif);

  return (
    <div className="wadah grid gap-10 pb-6 lg:grid-cols-12">
      <section aria-labelledby="judul-isi" className="lg:col-span-8">
        <h2 id="judul-isi" className="sr-only">
          Isi keranjang
        </h2>
        <div role="status" aria-live="polite" className="min-h-0">
          {pesan && <p className="mb-4 rounded-[6px] bg-lumut-muda p-3 text-[0.95rem]">{pesan}</p>}
        </div>
        <ul className="border-t-2 border-tinta">
          {isi.map((it) => {
            const habis = it.stok <= 0 || !it.aktif;
            return (
              <li key={it.kunci} className="grid grid-cols-[5.5rem_1fr] gap-4 border-b border-garis py-5 sm:grid-cols-[7rem_1fr_auto]">
                <div className="aspect-[4/5] overflow-hidden rounded-[6px]" style={{ background: cariKain(it.kain)?.muda }}>
                  <GambarProduk p={it.p} kain={it.kain} jenis="kartu" judul="" className="h-full w-full" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-[1.05rem]">
                    <Link href={`/produk/${it.slug}?kain=${it.kain}`} className="hover:underline">
                      {it.p.nama}
                    </Link>
                  </h3>
                  <p className="text-[0.92rem] text-tinta-2">Kain {cariKain(it.kain)?.nama}</p>
                  <div className="mt-2">
                    <PilihUkuranBaris it={it} inv={inv} onPesan={setPesan} />
                  </div>
                  <p className="mt-2 text-[0.92rem]">
                    {rupiah(it.harga)} <span className="text-tinta-3">· {gram(it.berat)}</span>
                  </p>
                  {habis ? (
                    <p className="mt-2 text-[0.9rem] font-medium text-secang">
                      {it.aktif ? 'Stok pilihan ini habis.' : 'Produk ini sedang tidak dijual.'} Ganti ukuran atau hapus untuk melanjutkan.
                    </p>
                  ) : it.qty >= it.stok ? (
                    <p className="mt-2 text-[0.85rem] text-secang">Sudah maksimal, stok tinggal {it.stok}.</p>
                  ) : null}
                  <div className="mt-3 flex flex-wrap items-center gap-4 sm:hidden">
                    {!habis && <Stepper it={it} />}
                    <button type="button" className="tautan text-[0.92rem]" onClick={() => hapusItem(it.kunci)}>
                      Hapus<span className="sr-only"> {it.p.nama}</span>
                    </button>
                  </div>
                </div>
                <div className="hidden flex-col items-end justify-between gap-3 sm:flex">
                  <p className="text-lg font-semibold tabular-nums">{rupiah(it.harga * it.qty)}</p>
                  {!habis && <Stepper it={it} />}
                  <button type="button" className="tautan text-[0.92rem]" onClick={() => hapusItem(it.kunci)}>
                    Hapus<span className="sr-only"> {it.p.nama}</span>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
        <Link href="/koleksi" className="tautan mt-5 inline-block font-medium">
          Lanjut belanja
        </Link>
      </section>

      <aside aria-labelledby="judul-ringkas" className="lg:col-span-4">
        <div className="rounded-[6px] border border-garis-tua bg-putih p-5 sm:p-6 lg:sticky lg:top-24">
          <h2 id="judul-ringkas" className="text-[1.5rem]">
            Ringkasan
          </h2>
          <dl className="mt-4 grid gap-2 text-[0.95rem]">
            <div className="flex justify-between gap-4">
              <dt className="text-tinta-2">Subtotal ({jumlah} barang)</dt>
              <dd className="font-semibold tabular-nums">{rupiah(subtotal)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-tinta-2">Berat barang + kemasan</dt>
              <dd className="tabular-nums">{gram(berat + beratKemasan(jumlah))}</dd>
            </div>
          </dl>
          <div className="mt-4 border-t border-garis pt-4">
            <PitaSubsidi subtotal={subtotal} />
          </div>
          <p className="mt-4 text-[0.88rem] text-tinta-2">Ongkir dihitung di checkout dari provinsi tujuan dan berat kiriman, dibulatkan ke atas per kg.</p>
          {masalah.length > 0 ? (
            <>
              <p className="mt-4 text-[0.9rem] font-medium text-secang" role="status">
                Ada {masalah.length} barang yang tidak bisa dipesan. Ganti ukuran atau hapus dulu.
              </p>
              <span className="tombol mt-4 w-full" aria-disabled="true">
                Lanjut ke checkout
              </span>
            </>
          ) : (
            <Link href="/checkout" className="tombol tombol-nila mt-5 w-full">
              Lanjut ke checkout
            </Link>
          )}
        </div>
      </aside>

      {masalah.length === 0 && (
        <div className="sticky bottom-0 z-30 -mx-4 border-t border-garis-tua bg-putih/95 px-4 py-3 shadow-[0_-8px_20px_-12px_rgba(13,20,38,0.35)] sm:-mx-6 sm:px-6 lg:hidden">
          <div className="flex items-center gap-3">
            <p className="min-w-0 flex-1">
              <span className="block text-[0.82rem] text-tinta-2">Subtotal {jumlah} barang</span>
              <span className="block font-semibold tabular-nums">{rupiah(subtotal)}</span>
            </p>
            <Link href="/checkout" className="tombol tombol-nila px-5">
              Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
