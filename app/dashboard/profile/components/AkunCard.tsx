import { Button } from "./Button";
import { Chip } from "./Chip";
import { Field } from "./Field";
import { Panel } from "./Panel";
import { SectionTitle } from "./SectionTitle";
import type { UserData } from "./types";

type AkunCardProps = { user: UserData; onUser: (u: UserData) => void; onSave: () => void };

export function AkunCard({ user, onUser, onSave }: AkunCardProps) {
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
            <Chip tone="brand">Pemilik</Chip>
            <Chip tone="sky">Akses penuh</Chip>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Nama Lengkap" type="text" required value={user.nama} onChange={(v) => onUser({ ...user, nama: v })} />
        <Field label="Jabatan / Peran" type="text" value={user.jabatan} onChange={(v) => onUser({ ...user, jabatan: v })} />
        <Field label="Email" type="text" required value={user.email} onChange={(v) => onUser({ ...user, email: v })} />
        <Field label="Nomor Telepon" type="text" value={user.telepon} onChange={(v) => onUser({ ...user, telepon: v })} />
      </div>

      <div className="flex justify-end pt-1">
        <Button icon="check" onClick={onSave}>Simpan Data Akun</Button>
      </div>

      <div className="h-px w-full bg-line-soft" />

      <SectionTitle icon="shield" tone="bg-bad-tint text-bad">Keamanan Akun</SectionTitle>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Password Lama" type="password" placeholder="••••••••" />
        <div />
        <Field label="Password Baru" type="password" placeholder="Min. 8 karakter" />
        <Field label="Ulangi Password Baru" type="password" />
      </div>

      <div className="flex justify-end pt-1">
        <Button variant="outline">Ubah Password</Button>
      </div>
    </Panel>
  );
}
