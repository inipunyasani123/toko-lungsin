import './font-lebar.css';
import './globals.css';
import localFont from 'next/font/local';
import { Instrument_Sans } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Benih from '@/components/Benih';
import { KainDefs } from '@/components/Busana';
import { site } from '@/lib/data';
import { OG, JsonLd } from '@/lib/seo';

// Anybody (OFL) dalam dua instans statis dari Google Fonts: lebar 125% tebal 700 untuk judul (ditanam di font-lebar.css),
// rapat 75% untuk label.
const rapat = localFont({ src: './fonts/anybody-75-600.woff2', weight: '600', variable: '--font-rapat', display: 'optional', adjustFontFallback: 'Arial' });
const instrument = Instrument_Sans({ subsets: ['latin'], variable: '--font-instrument', display: 'optional' });

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ClothingStore',
      '@id': `${site.url}/#toko`,
      name: site.nama,
      url: site.url,
      description: site.deskripsi,
      image: `${site.url}/og.jpg`,
      logo: `${site.url}/icon.svg`,
      email: site.email,
      priceRange: 'Rp68.000–Rp389.000',
      currenciesAccepted: 'IDR',
      paymentAccepted: 'Transfer bank, QRIS, dompet digital',
      address: { '@type': 'PostalAddress', addressLocality: 'Klaten', addressRegion: 'Jawa Tengah', addressCountry: 'ID' },
      openingHoursSpecification: [
        { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:30', closes: '16:30' },
        { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '09:00', closes: '13:00' },
      ],
    },
    { '@type': 'WebSite', '@id': `${site.url}/#situs`, name: site.nama, url: site.url, inLanguage: 'id-ID', publisher: { '@id': `${site.url}/#toko` } },
  ],
};

export const metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.judul, template: `%s · ${site.nama}` },
  description: site.deskripsi,
  applicationName: site.nama,
  keywords: ['baju lurik', 'kemeja lurik', 'kulot lurik', 'kain lurik per meter', 'busana lurik modern', 'demo toko online'],
  authors: [{ name: 'PintuWeb', url: 'https://www.pintuweb.id' }],
  creator: 'PintuWeb',
  publisher: 'PintuWeb',
  alternates: { canonical: '/' },
  openGraph: { type: 'website', locale: 'id_ID', url: site.url, siteName: site.nama, title: site.judul, description: site.deskripsi, images: [OG] },
  twitter: { card: 'summary_large_image', title: site.judul, description: site.deskripsi, images: [OG.url] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
};

export const viewport = {
  themeColor: '#f7f5ef',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${rapat.variable} ${instrument.variable}`}>
      <body className="antialiased">
        <a href="#isi" className="sr-only-fokus fixed left-3 top-3 z-50 rounded-[6px] bg-nila px-4 py-2 text-white">
          Langsung ke isi
        </a>
        <KainDefs />
        <Header />
        <Benih />
        <main id="isi">{children}</main>
        <Footer />
        <JsonLd data={jsonLd} />
        <aside aria-label="Tentang situs demo ini" style={{ display: 'block', margin: 0, padding: '12px 16px', background: '#0f1b33', color: '#dfe6f3', font: '400 13px/1.5 system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', textAlign: 'center' }}>
          Situs demo buatan PintuWeb — nama dan isinya rekaan.{' '}
          <a href="https://www.pintuweb.id/kontak?demo=lungsin" style={{ color: '#ffffff', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '3px' }}>Buat yang seperti ini →</a>
        </aside>
      </body>
    </html>
  );
}
