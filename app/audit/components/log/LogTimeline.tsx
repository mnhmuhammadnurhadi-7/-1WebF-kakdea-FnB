import { ErrorBanner } from "../state/ErrorBanner";
import { LogItem } from "./LogItem";
import { Panel } from "../shared/Panel";
import { StateBlock } from "../state/StateBlock";
import type { AuditLog } from "../shared/types";

type LogTimelineProps = {
  loadError: boolean;
  loading: boolean;
  logs: AuditLog[];
  expandedId: string | null;
  onToggle: (id: string) => void;
  onRetry: () => void;
};

export function LogTimeline({ loadError, loading, logs, expandedId, onToggle, onRetry }: LogTimelineProps) {
  return (
    <Panel className="overflow-hidden">
      <div className="flex flex-col">
        {loadError ? (
          <div className="p-5 sm:p-8">
            <ErrorBanner
              title="Riwayat belum berhasil dimuat"
              description="Periksa koneksi atau sesi masuk Anda. Catatan audit tidak dihapus; silakan coba lagi."
              onRetry={onRetry}
            />
          </div>
        ) : loading ? (
          <StateBlock icon="clock" title="Memuat catatan audit..." />
        ) : logs.length === 0 ? (
          <StateBlock
            icon="search"
            title="Tidak ada catatan audit"
            description="Coba ubah filter sheet / sumber, atau lakukan aksi apa pun di aplikasi Buku Dapur."
          />
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
