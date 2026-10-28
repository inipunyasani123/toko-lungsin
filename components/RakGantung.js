import Link from 'next/link';
import Image from 'next/image';
import { cariProduk, cariKain } from '@/lib/data';
import { cariFoto } from '@/lib/foto';
import { hargaVarian } from '@/lib/katalog';
import { rupiah } from '@/lib/format';

// Baris pilihan di beranda: foto produk (CC0/PD, lihat public/images/SUMBER.md) dengan nama, kain, dan harga.
const RAK = [
  { slug: 'blus-shanghai', kain: 'lajur-senja' },
  { slug: 'kemeja-teras', kain: 'gerimis-nila' },
  { slug: 'outer-sore', kain: 'pematang-soga' },
  { slug: 'terusan-pasar', kain: 'kotak-bata', lebar: true },
  { slug: 'kulot-lebar', kain: 'polos-arang', lebar: true },
];

export default function RakGantung() {
  return (
    <ul className="relative grid grid-cols-3 gap-3 sm:grid-cols-5 sm:gap-4">
      {RAK.map((r) => {
        const p = cariProduk(r.slug);
        const k = cariKain(r.kain);
        const foto = cariFoto(p.slug);
        return (
          <li key={r.slug} className={r.lebar ? 'hidden sm:block' : ''}>
            <Link href={`/produk/${p.slug}?kain=${r.kain}`} className="group block rounded-[6px] pb-2">
              <span className="relative block aspect-[4/5] w-full overflow-hidden rounded-[6px] bg-kapas">
                <Image src={foto.src} alt={foto.alt} fill sizes="(min-width: 1024px) 20vw, (min-width: 640px) 20vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transform-none" />
              </span>
              <span className="mt-2 block px-0.5">
                <span className="block text-[0.82rem] font-semibold leading-tight sm:text-[0.88rem]">{p.nama}</span>
                <span className="block text-[0.76rem] text-tinta-2 sm:text-[0.8rem]">{k.nama}</span>
                <span className="block text-[0.76rem] font-medium tabular-nums sm:text-[0.8rem]">{rupiah(hargaVarian(p, r.kain, p.ukuran[0].id))}</span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
