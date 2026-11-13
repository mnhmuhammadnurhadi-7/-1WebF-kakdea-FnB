"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { MAX_UNGGULAN } from "./constants";
import { errMsg } from "./format";
import type { CmsContent, Product } from "./types";
import { useToast } from "@/components/feedback/ToastProvider";
import { useConfirm } from "@/components/feedback/ConfirmDialog";

/** Memuat semua konten CMS + daftar menu, dan mengelola Produk Unggulan (bintang). Logic dari halaman asli. */
export function useCmsData() {
  const [headlineContent, setHeadlineContent] = useState<CmsContent>(null);
  const [aboutContent, setAboutContent] = useState<CmsContent>(null);
  const [contactContent, setContactContent] = useState<CmsContent>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [starredIds, setStarredIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const toast = useToast();
  const { confirm, dialog: confirmDialog } = useConfirm();
  /** Pesan kendala singkat → toast (menggantikan kotak notice lama). */
  const setNotice = (msg: string) => {
    if (msg) toast.error("Terjadi kendala", { description: msg });
  };
  const persistStarred = (ids: number[]) =>
    api.cms.updateContent("produk_unggulan", {
      judul: "Produk Unggulan",
      subJudul: "Maksimal 5 produk",
      konten: JSON.stringify(ids),
    });

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
          ids = featuredRes.data.konten.split(",").map((id: string) => parseInt(id.trim())).filter(Boolean);
        }
        // Buang bintang milik menu yang sudah dihapus supaya tidak ikut terhitung "Unggulan".
        if (productsRes.success) {
          const alive = new Set<number>(productsRes.data.map((p: Product) => p.id));
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

  const toggleStar = async (productId: number) => {
    const isCurrentlyStarred = starredIds.includes(productId);
    let newStarred: number[];

    if (isCurrentlyStarred) {
      newStarred = starredIds.filter((id) => id !== productId);
    } else {
      if (starredIds.length >= MAX_UNGGULAN) {
        setNotice("Maksimal 5 menu yang dapat dijadikan Produk Unggulan.");
        return;
      }
      newStarred = [...starredIds, productId];
    }

    setStarredIds(newStarred);

    try {
      await persistStarred(newStarred);
    } catch (error) {
      setNotice("Gagal mengupdate produk unggulan: " + errMsg(error, "Silakan coba lagi."));
      setStarredIds(starredIds);
    }
  };

  const deleteProduct = async (id: number) => {
    const target = products.find((p) => p.id === id);
    const ok = await confirm({
      title: "Hapus menu ini?",
      detail: target?.namaBarang,
      description: "Menu akan hilang dari halaman customer. Tindakan ini tidak bisa dibatalkan.",
      confirmLabel: "Ya, hapus menu",
    });
    if (!ok) return;
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
      toast.info("Menu dihapus", { tag: "DIHAPUS", icon: "trash", description: target?.namaBarang });
    } catch (error) {
      setNotice(errMsg(error, "Gagal menghapus produk. Silakan coba lagi."));
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    headlineContent,
    aboutContent,
    contactContent,
    products,
    starredIds,
    loading,
    loadError,
    setNotice,
    confirmDialog,
    loadData,
    toggleStar,
    deleteProduct,
  };
}
