"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { customerApi } from "@/lib/customerApi";
import { useCart } from "@/components/customer/CartContext";

const statusLabel: Record<string, string> = {
  MENUNGGU_KONFIRMASI: "Menunggu konfirmasi",
  DIPROSES: "Diproses",
  SELESAI: "Selesai",
  DIBATALKAN: "Dibatalkan",
};
const money = (value: unknown) => `Rp ${Number(value || 0).toLocaleString("id-ID")}`;

export default function CustomerOrdersPage() {
  const cart = useCart();
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    customerApi.getOrders().then((result) => setOrders(result.data)).catch((cause) => setError(cause.message)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <section className="rounded-3xl border bg-white p-5 sm:p-6" style={{ borderColor: "#E2E7FF" }}>
        <div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-lg font-bold" style={{ color: "#131B2E" }}>Keranjang Saya ({cart.itemCount})</h2><p className="mt-1 text-sm" style={{ color: "#757682" }}>Keranjang tersimpan di akun dan dapat dilanjutkan kapan saja.</p></div><Link href="/customer/menu" className="rounded-full px-5 py-2.5 text-sm font-bold text-white" style={{ backgroundColor: "#1E3A8A" }}>Pilih Menu</Link></div>
        {!cart.items.length ? <p className="mt-5 rounded-xl bg-[#F2F3FF] p-4 text-sm text-slate-500">Keranjang masih kosong.</p> : <><div className="mt-4 divide-y">{cart.items.map((item) => <div key={item.key} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm"><span className="font-semibold">{item.nama}{item.varian ? ` · ${item.varian}` : ""} × {item.jumlah}{item.catatan ? ` — ${item.catatan}` : ""}</span><span>{money(item.harga * item.jumlah)} <button type="button" onClick={() => cart.removeItem(item.key)} className="ml-3 text-xs font-semibold text-red-700">Hapus</button></span></div>)}</div><div className="mt-3 flex items-center justify-between border-t pt-4"><strong>Total sementara</strong><strong>{money(cart.total)}</strong></div><Link href="/customer/checkout" className="mt-4 inline-flex rounded-full px-5 py-3 text-sm font-bold text-white" style={{ backgroundColor: "#1E3A8A" }}>Lanjut Checkout</Link></>}
      </section>
      <div className="flex items-center justify-between"><h2 className="text-lg font-bold" style={{ color: "#131B2E" }}>Riwayat Pesanan</h2><button type="button" onClick={() => customerApi.getOrders().then((result) => setOrders(result.data)).catch((cause) => setError(cause.message))} className="text-sm font-semibold" style={{ color: "#1E3A8A" }}>Muat ulang</button></div>
      {loading ? <p className="text-sm text-slate-500">Memuat pesanan…</p> : error ? <p role="alert" className="text-sm text-red-700">{error}</p> : orders.length === 0 ? (
        <div className="rounded-3xl border bg-white p-10 text-center" style={{ borderColor: "#E2E7FF" }}><p className="font-semibold" style={{ color: "#131B2E" }}>Belum ada pesanan</p><p className="mt-1 text-sm" style={{ color: "#757682" }}>Pesanan yang dikirim saat checkout akan muncul di sini.</p></div>
      ) : orders.map((order) => (
        <article key={order.id} className="rounded-3xl border bg-white p-5 sm:p-6" style={{ borderColor: "#E2E7FF" }}>
          <div className="flex flex-wrap items-start justify-between gap-3 border-b pb-4" style={{ borderColor: "#EEF0F5" }}>
            <div><p className="font-bold" style={{ color: "#131B2E" }}>{order.kode}</p><p className="mt-1 text-xs" style={{ color: "#757682" }}>{new Date(order.dibuatPada).toLocaleString("id-ID")}</p></div>
            <span className="rounded-full bg-[#F2F3FF] px-3 py-1.5 text-xs font-bold" style={{ color: "#1E3A8A" }}>{statusLabel[order.status] || order.status}</span>
          </div>
          <div className="divide-y" style={{ borderColor: "#EEF0F5" }}>
            {(order.item || []).map((item: any) => <div key={item.id} className="flex justify-between gap-3 py-3 text-sm"><span style={{ color: "#444651" }}>{item.namaProduk}{item.varian ? ` · ${item.varian}` : ""} × {item.jumlah}</span><span className="font-semibold" style={{ color: "#131B2E" }}>{money(item.subtotal)}</span></div>)}
          </div>
          <div className="flex justify-between border-t pt-3 text-sm" style={{ borderColor: "#EEF0F5" }}><span style={{ color: "#757682" }}>Total</span><strong style={{ color: "#00236F" }}>{money(order.total)}</strong></div>
        </article>
      ))}
    </div>
  );
}
