"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { customerApi } from "@/lib/customerApi";

const TECHNICAL_ERROR_PATTERN = /fetch|load failed|network|an error occurred|http error/i;

function resolveErrorMessage(cause: unknown, fallback: string): string {
  if (cause instanceof TypeError) return fallback;
  if (cause instanceof Error) {
    const message = cause.message.trim();
    if (message && !TECHNICAL_ERROR_PATTERN.test(message)) {
      return message;
    }
  }
  return fallback;
}

function PasswordVisibilityButton({
  shown,
  onClick,
  label,
}: {
  shown: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex size-9 items-center justify-center rounded-lg text-[#757682] transition hover:text-[#00236F]"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
        <circle cx="12" cy="12" r="3" />
        {shown && <path d="M4 4l16 16" />}
      </svg>
    </button>
  );
}

function CustomerResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";

  const [passwordBaru, setPasswordBaru] = useState("");
  const [konfirmasiPassword, setKonfirmasiPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) {
      setError("Token atur ulang password tidak ditemukan.");
      return;
    }
    if (passwordBaru.length < 8) {
      setError("Password baru minimal 8 karakter.");
      return;
    }
    if (passwordBaru !== konfirmasiPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    setBusy(true);
    setError("");
    try {
      const response = await customerApi.resetPassword(token, passwordBaru);
      setSuccessMessage(
        response.message || "Password berhasil diatur ulang. Silakan masuk dengan password baru Anda."
      );
      setPasswordBaru("");
      setKonfirmasiPassword("");
    } catch (cause) {
      setError(
        resolveErrorMessage(
          cause,
          "Tautan tidak valid atau sudah kedaluwarsa. Silakan minta tautan reset baru."
        )
      );
    } finally {
      setBusy(false);
    }
  }

  const inputClass =
    "c-field h-12 w-full rounded-xl border border-[#DAE2FD] bg-white px-4 pr-12 text-base text-[#131B2E] placeholder:text-[#757682] outline-none focus:border-[#0244FF] disabled:opacity-60 sm:text-sm";

  return (
    <div
      className="c-rise mx-auto max-w-[460px] rounded-3xl border bg-white p-6 shadow-sm sm:p-8"
      style={{ borderColor: "#E2E7FF" }}
    >
      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#0244FF" }}>
        Pemulihan Akun SOJU
      </p>
      <h1 className="mt-2 text-2xl font-bold" style={{ color: "#00236F" }}>
        Atur ulang password
      </h1>
      <p className="mt-2 text-sm leading-6" style={{ color: "#757682" }}>
        Buat password baru minimal 8 karakter untuk mengamankan akun customer SOJU Anda.
      </p>

      {!token ? (
        <div className="mt-6 space-y-4">
          <div role="alert" className="rounded-2xl bg-red-50 p-4 text-sm leading-6 text-red-700">
            Tautan atur ulang password tidak valid atau tidak lengkap. Silakan ajukan permintaan tautan baru.
          </div>
          <Link
            href="/customer/lupa-password"
            className="c-press inline-flex h-12 w-full items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ backgroundColor: "#0244FF" }}
          >
            Minta tautan reset baru
          </Link>
        </div>
      ) : successMessage ? (
        <div className="mt-6 space-y-5">
          <div
            role="status"
            aria-live="polite"
            className="rounded-2xl border border-[#82F5C1] bg-[#82F5C1]/20 p-4 text-sm leading-6 text-[#00236F]"
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#82F5C1] text-[#00236F]">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
              <div>
                <p className="font-bold text-[#00236F]">Password berhasil diperbarui</p>
                <p className="mt-1 text-[#00236F]/85">{successMessage}</p>
              </div>
            </div>
          </div>

          <Link
            href="/customer/akun"
            className="c-press inline-flex h-12 w-full items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ backgroundColor: "#00236F" }}
          >
            Masuk ke Akun
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4" noValidate>
          <div className="space-y-1.5">
            <label htmlFor="customer-new-password" className="block text-xs font-bold uppercase tracking-wider text-[#444651]">
              Password baru
            </label>
            <div className="relative">
              <input
                id="customer-new-password"
                name="passwordBaru"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                minLength={8}
                required
                disabled={busy}
                value={passwordBaru}
                onChange={(event) => {
                  setPasswordBaru(event.target.value);
                  if (error) setError("");
                }}
                placeholder="Minimal 8 karakter"
                className={inputClass}
              />
              <div className="absolute inset-y-0 right-2 flex items-center">
                <PasswordVisibilityButton
                  shown={showPassword}
                  onClick={() => setShowPassword((s) => !s)}
                  label={showPassword ? "Sembunyikan password baru" : "Tampilkan password baru"}
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="customer-confirm-password" className="block text-xs font-bold uppercase tracking-wider text-[#444651]">
              Konfirmasi password baru
            </label>
            <div className="relative">
              <input
                id="customer-confirm-password"
                name="konfirmasiPassword"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                minLength={8}
                required
                disabled={busy}
                value={konfirmasiPassword}
                onChange={(event) => {
                  setKonfirmasiPassword(event.target.value);
                  if (error) setError("");
                }}
                placeholder="Ulangi password baru"
                className={inputClass}
              />
              <div className="absolute inset-y-0 right-2 flex items-center">
                <PasswordVisibilityButton
                  shown={showConfirm}
                  onClick={() => setShowConfirm((s) => !s)}
                  label={showConfirm ? "Sembunyikan konfirmasi password" : "Tampilkan konfirmasi password"}
                />
              </div>
            </div>
          </div>

          {error && (
            <div role="alert" aria-live="polite" className="space-y-1.5 rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
              <p>{error}</p>
              <Link href="/customer/lupa-password" className="inline-block font-semibold text-[#00236F] underline underline-offset-4">
                Minta tautan reset baru
              </Link>
            </div>
          )}

          <button
            type="submit"
            disabled={busy || !passwordBaru || !konfirmasiPassword}
            className="c-press mt-1 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
            style={{ backgroundColor: "#0244FF" }}
          >
            {busy && (
              <span
                aria-hidden="true"
                className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
              />
            )}
            {busy ? "Menyimpan password…" : "Simpan Password Baru"}
          </button>
        </form>
      )}

      <div className="mt-6 border-t border-[#E2E7FF] pt-4 text-center">
        <Link
          href="/customer/akun"
          className="text-sm font-semibold text-[#00236F] underline-offset-4 hover:text-[#0244FF] hover:underline"
        >
          ← Kembali ke halaman akun
        </Link>
      </div>
    </div>
  );
}

export default function CustomerResetPasswordPage() {
  return (
    <section className="px-5 py-12 sm:py-16" style={{ backgroundColor: "#FAF8FF" }}>
      <Suspense
        fallback={
          <div
            className="mx-auto max-w-[460px] rounded-3xl border bg-white p-8 text-center text-sm shadow-sm"
            style={{ borderColor: "#E2E7FF", color: "#757682" }}
          >
            Memuat formulir atur ulang password…
          </div>
        }
      >
        <CustomerResetPasswordContent />
      </Suspense>
    </section>
  );
}
