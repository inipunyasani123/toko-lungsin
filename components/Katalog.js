'use client';

import { useEffect, useId, useMemo, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import KartuProduk from './KartuProduk';
import { ContohKain } from './Busana';
import { produk, kategori, kain } from '@/lib/data';
import { saringProduk, rentangFilter, urutan, produkAktif, UKURAN_HURUF } from '@/lib/katalog';
import { useInventaris, useTerpasang } from '@/lib/store';

function bacaFilter(sp) {
  const daftar = (k) => (sp.get(k) || '').split(',').map((x) => x.trim()).filter(Boolean);
  return {
    q: sp.get('q') || '',
    kategori: daftar('kategori').filter((x) => kategori.some((k) => k.id === x)),
    kain: daftar('kain').filter((x) => kain.some((k) => k.id === x)),
    ukuran: UKURAN_HURUF.includes(sp.get('ukuran')) ? sp.get('ukuran') : '',
    harga: rentangFilter.some((r) => r.id === sp.get('harga')) ? sp.get('harga') : '',
    tertutup: sp.get('tertutup') === '1',
    urut: urutan.some((u) => u.id === sp.get('urut')) ? sp.get('urut') : 'pilihan',
  };
}

function keQuery(f) {
  const p = new URLSearchParams();
  if (f.q.trim()) p.set('q', f.q);
  if (f.kategori.length) p.set('kategori', f.kategori.join(','));
  if (f.kain.length) p.set('kain', f.kain.join(','));
  if (f.ukuran) p.set('ukuran', f.ukuran);
  if (f.harga) p.set('harga', f.harga);
  if (f.tertutup) p.set('tertutup', '1');
  if (f.urut && f.urut !== 'pilihan') p.set('urut', f.urut);
  const s = p.toString();
  return s ? `?${s}` : '';
}

function Pilihan({ checked, onChange, children, type = 'checkbox', name }) {
  return (
    <label className="flex min-h-10 cursor-pointer items-center gap-3 rounded-[4px] py-1 hover:bg-kapas">
      <input type={type} name={name} className="h-[1.1rem] w-[1.1rem] shrink-0 accent-[#1d3157]" checked={checked} onChange={onChange} />
      {children}
    </label>
  );
}

export default function Katalog() {
  const sp = useSearchParams();
  return <KatalogIsi kunciSp={sp.toString()} />;
}

// Dipakai sebagai cadangan Suspense saat render statis: tata letaknya sama persis, jadi tidak ada pergeseran.
export function KatalogStatis() {
  return <KatalogIsi kunciSp="" />;
}

function KatalogIsi({ kunciSp }) {
  const sp = useMemo(() => new URLSearchParams(kunciSp), [kunciSp]);
  const path = usePathname();
  const inventaris = useInventaris();
  const terpasang = useTerpasang();
  const [filter, setFilter] = useState(() => bacaFilter(sp));
  const [panel, setPanel] = useState(false);
  const idPanel = useId();

  useEffect(() => {
    setFilter(bacaFilter(new URLSearchParams(kunciSp)));
  }, [kunciSp]);

  const ubah = (patch) => {
    const baru = { ...filter, ...patch };
    setFilter(baru);
    window.history.replaceState(null, '', `${path}${keQuery(baru)}`);
  };
  const balik = (kunci, id) => {
    const ada = filter[kunci].includes(id);
    ubah({ [kunci]: ada ? filter[kunci].filter((x) => x !== id) : [...filter[kunci], id] });
  };

  const inv = terpasang ? inventaris : undefined;
  const hasil = useMemo(() => saringProduk(produk, filter, inv), [filter, inv]);
  const aktifSemua = produk.filter((p) => produkAktif(p, inv));
  const jumlahFilter =
    filter.kategori.length + filter.kain.length + (filter.ukuran ? 1 : 0) + (filter.harga ? 1 : 0) + (filter.tertutup ? 1 : 0) + (filter.q.trim() ? 1 : 0);

  const chip = [
    ...(filter.q.trim() ? [{ label: `“${filter.q.trim()}”`, hapus: () => ubah({ q: '' }) }] : []),
    ...filter.kategori.map((id) => ({ label: kategori.find((k) => k.id === id).nama, hapus: () => balik('kategori', id) })),
    ...filter.kain.map((id) => ({ label: kain.find((k) => k.id === id).nama, hapus: () => balik('kain', id) })),
    ...(filter.ukuran ? [{ label: `Ada ukuran ${filter.ukuran}`, hapus: () => ubah({ ukuran: '' }) }] : []),
    ...(filter.harga ? [{ label: rentangFilter.find((r) => r.id === filter.harga).label, hapus: () => ubah({ harga: '' }) }] : []),
    ...(filter.tertutup ? [{ label: 'Lengan panjang & menutup', hapus: () => ubah({ tertutup: false }) }] : []),
  ];
  const kosongkan = () => ubah({ q: '', kategori: [], kain: [], ukuran: '', harga: '', tertutup: false });

  const pilihUrut = (
    <select className="isian min-h-11 w-auto py-2" value={filter.urut} onChange={(e) => ubah({ urut: e.target.value })} aria-label="Urutkan">
      {urutan.map((u) => (
        <option key={u.id} value={u.id}>
          {u.label}
        </option>
      ))}
    </select>
  );

  return (
    <div className="wadah grid gap-8 pb-20 lg:grid-cols-12">
      <div className="flex flex-wrap items-center gap-3 lg:hidden">
        <button type="button" className="tombol tombol-garis min-h-11 py-2" aria-expanded={panel} aria-controls={idPanel} onClick={() => setPanel((v) => !v)}>
          {panel ? 'Tutup saringan' : 'Saring'}
          {jumlahFilter > 0 && <span className="label rounded-full bg-nila px-2 py-0.5 text-[0.75rem] text-white">{jumlahFilter}</span>}
        </button>
        <div className="ms-auto">{pilihUrut}</div>
      </div>

      <aside id={idPanel} aria-label="Saringan koleksi" className={`${panel ? 'block' : 'hidden'} lg:sticky lg:top-24 lg:col-span-3 lg:block lg:self-start`}>
        <form role="search" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="cari-koleksi" className="font-semibold">
            Cari
          </label>
          <input
            id="cari-koleksi"
            type="search"
            className="isian mt-2"
            placeholder="mis. kemeja, nila, kulot"
            value={filter.q}
            onChange={(e) => ubah({ q: e.target.value })}
            autoComplete="off"
          />
        </form>

        <fieldset className="mt-6 border-t border-garis pt-4">
          <legend className="float-left w-full font-semibold">Ada di ukuran</legend>
          <div className="clear-both flex flex-wrap gap-1.5 pt-3">
            {['', ...UKURAN_HURUF].map((u) => (
              <label
                key={u || 'semua'}
                className="flex min-h-10 min-w-11 cursor-pointer items-center justify-center rounded-[6px] border border-garis-tua px-2.5 text-[0.9rem] font-medium has-[:checked]:border-nila has-[:checked]:bg-nila has-[:checked]:text-white has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-nila-3 hover:border-tinta"
              >
                <input type="radio" name="ukuran" className="sr-only" checked={filter.ukuran === u} onChange={() => ubah({ ukuran: u })} />
                {u || 'Semua'}
              </label>
            ))}
          </div>
          <p className="mt-2 text-[0.8rem] text-tinta-3">Hanya yang stoknya masih ada di ukuran itu.</p>
        </fieldset>

        <fieldset className="mt-6 border-t border-garis pt-4">
          <legend className="float-left w-full font-semibold">Kategori</legend>
          <ul className="clear-both grid gap-0.5 pt-2">
            {kategori.map((k) => (
              <li key={k.id}>
                <Pilihan checked={filter.kategori.includes(k.id)} onChange={() => balik('kategori', k.id)}>
                  <span>{k.nama}</span>
                  <span className="label ms-auto text-[0.75rem] text-tinta-3">{aktifSemua.filter((p) => p.kategori === k.id).length}</span>
                </Pilihan>
              </li>
            ))}
          </ul>
        </fieldset>

        <fieldset className="mt-6 border-t border-garis pt-4">
          <legend className="float-left w-full font-semibold">Kain</legend>
          <ul className="clear-both grid grid-cols-2 gap-2 pt-3">
            {kain.map((k) => {
              const pilih = filter.kain.includes(k.id);
              return (
                <li key={k.id}>
                  <label
                    className={`flex h-full cursor-pointer items-center gap-2 rounded-[6px] border p-1.5 text-[0.85rem] leading-tight has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-nila-3 ${
                      pilih ? 'border-nila bg-nila-muda' : 'border-garis hover:border-garis-tua'
                    }`}
                  >
                    <input type="checkbox" className="sr-only" checked={pilih} onChange={() => balik('kain', k.id)} />
                    <ContohKain kain={k.id} className="h-7 w-7 shrink-0 rounded-[4px]" skala={0.9} />
                    <span>
                      {k.nama}
                      {pilih && <span className="sr-only"> (dipilih)</span>}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </fieldset>

        <fieldset className="mt-6 border-t border-garis pt-4">
          <legend className="float-left w-full font-semibold">Harga</legend>
          <ul className="clear-both grid gap-0.5 pt-2">
            {[{ id: '', label: 'Semua harga' }, ...rentangFilter].map((r) => (
              <li key={r.id || 'semua'}>
                <Pilihan type="radio" name="harga" checked={filter.harga === r.id} onChange={() => ubah({ harga: r.id })}>
                  <span>{r.label}</span>
                </Pilihan>
              </li>
            ))}
          </ul>
        </fieldset>

        <fieldset className="mt-6 border-t border-garis pt-4">
          <legend className="float-left w-full font-semibold">Potongan</legend>
          <div className="clear-both pt-2">
            <Pilihan checked={filter.tertutup} onChange={() => ubah({ tertutup: !filter.tertutup })}>
              <span>Lengan panjang &amp; menutup, ramah dipakai berkerudung</span>
            </Pilihan>
          </div>
        </fieldset>

        {jumlahFilter > 0 && (
          <button type="button" className="tautan mt-6 font-medium" onClick={kosongkan}>
            Hapus semua saringan
          </button>
        )}
      </aside>

      <div className="lg:col-span-9">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-garis pb-3">
          <p aria-live="polite" className="font-medium">
            {hasil.length === aktifSemua.length && jumlahFilter === 0 ? `${hasil.length} model` : `Menampilkan ${hasil.length} dari ${aktifSemua.length} model`}
          </p>
          <div className="ms-auto hidden lg:block">{pilihUrut}</div>
          {chip.length > 0 && (
            <ul className="flex w-full flex-wrap gap-2" aria-label="Saringan aktif">
              {chip.map((c) => (
                <li key={c.label}>
                  <button type="button" onClick={c.hapus} className="inline-flex min-h-9 items-center gap-2 rounded-[6px] bg-kapas px-3 py-1.5 text-[0.88rem] hover:bg-blacu">
                    {c.label}
                    <span aria-hidden="true">×</span>
                    <span className="sr-only">, hapus saringan ini</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {hasil.length > 0 ? (
          <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 md:grid-cols-3">
            {hasil.map((p) => (
              <li key={p.slug}>
                <KartuProduk produk={p} inventaris={inv} judulTag="h2" kainTampil={filter.kain.find((k) => p.kain.includes(k))} ukuranSorot={filter.ukuran} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-8 rounded-[6px] border border-dashed border-garis-tua bg-putih p-6 sm:p-8">
            <h2 className="text-[1.6rem]">Rak ini kosong</h2>
            <p className="mt-2 max-w-lg text-tinta-2">
              Tidak ada model yang cocok dengan saringanmu. Coba kurangi saringan kain atau ukuran, atau cari dengan kata lain.
            </p>
            <button type="button" className="tombol tombol-nila mt-5" onClick={kosongkan}>
              Hapus semua saringan
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
