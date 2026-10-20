import Link from 'next/link';
import Busana from './Busana';
import { cariProduk, cariKain } from '@/lib/data';
import { hargaVarian } from '@/lib/katalog';
import { rupiah } from '@/lib/format';

// Rak gantung di beranda: garmen tergantung di satu palang, panjangnya mengikuti panjang baju sebenarnya.
const RAK = [
  { slug: 'blus-shanghai', kain: 'lajur-senja' },
  { slug: 'kemeja-teras', kain: 'gerimis-nila' },
  { slug: 'outer-sore', kain: 'pematang-soga' },
  { slug: 'terusan-pasar', kain: 'kotak-bata', lebar: true },
  { slug: 'kulot-lebar', kain: 'polos-arang', lebar: true },
];

export default function RakGantung() {
  return (
    <div className="relative">
      {/* palang dan tiang rak */}
      <div aria-hidden="true" className="absolute inset-x-0 top-[0.35rem] z-10 h-2.5 rounded-full bg-gradient-to-b from-[#6b7080] to-[#3b3f4a] shadow-[0_2px_0_rgba(13,20,38,0.15)]" />
      <div aria-hidden="true" className="absolute -bottom-2 left-0 top-0 w-2.5 rounded-full bg-gradient-to-r from-[#5a5f6e] to-[#3b3f4a]" />
      <div aria-hidden="true" className="absolute -bottom-2 right-0 top-0 w-2.5 rounded-full bg-gradient-to-r from-[#5a5f6e] to-[#3b3f4a]" />
      <ul className="relative grid grid-cols-3 gap-1 px-4 sm:grid-cols-5 sm:px-6">
        {RAK.map((r) => {
          const p = cariProduk(r.slug);
          const k = cariKain(r.kain);
          const bawahan = p.kategori === 'bawahan';
          // kotak pandang seragam: kait selalu menempel di palang
          const vb = bawahan ? '35 183 230 590' : '35 56 230 590';
          return (
            <li key={r.slug} className={`rak-item mx-auto w-full max-w-[12.5rem] ${r.lebar ? 'hidden sm:block' : ''}`}>
              <Link href={`/produk/${p.slug}?kain=${r.kain}`} className="rak-item group block rounded-[6px] pb-2 focus-visible:outline-offset-[-2px]">
                <Busana mode="gantung" lapis={[{ jenis: p.jenis, kain: r.kain }]} viewBox={vb} judul="" className="gantung block aspect-[230/590] w-full" />
                <span className="mt-1 block px-1 text-center">
                  <span className="block text-[0.82rem] font-semibold leading-tight sm:text-[0.88rem]">{p.nama}</span>
                  <span className="block text-[0.76rem] text-tinta-2 sm:text-[0.8rem]">{k.nama}</span>
                  <span className="block text-[0.76rem] font-medium tabular-nums sm:text-[0.8rem]">{rupiah(hargaVarian(p, r.kain, p.ukuran[0].id))}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
