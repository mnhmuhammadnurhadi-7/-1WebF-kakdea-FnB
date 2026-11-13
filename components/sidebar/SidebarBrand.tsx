import Image from "next/image";

/** Logo + nama usaha di bagian atas sidebar. */
export function SidebarBrand() {
  return (
    <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
      <Image src="/soju.png" alt="" width={36} height={36} loading="eager" className="size-9 shrink-0 rounded-full object-cover" />
      <div>
        <div className="text-lg font-bold text-white">SOJU</div>
        <div className="text-[10px] font-medium tracking-wide text-white/65">KULINER &amp; FROZEN FOOD</div>
      </div>
    </div>
  );
}
