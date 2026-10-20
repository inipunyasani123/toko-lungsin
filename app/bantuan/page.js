import Link from 'next/link';
import { faq, site } from '@/lib/data';
import { meta, JsonLd } from '@/lib/seo';

export const metadata = meta({
  path: '/bantuan',
  judul: 'Bantuan: ukuran, tukar, kirim, dan bayar',
  deskripsi: 'Tanya jawab toko demo Lungsin: memilih ukuran, tukar ukuran 14 hari, ongkir dan potongannya, cara bayar, serta perawatan kain lurik.',
});

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.flatMap((g) => g.isi.map((x) => ({ '@type': 'Question', name: x.t, acceptedAnswer: { '@type': 'Answer', text: x.j } }))),
};

export default function HalamanBantuan() {
  return (
    <>
      <div className="wadah pb-10 pt-10 sm:pt-14">
        <p className="label label-lajur text-tinta-2">Bantuan</p>
        <h1 className="mt-3 max-w-3xl text-[2.3rem] sm:text-[3.1rem]">Tanya jawab</h1>
        <p className="mt-3 max-w-2xl text-tinta-2">
          Jawaban untuk hal yang paling sering ditanyakan. Belum ketemu? Tulis lewat{' '}
          <Link href="/kontak" className="tautan">
            halaman kontak
          </Link>
          .
        </p>
        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Lompat ke kelompok">
          {faq.map((g) => (
            <li key={g.id}>
              <a href={`#${g.id}`} className="inline-flex min-h-11 items-center rounded-[6px] border border-garis-tua bg-putih px-3.5 text-[0.92rem] hover:border-tinta">
                {g.grup}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="wadah grid gap-12 pb-20">
        {faq.map((g) => (
          <section key={g.id} id={g.id} aria-labelledby={`judul-${g.id}`} className="grid scroll-mt-24 gap-6 border-t-2 border-tinta pt-5 lg:grid-cols-12">
            <h2 id={`judul-${g.id}`} className="text-[1.5rem] sm:text-[1.9rem] lg:col-span-4">
              {g.grup}
            </h2>
            <div className="grid gap-2 lg:col-span-8">
              {g.isi.map((x) => (
                <details key={x.t} className="group rounded-[6px] border border-garis bg-putih open:border-garis-tua">
                  <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 font-semibold [&::-webkit-details-marker]:hidden">
                    {x.t}
                    <span aria-hidden="true" className="text-xl leading-none text-nila transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="px-4 pb-4 text-tinta-2">{x.j}</p>
                </details>
              ))}
              {g.id === 'ukuran' && (
                <p className="mt-2 text-[0.92rem] text-tinta-2">
                  Tukar ukuran diajukan dari halaman pesanan setelah paket diterima, paling lambat {site.hariTukar} hari.{' '}
                  <Link href="/lacak" className="tautan">
                    Buka pesananmu
                  </Link>
                </p>
              )}
            </div>
          </section>
        ))}
      </div>
      <JsonLd data={jsonLd} />
    </>
  );
}
