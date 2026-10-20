import Link from 'next/link';
import FormKontak from '@/components/FormKontak';
import { site } from '@/lib/data';
import { meta } from '@/lib/seo';

export const metadata = meta({
  path: '/kontak',
  judul: 'Kontak dan jam layanan',
  deskripsi: 'Tanya soal ukuran, tukar ukuran, pesanan, atau kain potong di toko demo Lungsin. Jam layanan Senin–Sabtu, alamat dan kontaknya fiktif.',
});

export default function HalamanKontak() {
  return (
    <>
      <div className="wadah pb-10 pt-10 sm:pt-14">
        <p className="label label-lajur text-tinta-2">Kontak</p>
        <h1 className="mt-3 max-w-3xl text-[2.3rem] sm:text-[3.1rem]">Tanya dulu, baru pesan</h1>
        <p className="mt-3 max-w-2xl text-tinta-2">
          Paling sering kami bantu soal ukuran. Sebutkan ukuran badanmu dan model yang kamu incar, nanti kami jawab ukuran yang paling pas.
        </p>
      </div>
      <div className="wadah grid gap-10 pb-20 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="rounded-[6px] border border-garis-tua bg-putih p-5 sm:p-7">
            <h2 className="text-[1.5rem]">Tulis pesan</h2>
            <div className="mt-5">
              <FormKontak />
            </div>
          </div>
        </div>
        <aside className="grid content-start gap-4 lg:col-span-5">
          <section aria-labelledby="judul-jam" className="rounded-[6px] bg-kapas p-5">
            <h2 id="judul-jam" className="font-sans text-lg font-semibold tracking-normal">
              Jam layanan
            </h2>
            <dl className="mt-3 grid gap-2 text-[0.95rem]">
              {site.jamLayanan.map(([h, j]) => (
                <div key={h} className="flex justify-between gap-4">
                  <dt className="text-tinta-2">{h}</dt>
                  <dd className="font-medium">{j}</dd>
                </div>
              ))}
            </dl>
          </section>
          <section aria-labelledby="judul-alamat" className="rounded-[6px] bg-kapas p-5">
            <h2 id="judul-alamat" className="font-sans text-lg font-semibold tracking-normal">
              Bengkel dan email
            </h2>
            <p className="mt-2 text-[0.95rem]">{site.alamat}</p>
            <p className="mt-1 text-[0.95rem]">
              <a href={`mailto:${site.email}`} className="tautan">
                {site.email}
              </a>
            </p>
            <p className="mt-3 text-[0.88rem] text-tinta-2">Alamat dan email ini fiktif (domain .example memang tidak bisa menerima surat). Bengkel tidak dibuka untuk kunjungan.</p>
          </section>
          <section aria-labelledby="judul-cepat" className="rounded-[6px] border border-garis p-5">
            <h2 id="judul-cepat" className="font-sans text-lg font-semibold tracking-normal">
              Mungkin sudah terjawab
            </h2>
            <ul className="mt-3 grid gap-2 text-[0.95rem]">
              <li>
                <Link href="/panduan-ukuran" className="tautan">
                  Cara mengukur badan dan tabel ukuran
                </Link>
              </li>
              <li>
                <Link href="/bantuan#ukuran" className="tautan">
                  Syarat tukar ukuran
                </Link>
              </li>
              <li>
                <Link href="/lacak" className="tautan">
                  Lacak pesanan
                </Link>
              </li>
              <li>
                <Link href="/perawatan-kain" className="tautan">
                  Cara merawat lurik
                </Link>
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </>
  );
}
