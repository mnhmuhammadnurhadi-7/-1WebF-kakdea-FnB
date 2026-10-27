import { Icon } from "../shared/Icon";
import { MAX_UNGGULAN } from "../shared/constants";
import type { CmsContent } from "../shared/types";

type CmsStatsProps = { menuCount: number; starredCount: number; contact: CmsContent };

/** Ringkasan di atas halaman — angka diambil dari data yang sudah dimuat (tanpa request tambahan). */
export function CmsStats({ menuCount, starredCount, contact }: CmsStatsProps) {
  const phone = contact?.judul;
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="flex flex-col gap-2 rounded-card bg-white p-5 shadow-card">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-extrabold uppercase tracking-[.08em] text-label">Menu di katalog</span>
          <span className="rounded-full bg-ok-tint px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-[.06em] text-ok-text">Publik</span>
        </div>
        <span className="tabular text-[30px] font-extrabold leading-tight tracking-[-.02em]">{menuCount} Menu</span>
        <span className="text-[12.5px] text-body">tersedia untuk pelanggan</span>
      </div>

      <div className="flex flex-col gap-2 rounded-card bg-white p-5 shadow-card">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-extrabold uppercase tracking-[.08em] text-label">Produk unggulan</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF4D6] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-[.06em] text-[#92400E]">
            <Icon name="star" size={10} fill="currentColor" />
            Beranda
          </span>
        </div>
        <span className="tabular text-[30px] font-extrabold leading-tight tracking-[-.02em]">{starredCount} / {MAX_UNGGULAN}</span>
        <span className="text-[12.5px] text-body">Maksimal {MAX_UNGGULAN} menu berbintang tampil di beranda</span>
      </div>

      <div className="relative flex flex-col gap-2 overflow-hidden rounded-card bg-navy p-5 text-white shadow-navy">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-extrabold uppercase tracking-[.08em] text-sky">Nomor WhatsApp</span>
          {phone && <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-[.06em] text-[#9BF0C8]">Terhubung</span>}
        </div>
        <span className="tabular truncate text-[26px] font-extrabold leading-tight tracking-[-.02em]">{phone || "-"}</span>
        <span className="text-[12.5px] text-sky">Diatur di kartu Kontak</span>
      </div>
    </div>
  );
}
