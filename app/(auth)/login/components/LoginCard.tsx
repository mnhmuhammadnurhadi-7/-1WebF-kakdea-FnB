import Link from "next/link";
import { LoginField } from "./LoginField";

type LoginCardProps = {
  email: string;
  onEmail: (value: string) => void;
  password: string;
  onPassword: (value: string) => void;
  loading: boolean;
  error: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function LoginCard({ email, onEmail, password, onPassword, loading, error, onSubmit }: LoginCardProps) {
  return (
    <div className="rounded-3xl border border-line bg-white p-6 shadow-[0_24px_70px_rgba(16,40,95,.08)] sm:p-8">
      <p className="text-[11px] font-extrabold uppercase tracking-[.12em] text-brand">Ruang kerja SOJU</p>
      <h1 className="mt-2 text-[26px] font-extrabold tracking-[-.03em] text-ink">Selamat datang kembali</h1>
      <p className="mt-2 text-sm leading-6 text-label">Masuk untuk mengelola operasional Dapur Soju.</p>
      <form onSubmit={onSubmit} className="mt-7 space-y-5">
        <LoginField id="email" label="Email" type="email" value={email} onChange={onEmail} placeholder="nama@contoh.com" autoComplete="username" inputMode="email" invalid={Boolean(error)} disabled={loading} />
        <LoginField id="password" label="Kata sandi" type="password" value={password} onChange={onPassword} placeholder="Masukkan kata sandi" autoComplete="current-password" invalid={Boolean(error)} disabled={loading} />
        <div className="-mt-2 flex justify-end">
          <Link href="/forgot-password" className="text-xs font-semibold text-brand underline-offset-4 hover:underline">Lupa password?</Link>
        </div>
        {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={loading} className="h-12 w-full rounded-input bg-brand text-sm font-bold text-white shadow-blue transition hover:bg-[#00236F] disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? "Memproses…" : "Masuk"}
        </button>
      </form>
    </div>
  );
}
