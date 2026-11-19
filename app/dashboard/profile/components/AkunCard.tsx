"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { Button } from "./Button";
import { Chip } from "./Chip";
import { Field } from "./Field";
import { Panel } from "./Panel";
import { SectionTitle } from "./SectionTitle";
import type { UserData } from "./types";

type AkunCardProps = { user: UserData; onUser: (u: UserData) => void; onSave: () => void };

export function AkunCard({ user, onUser, onSave }: AkunCardProps) {
  const [passwordLama, setPasswordLama] = useState("");
  const [passwordBaru, setPasswordBaru] = useState("");
  const [konfirmasiPassword, setKonfirmasiPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  async function changePassword() {
    setPasswordMessage(""); setPasswordError(""); setSavingPassword(true);
    try {
      await api.auth.changePassword(passwordLama, passwordBaru);
      setPasswordMessage("Password berhasil diperbarui."); setPasswordLama(""); setPasswordBaru(""); setKonfirmasiPassword("");
    } catch (cause) { setPasswordError(cause instanceof Error ? cause.message : "Password belum dapat diperbarui."); }
    finally { setSavingPassword(false); }
  }
  return (
    <Panel padding="md" className="flex flex-col gap-5 lg:col-span-3">
      <SectionTitle icon="user" tone="bg-sky-tint text-navy">Data Pengguna Saat Ini</SectionTitle>

      <div className="flex items-center gap-4 rounded-2xl bg-app p-4">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FBBF24] to-[#F97316]">
          <span className="text-[20px] font-extrabold text-white">{user.nama ? user.nama.slice(0, 2).toUpperCase() : "U"}</span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate text-[16px] font-extrabold text-ink">{user.nama}</span>
          <span className="truncate text-[12px] text-body">{user.email}</span>
          <div className="flex flex-wrap gap-1.5 pt-1">
            <Chip tone="brand">{user.peran === "SUPER_ADMIN" ? "Super Admin" : "Admin"}</Chip>
            <Chip tone="sky">{user.peran === "SUPER_ADMIN" ? "Akses penuh" : "Akses Admin"}</Chip>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Nama Lengkap" type="text" required value={user.nama} onChange={(v) => onUser({ ...user, nama: v })} />
        <Field label="Peran" type="text" value={user.peran === "SUPER_ADMIN" ? "Super Admin" : "Admin"} disabled />
        <Field label="Email" type="text" required value={user.email} onChange={(v) => onUser({ ...user, email: v })} />
        <div />
      </div>

      <div className="flex justify-end pt-1">
        <Button icon="check" onClick={onSave}>Simpan Data Akun</Button>
      </div>

      <div className="h-px w-full bg-line-soft" />

      <SectionTitle icon="shield" tone="bg-bad-tint text-bad">Keamanan Akun</SectionTitle>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Password Lama" type="password" required value={passwordLama} onChange={setPasswordLama} placeholder="Password saat ini" />
        <div />
        <Field label="Password Baru" type="password" required value={passwordBaru} onChange={setPasswordBaru} placeholder="Min. 8 karakter" />
        <Field label="Ulangi Password Baru" type="password" required value={konfirmasiPassword} onChange={setKonfirmasiPassword} />
      </div>

      <div className="flex justify-end pt-1">
        <div className="flex flex-col items-end gap-2"><Button variant="outline" onClick={() => void changePassword()} disabled={savingPassword || passwordLama.length === 0 || passwordBaru.length < 8 || passwordBaru !== konfirmasiPassword}>{savingPassword ? "Menyimpan…" : "Ubah Password"}</Button>{passwordMessage && <p role="status" className="text-xs text-green-700">{passwordMessage}</p>}{passwordError && <p role="alert" className="text-xs text-red-700">{passwordError}</p>}</div>
      </div>
    </Panel>
  );
}
