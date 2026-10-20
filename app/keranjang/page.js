import Keranjang from '@/components/Keranjang';
import { meta } from '@/lib/seo';

export const metadata = meta({ path: '/keranjang', judul: 'Keranjang', deskripsi: 'Isi keranjang belanja di toko demo Lungsin. Ganti ukuran langsung di sini; keranjang tersimpan di browser kamu.', indeks: false });

export default function HalamanKeranjang() {
  return (
    <>
      <div className="wadah pb-8 pt-10 sm:pt-14">
        <h1 className="text-[2.4rem] sm:text-[3.2rem]">Keranjang</h1>
        <p className="mt-3 max-w-2xl text-tinta-2">Ukuran bisa diganti langsung di sini. Stok dicek lagi saat pesanan dibuat.</p>
      </div>
      <Keranjang />
    </>
  );
}
