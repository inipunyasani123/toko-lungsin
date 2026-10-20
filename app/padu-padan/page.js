import { Suspense } from 'react';
import PaduPadan, { PaduPadanStatis } from '@/components/PaduPadan';
import { meta } from '@/lib/seo';

export const metadata = meta({
  path: '/padu-padan',
  judul: 'Padu-padan baju lurik',
  deskripsi: 'Susun padanan atasan, bawahan, luaran, dan aksesori lurik di manekin, lihat totalnya, lalu masukkan semua ke keranjang dengan ukuran yang pas.',
});

export default function HalamanPaduPadan() {
  return (
    <>
      <div className="wadah pb-8 pt-10 sm:pt-14">
        <p className="label label-lajur text-tinta-2">Padu-padan</p>
        <h1 className="mt-3 text-[2.4rem] sm:text-[3.2rem]">Susun padananmu</h1>
        <p className="mt-3 max-w-2xl text-tinta-2">
          Pilih atasan, bawahan, luaran, dan aksesori, ganti kainnya, lalu lihat hasilnya di manekin. Tautan halaman ini ikut berubah, jadi padananmu bisa dibagikan.
        </p>
      </div>
      <Suspense fallback={<PaduPadanStatis />}>
        <PaduPadan />
      </Suspense>
    </>
  );
}
