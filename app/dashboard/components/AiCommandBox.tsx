import Link from "next/link";
import { Icon } from "./Icon";

const AI_PAGE = "/dashboard/ai";

export function AiCommandBox() {
  return (
    <section className="flex flex-col gap-4 rounded-[20px] border border-line bg-white p-5 shadow-card sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-sky-tint text-brand">
          <Icon name="bot" size={21} />
        </span>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[.12em] text-brand">Asisten pintar</p>
          <h2 className="mt-0.5 text-base font-bold tracking-[-.02em]">BukuKita AI</h2>
          <p className="text-sm text-body">Catat transaksi atau cek laba di Asisten AI.</p>
        </div>
      </div>

      <Link
        href={AI_PAGE}
        className="inline-flex h-11 shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-brand px-5 text-sm font-semibold text-white shadow-btn transition hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:self-auto"
      >
        Buka Asisten AI
        <Icon name="send" size={15} stroke={2} />
      </Link>
    </section>
  );
}
