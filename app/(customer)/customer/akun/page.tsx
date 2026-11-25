"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { customerApi } from "@/lib/customerApi";
import { useCart } from "@/components/customer/CartContext";

function resolveNextPath(): string {
  if (typeof window === "undefined") return "/dashboard-customer/profil";
  const target = new URLSearchParams(window.location.search).get("next");
  if (target?.startsWith("/dashboard-customer/") || target === "/dashboard-customer") {
    return target;
  }
  if (target?.startsWith("/customer/") && target !== "/customer/akun") {
    return target;
  }
  return "/dashboard-customer/profil";
}

export default function CustomerAccountPage() {
  const router = useRouter();
  const cart = useCart();
  const [mode, setMode] = useState<"masuk" | "daftar">("masuk");
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [noTelepon, setNoTelepon] = useState("");
  const [alamat, setAlamat] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "daftar") await customerApi.register({ nama, email, noTelepon, alamat, password });
      else await customerApi.login(email, password);
      await cart.mergeCustomerCart();
      router.replace(resolveNextPath());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Akun belum dapat diproses.");
    } finally {
      setBusy(false);
    }
  }

  const inputClass = "c-field h-12 w-full rounded-xl border border-[#DAE2FD] bg-white px-4 text-base text-[#131B2E] placeholder:text-[#757682] outline-none focus:border-[#0244FF] sm:text-sm";
  return (
    <section className="px-5 py-12 sm:py-16" style={{ backgroundColor: "#FAF8FF" }}>
      <div className="mx-auto max-w-[460px] rounded-3xl border bg-white p-6 shadow-sm sm:p-8" style={{ borderColor: "#E2E7FF" }}>
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#0244FF" }}>Akun SOJU</p>
        <h1 className="mt-2 text-2xl font-bold" style={{ color: "#00236F" }}>
          {mode === "masuk" ? "Masuk ke akun" : "Buat akun customer"}
        </h1>
        <p className="mt-2 text-sm leading-6" style={{ color: "#757682" }}>
          {mode === "masuk"
            ? "Masuk untuk melanjutkan checkout dan melihat pesanan."
            : "Isi data untuk menyimpan profil dan pesanan Anda."}
        </p>

        <div className="mt-5 grid grid-cols-2 rounded-full bg-[#F2F3FF] p-1 text-sm font-semibold">
          {(["masuk", "daftar"] as const).map((item) => (
            <button key={item} type="button" onClick={() => { setMode(item); setError(""); }} className="h-10 rounded-full" style={{ color: mode === item ? "white" : "#444651", backgroundColor: mode === item ? "#00236F" : "transparent" }}>
                {item === "masuk" ? "Masuk" : "Daftar"}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="mt-5 flex flex-col gap-3">
          {mode === "daftar" && <>
            <input required autoComplete="name" className={inputClass} placeholder="Nama lengkap" value={nama} onChange={(event) => setNama(event.target.value)} />
            <input required autoComplete="tel" className={inputClass} placeholder="Nomor telepon" value={noTelepon} onChange={(event) => setNoTelepon(event.target.value)} />
            <textarea required autoComplete="street-address" className="c-field min-h-24 w-full rounded-xl border border-[#DAE2FD] bg-white px-4 py-3 text-base text-[#131B2E] placeholder:text-[#757682] outline-none focus:border-[#0244FF] sm:text-sm" placeholder="Alamat lengkap" value={alamat} onChange={(event) => setAlamat(event.target.value)} />
          </>}
          <input required type="email" inputMode="email" autoComplete="email" className={inputClass} placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
          <input required type="password" minLength={8} autoComplete={mode === "masuk" ? "current-password" : "new-password"} className={inputClass} placeholder="Password (minimal 8 karakter)" value={password} onChange={(event) => setPassword(event.target.value)} />
          {mode === "masuk" && (
            <div className="flex justify-end">
              <Link href="/customer/lupa-password" className="text-xs font-semibold text-[#0244FF] underline-offset-4 hover:text-[#00236F] hover:underline">
                Lupa password?
              </Link>
            </div>
          )}
          {error && <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <button disabled={busy} type="submit" className="c-press mt-2 h-12 rounded-full text-sm font-bold text-white disabled:opacity-60" style={{ backgroundColor: "#00236F" }}>
            {busy ? "Memproses…" : mode === "masuk" ? "Masuk" : "Buat Akun"}
          </button>
        </form>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-[#E2E7FF] pt-4 text-xs" style={{ color: "#757682" }}>
          <span>Belum verifikasi email?</span>
          <Link href="/customer/verifikasi-email" className="font-semibold text-[#0244FF] underline-offset-4 hover:text-[#00236F] hover:underline">
            Verifikasi atau kirim ulang email →
          </Link>
        </div>
      </div>
    </section>
  );
}
