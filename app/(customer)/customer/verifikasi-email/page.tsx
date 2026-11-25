"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { customerApi } from "@/lib/customerApi";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TECHNICAL_ERROR_PATTERN = /fetch|load failed|network|an error occurred|http error/i;
const GENERIC_RESEND_MESSAGE =
  "Jika email terdaftar dan belum terverifikasi, tautan verifikasi baru telah dikirim ke email Anda.";

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

type VerifyStatus = "idle" | "verifying" | "verified" | "error";
type VerifyEmailResponse = Awaited<ReturnType<typeof customerApi.verifyEmail>>;
type VerifyResult = {
  token: string;
  status: "verified" | "error";
  message: string;
  email: string;
};

function CustomerVerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";
  const inFlightRef = useRef<{ token: string; promise: Promise<VerifyEmailResponse> } | null>(null);

  const [verifyResult, setVerifyResult] = useState<VerifyResult | null>(null);

  const [email, setEmail] = useState("");
  const [resending, setResending] = useState(false);
  const [resendError, setResendError] = useState("");
  const [resendMessage, setResendMessage] = useState("");

  const verifyStatus: VerifyStatus = !token
    ? "idle"
    : verifyResult?.token === token
      ? verifyResult.status
      : "verifying";
  const verifyMessage = verifyResult?.token === token ? verifyResult.message : "";
  const verifiedEmail = verifyResult?.token === token ? verifyResult.email : "";

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    if (!inFlightRef.current || inFlightRef.current.token !== token) {
      inFlightRef.current = {
        token,
        promise: customerApi.verifyEmail(token),
      };
    }

    inFlightRef.current.promise
      .then((response) => {
        if (cancelled) return;
        setVerifyResult({
          token,
          status: "verified",
          email: response.data?.email || "",
          message: response.message || "Email Anda berhasil diverifikasi.",
        });
      })
      .catch((cause) => {
        if (cancelled) return;
        setVerifyResult({
          token,
          status: "error",
          email: "",
          message: resolveErrorMessage(
            cause,
            "Tautan verifikasi tidak valid atau sudah kedaluwarsa. Anda dapat mengirim ulang email verifikasi di bawah ini."
          ),
        });
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  async function handleResend(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !EMAIL_PATTERN.test(trimmedEmail)) {
      setResendError("Masukkan alamat email yang valid.");
      return;
    }

    setResending(true);
    setResendError("");
    setResendMessage("");
    try {
      const response = await customerApi.resendVerification(trimmedEmail);
      setResendMessage(response.message || GENERIC_RESEND_MESSAGE);
    } catch (cause) {
      setResendError(
        resolveErrorMessage(
          cause,
          "Pengiriman ulang email verifikasi belum berhasil. Silakan coba lagi."
        )
      );
    } finally {
      setResending(false);
    }
  }

  return (
    <div
      className="c-rise mx-auto max-w-[460px] rounded-3xl border bg-white p-6 shadow-sm sm:p-8"
      style={{ borderColor: "#E2E7FF" }}
    >
      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#0244FF" }}>
        Verifikasi Akun SOJU
      </p>
      <h1 className="mt-2 text-2xl font-bold" style={{ color: "#00236F" }}>
        Verifikasi email
      </h1>

      {verifyStatus === "verifying" && (
        <div role="status" aria-live="polite" className="mt-6 flex flex-col items-center gap-3 rounded-2xl bg-[#FAF8FF] p-6 text-center">
          <span
            aria-hidden="true"
            className="size-8 animate-spin rounded-full border-[3px] border-[#0244FF]/25 border-t-[#0244FF]"
          />
          <p className="text-sm font-semibold text-[#00236F]">Memverifikasi alamat email Anda…</p>
          <p className="text-xs text-[#757682]">Mohon tunggu sebentar.</p>
        </div>
      )}

      {verifyStatus === "verified" && (
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
                <p className="font-bold text-[#00236F]">Email berhasil diverifikasi</p>
                <p className="mt-1 text-[#00236F]/85">{verifyMessage}</p>
                {verifiedEmail && (
                  <p className="mt-1 text-xs font-semibold text-[#00236F]">{verifiedEmail}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <Link
              href="/customer/akun"
              className="c-press inline-flex h-12 w-full items-center justify-center rounded-full text-sm font-bold text-white"
              style={{ backgroundColor: "#00236F" }}
            >
              Masuk ke Akun
            </Link>
            <Link
              href="/dashboard-customer/profil"
              className="c-press inline-flex h-11 w-full items-center justify-center rounded-full border border-[#DAE2FD] bg-[#FAF8FF] text-sm font-semibold text-[#00236F]"
            >
              Buka Profil Customer
            </Link>
          </div>
        </div>
      )}

      {verifyStatus === "error" && (
        <div role="alert" aria-live="polite" className="mt-5 rounded-2xl bg-red-50 p-4 text-sm leading-6 text-red-700">
          <p className="font-semibold">Verifikasi email gagal</p>
          <p className="mt-1">{verifyMessage}</p>
        </div>
      )}

      {(verifyStatus === "idle" || verifyStatus === "error") && (
        <div className="mt-5">
          <p className="text-sm leading-6" style={{ color: "#757682" }}>
            Belum menerima email verifikasi atau tautan sudah kedaluwarsa? Masukkan email akun Anda untuk mengirim ulang tautan verifikasi.
          </p>

          {resendMessage ? (
            <div
              role="status"
              aria-live="polite"
              className="mt-5 space-y-4 rounded-2xl border border-[#82F5C1] bg-[#82F5C1]/20 p-4 text-sm leading-6 text-[#00236F]"
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
                  <p className="mt-1 text-[#00236F]/85">{resendMessage}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setResendMessage("");
                  setResendError("");
                }}
                className="c-press inline-flex h-10 w-full items-center justify-center rounded-full border border-[#00236F]/20 bg-white text-xs font-bold text-[#00236F]"
              >
                Kirim ulang ke email lain
              </button>
            </div>
          ) : (
            <form onSubmit={handleResend} className="mt-5 flex flex-col gap-4" noValidate>
              <div className="space-y-1.5">
                <label htmlFor="verify-email" className="block text-xs font-bold uppercase tracking-wider text-[#444651]">
                  Email akun
                </label>
                <input
                  id="verify-email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  disabled={resending}
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (resendError) setResendError("");
                  }}
                  placeholder="nama@email.com"
                  className="c-field h-12 w-full rounded-xl border border-[#DAE2FD] bg-white px-4 text-base text-[#131B2E] placeholder:text-[#757682] outline-none focus:border-[#0244FF] disabled:opacity-60 sm:text-sm"
                />
              </div>

              {resendError && (
                <p role="alert" aria-live="polite" className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
                  {resendError}
                </p>
              )}

              <button
                type="submit"
                disabled={resending || !email.trim()}
                className="c-press inline-flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
                style={{ backgroundColor: "#0244FF" }}
              >
                {resending && (
                  <span
                    aria-hidden="true"
                    className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                  />
                )}
                {resending ? "Mengirim ulang…" : "Kirim Ulang Email Verifikasi"}
              </button>
            </form>
          )}
        </div>
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

export default function CustomerVerifyEmailPage() {
  return (
    <section className="px-5 py-12 sm:py-16" style={{ backgroundColor: "#FAF8FF" }}>
      <Suspense
        fallback={
          <div
            className="mx-auto max-w-[460px] rounded-3xl border bg-white p-8 text-center text-sm shadow-sm"
            style={{ borderColor: "#E2E7FF", color: "#757682" }}
          >
            Memuat halaman verifikasi email…
          </div>
        }
      >
        <CustomerVerifyEmailContent />
      </Suspense>
    </section>
  );
}
