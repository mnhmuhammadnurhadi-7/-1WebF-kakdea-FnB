import Link from "next/link";
import { useState } from "react";
import { LoginField } from "./LoginField";

type LoginCardProps = {
  email: string;
  onEmail: (v: string) => void;
  password: string;
  onPassword: (v: string) => void;
  loading: boolean;
  error: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export function LoginCard({ email, onEmail, password, onPassword, loading, error, onSubmit }: LoginCardProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full rounded-[34px] bg-white/65 p-4 shadow-[0_18px_48px_rgba(25,39,68,.08)]">
      <div className="rounded-[24px] border border-white bg-white px-6 py-6 shadow-[0_6px_18px_rgba(25,39,68,.05)] sm:px-7 sm:py-7">
        <div className="mb-6">
          <p className="text-[11px] font-extrabold uppercase tracking-[.14em] text-brand">Otentikasi admin</p>
          <h2 className="mt-2 text-[24px] font-bold leading-tight tracking-[-.03em] text-ink">Masuk ke panel SOJU</h2>
          <p className="mt-1 text-[13px] text-body">Gunakan email dan kata sandi admin Anda.</p>
        </div>

        <form className="space-y-5" onSubmit={onSubmit}>
          {error && (
            <div role="alert" aria-live="polite" className="flex gap-3 rounded-xl border border-bad/15 bg-bad-tint px-4 py-3 text-[13px] leading-5 text-bad-text">
              <svg className="mt-0.5 shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" /></svg>
              {error}
            </div>
          )}

          <LoginField id="email" label="Email" type="email" autoComplete="username" inputMode="email" value={email} onChange={onEmail} invalid={!!error} placeholder="nama@email.com" />
          <LoginField
            id="password"
            label="Kata sandi"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={onPassword}
            invalid={!!error}
            placeholder="Masukkan kata sandi"
            trailing={
              <button type="button" onClick={() => setShowPassword((s) => !s)} aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"} className="flex size-9 items-center justify-center rounded-lg text-faint transition hover:text-ink">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
                  <circle cx="12" cy="12" r="3" />
                  {showPassword && <path d="M4 4l16 16" />}
                </svg>
              </button>
            }
          />

          <button
            type="submit"
            disabled={loading || !email.trim() || !password}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 text-[14px] font-bold text-white shadow-[0_8px_18px_rgba(25,105,255,.2)] transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
            {loading ? "Memeriksa akun…" : "Masuk ke Panel SOJU →"}
          </button>
        </form>

        <div className="mt-6 border-t border-line-soft pt-4 text-center">
          <Link href="/customer" className="inline-flex min-h-10 items-center justify-center rounded-lg px-3 text-[13px] font-semibold text-faint transition hover:text-ink">← Kembali ke halaman pelanggan</Link>
        </div>
      </div>
    </div>
  );
}
