'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Logo from './Logo';
import { IkonTas, IkonMeteran } from './Ikon';
import { nav } from '@/lib/data';
import { useKeranjang, useProfil, useTerpasang } from '@/lib/store';

export default function Header() {
  const path = usePathname();
  const [buka, setBuka] = useState(false);
  const keranjang = useKeranjang();
  const profil = useProfil();
  const terpasang = useTerpasang();
  const jumlah = terpasang ? keranjang.reduce((n, it) => n + it.qty, 0) : 0;
  const adaProfil = terpasang && Boolean(profil?.dada || profil?.pinggul || profil?.pinggang);

  useEffect(() => {
    setBuka(false);
  }, [path]);

  const aktif = (href) => path === href || path.startsWith(`${href}/`);

  return (
    <header data-situs className="sticky top-0 z-40 border-b border-garis bg-mori/95 backdrop-blur-sm">
      <div aria-hidden="true" className="lungsin h-1.5 bg-nila-muda/60" />
      <div className="wadah flex h-16 items-center gap-2 sm:gap-3">
        <Link href="/" className="shrink-0 rounded-sm text-nila" aria-label="Lungsin, ke beranda">
          <Logo />
        </Link>

        <nav aria-label="Navigasi utama" className="ms-auto hidden lg:block">
          <ul className="flex items-center gap-0.5">
            {nav.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  aria-current={aktif(n.href) ? 'page' : undefined}
                  className="relative block rounded-sm px-3 py-2 text-[0.95rem] font-medium text-tinta-2 hover:text-tinta aria-[current=page]:text-nila after:absolute after:inset-x-3 after:-bottom-0.5 after:h-[3px] after:rounded-full after:bg-kunyit after:opacity-0 aria-[current=page]:after:opacity-100"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link
          href="/panduan-ukuran#ukuranku"
          className="ms-auto hidden min-h-11 items-center gap-2 rounded-[6px] px-2.5 py-2 text-[0.92rem] font-medium hover:bg-kapas sm:flex lg:ms-2"
        >
          <IkonMeteran className="h-5 w-5 text-nila" />
          <span>{adaProfil ? 'Ukuranku tersimpan' : 'Ukuranku'}</span>
        </Link>

        <Link
          href="/keranjang"
          className="ms-auto flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-[6px] px-2 py-2 font-medium hover:bg-kapas sm:ms-0"
          aria-current={path === '/keranjang' ? 'page' : undefined}
        >
          <IkonTas className="h-6 w-6" />
          <span className="sr-only sm:not-sr-only">Keranjang</span>{' '}
          <span
            className={`label inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-[0.75rem] ${
              jumlah ? 'bg-nila text-white' : 'bg-kapas text-tinta-2'
            }`}
          >
            {jumlah}
          </span>
          <span className="sr-only"> barang</span>
        </Link>

        <button
          type="button"
          className="flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-[6px] px-2 py-2 font-medium hover:bg-kapas lg:hidden"
          aria-expanded={buka}
          aria-controls="menu-ponsel"
          onClick={() => setBuka((b) => !b)}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" focusable="false">
            {buka ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            )}
          </svg>
          <span className="max-[359px]:sr-only">Menu</span>
        </button>
      </div>

      <nav id="menu-ponsel" aria-label="Navigasi utama (ponsel)" hidden={!buka} className="border-t border-garis bg-mori lg:hidden">
        <ul className="wadah grid py-2">
          {[...nav, { href: '/panduan-ukuran#ukuranku', label: 'Ukuranku' }, { href: '/lacak', label: 'Lacak pesanan' }].map((n) => (
            <li key={n.href}>
              <Link
                href={n.href}
                aria-current={aktif(n.href) ? 'page' : undefined}
                className="flex min-h-12 items-center justify-between border-b border-garis/70 py-3 font-display text-lg last:border-0 aria-[current=page]:text-nila-3"
                onClick={() => setBuka(false)}
              >
                {n.label}
                <span aria-hidden="true" className="text-tinta-3">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
