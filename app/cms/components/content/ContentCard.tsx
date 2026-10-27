import type { ReactNode } from "react";
import { Button } from "../ui/Button";
import { Icon, type IconName } from "../shared/Icon";
import { Panel } from "../ui/Panel";

type ContentCardProps = {
  icon: IconName;
  iconClass: string;
  title: string;
  subtitle: string;
  editLabel: string;
  onEdit: () => void;
  children: ReactNode;
};

/** Kerangka kartu konten: ikon + judul + tombol Edit, lalu isi. */
export function ContentCard({ icon, iconClass, title, subtitle, editLabel, onEdit, children }: ContentCardProps) {
  return (
    <Panel padding="md" className="!p-6">
      <div className="flex items-start justify-between gap-3 border-b border-line-soft pb-4">
        <div className="flex items-center gap-3">
          <span className={"flex size-11 shrink-0 items-center justify-center rounded-xl " + iconClass}>
            <Icon name={icon} size={20} />
          </span>
          <div>
            <h3 className="text-[18px] font-bold tracking-[-.02em] text-ink">{title}</h3>
            <p className="text-[12.5px] text-body">{subtitle}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" icon="pencil" onClick={onEdit} aria-label={editLabel}>Edit</Button>
      </div>
      <div className="flex flex-col">{children}</div>
    </Panel>
  );
}
