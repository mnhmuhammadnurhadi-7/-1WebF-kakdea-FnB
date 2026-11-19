"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "./Button";
import { Chip } from "./Chip";
import { Panel } from "./Panel";
import { SectionTitle } from "./SectionTitle";
import type { UserData } from "./types";

type AdminUser = { id: number; nama: string; email: string; peran: string; dibuatPada: string };

export function UserListCard({ user }: { user: UserData }) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [open, setOpen] = useState(false);
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [peran, setPeran] = useState<"ADMIN" | "SUPER_ADMIN">("ADMIN");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const isSuperAdmin = user.peran === "SUPER_ADMIN";
  useEffect(() => { if (isSuperAdmin) api.users.getAll().then((result) => setUsers(result.data)).catch((cause) => setError(cause.message)); }, [isSuperAdmin]);

  async function createUser(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      await api.users.create({ nama, email, password, peran });
      const result = await api.users.getAll(); setUsers(result.data);
      setNama(""); setEmail(""); setPassword(""); setPeran("ADMIN"); setOpen(false);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Admin belum dapat ditambahkan."); }
    finally { setBusy(false); }
  }

  return <Panel padding="md" className="flex flex-col gap-5 lg:col-span-2">
    <SectionTitle icon="users" tone="bg-ok-tint text-ok-text">Daftar Pengguna{isSuperAdmin ? ` (${users.length})` : ""}</SectionTitle>
    {isSuperAdmin ? <div className="flex flex-col divide-y divide-line-soft overflow-hidden rounded-2xl border border-line">{users.map((item) => <div key={item.id} className="flex items-center gap-3 px-4 py-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f0ff]"><span className="text-[14px] font-extrabold text-brand">{item.nama.slice(0, 2).toUpperCase()}</span></div>
      <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><span className="truncate text-[14px] font-bold text-ink">{item.nama}</span>{item.id === Number((user as any).id) && <Chip tone="brand">Saya</Chip>}</div><span className="block truncate text-[11.5px] text-body">{item.email}</span><span className="text-[11.5px] text-faint">{item.peran === "SUPER_ADMIN" ? "Super Admin" : "Admin"}</span></div><Chip tone="ok">Aktif</Chip>
    </div>)}</div> : <p className="rounded-xl bg-app p-4 text-sm text-body">Pengelolaan akun pengguna hanya tersedia untuk Super Admin.</p>}
    {isSuperAdmin && <>
      <Button variant="outline" icon="user" className="w-full" onClick={() => setOpen((value) => !value)}>{open ? "Tutup Form" : "Tambah Pengguna Admin"}</Button>
      {open && <form onSubmit={createUser} className="grid gap-3 rounded-2xl border border-line p-4"><label className="grid gap-1 text-xs font-semibold">Nama<input required value={nama} onChange={(e) => setNama(e.target.value)} className="h-10 rounded-lg border px-3 text-sm" /></label><label className="grid gap-1 text-xs font-semibold">Email<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-10 rounded-lg border px-3 text-sm" /></label><label className="grid gap-1 text-xs font-semibold">Role<select value={peran} onChange={(e) => setPeran(e.target.value as "ADMIN" | "SUPER_ADMIN")} className="h-10 rounded-lg border bg-white px-3 text-sm"><option value="ADMIN">Admin</option><option value="SUPER_ADMIN">Super Admin</option></select></label><label className="grid gap-1 text-xs font-semibold">Password awal (minimal 12 karakter)<input required minLength={12} type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-10 rounded-lg border px-3 text-sm" /></label>{error && <p role="alert" className="text-sm text-red-700">{error}</p>}<button disabled={busy} className="h-10 rounded-lg bg-brand text-sm font-semibold text-white disabled:opacity-60">{busy ? "Membuat akun…" : `Buat ${peran === "SUPER_ADMIN" ? "Super Admin" : "Admin"}`}</button></form>}
    </>}
  </Panel>;
}
