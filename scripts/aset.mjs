// Membuat ikon (app/icon.svg, app/apple-icon.png, app/favicon.ico) dan gambar OG (public/og.jpg, 1200 × 630)
// dari ilustrasi di lib/busana. Butuh Google Chrome (macOS) dan sharp (ikut terpasang bersama next).
// Pemakaian dari akar proyek: node scripts/aset.mjs
import { createRequire } from 'node:module'
import { writeFileSync, mkdtempSync, rmSync, readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { svgDefs } from '../lib/busana/kain.js'
import { svgBusana } from '../lib/busana/render.js'

const AKAR = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const sharp = createRequire(path.join(AKAR, 'package.json'))('sharp')
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

// ---------- Ikon: anyaman 3 × 3 ----------
const lungsin = '#1d3157', pakan = '#e3a62a', sela = '#f7f5ef'
const pos = [3, 12, 21]
let atas = ''
pos.forEach((x, i) => pos.forEach((y, j) => { if ((i + j) % 2 === 0) atas += `<rect x="${x - 0.6}" y="${y}" width="7.2" height="6" fill="${pakan}" stroke="${sela}" stroke-width="1.1"/>` }))
const anyam = pos.map((y) => `<rect x="0.5" y="${y}" width="29" height="6" rx="1" fill="${pakan}"/>`).join('') + pos.map((x) => `<rect x="${x}" y="0.5" width="6" height="29" rx="1" fill="${lungsin}" stroke="${sela}" stroke-width="1.1"/>`).join('') + atas
const ikon = (rx) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-3 -3 36 36"><rect x="-3" y="-3" width="36" height="36" rx="${rx}" fill="${sela}"/>${anyam}</svg>`
writeFileSync(path.join(AKAR, 'app/icon.svg'), ikon(7))
const png = (svg, n) => sharp(Buffer.from(svg), { density: 600 }).resize(n, n).png().toBuffer()
writeFileSync(path.join(AKAR, 'app/apple-icon.png'), await png(ikon(0), 180))
const ukuran = [16, 32, 48]
const bufs = await Promise.all(ukuran.map((n) => png(ikon(7), n)))
const kepala = Buffer.alloc(6); kepala.writeUInt16LE(1, 2); kepala.writeUInt16LE(bufs.length, 4)
let off = 6 + 16 * bufs.length
const dir = bufs.map((b, i) => { const d = Buffer.alloc(16); d[0] = ukuran[i]; d[1] = ukuran[i]; d.writeUInt16LE(1, 4); d.writeUInt16LE(32, 6); d.writeUInt32LE(b.length, 8); d.writeUInt32LE(off, 12); off += b.length; return d })
writeFileSync(path.join(AKAR, 'app/favicon.ico'), Buffer.concat([kepala, ...dir, ...bufs]))

// ---------- OG: rak gantung + judul ----------
const rak = [
  ['blus-shanghai', 'lajur-senja', '35 56 230 590'],
  ['kemeja-teras', 'gerimis-nila', '35 56 230 590'],
  ['outer-sore', 'pematang-soga', '35 56 230 590'],
  ['kulot-lebar', 'polos-arang', '35 183 230 590'],
]
const item = rak.map(([jenis, kain, vb]) => `<svg viewBox="${vb}" width="160" height="410">${svgBusana({ mode: 'gantung', lapis: [{ jenis: jenis === 'kulot-lebar' ? 'kulot-lebar' : jenis, kain }] })}</svg>`).join('')
const font = (f) => 'data:font/woff2;base64,' + readFileSync(path.join(AKAR, 'app/fonts', f)).toString('base64')
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Lebar;src:url(${font('anybody-125-700.woff2')})}
@font-face{font-family:Rapat;src:url(${font('anybody-75-600.woff2')})}
body{margin:0;width:1200px;height:630px;background:#f7f5ef;font-family:-apple-system,Helvetica,Arial,sans-serif;color:#141b2d;overflow:hidden;position:relative}
.benang{position:absolute;inset:0 0 auto 0;height:12px;background:repeating-linear-gradient(90deg,#1d3157 0 2px,transparent 2px 9px,#e3a62a 9px 11px,transparent 11px 18px,#a2322a 18px 20px,transparent 20px 27px)}
.kiri{position:absolute;left:60px;top:70px;width:430px}
.merek{display:flex;align-items:center;gap:14px;font-family:Lebar;font-size:40px;color:#1d3157}
h1{font-family:Lebar;font-size:47px;line-height:1.04;letter-spacing:-.015em;color:#1d3157;margin:38px 0 0}
p{font-size:21px;line-height:1.45;color:#3a4358;margin:20px 0 0}
.label{font-family:Rapat;text-transform:uppercase;letter-spacing:.08em;font-size:16px;color:#3a4358;margin-top:26px}
.rak{position:absolute;right:28px;top:62px;width:664px;height:470px}
.palang{position:absolute;left:0;right:0;top:6px;height:12px;border-radius:9px;background:linear-gradient(#6b7080,#3b3f4a)}
.tiang{position:absolute;top:0;bottom:-40px;width:12px;border-radius:9px;background:#4a4f5d}
.isi{position:absolute;left:14px;right:14px;top:0;display:flex;justify-content:space-around}
.pita{position:absolute;left:0;right:0;bottom:0;height:54px;background:repeating-linear-gradient(90deg,#b4532f 0 22px,#eadfc9 22px 26px,#e0a42b 26px 38px,#eadfc9 38px 42px,#233a63 42px 64px,#6f4326 64px 70px)}
</style></head><body><svg width="0" height="0" style="position:absolute"><defs>${svgDefs()}</defs></svg>
<div class="benang"></div>
<div class="kiri"><div class="merek">${ikon(7).replace('<svg ', '<svg width="54" height="54" ')}Lungsin</div>
<h1>Lurik yang betah dipakai tiap hari</h1>
<p>Kemeja, blus, tunik, kulot, dan luaran dari kain lurik tenun. Ukuran ditulis lengkap, tukar ukuran 14 hari.</p>
<div class="label">Toko online demo · dibuat oleh PintuWeb</div></div>
<div class="rak"><div class="palang"></div><div class="tiang" style="left:0"></div><div class="tiang" style="right:0"></div><div class="isi">${item}</div></div>
<div class="pita"></div></body></html>`
const kerja = mkdtempSync(path.join(tmpdir(), 'og-lungsin-'))
const f = path.join(kerja, 'og.html')
writeFileSync(f, html)
const tangkap = path.join(kerja, 'og.png')
execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--user-data-dir=${kerja}/prof`, '--window-size=1200,630', '--force-device-scale-factor=1', '--virtual-time-budget=3000', `--screenshot=${tangkap}`, 'file://' + f], { stdio: 'ignore' })
await sharp(tangkap).resize(1200, 630).jpeg({ quality: 86, mozjpeg: true }).toFile(path.join(AKAR, 'public/og.jpg'))
rmSync(kerja, { recursive: true, force: true })
console.log('ikon + og.jpg selesai')
