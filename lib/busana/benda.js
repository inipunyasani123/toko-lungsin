// Ilustrasi benda selain busana: kain potong terlipat, kain dari dekat, dan gulungan meteran jahit.
import { idPola, cariKain } from './kain.js';

const TINTA = '#0d1426';
const isi = (k, arah = '') => `url(#${idPola(k, arah)})`;

// Kain potong: dua lipatan bertumpuk di depan gulungan kain, meteran kuning tersampir. Kanvas 300 × 300.
export function svgKainLipat(k, { meteran = true } = {}) {
  const kn = cariKain(k);
  if (!kn) return '';
  let s = '<ellipse cx="150" cy="262" rx="128" ry="12" fill="url(#g-lantai)"/>';
  // gulungan di belakang
  s += `<path d="M 54 92 L 246 92 C 256 92 262 108 262 128 C 262 148 256 164 246 164 L 54 164 Z" fill="${isi(k)}"/>`;
  s += `<path d="M 54 92 L 246 92 C 256 92 262 108 262 128 C 262 148 256 164 246 164 L 54 164 Z" fill="url(#g-turun)"/>`;
  s += `<path d="M 54 92 L 246 92 L 246 104 L 54 104 Z" fill="#fff" fill-opacity=".08"/>`;
  s += `<ellipse cx="54" cy="128" rx="13" ry="36" fill="${isi(k, 'h')}"/><ellipse cx="54" cy="128" rx="13" ry="36" fill="${TINTA}" fill-opacity=".28"/>`;
  for (const r of [30, 23, 16, 9]) s += `<ellipse cx="54" cy="128" rx="${r * 0.36}" ry="${r}" fill="none" stroke="${TINTA}" stroke-opacity=".25" stroke-width=".8"/>`;
  s += `<ellipse cx="54" cy="128" rx="2.4" ry="6" fill="#efe6d3"/>`;
  // dua lipatan
  const lipatan = (y, tebal, geser) => {
    const d = `M ${60 + geser} ${y} L ${248 + geser} ${y} C ${256 + geser} ${y} ${260 + geser} ${y + tebal / 2} ${256 + geser} ${y + tebal} L ${60 + geser} ${y + tebal} C ${52 + geser} ${y + tebal} ${48 + geser} ${y + tebal / 2} ${52 + geser} ${y + 2} C ${54 + geser} ${y} ${57 + geser} ${y} ${60 + geser} ${y} Z`;
    return `<path d="${d}" fill="${isi(k)}"/><path d="${d}" fill="url(#g-turun)"/><path d="${d}" fill="none" stroke="${TINTA}" stroke-opacity=".3" stroke-width=".8"/>` +
      `<path d="M ${56 + geser} ${y + tebal * 0.55} L ${250 + geser} ${y + tebal * 0.55}" stroke="${TINTA}" stroke-opacity=".14" stroke-width="1.2"/>`;
  };
  s += lipatan(178, 40, -6) + lipatan(212, 46, 4);
  // atas tumpukan: bidang kain yang terlihat dari atas sedikit
  s += `<path d="M 50 178 L 246 178 L 242 172 L 56 172 Z" fill="${isi(k)}"/><path d="M 50 178 L 246 178 L 242 172 L 56 172 Z" fill="#fff" fill-opacity=".12"/>`;
  if (meteran) {
    s += '<path d="M 38 196 C 80 188 110 206 150 200 C 190 194 220 176 266 186 L 268 196 C 222 186 192 204 151 210 C 110 216 80 198 40 206 Z" fill="#e6ac2c"/>';
    s += '<path d="M 38 196 C 80 188 110 206 150 200 C 190 194 220 176 266 186" fill="none" stroke="#8a5a00" stroke-opacity=".55" stroke-width=".7"/>';
    for (let i = 0; i < 22; i++) {
      const x = 46 + i * 10;
      s += `<path d="M ${x} ${197 + Math.sin(i / 3.2) * 4} l 0 ${i % 5 === 0 ? 6 : 3}" stroke="#3a2a00" stroke-opacity=".7" stroke-width=".7"/>`;
    }
  }
  return s;
}

// Kain dari dekat: anyaman diperbesar, dengan tepi kain (pinggiran) berumbai di bawah. Kanvas 300 × 300.
export function svgKainDekat(k) {
  const kn = cariKain(k);
  if (!kn) return '';
  let s = `<rect x="0" y="0" width="300" height="300" fill="${isi(k, 'z')}"/>`;
  s += '<rect x="0" y="0" width="300" height="300" fill="url(#g-sisi)" opacity=".7"/>';
  s += '<rect x="0" y="0" width="300" height="300" fill="url(#g-sorot)"/>';
  return s;
}
