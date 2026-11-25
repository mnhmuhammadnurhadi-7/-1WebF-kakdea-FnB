import Link from "next/link";
import type { AiActionDraft } from "@/lib/api";
import { StateBanner } from "@/components/feedback/StateBanner";
import { Button } from "./Button";
import { Icon } from "./Icon";
import type { DraftExecutionState } from "./types";

type DraftCardProps = {
  draft: AiActionDraft;
  execution?: DraftExecutionState;
  onConfirm: (draft: AiActionDraft) => void;
  onCorrect: (draft: AiActionDraft) => void;
};

function formatRupiah(amount: number): string {
  return `Rp ${Math.round(amount).toLocaleString("id-ID")}`;
}

export function DraftCard({ draft, execution, onConfirm, onCorrect }: DraftCardProps) {
  const status = execution?.status ?? "idle";
  const isSaving = status === "saving";
  const isSaved = status === "saved";
  const isError = status === "error";
  const canConfirm = draft.isReadyToConfirm && !isSaving && !isSaved;

  return (
    <div className="w-full overflow-hidden rounded-card border border-line-soft bg-white shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line-soft px-5 py-3.5">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-[#e8f0ff] text-brand">
            <Icon name="doc" size={17} stroke={2} />
          </span>
          <div className="flex flex-col">
            <span className="text-[15px] font-bold leading-tight tracking-[-.02em] text-ink">
              {draft.title}
            </span>
            <span className="text-[11.5px] text-faint">
              Sheet: {draft.sheet} · {isSaved ? "tersimpan ke pembukuan" : "menunggu konfirmasi manual"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {draft.badge && (
            <span className="rounded-full bg-[#eef4ff] px-2.5 py-1 text-[10.5px] font-bold text-brand">
              {draft.badge}
            </span>
          )}
          <span className="rounded-full bg-sky-tint px-2.5 py-1 text-[10.5px] font-extrabold uppercase tracking-[.08em] text-navy">
            {draft.sourceBadge}
          </span>
        </div>
      </div>

      <div className="flex flex-col px-5 py-3">
        {draft.summaryRows.map((r, i) => (
          <div
            key={`${r.label}-${i}`}
            className="flex items-center justify-between gap-4 border-b border-dashed border-line py-2.5 last:border-b-0"
          >
            <span className="text-[13px] text-body">{r.label}</span>
            <span className="text-right text-[13.5px] font-bold text-ink">{r.value}</span>
          </div>
        ))}
      </div>

      {draft.items && draft.items.length > 0 && (
        <div className="mx-4 mb-3 rounded-xl border border-line-soft bg-field/80 px-4 py-2.5">
          <p className="mb-1.5 text-[11.5px] font-bold uppercase tracking-[.05em] text-faint">
            {draft.breakdownTitle || "Rincian Item"}
          </p>
          <div className="space-y-1.5">
            {draft.items.map((item, idx) => (
              <div key={`${item.nama}-${idx}`} className="flex items-center justify-between gap-3 text-[12.5px]">
                <span className="text-ink">
                  {item.nama} <span className="text-faint">× {item.jumlah} {item.satuan}</span>
                </span>
                <span className="tabular font-bold text-ink">{formatRupiah(item.subtotal)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {draft.total && (
        <div className="mx-4 mb-4 flex items-center justify-between rounded-xl bg-[#eef4ff] px-4 py-3">
          <span className="text-[13.5px] font-bold text-ink">{draft.totalLabel || "Total"}</span>
          <span className="tabular text-[22px] font-extrabold tracking-[-.02em] text-brand sm:text-[24px]">
            {draft.total}
          </span>
        </div>
      )}

      {!draft.isReadyToConfirm && draft.missingFields.length > 0 && !isSaved && (
        <div className="px-4 pb-4">
          <StateBanner tone="warn" title="Data draf belum lengkap">
            Mohon lengkapi informasi berikut sebelum disimpan:{" "}
            <strong className="font-bold text-ink">{draft.missingFields.join(", ")}</strong>. Klik{" "}
            <strong className="font-bold text-ink">Koreksi</strong> untuk melengkapi melalui chat.
          </StateBanner>
        </div>
      )}

      {isSaved && (
        <div className="px-4 pb-4">
          <StateBanner tone="success" title="Tersimpan ke Master Transaksi (Sumber: AI)">
            <Link href="/dashboard/data" className="font-bold text-brand hover:underline">
              Lihat di Data Transaksi →
            </Link>
          </StateBanner>
        </div>
      )}

      {isError && (
        <div className="px-4 pb-4">
          <StateBanner title="Transaksi belum tersimpan" code="ERR-A202">
            {execution?.errorMessage ||
              "Terjadi gangguan saat menyimpan ke sistem pembukuan. Draf masih aman untuk dicoba ulang."}
          </StateBanner>
        </div>
      )}

      {draft.note && !isSaved && (
        <p className="px-5 pb-3 text-[11.5px] leading-snug text-faint">{draft.note}</p>
      )}

      {!isSaved && (
        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-line-soft bg-cream px-5 py-3.5">
          <Button
            variant="secondary"
            size="sm"
            disabled={isSaving}
            onClick={() => onCorrect(draft)}
          >
            {draft.correctLabel || "Koreksi"}
          </Button>
          <Button
            size="sm"
            icon="check"
            disabled={!canConfirm}
            onClick={() => onConfirm(draft)}
          >
            {isSaving
              ? "Menyimpan..."
              : isError
                ? "Coba Simpan Lagi"
                : draft.confirmLabel || "Simpan Draft"}
          </Button>
        </div>
      )}
    </div>
  );
}
