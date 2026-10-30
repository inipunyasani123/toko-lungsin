// Linimasa status (pesanan atau tukar ukuran) dengan waktu WIB.
import { waktuWIB } from '@/lib/format';

export default function Linimasa({ tahap, kini, waktu, ringkas = false, tambahan = {} }) {
  const iKini = tahap.findIndex((s) => s.id === kini);
  return (
    <ol className="relative grid gap-0">
      {tahap.map((s, i) => {
        const selesai = i <= iKini;
        const sekarang = i === iKini;
        const w = waktu(s.id);
        return (
          <li key={s.id} className="relative grid grid-cols-[2rem_1fr] gap-3 pb-6 last:pb-0" aria-current={sekarang ? 'step' : undefined}>
            {i < tahap.length - 1 && <span aria-hidden="true" className={`absolute left-[0.94rem] top-6 h-[calc(100%-1.25rem)] w-0.5 ${i < iKini ? 'bg-nila' : 'bg-garis-tua/60'}`} />}
            <span aria-hidden="true" className="relative mt-0.5 flex h-8 w-8 items-center justify-center">
              {sekarang ? (
                <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-nila bg-putih">
                  <span className="h-3 w-3 rounded-full bg-kunyit" />
                </span>
              ) : selesai ? (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-nila text-white">
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5">
                    <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              ) : (
                <span className="h-5 w-5 rounded-full border-2 border-garis-tua bg-mori" />
              )}
            </span>
            <div>
              <p className={`font-semibold leading-tight ${selesai ? 'text-tinta' : 'text-tinta-3'}`}>
                {s.label}
                <span className="sr-only">{sekarang ? ' (status sekarang)' : selesai ? ' (selesai)' : ' (belum)'}</span>
              </p>
              <p className="label mt-1 text-[0.75rem] text-tinta-2">{w ? waktuWIB(w) : 'Belum'}</p>
              {!ringkas && selesai && <p className="mt-1 text-[0.9rem] text-tinta-2">{s.ket}</p>}
              {!ringkas && tambahan[s.id]}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
