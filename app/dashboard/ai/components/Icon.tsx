import type { SVGProps } from "react";

/** Ikon garis khusus halaman ini (gaya sama dengan Icon Dashboard: stroke bulat, viewBox 24). */
const PATHS = {
  send: <path d="M21 3 10 14M21 3l-7 18-4-7-7-4z" />,
  sparkle: <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" />,
  copy: (<><rect x="9" y="9" width="11" height="11" rx="2.5" /><path d="M5 15V6a2 2 0 0 1 2-2h8" /></>),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  bot: (<><rect x="4" y="8" width="16" height="11" rx="3.5" /><path d="M12 4v4M9 13.5v.5M15 13.5v.5" /></>),
  doc: (<><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4M9 13h6M9 17h4" /></>),
  plus: <path d="M12 5v14M5 12h14" />,
} as const;

export type IconName = keyof typeof PATHS;

type IconProps = Omit<SVGProps<SVGSVGElement>, "name" | "stroke"> & {
  name: IconName;
  size?: number;
  stroke?: number;
};

export function Icon({ name, size = 18, stroke = 1.9, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0"
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}
