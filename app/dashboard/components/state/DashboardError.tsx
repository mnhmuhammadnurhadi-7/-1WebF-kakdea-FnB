"use client";

import { Icon } from "../shared/Icon";

type DashboardErrorProps = { onRetry: () => void; incidentId: string };

/** Tampilan "Gagal Memuat Dashboard" (frame Figma 03). */
export function DashboardError({ onRetry, incidentId }: DashboardErrorProps) {
  return (
    <section className="mx-auto flex max-w-[560px] flex-col items-center gap-5 pt-12 text-center">
      <span className="flex size-[72px] items-center justify-center rounded-[22px] border border-bad-edge bg-bad-tint text-bad shadow-[0_10px_22px_rgba(220,38,38,.2)]">
        <Icon name="warn" size={34} stroke={1.7} />
      </span>

      <h1 className="text-[40px] font-extrabold leading-[1.1] tracking-[-.04em]">
        <span className="text-navy">Gagal</span> <span className="text-brand">Memuat Dashboard</span>
      </h1>
      <p className="text-[15px] leading-relaxed text-body">
        Data kas dan stok belum bisa diambil dari server. Buku kas kamu tetap aman, coba muat ulang beberapa saat lagi.
      </p>

      <div className="flex w-full items-center gap-3.5 rounded-[20px] bg-white px-[18px] py-3.5 text-left shadow-btn">
        <span className="flex size-10 items-center justify-center rounded-xl bg-[#e8f0ff] text-brand">
          <Icon name="clipboard" size={20} />
        </span>
        <div className="flex-1">
          <p className="text-sm font-bold">
            ID Insiden: <span className="text-brand">{incidentId}</span>
          </p>
          <p className="flex items-center gap-1.5 text-xs font-semibold text-ok-text">
            <span className="size-[7px] rounded-full bg-ok" />
            Buku Kas &amp; Saldo Terisolasi Aman
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigator.clipboard?.writeText(incidentId)}
          className="inline-flex h-9 items-center gap-[7px] rounded-[11px] border border-[#c5d8ff] bg-[#e8f0ff] px-3.5 text-[13px] font-bold text-navy"
        >
          <Icon name="copy" size={15} stroke={2} />
          Salin ID
        </button>
      </div>

      <button
        type="button"
        onClick={onRetry}
        className="inline-flex h-[46px] items-center gap-2 rounded-btn bg-brand px-[22px] text-[15px] font-semibold text-white shadow-blue transition hover:bg-brand-hover active:translate-y-px active:bg-brand-press"
      >
        <Icon name="refresh" size={17} stroke={2.1} />
        Muat Ulang Dashboard
      </button>
      <p className="text-xs text-muted">
        Kode: <b className="text-ink">ERR-LOAD-01</b>
      </p>
    </section>
  );
}
