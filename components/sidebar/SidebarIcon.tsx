import type { SVGProps } from "react";

/** Ikon menu sidebar (garis, ujung bulat, viewBox 24). */
const PATHS = {
  dashboard: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.8" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.8" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.8" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.8" />
    </>
  ),
  data: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3.5" />
      <path d="M10 3v18M10 12h11" />
    </>
  ),
  bot: (
    <>
      <rect x="4.5" y="8.5" width="15" height="11" rx="3.5" />
      <path d="M12 4.5v4M2.5 13v3M21.5 13v3" />
      <circle cx="9" cy="14" r=".9" />
      <circle cx="15" cy="14" r=".9" />
    </>
  ),
  history: <path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1L3.5 8.5M3.5 3.5v5h5M12 7.5V12l3 2" />,
  cms: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="3" />
      <path d="M3 9.5h18M7 14.5h6" />
    </>
  ),
} as const;

export type SidebarIconName = keyof typeof PATHS;

type SidebarIconProps = Omit<SVGProps<SVGSVGElement>, "name" | "stroke"> & {
  name: SidebarIconName;
  size?: number;
  stroke?: number;
};

export function SidebarIcon({ name, size = 20, stroke = 1.9, ...rest }: SidebarIconProps) {
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
