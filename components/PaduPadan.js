'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Busana, { GambarProduk, ContohKain } from './Busana';
import { produk, padanan, cariProduk, cariKain } from '@/lib/data';
import { hargaVarian, stokVarian, satuUkuran, varianAwal } from '@/lib/katalog';
import { rekomendasi } from '@/lib/ukuran';
import { rupiah } from '@/lib/format';
import { useInventaris, useProfil, useTerpasang, tambahBanyak } from '@/lib/store';

const SLOT = [
  { id: 'atas', nama: 'Atasan atau terusan', kategori: ['atasan', 'terusan'], wajib: true },
  { id: 'bawahan', nama: 'Bawahan', kategori: ['bawahan'] },
  { id: 'luaran', nama: 'Luaran', kategori: ['luaran'] },
  { id: 'aksesori', nama: 'Aksesori', kategori: ['aksesori'], banyak: true },
];

const SOSOK = [
  { id: 'manekin', nama: 'Manekin' },
  { id: 'a', nama: 'Sosok 1', sosok: { kulit: 'sawo', rambut: 'pendek', sepatu: '#2b2a2d' } },
  { id: 'b', nama: 'Sosok 2', sosok: { kulit: 'langsat', rambut: 'sanggul', sepatu: '#6d4a33' } },
  { id: 'c', nama: 'Sosok 3', sosok: { kulit: 'gelap', rambut: 'ikat', sepatu: '#2b2a2d' } },
  { id: 'd', nama: 'Sosok 4', sosok: { kulit: 'kuning', rambut: 'bob', sepatu: '#8a3b2a' } },
];

const pilihanSlot = (slot) => produk.filter((p) => slot.kategori.includes(p.kategori));

function dariPadanan(pd) {
  const s = { atas: null, bawahan: null, luaran: null, aksesori: [] };
  for (const l of pd.lapis) {
    const p = cariProduk(l.slug);
    const v = { slug: l.slug, kain: l.kain };
    if (p.kategori === 'aksesori') s.aksesori.push(v);
    else if (p.kategori === 'luaran') s.luaran = v;
    else if (p.kategori === 'bawahan') s.bawahan = v;
    else s.atas = v;
  }
  return s;
}

function bacaUrl(sp) {
  const pd = padanan.find((x) => x.id === sp.get('padanan'));
  if (pd) return dariPadanan(pd);
  const urai = (v) => {
    if (!v) return null;
    const [slug, kain] = v.split(':');
    const p = cariProduk(slug);
    if (!p) return null;
    return { slug, kain: p.kain.includes(kain) ? kain : p.kain[0] };
  };
  const s = {
    atas: urai(sp.get('atasan')) || urai(sp.get('terusan')),
    bawahan: urai(sp.get('bawahan')),
    luaran: urai(sp.get('luaran')),
    aksesori: (sp.get('aksesori') || '').split(',').map(urai).filter(Boolean),
  };
  if (!s.atas && !s.bawahan && !s.luaran && !s.aksesori.length) return dariPadanan(padanan[0]);
  if (!s.atas) s.atas = { slug: 'kemeja-teras', kain: 'gerimis-nila' };
  return s;
}

function keUrl(s) {
  const p = new URLSearchParams();
  const tulis = (v) => `${v.slug}:${v.kain}`;
  if (s.atas) p.set(cariProduk(s.atas.slug).kategori === 'terusan' ? 'terusan' : 'atasan', tulis(s.atas));
  if (s.bawahan) p.set('bawahan', tulis(s.bawahan));
  if (s.luaran) p.set('luaran', tulis(s.luaran));
  if (s.aksesori.length) p.set('aksesori', s.aksesori.map(tulis).join(','));
  return `?${p.toString()}`;
}

export default function PaduPadan() {
  const sp = useSearchParams();
  return <PaduPadanIsi kunciSp={sp.toString()} />;
}

// Cadangan Suspense saat render statis: padanan pertama, tata letak sama.
export function PaduPadanStatis() {
  return <PaduPadanIsi kunciSp="" />;
}

