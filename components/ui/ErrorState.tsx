"use client";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({ title = "Data belum berhasil dimuat", description = "Periksa koneksi Anda lalu coba lagi.", onRetry }: ErrorStateProps) {
  return <div role="alert" className="page-enter flex flex-col items-center justify-center gap-3 rounded-2xl border border-danger/15 bg-danger-bg/50 px-5 py-10 text-center">
    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-danger-bg text-danger" aria-hidden="true">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v4m0 4h.01"/></svg>
    </span>
    <h2 className="font-heading text-lg font-semibold text-ink">{title}</h2>
    <p className="max-w-sm text-sm leading-6 text-muted">{description}</p>
    {onRetry && <button type="button" onClick={onRetry} className="mt-1 inline-flex min-h-10 items-center justify-center rounded-xl border border-border bg-card px-4 text-sm font-semibold text-ink transition hover:bg-background">Coba lagi</button>}
  </div>;
}
