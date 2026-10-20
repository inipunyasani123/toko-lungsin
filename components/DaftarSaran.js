'use client';

import Link from 'next/link';
import { produk } from '@/lib/data';
import { rekomendasi } from '@/lib/ukuran';
import { useProfil, useTerpasang } from '@/lib/store';
import { ContohKain } from './Busana';

// Saran ukuran untuk semua model berdasarkan profil Ukuranku.
export default function DaftarSaran() {
  const terpasang = useTerpasang();
  const profil = useProfil();
  const daftar = produk.filter((p) => p.acuan);
  const ada = terpasang && (profil?.dada || profil?.pinggul || profil?.pinggang);
  if (!ada) {
    return (
      <p className="rounded-[6px] border border-dashed border-garis-tua bg-putih p-4 text-tinta-2">
        Simpan ukuranmu di atas, lalu daftar ini akan menampilkan ukuran yang paling pas untuk setiap model.
      </p>
    );
  }
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {daftar.map((p) => {
        const r = rekomendasi(p, profil);
        return (
          <li key={p.slug} className="flex items-center gap-3 rounded-[6px] border border-garis bg-putih p-3">
            <ContohKain kain={p.kain[0]} className="h-10 w-10 shrink-0 rounded-[6px]" />
            <div className="min-w-0 flex-1">
              <Link href={`/produk/${p.slug}${r?.ukuran ? `?ukuran=${encodeURIComponent(r.ukuran)}` : ''}`} className="font-medium hover:underline">
                {p.nama}
              </Link>
              <p className="text-[0.84rem] text-tinta-2">
                {r
                  ? r.status === 'pas' || r.status === 'satu'
                    ? `Pas di ${r.ukuran}`
                    : r.status === 'besar'
                      ? `${r.ukuran}, akan terasa lebih longgar`
                      : r.status === 'mepet'
                        ? `${r.ukuran}, kemungkinan sempit`
                        : 'Belum ada ukuran yang muat'
                  : `Isi lingkar ${p.acuan} untuk melihat saran`}
              </p>
            </div>
            {r?.ukuran && <span className="label rounded-[4px] bg-nila px-2.5 py-1.5 text-[0.8rem] text-white">{r.ukuran}</span>}
          </li>
        );
      })}
    </ul>
  );
}
