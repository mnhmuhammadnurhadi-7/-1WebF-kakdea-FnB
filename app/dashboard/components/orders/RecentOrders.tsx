"use client";

import Link from "next/link";
import { OrderItem } from "./OrderItem";
import type { RecentOrder } from "../shared/types";

export function RecentOrders({ orders }: { orders: RecentOrder[] }) {
  return (
    <section className="rounded-panel bg-white p-6 shadow-card">
      <div className="mb-3.5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-[-.03em]">Order Terbaru</h2>
          <p className="mt-1 text-[13px] text-muted">
            {orders.length > 0 ? `${orders.length} order terakhir masuk.` : "Belum ada order."}
          </p>
        </div>
        <Link href="/data" className="text-[13px] font-bold text-brand hover:underline">
          Lihat Semua
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="flex items-center justify-center py-12 text-[13px] text-muted">
          Belum ada data order dari backend.
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {orders.map((o) => (
            <OrderItem key={o.id} {...o} />
          ))}
        </ul>
      )}
    </section>
  );
}
