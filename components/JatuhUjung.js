// Perkiraan letak ujung baju di badan, digambar pada siluet sesuai tinggi badan.
import { BADAN, KAKI_KANAN, KAKI_KIRI, LENGAN_KANAN, LENGAN_KIRI, KEPALA } from '@/lib/busana/tubuh';

const LANTAI = 714;
const PUNCAK = 24;

export default function JatuhUjung({ hasil, className = '' }) {
  if (!hasil) return null;
  const skala = (LANTAI - PUNCAK) / hasil.tinggi;
  const y = (cm) => LANTAI - cm * skala;
  const yAwal = y(hasil.awal);
  const yUjung = Math.min(LANTAI, y(Math.max(0, hasil.ujung)));
  return (
    <svg viewBox="40 0 220 740" className={className} role="img" aria-label={`Perkiraan: ujungnya jatuh ${hasil.letak}, sekitar ${Math.max(0, hasil.ujung)} cm dari lantai untuk tinggi ${hasil.tinggi} cm.`}>
      <g fill="#d9d3c5">
        <path d={KAKI_KANAN} />
        <path d={KAKI_KIRI} />
        <path d={BADAN} />
        <path d={KEPALA} />
        <path d={LENGAN_KANAN} />
        <path d={LENGAN_KIRI} />
      </g>
      <rect x="84" y={yAwal} width="132" height={Math.max(2, yUjung - yAwal)} fill="#1d3157" fillOpacity=".22" />
      <line x1="56" x2="244" y1={yUjung} y2={yUjung} stroke="#1d3157" strokeWidth="3" strokeDasharray="7 4" />
      <line x1="56" x2="244" y1={LANTAI} y2={LANTAI} stroke="#141b2d" strokeOpacity=".5" strokeWidth="2" />
    </svg>
  );
}
