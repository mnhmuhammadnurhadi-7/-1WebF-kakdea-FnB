import Image from "next/image";

type SidebarBrandProps = {
  onClose?: () => void;
};

/** Logo + nama usaha di bagian atas sidebar, dengan tombol tutup pada drawer <1024px. */
export function SidebarBrand({ onClose }: SidebarBrandProps) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-white/10 px-5 py-4">
      <div className="flex min-w-0 items-center gap-3">
        <Image src="/soju.png" alt="" width={36} height={36} loading="eager" className="size-9 shrink-0 rounded-full object-cover" />
        <div className="min-w-0">
          <div className="text-lg font-bold text-white">SOJU</div>
          <div className="truncate text-[10px] font-medium tracking-wide text-white/65">KULINER &amp; FROZEN FOOD</div>
        </div>
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup menu navigasi"
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-white/75 transition hover:bg-white/10 hover:text-white lg:hidden"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
