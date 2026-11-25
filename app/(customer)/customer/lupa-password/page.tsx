"use client";

import { useState } from "react";
import Link from "next/link";
import { customerApi } from "@/lib/customerApi";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TECHNICAL_ERROR_PATTERN = /fetch|load failed|network|an error occurred|http error/i;
const GENERIC_CONFIRMATION =
  "Jika email terdaftar dan aktif, tautan atur ulang password telah dikirim ke email Anda. Periksa kotak masuk atau folder spam.";

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

export default function CustomerForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [submittedMessage, setSubmittedMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !EMAIL_PATTERN.test(trimmedEmail)) {
      setError("Masukkan alamat email yang valid.");
      return;
    }

    setBusy(true);
    setError("");
    try {
      const response = await customerApi.forgotPassword(trimmedEmail);
      setSubmittedMessage(response.message || GENERIC_CONFIRMATION);
    } catch (cause) {
      setError(
        resolveErrorMessage(
          cause,
          "Permintaan reset password belum dapat diproses. Silakan coba lagi."
        )
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="px-5 py-12 sm:py-16" style={{ backgroundColor: "#FAF8FF" }}>
      <div
        className="c-rise mx-auto max-w-[460px] rounded-3xl border bg-white p-6 shadow-sm sm:p-8"
        style={{ borderColor: "#E2E7FF" }}
      >
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#0244FF" }}>
          Pemulihan Akun SOJU
        </p>
        <h1 className="mt-2 text-2xl font-bold" style={{ color: "#00236F" }}>
          Lupa password?
        </h1>
        <p className="mt-2 text-sm leading-6" style={{ color: "#757682" }}>
          Masukkan email yang terdaftar pada akun customer Anda. Kami akan mengirimkan tautan untuk membuat password baru.
        </p>

        {submittedMessage ? (
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
                  <p className="font-bold text-[#00236F]">Permintaan terkirim</p>
                  <p className="mt-1 text-[#00236F]/85">{submittedMessage}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <Link
                href="/customer/akun"
                className="c-press inline-flex h-12 w-full items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: "#00236F" }}
              >
                Kembali ke halaman masuk
              </Link>
              <button
                type="button"
                onClick={() => {
                  setSubmittedMessage("");
                  setError("");
                }}
                className="c-press inline-flex h-11 w-full items-center justify-center rounded-full border border-[#DAE2FD] bg-[#FAF8FF] text-sm font-semibold text-[#00236F]"
              >
                Gunakan email lain
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4" noValidate>
            <div className="space-y-1.5">
              <label htmlFor="customer-email" className="block text-xs font-bold uppercase tracking-wider text-[#444651]">
                Email terdaftar
              </label>
              <input
                id="customer-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                disabled={busy}
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (error) setError("");
                }}
                placeholder="nama@email.com"
                className="c-field h-12 w-full rounded-xl border border-[#DAE2FD] bg-white px-4 text-base text-[#131B2E] placeholder:text-[#757682] outline-none focus:border-[#0244FF] disabled:opacity-60 sm:text-sm"
              />
            </div>

            {error && (
              <p role="alert" aria-live="polite" className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy || !email.trim()}
              className="c-press mt-1 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
              style={{ backgroundColor: "#0244FF" }}
            >
              {busy && (
                <span
                  aria-hidden="true"
                  className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                />
              )}
              {busy ? "Mengirim tautan…" : "Kirim Tautan Reset"}
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
    </section>
  );
}
