export function DataHeader() {
  return (
    <section className="relative isolate overflow-hidden rounded-[26px] border border-white/10 bg-gradient-to-br from-navy via-navy to-brand px-5 py-6 text-white shadow-navy sm:px-7 sm:py-7 lg:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.25) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.25) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-28 hidden size-80 rounded-full border-[34px] border-sky/10 xl:block" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-16 hidden size-56 rounded-full border border-white/10 xl:block" />

      <div className="relative z-10">
        <div className="max-w-3xl">
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.17em] text-sky">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-sky" />
            Dapur Soju <span className="font-medium text-white/55">/ Data transaksi</span>
          </p>
          <h1 className="mt-3 text-[28px] font-bold leading-[1.15] tracking-[-.035em] sm:text-[34px]">
            Data transaksi
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-white/70">
            Kelola pemasukan, pengeluaran, dan pendataan usaha dalam satu tempat.
          </p>
        </div>
      </div>
    </section>
  );
}