function PaduPadanIsi({ kunciSp }) {
  const sp = useMemo(() => new URLSearchParams(kunciSp), [kunciSp]);
  const path = usePathname();
  const terpasang = useTerpasang();
  const invAsli = useInventaris();
  const inv = terpasang ? invAsli : undefined;
  const profilAsli = useProfil();
  const profil = terpasang ? profilAsli : null;
  const [s, setS] = useState(() => bacaUrl(sp));
  const [sosok, setSosok] = useState('manekin');
  const [ukuran, setUkuran] = useState({});
  const [pesan, setPesan] = useState(null);
  useEffect(() => {
    setS(bacaUrl(new URLSearchParams(kunciSp)));
  }, [kunciSp]);

  const ubah = (baru) => {
    setS(baru);
    setPesan(null);
    window.history.replaceState(null, '', `${path}${keUrl(baru)}`);
  };

  const terusan = s.atas && cariProduk(s.atas.slug).kategori === 'terusan';
  const daftar = useMemo(() => [s.atas, terusan ? null : s.bawahan, s.luaran, ...s.aksesori].filter(Boolean), [s, terusan]);

  // ukuran per barang: pilihan pengguna → saran Ukuranku → varian awal yang ada stoknya
  const ukuranUntuk = (v) => {
    const p = cariProduk(v.slug);
    if (satuUkuran(p)) return p.ukuran[0].id;
    const dipilih = ukuran[v.slug];
    if (dipilih && p.ukuran.some((u) => u.id === dipilih)) return dipilih;
    const r = rekomendasi(p, profil);
    if (r?.ukuran && stokVarian(p, v.kain, r.ukuran, inv) > 0) return r.ukuran;
    return varianAwal(p, inv, v.kain).ukuran;
  };

  const total = daftar.reduce((n, v) => n + hargaVarian(cariProduk(v.slug), v.kain, ukuranUntuk(v)), 0);
  const sosokPilih = SOSOK.find((x) => x.id === sosok);
  const lapis = daftar.map((v) => ({ jenis: cariProduk(v.slug).jenis, kain: v.kain }));

  const pilihProduk = (slot, slug) => {
    const p = cariProduk(slug);
    const kain = p.kain[0];
    if (slot.banyak) {
      const ada = s.aksesori.some((a) => a.slug === slug);
      ubah({ ...s, aksesori: ada ? s.aksesori.filter((a) => a.slug !== slug) : [...s.aksesori, { slug, kain }] });
      return;
    }
    if (!slot.wajib && s[slot.id]?.slug === slug) {
      ubah({ ...s, [slot.id]: null });
      return;
    }
    ubah({ ...s, [slot.id]: { slug, kain: s[slot.id]?.slug === slug ? s[slot.id].kain : kain } });
  };

  const pilihKain = (slot, slug, kain) => {
    if (slot.banyak) ubah({ ...s, aksesori: s.aksesori.map((a) => (a.slug === slug ? { ...a, kain } : a)) });
    else ubah({ ...s, [slot.id]: { slug, kain } });
  };

  const masukkan = () => {
    const hasil = tambahBanyak(daftar.map((v) => ({ slug: v.slug, kain: v.kain, ukuran: ukuranUntuk(v), qty: 1 })));
    const gagal = hasil.filter((h) => !h.hasil.ok);
    setPesan({
      ok: gagal.length < hasil.length,
      teks: gagal.length
        ? `${hasil.length - gagal.length} barang masuk keranjang. Tidak masuk karena stok habis: ${gagal.map((g) => `${cariProduk(g.slug).nama} ${g.ukuran}`).join(', ')}.`
        : `${hasil.length} barang masuk keranjang.`,
    });
  };

  return (
    <div className="wadah grid gap-8 pb-8 lg:grid-cols-12 lg:pb-20">
      <div className="contents lg:col-span-5 lg:block">
        <div className="contents lg:sticky lg:top-24 lg:block">
          <div className="order-1 relative overflow-hidden rounded-[6px] bg-nila-muda lg:order-none">
            <div aria-hidden="true" className="anyaman absolute inset-0" />
            <Busana
              mode={sosok === 'manekin' ? 'manekin' : 'sosok'}
              sosok={sosokPilih.sosok}
              lapis={lapis}
              viewBox="10 4 280 740"
              judul={`Pratinjau padanan: ${daftar.map((v) => `${cariProduk(v.slug).nama} ${cariKain(v.kain).nama}`).join(', ')}`}
              className="relative mx-auto block h-[20rem] w-auto py-3 sm:h-[30rem] lg:h-[34rem]"
            />
          </div>
          <fieldset className="order-1 -mt-5 lg:order-none lg:mt-3">
            <legend className="sr-only">Tampilkan di</legend>
            <div className="flex flex-wrap gap-1.5">
              {SOSOK.map((x) => (
                <label key={x.id} className="cursor-pointer rounded-[6px] border border-garis-tua px-3 py-2 text-[0.88rem] has-[:checked]:border-nila has-[:checked]:bg-nila has-[:checked]:text-white has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-nila-3">
                  <input type="radio" name="sosok" className="sr-only" checked={sosok === x.id} onChange={() => setSosok(x.id)} />
                  {x.nama}
                </label>
              ))}
            </div>
          </fieldset>

          <section id="ringkas-padanan" aria-labelledby="judul-ringkas" className="order-3 scroll-mt-24 rounded-[6px] border border-garis-tua bg-putih p-5 lg:order-none lg:mt-5">
            <h2 id="judul-ringkas" className="text-[1.35rem]">
              Padananmu
            </h2>
            <ul className="mt-3 grid gap-3">
              {daftar.map((v) => {
                const p = cariProduk(v.slug);
                const u = ukuranUntuk(v);
                const r = rekomendasi(p, profil);
                return (
                  <li key={v.slug} className="flex items-center gap-3">
                    <ContohKain kain={v.kain} className="h-10 w-10 shrink-0 rounded-[6px]" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[0.94rem] font-medium">{p.nama}</p>
                      <p className="text-[0.84rem] text-tinta-2">
                        {cariKain(v.kain).nama} · {rupiah(hargaVarian(p, v.kain, u))}
                        {r?.ukuran === u && <span className="font-medium text-nila"> · ukuran saran</span>}
                      </p>
                    </div>
                    {satuUkuran(p) ? (
                      <span className="text-[0.84rem] text-tinta-3">{p.ukuran[0].id}</span>
                    ) : (
                      <select className="isian min-h-10 w-auto py-1.5" aria-label={`Ukuran ${p.nama}`} value={u} onChange={(e) => setUkuran((x) => ({ ...x, [v.slug]: e.target.value }))}>
                        {p.ukuran.map((x) => (
                          <option key={x.id} value={x.id} disabled={stokVarian(p, v.kain, x.id, inv) <= 0}>
                            {x.id}
                            {stokVarian(p, v.kain, x.id, inv) <= 0 ? ' (habis)' : ''}
                          </option>
                        ))}
                      </select>
                    )}
                  </li>
                );
              })}
            </ul>
            <p className="mt-4 flex items-baseline justify-between border-t border-garis pt-3">
              <span className="text-tinta-2">Total {daftar.length} barang</span>
              <span className="text-[1.25rem] font-semibold tabular-nums">{rupiah(total)}</span>
            </p>
            <button type="button" className="tombol tombol-nila mt-4 w-full" onClick={masukkan} disabled={!daftar.length}>
              Masukkan semua ke keranjang
            </button>
            <div role="status" aria-live="polite">
              {pesan && (
                <p className={`mt-3 rounded-[6px] p-3 text-[0.92rem] ${pesan.ok ? 'bg-lumut-muda' : 'bg-secang-muda text-secang'}`}>
                  {pesan.teks}{' '}
                  {pesan.ok && (
                    <Link href="/keranjang" className="tautan font-semibold">
                      Lihat keranjang
                    </Link>
                  )}
                </p>
              )}
            </div>
            {!profil?.dada && !profil?.pinggul && (
              <p className="mt-3 text-[0.86rem] text-tinta-2">
                Ukuran dipilih otomatis dari stok.{' '}
                <Link href="/panduan-ukuran#ukuranku" className="tautan">
                  Simpan ukuranku
                </Link>{' '}
                supaya yang dipilih ukuran yang paling pas.
              </p>
            )}
          </section>
        </div>
      </div>

      <div className="order-2 grid content-start gap-9 lg:order-none lg:col-span-7">
        <section aria-labelledby="judul-awal">
          <h2 id="judul-awal" className="font-sans text-lg font-semibold tracking-normal">
            Mulai dari padanan pilihan
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {padanan.map((pd) => (
              <li key={pd.id}>
                <button type="button" className="min-h-11 rounded-[6px] border border-garis-tua bg-putih px-3.5 py-2 text-[0.9rem] hover:border-tinta" onClick={() => ubah(dariPadanan(pd))}>
                  {pd.nama}
                </button>
              </li>
            ))}
          </ul>
        </section>

        {SLOT.map((slot) => {
          const pilihanP = pilihanSlot(slot);
          const nonaktif = slot.id === 'bawahan' && terusan;
          return (
            <fieldset key={slot.id} disabled={nonaktif} className="min-w-0">
              <legend className="flex w-full flex-wrap items-baseline justify-between gap-2 border-t-2 border-tinta pt-4">
                <span className="font-display text-[1.35rem]">{slot.nama}</span>
                <span className="text-[0.86rem] text-tinta-3">
                  {nonaktif ? 'Terusan sudah mencakup bawahan' : slot.banyak ? 'Boleh lebih dari satu' : slot.wajib ? 'Pilih satu' : 'Boleh dikosongkan'}
                </span>
              </legend>
              <ul className={`mt-4 grid grid-cols-3 gap-2.5 sm:grid-cols-4 ${nonaktif ? 'opacity-50' : ''}`}>
                {pilihanP.map((p) => {
                  const v = slot.banyak ? s.aksesori.find((a) => a.slug === p.slug) : s[slot.id]?.slug === p.slug ? s[slot.id] : null;
                  const kainTampil = v?.kain || p.kain[0];
                  return (
                    <li key={p.slug}>
                      <label className={`block cursor-pointer rounded-[6px] border-2 p-1.5 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-nila-3 ${v ? 'border-nila bg-putih' : 'border-transparent hover:border-garis-tua'}`}>
                        <input
                          type={slot.banyak || !slot.wajib ? 'checkbox' : 'radio'}
                          name={`slot-${slot.id}`}
                          className="sr-only"
                          checked={Boolean(v)}
                          onChange={() => pilihProduk(slot, p.slug)}
                        />
                        <span className="block overflow-hidden rounded-[4px]" style={{ background: cariKain(kainTampil).muda }}>
                          <GambarProduk p={p} kain={kainTampil} jenis="kartu" judul="" className="block aspect-[4/5] w-full" />
                        </span>
                        <span className="mt-1.5 block text-[0.84rem] font-medium leading-tight">{p.nama}</span>
                        <span className="block text-[0.78rem] text-tinta-2">{rupiah(hargaVarian(p, kainTampil, p.ukuran[0].id))}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
              {(slot.banyak ? s.aksesori : s[slot.id] && !nonaktif ? [s[slot.id]] : []).map((v) => {
                const p = cariProduk(v.slug);
                if (!slot.kategori.includes(p.kategori)) return null;
                return (
                  <div key={v.slug} className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-[6px] bg-kapas px-3 py-2.5">
                    <span className="text-[0.9rem] font-medium">Kain {p.nama}:</span>
                    <span className="flex flex-wrap gap-1.5" role="radiogroup" aria-label={`Kain ${p.nama}`}>
                      {p.kain.map((k) => (
                        <label
                          key={k}
                          title={cariKain(k).nama}
                          className={`block h-9 w-9 cursor-pointer overflow-hidden rounded-full border-2 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-nila-3 ${v.kain === k ? 'border-tinta' : 'border-transparent'}`}
                        >
                          <input type="radio" name={`kain-${v.slug}`} className="sr-only" checked={v.kain === k} onChange={() => pilihKain(slot, v.slug, k)} aria-label={cariKain(k).nama} />
                          <ContohKain kain={k} className="h-full w-full" />
                        </label>
                      ))}
                    </span>
                    <span className="text-[0.86rem] text-tinta-2">{cariKain(v.kain).nama}</span>
                  </div>
                );
              })}
            </fieldset>
          );
        })}
      </div>

      {/* Bilah ringkas ponsel: pratinjau kecil + total, supaya tidak perlu menggulir ke atas */}
      <div className="sticky bottom-0 z-30 order-4 -mx-4 border-t border-garis-tua bg-putih/95 px-4 py-2.5 shadow-[0_-8px_20px_-12px_rgba(13,20,38,0.35)] sm:-mx-6 sm:px-6 lg:hidden">
        <div className="flex items-center gap-3">
          <span className="block h-14 w-10 shrink-0 overflow-hidden rounded-[4px] bg-nila-muda">
            <Busana mode={sosok === 'manekin' ? 'manekin' : 'sosok'} sosok={sosokPilih.sosok} lapis={lapis} viewBox="40 0 220 740" judul="" alas={false} className="h-full w-full" />
          </span>
          <p className="min-w-0 flex-1">
            <span className="block text-[0.82rem] text-tinta-2">{daftar.length} barang</span>
            <span className="block font-semibold tabular-nums">{rupiah(total)}</span>
          </p>
          <a href="#ringkas-padanan" className="tombol tombol-nila px-4">
            Lihat padanan
          </a>
        </div>
      </div>
    </div>
  );
}
