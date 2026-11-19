"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/customer/CartContext";
import { customerApi, type CustomerProfile } from "@/lib/customerApi";

const money = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useCart();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [alamat, setAlamat] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!customerApi.isAuthenticated()) {
      router.replace(`/customer/akun?next=${encodeURIComponent("/customer/checkout")}`);
      return;
    }
    customerApi.getProfile().then(({ data }) => { setProfile(data); setAlamat(data.alamat); }).catch((cause) => {
      setError(cause.message);
      customerApi.logout();
      router.replace(`/customer/akun?next=${encodeURIComponent("/customer/checkout")}`);
    });
  }, [router]);

  async function submit() {
    setBusy(true); setError("");
    try {
      await customerApi.updateCart(cart.items.map(({ productId, varian, jumlah, catatan }) => ({ productId: Number(productId), varian, jumlah, catatan })));
      await customerApi.updateProfile({ alamat });
      await customerApi.checkout(alamat);
      cart.clearCart();
      router.replace("/dashboard-customer/pesanan");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Pesanan belum dapat dibuat."); }
    finally { setBusy(false); }
  }

  if (!cart.ready || !profile) return <div className="mx-auto max-w-4xl px-5 py-16 text-sm text-slate-500">Memuat checkout…</div>;
  if (!cart.items.length) return <div className="mx-auto max-w-4xl px-5 py-16"><h1 className="text-2xl font-bold">Keranjang kosong</h1><button onClick={() => router.push("/customer/menu")} className="mt-4 rounded-full bg-blue-900 px-5 py-3 text-white">Pilih menu</button></div>;

  return <section className="min-h-[65vh] bg-[#FAF8FF] px-5 py-10"><div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_360px]">
    <div className="rounded-3xl border border-[#E2E7FF] bg-white p-6"><h1 className="text-2xl font-bold text-[#131B2E]">Konfirmasi Pesanan</h1><p className="mt-1 text-sm text-slate-500">Pesanan akan dikirim ke toko untuk dikonfirmasi.</p>
      <div className="mt-6 grid gap-2 text-sm"><strong>{profile.nama}</strong><span>{profile.email} · {profile.noTelepon}</span><label className="mt-3 font-semibold">Alamat pengiriman<textarea required value={alamat} onChange={(e) => setAlamat(e.target.value)} className="mt-2 min-h-24 w-full rounded-xl border p-3 font-normal" /></label></div>
      {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
    </div>
    <aside className="h-fit rounded-3xl border border-[#E2E7FF] bg-white p-6"><h2 className="font-bold">Ringkasan</h2><div className="my-4 divide-y">{cart.items.map((item) => <div key={item.key} className="flex justify-between gap-3 py-3 text-sm"><span>{item.nama}{item.varian ? ` · ${item.varian}` : ""} × {item.jumlah}</span><span className="whitespace-nowrap">{money(item.harga * item.jumlah)}</span></div>)}</div><div className="flex justify-between border-t pt-4 font-bold"><span>Total</span><span>{money(cart.total)}</span></div><button disabled={busy || !alamat.trim()} onClick={submit} className="mt-5 h-12 w-full rounded-full bg-[#1E3A8A] font-bold text-white disabled:opacity-50">{busy ? "Mengirim pesanan…" : "Buat Pesanan"}</button></aside>
  </div></section>;
}
