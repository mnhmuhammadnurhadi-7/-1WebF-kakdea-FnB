import React from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-btn font-semibold transition-[color,background-color,border-color,box-shadow,transform] duration-150 ease-out focus:outline-none focus:ring-4 focus:ring-brand/20 disabled:opacity-50 disabled:cursor-not-allowed";

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-brand text-white shadow-blue hover:bg-brand-hover active:bg-brand-press",
  secondary: "bg-accent-tag text-accent hover:bg-accent-bg",
  ghost: "text-ink hover:bg-border/60",
  outline: "bg-white text-ink border border-line shadow-btn hover:bg-card-alt",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-[13px]",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-[15px]",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  leftIcon,
  rightIcon,
  fullWidth,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
}
