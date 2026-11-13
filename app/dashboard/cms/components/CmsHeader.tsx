export function CmsHeader() {
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

      <div className="relative z-10 max-w-3xl">
        <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.17em] text-sky">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-sky" />
          Dapur Soju <span className="font-medium text-white/55">/ CMS System</span>
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h1 className="text-[28px] font-bold leading-[1.15] tracking-[-.035em] sm:text-[34px]">CMS System</h1>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[.08em] text-white/85">
            <span className="size-1.5 rounded-full bg-ok" />
            Halaman Customer
          </span>
        </div>
        <p className="mt-2 max-w-xl text-sm leading-6 text-white/70">
          Kelola konten dan menu makanan untuk halaman customer.
        </p>
      </div>
    </section>
  );
}
