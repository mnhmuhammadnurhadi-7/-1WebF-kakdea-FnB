"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { InputField } from "@/components/ui/InputField";
import { Modal } from "@/components/ui/Modal";
import { api, getImageUrl } from "@/lib/api";

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

export default function CMSPage() {
  const [activeTab, setActiveTab] = useState<"content" | "menu">("content");
  const [headlineContent, setHeadlineContent] = useState<any>(null);
  const [aboutContent, setAboutContent] = useState<any>(null);
  const [contactContent, setContactContent] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [starredIds, setStarredIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

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
  const [productForm, setProductForm] = useState({ namaBarang: "", hargaDefault: "", gambar: "", deskripsi: "" });
  const [savingProduct, setSavingProduct] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

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

      if (featuredRes?.success && featuredRes.data?.konten) {
        try {
          const parsed = JSON.parse(featuredRes.data.konten);
          if (Array.isArray(parsed)) setStarredIds(parsed);
        } catch {
          const ids = featuredRes.data.konten.split(',').map((id: string) => parseInt(id.trim())).filter(Boolean);
          setStarredIds(ids);
        }
      }
    } catch (error) {
      console.error("Error loading CMS data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStar = async (productId: number) => {
    const isCurrentlyStarred = starredIds.includes(productId);
    let newStarred: number[];

    if (isCurrentlyStarred) {
      newStarred = starredIds.filter((id) => id !== productId);
    } else {
      if (starredIds.length >= 5) {
        alert("Maksimal 5 menu yang dapat dijadikan Produk Unggulan!");
        return;
      }
      newStarred = [...starredIds, productId];
    }

    setStarredIds(newStarred);

    try {
      await api.cms.updateContent("produk_unggulan", {
        judul: "Produk Unggulan",
        subJudul: "Maksimal 5 produk",
        konten: JSON.stringify(newStarred),
      });
    } catch (error: any) {
      alert("Gagal mengupdate status unggulan: " + (error.message || "Error"));
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
    if (!headlineForm.judul) {
      alert("Judul wajib diisi");
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
      alert(error.message || "Gagal menyimpan headline");
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
    if (!aboutForm.judul) {
      alert("Judul wajib diisi");
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
      alert(error.message || "Gagal menyimpan Tentang Kami");
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
      alert("Setidaknya isi salah satu informasi kontak");
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
      alert(error.message || "Gagal menyimpan Kontak");
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
      });
    } else {
      setEditingProduct(null);
      setProductForm({ namaBarang: "", hargaDefault: "", gambar: "", deskripsi: "" });
    }
    setProductModalOpen(true);
  };

  const saveProduct = async () => {
    if (!productForm.namaBarang || !productForm.hargaDefault) {
      alert("Nama Barang dan Harga wajib diisi");
      return;
    }
    setSavingProduct(true);
    try {
      const productData = {
        namaBarang: productForm.namaBarang,
        hargaDefault: Number(productForm.hargaDefault),
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
      alert(error.message || "Gagal menyimpan produk");
    } finally {
      setSavingProduct(false);
    }
  };

  const deleteProduct = async (id: number) => {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;
    try {
      await api.products.delete(id);
      loadData();
    } catch (error: any) {
      alert(error.message || "Gagal menghapus produk");
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
      alert(error.message || "Gagal upload gambar");
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) {
    return (
      <AppLayout activeMenu="cms">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted">Loading CMS data...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout activeMenu="cms">
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
          <InputField
            label="Nama Makanan"
            placeholder="Contoh: Nasi Goreng Spesial"
            value={productForm.namaBarang}
            onChange={(v) => setProductForm((f) => ({ ...f, namaBarang: v }))}
            required
          />
          <InputField
            label="Harga"
            type="number"
            placeholder="Contoh: 25000"
            value={productForm.hargaDefault}
            onChange={(v) => setProductForm((f) => ({ ...f, hargaDefault: v }))}
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
