'use client';

import { useEffect, useId, useState } from 'react';
import { caraUkur } from '@/lib/data';
import { periksaProfil } from '@/lib/ukuran';
import { useProfil, useTerpasang, simpanProfil, hapusProfil } from '@/lib/store';
import { waktuWIB } from '@/lib/format';

const KOLOM = ['dada', 'pinggang', 'pinggul', 'tinggi'];
const CONTOH = { dada: 96, pinggang: 80, pinggul: 100, tinggi: 160 };

// Formulir "Ukuranku": empat ukuran badan, disimpan di browser ini saja.
export default function FormUkuranku({ ringkas = false, cara = true, onSimpan }) {
  const id = useId();
  const terpasang = useTerpasang();
  const profil = useProfil();
  const [f, setF] = useState({ dada: '', pinggang: '', pinggul: '', tinggi: '' });
  const [galat, setGalat] = useState({});
  const [pesan, setPesan] = useState('');

  useEffect(() => {
    if (!terpasang) return;
    setF({
      dada: profil?.dada ? String(profil.dada) : '',
      pinggang: profil?.pinggang ? String(profil.pinggang) : '',
      pinggul: profil?.pinggul ? String(profil.pinggul) : '',
      tinggi: profil?.tinggi ? String(profil.tinggi) : '',
    });
  }, [terpasang, profil]);

  const kirim = (e) => {
    e.preventDefault();
    const g = periksaProfil(f);
    setGalat(g);
    const pertama = KOLOM.find((k) => g[k]);
    if (pertama) {
      document.getElementById(`${id}-${pertama}`)?.focus();
      setPesan('');
      return;
    }
    if (!KOLOM.some((k) => String(f[k]).trim())) {
      setPesan('Isi setidaknya satu ukuran, misalnya lingkar dada.');
      return;
    }
    simpanProfil(f);
    setPesan('Ukuranmu tersimpan di browser ini. Halaman produk sekarang menandai ukuran yang paling pas.');
    onSimpan?.();
  };

  return (
    <form noValidate onSubmit={kirim} className="grid gap-4">
      <div className={`grid gap-4 ${ringkas ? 'grid-cols-2' : 'sm:grid-cols-2'}`}>
        {KOLOM.map((k) => {
          const c = caraUkur.find((x) => x.id === k);
          return (
            <div key={k}>
              <label htmlFor={`${id}-${k}`} className="font-medium">
                {c.nama} <span className="font-normal text-tinta-3">(cm)</span>
              </label>
              {!ringkas && cara && (
                <p id={`${id}-${k}-cara`} className="text-[0.84rem] text-tinta-3">
                  {c.cara}
                </p>
              )}
              <input
                id={`${id}-${k}`}
                inputMode="decimal"
                autoComplete="off"
                className="isian mt-1.5 tabular-nums"
                placeholder={`mis. ${CONTOH[k]}`}
                value={f[k]}
                onChange={(e) => setF((x) => ({ ...x, [k]: e.target.value }))}
                aria-invalid={galat[k] ? 'true' : undefined}
                aria-describedby={[galat[k] ? `${id}-${k}-galat` : '', ringkas || !cara ? '' : `${id}-${k}-cara`].filter(Boolean).join(' ') || undefined}
              />
              {galat[k] && (
                <p id={`${id}-${k}-galat`} className="mt-1 text-[0.86rem] font-medium text-secang">
                  {galat[k]}
                </p>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="tombol tombol-nila">
          Simpan ukuranku
        </button>
        {terpasang && profil?.disimpan && (
          <button
            type="button"
            className="tautan text-[0.92rem]"
            onClick={() => {
              hapusProfil();
              setPesan('Ukuran tersimpan sudah dihapus.');
            }}
          >
            Hapus ukuran tersimpan
          </button>
        )}
      </div>
      <p role="status" className="min-h-[1.25rem] text-[0.92rem] font-medium text-lumut">
        {pesan || (terpasang && profil?.disimpan ? `Tersimpan ${waktuWIB(profil.disimpan)}. Hanya di browser ini.` : '')}
      </p>
    </form>
  );
}
