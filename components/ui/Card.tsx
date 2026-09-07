import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg" | "none";
  radius?: "lg" | "xl" | "2xl";
  border?: boolean;
  shadow?: boolean;
}

const paddingMap = {
  sm: "p-3",
  md: "p-4",
  lg: "p-5",
  none: "",
};

const radiusMap = {
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
};

export function Card({
  children,
  className = "",
  padding = "lg",
  radius = "2xl",
  border = true,
  shadow = true,
}: CardProps) {
  return (
    <div
      className={`
        bg-card
        ${paddingMap[padding]}
        ${radiusMap[radius]}
        ${border ? "border border-border" : ""}
        ${shadow ? "shadow-card" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
