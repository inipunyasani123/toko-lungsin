'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Busana, { GambarProduk, GambarDetail, KainDekat, KainLipat, ContohKain } from './Busana';
import PitaUkur from './PitaUkur';
import JatuhUjung from './JatuhUjung';
import FormUkuranku from './FormUkuranku';
import { IkonMeteran } from './Ikon';
import { cariProduk, cariKain, potongan, labelUkur, site } from '@/lib/data';
import { hargaVarian, stokVarian, varianAwal, stokKain, produkAktif, satuUkuran, cariUkuran } from '@/lib/katalog';
import { rekomendasi, jatuhUjung } from '@/lib/ukuran';
import { rupiah, gram } from '@/lib/format';
import { useInventaris, useKeranjang, useTerpasang, useProfil, tambahKeKeranjang } from '@/lib/store';

const KOLOM_UKUR = ['dada', 'pinggang', 'pinggul', 'paha', 'bahu', 'panjang', 'lengan'];

export function TabelUkuran({ p, pilih, saran }) {
  const kolom = KOLOM_UKUR.filter((k) => p.ukuran.some((u) => u[k] !== undefined));
  if (!kolom.length) return null;
  return (
    <div className="overflow-x-auto rounded-[6px] border border-garis" tabIndex={0} role="region" aria-label={`Tabel ukuran ${p.nama} dalam sentimeter`}>
      <table className="w-full min-w-[26rem] border-collapse text-left text-[0.9rem]">
        <caption className="sr-only">Ukuran {p.nama} dalam sentimeter, diukur dari baju</caption>
        <thead className="bg-kapas">
          <tr>
            <th scope="col" className="px-3 py-2.5 font-semibold">Ukuran</th>
            {kolom.map((k) => (
              <th key={k} scope="col" className="px-3 py-2.5 text-end font-semibold">
                {labelUkur[k]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {p.ukuran.map((u) => (
            <tr key={u.id} className={`border-t border-garis ${u.id === pilih ? 'bg-nila-muda/60' : ''}`}>
              <th scope="row" className="whitespace-nowrap px-3 py-2.5 font-semibold">
                {u.id}
                {u.id === saran && <span className="label ms-2 rounded-[3px] bg-kunyit px-1.5 py-0.5 text-[0.62rem] text-tinta">Saran</span>}
              </th>
              {kolom.map((k) => (
                <td key={k} className="whitespace-nowrap px-3 py-2.5 text-end tabular-nums">
                  {u[k] === undefined ? '–' : Array.isArray(u[k]) ? `${u[k][0]}–${u[k][1]}` : u[k]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function DetailProduk({ slug }) {
  const p = cariProduk(slug);
  const terpasang = useTerpasang();
  const invAsli = useInventaris();
  const inv = terpasang ? invAsli : undefined;
  const keranjang = useKeranjang();
  const profilAsli = useProfil();
  const profil = terpasang ? profilAsli : null;
  const awal = varianAwal(p);
  const [k, setK] = useState(awal.kain);
  const [u, setU] = useState(awal.ukuran);
  const [qty, setQty] = useState(1);
  const [gambar, setGambar] = useState(0);
  const [pesan, setPesan] = useState(null);
  const [lengket, setLengket] = useState(false);
  const [bukaForm, setBukaForm] = useState(false);
  const tombolRef = useRef(null);
  const sudahAtur = useRef(false);
  const satu = satuUkuran(p);
  const saran = rekomendasi(p, profil);

  // Setelah terpasang: pakai kain dari URL (?kain=), ukuran saran (bila ada stok), dan stok sebenarnya di browser.
  useEffect(() => {
    if (!terpasang || sudahAtur.current) return;
    sudahAtur.current = true;
    const sp = new URLSearchParams(window.location.search);
    const dariUrl = sp.get('kain');
    const v = varianAwal(p, invAsli, dariUrl && p.kain.includes(dariUrl) ? dariUrl : undefined);
    let uBaru = v.ukuran;
    const s = rekomendasi(p, profilAsli);
    if (s?.ukuran && stokVarian(p, v.kain, s.ukuran, invAsli) > 0) uBaru = s.ukuran;
    const dariUrlU = sp.get('ukuran');
    if (dariUrlU && p.ukuran.some((x) => x.id === dariUrlU) && stokVarian(p, v.kain, dariUrlU, invAsli) > 0) uBaru = dariUrlU;
    setK(v.kain);
    setU(uBaru);
  }, [terpasang, invAsli, profilAsli, p]);

  useEffect(() => {
    const el = tombolRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setLengket(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const aktif = produkAktif(p, inv);
  const kn = cariKain(k);
  const ukuran = cariUkuran(p, u);
  const harga = hargaVarian(p, k, u);
  const tambahan = ((p.tambahanKain || {})[k] || 0) * (ukuran.meter || 1);
  const stok = stokVarian(p, k, u, inv);
  const diKeranjang = terpasang ? keranjang.filter((it) => it.slug === p.slug && it.kain === k && it.ukuran === u).reduce((n, it) => n + it.qty, 0) : 0;
  const bisaTambah = Math.max(0, stok - diKeranjang);
  const qtyAman = Math.min(Math.max(1, qty), Math.max(1, bisaTambah));
  const jatuh = profil?.tinggi ? jatuhUjung(p, u, profil.tinggi) : null;
  const pot = p.potongan ? potongan[p.potongan] : null;
  const padan = (p.padanan || []).map(cariProduk).filter(Boolean)[0];
  const kainPadan = padan ? padan.kain.find((x) => x !== k) || padan.kain[0] : null;

  const pilihKain = (id) => {
    setK(id);
    setQty(1);
    setPesan(null);
    if (stokVarian(p, id, u, inv) <= 0) {
      const lain = p.ukuran.find((x) => stokVarian(p, id, x.id, inv) > 0);
      if (lain) setU(lain.id);
    }
  };

  const tambah = () => {
    if (!aktif || bisaTambah <= 0) return;
    const r = tambahKeKeranjang({ slug: p.slug, kain: k, ukuran: u, qty: qtyAman });
    if (r.ok) {
      setPesan({ ok: true, teks: `${r.ditambahkan} × ${p.nama} (${kn.nama}, ${u}) masuk keranjang.` });
      setQty(1);
    } else setPesan({ ok: false, teks: 'Stok pilihan ini sudah habis atau semuanya sudah ada di keranjangmu.' });
  };

  const galeri =
    p.jenis === 'kain'
      ? [
          { jenis: 'lipat', label: `${kn.nama}, terlipat` },
          { jenis: 'dekat', label: `Tenunan ${kn.nama} dari dekat` },
        ]
      : [
          { jenis: 'utama', label: `Di manekin, kain ${kn.nama}` },
          { jenis: 'gantung', label: 'Tergantung' },
          { jenis: 'detail', label: 'Detail jahitan' },
          { jenis: 'dekat', label: `Tenunan ${kn.nama} dari dekat` },
          ...(padan ? [{ jenis: 'padu', label: `Dipadukan dengan ${padan.nama}` }] : []),
        ];
  const tampil = galeri[Math.min(gambar, galeri.length - 1)];

  const gambarBesar = (it, kecil = false) => {
    const kelas = 'absolute inset-0 h-full w-full';
    if (it.jenis === 'lipat') return <KainLipat kain={k} judul={kecil ? '' : `${p.nama} ${kn.nama}, terlipat dengan gulungan kain`} className={kelas} />;
    if (it.jenis === 'dekat') return <KainDekat kain={k} judul={kecil ? '' : `Tenunan kain ${kn.nama} dari dekat`} className={kelas} />;
    if (it.jenis === 'gantung') return <GambarProduk p={p} kain={k} jenis="kartu" judul={kecil ? '' : undefined} className={kelas} />;
    if (it.jenis === 'detail') return <GambarDetail p={p} kain={k} judul={kecil ? '' : `Detail ${p.nama} ${kn.nama}`} className={kelas} />;
    if (it.jenis === 'padu')
      return (
        <Busana
          mode="manekin"
          lapis={[
            { jenis: p.jenis, kain: k },
            { jenis: padan.jenis, kain: kainPadan },
          ]}
          viewBox="0 6 300 750"
          judul={kecil ? '' : `${p.nama} ${kn.nama} dipadukan dengan ${padan.nama} ${cariKain(kainPadan).nama}`}
          className={kelas}
        />
      );
    return <GambarProduk p={p} kain={k} jenis="utama" judul={kecil ? '' : undefined} className={kelas} />;
  };

  const statusStok = stok <= 0 ? 'Habis untuk pilihan ini' : stok <= 2 ? `Tinggal ${stok}` : `Stok ${stok}`;

  return (
    <div className="relative">
      <div className="wadah grid gap-x-12 gap-y-8 lg:grid-cols-12">
        {/* Galeri */}
        <div className="lg:col-span-7">
          <div className="lg:sticky lg:top-24">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[6px] sm:aspect-[5/5] lg:aspect-[4/5]" style={{ background: kn.muda }}>
              <div aria-hidden="true" className="anyaman absolute inset-0" />
              <div key={`${tampil.jenis}-${k}`} className="absolute inset-0 animate-[muncul_0.4s_ease-out] motion-reduce:animate-none">
                {gambarBesar(tampil)}
              </div>
              <p className="label absolute left-3 top-3 rounded-[4px] bg-putih/90 px-2 py-1 text-[0.66rem] text-tinta-2">{tampil.label}</p>
            </div>
            <ul className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Gambar produk">
              {galeri.map((it, i) => (
                <li key={it.jenis} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setGambar(i)}
                    aria-label={it.label}
                    aria-pressed={i === gambar}
                    className={`relative block h-[4.6rem] w-[4.6rem] overflow-hidden rounded-[6px] border-2 sm:h-24 sm:w-24 ${i === gambar ? 'border-nila' : 'border-transparent hover:border-garis-tua'}`}
                    style={{ background: kn.muda }}
                  >
                    {gambarBesar(it, true)}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Info beli */}
        <div className="lg:col-span-5">
          <p className="label text-tinta-3">
            {pot ? `${pot.nama} · ` : ''}
            {p.lengan ? `lengan ${p.lengan} · ` : ''}lurik tenun ATBM
          </p>
          <h1 className="mt-2 text-[2.2rem] sm:text-[2.7rem]">{p.nama}</h1>
          <p className="mt-3 text-[1.04rem] text-tinta-2">{p.ringkas}</p>

          <div className="mt-6 flex flex-wrap items-end gap-x-4 gap-y-1 border-y border-garis py-4">
            <p className="text-[1.9rem] font-semibold leading-none tracking-tight tabular-nums">{rupiah(harga)}</p>
            <p className="pb-0.5 text-[0.9rem] text-tinta-2">
              {kn.nama}, {u}
              {tambahan > 0 && ` · termasuk tambahan kain ${rupiah(tambahan)}`}
            </p>
          </div>

          {!aktif && (
            <p className="mt-5 rounded-[6px] border border-secang bg-secang-muda p-3 text-secang" role="status">
              Produk ini sedang tidak dijual. Penjual menonaktifkannya dari dasbor demo.
            </p>
          )}

          <fieldset className="mt-6">
            <legend className="font-semibold">
              Kain: <span className="font-normal text-tinta-2">{kn.nama}</span>
            </legend>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {p.kain.map((id) => {
                const x = cariKain(id);
                const habis = stokKain(p, id, inv) <= 0;
                return (
                  <label
                    key={id}
                    className={`relative flex w-[4.9rem] flex-col items-center rounded-[6px] border-2 p-1.5 pb-2 text-center has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-nila-3 ${
                      k === id ? 'border-nila bg-putih' : 'border-transparent hover:border-garis-tua'
                    } ${habis ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                  >
                    <input type="radio" name={`kain-${p.slug}`} value={id} checked={k === id} disabled={habis} onChange={() => pilihKain(id)} className="sr-only" />
                    <span className="gerigi block h-12 w-full overflow-hidden">
                      <ContohKain kain={id} className="h-full w-full" skala={1.3} />
                    </span>
                    <span className="mt-1.5 text-[0.76rem] leading-tight">{x.nama}</span>
                    {habis && <span className="label mt-0.5 text-[0.6rem] text-secang">Habis</span>}
                  </label>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="mt-6">
            <legend className="flex w-full flex-wrap items-baseline justify-between gap-2">
              <span className="font-semibold">{satu ? 'Ukuran' : `Ukuran: ${u}`}</span>
              {!satu && p.acuan && (
                <a href="#tabel-ukuran" className="tautan text-[0.9rem]">
                  Tabel ukuran
                </a>
              )}
            </legend>
            <div className={`mt-3 grid gap-2 ${satu ? '' : 'grid-cols-3 sm:grid-cols-5'}`}>
              {p.ukuran.map((x) => {
                const s = stokVarian(p, k, x.id, inv);
                const habis = s <= 0;
                const disarankan = saran?.ukuran === x.id;
                return (
                  <label
                    key={x.id}
                    className={`relative flex min-h-[3.6rem] flex-col items-center justify-center rounded-[6px] border-2 px-1 py-1.5 text-center has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-nila-3 ${
                      u === x.id ? 'border-nila bg-nila text-white' : 'border-garis-tua bg-putih hover:border-tinta'
                    } ${habis ? 'cursor-not-allowed border-dashed bg-kapas text-tinta-3' : 'cursor-pointer'}`}
                  >
                    <input type="radio" name={`ukuran-${p.slug}`} value={x.id} checked={u === x.id} disabled={habis} onChange={() => { setU(x.id); setQty(1); setPesan(null); }} className="sr-only" />
                    <span className={`font-semibold ${habis ? 'line-through' : ''}`}>{x.id}</span>
                    <span className={`label text-[0.6rem] ${u === x.id ? 'text-[#dfe4ee]' : habis ? 'text-secang' : s <= 2 ? 'text-secang' : 'text-tinta-3'}`}>
                      {habis ? 'Habis' : s <= 2 ? `Tinggal ${s}` : `Stok ${s}`}
                    </span>
                    {x.meter && <span className="text-[0.72rem]">{rupiah(hargaVarian(p, k, x.id))}</span>}
                    {disarankan && (
                      <span className="label absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-[3px] bg-kunyit px-1.5 py-0.5 text-[0.58rem] text-tinta">
                        Pas untukmu
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </fieldset>

          {p.acuan && (
            <div className="mt-4 rounded-[6px] bg-kapas p-4">
              {saran ? (
                <>
                  <p className="flex items-start gap-2.5 text-[0.94rem]">
                    <IkonMeteran className="mt-0.5 h-5 w-5 shrink-0 text-nila" />
                    <span>
                      <span className="font-semibold">
                        {saran.ukuran ? `Saran untukmu: ${saran.ukuran}.` : 'Belum ada ukuran yang pas.'}
                      </span>{' '}
                      {saran.alasan}
                    </span>
                  </p>
                  <button type="button" className="tautan mt-2 text-[0.88rem]" aria-expanded={bukaForm} onClick={() => setBukaForm((v) => !v)}>
                    {bukaForm ? 'Tutup' : 'Ubah ukuranku'}
                  </button>
                </>
              ) : (
                <>
                  <p className="flex items-start gap-2.5 text-[0.94rem]">
                    <IkonMeteran className="mt-0.5 h-5 w-5 shrink-0 text-nila" />
                    <span>
                      Isi ukuran badanmu sekali, lalu kami tandai ukuran yang paling pas untuk potongan {pot?.nama.toLowerCase() || 'ini'}.
                    </span>
                  </p>
                  <button type="button" className="tombol tombol-garis mt-3 min-h-10 py-1.5 text-[0.92rem]" aria-expanded={bukaForm} onClick={() => setBukaForm((v) => !v)}>
                    {bukaForm ? 'Tutup' : 'Isi ukuranku'}
                  </button>
                </>
              )}
              {bukaForm && (
                <div className="mt-4 border-t border-garis pt-4">
                  <FormUkuranku ringkas onSimpan={() => setBukaForm(false)} />
                </div>
              )}
            </div>
          )}

          <div className="mt-6">
            <p className={`text-[0.95rem] font-medium ${stok <= 2 ? 'text-secang' : 'text-lumut'}`}>
              {statusStok}
              {diKeranjang > 0 && <span className="font-normal text-tinta-2"> · {diKeranjang} sudah di keranjangmu</span>}
            </p>
            <div className="mt-3 flex flex-wrap items-stretch gap-3">
              <div className="flex items-stretch rounded-[6px] border-[1.5px] border-garis-tua bg-putih" role="group" aria-label="Jumlah">
                <button type="button" className="w-11 text-xl disabled:text-tinta-3" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qtyAman <= 1 || bisaTambah <= 0} aria-label="Kurangi jumlah">
                  −
                </button>
                <label htmlFor={`qty-${p.slug}`} className="sr-only">
                  Jumlah
                </label>
                <input
                  id={`qty-${p.slug}`}
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={Math.max(1, bisaTambah)}
                  value={qtyAman}
                  onChange={(e) => setQty(Number(e.target.value) || 1)}
                  disabled={bisaTambah <= 0 || !aktif}
                  className="w-12 bg-transparent text-center font-semibold [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <button type="button" className="w-11 text-xl disabled:text-tinta-3" onClick={() => setQty((q) => Math.min(bisaTambah, q + 1))} disabled={qtyAman >= bisaTambah} aria-label="Tambah jumlah">
                  +
                </button>
              </div>
              <button ref={tombolRef} type="button" className="tombol tombol-nila flex-1 px-6" onClick={tambah} disabled={!aktif || bisaTambah <= 0}>
                {!aktif ? 'Tidak dijual' : stok <= 0 ? 'Habis' : bisaTambah <= 0 ? 'Semua stok ada di keranjang' : 'Masukkan keranjang'}
              </button>
            </div>
            <div role="status" aria-live="polite" className="min-h-[1.5rem]">
              {pesan && (
                <p className={`mt-3 rounded-[6px] p-3 text-[0.95rem] ${pesan.ok ? 'bg-lumut-muda text-tinta' : 'bg-secang-muda text-secang'}`}>
                  {pesan.teks}{' '}
                  {pesan.ok && (
                    <Link href="/keranjang" className="tautan font-semibold">
                      Lihat keranjang
                    </Link>
                  )}
                </p>
              )}
            </div>
            {!satu && (
              <p className="mt-1 text-[0.88rem] text-tinta-2">
                Ukurannya meleset? Tukar sekali dalam {site.hariTukar} hari setelah diterima.{' '}
                <Link href="/bantuan#ukuran" className="tautan">
                  Syaratnya
                </Link>
              </p>
            )}
          </div>

          <div className="mt-8 grid gap-7">
            {saran?.rinci?.length > 0 && (
              <section aria-labelledby="judul-peta">
                <h2 id="judul-peta" className="font-sans text-lg font-semibold tracking-normal">
                  Seberapa longgar di badanmu
                </h2>
                <p className="mt-1 text-[0.9rem] text-tinta-2">
                  Lingkar {saran.acuan} tiap ukuran dibandingkan dengan badanmu ({saran.badan} cm). Bidang hijau adalah kelonggaran yang kami sarankan untuk potongan ini.
                </p>
                <PitaUkur rinci={saran.rinci} badan={saran.badan} target={saran.target} pilih={saran.ukuran} nama={saran.acuan} className="mt-3 block w-full sm:hidden" W={430} />
      <PitaUkur rinci={saran.rinci} badan={saran.badan} target={saran.target} pilih={saran.ukuran} nama={saran.acuan} className="mt-3 hidden w-full sm:block" />
              </section>
            )}

            {jatuh && (
              <section aria-labelledby="judul-jatuh" className="grid grid-cols-[4.5rem_1fr] items-center gap-4">
                <JatuhUjung hasil={jatuh} className="h-44 w-full" />
                <div>
                  <h2 id="judul-jatuh" className="font-sans text-lg font-semibold tracking-normal">
                    Jatuhnya {jatuh.letak}
                  </h2>
                  <p className="mt-1 text-[0.9rem] text-tinta-2">
                    Perkiraan untuk tinggi {jatuh.tinggi} cm: panjang {u} ({jatuh.panjang} cm) diukur dari {jatuh.bawahan ? 'pinggang' : 'pangkal bahu'}, jadi ujungnya sekitar{' '}
                    {Math.max(0, jatuh.ujung)} cm dari lantai. Proporsi badan tiap orang berbeda, jadi anggap ini gambaran kasar.
                  </p>
                </div>
              </section>
            )}

            {!satu && p.acuan && (
              <section id="tabel-ukuran" aria-labelledby="judul-tabel" className="scroll-mt-24">
                <h2 id="judul-tabel" className="font-sans text-lg font-semibold tracking-normal">
                  Tabel ukuran (cm)
                </h2>
                <p className="mt-1 text-[0.9rem] text-tinta-2">
                  Diukur dari baju yang terhampar, bukan dari badan.
                  {ukuran.pinggang && Array.isArray(ukuran.pinggang) ? ' Pinggang karet ditulis dari tanpa ditarik sampai ditarik penuh.' : ''} {pot?.ket}
                </p>
                <div className="mt-3">
                  <TabelUkuran p={p} pilih={u} saran={saran?.ukuran} />
                </div>
              </section>
            )}

            <section aria-labelledby="judul-tentang">
              <h2 id="judul-tentang" className="font-sans text-lg font-semibold tracking-normal">
                Tentang {p.jenis === 'kain' ? 'kain ini' : 'baju ini'}
              </h2>
              <p className="mt-2 text-tinta-2">{p.deskripsi}</p>
              <ul className="mt-3 grid gap-1.5 text-tinta-2 sm:grid-cols-2">
                {p.detail.map((t) => (
                  <li key={t} className="flex gap-2.5">
                    <span aria-hidden="true" className="mt-[0.55rem] h-1.5 w-3 shrink-0 rounded-[1px] bg-kunyit" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="judul-kain">
              <h2 id="judul-kain" className="font-sans text-lg font-semibold tracking-normal">
                Kain {kn.nama}
              </h2>
              <p className="mt-2 text-tinta-2">{kn.catatan}</p>
              <p className="mt-2 text-tinta-2">
                <span className="font-medium text-tinta">Perawatan:</span> {kn.rawat}{' '}
                <Link href="/perawatan-kain" className="tautan">
                  Panduan lengkap
                </Link>
              </p>
            </section>

            <section aria-labelledby="judul-kirim">
              <h2 id="judul-kirim" className="font-sans text-lg font-semibold tracking-normal">
                Pengiriman
              </h2>
              <p className="mt-2 text-tinta-2">
                Dikirim dari Klaten. Dibayar sebelum {site.batasKemas} pada hari kerja, dikemas hari itu juga. Berat pilihan ini {gram(ukuran.berat)}; ongkir dihitung di
                checkout dari provinsi tujuan.{' '}
                <Link href="/bantuan#pengiriman" className="tautan">
                  Contoh tarif
                </Link>
              </p>
            </section>
          </div>
        </div>
      </div>

      {/* Bilah beli lengket untuk ponsel */}
      <div
        className={`sticky bottom-0 z-30 mt-10 border-t border-garis-tua bg-putih/95 py-3 shadow-[0_-8px_20px_-12px_rgba(13,20,38,0.35)] transition-opacity lg:hidden ${
          lengket ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!lengket}
      >
        <div className="wadah flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[0.85rem] text-tinta-2">
              {kn.nama} · {u}
            </p>
            <p className="font-semibold tabular-nums">{rupiah(harga)}</p>
          </div>
          <button type="button" className="tombol tombol-nila px-5" onClick={tambah} disabled={!aktif || bisaTambah <= 0} tabIndex={lengket ? 0 : -1}>
            {bisaTambah <= 0 ? 'Habis' : 'Masukkan keranjang'}
          </button>
        </div>
      </div>
    </div>
  );
}
