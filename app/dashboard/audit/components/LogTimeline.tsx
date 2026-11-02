import { LogItem } from "./LogItem";
import { Panel } from "./Panel";
import { StateBlock } from "./StateBlock";
import type { AuditLog } from "./types";
import { InlineState } from "@/components/status/InlineState";
import { StatePanel } from "@/components/feedback/StatePanel";

type LogTimelineProps = {
  loadError: boolean;
  loading: boolean;
  logs: AuditLog[];
  expandedId: string | null;
  onToggle: (id: string) => void;
  onRetry: () => void;
};

export function LogTimeline({ loadError, loading, logs, expandedId, onToggle, onRetry }: LogTimelineProps) {
  if (loadError) {
    return <StatePanel kind="gagal-memuat" subject="Riwayat audit" description="Periksa koneksi atau sesi masuk Anda. Catatan audit tidak dihapus; silakan coba lagi." onRetry={onRetry} />;
  }
  return (
    <Panel className="overflow-hidden">
      <div className="flex flex-col">
        {loading ? (
          <StateBlock icon="clock" title="Memuat catatan audit..." />
        ) : logs.length === 0 ? (
          <InlineState kind="tidak-ada-hasil" title="Tidak ada catatan audit" description="Coba ubah filter sheet / sumber, atau lakukan aksi apa pun di aplikasi Buku Dapur." />
        ) : (
          <div className="py-2">
            {logs.map((l) => (
              <LogItem key={l.id} log={l} expanded={expandedId === l.id} onToggle={() => onToggle(l.id)} />
            ))}
          </div>
        )}
      </div>
    </Panel>
  );
}
