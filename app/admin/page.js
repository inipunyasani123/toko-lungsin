import Admin from '@/components/Admin';
import { meta } from '@/lib/seo';

export const metadata = {
  ...meta({ path: '/admin', judul: 'Dasbor demo penjual', deskripsi: 'Dasbor penjual toko demo Lungsin: pesanan, tukar ukuran, stok per kain dan ukuran, serta ringkasan penjualan. Data tersimpan di browser.' }),
  robots: { index: false, follow: false },
};

export default function HalamanAdmin() {
  return (
    <>
      <div className="wadah pb-8 pt-10 sm:pt-14">
        <p className="label label-lajur text-tinta-2">Untuk penjual · tanpa login karena ini demo</p>
        <h1 className="mt-3 max-w-4xl text-[2.1rem] leading-[1.08] sm:text-[2.9rem]">Dasbor demo, data di browser ini</h1>
        <p className="mt-3 max-w-2xl text-tinta-2">
          Ubah status pesanan dan tukar ukuran, atur stok tiap kain dan ukuran, dan lihat ukuran yang paling banyak dipesan. Semua perubahan langsung terlihat di toko pada
          browser yang sama, dan bisa dikembalikan ke data contoh kapan saja.
        </p>
      </div>
      <Admin />
    </>
  );
}
