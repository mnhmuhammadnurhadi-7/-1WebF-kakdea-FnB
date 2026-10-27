"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await authApi.login(email.trim(), password);
      if (response.success) router.push("/dashboard");
      else setError("Email atau kata sandi belum cocok. Periksa kembali lalu coba lagi.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login belum berhasil. Silakan coba lagi.";
      setError(/401|unauthorized|invalid|password|email/i.test(message)
        ? "Email atau kata sandi belum cocok. Periksa kembali lalu coba lagi."
        : "Layanan sedang sulit dijangkau. Periksa koneksi internet Anda lalu coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-enter grid min-h-screen bg-background lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.8fr)]">
      <section className="relative hidden overflow-hidden bg-sidebar-bg p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
        <div aria-hidden="true" className="absolute -right-28 -top-28 h-96 w-96 rounded-full border border-white/10" />
        <div aria-hidden="true" className="absolute -bottom-48 -left-20 h-[34rem] w-[34rem] rounded-full border border-white/10" />
        <Link href="/customer" className="relative inline-flex w-fit items-center gap-3 rounded-xl focus-visible:outline-white">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent font-heading text-lg font-black">BD</span>
          <span><span className="block font-heading text-lg font-semibold">Buku Dapur</span><span className="block text-xs text-teal-soft">Frozen &amp; Siap Saji</span></span>
        </Link>
        <div className="relative max-w-xl pb-10">
          <span className="mb-5 inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-teal-soft">Satu ruang untuk usaha Anda</span>
          <h1 className="font-heading text-5xl font-semibold leading-[1.12] xl:text-6xl">Kelola usaha dengan lebih tenang.</h1>
          <p className="mt-5 max-w-md text-base leading-7 text-teal-soft">Pantau transaksi, catatan, dan aktivitas usaha dalam satu dashboard yang mudah dipahami.</p>
        </div>
        <p className="relative text-xs text-teal-soft/80">SOJU · Buku Dapur</p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <Link href="/customer" className="mb-10 inline-flex items-center gap-3 rounded-xl lg:hidden">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent font-heading font-black text-white">BD</span>
            <span className="font-heading text-lg font-semibold text-ink">Buku Dapur</span>
          </Link>
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Dashboard usaha</p>
            <h2 className="mt-3 font-heading text-3xl font-semibold text-ink sm:text-4xl">Selamat datang kembali</h2>
            <p className="mt-2 text-sm leading-6 text-muted">Masuk dengan akun Anda untuk melanjutkan.</p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            {error && <div role="alert" aria-live="polite" className="flex gap-3 rounded-xl border border-danger/20 bg-danger-bg px-4 py-3 text-sm leading-5 text-danger">
              <svg className="mt-0.5 shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></svg>{error}
            </div>}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-ink">Email</label>
              <input id="email" name="email" type="email" autoComplete="username" inputMode="email" required value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!error} className="min-h-12 w-full rounded-xl border border-border bg-card px-4 text-sm text-ink placeholder:text-muted-light transition focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10" placeholder="nama@email.com" />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-ink">Kata sandi</label>
              <input id="password" name="password" type="password" autoComplete="current-password" required minLength={1} value={password} onChange={(e) => setPassword(e.target.value)} aria-invalid={!!error} className="min-h-12 w-full rounded-xl border border-border bg-card px-4 text-sm text-ink placeholder:text-muted-light transition focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10" placeholder="Masukkan kata sandi" />
            </div>
            <button type="submit" disabled={loading || !email.trim() || !password} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 text-sm font-semibold text-white shadow-fab transition hover:bg-accent/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60">
              {loading && <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
              {loading ? "Memeriksa akun…" : "Masuk ke dashboard"}
            </button>
          </form>
          <div className="mt-8 border-t border-border pt-6 text-center">
            <Link href="/customer" className="inline-flex min-h-11 items-center justify-center rounded-lg px-3 text-sm font-medium text-muted transition hover:text-ink">← Kembali ke halaman pelanggan</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
