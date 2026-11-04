"use client";

import { useState } from "react";
import Link from "next/link";
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
    <main className="page-enter grid min-h-screen bg-cream lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,1fr)]" style={{ fontFamily: "var(--font-plus-jakarta), system-ui, sans-serif" }}>
      <BrandPanel />

      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10 sm:px-8">
        <span aria-hidden="true" className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 select-none text-[240px] font-black leading-none tracking-[-.05em] text-black/[.04]">SOJU</span>
        <div className="relative w-full max-w-[440px]">
          <Link href="/customer" className="mb-8 inline-flex items-center gap-3 rounded-xl lg:hidden">
            <span className="flex size-10 items-center justify-center rounded-xl bg-brand text-[18px] font-extrabold text-white shadow-blue">S</span>
            <span className="text-[18px] font-extrabold text-ink">SOJU</span>
          </Link>
          <LoginCard email={email} onEmail={setEmail} password={password} onPassword={setPassword} loading={loading} error={error} onSubmit={handleLogin} />
        </div>
      </section>
    </main>
  );
}
