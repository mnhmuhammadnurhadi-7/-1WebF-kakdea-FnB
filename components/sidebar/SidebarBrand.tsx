/** Logo + nama usaha di bagian atas sidebar. */
export function SidebarBrand() {
  return (
    <div className="relative flex items-center gap-3 border-b border-white/10 px-5 py-5">
      <span className="flex size-[38px] items-center justify-center rounded-xl bg-brand text-[19px] font-extrabold text-white shadow-blue">
        S
      </span>
      <div>
        <div className="text-[19px] font-extrabold tracking-wide text-white">SOJU</div>
        <div className="text-[9.5px] font-bold tracking-[.1em] text-sky">KULINER &amp; FROZEN FOOD</div>
      </div>
    </div>
  );
}
