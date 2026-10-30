import Link from 'next/link';
import Image from 'next/image';
import RakGantung from '@/components/RakGantung';
import CobaUkuran from '@/components/CobaUkuran';
import Busana, { KainDekat, ContohKain } from '@/components/Busana';
import { IkonMeteran } from '@/components/Ikon';
import { kain, padanan, produk, site, cariProduk, cariKain } from '@/lib/data';
import { produkDenganKain, hargaVarian } from '@/lib/katalog';
import { rupiah } from '@/lib/format';
import { JsonLd } from '@/lib/seo';

export const metadata = {
  alternates: { canonical: '/' },
};

const LATAR = { jendela: '#dfe5ef', pasar: '#f1e2c9', teras: '#e9dfd3', kereta: '#dfe3dc', kedai: '#efe0d6' };

function totalPadanan(pd) {
  return pd.lapis.reduce((n, l) => {
    const p = cariProduk(l.slug);
    return n + hargaVarian(p, l.kain, p.ukuran[Math.floor((p.ukuran.length - 1) / 2)].id);
  }, 0);
}

const PROSES = [
  {
    judul: 'Benang dicelup dulu',
    isi: 'Lurik ditenun dari benang yang sudah diwarnai, bukan kain putih yang dicelup belakangan. Karena itu garisnya tembus sampai sisi dalam.',
    foto: '/images/proses-benang.webp',
    alt: 'Gulungan benang dan pita bergaris di rak kayu',
    w: 960,
    h: 1200,
  },
  {
    judul: 'Lungsin dipasang satu per satu',
    isi: 'Benang memanjang (lungsin) dipasang berurutan sesuai pola lajur. Untuk kain bergaris rapat seperti Gerimis Nila, ada ribuan helai.',
    foto: '/images/proses-lungsin.webp',
    alt: 'Benang lungsin merah muda dan jingga terentang di alat tenun kayu',
    w: 960,
    h: 1200,
  },
  {
    judul: 'Ditenun di alat tenun bukan mesin',
    isi: 'Penenun menginjak pedal dan meluncurkan benang pakan bolak-balik. Sehari biasanya jadi beberapa meter kain, tergantung kerapatan.',
    foto: '/images/proses-tenun.webp',
    alt: 'Alat tenun kayu berpedal dengan kain bergaris hijau dan biru di atasnya',
    w: 990,
    h: 660,
  },
  {
    judul: 'Dicuci sekali, baru dipotong',
    isi: 'Setiap gulung kain kami cuci dan jemur sebelum polanya digambar, supaya baju tidak menyusut banyak di cucian pertamamu.',
    foto: '/images/proses-kain.webp',
    alt: 'Tumpukan kain tenun bergaris yang digulung',
    w: 590,
    h: 384,
  },
];

