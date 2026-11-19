"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { customerApi, customerToken, type CustomerCartItem } from "@/lib/customerApi";

const CART_STORAGE_KEY = "soju_customer_cart";
const MAX_QTY = 99;

export interface CartItem {
  key: string;
  productId: number | string;
  nama: string;
  varian: string;
  jumlah: number;
  harga: number;
  satuan: string;
  catatan: string;
  gambar?: string | null;
}

type CartContextValue = {
  items: CartItem[];
  ready: boolean;
  itemCount: number;
  total: number;
  isOpen: boolean;
  addItem: (product: any, varian: string, jumlah: number, catatan: string) => void;
  replaceItems: (items: CartItem[]) => void;
  mergeCustomerCart: () => Promise<void>;
  setQuantity: (key: string, jumlah: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function cartKey(productId: number | string, varian: string, catatan: string) {
  return `${productId}::${varian.trim().toLowerCase()}::${catatan.trim().toLowerCase()}`;
}

function fromApiItem(item: CustomerCartItem): CartItem {
  return {
    key: cartKey(item.productId, item.varian || "", item.catatan || ""),
    productId: item.productId,
    nama: item.nama || "Menu",
    varian: item.varian || "",
    jumlah: item.jumlah,
    harga: Number(item.harga || 0),
    satuan: item.satuan || "",
    catatan: item.catatan || "",
    gambar: item.gambar || null,
  };
}

function mergeItems(...groups: CartItem[][]) {
  const merged = new Map<string, CartItem>();
  for (const group of groups) {
    for (const item of group) {
      const key = item.key || cartKey(item.productId, item.varian, item.catatan);
      const previous = merged.get(key);
      merged.set(key, previous
        ? { ...previous, ...item, jumlah: Math.min(MAX_QTY, previous.jumlah + item.jumlah) }
        : { ...item, key, jumlah: Math.min(MAX_QTY, Math.max(1, item.jumlah)) });
    }
  }
  return [...merged.values()];
}

const apiPayload = (items: CartItem[]) => items.map(({ productId, varian, jumlah, catatan }) => ({
  productId: Number(productId), varian, jumlah, catatan,
}));

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    async function hydrateCart() {
      let localItems: CartItem[] = [];
      try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        const parsed = stored ? JSON.parse(stored) : [];
        if (Array.isArray(parsed)) localItems = parsed.filter((item) => item && item.productId && Number(item.jumlah) > 0);
      } catch (error) {
        console.warn("Keranjang lokal tidak dapat dibaca:", error);
      }
      if (customerToken.get()) {
        try {
          const response = await customerApi.getCart();
          const combined = mergeItems(response.data.map(fromApiItem), localItems);
          await customerApi.updateCart(apiPayload(combined));
          localItems = combined;
        } catch (error) {
          console.warn("Keranjang akun belum tersinkron:", error);
        }
      }
      if (active) {
        setItems(localItems);
        setHydrated(true);
      }
    }
    void hydrateCart();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    if (customerApi.isAuthenticated()) {
      void customerApi.updateCart(apiPayload(items)).catch((error) => console.warn("Keranjang akun belum tersinkron:", error));
    }
  }, [items, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((sum, item) => sum + item.jumlah, 0);
    const total = items.reduce((sum, item) => sum + item.harga * item.jumlah, 0);
    return {
      items,
      ready: hydrated,
      itemCount,
      total,
      isOpen,
      addItem(product, varian, jumlah, catatan) {
        const cleanNote = catatan.trim();
        const cleanVariant = varian.trim();
        const key = cartKey(product.id, cleanVariant, cleanNote);
        setItems((current) => {
          const existing = current.find((item) => item.key === key);
          if (existing) {
            return current.map((item) => item.key === key
              ? { ...item, jumlah: Math.min(MAX_QTY, item.jumlah + jumlah) }
              : item);
          }
          return [...current, {
            key,
            productId: product.id,
            nama: product.namaBarang,
            varian: cleanVariant,
            jumlah: Math.min(MAX_QTY, Math.max(1, jumlah)),
            harga: Number(product.hargaDefault || 0),
            satuan: product.satuan || "",
            catatan: cleanNote,
            gambar: product.gambar || null,
          }];
        });
      },
      replaceItems(nextItems) {
        setItems(nextItems);
      },
      async mergeCustomerCart() {
        const response = await customerApi.getCart();
        setItems((current) => mergeItems(response.data.map(fromApiItem), current));
      },
      setQuantity(key, jumlah) {
        const next = Math.min(MAX_QTY, Math.max(1, Math.round(jumlah) || 1));
        setItems((current) => current.map((item) => item.key === key ? { ...item, jumlah: next } : item));
      },
      removeItem(key) {
        setItems((current) => current.filter((item) => item.key !== key));
      },
      clearCart() {
        setItems([]);
      },
      openCart() {
        setIsOpen(true);
      },
      closeCart() {
        setIsOpen(false);
      },
    };
  }, [items, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart harus digunakan di dalam CartProvider");
  return context;
}
