import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Icon, type IconName } from "../shared/Icon";

type Variant = "primary" | "secondary" | "outline" | "danger";
type Size = "sm" | "md";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  children: ReactNode;
};

const VARIANT: Record<Variant, string> = {
  primary: "bg-brand text-white shadow-blue hover:brightness-110",
  secondary: "bg-white text-ink shadow-btn hover:bg-app",
  outline: "border border-line bg-white text-ink hover:bg-app",
  danger: "border border-bad/30 bg-white text-bad hover:bg-bad-tint",
};

const SIZE: Record<Size, string> = {
  sm: "h-9 rounded-xl px-3.5 text-[12.5px]",
  md: "h-11 rounded-xl px-5 text-[13.5px]",
};

export function Button({ variant = "primary", size = "md", icon, className = "", children, type = "button", ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex shrink-0 items-center justify-center gap-2 font-bold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/25 disabled:cursor-not-allowed disabled:opacity-50 ${VARIANT[variant]} ${SIZE[size]} ${className}`}
      {...rest}
    >
      {icon && <Icon name={icon} size={16} stroke={2.2} />}
      {children}
    </button>
  );
}
