import type { SVGProps } from "react";

/** Ikon garis khusus halaman Data (gaya sama dengan Icon Dashboard: stroke bulat, viewBox 24). */
const PATHS = {
  plus: <path d="M12 5v14M5 12h14" />,
  pencil: <path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17zM14 7l3 3" />,
  trash: <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" />,
  download: <path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  arrowDown: <path d="M12 5v14m0 0-6-6m6 6 6-6" />,
  arrowUp: <path d="M12 19V5m0 0-6 6m6-6 6 6" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  swap: <path d="M7 4v14m0 0-3-3m3 3 3-3M17 20V6m0 0-3 3m3-3 3 3" />,
  warn: <path d="M12 4 2.8 19.5h18.4zM12 10v4.5M12 17.2v.1" />,
  clipboard: (
    <>
      <rect x="5" y="4" width="14" height="17" rx="3" />
      <path d="M9 4h6v3H9zM9 12h6M9 16h4" />
    </>
  ),
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
