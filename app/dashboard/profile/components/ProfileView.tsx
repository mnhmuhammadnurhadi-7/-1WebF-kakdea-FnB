"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { AkunTab } from "./AkunTab";
import { PengaturanTab } from "./PengaturanTab";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileTabs } from "./ProfileTabs";
import type { Pengaturan, UserData } from "./types";

export function ProfileView() {
  const router = useRouter();
  const [tab, setTab] = useState("akun");
  const [savedFlash, setSavedFlash] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [user, setUser] = useState<UserData>({
    nama: "",
    email: "",
    telepon: "",
    jabatan: "Pemilik Toko",
    toko: "Buku Dapur",
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
            id: res.data.id,
            nama: res.data.nama || prev.nama,
            email: res.data.email || prev.email,
            peran: res.data.peran,
            jabatan: res.data.peran === "SUPER_ADMIN" ? "Super Admin" : "Admin",
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

  void loadingUser;

  const handleSimpan = async () => {
    try {
      const result = await api.auth.updateMe({ nama: user.nama, email: user.email });
      setUser((prev) => ({ ...prev, id: result.data.id, peran: result.data.peran, nama: result.data.nama, email: result.data.email }));
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2200);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Profil belum dapat disimpan.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <ProfileHeader savedFlash={savedFlash} />
      <ProfileTabs value={tab} onChange={setTab} />
      {tab === "akun" && <AkunTab user={user} onUser={setUser} onSave={handleSimpan} />}
      {tab === "pengaturan" && <PengaturanTab pengaturan={pengaturan} onPengaturan={setPengaturan} onSave={handleSimpan} />}
    </div>
  );
}
