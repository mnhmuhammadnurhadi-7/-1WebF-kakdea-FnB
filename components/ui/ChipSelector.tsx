import React from "react";

export interface ChipOption {
  id: string;
  label: string;
}

interface ChipSelectorProps {
  options: ChipOption[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
}

export function ChipSelector({
  options,
  value,
  onChange,
  className = "",
}: ChipSelectorProps) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {options.map((opt) => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`
              inline-flex h-10 items-center justify-center rounded-[10px] px-4
              text-[14px] font-semibold transition-colors
              ${active
                ? "bg-teal-active text-white shadow-card-hover"
                : "bg-card text-ink border border-border hover:bg-card-alt"
              }
            `}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
