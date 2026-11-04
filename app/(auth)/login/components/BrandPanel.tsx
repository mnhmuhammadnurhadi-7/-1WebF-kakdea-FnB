import Link from "next/link";

/** Panel kiri bergaya Figma: gradasi navy, orbit dekoratif, pesan utama, dan kartu status sistem. */
export function BrandPanel() {
  return (
    <section className="relative hidden overflow-hidden bg-[linear-gradient(165deg,#102a6e_0%,#1E3A8A_100%)] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
      {/* Orbit dekoratif */}
      <svg aria-hidden="true" viewBox="0 0 600 500" className="pointer-events-none absolute -right-24 -top-10 h-[420px] w-[600px]">
        <ellipse cx="380" cy="190" rx="250" ry="120" transform="rotate(-18 380 190)" fill="none" stroke="rgba(142,209,228,.35)" strokeWidth="1.3" strokeDasharray="10 8" />
        <ellipse cx="400" cy="170" rx="170" ry="80" transform="rotate(-18 400 170)" fill="none" stroke="rgba(255,255,255,.2)" strokeWidth="1.2" />
      </svg>
      <svg aria-hidden="true" viewBox="0 0 500 360" className="pointer-events-none absolute -bottom-24 -left-24 h-[330px] w-[460px]">
        <ellipse cx="200" cy="200" rx="210" ry="110" transform="rotate(-22 200 200)" fill="none" stroke="rgba(142,209,228,.28)" strokeWidth="1.3" strokeDasharray="10 8" />
      </svg>

      <div className="relative flex items-center justify-between gap-4">
        <Link href="/customer" className="flex items-center gap-3 rounded-xl focus-visible:outline-white">
          <span className="flex size-11 items-center justify-center rounded-xl bg-brand text-[20px] font-extrabold shadow-blue">S</span>
          <span className="leading-tight">
            <span className="block text-[20px] font-extrabold tracking-wide">SOJU</span>
            <span className="block text-[10px] font-semibold tracking-[.08em] text-sky">KULINER &amp; FROZEN FOOD</span>
          </span>
        </Link>
        <span className="hidden items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 font-mono text-[10px] font-bold tracking-wider xl:inline-flex">
          <span className="size-1.5 rounded-full bg-[#34d399]" />
          SYS-ID: SOJU-KAS-2026
        </span>
      </div>

      <div className="relative max-w-[440px]">
        <h1 className="text-[34px] font-bold leading-[1.2] tracking-[-.02em] xl:text-[40px]">Catat, cek, dan kelola kas Dapur Soju dari satu tempat.</h1>
        <p className="mt-4 text-[15px] leading-7 text-white/75">
          Catatan transaksi otomatis, manajemen pemasok, dan kontrol stok cold-storage terpadu.
        </p>

        <div className="mt-8 flex max-w-[330px] items-center justify-between gap-4 rounded-2xl border border-white/15 bg-white/[.07] p-4 backdrop-blur-sm">
          <div>
            <div className="text-[10px] font-bold tracking-[.1em] text-white/60">STATUS SISTEM</div>
            <div className="text-[19px] font-extrabold">100% Sinkron</div>
            <div className="text-[11.5px] text-white/65">Integritas data kas &amp; bank</div>
          </div>
          <div className="flex gap-2 text-white/85">
            {[
              <path key="a" d="M12 3 4.5 6v5.5c0 4.5 3.2 7.8 7.5 9.5 4.3-1.7 7.5-5 7.5-9.5V6zM9 12l2.2 2.2L15.5 10" />,
              <path key="b" d="M3 12h4l2.5-6 4 12 2.5-6H21" />,
            ].map((d, i) => (
              <span key={i} className="flex size-10 items-center justify-center rounded-xl border border-white/20 bg-white/10">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{d}</svg>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="relative flex items-center justify-between gap-4 border-t border-white/15 pt-4 text-[11.5px] text-white/65">
        <span>Platform Operasional UMKM Tepercaya</span>
        <span>© 2026 Dapur Soju.</span>
      </div>
    </section>
  );
}
