import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-5 py-12">
      <section className="page-enter w-full max-w-lg rounded-3xl border border-border bg-card p-7 text-center shadow-card sm:p-10">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-accent-tag font-heading text-2xl font-bold text-accent">404</div>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-accent">Halaman tidak ditemukan</p>
        <h1 className="mt-3 font-heading text-3xl font-semibold text-ink sm:text-4xl">Sepertinya Anda tersesat.</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted">Tautan ini mungkin sudah berubah atau alamat yang Anda masukkan keliru.</p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/customer" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-accent px-5 text-sm font-semibold text-white transition-colors hover:bg-accent/90">Kembali ke beranda</Link>
          <Link href="/login" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border px-5 text-sm font-semibold text-ink transition-colors hover:bg-background">Masuk ke dashboard</Link>
        </div>
      </section>
    </main>
  );
}
