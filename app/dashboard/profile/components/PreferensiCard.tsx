import { Button } from "./Button";
import { Field } from "./Field";
import { Icon } from "./Icon";
import { Panel } from "./Panel";
import { SectionTitle } from "./SectionTitle";
import type { Pengaturan } from "./types";

type PreferensiCardProps = { pengaturan: Pengaturan; onPengaturan: (p: Pengaturan) => void; onSave: () => void };

export function PreferensiCard({ pengaturan, onPengaturan, onSave }: PreferensiCardProps) {
  return (
    <Panel padding="md" className="flex flex-col gap-5 lg:col-span-2">
      <SectionTitle icon="clock" tone="bg-sky-tint text-navy">Preferensi Umum</SectionTitle>

      <div className="flex flex-col gap-4">
        <Field
          label="Tanggal Awal Periode Laporan Bulanan"
          type="number"
          value={String(pengaturan.tanggalAwalBulan)}
          onChange={(v) => onPengaturan({ ...pengaturan, tanggalAwalBulan: parseInt(v) || 1 })}
          helper="Contoh: isi 1 = laporan mulai tgl 1 setiap bulan"
        />
        <Field
          label="Bahasa Aplikasi"
          type="select"
          value={pengaturan.bahasa}
          onChange={(v) => onPengaturan({ ...pengaturan, bahasa: v })}
          options={[
            { value: "Bahasa Indonesia", label: "Bahasa Indonesia" },
            { value: "English", label: "English" },
          ]}
        />
        <Field
          label="Mata Uang Default"
          type="select"
          value={pengaturan.mataUang}
          onChange={(v) => onPengaturan({ ...pengaturan, mataUang: v })}
          options={[
            { value: "IDR (Rp)", label: "IDR — Rupiah (Rp)" },
            { value: "MYR (RM)", label: "MYR — Ringgit (RM)" },
            { value: "USD ($)", label: "USD — Dollar ($)" },
          ]}
        />
      </div>

      <div className="h-px w-full bg-line-soft" />

      <div className="flex flex-col gap-3 rounded-2xl border border-bad/15 bg-bad-tint/60 p-4">
        <div className="flex items-center gap-2 text-bad">
          <Icon name="shield" size={17} />
          <span className="text-[13px] font-extrabold">Bahaya</span>
        </div>
        <p className="pl-7 text-[12px] text-body">
          Tindakan di bawah ini permanen &amp; tidak bisa dibatalkan. Pastikan Anda sudah export data sebelum mengeksekusi.
        </p>
        <div className="flex flex-col gap-2 pl-7">
          <Button variant="danger" size="sm" className="justify-start">Export Semua Data (CSV)</Button>
          <Button variant="danger" size="sm" className="justify-start">Reset Data Demo</Button>
        </div>
      </div>

      <div className="flex justify-end pt-1">
        <Button icon="check" onClick={onSave}>Simpan Pengaturan</Button>
      </div>
    </Panel>
  );
}
