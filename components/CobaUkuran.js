'use client';

import Link from 'next/link';
import { useState } from 'react';
import PitaUkur from './PitaUkur';
import { cariProduk } from '@/lib/data';
import { rekomendasi } from '@/lib/ukuran';
import { useProfil, useTerpasang, simpanProfil } from '@/lib/store';

// Coba cepat di beranda: geser lingkar dada, lihat ukuran Kemeja Teras yang disarankan.
const CONTOH = ['kemeja-teras', 'blus-shanghai', 'tunik-kebun'];

export default function CobaUkuran() {
  const terpasang = useTerpasang();
  const profil = useProfil();
  const [dada, setDada] = useState(null);
  const [slug, setSlug] = useState(CONTOH[0]);
  const nilai = dada ?? (terpasang && profil?.dada ? profil.dada : 96);
  const p = cariProduk(slug);
  const r = rekomendasi(p, { dada: nilai });
  return (
    <div className="terang rounded-[6px] bg-putih p-5 text-tinta shadow-[0_1px_0_rgba(13,20,38,0.08)] sm:p-7">
      <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
        <div className="min-w-[13rem] flex-1">
          <label htmlFor="coba-dada" className="font-semibold">
            Lingkar dada badanmu
          </label>
          <div className="mt-2 flex items-center gap-3">
            <input
              id="coba-dada"
              type="range"
              min="76"
              max="130"
              step="1"
              value={nilai}
              onChange={(e) => setDada(Number(e.target.value))}
              className="h-11 w-full accent-[#1d3157]"
              aria-valuetext={`${nilai} sentimeter`}
            />
            <output htmlFor="coba-dada" className="label min-w-[4.6rem] rounded-[4px] bg-kunyit px-2 py-1.5 text-center text-[0.9rem] text-tinta">
              {nilai} cm
            </output>
          </div>
        </div>
        <fieldset>
          <legend className="font-semibold">Untuk</legend>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {CONTOH.map((s) => (
              <label key={s} className="cursor-pointer has-[:checked]:bg-nila has-[:checked]:text-white has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-nila-3 rounded-[6px] border border-garis-tua px-3 py-2 text-[0.9rem]">
                <input type="radio" name="coba-produk" className="sr-only" checked={slug === s} onChange={() => setSlug(s)} />
                {cariProduk(s).nama}
              </label>
            ))}
          </div>
        </fieldset>
      </div>
      <PitaUkur rinci={r.rinci} badan={nilai} target={r.target} pilih={r.ukuran} className="mt-6 block w-full sm:hidden" W={430} />
      <PitaUkur rinci={r.rinci} badan={nilai} target={r.target} pilih={r.ukuran} className="mt-6 hidden w-full sm:block" />
      <p className="mt-4 text-[0.98rem]" aria-live="polite">
        <span className="font-semibold">Saran: {p.nama} ukuran {r.ukuran}.</span> {r.alasan}
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
        <button
          type="button"
          className="tombol tombol-nila"
          onClick={() => simpanProfil({ ...(profil || {}), dada: nilai })}
        >
          Simpan sebagai ukuranku
        </button>
        <Link href="/panduan-ukuran" className="tautan font-medium">
          Cara mengukur dan tabel lengkap
        </Link>
        {terpasang && profil?.dada === nilai && <span className="text-[0.9rem] font-medium text-lumut">Tersimpan. Halaman produk akan menandai ukuranmu.</span>}
      </div>
    </div>
  );
}
