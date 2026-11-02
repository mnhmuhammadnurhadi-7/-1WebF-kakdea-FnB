import type { ReactNode } from "react";

type LoginFieldProps = {
  id: string;
  label: string;
  type: "email" | "password" | "text";
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  autoComplete: string;
  invalid: boolean;
  inputMode?: "email";
  trailing?: ReactNode;
};

export function LoginField({ id, label, type, value, onChange, placeholder, autoComplete, invalid, inputMode, trailing }: LoginFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-[11px] font-extrabold uppercase tracking-[.1em] text-label">{label}</label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={type}
          autoComplete={autoComplete}
          inputMode={inputMode}
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={invalid}
          placeholder={placeholder}
          className={"h-12 w-full rounded-input border border-line bg-white px-4 text-[14px] text-ink placeholder:text-faint transition focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15 " + (trailing ? "pr-12" : "")}
        />
        {trailing && <div className="absolute inset-y-0 right-2 flex items-center">{trailing}</div>}
      </div>
    </div>
  );
}
