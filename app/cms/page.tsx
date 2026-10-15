"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { InputField } from "@/components/ui/InputField";
import { Modal } from "@/components/ui/Modal";
import { api, getImageUrl } from "@/lib/api";
import { parseVarian, serializeVarian } from "@/lib/whatsapp";
import { ErrorState } from "@/components/ui/ErrorState";
import { Notice } from "@/components/ui/Notice";

const PlusIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 3.33v9.34M3.33 8h9.34" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
const PencilIcon = (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M11.3 2.3a1.5 1.5 0 0 1 2.1 2.1L5.8 12l-3 .7.7-3 7.8-7.4Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
  </svg>
);
const TrashIcon = (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M3 4.5h10M6.5 4.5V3a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1.5M4.5 4.5 5 13a1 1 0 0 0 1 .9h4a1 1 0 0 0 1-.9l.5-8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill={filled ? "#F59E0B" : "none"}
    stroke={filled ? "#F59E0B" : "currentColor"}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

/** Batas harga mengikuti kolom database (DECIMAL 15,2 → maksimal 13 digit sebelum koma). */
const MAX_HARGA = 9_999_999_999_999;

export default function CMSPage() {
  const [activeTab, setActiveTab] = useState<"content" | "menu">("content");
  const [headlineContent, setHeadlineContent] = useState<any>(null);
  const [aboutContent, setAboutContent] = useState<any>(null);
  const [contactContent, setContactContent] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [starredIds, setStarredIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [notice, setNotice] = useState("");

  // Headline modal
  const [headlineModalOpen, setHeadlineModalOpen] = useState(false);
  const [headlineForm, setHeadlineForm] = useState({ judul: "", subJudul: "", deskripsi: "" });
  const [savingHeadline, setSavingHeadline] = useState(false);

  // Tentang Kami modal
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [aboutForm, setAboutForm] = useState({ judul: "", subJudul: "", deskripsi: "" });
  const [savingAbout, setSavingAbout] = useState(false);

  // Kontak modal
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ telepon: "", email: "", alamat: "" });
  const [savingContact, setSavingContact] = useState(false);

  // Product modal
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [productForm, setProductForm] = useState<{ namaBarang: string; hargaDefault: string; gambar: string; deskripsi: string; varian: string[] }>({ namaBarang: "", hargaDefault: "", gambar: "", deskripsi: "", varian: [] });
  const [varianDraft, setVarianDraft] = useState("");
  const [savingProduct, setSavingProduct] = useState(false);
  const [productError, setProductError] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const priceTooHigh = Number(productForm.hargaDefault) > MAX_HARGA;

  const loadData = async () => {
    try {
      const [headlineRes, aboutRes, contactRes, featuredRes, productsRes] = await Promise.all([
        api.publicCms.getContentByKey("headline_beranda").catch(() => null),
        api.publicCms.getContentByKey("tentang_kami").catch(() => null),
        api.publicCms.getContentByKey("kontak").catch(() => null),
        api.publicCms.getContentByKey("produk_unggulan").catch(() => null),
        api.products.getAll(undefined, true),
      ]);
      if (headlineRes?.success) setHeadlineContent(headlineRes.data);
      if (aboutRes?.success) setAboutContent(aboutRes.data);
      if (contactRes?.success) setContactContent(contactRes.data);
      if (productsRes.success) setProducts(productsRes.data);
      setLoadError(false);

      if (featuredRes?.success && featuredRes.data?.konten) {
        let ids: number[] = [];
        try {
          const parsed = JSON.parse(featuredRes.data.konten);
          if (Array.isArray(parsed)) ids = parsed;
        } catch {
          ids = featuredRes.data.konten.split(',').map((id: string) => parseInt(id.trim())).filter(Boolean);
        }
        // Buang bintang milik menu yang sudah dihapus supaya tidak ikut terhitung "Unggulan".
        if (productsRes.success) {
          const alive = new Set<number>(productsRes.data.map((p: any) => p.id));
          const cleaned = ids.filter((id) => alive.has(id));
          if (cleaned.length !== ids.length) {
            persistStarred(cleaned).catch(() => {});
          }
          ids = cleaned;
        }
        setStarredIds(ids);
      }
    } catch (error) {
      console.error("Error loading CMS data:", error);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  const persistStarred = (ids: number[]) =>
    api.cms.updateContent("produk_unggulan", {
      judul: "Produk Unggulan",
      subJudul: "Maksimal 5 produk",
      konten: JSON.stringify(ids),
    });

  const toggleStar = async (productId: number) => {
    const isCurrentlyStarred = starredIds.includes(productId);
    let newStarred: number[];

    if (isCurrentlyStarred) {
      newStarred = starredIds.filter((id) => id !== productId);
    } else {
      if (starredIds.length >= 5) {
        setNotice("Maksimal 5 menu yang dapat dijadikan Produk Unggulan.");
        return;
      }
      newStarred = [...starredIds, productId];
    }

    setStarredIds(newStarred);

    try {
      await persistStarred(newStarred);
    } catch (error: any) {
      setNotice("Gagal mengupdate produk unggulan: " + (error.message || "Silakan coba lagi."));
      setStarredIds(starredIds);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Open & Save Headline
  const openHeadlineModal = () => {
    if (headlineContent) {
      setHeadlineForm({
        judul: headlineContent.judul || "",
        subJudul: headlineContent.subJudul || "",
        deskripsi: headlineContent.konten || "",
      });
    } else {
      setHeadlineForm({ judul: "", subJudul: "", deskripsi: "" });
    }
    setHeadlineModalOpen(true);
  };

  const saveHeadline = async () => {
    if (!headlineForm.judul.trim()) {
      setNotice("Judul wajib diisi sebelum disimpan.");
      return;
    }
    setSavingHeadline(true);
    try {
      await api.cms.updateContent("headline_beranda", {
        judul: headlineForm.judul,
        subJudul: headlineForm.subJudul,
        konten: headlineForm.deskripsi,
      });
      setHeadlineModalOpen(false);
      loadData();
    } catch (error: any) {
      setNotice(error.message || "Gagal menyimpan headline. Silakan coba lagi.");
    } finally {
      setSavingHeadline(false);
    }
  };

  // Open & Save Tentang Kami
  const openAboutModal = () => {
    if (aboutContent) {
      setAboutForm({
        judul: aboutContent.judul || "",
        subJudul: aboutContent.subJudul || "",
        deskripsi: aboutContent.konten || "",
      });
    } else {
      setAboutForm({ judul: "Tentang Kami", subJudul: "", deskripsi: "" });
    }
    setAboutModalOpen(true);
  };

  const saveAbout = async () => {
    if (!aboutForm.judul.trim()) {
      setNotice("Judul wajib diisi sebelum disimpan.");
      return;
    }
    setSavingAbout(true);
    try {
      await api.cms.updateContent("tentang_kami", {
        judul: aboutForm.judul,
        subJudul: aboutForm.subJudul,
        konten: aboutForm.deskripsi,
      });
      setAboutModalOpen(false);
      loadData();
    } catch (error: any) {
      setNotice(error.message || "Gagal menyimpan konten Tentang Kami. Silakan coba lagi.");
    } finally {
      setSavingAbout(false);
    }
  };

  // Open & Save Kontak
  const openContactModal = () => {
    if (contactContent) {
      setContactForm({
        telepon: contactContent.judul || "",
        email: contactContent.subJudul || "",
        alamat: contactContent.konten || "",
      });
    } else {
      setContactForm({ telepon: "", email: "", alamat: "" });
    }
    setContactModalOpen(true);
  };

  const saveContact = async () => {
    if (!contactForm.telepon && !contactForm.email && !contactForm.alamat) {
      setNotice("Isi setidaknya satu informasi kontak sebelum menyimpan.");
      return;
    }
    if (contactForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email.trim())) {
      setNotice("Format email belum valid. Periksa kembali alamat email.");
      return;
    }
    setSavingContact(true);
    try {
      await api.cms.updateContent("kontak", {
        judul: contactForm.telepon,
        subJudul: contactForm.email,
        konten: contactForm.alamat,
      });
      setContactModalOpen(false);
      loadData();
    } catch (error: any) {
      setNotice(error.message || "Gagal menyimpan informasi kontak. Silakan coba lagi.");
    } finally {
      setSavingContact(false);
    }
  };

  const openProductModal = (product?: any) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        namaBarang: product.namaBarang,
        hargaDefault: String(product.hargaDefault),
        gambar: product.gambar || "",
        deskripsi: product.deskripsi || "",
        varian: parseVarian(product.varian),
      });
    } else {
      setEditingProduct(null);
      setProductForm({ namaBarang: "", hargaDefault: "", gambar: "", deskripsi: "", varian: [] });
    }
    setVarianDraft("");
    setProductError("");
    setProductModalOpen(true);
  };

  const addVarian = () => {
    const name = varianDraft.replace(/,/g, " ").replace(/\s+/g, " ").trim();
    if (!name) return;
    setProductForm((f) => ({ ...f, varian: parseVarian([...f.varian, name].join(",")).slice(0, 20) }));
    setVarianDraft("");
  };

  const removeVarian = (name: string) => {
    setProductForm((f) => ({ ...f, varian: f.varian.filter((v) => v !== name) }));
  };

  const saveProduct = async () => {
    const price = Number(productForm.hargaDefault);
    if (!productForm.namaBarang.trim() || !productForm.hargaDefault.trim() || !Number.isFinite(price) || price <= 0) {
      setProductError("Isi nama barang dan harga yang valid (lebih dari Rp 0) sebelum menyimpan.");
      return;
    }
    if (price > MAX_HARGA) {
      setProductError(`Harga melebihi batas. Maksimal Rp ${MAX_HARGA.toLocaleString("id-ID")}.`);
      return;
    }
    setProductError("");
    setSavingProduct(true);
    try {
      // Varian yang sudah diketik tapi belum ditekan "Tambah" ikut disimpan.
      const draft = varianDraft.replace(/,/g, " ").replace(/\s+/g, " ").trim();
      const varianList = parseVarian([...productForm.varian, draft].join(","));
      const productData = {
        // null = tanpa varian (juga menghapus varian lama saat edit)
        varian: varianList.length > 0 ? serializeVarian(varianList) : null,
        namaBarang: productForm.namaBarang,
        hargaDefault: price,
        gambar: productForm.gambar || undefined,
        deskripsi: productForm.deskripsi || undefined,
      };
      if (editingProduct) {
        await api.products.update(editingProduct.id, productData);
      } else {
        await api.products.create(productData);
      }
      setProductModalOpen(false);
      loadData();
    } catch (error: any) {
      setProductError(error.message || "Gagal menyimpan produk. Silakan coba lagi.");
    } finally {
      setSavingProduct(false);
    }
  };

  const deleteProduct = async (id: number) => {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;
    try {
      await api.products.delete(id);
      // Menu yang dihapus juga harus lepas dari daftar Unggulan.
      if (starredIds.includes(id)) {
        const next = starredIds.filter((sid) => sid !== id);
        setStarredIds(next);
        try {
          await persistStarred(next);
        } catch {
          // loadData berikutnya akan membersihkan sisa bintang secara otomatis
        }
      }
      loadData();
    } catch (error: any) {
      setNotice(error.message || "Gagal menghapus produk. Silakan coba lagi.");
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api/v1'}/cms/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const result = await response.json();
      if (result.success) {
        setProductForm((f) => ({ ...f, gambar: result.data.url }));
      }
    } catch (error: any) {
      setProductError(error.message || "Gagal mengunggah gambar. Periksa file dan koneksi Anda.");
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) {
    return (
      <AppLayout activeMenu="cms">
        <Notice message={notice} onDismiss={() => setNotice("")} />
        <div aria-label="Memuat konten CMS" className="mx-auto max-w-5xl space-y-5 py-5">
          <div className="skeleton-shimmer h-8 w-56 rounded-lg" />
          <div className="skeleton-shimmer h-4 w-80 max-w-full rounded" />
          <div className="skeleton-shimmer h-72 rounded-2xl border border-border" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout activeMenu="cms">
      <Notice message={notice} onDismiss={() => setNotice("")} />
      {loadError && <div className="mb-6"><ErrorState title="Konten CMS belum berhasil dimuat" description="Pastikan koneksi dan sesi masuk Anda aktif, lalu coba muat ulang data." onRetry={loadData} /></div>}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <h1 className="font-heading text-[28px] font-semibold text-ink leading-tight">
                CMS System
              </h1>
              <p className="text-[14px] text-muted">
                Kelola konten dan menu makanan untuk halaman customer
              </p>
            </div>
          </div>

          <div className="flex gap-2 border-b border-border pb-1">
            <button
              onClick={() => setActiveTab("content")}
              className={`px-4 py-2 text-[13px] font-semibold transition-colors ${
                activeTab === "content"
                  ? "text-ink border-b-2 border-accent"
                  : "text-muted hover:text-ink"
              }`}
            >
              Ubah Konten
            </button>
            <button
              onClick={() => setActiveTab("menu")}
              className={`px-4 py-2 text-[13px] font-semibold transition-colors ${
                activeTab === "menu"
                  ? "text-ink border-b-2 border-accent"
                  : "text-muted hover:text-ink"
              }`}
            >
              Menu Makanan
            </button>
          </div>
        </div>

        {activeTab === "content" ? (
          <div className="flex flex-col gap-6">
            {/* 1. Headline Beranda */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-heading text-[18px] font-semibold text-ink">
                    Headline Beranda
                  </h3>
                  <p className="text-[13px] text-muted">
                    Konten banner utama / hero section pada halaman beranda customer
                  </p>
                </div>
                <Button variant="primary" size="sm" leftIcon={PencilIcon} onClick={openHeadlineModal}>
                  Edit Headline
                </Button>
              </div>
              <div className="rounded-xl border border-border bg-card-alt p-4 flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">
                    Judul Utama
                  </span>
                  <p className="text-[15px] font-semibold text-ink">{headlineContent?.judul || "-"}</p>
                </div>
                {headlineContent?.subJudul && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">
                      Sub Judul
                    </span>
                    <p className="text-[14px] text-muted">{headlineContent.subJudul}</p>
                  </div>
                )}
                {headlineContent?.konten && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">
                      Deskripsi
                    </span>
                    <p className="text-[14px] text-muted whitespace-pre-wrap">{headlineContent.konten}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* 2. Tentang Kami */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-heading text-[18px] font-semibold text-ink">
                    Tentang Kami
                  </h3>
                  <p className="text-[13px] text-muted">
                    Informasi profil dan cerita Buku Dapur di halaman /customer/tentang
                  </p>
                </div>
                <Button variant="primary" size="sm" leftIcon={PencilIcon} onClick={openAboutModal}>
                  Edit Tentang Kami
                </Button>
              </div>
              <div className="rounded-xl border border-border bg-card-alt p-4 flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">
                    Judul
                  </span>
                  <p className="text-[15px] font-semibold text-ink">{aboutContent?.judul || "Tentang Kami"}</p>
                </div>
                {aboutContent?.subJudul && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">
                      Sub Judul / Tagline
                    </span>
                    <p className="text-[14px] text-muted">{aboutContent.subJudul}</p>
                  </div>
                )}
                {aboutContent?.konten && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">
                      Konten Lengkap
                    </span>
                    <p className="text-[14px] text-muted whitespace-pre-wrap">{aboutContent.konten}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* 3. Kontak & Alamat */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-heading text-[18px] font-semibold text-ink">
                    Informasi Kontak & Alamat
                  </h3>
                  <p className="text-[13px] text-muted">
                    Nomor WhatsApp, email, dan alamat toko di halaman /customer/kontak
                  </p>
                </div>
                <Button variant="primary" size="sm" leftIcon={PencilIcon} onClick={openContactModal}>
                  Edit Kontak
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl border border-border bg-card-alt p-4 flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">
                    📞 No. Telepon / WhatsApp
                  </span>
                  <p className="text-[14px] font-semibold text-ink">{contactContent?.judul || "-"}</p>
                </div>
                <div className="rounded-xl border border-border bg-card-alt p-4 flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">
                    ✉️ Email
                  </span>
                  <p className="text-[14px] font-semibold text-ink">{contactContent?.subJudul || "-"}</p>
                </div>
                <div className="rounded-xl border border-border bg-card-alt p-4 flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">
                    📍 Alamat
                  </span>
                  <p className="text-[14px] text-muted whitespace-pre-wrap">{contactContent?.konten || "-"}</p>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-heading text-[18px] font-semibold text-ink">
                    Menu Makanan
                  </h3>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
                    ⭐ {starredIds.length} / 5 Unggulan
                  </span>
                </div>
                <p className="text-[13px] text-muted mt-1">
                  Klik tombol <strong>Star ⭐</strong> pada menu (maksimal 5) untuk menampilkannya di bagian Produk Unggulan halaman depan.
                </p>
              </div>
              <Button variant="primary" size="sm" leftIcon={PlusIcon} onClick={() => openProductModal()}>
                Tambah Menu
              </Button>
            </div>
            <div className="flex flex-col gap-3">
              {products.length === 0 ? (
                <div className="text-center py-8 text-muted">Belum ada menu makanan</div>
              ) : (
                products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between rounded-xl border border-border bg-card-alt p-4"
                  >
                    <div className="flex items-center gap-4">
                      {product.gambar ? (
                        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center overflow-hidden">
                          <img
                            src={getImageUrl(product.gambar)}
                            alt={product.namaBarang}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
                          <span className="text-[24px]">🍜</span>
                        </div>
                      )}
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-semibold text-ink">{product.namaBarang}</span>
                          {starredIds.includes(product.id) && (
                            <span className="text-amber-500 text-[14px]" title="Produk Unggulan">★</span>
                          )}
                        </div>
                        <span className="text-[12px] font-medium text-ink">
                          Rp {Number(product.hargaDefault).toLocaleString("id-ID")}
                          {parseVarian(product.varian).length > 0 && (
                            <span className="ml-2 font-normal text-muted">
                              {parseVarian(product.varian).length} varian
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleStar(product.id)}
                        className={`px-3 py-1.5 rounded-lg border text-[12px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                          starredIds.includes(product.id)
                            ? "bg-amber-50 border-amber-400 text-amber-700 hover:bg-amber-100"
                            : "border-border bg-white text-muted hover:text-ink hover:border-amber-300"
                        }`}
                        title={
                          starredIds.includes(product.id)
                            ? "Hapus dari Produk Unggulan"
                            : "Jadikan Produk Unggulan (maks 5)"
                        }
                      >
                        <StarIcon filled={starredIds.includes(product.id)} />
                        <span>{starredIds.includes(product.id) ? "Unggulan" : "Star"}</span>
                      </button>
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={PencilIcon}
                        onClick={() => openProductModal(product)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={TrashIcon}
                        onClick={() => deleteProduct(product.id)}
                      >
                        Hapus
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        )}
      </div>

      {/* Headline Modal */}
      <Modal
        open={headlineModalOpen}
        onClose={() => setHeadlineModalOpen(false)}
        title="Edit Headline Beranda"
        width={500}
        footer={
          <>
            <Button variant="outline" size="md" onClick={() => setHeadlineModalOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" size="md" onClick={saveHeadline} disabled={savingHeadline}>
              {savingHeadline ? "Menyimpan..." : "Simpan"}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <InputField
            label="Judul"
            placeholder="Contoh: Selamat Datang di Buku Dapur"
            value={headlineForm.judul}
            onChange={(v) => setHeadlineForm((f) => ({ ...f, judul: v }))}
            required
          />
          <InputField
            label="Sub Judul"
            placeholder="Contoh: Frozen Food & Siap Saji Terbaik"
            value={headlineForm.subJudul}
            onChange={(v) => setHeadlineForm((f) => ({ ...f, subJudul: v }))}
          />
          <InputField
            label="Deskripsi"
            type="textarea"
            placeholder="Deskripsi lengkap untuk beranda..."
            value={headlineForm.deskripsi}
            onChange={(v) => setHeadlineForm((f) => ({ ...f, deskripsi: v }))}
            className="min-h-[120px]"
          />
        </div>
      </Modal>

      {/* Tentang Kami Modal */}
      <Modal
        open={aboutModalOpen}
        onClose={() => setAboutModalOpen(false)}
        title="Edit Tentang Kami"
        width={550}
        footer={
          <>
            <Button variant="outline" size="md" onClick={() => setAboutModalOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" size="md" onClick={saveAbout} disabled={savingAbout}>
              {savingAbout ? "Menyimpan..." : "Simpan"}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <InputField
            label="Judul"
            placeholder="Contoh: Tentang Kami"
            value={aboutForm.judul}
            onChange={(v) => setAboutForm((f) => ({ ...f, judul: v }))}
            required
          />
          <InputField
            label="Sub Judul / Tagline"
            placeholder="Contoh: Kualitas dan Kepercayaan"
            value={aboutForm.subJudul}
            onChange={(v) => setAboutForm((f) => ({ ...f, subJudul: v }))}
          />
          <InputField
            label="Konten / Cerita Profil"
            type="textarea"
            placeholder="Tuliskan cerita, visi, dan misi Buku Dapur..."
            value={aboutForm.deskripsi}
            onChange={(v) => setAboutForm((f) => ({ ...f, deskripsi: v }))}
            className="min-h-[150px]"
          />
        </div>
      </Modal>

      {/* Kontak Modal */}
      <Modal
        open={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        title="Edit Informasi Kontak & Alamat"
        width={500}
        footer={
          <>
            <Button variant="outline" size="md" onClick={() => setContactModalOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" size="md" onClick={saveContact} disabled={savingContact}>
              {savingContact ? "Menyimpan..." : "Simpan"}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <InputField
            label="No. Telepon / WhatsApp"
            placeholder="Contoh: +62 812 3456 7890 atau 081234567890"
            value={contactForm.telepon}
            onChange={(v) => setContactForm((f) => ({ ...f, telepon: v }))}
          />
          <InputField
            label="Email"
            type="email"
            placeholder="Contoh: info@bukudapur.com"
            value={contactForm.email}
            onChange={(v) => setContactForm((f) => ({ ...f, email: v }))}
          />
          <InputField
            label="Alamat Lengkap"
            type="textarea"
            placeholder="Contoh: Jl. Contoh No. 123, Kota, Provinsi 12345"
            value={contactForm.alamat}
            onChange={(v) => setContactForm((f) => ({ ...f, alamat: v }))}
            className="min-h-[100px]"
          />
        </div>
      </Modal>

      {/* Product Modal */}
      <Modal
        open={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        title={editingProduct ? "Edit Menu Makanan" : "Tambah Menu Makanan"}
        width={500}
        footer={
          <>
            <Button variant="outline" size="md" onClick={() => setProductModalOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" size="md" onClick={saveProduct} disabled={savingProduct}>
              {savingProduct ? "Menyimpan..." : "Simpan"}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          {productError && (
            <div role="alert" className="rounded-[10px] border border-red-200 bg-red-50 px-3.5 py-2.5 text-[13px] font-medium text-red-700">
              {productError}
            </div>
          )}
          <InputField
            label="Nama Makanan"
            placeholder="Contoh: Nasi Goreng Spesial"
            value={productForm.namaBarang}
            onChange={(v) => {
              setProductError("");
              setProductForm((f) => ({ ...f, namaBarang: v }));
            }}
            required
          />
          <InputField
            label="Harga"
            type="number"
            placeholder="Contoh: 25000"
            value={productForm.hargaDefault}
            onChange={(v) => {
              setProductError("");
              setProductForm((f) => ({ ...f, hargaDefault: v }));
            }}
            error={priceTooHigh ? `Harga melebihi batas. Maksimal Rp ${MAX_HARGA.toLocaleString("id-ID")}.` : undefined}
            required
          />
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-semibold text-ink">Upload Gambar</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file);
              }}
              disabled={uploadingImage}
              className="w-full text-[13px] text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-white hover:file:bg-orange-700"
            />
            {uploadingImage && <span className="text-[12px] text-muted">Uploading...</span>}
          </div>
          {productForm.gambar && (
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-semibold text-ink">Preview Gambar</label>
              <img
                src={getImageUrl(productForm.gambar)}
                alt="Preview"
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                onClick={() => setProductForm((f) => ({ ...f, gambar: "" }))}
                className="text-[12px] text-red-500 hover:text-red-700"
              >
                Hapus Gambar
              </button>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between">
              <label htmlFor="cms-varian" className="text-[12px] font-semibold text-muted">
                Varian <span className="font-normal">(opsional)</span>
              </label>
              {productForm.varian.length > 0 && (
                <span className="text-[11px] text-muted-light">{productForm.varian.length} varian</span>
              )}
            </div>
            {productForm.varian.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {productForm.varian.map((v) => (
                  <li
                    key={v}
                    className="flex items-center gap-1.5 rounded-full border border-border bg-card-alt py-1 pl-3 pr-1.5 text-[13px] text-ink"
                  >
                    <span>{v}</span>
                    <button
                      type="button"
                      onClick={() => removeVarian(v)}
                      aria-label={`Hapus varian ${v}`}
                      className="flex h-5 w-5 items-center justify-center rounded-full text-muted hover:bg-border hover:text-ink"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                        <path d="M18 6 6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex gap-2">
              <input
                id="cms-varian"
                value={varianDraft}
                onChange={(e) => setVarianDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addVarian();
                  }
                }}
                maxLength={60}
                placeholder="Contoh: Pakai sosis"
                className="w-full rounded-[10px] border border-border bg-card px-4 py-3 text-[14px] text-ink placeholder:text-muted-light transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
              <Button variant="outline" size="md" onClick={addVarian} disabled={!varianDraft.trim()}>
                Tambah
              </Button>
            </div>
            <p className="text-[12px] text-muted">
              Pelanggan memilih varian lewat dropdown saat memesan. Kosongkan kalau menu ini tidak punya varian.
            </p>
          </div>
          <InputField
            label="Deskripsi"
            type="textarea"
            placeholder="Deskripsi makanan..."
            value={productForm.deskripsi}
            onChange={(v) => setProductForm((f) => ({ ...f, deskripsi: v }))}
            className="min-h-[100px]"
          />
        </div>
      </Modal>
    </AppLayout>
  );
}
