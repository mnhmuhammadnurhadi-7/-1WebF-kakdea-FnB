import { Icon, type IconName } from "./Icon";

type SectionTitleProps = { icon: IconName; tone: string; children: React.ReactNode };

/** Judul kartu: ikon berwarna + teks. */
export function SectionTitle({ icon, tone, children }: SectionTitleProps) {
  return (
    <div className="flex items-center gap-3">
      <span className={"flex size-9 items-center justify-center rounded-xl " + tone}>
        <Icon name={icon} size={18} />
      </span>
      <h3 className="text-[18px] font-bold tracking-[-.02em] text-ink">{children}</h3>
    </div>
  );
}
