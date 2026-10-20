import Link from 'next/link';

export const metadata = {
  title: 'Halaman tidak ditemukan',
  robots: { index: false, follow: true },
  alternates: { canonical: null },
};

// Benang lungsin yang putus di tengah: satu helai terlepas dari deretan yang rapi.
function BenangPutus() {
  const warna = ['#1d3157', '#e3a62a', '#1d3157', '#a2322a', '#1d3157', '#eadfc9', '#1d3157', '#e3a62a', '#1d3157', '#6f4326', '#1d3157'];
  let s = '<rect x="0" y="0" width="320" height="320" rx="8" fill="#eeeae0"/>';
  warna.forEach((c, i) => {
    const x = 40 + i * 24;
    if (i === 5) {
      s += `<path d="M ${x} 30 L ${x} 128 C ${x} 150 ${x + 18} 152 ${x + 22} 168" fill="none" stroke="${c === '#eadfc9' ? '#cdbf9f' : c}" stroke-width="9" stroke-linecap="round"/>`;
      s += `<path d="M ${x - 6} 214 C ${x - 14} 232 ${x} 246 ${x} 262 L ${x} 292" fill="none" stroke="#cdbf9f" stroke-width="9" stroke-linecap="round"/>`;
    } else s += `<rect x="${x - 4.5}" y="30" width="9" height="262" rx="4.5" fill="${c}"/>`;
  });
  for (let j = 0; j < 9; j++) {
    const y = 50 + j * 26;
    if (j >= 4 && j <= 6) continue;
    s += `<rect x="28" y="${y}" width="264" height="7" rx="3.5" fill="#e3a62a" fill-opacity=".55"/>`;
  }
  return <svg viewBox="0 0 320 320" className="h-auto w-full" aria-hidden="true" focusable="false" dangerouslySetInnerHTML={{ __html: s }} />;
}

export default function TidakDitemukan() {
  return (
    <div className="wadah grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-12">
      <div className="mx-auto w-full max-w-sm lg:col-span-5">
        <BenangPutus />
      </div>
      <div className="lg:col-span-6 lg:col-start-7">
        <p className="label text-tinta-3">404 · benangnya putus</p>
        <h1 className="mt-3 text-[2.4rem] sm:text-[3.2rem]">Halaman ini lepas dari tenunannya</h1>
        <p className="mt-4 max-w-lg text-tinta-2">Alamat yang kamu buka tidak ada atau sudah pindah. Satu helai lungsin yang putus pun membuat kain berlubang, dan halaman ini salah satunya.</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/koleksi" className="tombol tombol-nila">
            Lihat koleksi
          </Link>
          <Link href="/" className="tombol tombol-garis">
            Ke beranda
          </Link>
          <Link href="/lacak" className="tautan self-center font-medium">
            Lacak pesanan
          </Link>
        </div>
      </div>
    </div>
  );
}
