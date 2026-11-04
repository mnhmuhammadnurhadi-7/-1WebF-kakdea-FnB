import { Button } from "./Button";
import { Chip } from "./Chip";
import { Panel } from "./Panel";
import { SectionTitle } from "./SectionTitle";
import type { UserData } from "./types";

export function UserListCard({ user }: { user: UserData }) {
  return (
    <Panel padding="md" className="flex flex-col gap-5 lg:col-span-2">
      <SectionTitle icon="users" tone="bg-ok-tint text-ok-text">Daftar Pengguna ({1})</SectionTitle>

      <div className="flex flex-col divide-y divide-line-soft overflow-hidden rounded-2xl border border-line">
        <div className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-app">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f0ff]">
            <span className="text-[14px] font-extrabold text-brand">{user.nama ? user.nama.slice(0, 2).toUpperCase() : "U"}</span>
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <span className="truncate text-[14px] font-bold text-ink">{user.nama || "Memuat..."}</span>
              <Chip tone="brand">Saya</Chip>
            </div>
            <span className="truncate text-[11.5px] text-body">{user.email || "—"}</span>
            <span className="text-[11.5px] text-faint">{user.jabatan}</span>
          </div>
          <Chip tone="ok">Aktif</Chip>
        </div>
      </div>

      <Button variant="outline" icon="user" className="w-full">Undang Pengguna Baru</Button>
    </Panel>
  );
}
