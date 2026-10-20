// Metadata Open Graph lengkap per halaman (Next.js mengganti objek openGraph induk, tidak menggabungkannya).
import { site } from './data';

export const OG = { url: '/og.jpg', width: 1200, height: 630, alt: 'Toko demo Lungsin: kemeja, blus, dan kulot lurik tergantung di rak' };

export function ogHalaman({ path = '', judul, deskripsi }) {
  const url = `${site.url}${path}`;
  const title = judul ? `${judul} · ${site.nama}` : site.judul;
  return {
    openGraph: { type: 'website', locale: 'id_ID', url, siteName: site.nama, title, description: deskripsi, images: [OG] },
    twitter: { card: 'summary_large_image', title, description: deskripsi, images: [OG.url] },
  };
}

// Metadata halaman biasa: judul, deskripsi, canonical, OG.
export function meta({ path, judul, deskripsi, indeks = true }) {
  return {
    title: judul,
    description: deskripsi,
    alternates: { canonical: path || '/' },
    ...ogHalaman({ path, judul, deskripsi }),
    ...(indeks ? {} : { robots: { index: false, follow: true } }),
  };
}

export function JsonLd({ data }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
