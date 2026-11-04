/** Satu blok konten CMS (judul/subJudul/konten) — kontak memakai field yang sama (telepon/email/alamat). */
export type CmsContent = { judul?: string; subJudul?: string; konten?: string } | null;

export type Product = {
  id: number;
  namaBarang: string;
  hargaDefault: number | string;
  gambar?: string | null;
  deskripsi?: string | null;
  varian?: string | null;
};

export type ProductForm = { namaBarang: string; hargaDefault: string; gambar: string; deskripsi: string; varian: string[] };
export type TextForm = { judul: string; subJudul: string; deskripsi: string };
export type ContactForm = { telepon: string; email: string; alamat: string };
