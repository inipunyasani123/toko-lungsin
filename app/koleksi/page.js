import { Suspense } from 'react';
import Katalog, { KatalogStatis } from '@/components/Katalog';
import { produk, kain } from '@/lib/data';
import { meta } from '@/lib/seo';

const deskripsi = `Semua ${produk.length} model Lungsin: kemeja, blus, tunik, luaran, terusan, kulot, rok, aksesori, dan kain per meter. Saring per kain, ukuran, dan harga.`;

export const metadata = meta({ path: '/koleksi', judul: 'Koleksi baju lurik', deskripsi });

export default function HalamanKoleksi() {
  return (
    <>
      <div className="wadah pb-8 pt-10 sm:pt-14">
        <p className="label label-lajur text-tinta-2">Koleksi</p>
        <h1 className="mt-3 text-[2.4rem] sm:text-[3.2rem]">Semua baju di rak</h1>
        <p className="mt-3 max-w-2xl text-tinta-2">
          {produk.length} model dalam {kain.length} kain lurik. Stok dihitung per kain dan ukuran, jadi saringan &ldquo;ada di ukuran&rdquo; hanya menampilkan yang
          masih bisa dipesan.
        </p>
      </div>
      <Suspense fallback={<KatalogStatis />}>
        <Katalog />
      </Suspense>
    </>
  );
}
