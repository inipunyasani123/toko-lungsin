import { produk, site } from '@/lib/data';

export default function sitemap() {
  const statis = [
    ['', 1, 'weekly'],
    ['/koleksi', 0.9, 'weekly'],
    ['/padu-padan', 0.7, 'monthly'],
    ['/lookbook', 0.7, 'monthly'],
    ['/panduan-ukuran', 0.7, 'monthly'],
    ['/perawatan-kain', 0.5, 'monthly'],
    ['/bantuan', 0.6, 'monthly'],
    ['/tentang', 0.5, 'monthly'],
    ['/kontak', 0.4, 'yearly'],
    ['/lacak', 0.3, 'yearly'],
  ].map(([path, priority, changeFrequency]) => ({ url: `${site.url}${path}`, changeFrequency, priority }));
  return [...statis, ...produk.map((p) => ({ url: `${site.url}/produk/${p.slug}`, changeFrequency: 'weekly', priority: 0.8 }))];
}
