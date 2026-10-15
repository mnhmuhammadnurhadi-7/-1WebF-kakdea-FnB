"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

/** Nomor cadangan kalau CMS "kontak" belum diisi / gagal dimuat. */
export const FALLBACK_WA_NUMBER = "6281234567890";

/**
 * Daftar varian disimpan sebagai teks dipisah koma di kolom `produk.varian`.
 * Data lama (satu label, mis. "Original") tetap terbaca sebagai satu pilihan.
 */
export function parseVarian(raw?: string | null): string[] {
  if (!raw) return [];
  const seen = new Set<string>();
  return raw
    .split(",")
    .map((v) => v.trim())
    .filter((v) => {
      if (!v || seen.has(v.toLowerCase())) return false;
      seen.add(v.toLowerCase());
      return true;
    });
}

export function serializeVarian(list: string[]): string {
  return parseVarian(list.join(",")).join(", ");
}

/** "+62 812-3456-7890" / "0812..." / "812..." -> "628123456789" */
export function normalizeWaNumber(raw?: string | null): string {
  let digits = (raw || "").replace(/\D/g, "");
  if (!digits) return FALLBACK_WA_NUMBER;
  if (digits.startsWith("0")) digits = "62" + digits.slice(1);
  else if (!digits.startsWith("62")) digits = "62" + digits;
  return digits;
}

export interface OrderDraft {
  nama: string;
  varian?: string;
  jumlah: number;
  catatan?: string;
}

/** Template pesan WA. Baris varian & catatan hilang otomatis kalau kosong. */
export function buildOrderMessage({ nama, varian, jumlah, catatan }: OrderDraft): string {
  const lines = ["Halo kak, saya mau pesan:", `*${nama}*`];
  if (varian) lines.push(`Varian: ${varian}`);
  lines.push(`Jumlah: ${jumlah}`);
  const note = catatan?.trim();
  if (note) lines.push(`Catatan: ${note}`);
  lines.push("Terima kasih!");
  return lines.join("\n");
}

export function openWhatsApp(number: string, message: string) {
  const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

/* ───── Info kontak dari CMS (di-cache supaya tidak fetch berulang antar halaman) ───── */

export interface ContactInfo {
  telepon: string;
  email: string;
  alamat: string;
  waNumber: string;
}

const DEFAULT_CONTACT: ContactInfo = {
  telepon: "+62 812 3456 7890",
  email: "info@soju.com",
  alamat: "Jl. Contoh No. 123\nKota, Provinsi 12345",
  waNumber: FALLBACK_WA_NUMBER,
};

let cached: ContactInfo | null = null;
let inflight: Promise<ContactInfo> | null = null;

function loadContact(): Promise<ContactInfo> {
  if (cached) return Promise.resolve(cached);
  if (!inflight) {
    inflight = api.publicCms
      .getContentByKey("kontak")
      .then((res: any) => {
        const d = res?.success ? res.data : null;
        cached = d
          ? {
              telepon: d.judul || DEFAULT_CONTACT.telepon,
              email: d.subJudul || DEFAULT_CONTACT.email,
              alamat: d.konten || DEFAULT_CONTACT.alamat,
              waNumber: normalizeWaNumber(d.judul),
            }
          : DEFAULT_CONTACT;
        return cached;
      })
      .catch(() => DEFAULT_CONTACT)
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

export function useContactInfo(): ContactInfo {
  const [info, setInfo] = useState<ContactInfo>(cached || DEFAULT_CONTACT);
  useEffect(() => {
    let alive = true;
    loadContact().then((c) => alive && setInfo(c));
    return () => {
      alive = false;
    };
  }, []);
  return info;
}
