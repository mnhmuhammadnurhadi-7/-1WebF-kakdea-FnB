export interface UserData {
  nama: string;
  email: string;
  telepon: string;
  jabatan: string;
  toko: string;
}

export interface TokoData {
  nama: string;
  alamat: string;
  telepon: string;
  instagram: string;
  whatsapp: string;
  deskripsi: string;
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

export type ProfileTab = "profil" | "akun" | "pengaturan";
