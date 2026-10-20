import Link from 'next/link';
import { Adegan, ContohKain } from '@/components/Busana';
import { padanan, cariProduk, cariKain } from '@/lib/data';
import { hargaVarian } from '@/lib/katalog';
import { rupiah } from '@/lib/format';
import { meta } from '@/lib/seo';

export const metadata = meta({
  path: '/lookbook',
  judul: 'Lookbook: lurik untuk sehari-hari',
  deskripsi: 'Lima padanan lurik untuk rapat pagi, pasar Sabtu, kondangan sore, naik kereta, dan kerja dari kedai kopi. Lihat isinya lalu coba di padu-padan.',
});

function hargaTengah(p, kain) {
  return hargaVarian(p, kain, p.ukuran[Math.floor((p.ukuran.length - 1) / 2)].id);
}

export default function HalamanLookbook() {
  return (
    <>
      <div className="wadah pb-10 pt-10 sm:pt-14">
        <p className="label label-lajur text-tinta-2">Lookbook</p>
        <h1 className="mt-3 max-w-3xl text-[2.4rem] sm:text-[3.2rem]">Lima hari, lima padanan</h1>
        <p className="mt-3 max-w-2xl text-tinta-2">
          Gambar ilustrasi, bukan foto model: setiap baju di sini digambar dari pola dan kain yang sama dengan yang kamu pesan, jadi warnanya bisa kamu cocokkan di halaman
          produk.
        </p>
      </div>
      <ol className="wadah grid gap-16 pb-20 sm:gap-20">
        {padanan.map((pd, i) => {
          const total = pd.lapis.reduce((n, l) => n + hargaTengah(cariProduk(l.slug), l.kain), 0);
          const lapis = pd.lapis.map((l) => ({ jenis: cariProduk(l.slug).jenis, kain: l.kain }));
          return (
            <li key={pd.id} id={pd.id} className="grid scroll-mt-24 items-center gap-8 lg:grid-cols-12 lg:gap-12">
              <div className={`lg:col-span-7 ${i % 2 ? 'lg:order-2' : ''}`}>
                <Adegan
                  latar={pd.latar}
                  sosok={pd.sosok}
                  lapis={lapis}
                  judul={`Ilustrasi ${pd.nama}: ${pd.lapis.map((l) => `${cariProduk(l.slug).nama} ${cariKain(l.kain).nama}`).join(', ')}`}
                  className="block aspect-[600/760] w-full rounded-[6px]"
                />
              </div>
              <div className={`lg:col-span-5 ${i % 2 ? 'lg:order-1' : ''}`}>
                <p className="label text-kunyit-tua">Padanan {String(i + 1).padStart(2, '0')}</p>
                <h2 className="mt-2 text-[1.9rem] sm:text-[2.4rem]">{pd.nama}</h2>
                <p className="mt-3 text-tinta-2">{pd.ket}</p>
                <ul className="mt-6 grid gap-3 border-t border-garis pt-4">
                  {pd.lapis.map((l) => {
                    const p = cariProduk(l.slug);
                    return (
                      <li key={l.slug} className="flex items-center gap-3">
                        <ContohKain kain={l.kain} className="h-11 w-11 shrink-0 rounded-[6px]" />
                        <div className="min-w-0 flex-1">
                          <Link href={`/produk/${p.slug}?kain=${l.kain}`} className="font-medium hover:underline">
                            {p.nama}
                          </Link>
                          <p className="text-[0.88rem] text-tinta-2">Kain {cariKain(l.kain).nama}</p>
                        </div>
                        <p className="text-[0.92rem] tabular-nums">{rupiah(hargaTengah(p, l.kain))}</p>
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-4 flex items-baseline justify-between border-t border-garis pt-3">
                  <span className="text-tinta-2">Total padanan</span>
                  <span className="text-[1.2rem] font-semibold tabular-nums">{rupiah(total)}</span>
                </p>
                <Link href={`/padu-padan?padanan=${pd.id}`} className="tombol tombol-nila mt-5">
                  Coba di padu-padan<span className="sr-only">: {pd.nama}</span>
                </Link>
              </div>
            </li>
          );
        })}
      </ol>
    </>
  );
}
