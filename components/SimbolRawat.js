// Simbol perawatan pakaian (gaya label cuci umum), digambar garis.
const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinejoin: 'round', strokeLinecap: 'round' };

export const SIMBOL = {
  cuci30: (
    <>
      <path d="M5 13h30l-3 16a3 3 0 0 1-3 2.5H11A3 3 0 0 1 8 29L5 13Z" {...S} />
      <path d="M5 13c3 2.5 6 2.5 9 0s6-2.5 9 0 6 2.5 9 0" {...S} />
      <text x="20" y="27" fontSize="9" fontWeight="700" textAnchor="middle" fill="currentColor" stroke="none">
        30
      </text>
    </>
  ),
  tanpaPemutih: (
    <>
      <path d="M20 7 35 32H5L20 7Z" {...S} />
      <path d="M9 9l22 25M31 9 9 34" {...S} />
    </>
  ),
  tanpaPengering: (
    <>
      <rect x="6" y="7" width="28" height="28" rx="2" {...S} />
      <circle cx="20" cy="21" r="9" {...S} />
      <path d="M8 9l24 24M32 9 8 33" {...S} />
    </>
  ),
  jemurTeduh: (
    <>
      <rect x="6" y="7" width="28" height="28" rx="2" {...S} />
      <path d="M6 15 14 7M6 21 20 7" {...S} />
      <path d="M20 13v16" {...S} />
    </>
  ),
  setrikaSedang: (
    <>
      <path d="M6 30h29c0-8-3-14-10-15H14c-3 0-5 2-6 5L6 30Z" {...S} />
      <path d="M14 15V11h12" {...S} />
      <circle cx="17" cy="24" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="24" cy="24" r="1.3" fill="currentColor" stroke="none" />
    </>
  ),
};

export default function SimbolRawat({ nama, className = 'h-10 w-10' }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true" focusable="false">
      {SIMBOL[nama]}
    </svg>
  );
}
