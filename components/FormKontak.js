'use client';

import { useId, useState } from 'react';
import { site } from '@/lib/data';

const TOPIK = ['Ukuran dan tukar ukuran', 'Pesanan dan pengiriman', 'Kain potong', 'Kerja sama atau pesanan jumlah banyak', 'Lainnya'];

// Formulir kontak demo: menyusun pesan, tidak mengirimnya ke mana pun.
export default function FormKontak() {
  const id = useId();
  const [f, setF] = useState({ nama: '', topik: TOPIK[0], kode: '', pesan: '' });
  const [galat, setGalat] = useState({});
  const [jadi, setJadi] = useState('');
  const [salin, setSalin] = useState('');

  const kirim = (e) => {
    e.preventDefault();
    const g = {};
    if (f.nama.trim().length < 2) g.nama = 'Tulis namamu.';
    if (f.pesan.trim().length < 10) g.pesan = 'Tulis pesan minimal 10 huruf.';
    setGalat(g);
    if (g.nama || g.pesan) {
      document.getElementById(`${id}-${g.nama ? 'nama' : 'pesan'}`)?.focus();
      return;
    }
    setJadi(`Halo ${site.nama}, saya ${f.nama.trim()}.\nTopik: ${f.topik}${f.kode.trim() ? `\nKode pesanan: ${f.kode.trim().toUpperCase()}` : ''}\n\n${f.pesan.trim()}`);
    setSalin('');
  };

  return (
    <div className="grid gap-6">
      <form noValidate onSubmit={kirim} className="grid gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor={`${id}-nama`} className="font-medium">
              Nama
            </label>
            <input id={`${id}-nama`} className="isian mt-1.5" autoComplete="name" value={f.nama} onChange={(e) => setF({ ...f, nama: e.target.value })} aria-invalid={galat.nama ? 'true' : undefined} aria-describedby={galat.nama ? `${id}-nama-galat` : undefined} />
            {galat.nama && (
              <p id={`${id}-nama-galat`} className="mt-1 text-[0.86rem] font-medium text-secang">
                {galat.nama}
              </p>
            )}
          </div>
          <div>
            <label htmlFor={`${id}-kode`} className="font-medium">
              Kode pesanan <span className="font-normal text-tinta-3">(bila ada)</span>
            </label>
            <input id={`${id}-kode`} className="isian mt-1.5" autoComplete="off" placeholder="LGS-2610-0112" value={f.kode} onChange={(e) => setF({ ...f, kode: e.target.value })} />
          </div>
        </div>
        <div>
          <label htmlFor={`${id}-topik`} className="font-medium">
            Topik
          </label>
          <select id={`${id}-topik`} className="isian mt-1.5" value={f.topik} onChange={(e) => setF({ ...f, topik: e.target.value })}>
            {TOPIK.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${id}-pesan`} className="font-medium">
            Pesan
          </label>
          <textarea id={`${id}-pesan`} rows={5} className="isian mt-1.5" value={f.pesan} onChange={(e) => setF({ ...f, pesan: e.target.value })} aria-invalid={galat.pesan ? 'true' : undefined} aria-describedby={galat.pesan ? `${id}-pesan-galat` : undefined} />
          {galat.pesan && (
            <p id={`${id}-pesan-galat`} className="mt-1 text-[0.86rem] font-medium text-secang">
              {galat.pesan}
            </p>
          )}
        </div>
        <div>
          <button type="submit" className="tombol tombol-nila">
            Susun pesan
          </button>
        </div>
      </form>
      <div role="status" aria-live="polite">
        {jadi && (
          <div className="rounded-[6px] border-2 border-dashed border-nila/40 bg-nila-muda/40 p-5">
            <p className="font-semibold">Pesanmu sudah tersusun.</p>
            <p className="mt-1 text-[0.92rem] text-tinta-2">
              Ini toko demo, jadi pesan tidak dikirim ke mana pun. Di toko sungguhan, tombol ini meneruskan pesan ke WhatsApp atau email penjual.
            </p>
            <pre className="mt-3 whitespace-pre-wrap rounded-[6px] bg-putih p-3 font-sans text-[0.92rem]">{jadi}</pre>
            <button
              type="button"
              className="tombol tombol-garis mt-3"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(jadi);
                  setSalin('Pesan disalin.');
                } catch {
                  setSalin('Tidak bisa menyalin otomatis. Pilih teksnya lalu salin manual.');
                }
              }}
            >
              Salin pesan
            </button>
            {salin && <p className="mt-2 text-[0.9rem] font-medium text-lumut">{salin}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
