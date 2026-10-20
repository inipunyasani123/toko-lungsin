import Link from 'next/link';
import { notFound } from 'next/navigation';
import DetailProduk from '@/components/DetailProduk';
import KartuProduk from '@/components/KartuProduk';
import { produk, cariProduk, cariKategori, cariKain, site } from '@/lib/data';
import { ogHalaman, JsonLd } from '@/lib/seo';
import { produkTerkait, hargaTermurah, hargaVarian, stokDasar, satuUkuran } from '@/lib/katalog';
import { rupiah } from '@/lib/format';

export const dynamicParams = false;

// Deskripsi meta dirakit dari kalimat utuh dan berhenti sebelum lewat 155 karakter.
function deskripsiProduk(p) {
  const BATAS = 155;
  const kain = p.kain.map((k) => cariKain(k).nama);
  const ukuran = satuUkuran(p) ? p.ukuran[0].id : `${p.ukuran[0].id}–${p.ukuran[p.ukuran.length - 1].id}`;
  const pilihan = [[`Mulai ${rupiah(hargaTermurah(p))}.`], [`Kain ${kain.join(', ')}.`, `${kain.length} pilihan kain.`], [`Ukuran ${ukuran}.`]];
  let teks = p.ringkas;
  for (const opsi of pilihan) {
    const muat = opsi.find((k) => `${teks} ${k}`.length <= BATAS);
    if (muat) teks = `${teks} ${muat}`;
  }
  return teks;
}

export function generateStaticParams() {
  return produk.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = cariProduk(slug);
  if (!p) return {};
  const deskripsi = deskripsiProduk(p);
  const judul = `${p.nama} lurik`.length <= 44 && !/lurik/i.test(p.nama) ? `${p.nama} lurik` : p.nama;
  return {
    title: judul,
    description: deskripsi,
    alternates: { canonical: `/produk/${p.slug}` },
    ...ogHalaman({ path: `/produk/${p.slug}`, judul, deskripsi }),
  };
}

function jsonLdProduk(p, kat) {
  const url = `${site.url}/produk/${p.slug}`;
  const varian = [];
  for (const k of p.kain) {
    for (const u of p.ukuran) {
      varian.push({
        '@type': 'Product',
        name: `${p.nama} ${cariKain(k).nama} ${u.id}`,
        sku: `LGS-${p.slug}-${k}-${u.id}`.toUpperCase().replace(/[^A-Z0-9-]/g, ''),
        color: cariKain(k).nama,
        ...(satuUkuran(p) ? {} : { size: u.id }),
        offers: {
          '@type': 'Offer',
          url: `${url}?kain=${k}`,
          priceCurrency: 'IDR',
          price: hargaVarian(p, k, u.id),
          availability: stokDasar(p, k, u.id) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          itemCondition: 'https://schema.org/NewCondition',
          seller: { '@id': `${site.url}/#toko` },
        },
      });
    }
  }
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProductGroup',
        name: p.nama,
        description: p.deskripsi,
        url,
        image: `${site.url}/og.jpg`,
        brand: { '@type': 'Brand', name: site.nama },
        category: kat.nama,
        material: 'Katun lurik tenun',
        productGroupID: p.slug,
        variesBy: satuUkuran(p) ? ['https://schema.org/color'] : ['https://schema.org/color', 'https://schema.org/size'],
        hasVariant: varian,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Koleksi', item: `${site.url}/koleksi` },
          { '@type': 'ListItem', position: 2, name: kat.nama, item: `${site.url}/koleksi?kategori=${kat.id}` },
          { '@type': 'ListItem', position: 3, name: p.nama, item: url },
        ],
      },
    ],
  };
}

export default async function HalamanProduk({ params }) {
  const { slug } = await params;
  const p = cariProduk(slug);
  if (!p) notFound();
  const kat = cariKategori(p.kategori);
  const terkait = produkTerkait(p, 4);
  return (
    <>
      <nav aria-label="Jejak halaman" className="wadah pb-5 pt-6 text-[0.9rem]">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-tinta-2">
          <li>
            <Link href="/koleksi" className="hover:underline">
              Koleksi
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={`/koleksi?kategori=${kat.id}`} className="hover:underline">
              {kat.nama}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-tinta">
            {p.nama}
          </li>
        </ol>
      </nav>
      <DetailProduk slug={p.slug} />
      {terkait.length > 0 && (
        <section aria-labelledby="judul-terkait" className="mt-6 border-t border-garis bg-kapas py-14">
          <div className="wadah">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 id="judul-terkait" className="text-[1.8rem] sm:text-[2.2rem]">
                Padukan dengan
              </h2>
              {p.padanan?.length > 0 && (
                <Link href={`/padu-padan?${p.kategori === 'bawahan' ? 'bawahan' : p.kategori === 'aksesori' ? 'aksesori' : p.kategori === 'luaran' ? 'luaran' : p.kategori === 'terusan' ? 'terusan' : 'atasan'}=${p.slug}`} className="tautan font-medium">
                  Coba di padu-padan
                </Link>
              )}
            </div>
            <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 lg:grid-cols-4">
              {terkait.map((t) => (
                <li key={t.slug}>
                  <KartuProduk produk={t} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
      <JsonLd data={jsonLdProduk(p, kat)} />
    </>
  );
}
