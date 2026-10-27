import Link from "next/link";
import { Button } from "../ui/Button";
import { Icon } from "../shared/Icon";

export function CmsHeader({ onAddMenu }: { onAddMenu: () => void }) {
  return (
    <section className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-[34px] font-bold leading-[1.15] tracking-[-.03em]">CMS System</h1>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-tint px-3 py-1 text-[11px] font-extrabold uppercase tracking-[.08em] text-navy">
            <span className="size-1.5 rounded-full bg-ok" />
            Halaman customer
          </span>
        </div>
        <p className="mt-1.5 max-w-[520px] text-[15px] text-body">Kelola konten dan menu makanan untuk halaman customer</p>
      </div>
      <div className="flex flex-wrap items-center gap-2.5">
        <Link
          href="/customer"
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-[13.5px] font-bold text-ink shadow-btn transition hover:bg-app"
        >
          Lihat Halaman Customer
          <Icon name="external" size={15} stroke={2} />
        </Link>
        <Button icon="plus" onClick={onAddMenu}>Tambah Menu</Button>
      </div>
    </section>
  );
}