export default function Beranda() {
  const unggulan = kain[0];
  const lainnya = kain.slice(1);
  const pilihan = ['pasar-sabtu', 'senin-rapat', 'kedai-kopi'].map((id) => padanan.find((p) => p.id === id));
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Koleksi Lungsin',
    itemListElement: produk.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${site.url}/produk/${p.slug}`, name: p.nama })),
  };

  return (
    <>
      {/* Pembuka: rak gantung */}
      <section aria-labelledby="judul-utama" className="relative overflow-hidden border-b border-garis">
        <div aria-hidden="true" className="anyaman absolute inset-0" />
        <div className="wadah relative pb-10 pt-9 sm:pt-12 lg:pb-14 lg:pt-14">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
            <div className="lg:col-span-8">
              <p className="label label-lajur text-tinta-2">Lurik tenun · dijahit di Klaten</p>
              <h1 id="judul-utama" className="mt-4 text-[2.3rem] text-nila sm:text-[3.2rem] lg:text-[3.7rem]">
                Lurik yang betah dipakai tiap hari
              </h1>
            </div>
            <div className="lg:col-span-4 lg:pb-1.5">
              <p className="max-w-md text-[1.04rem] text-tinta-2">
                Kemeja, blus, tunik, kulot, dan luaran dari kain lurik tenunan ATBM. Ukurannya ditulis lengkap dalam sentimeter, dan bisa ditukar sekali dalam{' '}
                {site.hariTukar} hari.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/koleksi" className="tombol tombol-nila">
                  Lihat koleksi
                </Link>
                <Link href="/panduan-ukuran#ukuranku" className="tombol tombol-garis">
                  <IkonMeteran className="h-5 w-5" />
                  Cari ukuranku
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-9 lg:mt-11">
            <RakGantung />
          </div>
          <div className="mt-7 hidden flex-col gap-3 border-t border-garis pt-5 sm:flex lg:flex-row lg:items-center lg:gap-6">
            <p className="shrink-0 text-[0.92rem] font-semibold" id="judul-tujuh-kain">
              Tujuh kain musim ini
            </p>
            <ul className="flex flex-wrap gap-2" aria-labelledby="judul-tujuh-kain">
              {kain.map((k) => (
                <li key={k.id}>
                  <Link
                    href={`/koleksi?kain=${k.id}`}
                    className="group flex min-h-11 items-center gap-2 rounded-full border border-garis-tua bg-putih py-1 pe-3 ps-1 text-[0.85rem] hover:border-tinta"
                  >
                    <ContohKain kain={k.id} className="h-8 w-8 rounded-full" skala={0.9} />
                    {k.nama}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Buku contoh kain */}
      <section aria-labelledby="judul-kain" className="bg-kapas py-16 sm:py-20">
        <div className="wadah">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="label label-lajur text-tinta-2">Buku contoh kain</p>
              <h2 id="judul-kain" className="mt-3 text-[2rem] sm:text-[2.75rem]">
                Tujuh kain, semuanya lurik katun
              </h2>
            </div>
            <p className="text-tinta-2 lg:col-span-5">
              Lajur untuk garis memanjang, cacah untuk kotak-kotak, polos untuk tenun tanpa motif. Ketuk kain untuk melihat semua baju yang dijahit darinya.
            </p>
          </div>

          <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <li className="col-span-2 lg:row-span-2">
              <Link href={`/koleksi?kain=${unggulan.id}`} className="group relative flex h-full min-h-[22rem] flex-col justify-end overflow-hidden rounded-[6px] text-white">
                <KainDekat kain={unggulan.id} className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-[1.04] motion-reduce:transform-none" />
                <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-nila-malam/90 via-nila-malam/40 to-transparent" />
                <span className="relative p-5 sm:p-7">
                  <span className="label text-kunyit">{unggulan.keluarga} · paling banyak dipakai</span>
                  <span className="mt-2 block font-display text-[2rem] leading-none sm:text-[2.6rem]">{unggulan.nama}</span>
                  <span className="mt-3 block max-w-md text-[0.98rem] text-[#e9ecf3]">{unggulan.catatan}</span>
                  <span className="mt-4 inline-block text-[0.92rem] font-semibold underline underline-offset-4">
                    {produkDenganKain(unggulan.id).length} model dengan kain ini
                  </span>
                </span>
              </Link>
            </li>
            {lainnya.map((k) => (
              <li key={k.id}>
                <Link href={`/koleksi?kain=${k.id}`} className="group flex h-full flex-col overflow-hidden rounded-[6px] bg-putih">
                  <span className="gerigi-bawah relative block aspect-[5/3] overflow-hidden">
                    <KainDekat kain={k.id} className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-[1.06] motion-reduce:transform-none" />
                  </span>
                  <span className="flex flex-1 flex-col p-3.5 sm:p-4">
                    <span className="label text-[0.75rem] text-tinta-3">{k.keluarga}</span>
                    <span className="mt-1 block font-semibold leading-snug group-hover:underline group-hover:underline-offset-4">{k.nama}</span>
                    <span className="mt-1 block text-[0.86rem] leading-snug text-tinta-2">{k.ringkas}</span>
                    <span className="mt-auto block pt-2 text-[0.82rem] text-tinta-3">{produkDenganKain(k.id).length} model</span>
                  </span>
                </Link>
              </li>
            ))}
            <li className="col-span-2 sm:col-span-1">
              <Link href="/produk/kain-lurik-meteran" className="gelap group flex h-full min-h-[9rem] sm:min-h-[12rem] flex-col justify-between rounded-[6px] bg-nila p-4 text-white sm:p-5">
                <span className="label text-kunyit">Kain potong</span>
                <span>
                  <span className="block font-display text-[1.35rem] leading-tight">Jahit sendiri</span>
                  <span className="mt-1.5 block text-[0.88rem] text-[#dfe4ee]">Ketujuh kain dijual per meter, lebar {site.lebarKain} cm.</span>
                  <span className="mt-3 block text-[0.88rem] font-semibold underline underline-offset-4">Mulai {rupiah(cariProduk('kain-lurik-meteran').harga)} per meter</span>
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* Ukuran tanpa menebak */}
      <section aria-labelledby="judul-ukuran" className="gelap relative overflow-hidden bg-nila py-16 text-white sm:py-20">
        <div aria-hidden="true" className="anyaman-terang absolute inset-0" />
        <div className="wadah relative grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <p className="label label-lajur text-[#d9deea]">Panduan pas badan</p>
            <h2 id="judul-ukuran" className="mt-3 text-[2rem] sm:text-[2.75rem]">
              Ukur sekali, cocokkan di semua baju
            </h2>
            <p className="mt-4 text-[#dfe4ee]">
              Ukuran S di kemeja longgar dan S di terusan pas badan tidak sama. Karena itu kami menulis ukuran setiap baju dalam sentimeter dan menghitung
              selisihnya dengan badanmu, alih-alih menebak dari huruf.
            </p>
            <ul className="mt-6 grid gap-3 text-[0.95rem] text-[#e9ecf3]">
              <li className="flex gap-3">
                <span aria-hidden="true" className="mt-2 h-2 w-4 shrink-0 rounded-[1px] bg-kunyit" />
                Simpan lingkar dada, pinggang, pinggul, dan tinggi di browser ini.
              </li>
              <li className="flex gap-3">
                <span aria-hidden="true" className="mt-2 h-2 w-4 shrink-0 rounded-[1px] bg-kunyit" />
                Setiap halaman produk menandai ukuran yang paling pas dan alasannya.
              </li>
              <li className="flex gap-3">
                <span aria-hidden="true" className="mt-2 h-2 w-4 shrink-0 rounded-[1px] bg-kunyit" />
                Masih meleset? Tukar ukuran sekali dalam {site.hariTukar} hari setelah paket diterima.
              </li>
            </ul>
          </div>
          <div className="lg:col-span-7">
            <CobaUkuran />
          </div>
        </div>
      </section>

      {/* Padanan pilihan */}
      <section aria-labelledby="judul-padanan" className="py-16 sm:py-20">
        <div className="wadah">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="label label-lajur text-tinta-2">Padu-padan</p>
              <h2 id="judul-padanan" className="mt-3 text-[2rem] sm:text-[2.75rem]">
                Dipakai ke mana saja
              </h2>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              <Link href="/lookbook" className="tautan font-medium">
                Lihat lookbook
              </Link>
              <Link href="/padu-padan" className="tautan font-medium">
                Susun padananmu sendiri
              </Link>
            </div>
          </div>
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {pilihan.map((pd, i) => (
              <li key={pd.id}>
                <article className="flex h-full flex-col overflow-hidden rounded-[6px] border border-garis bg-putih">
                  <div className="relative" style={{ background: LATAR[pd.latar] }}>
                    <div aria-hidden="true" className="anyaman absolute inset-0" />
                    <Busana
                      mode="sosok"
                      sosok={pd.sosok}
                      lapis={pd.lapis.map((l) => ({ jenis: cariProduk(l.slug).jenis, kain: l.kain }))}
                      viewBox="30 0 240 735"
                      judul={`Sosok ilustrasi memakai padanan ${pd.nama}`}
                      className="relative mx-auto block h-[17rem] w-auto py-3 sm:h-[22rem] md:h-[26rem]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-[1.15rem]">{pd.nama}</h3>
                    <p className="mt-1.5 text-[0.93rem] text-tinta-2">{pd.ket}</p>
                    <ul className="mt-4 hidden gap-1.5 border-t border-garis pt-3 text-[0.9rem] sm:grid">
                      {pd.lapis.map((l) => {
                        const p = cariProduk(l.slug);
                        return (
                          <li key={l.slug} className="flex items-center gap-2.5">
                            <ContohKain kain={l.kain} className="h-5 w-5 shrink-0 rounded-[3px]" />
                            <Link href={`/produk/${p.slug}?kain=${l.kain}`} className="min-w-0 flex-1 truncate hover:underline">
                              {p.nama} <span className="text-tinta-3">· {cariKain(l.kain).nama}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                    <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                      <p className="text-[0.9rem] text-tinta-2">
                        Sekitar <span className="font-semibold text-tinta">{rupiah(totalPadanan(pd))}</span>
                      </p>
                      <Link href={`/padu-padan?padanan=${pd.id}`} className="tautan text-[0.92rem] font-semibold">
                        Coba padanan ini<span className="sr-only">: {pd.nama}</span>
                      </Link>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Dari benang ke baju */}
      <section aria-labelledby="judul-proses" className="border-t border-garis bg-kapas py-16 sm:py-20">
        <div className="wadah">
          <div className="max-w-2xl">
            <p className="label label-lajur text-tinta-2">Dari benang ke baju</p>
            <h2 id="judul-proses" className="mt-3 text-[2rem] sm:text-[2.75rem]">
              Kenapa garis lurik tidak pernah pudar sebelah
            </h2>
          </div>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
            {PROSES.map((l, i) => (
              <li
                key={l.judul}
                className={`flex flex-col overflow-hidden rounded-[6px] bg-putih ${
                  i === 0 ? 'lg:col-span-3' : i === 1 ? 'lg:col-span-3' : i === 2 ? 'lg:col-span-6' : 'sm:col-span-2 lg:col-span-12 lg:flex-row'
                }`}
              >
                <div className={`relative overflow-hidden bg-blacu ${i === 3 ? 'aspect-[3/2] lg:aspect-auto lg:w-1/2' : i === 2 ? 'aspect-[3/2]' : 'aspect-[4/5]'}`}>
                  <Image src={l.foto} alt={l.alt} fill sizes={i === 2 ? '(min-width: 1024px) 48vw, (min-width: 640px) 50vw, 100vw' : '(min-width: 1024px) 24vw, (min-width: 640px) 50vw, 100vw'} className="object-cover" />
                </div>
                <div className={`p-5 ${i === 3 ? 'lg:flex lg:w-1/2 lg:flex-col lg:justify-center lg:p-10' : ''}`}>
                  <p className="label text-kunyit-tua">Langkah {i + 1}</p>
                  <h3 className="mt-1.5 text-[1.12rem]">{l.judul}</h3>
                  <p className="mt-2 text-[0.94rem] text-tinta-2">{l.isi}</p>
                  {i === 3 && (
                    <Link href="/tentang" className="tautan mt-4 inline-block font-medium">
                      Cerita bengkel kami
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Tukar ukuran & cucian pertama */}
      <section aria-labelledby="judul-janji" className="py-16 sm:py-20">
        <h2 id="judul-janji" className="sr-only">
          Tukar ukuran dan perawatan
        </h2>
        <div className="wadah grid gap-4 lg:grid-cols-2">
          <article className="relative rounded-[6px] border-2 border-dashed border-nila/40 bg-nila-muda/50 p-6 sm:p-8">
            <p className="label text-nila-3">Kebijakan tukar ukuran</p>
            <h3 className="mt-2 font-display text-[1.7rem] leading-tight text-nila sm:text-[2rem]">Meleset? Tukar sekali, {site.hariTukar} hari.</h3>
            <dl className="mt-5 grid gap-3 text-[0.95rem] sm:grid-cols-2">
              <div>
                <dt className="font-semibold">Batas waktu</dt>
                <dd className="text-tinta-2">{site.hariTukar} hari sejak paket diterima</dd>
              </div>
              <div>
                <dt className="font-semibold">Syarat</dt>
                <dd className="text-tinta-2">Belum dicuci, label masih terpasang</dd>
              </div>
              <div>
                <dt className="font-semibold">Ongkir kirim balik</dt>
                <dd className="text-tinta-2">Ditanggung pembeli</dd>
              </div>
              <div>
                <dt className="font-semibold">Ongkir ukuran baru</dt>
                <dd className="text-tinta-2">Kami tanggung</dd>
              </div>
            </dl>
            <Link href="/bantuan#ukuran" className="tautan mt-5 inline-block font-medium">
              Cara mengajukan tukar ukuran
            </Link>
          </article>
          <article className="rounded-[6px] border border-garis bg-putih p-6 sm:p-8">
            <p className="label text-kunyit-tua">Perawatan kain</p>
            <h3 className="mt-2 font-display text-[1.7rem] leading-tight sm:text-[2rem]">Tiga cucian pertama</h3>
            <ol className="mt-5 grid gap-3 text-[0.95rem]">
              {[
                'Cuci terpisah dengan air dingin. Sisa pewarna yang belum terikat bisa keluar sedikit.',
                'Jangan direndam lebih dari 15 menit, dan jangan pakai pemutih.',
                'Jemur terbalik di tempat teduh, lalu setrika dari sisi dalam dengan panas sedang.',
              ].map((t, i) => (
                <li key={t} className="flex gap-3">
                  <span className="label flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-kunyit text-[0.8rem] text-tinta">{i + 1}</span>
                  <span className="text-tinta-2">{t}</span>
                </li>
              ))}
            </ol>
            <Link href="/perawatan-kain" className="tautan mt-5 inline-block font-medium">
              Panduan perawatan per kain
            </Link>
          </article>
        </div>
      </section>
      <JsonLd data={jsonLd} />
    </>
  );
}
