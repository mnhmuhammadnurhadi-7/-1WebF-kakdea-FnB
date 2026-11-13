"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import { BrandPanel } from "./BrandPanel";
import { LoginCard } from "./LoginCard";

/** Logic login (kirim email & sandi, pesan kesalahan, arahkan ke dashboard) dari kode teman; tampilannya memakai komponen di atas. */
export function LoginView() {
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
    <main className="page-enter grid min-h-screen bg-cream lg:grid-cols-[minmax(0,1.04fr)_minmax(420px,.96fr)]" style={{ fontFamily: "var(--font-plus-jakarta), system-ui, sans-serif" }}>
      <BrandPanel />

      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cream px-5 py-10 sm:px-8">
        <svg aria-hidden="true" viewBox="0 0 64 64" className="pointer-events-none absolute left-[7%] top-7 hidden size-14 text-[#E4E1DA] lg:block">
          <path d="M12 25h40l-3 23a6 6 0 0 1-6 5H21a6 6 0 0 1-6-5l-3-23Z" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <path d="M22 18c0-3 2-3 2-6m8 6c0-3 2-3 2-6m8 6c0-3 2-3 2-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" />
        </svg>
        <svg aria-hidden="true" viewBox="0 0 64 64" className="pointer-events-none absolute right-[7%] top-8 hidden size-14 text-[#E4E1DA] lg:block">
          <path d="M12 36c9-16 24-21 39-16-2 7-5 12-10 15l8 9-5 5-10-8c-5 3-11 3-18 1l-4 5-5-5 5-6Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2.5" />
          <circle cx="41" cy="27" r="1.5" fill="currentColor" />
        </svg>
        <span aria-hidden="true" className="pointer-events-none absolute -bottom-[.12em] right-2 hidden select-none text-[clamp(8rem,16vw,13rem)] font-black leading-none tracking-[-.08em] text-[#173675]/[.045] lg:block">
          SOJU
        </span>
        <div className="relative z-10 w-full max-w-[390px]">
          <Link href="/customer" className="mb-7 inline-flex items-center gap-3 rounded-xl lg:hidden">
            <Image src="/soju.png" alt="" width={40} height={40} loading="eager" className="size-10 shrink-0 rounded-full object-cover shadow-blue" />
            <span className="leading-tight">
              <span className="block text-[18px] font-extrabold text-ink">SOJU</span>
              <span className="block text-[10px] font-semibold tracking-[.08em] text-brand">KULINER &amp; FROZEN FOOD</span>
            </span>
          </Link>
          <LoginCard email={email} onEmail={setEmail} password={password} onPassword={setPassword} loading={loading} error={error} onSubmit={handleLogin} />
        </div>
      </section>
    </main>
  );
}
