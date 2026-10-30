import Link from 'next/link';
import Logo from './Logo';
import { site } from '@/lib/data';

const KOLOM = [
  {
    judul: 'Belanja',
    tautan: [
      ['/koleksi', 'Semua koleksi'],
      ['/padu-padan', 'Padu-padan'],
      ['/lookbook', 'Lookbook'],
      ['/koleksi?kategori=kain', 'Kain potong'],
      ['/keranjang', 'Keranjang'],
    ],
  },
  {
    judul: 'Bantuan',
    tautan: [
      ['/panduan-ukuran', 'Panduan ukuran'],
      ['/perawatan-kain', 'Perawatan kain'],
      ['/bantuan#ukuran', 'Tukar ukuran'],
      ['/bantuan#pengiriman', 'Pengiriman'],
      ['/lacak', 'Lacak pesanan'],
    ],
  },
  {
    judul: 'Lungsin',
    tautan: [
      ['/tentang', 'Tentang kami'],
      ['/kontak', 'Kontak'],
      ['/admin', 'Dasbor demo penjual'],
    ],
  },
];

export default function Footer() {
  return (
    <footer data-situs className="gelap relative bg-nila-malam text-[#e6e2d8]">
      {/* pita lurik di tepi atas */}
      <div
        aria-hidden="true"
        className="h-3"
        style={{
          background:
            'repeating-linear-gradient(90deg,#b4532f 0 10px,#eadfc9 10px 12px,#e0a42b 12px 18px,#eadfc9 18px 20px,#233a63 20px 30px,#6f4326 30px 33px)',
        }}
      />
      <div className="anyaman-terang">
        <div className="wadah grid grid-cols-2 gap-x-6 gap-y-10 py-14 md:grid-cols-12">
          <div className="col-span-2 md:col-span-4">
            <Link href="/" className="inline-flex rounded-sm text-white" aria-label="Lungsin, ke beranda">
              <Logo terang ukuran="besar" />
            </Link>
            <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-[#cfd3dd]">
              Pakaian harian dari kain lurik tenun. Kainnya dicuci sekali sebelum dipotong, dijahit di bengkel kecil di {site.kota}, dan setiap ukuran ditulis lengkap
              dalam sentimeter.
            </p>
            <p className="mt-5 max-w-sm border-s-2 border-kunyit ps-3 text-[0.9rem] text-[#ece8de]">{site.nama} adalah toko fiktif untuk demo.</p>
          </div>

          {KOLOM.map((k) => (
            <nav key={k.judul} aria-label={k.judul} className="md:col-span-2">
              <h2 className="label text-kunyit">{k.judul}</h2>
              <ul className="mt-4 grid gap-1 text-[0.95rem]">
                {k.tautan.map(([href, label]) => (
                  <li key={href}>
                    <Link className="inline-block py-1 hover:underline hover:underline-offset-4" href={href}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="md:col-span-2">
            <h2 className="label text-kunyit">Jam layanan</h2>
            <dl className="mt-4 grid gap-2.5 text-[0.92rem]">
              {site.jamLayanan.map(([h, j]) => (
                <div key={h}>
                  <dt className="text-[#b9bfcc]">{h}</dt>
                  <dd>{j}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <div className="wadah flex flex-wrap items-center justify-between gap-3 border-t border-white/15 py-5 text-[0.84rem] text-[#c3c8d3]">
          <p>Produk, harga, stok, alamat, dan pesanan di situs ini contoh.</p>
          <p className="label text-[0.75rem] text-[#c3c8d3]">Dijahit di {site.kota} · lebar kain {site.lebarKain} cm</p>
        </div>
      </div>
    </footer>
  );
}
