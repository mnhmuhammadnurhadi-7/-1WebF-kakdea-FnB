"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, getImageUrl } from "@/lib/api";
import { Modal } from "@/components/ui/Modal";

/* ───── SVG Icons ───── */
const WhatsAppIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const ChevronLeft = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const ChevronRight = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

/* ───── Main Page Component ───── */
export default function CustomerHomePage() {
  const router = useRouter();
  const [headline, setHeadline] = useState<any>(null);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [heroSlide, setHeroSlide] = useState(0);
  const heroIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [headlineRes, featuredRes, productsRes] = await Promise.all([
          api.publicCms.getContentByKey("headline_beranda").catch(() => null),
          api.publicCms.getContentByKey("produk_unggulan").catch(() => null),
          api.publicProducts.getAll().catch(() => ({ success: false, data: [] })),
        ]);

        if (headlineRes?.success && headlineRes.data) {
          setHeadline(headlineRes.data);
        }

        let starredIds: number[] = [];
        if (featuredRes?.success && featuredRes.data?.konten) {
          try {
            const parsed = JSON.parse(featuredRes.data.konten);
            if (Array.isArray(parsed)) starredIds = parsed;
          } catch {
            starredIds = featuredRes.data.konten
              .split(",")
              .map((id: string) => parseInt(id.trim()))
              .filter(Boolean);
          }
        }

        if (productsRes?.success && Array.isArray(productsRes.data)) {
          setAllProducts(productsRes.data);
          const starred = starredIds
            .map((id) => productsRes.data.find((p: any) => p.id === id))
            .filter(Boolean)
            .slice(0, 5);
          setFeaturedProducts(starred.length > 0 ? starred : productsRes.data.slice(0, 5));
        }
      } catch (error) {
        console.error("Error loading customer data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  /* ─── Hero auto-slide ─── */
  const startHeroAutoSlide = useCallback(() => {
    if (heroIntervalRef.current) clearInterval(heroIntervalRef.current);
    heroIntervalRef.current = setInterval(() => {
      setHeroSlide((prev) => (featuredProducts.length > 0 ? (prev + 1) % featuredProducts.length : 0));
    }, 4000);
  }, [featuredProducts.length]);

  useEffect(() => {
    if (featuredProducts.length > 1) startHeroAutoSlide();
    return () => {
      if (heroIntervalRef.current) clearInterval(heroIntervalRef.current);
    };
  }, [featuredProducts.length, startHeroAutoSlide]);

  const goToSlide = (idx: number) => {
    setHeroSlide(idx);
    startHeroAutoSlide();
  };

  const prevSlide = () => {
    setHeroSlide((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
    startHeroAutoSlide();
  };

  const nextSlide = () => {
    setHeroSlide((prev) => (prev + 1) % featuredProducts.length);
    startHeroAutoSlide();
  };

  /* ─── WhatsApp order handler ─── */
  const handleWhatsAppOrder = (product: any) => {
    const phoneNumber = "6281234567890";
    const message = `Halo kak, saya mau pesan *${product.namaBarang}*${product.varian ? ` (${product.varian})` : ""}. Apakah tersedia?`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  /* ─── Open product popup ─── */
  const openProductModal = (product: any) => {
    setSelectedProduct(product);
  };

  /* ─── Navigate to menu and open popup ─── */
  const handleTopMenuClick = (product: any) => {
    openProductModal(product);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
            style={{ borderColor: "#DAE2FD", borderTopColor: "#1E3A8A" }}
          />
          <span className="text-[14px]" style={{ color: "#444651" }}>
            Memuat...
          </span>
        </div>
      </div>
    );
  }

  const currentHeroProduct = featuredProducts[heroSlide];

  return (
    <>
      {/* ═══════════════════════════════════════════════ */}
      {/* HERO SECTION - Figma: Dynamic Curve & Bold Composition */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ backgroundColor: "#FAF8FF" }}>
        {/* Ambient glow blobs */}
        <div
          className="absolute rounded-full"
          style={{
            width: 680, height: 680, right: -100, top: -128,
            background: "linear-gradient(135deg, rgba(255,220,195,0.3) 0%, rgba(220,225,255,0.2) 50%, rgba(220,225,255,0) 100%)",
            filter: "blur(32px)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 520, height: 520, left: -102, top: 266,
            background: "rgba(133, 248, 196, 0.25)",
            filter: "blur(32px)",
          }}
        />

        <div className="max-w-[1280px] mx-auto px-6 pt-4 pb-8 relative z-10">
          {/* Top Notification Pill */}
          <div className="flex items-center mb-4">
            <div
              className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full"
              style={{ backgroundColor: "#EAEDFF", boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.05)" }}
            >
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#006C4A" }} />
              <span
                className="text-[11px] font-semibold uppercase"
                style={{ color: "#00236F", letterSpacing: "0.05em" }}
              >
                GARANSI COLD-CHAIN 100% SEGAR H+0
              </span>
              <svg width="15" height="14" viewBox="0 0 24 24" fill="#006C4A">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
            </div>
          </div>

          {/* Hero Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            {/* Text Column (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h1
                  className="text-[36px] sm:text-[42px] lg:text-[48px] font-bold leading-[1.1] whitespace-pre-line"
                  style={{ color: "#00236F", letterSpacing: "-0.02em" }}
                >
                  {headline?.judul || "Sensasi Kelezatan Autentik & Segar dari Resep Pilihan SOJU"}
                </h1>
                {headline?.subJudul && (
                  <p
                    className="text-[17px] sm:text-[19px] font-semibold leading-snug whitespace-pre-line"
                    style={{ color: "#006C4A" }}
                  >
                    {headline.subJudul}
                  </p>
                )}
              </div>

              <p className="text-[16px] leading-[24px] whitespace-pre-line" style={{ color: "#444651" }}>
                {headline?.konten ||
                  "Sajian kuliner nusantara siap santap dan produk beku berstandar HACCP. Dibuat dari olahan murni daging ikan tenggiri segar & ayam pilihan tanpa bahan pengawet sintetik."}
              </p>

              {/* Dual CTA Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <Link
                  href="/customer/menu"
                  className="inline-flex items-center justify-center px-8 h-11 rounded-full text-[14px] font-semibold text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: "#1E3A8A" }}
                >
                  Lihat Semua Menu
                </Link>
                <Link
                  href="/customer/kontak"
                  className="inline-flex items-center justify-center px-6 h-11 rounded-full text-[14px] font-semibold border transition-all hover:bg-gray-50"
                  style={{ color: "#00236F", backgroundColor: "#FFFFFF", boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.05)" }}
                >
                  Hubungi Kami
                </Link>
              </div>
            </div>

            {/* Visual Hero Centerpiece (7 cols) */}
            <div className="lg:col-span-7 flex justify-center items-center relative min-h-[340px] lg:min-h-[440px]">
              {/* Background circle gradient */}
              <div
                className="absolute rounded-full"
                style={{
                  width: "clamp(320px, 40vw, 500px)",
                  height: "clamp(320px, 40vw, 500px)",
                  background: "linear-gradient(45deg, rgba(130,245,193,0.4) 0%, rgba(218,226,253,1) 50%, rgba(255,183,125,0.3) 100%)",
                }}
              />

              {/* Main Circular Platter - Carousel */}
              <div
                className="relative rounded-full overflow-hidden bg-white"
                style={{
                  width: "clamp(280px, 35vw, 440px)",
                  height: "clamp(280px, 35vw, 440px)",
                  padding: 8,
                  boxShadow: "0px 25px 50px -12px rgba(0,0,0,0.25)",
                }}
              >
                {featuredProducts.map((product, idx) => (
                  <div
                    key={product.id}
                    className="absolute inset-2 rounded-full overflow-hidden transition-opacity duration-700 cursor-pointer"
                    style={{ opacity: idx === heroSlide ? 1 : 0 }}
                    onClick={() => handleTopMenuClick(product)}
                  >
                    {product.gambar ? (
                      <img
                        src={getImageUrl(product.gambar)}
                        alt={product.namaBarang}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg, #EAEDFF, #FFDCC3)" }}
                      >
                        <span className="text-[80px]">🍜</span>
                      </div>
                    )}
                    {/* Gradient overlay */}
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: "linear-gradient(0deg, rgba(0,35,111,0.3) 0%, rgba(0,35,111,0) 50%)",
                      }}
                    />
                  </div>
                ))}

                {/* Carousel controls */}
                {featuredProducts.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors"
                      style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
                    >
                      {ChevronLeft}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors"
                      style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
                    >
                      {ChevronRight}
                    </button>
                  </>
                )}
              </div>

              {/* Cold-Chain Badge (bottom-left) */}
              <div
                className="absolute bottom-4 left-0 lg:left-4 flex items-center gap-1 px-4 py-1 rounded-full z-10"
                style={{ backgroundColor: "#00236F" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#82F5C1">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                <span className="text-[11px] font-semibold text-white">
                  Suhu Simpan -18°C
                </span>
              </div>
            </div>
          </div>

          {/* Hero slide dots */}
          {featuredProducts.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              {featuredProducts.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: idx === heroSlide ? 24 : 8,
                    height: 8,
                    backgroundColor: idx === heroSlide ? "#1E3A8A" : "#DAE2FD",
                  }}
                />
              ))}
            </div>
          )}

          {/* Current product name under carousel */}
          {currentHeroProduct && (
            <div className="text-center mt-3">
              <p className="text-[14px] font-semibold" style={{ color: "#00236F" }}>
                {currentHeroProduct.namaBarang}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* TOP 5 BEST SELLERS SECTION */}
      {/* ═══════════════════════════════════════════════ */}
      {featuredProducts.length > 0 && (
        <section className="py-8" style={{ backgroundColor: "#FAF8FF" }}>
          <div className="max-w-[1280px] mx-auto px-6">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-6">
              <div className="flex flex-col gap-1">
                <span
                  className="text-[11px] font-bold uppercase"
                  style={{ color: "#006C4A", letterSpacing: "0.1em" }}
                >
                  FAVORIT KONSUMEN & RESTORAN
                </span>
                <h2
                  className="text-[24px] sm:text-[28px] font-bold"
                  style={{ color: "#00236F", letterSpacing: "-0.02em" }}
                >
                  5 Menu Pilihan Terbaik #1 SOJU
                </h2>
                <p className="text-[14px] leading-[20px]" style={{ color: "#444651" }}>
                  Dari siomay kukus hangat yang kenyal padat hingga tumpeng pesta eksklusif,
                  nikmati hidangan paling dicari keluarga Indonesia.
                </p>
              </div>

              <div className="flex items-center gap-1">
                <Link
                  href="/customer/menu"
                  className="inline-flex items-center justify-center px-4 py-1 rounded-full text-[13px] font-semibold text-white"
                  style={{ backgroundColor: "#1E3A8A", letterSpacing: "0.01em" }}
                >
                  Semua Top Menu
                </Link>
              </div>
            </div>

            {/* Bento Product Grid - matching Figma layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5">
              {/* Card 1 - Hero Card (7 cols, row layout) */}
              {featuredProducts[0] && (
                <div
                  className="lg:col-span-7 rounded-2xl bg-white overflow-hidden flex flex-col sm:flex-row cursor-pointer group transition-shadow hover:shadow-lg"
                  style={{ boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.05)" }}
                  onClick={() => handleTopMenuClick(featuredProducts[0])}
                >
                  <div className="sm:w-1/2 relative overflow-hidden">
                    {featuredProducts[0].gambar ? (
                      <img
                        src={getImageUrl(featuredProducts[0].gambar)}
                        alt={featuredProducts[0].namaBarang}
                        className="w-full h-full min-h-[220px] object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full min-h-[220px] flex items-center justify-center" style={{ background: "linear-gradient(135deg, #EAEDFF, #FFDCC3)" }}>
                        <span className="text-[64px]">🍜</span>
                      </div>
                    )}
                    {/* Rank badge */}
                    <div
                      className="absolute top-2 left-2 px-2.5 py-1 rounded-lg text-[11px] font-bold"
                      style={{ backgroundColor: "rgba(0,35,111,0.85)", color: "#82F5C1" }}
                    >
                      #1 Best Seller
                    </div>
                  </div>
                  <div className="sm:w-1/2 p-6 flex flex-col justify-between">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-[20px] font-bold" style={{ color: "#131B2E" }}>
                        {featuredProducts[0].namaBarang}
                      </h3>
                      {featuredProducts[0].varian && (
                        <span className="text-[13px]" style={{ color: "#757682" }}>
                          {featuredProducts[0].varian}
                        </span>
                      )}
                      {featuredProducts[0].deskripsi && (
                        <p className="text-[14px] mt-2 line-clamp-3" style={{ color: "#444651" }}>
                          {featuredProducts[0].deskripsi}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-4 mt-4" style={{ borderTop: "1px solid #E2E7FF" }}>
                      <span className="text-[18px] font-bold" style={{ color: "#00236F" }}>
                        Rp {Number(featuredProducts[0].hargaDefault || 0).toLocaleString("id-ID")}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleWhatsAppOrder(featuredProducts[0]); }}
                        className="inline-flex items-center gap-1.5 px-4 h-9 rounded-full text-[13px] font-semibold text-white transition-all hover:opacity-90"
                        style={{ backgroundColor: "#25D366" }}
                      >
                        {WhatsAppIcon}
                        Pesan
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Card 2 (5 cols, vertical) */}
              {featuredProducts[1] && (
                <ProductCard
                  product={featuredProducts[1]}
                  rank={2}
                  colSpan="lg:col-span-5"
                  onClick={() => handleTopMenuClick(featuredProducts[1])}
                  onOrder={() => handleWhatsAppOrder(featuredProducts[1])}
                />
              )}

              {/* Cards 3, 4, 5 (4 cols each) */}
              {featuredProducts.slice(2, 5).map((product, idx) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  rank={idx + 3}
                  colSpan="lg:col-span-4"
                  onClick={() => handleTopMenuClick(product)}
                  onOrder={() => handleWhatsAppOrder(product)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════ */}
      {/* FAST CHECKOUT / WHATSAPP ORDER LAUNCHER */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-8" style={{ backgroundColor: "#F2F3FF" }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-[152px]">
          <div
            className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 rounded-2xl"
            style={{ backgroundColor: "#FFFFFF", boxShadow: "0px 4px 6px -4px rgba(0,0,0,0.1), 0px 10px 15px -3px rgba(0,0,0,0.1)" }}
          >
            <div className="flex flex-col gap-2 text-center sm:text-left">
              <h2
                className="text-[22px] sm:text-[26px] font-bold"
                style={{ color: "#00236F", letterSpacing: "-0.02em" }}
              >
                Pesan Langsung via WhatsApp
              </h2>
              <p className="text-[14px]" style={{ color: "#444651" }}>
                Klik tombol di bawah untuk langsung pesan melalui WhatsApp. Cepat, mudah, tanpa ribet.
              </p>
            </div>
            <a
              href="https://wa.me/6281234567890?text=Halo%20kak%2C%20saya%20mau%20pesan%20dari%20SOJU.%20Bisa%20bantu%20saya%3F"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 h-12 rounded-full text-[15px] font-semibold text-white whitespace-nowrap transition-all hover:opacity-90"
              style={{ backgroundColor: "#25D366" }}
            >
              {WhatsAppIcon}
              Chat Sekarang
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* PRODUCT DETAIL MODAL (Popup) */}
      {/* ═══════════════════════════════════════════════ */}
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
            {/* Product image */}
            <div className="aspect-[4/3] rounded-xl overflow-hidden" style={{ backgroundColor: "#F2F3FF" }}>
              {selectedProduct.gambar ? (
                <img
                  src={getImageUrl(selectedProduct.gambar)}
                  alt={selectedProduct.namaBarang}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-[80px]">🍜</span>
                </div>
              )}
            </div>

            {/* Price & info */}
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

/* ───── Product Card Component ───── */
interface ProductCardProps {
  product: any;
  rank: number;
  colSpan: string;
  onClick: () => void;
  onOrder: () => void;
}

function ProductCard({ product, rank, colSpan, onClick, onOrder }: ProductCardProps) {
  return (
    <div
      className={`${colSpan} rounded-2xl bg-white overflow-hidden flex flex-col cursor-pointer group transition-shadow hover:shadow-lg`}
      style={{ boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.05)" }}
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: 176 }}>
        {product.gambar ? (
          <img
            src={getImageUrl(product.gambar)}
            alt={product.namaBarang}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #EAEDFF, #FFDCC3)" }}>
            <span className="text-[48px]">🍜</span>
          </div>
        )}
        {/* Rank badge */}
        <div
          className="absolute top-2 left-2 px-2.5 py-1 rounded-lg text-[11px] font-bold"
          style={{ backgroundColor: "rgba(0,35,111,0.85)", color: "#82F5C1" }}
        >
          #{rank}
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
        </div>

        <div className="flex items-center justify-between pt-4 mt-auto" style={{ borderTop: "1px solid #E2E7FF" }}>
          <span className="text-[15px] font-bold" style={{ color: "#00236F" }}>
            Rp {Number(product.hargaDefault || 0).toLocaleString("id-ID")}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); onOrder(); }}
            className="inline-flex items-center gap-1 px-3 h-8 rounded-full text-[12px] font-semibold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: "#25D366" }}
          >
            {WhatsAppIcon}
            Pesan
          </button>
        </div>
      </div>
    </div>
  );
}
