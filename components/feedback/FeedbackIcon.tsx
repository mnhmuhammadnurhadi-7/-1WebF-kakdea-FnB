import type { SVGProps } from "react";

const PATHS = {
  check: <><circle cx="12" cy="12" r="9" /><path d="m8 12.5 3 3 5-6" /></>,
  error: <><circle cx="12" cy="12" r="9" /><path d="m9 9 6 6M15 9l-6 6" /></>,
  warn: <path d="M12 4 2.8 19.5h18.4zM12 10v4.5M12 17.2v.1" />,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8v.1" /></>,
  trash: <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  refresh: <path d="M20 12a8 8 0 1 1-2.6-5.9M20 4v5h-5" />,
  file: <><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4M9 13h6M9 17h4" /></>,
} as const;

export type FeedbackIconName = keyof typeof PATHS;

type Props = Omit<SVGProps<SVGSVGElement>, "name" | "stroke"> & { name: FeedbackIconName; size?: number; stroke?: number };

export function FeedbackIcon({ name, size = 18, stroke = 1.9, ...rest }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0" {...rest}>
      {PATHS[name]}
    </svg>
  );
}
