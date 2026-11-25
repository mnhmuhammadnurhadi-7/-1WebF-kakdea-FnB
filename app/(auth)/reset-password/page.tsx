"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { authApi } from "@/lib/api";
import { BrandPanel } from "../login/components/BrandPanel";
import { LoginField } from "../login/components/LoginField";

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

function EyeToggle({
  shown,
  onToggle,
  label,
}: {
  shown: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={label}
      className="flex size-9 items-center justify-center rounded-lg text-faint transition hover:text-[#00236F]"
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

function AdminResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";
  const isInvite = searchParams.get("purpose") === "invite";

  const [passwordBaru, setPasswordBaru] = useState("");
  const [konfirmasiPassword, setKonfirmasiPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      setError("Token atur ulang kata sandi tidak ditemukan.");
      return;
    }
    if (passwordBaru.length < 8) {
      setError("Kata sandi baru minimal 8 karakter.");
      return;
    }
    if (passwordBaru !== konfirmasiPassword) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await authApi.resetPassword(token, passwordBaru);
      setSuccessMessage(
        response.message ||
          "Kata sandi berhasil diperbarui. Silakan masuk menggunakan kata sandi baru Anda."
      );
      setPasswordBaru("");
      setKonfirmasiPassword("");
    } catch (err: unknown) {
      setError(
        resolveErrorMessage(
          err,
          "Tautan tidak valid atau sudah kedaluwarsa. Silakan minta tautan reset baru."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full rounded-[34px] bg-white/75 p-4 shadow-[0_18px_48px_rgba(0,35,111,.08)]">
      <div className="rounded-[24px] border border-[#E2E7FF] bg-white px-6 py-6 shadow-[0_6px_18px_rgba(0,35,111,.05)] sm:px-7 sm:py-7">
        <div className="mb-6">
          <p className="text-[11px] font-extrabold uppercase tracking-[.14em] text-[#0244FF]">
            {isInvite ? "Aktivasi akun admin" : "Pemulihan akun admin"}
          </p>
          <h1 className="mt-2 text-[24px] font-bold leading-tight tracking-[-.03em] text-[#00236F]">
            {isInvite ? "Buat kata sandi baru" : "Atur ulang kata sandi"}
          </h1>
          <p className="mt-1.5 text-[13px] leading-5 text-body">
            {isInvite
              ? "Tentukan kata sandi baru minimal 8 karakter untuk mulai menggunakan panel admin SOJU."
              : "Masukkan kata sandi baru minimal 8 karakter untuk akun admin Anda."}
          </p>
        </div>

        {!token ? (
          <div className="space-y-5">
            <div
              role="alert"
              className="flex gap-3 rounded-xl border border-bad/15 bg-bad-tint px-4 py-3 text-[13px] leading-5 text-bad-text"
            >
              <svg
                className="mt-0.5 shrink-0"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4m0 4h.01" />
              </svg>
              <span>
                Tautan atur ulang kata sandi tidak valid atau tidak lengkap. Silakan ajukan permintaan tautan baru.
              </span>
            </div>

            <Link
              href="/forgot-password"
              className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#0244FF] px-5 text-[14px] font-bold text-white shadow-[0_8px_18px_rgba(2,68,255,.22)] transition-colors hover:bg-[#00236F]"
            >
              Minta tautan reset baru
            </Link>
          </div>
        ) : successMessage ? (
          <div className="space-y-5">
            <div
              role="status"
              aria-live="polite"
              className="rounded-2xl border border-[#82F5C1] bg-[#82F5C1]/20 p-4 text-[13px] leading-5 text-[#00236F]"
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
                <div className="space-y-1">
                  <p className="font-bold text-[#00236F]">Kata sandi berhasil diperbarui</p>
                  <p className="text-[#00236F]/85">{successMessage}</p>
                </div>
              </div>
            </div>

            <Link
              href="/login"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0244FF] px-5 text-[14px] font-bold text-white shadow-[0_8px_18px_rgba(2,68,255,.22)] transition-colors hover:bg-[#00236F]"
            >
              Masuk ke Panel SOJU →
            </Link>
          </div>
        ) : (
          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            {error && (
              <div
                role="alert"
                aria-live="polite"
                className="space-y-2 rounded-xl border border-bad/15 bg-bad-tint px-4 py-3 text-[13px] leading-5 text-bad-text"
              >
                <div className="flex gap-3">
                  <svg
                    className="mt-0.5 shrink-0"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4m0 4h.01" />
                  </svg>
                  <span>{error}</span>
                </div>
                <div className="pl-7">
                  <Link
                    href="/forgot-password"
                    className="font-semibold text-[#00236F] underline underline-offset-4"
                  >
                    Minta tautan reset baru
                  </Link>
                </div>
              </div>
            )}

            <LoginField
              id="passwordBaru"
              label="Kata sandi baru"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              minLength={8}
              value={passwordBaru}
              onChange={(v) => {
                setPasswordBaru(v);
                if (error) setError("");
              }}
              invalid={!!error}
              disabled={loading}
              placeholder="Minimal 8 karakter"
              trailing={
                <EyeToggle
                  shown={showPassword}
                  onToggle={() => setShowPassword((s) => !s)}
                  label={showPassword ? "Sembunyikan kata sandi baru" : "Tampilkan kata sandi baru"}
                />
              }
            />

            <LoginField
              id="konfirmasiPassword"
              label="Konfirmasi kata sandi"
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              minLength={8}
              value={konfirmasiPassword}
              onChange={(v) => {
                setKonfirmasiPassword(v);
                if (error) setError("");
              }}
              invalid={!!error}
              disabled={loading}
              placeholder="Ulangi kata sandi baru"
              trailing={
                <EyeToggle
                  shown={showConfirm}
                  onToggle={() => setShowConfirm((s) => !s)}
                  label={
                    showConfirm
                      ? "Sembunyikan konfirmasi kata sandi"
                      : "Tampilkan konfirmasi kata sandi"
                  }
                />
              }
            />

            <button
              type="submit"
              disabled={loading || !passwordBaru || !konfirmasiPassword}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0244FF] px-5 text-[14px] font-bold text-white shadow-[0_8px_18px_rgba(2,68,255,.22)] transition-colors hover:bg-[#00236F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0244FF] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && (
                <span
                  aria-hidden="true"
                  className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                />
              )}
              {loading ? "Menyimpan kata sandi…" : "Simpan kata sandi baru →"}
            </button>
          </form>
        )}

        <div className="mt-6 border-t border-line-soft pt-4 text-center">
          <Link
            href="/login"
            className="inline-flex min-h-10 items-center justify-center rounded-lg px-3 text-[13px] font-semibold text-faint transition hover:text-[#00236F]"
          >
            ← Kembali ke halaman masuk
          </Link>
        </div>
      </div>
    </div>
  );
}

