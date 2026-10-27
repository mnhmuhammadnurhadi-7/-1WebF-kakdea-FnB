"use client";

import { useState } from "react";
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
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const token = localStorage.getItem("auth_token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api/v1"}/cms/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const result = await response.json();
      if (result.success) {
        setProductForm((f) => ({ ...f, gambar: result.data.url }));
      }
    } catch (error) {
      setProductError(errMsg(error, "Gagal mengunggah gambar. Periksa file dan koneksi Anda."));
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
