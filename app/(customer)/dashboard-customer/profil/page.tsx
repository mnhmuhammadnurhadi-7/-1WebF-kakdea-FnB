"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { customerApi, type CustomerProfile } from "@/lib/customerApi";

export default function CustomerProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { customerApi.getProfile().then((result) => setProfile(result.data)).catch((cause) => setError(cause.message)); }, []);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!profile) return;
    setBusy(true); setError(""); setMessage("");
    try {
      const result = await customerApi.updateProfile({ nama: profile.nama, email: profile.email, noTelepon: profile.noTelepon, alamat: profile.alamat });
      setProfile(result.data); setMessage("Profil berhasil diperbarui.");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Profil belum dapat disimpan."); }
    finally { setBusy(false); }
  }

  function logout() {
    customerApi.logout();
    router.replace("/customer");
  }

  if (!profile) return <p className="text-sm text-slate-500">{error || "Memuat profil…"}</p>;
  const input = "h-12 w-full rounded-xl border bg-white px-4 text-sm outline-none focus:border-[#1E3A8A]";
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
      <form onSubmit={save} className="flex flex-col gap-4 rounded-3xl border bg-white p-5 sm:p-7" style={{ borderColor: "#E2E7FF" }}>
        <h2 className="text-lg font-bold" style={{ color: "#131B2E" }}>Informasi Profil</h2>
        <label className="flex flex-col gap-1.5 text-sm font-semibold">Nama<input required className={input} value={profile.nama} onChange={(e) => setProfile({ ...profile, nama: e.target.value })} /></label>
        <label className="flex flex-col gap-1.5 text-sm font-semibold">Email<input required type="email" className={input} value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} /></label>
        <label className="flex flex-col gap-1.5 text-sm font-semibold">Nomor telepon<input required className={input} value={profile.noTelepon} onChange={(e) => setProfile({ ...profile, noTelepon: e.target.value })} /></label>
        <label className="flex flex-col gap-1.5 text-sm font-semibold">Alamat<textarea required className="min-h-24 rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:border-[#1E3A8A]" value={profile.alamat} onChange={(e) => setProfile({ ...profile, alamat: e.target.value })} /></label>
        {message && <p role="status" className="text-sm text-green-700">{message}</p>}
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        <button disabled={busy} className="h-12 rounded-full px-5 text-sm font-bold text-white disabled:opacity-60" style={{ backgroundColor: "#1E3A8A" }}>{busy ? "Menyimpan…" : "Simpan Profil"}</button>
      </form>
      <aside className="flex h-fit flex-col gap-3 rounded-3xl border bg-white p-5" style={{ borderColor: "#E2E7FF" }}>
        <h2 className="font-bold" style={{ color: "#131B2E" }}>Akun</h2>
        <p className="text-sm" style={{ color: "#757682" }}>Terdaftar sejak {profile.dibuatPada ? new Date(profile.dibuatPada).toLocaleDateString("id-ID") : "—"}</p>
        <button type="button" onClick={logout} className="mt-2 rounded-full border px-4 py-2.5 text-sm font-semibold" style={{ borderColor: "#DAE2FD", color: "#BA1A1A" }}>Keluar</button>
      </aside>
    </div>
  );
}
