export interface UserData {
  id?: number;
  nama: string;
  email: string;
  telepon: string;
  jabatan: string;
  toko: string;
  peran?: "ADMIN" | "SUPER_ADMIN";
}

export interface Pengaturan {
  notifWa: boolean;
  notifEmail: boolean;
  notifStok: boolean;
  notifOrder: boolean;
  tanggalAwalBulan: number;
  mataUang: string;
  bahasa: string;
}

export interface TokoData {
  nama: string;
  alamat: string;
  telepon: string;
  instagram: string;
  whatsapp: string;
  deskripsi: string;
}

export type ProfileTab = "akun" | "pengaturan";
