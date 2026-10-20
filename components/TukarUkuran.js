'use client';

import { useId, useState } from 'react';
import Linimasa from './Linimasa';
import { cariProduk, cariKain, statusTukar, alasanTukar, site } from '@/lib/data';
import { bolehTukar, itemBisaTukar, labelTukar } from '@/lib/pesanan';
import { stokVarian } from '@/lib/katalog';
import { tanggalSaja, sisaHari, waktuWIB } from '@/lib/format';
import { ajukanTukar, useInventaris } from '@/lib/store';

// Bagian tukar ukuran di halaman pesanan: daftar pengajuan + formulir pengajuan baru.
export default function TukarUkuran({ o, sekarang }) {
  const id = useId();
  const inv = useInventaris();
  const cek = bolehTukar(o, sekarang);
  const bisa = itemBisaTukar(o);
  const [buka, setBuka] = useState(false);
  const [indeks, setIndeks] = useState(bisa[0]?.indeks ?? -1);
  const [ke, setKe] = useState('');
  const [alasan, setAlasan] = useState('');
  const [catatan, setCatatan] = useState('');
  const [galat, setGalat] = useState({});
  const [pesan, setPesan] = useState('');

  const item = o.items[indeks];
  const p = item ? cariProduk(item.slug) : null;

  const kirim = (e) => {
    e.preventDefault();
    const g = {};
    if (!item) g.item = 'Pilih barang yang ingin ditukar.';
    if (!ke) g.ke = 'Pilih ukuran pengganti.';
    if (!alasan) g.alasan = 'Pilih alasan tukar.';
    setGalat(g);
    if (Object.keys(g).length) {
      const pertama = g.item ? `${id}-item` : g.ke ? `${id}-ke-0` : `${id}-alasan-0`;
      requestAnimationFrame(() => document.getElementById(pertama)?.focus());
      return;
    }
    const r = ajukanTukar(o.kode, { indeks, ke, alasan, catatan: catatan.trim() });
    if (r.ok) {
      setPesan(`Pengajuan ${r.kode} terkirim. Ukuran ${ke} sudah kami sisihkan untukmu.`);
      setBuka(false);
      setKe('');
      setAlasan('');
      setCatatan('');
      const sisa = itemBisaTukar({ ...o, tukar: [...(o.tukar || []), { indeks }] });
      setIndeks(sisa[0]?.indeks ?? -1);
    } else setGalat({ ke: r.habis ? 'Ukuran itu baru saja habis. Pilih ukuran lain.' : 'Pengajuan gagal. Coba lagi.' });
  };

  return (
    <section aria-labelledby={`${id}-judul`} className="rounded-[6px] border-2 border-dashed border-nila/40 bg-nila-muda/40 p-5 sm:p-6">
      <h2 id={`${id}-judul`} className="text-[1.5rem] sm:text-[1.75rem]">
        Tukar ukuran
      </h2>
      {cek.sampai && (
        <p className="mt-1 text-[0.92rem] text-tinta-2">
          Bisa diajukan sampai {tanggalSaja(cek.sampai)} ({sisaHari(cek.sampai, sekarang)}). Sekali untuk setiap barang, label masih terpasang.
        </p>
      )}
      {!cek.sampai && <p className="mt-1 text-[0.92rem] text-tinta-2">{cek.alasan} Masa tukar {site.hariTukar} hari dihitung sejak paket diterima.</p>}

      <div role="status" aria-live="polite">
        {pesan && <p className="mt-4 rounded-[6px] bg-lumut-muda p-3 text-[0.95rem] font-medium">{pesan}</p>}
      </div>

      {(o.tukar || []).length > 0 && (
        <ul className="mt-5 grid gap-4">
          {o.tukar.map((t) => (
            <li key={t.kode} className="rounded-[6px] bg-putih p-4">
              <p className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="label text-[0.78rem] text-nila">{t.kode}</span>
                <span className="text-[0.88rem] font-medium">{labelTukar(t.status)}</span>
              </p>
              <p className="mt-1 text-[0.95rem]">
                {t.nama} · {cariKain(t.kain)?.nama}: <span className="font-semibold">{t.dari}</span> → <span className="font-semibold">{t.ke}</span>
              </p>
              <p className="text-[0.85rem] text-tinta-3">
                Diajukan {waktuWIB(t.dibuat)} · {alasanTukar.find((a) => a.id === t.alasan)?.label}
              </p>
              <div className="mt-4">
                <Linimasa tahap={statusTukar} kini={t.status} waktu={(s) => t.riwayat.find((r) => r.status === s)?.waktu} />
              </div>
            </li>
          ))}
        </ul>
      )}

      {cek.boleh && bisa.length > 0 && !buka && (
        <button type="button" className="tombol tombol-nila mt-5" onClick={() => setBuka(true)}>
          Ajukan tukar ukuran
        </button>
      )}
      {cek.boleh && bisa.length === 0 && (o.tukar || []).length > 0 && <p className="mt-4 text-[0.9rem] text-tinta-2">Semua barang di pesanan ini sudah diajukan tukar.</p>}

      {buka && (
        <form noValidate onSubmit={kirim} className="mt-5 grid gap-5 rounded-[6px] bg-putih p-4 sm:p-5">
          <div>
            <label htmlFor={`${id}-item`} className="font-medium">
              Barang
            </label>
            <select
              id={`${id}-item`}
              className="isian mt-1.5"
              value={indeks}
              onChange={(e) => {
                setIndeks(Number(e.target.value));
                setKe('');
              }}
              aria-invalid={galat.item ? 'true' : undefined}
            >
              {bisa.map((it) => (
                <option key={it.indeks} value={it.indeks}>
                  {it.nama} · {cariKain(it.kain)?.nama}, ukuran {it.ukuran}
                </option>
              ))}
            </select>
            {galat.item && <p className="mt-1 text-[0.86rem] font-medium text-secang">{galat.item}</p>}
          </div>
          {p && (
            <fieldset aria-describedby={galat.ke ? `${id}-ke-galat` : undefined}>
              <legend className="font-medium">Tukar ke ukuran</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {p.ukuran
                  .filter((u) => u.id !== item.ukuran)
                  .map((u, i) => {
                    const s = stokVarian(p, item.kain, u.id, inv);
                    return (
                      <label
                        key={u.id}
                        className={`flex min-h-11 min-w-[4.5rem] flex-col items-center justify-center rounded-[6px] border-2 px-3 py-1 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-nila-3 ${
                          ke === u.id ? 'border-nila bg-nila text-white' : 'border-garis-tua'
                        } ${s <= 0 ? 'cursor-not-allowed border-dashed text-tinta-3' : 'cursor-pointer'}`}
                      >
                        <input id={`${id}-ke-${i}`} type="radio" name={`${id}-ke`} className="sr-only" value={u.id} checked={ke === u.id} disabled={s <= 0} onChange={() => setKe(u.id)} />
                        <span className="font-semibold">{u.id}</span>
                        <span className={`label text-[0.58rem] ${ke === u.id ? 'text-[#dfe4ee]' : s <= 0 ? 'text-secang' : 'text-tinta-3'}`}>{s <= 0 ? 'Habis' : `Stok ${s}`}</span>
                      </label>
                    );
                  })}
              </div>
              {galat.ke && (
                <p id={`${id}-ke-galat`} className="mt-1 text-[0.86rem] font-medium text-secang">
                  {galat.ke}
                </p>
              )}
            </fieldset>
          )}
          <fieldset aria-describedby={galat.alasan ? `${id}-alasan-galat` : undefined}>
            <legend className="font-medium">Alasan</legend>
            <div className="mt-2 grid gap-1 sm:grid-cols-2">
              {alasanTukar.map((a, i) => (
                <label key={a.id} className="flex min-h-10 cursor-pointer items-center gap-3">
                  <input id={`${id}-alasan-${i}`} type="radio" name={`${id}-alasan`} className="h-[1.1rem] w-[1.1rem] accent-[#1d3157]" checked={alasan === a.id} onChange={() => setAlasan(a.id)} />
                  {a.label}
                </label>
              ))}
            </div>
            {galat.alasan && (
              <p id={`${id}-alasan-galat`} className="mt-1 text-[0.86rem] font-medium text-secang">
                {galat.alasan}
              </p>
            )}
          </fieldset>
          <div>
            <label htmlFor={`${id}-catatan`} className="font-medium">
              Catatan <span className="font-normal text-tinta-3">(boleh dikosongkan)</span>
            </label>
            <textarea id={`${id}-catatan`} rows={2} className="isian mt-1.5" value={catatan} onChange={(e) => setCatatan(e.target.value)} placeholder="Mis. bahunya pas, tapi dada terasa sempit" />
          </div>
          <p className="text-[0.88rem] text-tinta-2">
            Setelah disetujui, kirim barang lama ke bengkel kami di Klaten (ongkir ditanggung pembeli). Ukuran baru kami kirim dengan ongkir kami.
          </p>
          <div className="flex flex-wrap gap-3">
            <button type="submit" className="tombol tombol-nila">
              Kirim pengajuan
            </button>
            <button type="button" className="tombol tombol-garis" onClick={() => setBuka(false)}>
              Batal
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
