"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";

const labels: Record<string, string> = { MENUNGGU_KONFIRMASI: "Menunggu konfirmasi", DIPROSES: "Diproses", SELESAI: "Selesai", DIBATALKAN: "Dibatalkan" };
const money = (value: unknown) => `Rp ${Number(value || 0).toLocaleString("id-ID")}`;
const statuses = Object.keys(labels);

type OrderItem = {
  id: number;
  namaProduk: string;
  varian?: string | null;
  jumlah: number;
  catatan?: string | null;
  subtotal: number | string;
};

type CustomerOrder = {
  id: number;
  kode: string;
  namaPenerima: string;
  emailPenerima: string;
  noTelepon: string;
  alamat: string;
  dibuatPada: string;
  status: string;
  total: number | string;
  item: OrderItem[];
};

export default function CustomerOrdersAdminPage() {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
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

  return (
    <div className="mx-auto max-w-6xl py-1 sm:p-2">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-ink">Pengelola Pesanan</h1>
          <p className="mt-1 text-sm text-slate-500">Lihat pesanan masuk dan tandai status penyelesaiannya.</p>
        </div>
        <button onClick={() => void load()} className="rounded-xl border border-line bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:bg-app">
          Muat ulang
        </button>
      </div>
      {error && <p role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {!orders.length ? (
        <div className="rounded-2xl border border-line-soft bg-white p-8 text-center text-sm text-slate-500">Belum ada pesanan customer.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <article key={order.id} className="rounded-2xl border border-line-soft bg-white p-4 shadow-card sm:p-5">
              <div className="flex flex-col justify-between gap-3 border-b border-line-soft pb-4 sm:flex-row sm:items-start">
                <div className="min-w-0">
                  <h2 className="font-bold text-ink">{order.kode}</h2>
                  <p className="mt-1 break-words text-sm text-slate-500">{order.namaPenerima} · {order.emailPenerima} · {order.noTelepon}</p>
                  <p className="break-words text-sm text-slate-500">{order.alamat}</p>
                  <p className="mt-1 text-xs text-slate-400">{new Date(order.dibuatPada).toLocaleString("id-ID")}</p>
                </div>
                <select
                  aria-label={`Status ${order.kode}`}
                  disabled={busyId === order.id}
                  value={order.status}
                  onChange={(event) => void changeStatus(order.id, event.target.value)}
                  className="h-11 w-full shrink-0 rounded-lg border border-line bg-white px-3 text-base text-ink sm:h-10 sm:w-auto sm:text-sm"
                >
                  {statuses.map((status) => <option key={status} value={status}>{labels[status]}</option>)}
                </select>
              </div>
              <div className="divide-y divide-line-soft">
                {order.item.map((item) => (
                  <div key={item.id} className="flex items-start justify-between gap-3 py-3 text-sm">
                    <span className="min-w-0 break-words">{item.namaProduk}{item.varian ? ` · ${item.varian}` : ""} × {item.jumlah}{item.catatan ? ` — ${item.catatan}` : ""}</span>
                    <span className="tabular shrink-0 whitespace-nowrap font-semibold">{money(item.subtotal)}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between border-t border-line-soft pt-3 font-bold text-ink">
                <span>Total</span>
                <span className="tabular">{money(order.total)}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
