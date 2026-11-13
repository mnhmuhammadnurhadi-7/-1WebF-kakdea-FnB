import { Icon } from "./Icon";
import { MAX_UNGGULAN } from "./constants";
import type { CmsContent } from "./types";

type CmsStatsProps = { menuCount: number; starredCount: number; contact: CmsContent };

/** Ringkasan di atas halaman — angka diambil dari data yang sudah dimuat (tanpa request tambahan). */
export function CmsStats({ menuCount, starredCount, contact }: CmsStatsProps) {
  const phone = contact?.judul;
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="flex items-center gap-4 rounded-[20px] border border-white/10 bg-gradient-to-br from-navy via-navy to-brand p-5 text-white shadow-navy">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white">
          <Icon name="home" size={20} />
        </span>
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="text-[11px] font-extrabold uppercase tracking-[.08em] text-sky">Menu di katalog</span>
          <span className="tabular text-[28px] font-extrabold leading-tight tracking-[-.02em]">{menuCount} Menu</span>
          <span className="text-[12.5px] text-white/70">tersedia untuk pelanggan</span>
        </div>
      </div>

      <div className="flex items-center gap-4 rounded-[20px] border border-line bg-white p-5 text-ink shadow-card">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF4D6] text-[#92400E]">
          <Icon name="star" size={20} fill="currentColor" />
        </span>
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="text-[11px] font-extrabold uppercase tracking-[.08em] text-label">Produk unggulan</span>
          <span className="tabular text-[28px] font-extrabold leading-tight tracking-[-.02em]">{starredCount} / {MAX_UNGGULAN}</span>
          <span className="text-[12.5px] text-body">Maksimal {MAX_UNGGULAN} menu berbintang di beranda</span>
        </div>
      </div>

      <div className="flex items-center gap-4 rounded-[20px] border border-line bg-white p-5 text-ink shadow-card">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-ok-tint text-ok-text">
          <Icon name="phone" size={20} />
        </span>
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="text-[11px] font-extrabold uppercase tracking-[.08em] text-label">Nomor WhatsApp</span>
          <span className="tabular truncate text-[24px] font-extrabold leading-tight tracking-[-.02em]">{phone || "-"}</span>
          <span className="text-[12.5px] text-body">Diatur di kartu Kontak</span>
        </div>
      </div>
    </div>
  );
}