function ResetPasswordFallback() {
  return (
    <div className="w-full rounded-[34px] bg-white/75 p-4 shadow-[0_18px_48px_rgba(0,35,111,.08)]">
      <div className="rounded-[24px] border border-[#E2E7FF] bg-white px-6 py-8 text-center text-[14px] text-body">
        Memuat formulir atur ulang kata sandi…
      </div>
    </div>
  );
}

export default function AdminResetPasswordPage() {
  return (
    <main
      className="page-enter grid min-h-screen bg-[#FAF8FF] lg:grid-cols-[minmax(0,1.04fr)_minmax(420px,.96fr)]"
      style={{ fontFamily: "var(--font-plus-jakarta), 'Plus Jakarta Sans', system-ui, sans-serif" }}
    >
      <BrandPanel />

      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FAF8FF] px-5 py-10 sm:px-8">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-[.12em] right-2 hidden select-none text-[clamp(8rem,16vw,13rem)] font-black leading-none tracking-[-.08em] text-[#00236F]/[.045] lg:block"
        >
          SOJU
        </span>

        <div className="relative z-10 w-full max-w-[400px]">
          <Link href="/customer" className="mb-7 inline-flex items-center gap-3 rounded-xl lg:hidden">
            <Image
              src="/soju.png"
              alt=""
              width={40}
              height={40}
              loading="eager"
              className="size-10 shrink-0 rounded-full object-cover shadow-blue"
            />
            <span className="leading-tight">
              <span className="block text-[18px] font-extrabold text-[#00236F]">SOJU</span>
              <span className="block text-[10px] font-semibold tracking-[.08em] text-[#0244FF]">
                KULINER &amp; FROZEN FOOD
              </span>
            </span>
          </Link>

          <Suspense fallback={<ResetPasswordFallback />}>
            <AdminResetPasswordContent />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
