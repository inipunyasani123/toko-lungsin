import Checkout from '@/components/Checkout';
import { meta } from '@/lib/seo';

export const metadata = meta({ path: '/checkout', judul: 'Checkout', deskripsi: 'Isi alamat, pilih kurir, dan buat pesanan di toko demo Lungsin. Ongkir dihitung otomatis dari contoh tarif.', indeks: false });

export default function HalamanCheckout() {
  return (
    <>
      <div className="wadah pb-8 pt-10 sm:pt-14">
        <h1 className="text-[2.4rem] sm:text-[3.2rem]">Checkout</h1>
        <p className="mt-3 max-w-2xl text-tinta-2">Tiga langkah singkat: alamat, pengiriman, lalu cara bayar.</p>
      </div>
      <Checkout />
    </>
  );
}
