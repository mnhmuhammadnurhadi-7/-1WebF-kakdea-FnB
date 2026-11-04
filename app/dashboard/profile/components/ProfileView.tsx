"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { AkunTab } from "./AkunTab";
import { PengaturanTab } from "./PengaturanTab";
import { ProfilTokoTab } from "./ProfilTokoTab";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileHero } from "./ProfileHero";
import { ProfileTabs } from "./ProfileTabs";
import type { Pengaturan, TokoData, UserData } from "./types";

/** Logic profil (muat akun, state form, tombol simpan) dari kode teman; tampilannya memakai komponen di atas. */
export function ProfileView() {
  const router = useRouter();
  const [tab, setTab] = useState("profil");
  const [savedFlash, setSavedFlash] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  const [user, setUser] = useState<UserData>({
    nama: "",
    email: "",
    telepon: "",
    jabatan: "Pemilik Toko",
    toko: "Buku Dapur",
  });

  const [toko, setToko] = useState<TokoData>({
    nama: "Buku Dapur — Frozen & Siap Saji",
    alamat: "",
    telepon: "",
    instagram: "",
    whatsapp: "",
    deskripsi: "",
  });

  const [pengaturan, setPengaturan] = useState<Pengaturan>({
    notifWa: true,
    notifEmail: false,
    notifStok: true,
    notifOrder: true,
    tanggalAwalBulan: 1,
    mataUang: "IDR (Rp)",
    bahasa: "Bahasa Indonesia",
  });

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/login");
      return;
    }

    async function fetchUser() {
      try {
        const res = await api.auth.getMe();
        if (res.success && res.data) {
          setUser((prev) => ({
            ...prev,
            nama: res.data.nama || prev.nama,
            email: res.data.email || prev.email,
          }));
          setToko((prev) => ({
            ...prev,
            nama: res.data.nama ? `${res.data.nama} — Buku Dapur` : prev.nama,
            telepon: prev.telepon || "",
          }));
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoadingUser(false);
      }
    }

    fetchUser();
  }, [router]);

  // `loadingUser` dipertahankan seperti kode asli (belum dipakai di tampilan).
  void loadingUser;

  const handleSimpan = () => {
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2200);
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <ProfileHeader savedFlash={savedFlash} />
        <ProfileHero toko={toko} user={user} onSave={handleSimpan} />
        <ProfileTabs value={tab} onChange={setTab} />

        {tab === "profil" && <ProfilTokoTab toko={toko} onToko={setToko} onSave={handleSimpan} />}
        {tab === "akun" && <AkunTab user={user} onUser={setUser} onSave={handleSimpan} />}
        {tab === "pengaturan" && <PengaturanTab pengaturan={pengaturan} onPengaturan={setPengaturan} onSave={handleSimpan} />}
      </div>
    </>
  );
}
