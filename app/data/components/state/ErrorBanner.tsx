import { Icon } from "../shared/Icon";

type ErrorBannerProps = { title?: string; description?: string; onRetry?: () => void };

export function ErrorBanner({
  title = "Data belum berhasil dimuat",
  description = "Periksa koneksi Anda lalu coba lagi.",
  onRetry,
}: ErrorBannerProps) {
  return (
    <div role="alert" className="flex flex-wrap items-center gap-4 rounded-card border border-bad/15 bg-bad-tint px-5 py-4">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-bad" aria-hidden="true">
        <Icon name="warn" size={20} />
      </span>
      <div className="min-w-0 flex-1">
        <h2 className="text-[14.5px] font-bold text-ink">{title}</h2>
        <p className="text-[13px] text-body">{description}</p>
      </div>
      {onRetry && (
        <button type="button" onClick={onRetry} className="h-10 rounded-xl bg-white px-4 text-[13px] font-bold text-ink shadow-btn transition hover:bg-app">
          Coba lagi
        </button>
      )}
    </div>
  );
}
