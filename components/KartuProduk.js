'use client';

import Link from 'next/link';
import { useState } from 'react';
import { GambarProduk, ContohKain } from './Busana';
import { cariKain, cariKategori } from '@/lib/data';
import { rentangHarga, stokKain, stokVarian, satuUkuran, produkAktif, totalStok } from '@/lib/katalog';
import { rupiah } from '@/lib/format';

export default function KartuProduk({ produk: p, inventaris, judulTag: Judul = 'h3', kainTampil, ukuranSorot }) {
  const awal = kainTampil && p.kain.includes(kainTampil) ? kainTampil : p.kain[0];
  const [kain, setKain] = useState(awal);
  const k = cariKain(kain);
  const { min, max } = rentangHarga(p);
  const habisSemua = totalStok(p, inventaris) <= 0 || !produkAktif(p, inventaris);
  const href = `/produk/${p.slug}${kain !== p.kain[0] ? `?kain=${kain}` : ''}`;
  const kat = cariKategori(p.kategori);
  return (
    <article className="group relative flex h-full flex-col">
      <div className="relative overflow-hidden rounded-[6px]" style={{ background: k.muda }}>
        <div aria-hidden="true" className="anyaman absolute inset-0" />
        <GambarProduk p={p} kain={kain} jenis="kartu" judul="" className="relative block aspect-[4/5] w-full transition-transform duration-500 ease-out group-hover:-translate-y-1 motion-reduce:transform-none" />
        <span className="label absolute left-2.5 top-2.5 rounded-[4px] bg-putih/90 px-2 py-1 text-[0.66rem] text-tinta-2">{kat?.nama}</span>
        {p.baru && <span className="label absolute right-2.5 top-2.5 rounded-[4px] bg-kunyit px-2 py-1 text-[0.66rem] text-tinta">Baru</span>}
        {habisSemua && <span className="label absolute inset-x-2.5 bottom-2.5 rounded-[4px] bg-tinta/85 px-2 py-1.5 text-center text-[0.68rem] text-white">Stok habis</span>}
      </div>
      <div className="mt-3 flex flex-1 flex-col">
        <Judul className="font-sans text-[1.02rem] font-semibold leading-snug tracking-normal">
          <Link href={href} className="rounded-sm after:absolute after:inset-x-0 after:top-0 after:aspect-[4/5] hover:underline hover:underline-offset-4">
            {p.nama}
          </Link>
        </Judul>
        <p className="mt-0.5 text-[0.9rem] text-tinta-2">
          {min === max ? rupiah(min) : `${rupiah(min)}–${rupiah(max)}`}
          <span className="text-tinta-3"> · {k.nama}</span>
        </p>
        <ul className="relative z-10 mt-2.5 flex flex-wrap gap-1.5" aria-label={`Kain ${p.nama}`}>
          {p.kain.map((id) => {
            const kn = cariKain(id);
            const habis = stokKain(p, id, inventaris) <= 0;
            return (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => setKain(id)}
                  aria-pressed={id === kain}
                  aria-label={`Lihat dengan kain ${kn.nama}${habis ? ' (habis)' : ''}`}
                  className={`relative block h-7 w-7 overflow-hidden rounded-full border-2 transition-transform hover:scale-110 ${
                    id === kain ? 'border-tinta' : 'border-transparent'
                  }`}
                >
                  <ContohKain kain={id} className="h-full w-full" skala={0.9} />
                  {habis && <span aria-hidden="true" className="absolute inset-0 m-auto h-[2px] w-[130%] -translate-x-[12%] rotate-45 bg-putih" />}
                </button>
              </li>
            );
          })}
        </ul>
        {!satuUkuran(p) && (
          <p className="mt-2 flex flex-wrap gap-x-2 gap-y-0.5 text-[0.8rem]">
            <span className="sr-only">Ukuran untuk kain {k.nama}: </span>
            {p.ukuran.map((u) => {
              const ada = stokVarian(p, kain, u.id, inventaris) > 0;
              const sorot = ukuranSorot && (u.id === ukuranSorot || u.id.split('/').includes(ukuranSorot));
              return (
                <span key={u.id} className={`${ada ? 'text-tinta-2' : 'text-tinta-3 line-through'} ${sorot && ada ? 'font-semibold text-nila' : ''}`}>
                  {u.id}
                  {!ada && <span className="sr-only"> (habis)</span>}
                </span>
              );
            })}
          </p>
        )}
      </div>
    </article>
  );
}
