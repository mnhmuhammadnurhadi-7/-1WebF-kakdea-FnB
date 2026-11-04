import { StateBanner } from "@/components/feedback/StateBanner";
import { Button } from "./Button";
import { AVAILABLE_COMMANDS } from "./constants";
import type { AiNotice as AiNoticeData } from "./types";

type AiNoticeProps = {
  notice: AiNoticeData;
  onRetry: (text: string) => void;
  onEdit: (text: string) => void;
  onPickCommand: (cmd: string) => void;
};

/** Balasan asisten yang berupa kondisi: gagal memproses, atau perintah tidak dikenali. */
export function AiNotice({ notice, onRetry, onEdit, onPickCommand }: AiNoticeProps) {
  if (notice.kind === "gagal-memproses") {
    return (
      <div className="w-full max-w-[460px]">
        <StateBanner
          title="Pesanmu belum bisa diproses"
          code={notice.code}
          actions={
            <>
              <Button size="sm" onClick={() => onRetry(notice.retryText)}>Kirim ulang</Button>
              <Button size="sm" variant="secondary" onClick={() => onEdit(notice.retryText)}>Edit pesan</Button>
            </>
          }
        >
          Layanan Asisten AI sedang sibuk atau koneksimu terputus. Pesanmu masih tersimpan, tinggal kirim ulang.
        </StateBanner>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[460px]">
      <StateBanner tone="warn" title={`Perintah ${notice.command} belum dikenali`} code={notice.code}>
        Pilih salah satu perintah yang tersedia:
        <div className="mt-2.5 grid grid-cols-2 gap-2">
          {AVAILABLE_COMMANDS.map((c) => (
            <button
              key={c.cmd}
              type="button"
              onClick={() => onPickCommand(c.cmd)}
              className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-left text-[12.5px] font-semibold text-ink shadow-btn transition hover:bg-app"
            >
              <b className="font-mono text-brand">{c.cmd}</b>
              {c.label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-[11.5px] text-faint">Teks biasa tanpa awalan “/” tetap bisa dipakai untuk bertanya.</p>
      </StateBanner>
    </div>
  );
}
