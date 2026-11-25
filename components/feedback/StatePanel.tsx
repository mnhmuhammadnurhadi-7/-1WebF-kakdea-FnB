import Link from "next/link";
import { StatusScene, type SceneKind } from "@/components/status/mascot/scenes";

export type PanelKind = "gagal-memuat" | "koneksi-terputus" | "sesi-berakhir" | "waktu-habis" | "layanan-tidak-tersedia";

const DEF: Record<PanelKind, { scene: SceneKind; code: string; lineA: string; lineB: string; toneB: string; description: string; retry: string }> = {
  "gagal-memuat": { scene: "500", code: "E01", lineA: "Data", lineB: "gagal dimuat", toneB: "text-brand", description: "Server tidak merespons saat mengambil data. Datamu aman, belum ada yang hilang.", retry: "Muat ulang" },
  "koneksi-terputus": { scene: "offline", code: "E06", lineA: "Koneksi internet", lineB: "terputus", toneB: "text-[#F59E0B]", description: "Cek WiFi atau data seluler-mu. Begitu tersambung, kami muat ulang datanya otomatis.", retry: "Muat ulang" },
  "sesi-berakhir": { scene: "401", code: "E05", lineA: "Sesimu sudah", lineB: "berakhir", toneB: "text-[#F59E0B]", description: "Demi keamanan, kamu otomatis keluar setelah lama tidak aktif. Draf yang belum tersimpan sudah kami amankan.", retry: "Masuk lagi" },
  "waktu-habis": { scene: "504", code: "E02", lineA: "Terlalu lama", lineB: "menunggu", toneB: "text-brand", description: "Permintaan ke server melewati batas waktu. Biasanya karena koneksi lambat atau data sedang padat.", retry: "Coba lagi" },
  "layanan-tidak-tersedia": { scene: "503", code: "E03", lineA: "Layanan belum", lineB: "bisa dihubungi", toneB: "text-bad", description: "Layanan sedang tidak merespons. Percakapan dan draf transaksimu aman, coba hubungkan lagi sebentar lagi.", retry: "Hubungkan lagi" },
};

type StatePanelProps = {
  kind: PanelKind;
  /** Ganti baris pertama judul, mis. "Data transaksi" → "Data transaksi gagal dimuat" */
  subject?: string;
  description?: string;
  onRetry?: () => void;
  /** Untuk sesi berakhir: arahkan ke halaman masuk */
  retryHref?: string;
  secondary?: { label: string; href: string };
};

/** Panel besar bermaskot yang menggantikan isi halaman saat gagal memuat / offline / sesi habis / timeout. */
export function StatePanel({ kind, subject, description, onRetry, retryHref, secondary }: StatePanelProps) {
  const d = DEF[kind];
  const primary = "inline-flex h-11 items-center gap-2 rounded-xl bg-brand px-5 text-[13.5px] font-bold text-white shadow-blue transition hover:brightness-110";
  const second = "inline-flex h-11 items-center rounded-xl bg-white px-5 text-[13.5px] font-bold text-ink shadow-btn ring-1 ring-line transition hover:bg-app";

  return (
    <section role="alert" className="relative overflow-hidden rounded-[28px] bg-white p-8 shadow-card sm:p-10">
      <span aria-hidden="true" className="pointer-events-none absolute -bottom-6 -right-4 select-none text-[170px] font-black leading-none tracking-[-.05em] text-black/[.03]">SOJU</span>
      <div className="relative grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)]">
        <div className="flex flex-col items-start gap-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-app px-3 py-1.5 font-mono text-[10px] font-extrabold tracking-[.08em] text-navy">
            <span className="size-1.5 rounded-full bg-bad" />
            SYS-ID: FZN-ID26 · {d.code}
          </span>
          <h2 className="text-[38px] font-extrabold leading-[1.1] tracking-[-.04em] text-navy sm:text-[44px]">
            {subject ?? d.lineA}
            <br />
            <span className={d.toneB}>{d.lineB}</span>
          </h2>
          <p className="max-w-[420px] text-[14px] leading-relaxed text-body">{description ?? d.description}</p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            {retryHref ? (
              <Link href={retryHref} className={primary}>{d.retry}</Link>
            ) : (
              onRetry && <button type="button" onClick={onRetry} className={primary}>{d.retry}</button>
            )}
            {secondary && <Link href={secondary.href} className={second}>{secondary.label}</Link>}
          </div>
        </div>
        <div className="flex justify-center">
          <StatusScene kind={d.scene} width={380} title="Maskot SOJU" />
        </div>
      </div>
    </section>
  );
}
