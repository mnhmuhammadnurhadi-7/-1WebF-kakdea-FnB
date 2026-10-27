"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-5 py-12">
      <section role="alert" className="page-enter w-full max-w-lg rounded-3xl border border-border bg-card p-7 text-center shadow-card sm:p-10">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-danger-bg text-danger" aria-hidden="true">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10.3 3.9 2.5 17.4A2 2 0 0 0 4.2 20h15.6a2 2 0 0 0 1.7-2.6L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4m0 3h.01"/></svg>
        </div>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-danger">Terjadi kendala</p>
        <h1 className="mt-3 font-heading text-3xl font-semibold text-ink">Halaman belum bisa dibuka.</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted">Coba muat ulang halaman. Jika kendala berlanjut, kembali ke beranda dan coba lagi beberapa saat.</p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" onClick={reset} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-accent px-5 text-sm font-semibold text-white transition-colors hover:bg-accent/90">Coba lagi</button>
          <a href="/customer" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border px-5 text-sm font-semibold text-ink transition-colors hover:bg-background">Kembali ke beranda</a>
        </div>
      </section>
    </main>
  );
}
