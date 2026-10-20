'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Linimasa from './Linimasa';
import { cocokkanHP, labelStatus, waktuStatus, labelTukar } from '@/lib/pesanan';
import { statusPesanan } from '@/lib/data';
import { waktuWIB } from '@/lib/format';
import { usePesanan, useTerpasang, cariPesanan } from '@/lib/store';

export default function Lacak() {
  const terpasang = useTerpasang();
  const daftar = usePesanan();
  const [kode, setKode] = useState('');
  const [empat, setEmpat] = useState('');
  const [galat, setGalat] = useState({});
  const [ketemu, setKetemu] = useState(null);
  const [gagal, setGagal] = useState('');
  const hasilRef = useRef(null);

  useEffect(() => {
    const k = new URLSearchParams(window.location.search).get('kode');
    if (k) setKode(k);
  }, []);

  const o = ketemu ? cariPesanan(daftar, ketemu) : null;

  const cari = (e) => {
    e.preventDefault();
    const g = {};
    if (!kode.trim()) g.kode = 'Tulis kode pesanan, misalnya LGS-2610-0112.';
    if (!/^\d{4}$/.test(empat.trim())) g.empat = 'Tulis 4 angka terakhir nomor HP penerima.';
    setGalat(g);
    setGagal('');
    if (g.kode || g.empat) {
      requestAnimationFrame(() => document.getElementById(g.kode ? 'kode' : 'empat')?.focus());
      setKetemu(null);
      return;
    }
    const p = cariPesanan(daftar, kode);
    if (p && cocokkanHP(p, empat)) {
      setKetemu(p.kode);
      requestAnimationFrame(() => hasilRef.current?.focus());
    } else {
      setKetemu(null);
      setGagal('Kode pesanan dan nomor HP tidak cocok dengan pesanan mana pun di browser ini. Periksa lagi tanda hubung dan angkanya.');
      requestAnimationFrame(() => hasilRef.current?.focus());
    }
  };

  const contoh = terpasang ? daftar.slice(0, 6) : [];

  return (
    <div className="wadah grid gap-10 pb-20 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <form noValidate onSubmit={cari} className="grid gap-5 rounded-[6px] border-2 border-tinta bg-putih p-5 sm:grid-cols-[1fr_12rem] sm:p-6">
          <div>
            <label htmlFor="kode" className="font-medium">
              Kode pesanan
            </label>
            <input
              id="kode"
              className="isian label mt-1.5 text-[0.95rem] normal-case"
              autoComplete="off"
              autoCapitalize="characters"
              placeholder="LGS-2610-0112"
              value={kode}
              onChange={(e) => setKode(e.target.value)}
              aria-invalid={galat.kode ? 'true' : undefined}
              aria-describedby={galat.kode ? 'kode-galat' : undefined}
            />
            {galat.kode && (
              <p id="kode-galat" className="mt-1.5 text-[0.88rem] font-medium text-secang">
                {galat.kode}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="empat" className="font-medium">
              4 angka terakhir HP
            </label>
            <input
              id="empat"
              inputMode="numeric"
              maxLength={4}
              className="isian mt-1.5 tabular-nums"
              autoComplete="off"
              placeholder="0042"
              value={empat}
              onChange={(e) => setEmpat(e.target.value.replace(/\D/g, ''))}
              aria-invalid={galat.empat ? 'true' : undefined}
              aria-describedby={galat.empat ? 'empat-galat' : undefined}
            />
            {galat.empat && (
              <p id="empat-galat" className="mt-1.5 text-[0.88rem] font-medium text-secang">
                {galat.empat}
              </p>
            )}
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="tombol tombol-nila w-full sm:w-auto">
              Lacak pesanan
            </button>
          </div>
        </form>

        <div ref={hasilRef} tabIndex={-1} className="mt-8 outline-none" aria-live="polite">
          {gagal && <p className="rounded-[6px] border-2 border-secang bg-secang-muda p-4 font-medium text-secang">{gagal}</p>}
          {o && (
            <section aria-labelledby="judul-hasil">
              <div className="flex flex-wrap items-end justify-between gap-3 border-t-2 border-tinta pt-4">
                <div>
                  <h2 id="judul-hasil" className="text-[1.8rem]">
                    {o.kode}
                  </h2>
                  <p className="mt-1 text-tinta-2">
                    Status: <span className="font-semibold text-tinta">{labelStatus(o.status)}</span> · dibuat {waktuWIB(o.dibuat)}
                  </p>
                </div>
                <Link href={`/pesanan/${o.kode}`} className="tautan font-medium">
                  Buka detail pesanan
                </Link>
              </div>
              {(o.tukar || []).length > 0 && (
                <p className="mt-3 rounded-[6px] bg-nila-muda/60 p-3 text-[0.92rem]">
                  Tukar ukuran: {o.tukar.map((t) => `${t.kode} (${t.dari} → ${t.ke}, ${labelTukar(t.status).toLowerCase()})`).join('; ')}.
                </p>
              )}
              <div className="mt-6">
                <Linimasa tahap={statusPesanan} kini={o.status} waktu={(s) => waktuStatus(o, s)} />
              </div>
            </section>
          )}
        </div>
      </div>

      <aside aria-labelledby="judul-contoh" className="lg:col-span-5">
        <div className="rounded-[6px] border border-dashed border-garis-tua bg-kapas p-5 sm:p-6">
          <h2 id="judul-contoh" className="font-sans text-lg font-semibold tracking-normal">
            Pesanan di browser ini
          </h2>
          <p className="mt-1 text-[0.9rem] text-tinta-2">
            Toko demo menyimpan pesanan contoh dan pesananmu di browser ini. Pilih salah satu untuk mencoba.
          </p>
          {terpasang && contoh.length > 0 ? (
            <ul className="mt-4 grid gap-2">
              {contoh.map((p) => {
                const akhir = String(p.pembeli.hp).replace(/\D/g, '').slice(-4);
                return (
                  <li key={p.kode}>
                    <button
                      type="button"
                      onClick={() => {
                        setKode(p.kode);
                        setEmpat(akhir);
                        setGalat({});
                      }}
                      className="flex w-full items-center justify-between gap-3 rounded-[6px] border border-garis bg-putih px-3 py-2.5 text-start hover:border-garis-tua"
                    >
                      <span>
                        <span className="label block text-[0.72rem] text-tinta">{p.kode}</span>
                        <span className="block text-[0.82rem] text-tinta-2">HP berakhiran {akhir}</span>
                      </span>
                      <span className="text-[0.82rem] text-tinta-2">{labelStatus(p.status)}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-4 text-[0.9rem] text-tinta-3">{terpasang ? 'Belum ada pesanan.' : 'Memuat…'}</p>
          )}
        </div>
      </aside>
    </div>
  );
}
