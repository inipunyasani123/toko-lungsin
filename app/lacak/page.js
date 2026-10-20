import Lacak from '@/components/Lacak';
import { meta } from '@/lib/seo';

export const metadata = meta({ path: '/lacak', judul: 'Lacak pesanan', deskripsi: 'Lacak pesanan dan pengajuan tukar ukuran di toko demo Lungsin dengan kode pesanan dan 4 angka terakhir nomor HP penerima.' });

export default function HalamanLacak() {
  return (
    <>
      <div className="wadah pb-8 pt-10 sm:pt-14">
        <h1 className="text-[2.4rem] sm:text-[3.2rem]">Lacak pesanan</h1>
        <p className="mt-3 max-w-2xl text-tinta-2">
          Masukkan kode pesanan dan 4 angka terakhir nomor HP penerima. Keduanya harus cocok supaya status pesanan tidak bisa dilihat orang lain.
        </p>
      </div>
      <Lacak />
    </>
  );
}
