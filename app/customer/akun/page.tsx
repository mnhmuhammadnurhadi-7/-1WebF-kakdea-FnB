"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { customerApi } from "@/lib/customerApi";
import { useCart } from "@/components/customer/CartContext";

export default function CustomerAccountPage() {
  const router = useRouter();
  const cart = useCart();
  const [mode, setMode] = useState<"masuk" | "daftar">("masuk");
  const [nextPath, setNextPath] = useState("/dashboard-customer/profil");
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [noTelepon, setNoTelepon] = useState("");
  const [alamat, setAlamat] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const target = params.get("next");
    if (target?.startsWith("/") && !target.startsWith("//")) setNextPath(target);
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "daftar") await customerApi.register({ nama, email, noTelepon, alamat, password });
      else await customerApi.login(email, password);
      await cart.mergeCustomerCart();
      router.replace(nextPath);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Akun belum dapat diproses.");
    } finally {
      setBusy(false);
    }
  }

  const inputClass = "h-12 w-full rounded-xl border bg-white px-4 text-sm outline-none focus:border-[#1E3A8A]";
  return (
    <section className="px-5 py-12 sm:py-16" style={{ backgroundColor: "#FAF8FF" }}>
      <div className="mx-auto max-w-[460px] rounded-3xl border bg-white p-6 shadow-sm sm:p-8" style={{ borderColor: "#E2E7FF" }}>
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#1E3A8A" }}>Akun SOJU</p>
        <h1 className="mt-2 text-2xl font-bold" style={{ color: "#131B2E" }}>{mode === "masuk" ? "Masuk ke akun" : "Buat akun customer"}</h1>
        <p className="mt-2 text-sm leading-6" style={{ color: "#757682" }}>
          {mode === "masuk" ? "Masuk untuk melanjutkan checkout dan melihat pesanan." : "Isi data untuk menyimpan profil dan pesanan Anda."}
        </p>

        <div className="mt-5 grid grid-cols-2 rounded-full bg-[#F2F3FF] p-1 text-sm font-semibold">
          {(["masuk", "daftar"] as const).map((item) => (
            <button key={item} type="button" onClick={() => { setMode(item); setError(""); }} className="h-10 rounded-full" style={{ color: mode === item ? "white" : "#444651", backgroundColor: mode === item ? "#1E3A8A" : "transparent" }}>
              {item === "masuk" ? "Masuk" : "Daftar"}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="mt-5 flex flex-col gap-3">
          {mode === "daftar" && <>
            <input required autoComplete="name" className={inputClass} placeholder="Nama lengkap" value={nama} onChange={(event) => setNama(event.target.value)} />
            <input required autoComplete="tel" className={inputClass} placeholder="Nomor telepon" value={noTelepon} onChange={(event) => setNoTelepon(event.target.value)} />
            <textarea required autoComplete="street-address" className="min-h-24 w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:border-[#1E3A8A]" placeholder="Alamat lengkap" value={alamat} onChange={(event) => setAlamat(event.target.value)} />
          </>}
          <input required type="email" autoComplete="email" className={inputClass} placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
          <input required type="password" minLength={8} autoComplete={mode === "masuk" ? "current-password" : "new-password"} className={inputClass} placeholder="Password (minimal 8 karakter)" value={password} onChange={(event) => setPassword(event.target.value)} />
          {error && <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <button disabled={busy} type="submit" className="mt-2 h-12 rounded-full text-sm font-bold text-white disabled:opacity-60" style={{ backgroundColor: "#1E3A8A" }}>
            {busy ? "Memproses…" : mode === "masuk" ? "Masuk" : "Buat Akun"}
          </button>
        </form>
      </div>
    </section>
  );
}
