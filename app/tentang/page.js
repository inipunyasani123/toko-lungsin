import Link from 'next/link';
import Image from 'next/image';
import { KainDekat } from '@/components/Busana';
import { site, kain, produk } from '@/lib/data';
import { meta } from '@/lib/seo';

export const metadata = meta({
  path: '/tentang',
  judul: 'Tentang kami: bengkel jahit lurik',
  deskripsi: 'Lungsin menjahit pakaian harian dari kain lurik tenun di Klaten: kain dicuci sebelum dipotong, ukuran ditulis lengkap, sisa potongan jadi tas dan syal.',
});

const PEGANG = [
  ['Ukuran ditulis lengkap', 'Setiap model punya tabel ukuran dalam sentimeter, diukur dari baju jadi, bukan perkiraan dari huruf S sampai XXL.'],
  ['Kain dicuci sebelum dipotong', 'Setiap gulung kain kami cuci dan jemur sekali sebelum polanya digambar, supaya baju tidak menyusut banyak di rumahmu.'],
  ['Tukar ukuran sekali, 14 hari', 'Kalau ukurannya meleset, ukuran pengganti langsung kami sisihkan dan ongkir kirimnya kami tanggung.'],
  ['Sisa potongan tidak dibuang', 'Potongan kain sisa pola baju dijahit jadi tas jinjing, syal, dan bungkus kado.'],
];

export default function HalamanTentang() {
  return (
    <>
      <div className="wadah grid gap-10 pb-14 pt-10 sm:pt-14 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <p className="label label-lajur text-tinta-2">Tentang kami</p>
          <h1 className="mt-3 text-[2.3rem] sm:text-[3.1rem]">Bengkel jahit kecil untuk kain yang sudah tua umurnya</h1>
          <p className="mt-5 max-w-2xl text-[1.04rem] text-tinta-2">
            Lurik sudah lama dipakai untuk baju kerja di Jawa: ditenun dari benang berwarna, kuat, dan makin lembut setelah sering dicuci. Lungsin menjahitnya jadi
            kemeja, blus, tunik, kulot, dan luaran dengan potongan yang enak dipakai hari ini.
          </p>
          <p className="mt-4 max-w-2xl text-tinta-2">
            Namanya diambil dari benang lungsin, benang memanjang yang dipasang paling awal di alat tenun dan menahan seluruh kain. Tanpa lungsin yang rapi, garis lurik
            tidak akan lurus.
          </p>
        </div>
        <div className="relative aspect-[3/2] overflow-hidden rounded-[6px] lg:col-span-5">
          <Image src="/images/proses-tenun.webp" alt="Alat tenun kayu berpedal dengan kain bergaris di atasnya" fill priority sizes="(min-width: 1024px) 38vw, 100vw" className="object-cover" />
        </div>
      </div>

      <section aria-labelledby="judul-angka" className="border-y border-garis bg-kapas py-14">
        <div className="wadah grid gap-8 lg:grid-cols-12">
          <h2 id="judul-angka" className="text-[1.8rem] sm:text-[2.3rem] lg:col-span-4">
            Isi rak kami sekarang
          </h2>
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:col-span-8">
            {[
              [produk.length, 'model baju dan aksesori'],
              [kain.length, 'kain lurik yang dipakai'],
              [`${site.lebarKain} cm`, 'lebar kain dari alat tenun'],
              [`${site.hariTukar} hari`, 'masa tukar ukuran'],
            ].map(([a, b]) => (
              <div key={b} className="rounded-[6px] bg-putih p-4">
                <dt className="text-[0.88rem] text-tinta-2">{b}</dt>
                <dd className="mt-1 font-display text-[1.8rem] leading-none text-nila">{a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="judul-pegang" className="py-16">
        <div className="wadah">
          <h2 id="judul-pegang" className="text-[1.9rem] sm:text-[2.4rem]">
            Yang kami pegang
          </h2>
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {PEGANG.map(([j, t], i) => (
              <li key={j} className="flex gap-4 rounded-[6px] border border-garis bg-putih p-5">
                <KainDekat kain={kain[i * 2 % kain.length].id} className="h-16 w-16 shrink-0 rounded-[4px]" />
                <div>
                  <h3 className="text-[1.1rem]">{j}</h3>
                  <p className="mt-1 text-[0.95rem] text-tinta-2">{t}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="judul-bengkel" className="gelap bg-nila py-16 text-white">
        <div className="wadah grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <h2 id="judul-bengkel" className="text-[1.9rem] sm:text-[2.4rem]">
              Bengkel di {site.kota}
            </h2>
            <p className="mt-4 max-w-xl text-[#dfe4ee]">
              Pesanan dikemas di bengkel yang sama tempat baju dijahit. Bengkel tidak dibuka untuk kunjungan; semua pertanyaan dijawab lewat halaman kontak pada jam layanan.
            </p>
            <p className="mt-4 max-w-xl border-s-2 border-kunyit ps-3 text-[0.95rem] text-[#ece8de]">
              {site.nama} adalah toko fiktif untuk demo. Alamat, jam, dan isi toko ini rekaan, dan foto proses di situs ini foto domain publik, bukan foto bengkel
              sungguhan.
            </p>
          </div>
          <div className="lg:col-span-5">
            <Link href="/kontak" className="tombol tombol-kunyit">
              Hubungi kami
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
