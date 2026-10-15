"use client";

interface NoticeProps { message: string; onDismiss: () => void; }

export function Notice({ message, onDismiss }: NoticeProps) {
  if (!message) return null;
  return <div role="alert" aria-live="assertive" className="notice-enter fixed inset-x-4 top-4 z-[70] mx-auto flex max-w-md items-start gap-3 rounded-2xl border border-danger/20 bg-card p-4 text-sm text-ink shadow-card-hover sm:left-auto sm:right-6 sm:top-6">
    <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-danger-bg text-danger" aria-hidden="true">!</span>
    <p className="flex-1 leading-5">{message}</p>
    <button type="button" onClick={onDismiss} aria-label="Tutup pesan" className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted transition-colors hover:bg-background hover:text-ink"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m18 6-12 12M6 6l12 12" /></svg></button>
  </div>;
}
