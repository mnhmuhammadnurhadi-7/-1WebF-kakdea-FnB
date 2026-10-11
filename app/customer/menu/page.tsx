"use client";

import { useState, useEffect } from "react";
import { api, getImageUrl } from "@/lib/api";
import { Modal } from "@/components/ui/Modal";

const WhatsAppIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const SearchIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export default function CustomerMenuPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("semua");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await api.publicProducts.getAll();
        if (res.success) {
          setProducts(res.data);
        }
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const filteredProducts = products.filter((p) =>
    p.namaBarang?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.varian?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleWhatsAppOrder = (product: any) => {
    const phoneNumber = "6281234567890"; // Ganti dengan nomor WhatsApp yang sesungguhnya
    const message = `Halo kak, saya mau pesan *${product.namaBarang}*${product.varian ? ` (${product.varian})` : ""}. Apakah tersedia?`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
      {/* Page Header */}
      <section className="pt-8 pb-6" style={{ backgroundColor: "#FAF8FF" }}>
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex flex-col gap-1 mb-6">
            <span
              className="text-[11px] font-bold uppercase"
              style={{ color: "#006C4A", letterSpacing: "0.1em" }}
            >
              KATALOG LENGKAP
            </span>
            <h1
              className="text-[32px] sm:text-[40px] font-bold"
              style={{ color: "#00236F", letterSpacing: "-0.02em" }}
            >
              Menu Makanan
            </h1>
            <p className="text-[16px] max-w-2xl" style={{ color: "#444651" }}>
              Pilih hidangan favorit Anda dari menu kami yang lezat. Klik untuk detail dan pesan langsung via WhatsApp.
            </p>
          </div>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative max-w-md w-full">
              <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#757682" }}>
                {SearchIcon}
              </span>
              <input
                type="text"
                placeholder="Cari menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border text-[14px] focus:outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "#DAE2FD",
                  color: "#131B2E",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8" style={{ backgroundColor: "#FAF8FF" }}>
        <div className="max-w-[1280px] mx-auto px-6">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
                  style={{ borderColor: "#DAE2FD", borderTopColor: "#1E3A8A" }}
                />
                <span className="text-[14px]" style={{ color: "#444651" }}>
                  Memuat menu...
                </span>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-[48px] mb-4">🔍</div>
              <p className="text-[16px] font-semibold mb-2" style={{ color: "#131B2E" }}>
                Tidak ada menu yang ditemukan
              </p>
              <p className="text-[14px]" style={{ color: "#757682" }}>
                Coba kata kunci lain atau hapus filter pencarian
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="rounded-2xl bg-white overflow-hidden flex flex-col cursor-pointer group transition-all hover:shadow-lg"
                  style={{ boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.05)" }}
                >
                  {/* Image */}
                  <div className="relative overflow-hidden" style={{ height: 200 }}>
                    {product.gambar ? (
                      <img
                        src={getImageUrl(product.gambar)}
                        alt={product.namaBarang}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          e.currentTarget.nextElementSibling?.classList.remove("hidden");
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-full h-full flex items-center justify-center absolute inset-0 ${product.gambar ? "hidden" : ""}`}
                      style={{ background: "linear-gradient(135deg, #EAEDFF, #FFDCC3)" }}
                    >
                      <span className="text-[56px]">🍜</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col justify-between flex-1">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-[16px] font-bold line-clamp-2" style={{ color: "#131B2E" }}>
                        {product.namaBarang}
                      </h3>
                      {product.varian && (
                        <span className="text-[12px]" style={{ color: "#757682" }}>
                          {product.varian}
                        </span>
                      )}
                      {product.deskripsi && (
                        <p className="text-[13px] mt-1 line-clamp-2" style={{ color: "#444651" }}>
                          {product.deskripsi}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-3" style={{ borderTop: "1px solid #E2E7FF" }}>
                      <span className="text-[15px] font-bold" style={{ color: "#00236F" }}>
                        Rp {Number(product.hargaDefault || 0).toLocaleString("id-ID")}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWhatsAppOrder(product);
                        }}
                        className="inline-flex items-center gap-1 px-3 h-8 rounded-full text-[12px] font-semibold text-white transition-all hover:opacity-90"
                        style={{ backgroundColor: "#25D366" }}
                      >
                        {WhatsAppIcon}
                        Pesan
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Product Detail Modal */}
      <Modal
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        title={selectedProduct?.namaBarang}
        width={500}
        footer={
          <button
            onClick={() => selectedProduct && handleWhatsAppOrder(selectedProduct)}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-[14px] font-semibold text-white rounded-xl transition-colors hover:opacity-90"
            style={{ backgroundColor: "#25D366" }}
          >
            {WhatsAppIcon}
            Pesan via WhatsApp
          </button>
        }
      >
        {selectedProduct && (
          <div className="flex flex-col gap-5">
            <div className="aspect-[4/3] rounded-xl overflow-hidden" style={{ backgroundColor: "#F2F3FF" }}>
              {selectedProduct.gambar ? (
                <img
                  src={getImageUrl(selectedProduct.gambar)}
                  alt={selectedProduct.namaBarang}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.nextElementSibling?.classList.remove("hidden");
                  }}
                />
              ) : null}
              <div className={`w-full h-full flex items-center justify-center ${selectedProduct.gambar ? "hidden" : ""}`}>
                <span className="text-[80px]">🍜</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[24px] font-bold" style={{ color: "#00236F" }}>
                  Rp {Number(selectedProduct.hargaDefault || 0).toLocaleString("id-ID")}
                </span>
                <span className="text-[14px]" style={{ color: "#757682" }}>
                  {selectedProduct.satuan}
                </span>
              </div>

              {selectedProduct.varian && (
                <div>
                  <span className="text-[12px] font-semibold uppercase" style={{ color: "#757682", letterSpacing: "0.05em" }}>
                    Varian
                  </span>
                  <p className="text-[14px]" style={{ color: "#131B2E" }}>
                    {selectedProduct.varian}
                  </p>
                </div>
              )}

              {selectedProduct.deskripsi && (
                <div>
                  <span className="text-[12px] font-semibold uppercase" style={{ color: "#757682", letterSpacing: "0.05em" }}>
                    Deskripsi
                  </span>
                  <p className="text-[14px] leading-relaxed" style={{ color: "#131B2E" }}>
                    {selectedProduct.deskripsi}
                  </p>
                </div>
              )}

              <div
                className="flex items-center gap-2 p-3 rounded-xl"
                style={{ backgroundColor: "#F2F3FF" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#006C4A">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                <span className="text-[13px]" style={{ color: "#444651" }}>
                  Klik tombol di bawah untuk pesan langsung via WhatsApp dengan pesan otomatis.
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
