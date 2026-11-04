import { SojuFigure, type Mood, type Pose } from "./mascot/SojuMascot";

export type InlineKind =
  | "gagal-memuat"
  | "kosong"
  | "tidak-ada-hasil"
  | "gagal-simpan"
  | "koneksi-terputus"
  | "waktu-habis"
  | "sesi-berakhir"
  | "gagal-export"
  | "berhasil";

type Def = { mood: Mood; pose: Pose; title: string; description: string; code: string };

/** Katalog kondisi inline — maskot SOJU + teks standar. */
export const INLINE_STATES: Record<InlineKind, Def> = {
  "gagal-memuat": { mood: "panik", pose: "cheeks", title: "Data belum berhasil dimuat", description: "Periksa koneksi atau sesi masuk Anda lalu coba lagi. Data sebelumnya tetap aman.", code: "E01" },
  kosong: { mood: "bingung", pose: "map", title: "Belum ada data", description: "Data akan muncul di sini setelah Anda menambahkannya.", code: "E07" },
  "tidak-ada-hasil": { mood: "bingung", pose: "map", title: "Tidak ada hasil", description: "Coba ubah kata kunci atau filter yang dipakai.", code: "E07" },
  "gagal-simpan": { mood: "panik", pose: "cheeks", title: "Perubahan belum tersimpan", description: "Terjadi kendala saat menyimpan. Data Anda masih ada di layar, silakan coba simpan lagi.", code: "E04" },
  "koneksi-terputus": { mood: "lesu", pose: "down", title: "Koneksi internet terputus", description: "Catatan Anda aman di perangkat ini dan akan disinkronkan saat internet kembali.", code: "E06" },
  "waktu-habis": { mood: "lesu", pose: "down", title: "Server terlalu lama merespons", description: "Jaringan mungkin sedang padat. Coba lagi dalam beberapa saat.", code: "E02" },
  "sesi-berakhir": { mood: "lesu", pose: "down", title: "Sesi Anda sudah berakhir", description: "Demi keamanan, silakan masuk kembali untuk melanjutkan.", code: "E05" },
  "gagal-export": { mood: "panik", pose: "cheeks", title: "Export belum berhasil", description: "Berkas gagal dibuat. Coba ulangi, atau kecilkan rentang data yang diexport.", code: "E04" },
  berhasil: { mood: "lega", pose: "thumbs", title: "Berhasil!", description: "Perubahan sudah tersimpan.", code: "E01b" },
};

type InlineStateProps = {
  kind: InlineKind;
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  /** Tombol tambahan (mis. "Reset filter" + "Ubah rentang tanggal") */
  actions?: React.ReactNode;
  /** Ringkas: maskot kecil, cocok di dalam sel tabel */
  compact?: boolean;
};

export function InlineState({ kind, title, description, onRetry, retryLabel = "Coba lagi", actions, compact = false }: InlineStateProps) {
  const d = INLINE_STATES[kind];
  return (
    <div role={kind === "berhasil" ? "status" : undefined} className={"flex flex-col items-center justify-center gap-3 text-center " + (compact ? "py-6" : "py-12")}>
      <SojuFigure mood={d.mood} pose={d.pose} size={compact ? 84 : 120} />
      <div className="flex max-w-md flex-col gap-1">
        <span className="text-[16px] font-bold tracking-[-.01em] text-ink">{title ?? d.title}</span>
        <span className="text-[13px] leading-relaxed text-body">{description ?? d.description}</span>
      </div>
      {actions && <div className="mt-1 flex flex-wrap items-center justify-center gap-2">{actions}</div>}
      {onRetry && (
        <button type="button" onClick={onRetry} className="mt-1 inline-flex h-10 items-center rounded-xl bg-brand px-5 text-[13px] font-bold text-white shadow-blue transition hover:brightness-110">
          {retryLabel}
        </button>
      )}
    </div>
  );
}
