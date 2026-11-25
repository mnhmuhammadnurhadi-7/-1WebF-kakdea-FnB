import Link from "next/link";

export function StatusHeader() {
  return (
    <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
      <Link href="/customer" className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-brand text-[18px] font-extrabold text-white shadow-blue">S</span>
        <span className="leading-tight">
          <span className="block text-[18px] font-extrabold text-ink">SOJU</span>
          <span className="block text-[9.5px] font-bold tracking-[.1em] text-faint">KULINER &amp; FROZEN FOOD</span>
        </span>
      </Link>
      <nav className="hidden items-center gap-6 text-[12px] font-semibold text-body sm:flex">
        <Link href="/customer" className="transition hover:text-ink">Pusat Bantuan Dapur</Link>
        <Link href="/status/503" className="transition hover:text-ink">Status Node Layanan</Link>
        <Link href="/login" aria-label="Masuk" className="flex size-8 items-center justify-center rounded-full bg-brand text-white">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="8" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" /></svg>
        </Link>
      </nav>
    </header>
  );
}
