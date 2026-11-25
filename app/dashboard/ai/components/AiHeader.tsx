import { Button } from "./Button";
import { Icon } from "./Icon";

type AiHeaderProps = {
  isSuperAdmin: boolean;
  isReindexing: boolean;
  conversationCount: number;
  onReindex: () => void;
  onOpenUploadModal: () => void;
  onToggleHistory: () => void;
};

export function AiHeader({
  isSuperAdmin,
  isReindexing,
  conversationCount,
  onReindex,
  onOpenUploadModal,
  onToggleHistory,
}: AiHeaderProps) {
  return (
    <section className="flex shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-2">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-[28px] font-bold leading-[1.15] tracking-[-.03em] sm:text-[32px]">
            Asisten AI
          </h1>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-ok-tint px-3 py-1 text-[11px] font-extrabold uppercase tracking-[.08em] text-ok-text">
            <span className="size-1.5 rounded-full bg-ok" />
            Hybrid RAG Aktif
          </span>
        </div>
        <p className="text-[13.5px] text-body">
          Tanya data operasional, SOP &amp; produk, atau ketik{" "}
          <span className="rounded-md bg-sky-tint px-1.5 py-0.5 font-mono text-[12.5px] font-bold text-navy">
            /add
          </span>{" "}
          untuk membuat draf transaksi.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onToggleHistory}
          className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-white px-3 text-[12.5px] font-bold text-ink shadow-btn transition hover:bg-app lg:hidden"
        >
          <Icon name="history" size={15} stroke={2.1} />
          Riwayat
          {conversationCount > 0 && (
            <span className="rounded-full bg-sky-tint px-1.5 py-0.5 text-[10.5px] font-extrabold text-navy">
              {conversationCount}
            </span>
          )}
        </button>

        {isSuperAdmin && (
          <>
            <Button
              size="sm"
              variant="secondary"
              icon="upload"
              onClick={onOpenUploadModal}
              disabled={isReindexing}
            >
              Unggah Dokumen
            </Button>
            <Button
              size="sm"
              variant="outline"
              icon="refresh"
              onClick={onReindex}
              disabled={isReindexing}
            >
              {isReindexing ? "Mengindeks Ulang..." : "Reindex Pengetahuan"}
            </Button>
          </>
        )}
      </div>
    </section>
  );
}
