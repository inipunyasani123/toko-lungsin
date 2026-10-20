import Link from 'next/link';
import FormUkuranku from '@/components/FormUkuranku';
import DaftarSaran from '@/components/DaftarSaran';
import DiagramUkur from '@/components/DiagramUkur';
import { TabelUkuran } from '@/components/DetailProduk';
import { produk, potongan, caraUkur, site, kategori } from '@/lib/data';
import { satuUkuran } from '@/lib/katalog';
import { meta, JsonLd } from '@/lib/seo';

export const metadata = meta({
  path: '/panduan-ukuran',
  judul: 'Panduan ukuran dan cara mengukur badan',
  deskripsi: 'Cara mengukur dada, pinggang, pinggul, dan tinggi badan, kelonggaran tiap potongan, tabel ukuran semua model Lungsin dalam cm, dan saran ukuran untukmu.',
});

const howTo = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Cara mengukur badan untuk memilih ukuran baju',
  step: caraUkur.map((c, i) => ({ '@type': 'HowToStep', position: i + 1, name: c.nama, text: c.cara })),
};

export default function HalamanPanduan() {
  const berUkuran = produk.filter((p) => p.acuan && !satuUkuran(p));
  return (
    <>
      <div className="wadah pb-10 pt-10 sm:pt-14">
        <p className="label label-lajur text-tinta-2">Panduan ukuran</p>
        <h1 className="mt-3 max-w-3xl text-[2.3rem] sm:text-[3.1rem]">Ukur badanmu sekali saja</h1>
        <p className="mt-3 max-w-2xl text-tinta-2">
          Siapkan meteran jahit, berdiri tegak, dan ukur di atas kaus tipis. Simpan hasilnya di sini, dan setiap halaman produk akan menghitung ukuran yang paling pas
          untukmu.
        </p>
      </div>

      <section id="ukuranku" aria-labelledby="judul-ukuranku" className="scroll-mt-24 border-y border-garis bg-kapas py-14">
        <div className="wadah grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <DiagramUkur className="mx-auto block h-[26rem] w-auto lg:h-[34rem]" />
          </div>
          <div className="lg:col-span-8">
            <h2 id="judul-ukuranku" className="text-[1.9rem] sm:text-[2.4rem]">
              Ukuranku
            </h2>
            <ol className="mt-4 grid gap-2 text-[0.95rem] text-tinta-2 sm:grid-cols-2">
              {caraUkur.map((c, i) => (
                <li key={c.id} className="flex gap-3">
                  <span className="label flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-nila text-[0.8rem] text-white">{i + 1}</span>
                  <span>
                    <span className="font-semibold text-tinta">{c.nama}.</span> {c.cara}
                  </span>
                </li>
              ))}
            </ol>
            <div className="mt-6 rounded-[6px] bg-putih p-5 sm:p-6">
              <FormUkuranku cara={false} />
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="judul-saran" className="py-14">
        <div className="wadah">
          <h2 id="judul-saran" className="text-[1.9rem] sm:text-[2.4rem]">
            Saran ukuran di semua model
          </h2>
          <p className="mt-2 max-w-2xl text-tinta-2">Dihitung dari ukuranmu yang tersimpan dan potongan tiap model. Ketuk nama model untuk membukanya dengan ukuran itu terpilih.</p>
          <div className="mt-6">
            <DaftarSaran />
          </div>
        </div>
      </section>

      <section aria-labelledby="judul-potongan" className="border-t border-garis bg-kapas py-14">
        <div className="wadah">
          <h2 id="judul-potongan" className="text-[1.9rem] sm:text-[2.4rem]">
            Empat potongan, empat kelonggaran
          </h2>
          <p className="mt-2 max-w-2xl text-tinta-2">
            Kelonggaran adalah selisih ukuran baju dengan ukuran badan. Makin besar selisihnya, makin longgar jatuhnya. Angka di bawah untuk lingkar dada.
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(potongan).map(([id, pt]) => {
              const [a, b] = pt.kelonggaran;
              return (
                <li key={id} className="rounded-[6px] bg-putih p-5">
                  <h3 className="text-[1.1rem]">{pt.nama}</h3>
                  <p className="label mt-1 text-[0.82rem] text-kunyit-tua">
                    +{a}–{b} cm
                  </p>
                  <div className="mt-3 h-3 rounded-[2px] bg-kunyit-muda" aria-hidden="true">
                    <div className="h-full rounded-[2px] bg-nila" style={{ marginLeft: `${(a / 40) * 100}%`, width: `${((b - a) / 40) * 100}%` }} />
                  </div>
                  <p className="mt-3 text-[0.92rem] text-tinta-2">{pt.ket}</p>
                  <p className="mt-2 text-[0.84rem] text-tinta-3">
                    {produk
                      .filter((p) => p.potongan === id && p.acuan)
                      .map((p) => p.nama)
                      .join(', ') || '–'}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section aria-labelledby="judul-tabel" className="py-14">
        <div className="wadah">
          <h2 id="judul-tabel" className="text-[1.9rem] sm:text-[2.4rem]">
            Tabel ukuran semua model
          </h2>
          <p className="mt-2 max-w-2xl text-tinta-2">Semua angka dalam sentimeter dan diukur dari baju yang terhampar. Pinggang karet ditulis dari tanpa ditarik sampai ditarik penuh.</p>
          <div className="mt-8 grid items-start gap-3 lg:grid-cols-2">
            {kategori
              .filter((k) => berUkuran.some((p) => p.kategori === k.id))
              .flatMap((k) => berUkuran.filter((p) => p.kategori === k.id))
              .map((p, i) => (
                <details key={p.slug} open={i === 0} className="group rounded-[6px] border border-garis bg-putih open:border-garis-tua">
                  <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
                    <span className="font-semibold">{p.nama}</span>
                    <span className="flex items-center gap-3 text-[0.86rem] text-tinta-3">
                      {potongan[p.potongan]?.nama}
                      <span aria-hidden="true" className="text-xl leading-none text-nila transition-transform group-open:rotate-45">
                        +
                      </span>
                    </span>
                  </summary>
                  <div className="px-3 pb-3">
                    <TabelUkuran p={p} />
                    <Link href={`/produk/${p.slug}`} className="tautan mt-3 inline-block text-[0.9rem]">
                      Buka {p.nama}
                    </Link>
                  </div>
                </details>
              ))}
          </div>
          <p className="mt-10 max-w-2xl rounded-[6px] border-2 border-dashed border-nila/40 bg-nila-muda/40 p-5 text-tinta-2">
            <span className="font-semibold text-tinta">Masih meleset?</span> Ajukan tukar ukuran sekali dalam {site.hariTukar} hari setelah paket diterima, dari halaman
            pesananmu.{' '}
            <Link href="/bantuan#ukuran" className="tautan">
              Baca syaratnya
            </Link>
          </p>
        </div>
      </section>
      <JsonLd data={howTo} />
    </>
  );
}
