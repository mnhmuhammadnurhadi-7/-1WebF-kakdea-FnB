"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { OrderModal } from "@/components/customer/OrderModal";
import { ProductCard } from "@/components/customer/ProductCard";
import { ProductVisual } from "@/components/customer/ProductVisual";
import { WhatsAppIcon } from "@/components/customer/icons";
import { openWhatsApp, parseVarian, useContactInfo } from "@/lib/whatsapp";

const ChevronLeft = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const ChevronRight = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const SLIDE_MS = 5000;

export default function CustomerHomePage() {
  const contact = useContactInfo();
  const [headline, setHeadline] = useState<any>(null);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [hasProducts, setHasProducts] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [heroSlide, setHeroSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [headlineRes, featuredRes, productsRes] = await Promise.all([
          api.publicCms.getContentByKey("headline_beranda").catch(() => null),
          api.publicCms.getContentByKey("produk_unggulan").catch(() => null),
          api.publicProducts.getAll().catch(() => ({ success: false, data: [] })),
        ]);

        if (headlineRes?.success && headlineRes.data) setHeadline(headlineRes.data);

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
          setHasProducts(productsRes.data.length > 0);
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

  /* ─── Hero auto-slide: berhenti saat di-hover/fokus, tab disembunyikan, atau sheet pesanan terbuka ─── */
  const count = featuredProducts.length;
  const stopTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  useEffect(() => {
    stopTimer();
    if (count < 2 || paused || selectedProduct) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    intervalRef.current = setInterval(() => {
      if (document.hidden) return;
      setHeroSlide((prev) => (prev + 1) % count);
    }, SLIDE_MS);
    return stopTimer;
  }, [count, paused, selectedProduct, heroSlide, stopTimer]);

  const go = (idx: number) => setHeroSlide(((idx % count) + count) % count);

  const currentHero = featuredProducts[heroSlide];

  /* ─── Skeleton saat memuat ─── */
  if (loading) {
    return (
      <section style={{ backgroundColor: "#FAF8FF" }}>
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-10 px-5 py-12 sm:px-6 lg:grid-cols-12 lg:py-16">
          <div className="flex flex-col gap-4 lg:col-span-5">
            <div className="c-skeleton h-10 w-11/12 rounded-xl" />
            <div className="c-skeleton h-10 w-8/12 rounded-xl" />
            <div className="c-skeleton mt-2 h-4 w-full rounded-md" />
            <div className="c-skeleton h-4 w-10/12 rounded-md" />
            <div className="c-skeleton mt-3 h-11 w-48 rounded-full" />
          </div>
          <div className="flex justify-center lg:col-span-7">
            <div className="c-skeleton aspect-square w-[min(80vw,420px)] rounded-full" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* ═════════ HERO ═════════ */}
      <section className="relative overflow-hidden" style={{ backgroundColor: "#FAF8FF" }}>
        <div className="mx-auto max-w-[1280px] px-5 pb-12 pt-8 sm:px-6 lg:pb-16 lg:pt-12">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-6">
            {/* Teks */}
            <div className="c-rise flex flex-col gap-6 lg:col-span-5">
              <div
                className="inline-flex w-fit items-center gap-2 rounded-full px-3.5 py-1.5"
                style={{ backgroundColor: "#EAEDFF" }}
              >
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "#006C4A" }} />
                <span className="text-[12.5px] font-semibold" style={{ color: "#00236F" }}>
                  Garansi cold-chain 100% segar H+0
                </span>
              </div>

              <div className="flex flex-col gap-3">
                <h1
                  className="whitespace-pre-line text-[38px] font-bold leading-[1.06] sm:text-[46px] lg:text-[52px]"
                  style={{ color: "#00236F", letterSpacing: "-0.035em" }}
                >
                  {headline?.judul || "Sensasi Kelezatan Autentik & Segar dari Resep Pilihan SOJU"}
                </h1>
                {headline?.subJudul && (
                  <p className="whitespace-pre-line text-[18px] font-semibold leading-snug" style={{ color: "#006C4A" }}>
                    {headline.subJudul}
                  </p>
                )}
              </div>

              <p className="max-w-[46ch] whitespace-pre-line text-[16px] leading-[26px]" style={{ color: "#444651" }}>
                {headline?.konten ||
                  "Sajian kuliner nusantara siap santap dan produk beku berstandar HACCP. Dibuat dari olahan murni daging ikan tenggiri segar & ayam pilihan tanpa bahan pengawet sintetik."}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/customer/menu"
                  className="c-press inline-flex h-12 items-center justify-center rounded-full px-8 text-[15px] font-semibold text-white"
                  style={{ backgroundColor: "#1E3A8A" }}
                >
                  Lihat Semua Menu
                </Link>
                <Link
                  href="/customer/kontak"
                  className="c-press inline-flex h-12 items-center justify-center rounded-full border px-7 text-[15px] font-semibold"
                  style={{ color: "#00236F", backgroundColor: "#FFFFFF", borderColor: "#DAE2FD" }}
                >
                  Hubungi Kami
                </Link>
              </div>
            </div>

            {/* Platter carousel */}
            <div
              className="c-rise relative flex min-h-[320px] flex-col items-center justify-center lg:col-span-7 lg:min-h-[480px]"
              style={{ animationDelay: "120ms" }}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onFocus={() => setPaused(true)}
              onBlur={() => setPaused(false)}
              role="group"
              aria-roledescription="carousel"
              aria-label="Menu unggulan"
            >
              <div
                className="absolute rounded-full"
                style={{
                  width: "clamp(320px, 42vw, 520px)",
                  height: "clamp(320px, 42vw, 520px)",
                  background: "linear-gradient(45deg, rgba(130,245,193,0.4) 0%, rgba(218,226,253,1) 50%, rgba(255,183,125,0.3) 100%)",
                }}
                aria-hidden="true"
              />

              <div
                className="relative overflow-hidden rounded-full bg-white"
                style={{
                  width: "clamp(270px, 34vw, 430px)",
                  height: "clamp(270px, 34vw, 430px)",
                  padding: 8,
                  boxShadow: "0px 28px 56px -16px rgba(0, 35, 111, 0.35)",
                }}
              >
                <div className="relative h-full w-full overflow-hidden rounded-full">
                  {count === 0 ? (
                    <ProductVisual src={null} alt="Menu SOJU" />
                  ) : (
                    featuredProducts.map((product, idx) => (
                      <button
                        key={product.id}
                        type="button"
                        tabIndex={idx === heroSlide ? 0 : -1}
                        aria-hidden={idx !== heroSlide}
                        aria-label={`Pesan ${product.namaBarang}`}
                        onClick={() => setSelectedProduct(product)}
                        className="c-hero-slide absolute inset-0 cursor-pointer"
                        data-active={idx === heroSlide}
                      >
                        <ProductVisual src={product.gambar} alt={product.namaBarang} eager={idx === 0} />
                        <span
                          className="absolute inset-0"
                          style={{ background: "linear-gradient(0deg, rgba(0,35,111,0.28) 0%, rgba(0,35,111,0) 50%)" }}
                        />
                      </button>
                    ))
                  )}
                </div>

                {count > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => go(heroSlide - 1)}
                      aria-label="Menu sebelumnya"
                      className="c-press absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full"
                      style={{ backgroundColor: "rgba(255,255,255,0.88)", color: "#00236F", boxShadow: "0 2px 10px rgba(0,0,0,0.16)" }}
                    >
                      {ChevronLeft}
                    </button>
                    <button
                      type="button"
                      onClick={() => go(heroSlide + 1)}
                      aria-label="Menu berikutnya"
                      className="c-press absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full"
                      style={{ backgroundColor: "rgba(255,255,255,0.88)", color: "#00236F", boxShadow: "0 2px 10px rgba(0,0,0,0.16)" }}
                    >
                      {ChevronRight}
                    </button>
                  </>
                )}
              </div>

              <div
                className="absolute bottom-6 left-0 z-10 flex items-center gap-1.5 rounded-full px-4 py-1.5 lg:bottom-10 lg:left-6"
                style={{ backgroundColor: "#00236F" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#82F5C1" aria-hidden="true">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                <span className="text-[12px] font-semibold text-white">Suhu simpan -18°C</span>
              </div>

              {currentHero && (
                <div className="relative mt-6 flex flex-col items-center gap-3">
                  <p className="text-center text-[15px] font-semibold" style={{ color: "#00236F" }} aria-live="polite">
                    {currentHero.namaBarang}
                  </p>
                  {count > 1 && (
                    <div className="flex items-center gap-2">
                      {featuredProducts.map((p, idx) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => go(idx)}
                          aria-label={`Tampilkan ${p.namaBarang}`}
                          aria-current={idx === heroSlide}
                          className="flex h-6 items-center"
                        >
                          <span
                            className="block h-2 rounded-full transition-[width,background-color] duration-300 ease-out"
                            style={{ width: idx === heroSlide ? 24 : 8, backgroundColor: idx === heroSlide ? "#1E3A8A" : "#C3CCEE" }}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═════════ MENU PILIHAN ═════════ */}
      {count > 0 && (
        <section className="py-10 sm:py-14" style={{ backgroundColor: "#FAF8FF" }}>
          <div className="mx-auto max-w-[1280px] px-5 sm:px-6">
            <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div className="flex max-w-2xl flex-col gap-2">
                <h2 className="text-[26px] font-bold leading-tight sm:text-[32px]" style={{ color: "#00236F", letterSpacing: "-0.025em" }}>
                  5 Menu Pilihan Terbaik #1 SOJU
                </h2>
                <p className="text-[15px] leading-[24px]" style={{ color: "#444651" }}>
                  Dari siomay kukus hangat yang kenyal padat hingga tumpeng pesta eksklusif, nikmati hidangan paling dicari keluarga Indonesia.
                </p>
              </div>
              <Link
                href="/customer/menu"
                className="c-press inline-flex h-10 shrink-0 items-center justify-center rounded-full px-5 text-[14px] font-semibold text-white"
                style={{ backgroundColor: "#1E3A8A" }}
              >
                Semua Menu
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-12">
              <FeaturedWide product={featuredProducts[0]} onOpen={setSelectedProduct} />
              {featuredProducts[1] && (
                <div className="lg:col-span-5">
                  <ProductCard product={featuredProducts[1]} onOpen={setSelectedProduct} badge="#2" imageHeight={220} className="h-full" />
                </div>
              )}
              {featuredProducts.slice(2, 5).map((product, idx) => (
                <div key={product.id} className="lg:col-span-4">
                  <ProductCard product={product} onOpen={setSelectedProduct} badge={`#${idx + 3}`} className="h-full" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {!hasProducts && (
        <section className="py-14" style={{ backgroundColor: "#FAF8FF" }}>
          <p className="mx-auto max-w-md px-6 text-center text-[15px]" style={{ color: "#757682" }}>
            Menu sedang disiapkan. Silakan kembali lagi sebentar lagi, atau hubungi kami lewat WhatsApp.
          </p>
        </section>
      )}

      {/* ═════════ PESAN LANGSUNG ═════════ */}
      <section className="px-5 py-10 sm:px-6 sm:py-14" style={{ backgroundColor: "#F2F3FF" }}>
        <div
          className="mx-auto flex max-w-[960px] flex-col items-center justify-between gap-6 rounded-3xl bg-white p-8 sm:flex-row sm:p-10"
          style={{ boxShadow: "0px 12px 32px -12px rgba(0, 35, 111, 0.18)" }}
        >
          <div className="flex flex-col gap-2 text-center sm:text-left">
            <h2 className="text-[22px] font-bold sm:text-[26px]" style={{ color: "#00236F", letterSpacing: "-0.02em" }}>
              Pesan Langsung via WhatsApp
            </h2>
            <p className="text-[14.5px] leading-[22px]" style={{ color: "#444651" }}>
              Klik tombol di samping untuk langsung pesan melalui WhatsApp. Cepat, mudah, tanpa ribet.
            </p>
          </div>
          <button
            type="button"
            onClick={() => openWhatsApp(contact.waNumber, "Halo kak, saya mau pesan dari SOJU. Bisa bantu saya?")}
            className="c-press inline-flex h-12 shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-8 text-[15px] font-semibold text-white"
            style={{ backgroundColor: "#25D366" }}
          >
            {WhatsAppIcon}
            Chat Sekarang
          </button>
        </div>
      </section>

      <OrderModal product={selectedProduct} waNumber={contact.waNumber} onClose={() => setSelectedProduct(null)} />
    </>
  );
}

/* ───── Kartu besar untuk menu #1 ───── */
function FeaturedWide({ product, onOpen }: { product: any; onOpen: (p: any) => void }) {
  if (!product) return null;
  const varian = parseVarian(product.varian);
  const varianHint = varian.length > 1 ? `${varian.length} varian` : varian[0];

  return (
    <button
      type="button"
      onClick={() => onOpen(product)}
      aria-label={`Pesan ${product.namaBarang}`}
      className="c-card group flex flex-col overflow-hidden rounded-2xl bg-white text-left sm:col-span-2 sm:flex-row lg:col-span-7"
    >
      <div className="relative min-h-[220px] overflow-hidden sm:w-1/2" style={{ backgroundColor: "#F2F3FF" }}>
        <ProductVisual src={product.gambar} alt={product.namaBarang} className="c-card-img absolute inset-0" />
        <span
          className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11.5px] font-semibold"
          style={{ backgroundColor: "rgba(0,35,111,0.88)", color: "#82F5C1" }}
        >
          #1 Best Seller
        </span>
      </div>
      <div className="flex flex-col justify-between gap-6 p-6 sm:w-1/2">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-[22px] font-bold leading-tight" style={{ color: "#131B2E", letterSpacing: "-0.015em" }}>
            {product.namaBarang}
          </h3>
          {varianHint && (
            <span className="text-[13px]" style={{ color: "#757682" }}>
              {varianHint}
            </span>
          )}
          {product.deskripsi && (
            <p className="mt-2 line-clamp-4 text-[14px] leading-[22px]" style={{ color: "#444651" }}>
              {product.deskripsi}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-[20px] font-bold tabular-nums" style={{ color: "#00236F" }}>
            Rp {Number(product.hargaDefault || 0).toLocaleString("id-ID")}
          </span>
          <span
            className="c-card-cta inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-[14px] font-semibold text-white"
            style={{ backgroundColor: "#25D366" }}
          >
            {WhatsAppIcon}
            Pesan
          </span>
        </div>
      </div>
    </button>
  );
}
