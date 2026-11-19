"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartContext";
import { ProductVisual } from "./ProductVisual";
import { CloseIcon, MinusIcon, PlusIcon } from "./icons";

const rupiah = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;

export function CartDrawer() {
  const cart = useCart();
  const router = useRouter();

  useEffect(() => {
    if (!cart.isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") cart.closeCart();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [cart.isOpen, cart.closeCart]);

  if (!cart.isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex justify-end" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) cart.closeCart(); }}>
      <div className="absolute inset-0 bg-[#001440]/55" />
      <aside role="dialog" aria-modal="true" aria-labelledby="cart-title" className="relative flex h-full w-full max-w-[520px] flex-col bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b px-5 py-4 sm:px-6" style={{ borderColor: "#E2E7FF" }}>
          <div>
            <h2 id="cart-title" className="text-xl font-bold" style={{ color: "#00236F" }}>Keranjang</h2>
            <p className="mt-1 text-sm" style={{ color: "#757682" }}>{cart.itemCount} item</p>
          </div>
          <button type="button" onClick={cart.closeCart} aria-label="Tutup keranjang" className="flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: "#F2F3FF", color: "#00236F" }}>{CloseIcon}</button>
        </header>

        {cart.items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
            <p className="text-lg font-semibold" style={{ color: "#131B2E" }}>Keranjang masih kosong</p>
            <p className="text-sm" style={{ color: "#757682" }}>Pilih menu, tentukan varian dan jumlah, lalu tambahkan ke keranjang.</p>
            <button type="button" onClick={cart.closeCart} className="mt-2 rounded-full px-5 py-3 text-sm font-semibold text-white" style={{ backgroundColor: "#1E3A8A" }}>Lanjut pilih menu</button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto p-5 sm:p-6">
              {cart.items.map((item) => (
                <article key={item.key} className="flex gap-3 border-b pb-4" style={{ borderColor: "#E2E7FF" }}>
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl" style={{ backgroundColor: "#F2F3FF" }}>
                    <ProductVisual src={item.gambar} alt={item.nama} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold" style={{ color: "#131B2E" }}>{item.nama}</h3>
                        {item.varian && <p className="mt-0.5 text-xs" style={{ color: "#757682" }}>Varian: {item.varian}</p>}
                      </div>
                      <button type="button" onClick={() => cart.removeItem(item.key)} className="text-xs font-semibold" style={{ color: "#BA1A1A" }}>Hapus</button>
                    </div>
                    {item.catatan && <p className="mt-1 text-xs" style={{ color: "#757682" }}>Catatan: {item.catatan}</p>}
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="flex items-center rounded-full border" style={{ borderColor: "#DAE2FD" }}>
                        <button type="button" aria-label={`Kurangi jumlah ${item.nama}`} onClick={() => cart.setQuantity(item.key, item.jumlah - 1)} disabled={item.jumlah <= 1} className="flex h-9 w-9 items-center justify-center disabled:opacity-40" style={{ color: "#00236F" }}>{MinusIcon}</button>
                        <span className="min-w-7 text-center text-sm font-semibold tabular-nums" style={{ color: "#131B2E" }}>{item.jumlah}</span>
                        <button type="button" aria-label={`Tambah jumlah ${item.nama}`} onClick={() => cart.setQuantity(item.key, item.jumlah + 1)} disabled={item.jumlah >= 99} className="flex h-9 w-9 items-center justify-center disabled:opacity-40" style={{ color: "#00236F" }}>{PlusIcon}</button>
                      </div>
                      <span className="text-sm font-bold tabular-nums" style={{ color: "#00236F" }}>{rupiah(item.harga * item.jumlah)}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <footer className="space-y-3 border-t p-5 sm:p-6" style={{ borderColor: "#E2E7FF" }}>
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: "#757682" }}>Perkiraan total</span>
                <strong className="text-lg tabular-nums" style={{ color: "#00236F" }}>{rupiah(cart.total)}</strong>
              </div>
              <p className="text-xs leading-5" style={{ color: "#757682" }}>Harga dan ketersediaan akan dikonfirmasi kembali oleh penjual melalui WhatsApp.</p>
              <button type="button" onClick={() => { cart.closeCart(); router.push("/customer/checkout"); }} className="flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold text-white" style={{ backgroundColor: "#1E3A8A" }}>
                Lanjut ke Checkout
              </button>
              <button type="button" onClick={cart.clearCart} className="w-full py-1 text-sm font-semibold" style={{ color: "#BA1A1A" }}>Kosongkan keranjang</button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
