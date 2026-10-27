import type { SVGProps } from "react";

/** Ikon garis khusus halaman ini (gaya sama dengan Icon Dashboard: stroke bulat, viewBox 24). */
const PATHS = {
  search: (<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>),
  plus: <path d="M12 5v14M5 12h14" />,
  pencil: <path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17zM14 7l3 3" />,
  trash: <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  warn: <path d="M12 4 2.8 19.5h18.4zM12 10v4.5M12 17.2v.1" />,
  clipboard: (<><rect x="5" y="4" width="14" height="17" rx="3" /><path d="M9 4h6v3H9zM9 12h6M9 16h4" /></>),
  external: <path d="M14 4h6v6M20 4 10 14M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />,
  upload: <path d="M12 16V5m0 0-4 4m4-4 4 4M5 20h14" />,
  home: <path d="M4 11 12 4l8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" />,
  users: (<><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14.2a6.5 6.5 0 0 1 3.5 5.8" /></>),
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A15 15 0 0 1 4 5a1 1 0 0 1 1-1z" />,
  mail: (<><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m4 8 8 6 8-6" /></>),
  pin: (<><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>),
  image: (<><rect x="3" y="4" width="18" height="16" rx="3" /><circle cx="9" cy="10" r="1.8" /><path d="m4 18 5-5 4 4 3-3 4 4" /></>),
  star: <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />,
  chat: <path d="M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-7l-5 4v-4H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />,
  doc: (<><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4M9 13h6M9 17h4" /></>),
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
