import React from "react";

type BadgeVariant = "ai" | "manual" | "new" | "source" | "success" | "danger" | "custom";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  ai: "bg-teal-success-bg text-teal-active",
  manual: "bg-accent-tag text-accent",
  new: "bg-teal-success-bg text-teal-success",
  source: "bg-yellow-tag-bg text-yellow-tag-ink",
  success: "bg-teal-success-bg text-teal-success",
  danger: "bg-danger-bg text-danger",
  custom: "",
};

export function Badge({ children, variant = "custom", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-2 py-1 font-heading text-[11px] font-bold tracking-tight ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
