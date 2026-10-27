"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { InputField } from "@/components/ui/InputField";
import { ChipSelector, type ChipOption } from "@/components/ui/ChipSelector";
import { api } from "@/lib/api";

const tabOptions: ChipOption[] = [
  { id: "profil", label: "Profil Toko" },
  { id: "akun", label: "Akun Pengguna" },
  { id: "pengaturan", label: "Pengaturan" },
];

const UserIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const StoreIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l1.5-5h15L21 9" />
    <path d="M3 9v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V9" />
    <path d="M3 9h18" />
    <path d="M9 21V13h6v8" />
  </svg>
);

const BellIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

const ShieldIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
  </svg>
);

interface UserData {
  nama: string;
  email: string;
  telepon: string;
  jabatan: string;
  toko: string;
}

interface TokoData {
  nama: string;
  alamat: string;
  telepon: string;
  instagram: string;
  whatsapp: string;
  deskripsi: string;
}

interface Pengaturan {
  notifWa: boolean;
  notifEmail: boolean;
  notifStok: boolean;
  notifOrder: boolean;
  tanggalAwalBulan: number;
  mataUang: string;
  bahasa: string;
}

export default function ProfilePage() {
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

  const handleSimpan = () => {
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2200);
  };

  return (
    <AppLayout activeMenu="profile">
      <div className="flex flex-col gap-6">
        {/* Page Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="font-heading text-[28px] font-semibold text-ink leading-tight">
              Profil & Pengaturan
            </h1>
            <p className="text-[14px] text-muted">
              Kelola data toko, akun pengguna, dan preferensi aplikasi Buku Dapur.
            </p>
          </div>
          {savedFlash && (
            <Badge variant="success" className="px-3 py-1.5 text-[12px]">
              ✅ Perubahan berhasil disimpan
            </Badge>
          )}
        </div>

        {/* Profile Hero Card */}
        <Card className="overflow-hidden" padding="none">
          <div className="h-28 bg-gradient-to-r from-teal-active via-teal-deep to-teal-active" />
          <div className="flex flex-wrap items-end justify-between gap-4 px-6 pb-6 -mt-10">
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-accent border-4 border-card shadow-card">
                <span className="font-heading text-[28px] font-black text-white">
                  {toko.nama ? toko.nama.slice(0, 2).toUpperCase() : "BD"}
                </span>
              </div>
              <div className="flex flex-col gap-1 pb-1">
                <h2 className="font-heading text-[22px] font-bold text-ink leading-tight">
                  {toko.nama}
                </h2>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="manual">{user.jabatan}</Badge>
                  <Badge variant="source">{user.nama}</Badge>
                  <Badge variant="ai">Aktif</Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 pb-1">
              <Button variant="outline" size="md">
                Bagikan Toko
              </Button>
              <Button variant="primary" size="md" onClick={handleSimpan}>
                Simpan Semua
              </Button>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-border pb-1">
          <ChipSelector options={tabOptions} value={tab} onChange={setTab} />
        </div>

        {/* Tab Content: Profil Toko */}
        {tab === "profil" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <Card className="lg:col-span-3 flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-bg text-accent">
                  {StoreIcon}
                </div>
                <h3 className="font-heading text-[18px] font-semibold text-ink">
                  Informasi Toko
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputField
                  label="Nama Toko"
                  type="text"
                  required
                  value={toko.nama}
                  onChange={(v) => setToko({ ...toko, nama: v })}
                />
                <InputField
                  label="Nomor Telepon Toko"
                  type="text"
                  value={toko.telepon}
                  onChange={(v) => setToko({ ...toko, telepon: v })}
                />
                <div className="md:col-span-2">
                  <InputField
                    label="Alamat Lengkap"
                    type="textarea"
                    required
                    value={toko.alamat}
                    onChange={(v) => setToko({ ...toko, alamat: v })}
                  />
                </div>
                <InputField
                  label="Akun Instagram"
                  type="text"
                  placeholder="@username"
                  value={toko.instagram}
                  onChange={(v) => setToko({ ...toko, instagram: v })}
                />
                <InputField
                  label="Nomor WhatsApp (untuk link)"
                  type="text"
                  placeholder="62812xxxxx"
                  value={toko.whatsapp}
                  onChange={(v) => setToko({ ...toko, whatsapp: v })}
                />
                <div className="md:col-span-2">
                  <InputField
                    label="Deskripsi / Tagline Toko"
                    type="textarea"
                    value={toko.deskripsi}
                    onChange={(v) => setToko({ ...toko, deskripsi: v })}
                    helper="Akan tampil di struk, kartu nama digital, dll."
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <Button variant="primary" size="md" onClick={handleSimpan}>
                  Simpan Profil Toko
                </Button>
              </div>
            </Card>

            <Card className="lg:col-span-2 flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-mint text-teal-active">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M3 9h18" />
                    <path d="M9 21V9" />
                  </svg>
                </div>
                <h3 className="font-heading text-[18px] font-semibold text-ink">
                  Statistik Toko
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { l: "Bergabung Sejak", v: "Jan 2025", tone: "muted" },
                  { l: "Total Produk", v: "12 varian", tone: "teal" },
                  { l: "Total Customer", v: "47 orang", tone: "teal" },
                  { l: "Total Supplier", v: "6 mitra", tone: "teal" },
                  { l: "Order Selesai", v: "1.284", tone: "success" },
                  { l: "Rating Customer", v: "4.9 ⭐", tone: "success" },
                ].map((s) => (
                  <div
                    key={s.l}
                    className="flex flex-col gap-1 rounded-xl border border-border bg-card-alt px-4 py-3"
                  >
                    <span className="text-[11px] font-medium text-muted uppercase tracking-wide">
                      {s.l}
                    </span>
                    <span
                      className={`font-heading text-[16px] font-bold ${
                        s.tone === "success"
                          ? "text-teal-success"
                          : s.tone === "teal"
                          ? "text-teal-active"
                          : "text-ink"
                      }`}
                    >
                      {s.v}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2 rounded-xl border border-accent/20 bg-accent-tag p-4">
                <div className="flex items-center gap-2 text-accent">
                  <span>{ShieldIcon}</span>
                  <span className="text-[13px] font-bold">Status Langganan</span>
                </div>
                <div className="flex flex-col gap-0.5 pl-7">
                  <span className="font-heading text-[16px] font-bold text-ink">
                    SOJU — Plan UMKM
                  </span>
                  <span className="text-[12px] text-muted">
                    Aktif sampai 31 Des 2026 · Auto-renew: ON
                  </span>
                </div>
                <div className="pl-7 pt-1">
                  <Button variant="secondary" size="sm">
                    Kelola Langganan
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Tab Content: Akun Pengguna */}
        {tab === "akun" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <Card className="lg:col-span-3 flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-mint text-teal-active">
                  {UserIcon}
                </div>
                <h3 className="font-heading text-[18px] font-semibold text-ink">
                  Data Pengguna Saat Ini
                </h3>
              </div>

              <div className="flex items-center gap-4 rounded-xl border border-border bg-card-alt p-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent-bg">
                  <span className="font-heading text-[20px] font-bold text-accent">
                    {user.nama ? user.nama.slice(0, 2).toUpperCase() : "U"}
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="font-heading text-[16px] font-bold text-ink truncate">
                    {user.nama}
                  </span>
                  <span className="text-[12px] text-muted truncate">{user.email}</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <Badge variant="ai">Pemilik</Badge>
                    <Badge variant="source">Akses penuh</Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputField
                  label="Nama Lengkap"
                  type="text"
                  required
                  value={user.nama}
                  onChange={(v) => setUser({ ...user, nama: v })}
                />
                <InputField
                  label="Jabatan / Peran"
                  type="text"
                  value={user.jabatan}
                  onChange={(v) => setUser({ ...user, jabatan: v })}
                />
                <InputField
                  label="Email"
                  type="text"
                  required
                  value={user.email}
                  onChange={(v) => setUser({ ...user, email: v })}
                />
                <InputField
                  label="Nomor Telepon"
                  type="text"
                  value={user.telepon}
                  onChange={(v) => setUser({ ...user, telepon: v })}
                />
              </div>

              <div className="flex justify-end pt-1">
                <Button variant="primary" size="md" onClick={handleSimpan}>
                  Simpan Data Akun
                </Button>
              </div>

              <div className="w-full h-px bg-border" />

              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-danger-bg text-danger">
                  {ShieldIcon}
                </div>
                <h3 className="font-heading text-[18px] font-semibold text-ink">
                  Keamanan Akun
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputField
                  label="Password Lama"
                  type="text"
                  placeholder="••••••••"
                />
                <div />
                <InputField
                  label="Password Baru"
                  type="text"
                  placeholder="Min. 8 karakter"
                />
                <InputField
                  label="Ulangi Password Baru"
                  type="text"
                />
              </div>

              <div className="flex justify-end pt-1">
                <Button variant="outline" size="md">
                  Ubah Password
                </Button>
              </div>
            </Card>

            <Card className="lg:col-span-2 flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-success-bg text-teal-success">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3 className="font-heading text-[18px] font-semibold text-ink">
                  Daftar Pengguna ({1})
                </h3>
              </div>

              <div className="flex flex-col divide-y divide-border rounded-xl border border-border overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 hover:bg-card-alt transition-colors">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-bg">
                    <span className="font-heading text-[14px] font-bold text-accent">
                      {user.nama ? user.nama.slice(0, 2).toUpperCase() : "U"}
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-semibold text-ink truncate">
                        {user.nama || "Memuat..."}
                      </span>
                      <Badge variant="ai">Saya</Badge>
                    </div>
                    <span className="text-[11px] text-muted truncate">{user.email || "—"}</span>
                    <span className="text-[11px] text-muted">{user.jabatan}</span>
                  </div>
                  <Badge variant="success">Aktif</Badge>
                </div>
              </div>

              <Button variant="outline" size="md" fullWidth leftIcon={UserIcon}>
                Undang Pengguna Baru
              </Button>
            </Card>
          </div>
        )}

        {/* Tab Content: Pengaturan */}
        {tab === "pengaturan" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <Card className="lg:col-span-3 flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-tag-bg text-yellow-tag-ink">
                  {BellIcon}
                </div>
                <h3 className="font-heading text-[18px] font-semibold text-ink">
                  Notifikasi
                </h3>
              </div>

              <div className="flex flex-col divide-y divide-border rounded-xl border border-border overflow-hidden">
                {[
                  {
                    key: "notifOrder",
                    label: "Notifikasi Order Masuk",
                    desc: "Pemberitahuan ketika ada order baru dari WA/DM/GrabFood.",
                    val: pengaturan.notifOrder,
                  },
                  {
                    key: "notifStok",
                    label: "Peringatan Stok Menipis",
                    desc: "Alert ketika stok produk ≤ batas minimum yang ditentukan.",
                    val: pengaturan.notifStok,
                  },
                  {
                    key: "notifWa",
                    label: "Kirim Notifikasi via WhatsApp",
                    desc: "Ringkasan harian & alert penting dikirim ke nomor WA toko.",
                    val: pengaturan.notifWa,
                  },
                  {
                    key: "notifEmail",
                    label: "Kirim Notifikasi via Email",
                    desc: "Laporan bulanan & invoice langganan dikirim ke email.",
                    val: pengaturan.notifEmail,
                  },
                ].map((row) => (
                  <div
                    key={row.key}
                    className="flex items-start justify-between gap-4 px-4 py-4"
                  >
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="text-[14px] font-semibold text-ink">
                        {row.label}
                      </span>
                      <span className="text-[12px] text-muted">{row.desc}</span>
                    </div>
                    <ToggleSwitch
                      checked={row.val}
                      onChange={(v) =>
                        setPengaturan({ ...pengaturan, [row.key as keyof Pengaturan]: v } as Pengaturan)
                      }
                    />
                  </div>
                ))}
              </div>
            </Card>

            <Card className="lg:col-span-2 flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-mint text-teal-active">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <h3 className="font-heading text-[18px] font-semibold text-ink">
                  Preferensi Umum
                </h3>
              </div>

              <div className="flex flex-col gap-4">
                <InputField
                  label="Tanggal Awal Periode Laporan Bulanan"
                  type="number"
                  value={String(pengaturan.tanggalAwalBulan)}
                  onChange={(v) =>
                    setPengaturan({ ...pengaturan, tanggalAwalBulan: parseInt(v) || 1 })
                  }
                  helper="Contoh: isi 1 = laporan mulai tgl 1 setiap bulan"
                />
                <InputField
                  label="Bahasa Aplikasi"
                  type="select"
                  value={pengaturan.bahasa}
                  onChange={(v) => setPengaturan({ ...pengaturan, bahasa: v })}
                  options={[
                    { value: "Bahasa Indonesia", label: "Bahasa Indonesia" },
                    { value: "English", label: "English" },
                  ]}
                />
                <InputField
                  label="Mata Uang Default"
                  type="select"
                  value={pengaturan.mataUang}
                  onChange={(v) => setPengaturan({ ...pengaturan, mataUang: v })}
                  options={[
                    { value: "IDR (Rp)", label: "IDR — Rupiah (Rp)" },
                    { value: "MYR (RM)", label: "MYR — Ringgit (RM)" },
                    { value: "USD ($)", label: "USD — Dollar ($)" },
                  ]}
                />
              </div>

              <div className="w-full h-px bg-border" />

              <div className="flex flex-col gap-3 rounded-xl border border-danger/20 bg-danger-bg/40 p-4">
                <div className="flex items-center gap-2 text-danger">
                  <span>{ShieldIcon}</span>
                  <span className="text-[13px] font-bold">Bahaya</span>
                </div>
                <p className="text-[12px] text-muted pl-7">
                  Tindakan di bawah ini permanen & tidak bisa dibatalkan. Pastikan Anda sudah export data sebelum mengeksekusi.
                </p>
                <div className="flex flex-col gap-2 pl-7">
                  <Button variant="outline" size="sm" className="justify-start border-danger/40 text-danger hover:bg-danger-bg hover:border-danger">
                    Export Semua Data (CSV)
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start border-danger/40 text-danger hover:bg-danger-bg hover:border-danger">
                    Reset Data Demo
                  </Button>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <Button variant="primary" size="md" onClick={handleSimpan}>
                  Simpan Pengaturan
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`
        relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors
        ${checked ? "bg-teal-active" : "bg-card-muted"}
      `}
    >
      <span
        className={`
          inline-block h-5 w-5 transform rounded-full bg-card shadow transition-transform
          ${checked ? "translate-x-6" : "translate-x-1"}
        `}
      />
    </button>
  );
}
