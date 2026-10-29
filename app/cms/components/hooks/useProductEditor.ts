"use client";

import { useState } from "react";
import { upload } from "@vercel/blob/client";
import { api } from "@/lib/api";
import { parseVarian, serializeVarian } from "@/lib/whatsapp";
import { MAX_HARGA } from "../shared/constants";
import { errMsg } from "../shared/format";
import type { Product, ProductForm } from "../shared/types";

const blankProduct = (): ProductForm => ({ namaBarang: "", hargaDefault: "", gambar: "", deskripsi: "", varian: [] });

/** Modal tambah/edit menu makanan (termasuk varian & upload gambar) — dipindah apa adanya dari halaman asli. */
export function useProductEditor({ loadData }: { loadData: () => Promise<void> }) {
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<ProductForm>(blankProduct());
  const [varianDraft, setVarianDraft] = useState("");
  const [savingProduct, setSavingProduct] = useState(false);
  const [productError, setProductError] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const priceTooHigh = Number(productForm.hargaDefault) > MAX_HARGA;

  const openProductModal = (product?: Product) => {
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
      setProductForm(blankProduct());
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
    } catch (error) {
      setProductError(errMsg(error, "Gagal menyimpan produk. Silakan coba lagi."));
    } finally {
      setSavingProduct(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    const extension = file.name.split(".").pop()?.toLowerCase();
    const allowedTypes = new Set(["image/png", "image/jpeg"]);
    const allowedExtensions = new Set(["png", "jpg", "jpeg"]);

    if (!extension || !allowedExtensions.has(extension) || !allowedTypes.has(file.type)) {
      setProductError("Format gambar harus PNG, JPG, atau JPEG.");
      return;
    }
    if (file.size >= 10 * 1024 * 1024) {
      setProductError("Ukuran gambar harus di bawah 10 MB.");
      return;
    }

    setUploadingImage(true);
    setProductError("");
    try {
      const blob = await upload(`menu-images/${crypto.randomUUID()}.${extension}`, file, {
        access: "public",
        contentType: file.type,
        handleUploadUrl: "/api/blob-upload",
        clientPayload: JSON.stringify({ authToken: localStorage.getItem("auth_token") }),
      });
      setProductForm((f) => ({ ...f, gambar: blob.url }));
    } catch (error) {
      setProductError(errMsg(error, "Gagal mengunggah gambar. Periksa konfigurasi Vercel Blob dan koneksi Anda."));
    } finally {
      setUploadingImage(false);
    }
  };

  return {
    productModalOpen,
    setProductModalOpen,
    editingProduct,
    productForm,
    setProductForm,
    varianDraft,
    setVarianDraft,
    savingProduct,
    productError,
    setProductError,
    uploadingImage,
    priceTooHigh,
    openProductModal,
    addVarian,
    removeVarian,
    saveProduct,
    handleImageUpload,
  };
}

export type ProductEditor = ReturnType<typeof useProductEditor>;
