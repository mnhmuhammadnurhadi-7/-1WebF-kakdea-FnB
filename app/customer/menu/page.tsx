"use client";

import { useState, useEffect, useMemo } from "react";
import { api } from "@/lib/api";
import { OrderModal } from "@/components/customer/OrderModal";
import { PageHeader } from "@/components/customer/PageHeader";
import { ProductCard } from "@/components/customer/ProductCard";
import { parseVarian, useContactInfo } from "@/lib/whatsapp";

const SearchIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export default function CustomerMenuPage() {
  const contact = useContactInfo();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const load = async () => {
    setLoading(true);
    setFailed(false);
    try {
      const res = await api.publicProducts.getAll();
      if (res.success) setProducts(res.data);
      else setFailed(true);
    } catch (error) {
      console.error("Error loading products:", error);
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.namaBarang?.toLowerCase().includes(q) ||
        parseVarian(p.varian).some((v) => v.toLowerCase().includes(q))
    );
  }, [products, searchQuery]);

  return (
    <>
      <PageHeader
        title="Menu Makanan"
        description="Pilih hidangan favorit Anda, tentukan varian dan jumlahnya, lalu kirim pesanan lewat WhatsApp."
      >
        <div className="relative w-full max-w-md">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#757682" }}>
            {SearchIcon}
          </span>
          <input
            type="search"
            aria-label="Cari menu"
            placeholder="Cari menu atau varian"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="c-field h-12 w-full rounded-full border pl-11 pr-5 text-[15px]"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#DAE2FD", color: "#131B2E" }}
          />
        </div>
      </PageHeader>

      <section className="pb-16 pt-4" style={{ backgroundColor: "#FAF8FF" }}>
        <div className="mx-auto max-w-[1280px] px-5 sm:px-6">
          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-busy="true" aria-label="Memuat menu">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-2xl bg-white" style={{ border: "1px solid #E2E7FF" }}>
                  <div className="c-skeleton h-[200px] w-full" />
                  <div className="flex flex-col gap-3 p-4">
                    <div className="c-skeleton h-4 w-3/4 rounded-md" />
                    <div className="c-skeleton h-3 w-1/3 rounded-md" />
                    <div className="mt-3 flex items-center justify-between">
                      <div className="c-skeleton h-5 w-24 rounded-md" />
                      <div className="c-skeleton h-9 w-20 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : failed ? (
            <div className="mx-auto flex max-w-sm flex-col items-center gap-3 py-16 text-center">
              <p className="text-[17px] font-semibold" style={{ color: "#131B2E" }}>
                Menu belum berhasil dimuat
              </p>
              <p className="text-[14px] leading-[22px]" style={{ color: "#757682" }}>
                Periksa koneksi internet Anda, lalu coba lagi.
              </p>
              <button
                type="button"
                onClick={load}
                className="c-press mt-2 inline-flex h-11 items-center rounded-full px-6 text-[14px] font-semibold text-white"
                style={{ backgroundColor: "#1E3A8A" }}
              >
                Coba lagi
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="mx-auto flex max-w-sm flex-col items-center gap-2 py-16 text-center">
              <p className="text-[17px] font-semibold" style={{ color: "#131B2E" }}>
                {searchQuery ? `Tidak ada menu untuk “${searchQuery.trim()}”` : "Menu belum tersedia"}
              </p>
              <p className="text-[14px] leading-[22px]" style={{ color: "#757682" }}>
                {searchQuery ? "Coba kata kunci lain, misalnya nama makanan atau varian." : "Menu sedang disiapkan. Silakan kembali lagi nanti."}
              </p>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="c-press mt-3 inline-flex h-10 items-center rounded-full border px-5 text-[14px] font-semibold"
                  style={{ borderColor: "#DAE2FD", color: "#00236F", backgroundColor: "#FFFFFF" }}
                >
                  Hapus pencarian
                </button>
              )}
            </div>
          ) : (
            <>
              <p className="mb-5 text-[13.5px]" style={{ color: "#757682" }} aria-live="polite">
                {filteredProducts.length} menu{searchQuery ? " ditemukan" : ""}
              </p>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onOpen={setSelectedProduct} imageHeight={200} showDescription className="h-full" />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <OrderModal product={selectedProduct} waNumber={contact.waNumber} onClose={() => setSelectedProduct(null)} />
    </>
  );
}
