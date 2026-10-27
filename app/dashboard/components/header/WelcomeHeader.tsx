"use client";

import { Icon } from "../shared/Icon";
import { greeting } from "../shared/format";

const OWNER = "Bu Pemilik";

type WelcomeHeaderProps = { period: string | null };

export function WelcomeHeader({ period }: WelcomeHeaderProps) {
  return (
    <section className="flex items-start justify-between gap-6">
      <div>
        <p className="flex items-center gap-2 text-[11px] font-extrabold tracking-[.1em] text-brand">
          DAPUR SOJU · PUSAT KENDALI UTAMA
          <span className="font-semibold text-muted">• SYS-ID: FZN-ID26</span>
        </p>
        <h1 className="mt-2 text-[34px] font-bold leading-[1.15] tracking-[-.03em]">
          {greeting()}, {OWNER}
        </h1>
        <p className="mt-1.5 text-[15px] text-body">Berikut ringkasan operasional &amp; kas Dapur Soju hari ini.</p>
      </div>

      {period && (
        <span className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-4 text-[13px] font-semibold shadow-btn">
          <Icon name="calendar" size={17} stroke={2} className="text-brand" />
          {period}
        </span>
      )}
    </section>
  );
}
