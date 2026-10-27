import type { SVGProps } from "react";

/** Ikon garis khusus halaman ini (gaya sama dengan Icon Dashboard: stroke bulat, viewBox 24). */
const PATHS = {
  search: (<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>),
  plus: <path d="M12 5v14M5 12h14" />,
  pencil: <path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17zM14 7l3 3" />,
  trash: <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" />,
  download: <path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  warn: <path d="M12 4 2.8 19.5h18.4zM12 10v4.5M12 17.2v.1" />,
  calendar: (<><rect x="4" y="5" width="16" height="15" rx="3" /><path d="M8 3v4M16 3v4M4 10h16" /></>),
  clock: (<><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>),
  doc: (<><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4M9 13h6M9 17h4" /></>),
  bot: (<><rect x="4" y="8" width="16" height="11" rx="3.5" /><path d="M12 4v4M9 13.5v.5M15 13.5v.5" /></>),
  swap: <path d="M7 4v14m0 0-3-3m3 3 3-3M17 20V6m0 0-3 3m3-3 3 3" />,
  table: (<><rect x="3.5" y="4" width="17" height="16" rx="3" /><path d="M3.5 10h17M10 10v10" /></>),
  arrowRight: <path d="M5 12h14m0 0-6-6m6 6-6 6" />,
  chevronDown: <path d="m6 9 6 6 6-6" />,
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
