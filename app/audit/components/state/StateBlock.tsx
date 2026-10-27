import { Icon, type IconName } from "../shared/Icon";

type StateBlockProps = { icon: IconName; title: string; description?: string };

/** Tampilan tengah untuk keadaan "memuat" dan "kosong". */
export function StateBlock({ icon, title, description }: StateBlockProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-app text-faint">
        <Icon name={icon} size={24} />
      </span>
      <div className="flex flex-col gap-1">
        <span className="text-[16px] font-bold text-ink">{title}</span>
        {description && <span className="max-w-sm text-[13px] text-body">{description}</span>}
      </div>
    </div>
  );
}
