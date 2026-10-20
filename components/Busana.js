// Komponen ilustrasi: definisi pola bersama, busana di manekin/sosok/gantungan, kain terlipat, dan kain dari dekat.
// Isi SVG dirakit sebagai string oleh lib/busana (sama persis di server dan browser), lalu disisipkan.
import { svgDefs, cariKain } from '@/lib/busana/kain';
import { svgBusana } from '@/lib/busana/render';
import { svgKainLipat, svgKainDekat } from '@/lib/busana/benda';
import { GARMEN } from '@/lib/busana/garmen';
import { svgLatar } from '@/lib/busana/adegan';

// Pola kain dipasang sekali di layout; semua ilustrasi lain merujuk lewat url(#k-…).
export function KainDefs() {
  return (
    <svg aria-hidden="true" focusable="false" width="0" height="0" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
      <defs dangerouslySetInnerHTML={{ __html: svgDefs() }} />
    </svg>
  );
}

function Svg({ viewBox, judul, className, inner, style, isi = 'meet' }) {
  return (
    <svg
      viewBox={viewBox}
      className={className}
      style={style}
      role={judul ? 'img' : undefined}
      aria-label={judul || undefined}
      aria-hidden={judul ? undefined : 'true'}
      focusable="false"
      preserveAspectRatio={`xMidYMid ${isi}`}
      dangerouslySetInnerHTML={{ __html: inner }}
    />
  );
}

// Kotak pandang yang memuat batas garmen dengan rasio tertentu (lebar/tinggi), dengan ruang di sekelilingnya.
export function kotakPandang([x0, y0, x1, y1], rasio = 4 / 5, ruang = 0.07) {
  let w = x1 - x0;
  let h = y1 - y0;
  w *= 1 + ruang * 2;
  h *= 1 + ruang * 2;
  if (w / h > rasio) h = w / rasio;
  else w = h * rasio;
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  const r = (n) => Math.round(n * 10) / 10;
  return `${r(cx - w / 2)} ${r(cy - h / 2)} ${r(w)} ${r(h)}`;
}

export default function Busana({ mode = 'manekin', lapis = [], sosok, viewBox = '0 0 300 760', judul, className, alas = true, style }) {
  return <Svg viewBox={viewBox} judul={judul} className={className} style={style} inner={svgBusana({ mode, lapis, sosok, alas })} />;
}

export function KainLipat({ kain, judul, className, meteran = true }) {
  return <Svg viewBox="20 60 260 220" judul={judul} className={className} inner={svgKainLipat(kain, { meteran })} />;
}

export function KainDekat({ kain, judul, className }) {
  return <Svg viewBox="0 0 300 300" judul={judul} className={className} inner={svgKainDekat(kain)} isi="slice" />;
}

// Contoh kain kecil, memakai pola global dari KainDefs (tanpa id baru, jadi aman dipakai berulang).
export function ContohKain({ kain, className, skala = 1 }) {
  const k = cariKain(kain);
  if (!k) return null;
  const sisi = Math.round((32 / skala) * 10) / 10;
  return (
    <svg aria-hidden="true" focusable="false" className={className} viewBox={`0 0 ${sisi} ${sisi}`} preserveAspectRatio="xMidYMid slice">
      <rect width={sisi} height={sisi} fill={`url(#k-${k.id})`} />
    </svg>
  );
}

// Batas gambar per jenis tampilan. 'kartu' = foto katalog, 'utama' = di manekin.
const GANTUNG_ATAS = 66;
export function tampilan(p, kainId, jenis = 'kartu') {
  const g = GARMEN[p.jenis];
  const k = cariKain(kainId);
  const namaKain = k ? k.nama : '';
  if (p.jenis === 'kain') return { kainLipat: true, judul: `${p.nama} ${namaKain}, terlipat dengan gulungan kain` };
  const batas = g.batas;
  const aksesori = g.slot === 'aksesori';
  if (jenis === 'kartu' && !aksesori) {
    const bawah = g.slot === 'bawahan';
    const b = [batas[0], bawah ? 192 : GANTUNG_ATAS, batas[2], batas[3]];
    return { mode: 'gantung', lapis: [{ jenis: p.jenis, kain: kainId }], viewBox: kotakPandang(b, 4 / 5, 0.05), judul: `${p.nama} ${namaKain} tergantung` };
  }
  if (aksesori) {
    const b = p.jenis === 'kerudung' ? [70, 8, 230, 250] : p.jenis === 'syal' ? [96, 60, 204, 350] : [150, 110, 270, 400];
    return { mode: 'manekin', lapis: [{ jenis: p.jenis, kain: kainId }], viewBox: kotakPandang(b, 4 / 5, 0.04), judul: `${p.nama} ${namaKain} di manekin`, alas: false };
  }
  const bawahan = g.slot === 'bawahan';
  const atas = bawahan ? batas[1] - 70 : batas[1] - 46;
  return { mode: 'manekin', lapis: [{ jenis: p.jenis, kain: kainId }], viewBox: kotakPandang([batas[0], atas, batas[2], batas[3] + (bawahan ? 30 : 16)], 4 / 5, 0.04), judul: `${p.nama} ${namaKain} di manekin` };
}

export function GambarProduk({ p, kain, jenis = 'kartu', className, judul }) {
  const t = tampilan(p, kain, jenis);
  if (t.kainLipat) return <KainLipat kain={kain} judul={judul ?? t.judul} className={className} />;
  return <Busana mode={t.mode} lapis={t.lapis} viewBox={t.viewBox} judul={judul ?? t.judul} className={className} alas={t.alas !== false} />;
}

// Titik dekat (detail) per jenis garmen: [x0, y0, x1, y1] di kanvas 300 × 760.
const FOKUS = {
  'kemeja-teras': [118, 100, 206, 210],
  'kemeja-panjang': [112, 96, 200, 206],
  'blus-shanghai': [112, 96, 196, 201],
  'tunik-kebun': [112, 96, 196, 201],
  'outer-sore': [120, 96, 220, 221],
  'jaket-kerja': [140, 160, 214, 252],
  'terusan-pasar': [104, 230, 200, 350],
  'kulot-lebar': [104, 246, 200, 366],
  'celana-tali': [110, 246, 196, 354],
  'rok-lilit': [140, 244, 222, 346],
  kerudung: [104, 20, 196, 135],
  syal: [116, 260, 190, 352],
  'tas-jinjing': [196, 286, 266, 374],
};

export function GambarDetail({ p, kain, className, judul }) {
  const f = FOKUS[p.jenis];
  if (!f) return <KainDekat kain={kain} className={className} judul={judul} />;
  return <Busana mode="manekin" lapis={[{ jenis: p.jenis, kain }]} viewBox={kotakPandang(f, 4 / 5, 0)} judul={judul} className={className} alas={false} />;
}

// Adegan lookbook: latar 600 × 760 dengan sosok di tengahnya.
export function Adegan({ latar, sosok, lapis, judul, className }) {
  const inner = `${svgLatar(latar)}<g transform="translate(150 0)">${svgBusana({ mode: 'sosok', sosok, lapis, alas: true })}</g>`;
  return <Svg viewBox="0 0 600 760" judul={judul} className={className} inner={inner} />;
}
