import Link from 'next/link';
import SimbolRawat from '@/components/SimbolRawat';
import { KainDekat } from '@/components/Busana';
import { kain } from '@/lib/data';
import { meta } from '@/lib/seo';

export const metadata = meta({
  path: '/perawatan-kain',
  judul: 'Cara merawat baju lurik',
  deskripsi: 'Cara mencuci, menjemur, menyetrika, dan menyimpan baju lurik supaya warnanya awet dan ukurannya tidak berubah, plus catatan perawatan tiap kain Lungsin.',
});

const SIMBOL = [
  ['cuci30', 'Cuci air dingin, paling panas 30 °C'],
  ['tanpaPemutih', 'Tanpa pemutih'],
  ['tanpaPengering', 'Jangan dikeringkan dengan mesin pengering'],
  ['jemurTeduh', 'Jemur tergantung di tempat teduh'],
  ['setrikaSedang', 'Setrika panas sedang, dari sisi dalam'],
];

const BAGIAN = [
  {
    id: 'pertama',
    judul: 'Tiga cucian pertama',
    isi: [
      'Cuci terpisah dari pakaian putih atau berwarna muda. Benang lurik dicelup sebelum ditenun, dan sisa pewarna yang belum terikat bisa keluar sedikit.',
      'Pakai air dingin dan deterjen cair yang lembut. Jangan merendam lebih dari 15 menit.',
      'Bilas sampai air bilasan bening, lalu langsung dijemur. Baju yang dibiarkan basah menumpuk bisa saling menularkan warna.',
    ],
  },
  {
    id: 'rutin',
    judul: 'Cucian sehari-hari',
    isi: [
      'Mesin cuci boleh, dengan putaran lembut dan baju dibalik supaya permukaannya tidak cepat berbulu.',
      'Kancingkan kemeja sebelum dicuci, dan masukkan kerudung serta syal ke kantong jaring.',
      'Hindari pemutih dan pewangi yang mengandung pemutih optik: warna nila dan soga bisa memudar tidak rata.',
    ],
  },
  {
    id: 'jemur',
    judul: 'Menjemur dan menyetrika',
    isi: [
      'Jemur terbalik di tempat teduh berangin. Matahari terik membuat warna gelap cepat kusam di bagian bahu.',
      'Kulot dan rok dijemur dengan dijepit di ban pinggang supaya lipitnya jatuh lurus.',
      'Setrika dengan panas sedang dari sisi dalam selagi masih sedikit lembap. Dari sisi luar, lurik gelap bisa jadi mengilap.',
    ],
  },
  {
    id: 'simpan',
    judul: 'Menyimpan',
    isi: [
      'Kemeja, blus, dan luaran boleh digantung di gantungan kayu yang lebar bahunya pas.',
      'Kulot, celana, kerudung, dan kain potong lebih baik dilipat supaya tidak melar di titik gantungnya.',
      'Simpan di lemari yang kering. Kantong kain lebih baik daripada plastik rapat, karena kain tetap bisa bernapas.',
    ],
  },
  {
    id: 'noda',
    judul: 'Kalau terkena noda',
    isi: [
      'Kopi dan teh: bilas dari sisi dalam dengan air dingin secepatnya, lalu cuci seperti biasa. Air panas justru mengunci noda.',
      'Minyak: taburi sedikit tepung jagung atau bedak, diamkan 15 menit, sikat pelan, lalu cuci dengan sabun cuci piring yang diencerkan.',
      'Noda yang tidak hilang setelah dua kali cuci sebaiknya dibawa ke penatu. Jangan digosok keras: benang lurik bisa berbulu.',
    ],
  },
];

export default function HalamanPerawatan() {
  return (
    <>
      <div className="wadah pb-10 pt-10 sm:pt-14">
        <p className="label label-lajur text-tinta-2">Perawatan kain</p>
        <h1 className="mt-3 max-w-3xl text-[2.3rem] sm:text-[3.1rem]">Supaya garisnya tetap tegas</h1>
        <p className="mt-3 max-w-2xl text-tinta-2">
          Lurik kami katun 100% yang ditenun dari benang berwarna. Kainnya sudah dicuci sekali sebelum dipotong, jadi yang perlu dijaga tinggal dua hal: warna dan
          ukuran.
        </p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-5" aria-label="Simbol perawatan untuk semua baju Lungsin">
          {SIMBOL.map(([n, t]) => (
            <li key={n} className="flex items-center gap-3 rounded-[6px] bg-putih p-3 sm:flex-col sm:items-start">
              <SimbolRawat nama={n} className="h-10 w-10 shrink-0 text-nila" />
              <span className="text-[0.9rem] leading-snug">{t}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="wadah grid gap-10 pb-16 lg:grid-cols-12">
        <nav aria-label="Isi halaman" className="lg:col-span-3">
          <ul className="grid gap-1 lg:sticky lg:top-24">
            {BAGIAN.map((b) => (
              <li key={b.id}>
                <a href={`#${b.id}`} className="block rounded-[6px] px-3 py-2 text-[0.95rem] hover:bg-kapas">
                  {b.judul}
                </a>
              </li>
            ))}
            <li>
              <a href="#per-kain" className="block rounded-[6px] px-3 py-2 text-[0.95rem] hover:bg-kapas">
                Catatan per kain
              </a>
            </li>
          </ul>
        </nav>
        <div className="grid gap-10 lg:col-span-9">
          {BAGIAN.map((b) => (
            <section key={b.id} id={b.id} aria-labelledby={`judul-${b.id}`} className="scroll-mt-24 border-t-2 border-tinta pt-5">
              <h2 id={`judul-${b.id}`} className="text-[1.6rem] sm:text-[2rem]">
                {b.judul}
              </h2>
              <ol className="mt-4 grid gap-3">
                {b.isi.map((t, i) => (
                  <li key={t} className="flex gap-3">
                    <span className="label flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-kunyit text-[0.8rem] text-tinta">{i + 1}</span>
                    <span className="text-tinta-2">{t}</span>
                  </li>
                ))}
              </ol>
            </section>
          ))}
          <section id="per-kain" aria-labelledby="judul-per-kain" className="scroll-mt-24 border-t-2 border-tinta pt-5">
            <h2 id="judul-per-kain" className="text-[1.6rem] sm:text-[2rem]">
              Catatan per kain
            </h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {kain.map((k) => (
                <li key={k.id} className="flex gap-4 rounded-[6px] bg-putih p-3">
                  <KainDekat kain={k.id} className="h-20 w-20 shrink-0 rounded-[4px]" />
                  <div>
                    <h3 className="text-[1rem]">{k.nama}</h3>
                    <p className="mt-1 text-[0.9rem] text-tinta-2">{k.rawat}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-tinta-2">
              Ada pertanyaan lain?{' '}
              <Link href="/bantuan#perawatan" className="tautan">
                Lihat tanya jawab perawatan
              </Link>
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
