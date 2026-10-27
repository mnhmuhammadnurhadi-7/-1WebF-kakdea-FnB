import { Button } from "../shared/Button";

type ChatComposerProps = { value: string; onChange: (v: string) => void; onSend: () => void };

export function ChatComposer({ value, onChange, onSend }: ChatComposerProps) {
  return (
    <div>
      <div className="flex items-end gap-3 rounded-[22px] bg-white p-3 shadow-card transition focus-within:ring-4 focus-within:ring-brand/15">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          placeholder="Ketik pesan / perintah... (Enter kirim, Shift+Enter baris baru)"
          rows={1}
          className="max-h-40 flex-1 resize-none bg-transparent px-2 py-2 text-[14px] text-ink outline-none placeholder:text-faint"
        />
        <Button onClick={onSend} icon="send" disabled={!value.trim()}>Kirim</Button>
      </div>
      <p className="mt-2 px-1 text-[11.5px] text-faint">
        💡 Data dari AI tetap perlu dicek &amp; dikonfirmasi sebelum disimpan (double-entry wajib balance).
      </p>
    </div>
  );
}
