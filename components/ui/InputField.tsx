import React from "react";

type InputType = "text" | "email" | "password" | "number" | "date" | "select" | "textarea";

interface Option {
  value: string;
  label: string;
}

interface InputFieldProps {
  label: string;
  type?: InputType;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  options?: Option[];
  required?: boolean;
  error?: string;
  helper?: string;
  className?: string;
  id?: string;
  disabled?: boolean;
}

export function InputField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  options,
  required,
  error,
  helper,
  className = "",
  id,
  disabled = false,
}: InputFieldProps) {
  const inputId = id || `field-${label.toLowerCase().replace(/\s+/g, "-")}`;
  const messageId = `${inputId}-message`;

  const baseInputClass = `
    w-full rounded-[10px] border border-border bg-card px-4 py-3
    text-[14px] text-ink placeholder:text-muted-light
    focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20
    transition-colors
    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
  `;

  const errorClass = error
    ? "border-danger focus:border-danger focus:ring-danger/20"
    : "";

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label
        htmlFor={inputId}
        className="text-[12px] font-semibold text-muted"
      >
        {label}
        {required && <span className="ml-0.5 text-danger">*</span>}
      </label>

      {type === "select" ? (
        <select
          id={inputId}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || helper ? messageId : undefined}
          value={value || ""}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className={`${baseInputClass} ${errorClass} appearance-none pr-10 bg-[length:16px_16px] bg-no-repeat bg-[right_12px_center]`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%235B6A65' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
          }}
        >
          <option value="" disabled>
            {placeholder || `Pilih ${label.toLowerCase()}`}
          </option>
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          id={inputId}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || helper ? messageId : undefined}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          rows={3}
          disabled={disabled}
          className={`${baseInputClass} ${errorClass} resize-y min-h-[96px]`}
        />
      ) : (
        <input
          id={inputId}
          type={type}
          required={required}
          min={type === "number" ? 0 : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || helper ? messageId : undefined}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`${baseInputClass} ${errorClass}`}
        />
      )}

      {error ? (
        <p id={messageId} role="alert" className="text-[12px] font-medium text-danger">{error}</p>
      ) : helper ? (
        <p id={messageId} className="text-[12px] text-muted-light">{helper}</p>
      ) : null}
    </div>
  );
}
