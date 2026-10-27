export function AiHeader() {
  return (
    <section className="flex flex-col gap-1.5">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-[34px] font-bold leading-[1.15] tracking-[-.03em]">Asisten AI</h1>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-ok-tint px-3 py-1 text-[11px] font-extrabold uppercase tracking-[.08em] text-ok-text">
          <span className="size-1.5 rounded-full bg-ok" />
          Online
        </span>
      </div>
      <p className="text-[15px] text-body">
        Chat seperti biasa, atau pakai <span className="rounded-md bg-sky-tint px-1.5 py-0.5 font-mono text-[13px] font-bold text-navy">/add</span> untuk input data cepat.
      </p>
    </section>
  );
}
