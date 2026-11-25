import Image from "next/image";
import Link from "next/link";

export function BrandPanel() {
  return (
    <section className="relative hidden overflow-hidden bg-[linear-gradient(145deg,#10285F_0%,#1E3A78_100%)] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
      <svg aria-hidden="true" viewBox="0 0 640 520" className="pointer-events-none absolute -right-36 -top-20 h-[420px] w-[560px] text-sky">
        <ellipse cx="360" cy="210" rx="240" ry="116" transform="rotate(-18 360 210)" fill="none" stroke="currentColor" strokeDasharray="8 8" strokeOpacity=".22" strokeWidth="1.5" />
        <ellipse cx="360" cy="210" rx="164" ry="78" transform="rotate(-18 360 210)" fill="none" stroke="currentColor" strokeOpacity=".16" strokeWidth="1.2" />
      </svg>
      <svg aria-hidden="true" viewBox="0 0 500 320" className="pointer-events-none absolute -bottom-36 -left-36 h-[300px] w-[460px] text-sky">
        <ellipse cx="230" cy="160" rx="220" ry="96" transform="rotate(-20 230 160)" fill="none" stroke="currentColor" strokeDasharray="8 8" strokeOpacity=".18" strokeWidth="1.5" />
      </svg>

      <div className="relative z-10 flex items-center justify-between gap-4">
        <Link href="/customer" className="flex items-center gap-3 rounded-xl focus-visible:outline-white">
          <Image src="/soju.png" alt="" width={44} height={44} loading="eager" className="size-11 shrink-0 rounded-full object-cover shadow-blue" />
          <span className="leading-tight">
            <span className="block text-[20px] font-extrabold tracking-wide">SOJU</span>
            <span className="block text-[10px] font-semibold tracking-[.08em] text-sky">KULINER &amp; FROZEN FOOD</span>
          </span>
        </Link>
        <span className="hidden items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 font-mono text-[10px] tracking-wide text-white/85 xl:inline-flex">
          <span className="size-1.5 rounded-full bg-[#34d399]" />
          SYS-ID: SOJU-KAS-2026
        </span>
      </div>

      <div className="relative z-10 max-w-[440px]">
        <h1 className="text-[28px] font-bold leading-[1.2] tracking-[-.02em] xl:text-[30px]">Catat, cek, dan kelola kas Dapur Soju dari satu tempat.</h1>
        <p className="mt-5 text-[15px] leading-7 text-white/75">
          Catatan transaksi otomatis, manajemen pemasok, dan kontrol stok cold-storage terpadu.
        </p>

        <div className="mt-8 flex max-w-[360px] items-center gap-4 rounded-2xl border border-white/20 bg-white/[.07] p-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/[.08] text-sky">
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="4" y="4" width="6" height="6" rx="1" />
              <rect x="14" y="4" width="6" height="6" rx="1" />
              <rect x="4" y="14" width="6" height="6" rx="1" />
              <path d="M14 17h6M17 14v6" />
            </svg>
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.1em] text-white/60">Ruang kerja admin</p>
            <p className="mt-1 text-[14px] font-semibold text-white/95">Kas, pemasok, dan stok</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between gap-4 border-t border-white/20 pt-4 text-[11.5px] text-white/65">
        <span>Platform Operasional UMKM Tepercaya</span>
        <span>© 2026 Dapur Soju.</span>
      </div>
    </section>
  );
}
