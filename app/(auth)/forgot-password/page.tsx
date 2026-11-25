"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { authApi } from "@/lib/api";
import { BrandPanel } from "../login/components/BrandPanel";
import { LoginField } from "../login/components/LoginField";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TECHNICAL_ERROR_PATTERN = /fetch|load failed|network|an error occurred|http error/i;
const GENERIC_CONFIRMATION =
  "Jika email terdaftar dan aktif, tautan atur ulang kata sandi telah dikirim ke email Anda. Silakan periksa kotak masuk atau folder spam.";

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

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submittedMessage, setSubmittedMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !EMAIL_PATTERN.test(trimmedEmail)) {
      setError("Masukkan alamat email admin yang valid.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await authApi.forgotPassword(trimmedEmail);
      setSubmittedMessage(response.message || GENERIC_CONFIRMATION);
    } catch (err: unknown) {
      setError(
        resolveErrorMessage(
          err,
          "Permintaan belum dapat diproses. Silakan coba lagi beberapa saat."
        )
      );
    } finally {
      setLoading(false);
    }
  };

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

          <div className="w-full rounded-[34px] bg-white/75 p-4 shadow-[0_18px_48px_rgba(0,35,111,.08)]">
            <div className="rounded-[24px] border border-[#E2E7FF] bg-white px-6 py-6 shadow-[0_6px_18px_rgba(0,35,111,.05)] sm:px-7 sm:py-7">
              <div className="mb-6">
                <p className="text-[11px] font-extrabold uppercase tracking-[.14em] text-[#0244FF]">
                  Pemulihan akun admin
                </p>
                <h1 className="mt-2 text-[24px] font-bold leading-tight tracking-[-.03em] text-[#00236F]">
                  Lupa kata sandi?
                </h1>
                <p className="mt-1.5 text-[13px] leading-5 text-body">
                  Masukkan email akun admin Anda. Kami akan mengirimkan tautan untuk mengatur ulang kata sandi.
                </p>
              </div>

              {submittedMessage ? (
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
                        <p className="font-bold text-[#00236F]">Permintaan terkirim</p>
                        <p className="text-[#00236F]/85">{submittedMessage}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    <Link
                      href="/login"
                      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0244FF] px-5 text-[14px] font-bold text-white shadow-[0_8px_18px_rgba(2,68,255,.22)] transition-colors hover:bg-[#00236F]"
                    >
                      Kembali ke halaman masuk
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmittedMessage("");
                        setError("");
                      }}
                      className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-[#E2E7FF] bg-[#FAF8FF] px-4 text-[13px] font-semibold text-[#00236F] transition-colors hover:bg-[#F2F3FF]"
                    >
                      Kirim ulang ke email lain
                    </button>
                  </div>
                </div>
              ) : (
                <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                  {error && (
                    <div
                      role="alert"
                      aria-live="polite"
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
                      <span>{error}</span>
                    </div>
                  )}

                  <LoginField
                    id="email"
                    label="Email admin"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    value={email}
                    onChange={(v) => {
                      setEmail(v);
                      if (error) setError("");
                    }}
                    invalid={!!error}
                    disabled={loading}
                    placeholder="admin@soju.id"
                  />

                  <button
                    type="submit"
                    disabled={loading || !email.trim()}
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0244FF] px-5 text-[14px] font-bold text-white shadow-[0_8px_18px_rgba(2,68,255,.22)] transition-colors hover:bg-[#00236F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0244FF] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading && (
                      <span
                        aria-hidden="true"
                        className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                      />
                    )}
                    {loading ? "Mengirim tautan…" : "Kirim tautan reset →"}
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
        </div>
      </section>
    </main>
  );
}
