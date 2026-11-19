"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";

const labels: Record<string, string> = { MENUNGGU_KONFIRMASI: "Menunggu konfirmasi", DIPROSES: "Diproses", SELESAI: "Selesai", DIBATALKAN: "Dibatalkan" };
const money = (value: unknown) => `Rp ${Number(value || 0).toLocaleString("id-ID")}`;
const statuses = Object.keys(labels);

export default function CustomerOrdersAdminPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);
  const load = useCallback(() => api.customerOrders.getAll().then((result) => { setOrders(result.data); setError(""); }).catch((cause) => setError(cause.message)), []);
  useEffect(() => { void load(); }, [load]);
  async function changeStatus(id: number, status: string) {
    setBusyId(id); setError("");
    try { await api.customerOrders.updateStatus(id, status); await load(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Status belum dapat diperbarui."); }
    finally { setBusyId(null); }
  }

  return <div className="mx-auto max-w-6xl p-6"><div className="mb-6 flex items-center justify-between"><div><h1 className="text-2xl font-bold">Pengelola Pesanan</h1><p className="mt-1 text-sm text-slate-500">Lihat pesanan masuk dan tandai status penyelesaiannya.</p></div><button onClick={() => void load()} className="rounded-xl border px-4 py-2 text-sm font-semibold">Muat ulang</button></div>
    {error && <p role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    {!orders.length ? <div className="rounded-2xl border bg-white p-8 text-center text-sm text-slate-500">Belum ada pesanan customer.</div> : <div className="flex flex-col gap-4">{orders.map((order) => <article key={order.id} className="rounded-2xl border bg-white p-5"><div className="flex flex-wrap justify-between gap-4 border-b pb-4"><div><h2 className="font-bold">{order.kode}</h2><p className="mt-1 text-sm text-slate-500">{order.namaPenerima} · {order.emailPenerima} · {order.noTelepon}</p><p className="text-sm text-slate-500">{order.alamat}</p><p className="mt-1 text-xs text-slate-400">{new Date(order.dibuatPada).toLocaleString("id-ID")}</p></div><select aria-label={`Status ${order.kode}`} disabled={busyId === order.id} value={order.status} onChange={(event) => void changeStatus(order.id, event.target.value)} className="h-10 rounded-lg border px-3 text-sm">{statuses.map((status) => <option key={status} value={status}>{labels[status]}</option>)}</select></div><div className="divide-y">{order.item.map((item: any) => <div key={item.id} className="flex justify-between gap-4 py-3 text-sm"><span>{item.namaProduk}{item.varian ? ` · ${item.varian}` : ""} × {item.jumlah}{item.catatan ? ` — ${item.catatan}` : ""}</span><span className="whitespace-nowrap">{money(item.subtotal)}</span></div>)}</div><div className="flex justify-between border-t pt-3 font-bold"><span>Total</span><span>{money(order.total)}</span></div></article>)}</div>}
  </div>;
}
