import { Button } from "./Button";

type ChatComposerProps = {
  value: string;
  disabled?: boolean;
  isSending?: boolean;
  onChange: (v: string) => void;
  onSend: () => void;
};

export function ChatComposer({
  value,
  disabled = false,
  isSending = false,
  onChange,
  onSend,
}: ChatComposerProps) {
  return (
    <div className="shrink-0">
      <div className="flex items-end gap-3 rounded-[22px] bg-white p-3 shadow-card transition focus-within:ring-4 focus-within:ring-brand/15">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (!disabled && value.trim()) {
                onSend();
              }
            }
          }}
          placeholder="Ketik pertanyaan atau perintah /add... (Enter kirim, Shift+Enter baris baru)"
          rows={1}
          className="max-h-40 flex-1 resize-none bg-transparent px-2 py-2 text-[16px] text-ink outline-none placeholder:text-faint disabled:opacity-60 sm:text-[14px]"
        />
        <Button onClick={onSend} icon="send" disabled={disabled || !value.trim()}>
          {isSending ? "Mengirim..." : "Kirim"}
        </Button>
      </div>
      <p className="mt-2 px-1 text-[11.5px] text-faint">
        Setiap draf transaksi dari AI wajib diperiksa dan dikonfirmasi secara manual sebelum masuk ke pembukuan.
      </p>
    </div>
  );
}
