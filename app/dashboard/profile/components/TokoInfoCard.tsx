import { Button } from "./Button";
import { Field } from "./Field";
import { Panel } from "./Panel";
import { SectionTitle } from "./SectionTitle";
import type { TokoData } from "./types";

type TokoInfoCardProps = { toko: TokoData; onToko: (t: TokoData) => void; onSave: () => void };

export function TokoInfoCard({ toko, onToko, onSave }: TokoInfoCardProps) {
  return (
    <Panel padding="md" className="flex flex-col gap-5 lg:col-span-3">
      <SectionTitle icon="store" tone="bg-[#e8f0ff] text-brand">Informasi Toko</SectionTitle>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Nama Toko" type="text" required value={toko.nama} onChange={(v) => onToko({ ...toko, nama: v })} />
        <Field label="Nomor Telepon Toko" type="text" value={toko.telepon} onChange={(v) => onToko({ ...toko, telepon: v })} />
        <div className="md:col-span-2">
          <Field label="Alamat Lengkap" type="textarea" required value={toko.alamat} onChange={(v) => onToko({ ...toko, alamat: v })} />
        </div>
        <Field label="Akun Instagram" type="text" placeholder="@username" value={toko.instagram} onChange={(v) => onToko({ ...toko, instagram: v })} />
        <Field label="Nomor WhatsApp (untuk link)" type="text" placeholder="62812xxxxx" value={toko.whatsapp} onChange={(v) => onToko({ ...toko, whatsapp: v })} />
        <div className="md:col-span-2">
          <Field label="Deskripsi / Tagline Toko" type="textarea" value={toko.deskripsi} onChange={(v) => onToko({ ...toko, deskripsi: v })} helper="Akan tampil di struk, kartu nama digital, dll." />
        </div>
      </div>

      <div className="flex justify-end pt-1">
        <Button icon="check" onClick={onSave}>Simpan Profil Toko</Button>
      </div>
    </Panel>
  );
}
