type InputType = "text" | "email" | "password" | "number" | "date" | "select" | "textarea";

type Option = { value: string; label: string };

type FieldProps = {
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
  /** Tampilkan label hanya untuk pembaca layar (mis. baris kolom di builder) */
  hideLabel?: boolean;
  /** Awalan di dalam kolom, mis. "Rp" */
  prefix?: string;
};

const CHEVRON = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23737687' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`;

const FIELD =
  "w-full rounded-input border border-transparent bg-field px-4 text-[14px] text-ink placeholder:text-faint transition focus:border-brand focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand/15 focus-visible:outline-none";

export function Field({
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
  hideLabel = false,
  prefix,
}: FieldProps) {
  const inputId = id || `field-${label.toLowerCase().replace(/\s+/g, "-")}`;
  const messageId = `${inputId}-message`;
  const state = `${disabled ? "cursor-not-allowed opacity-50" : ""} ${error ? "!border-bad focus:ring-bad/20" : ""}`;
  const aria = {
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error || helper ? messageId : undefined,
  } as const;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={inputId} className={hideLabel ? "sr-only" : "text-[13px] font-bold text-ink"}>
        {label}
        {required && <span className="ml-0.5 text-bad">*</span>}
      </label>

      {type === "select" ? (
        <select
          id={inputId}
          required={required}
          {...aria}
          value={value || ""}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className={`${FIELD} ${state} h-11 appearance-none bg-[length:16px_16px] bg-[right_14px_center] bg-no-repeat pr-10`}
          style={{ backgroundImage: CHEVRON }}
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
          {...aria}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          rows={3}
          disabled={disabled}
          className={`${FIELD} ${state} min-h-[96px] resize-y py-3`}
        />
      ) : prefix ? (
        <div className={`flex h-11 items-center gap-2 rounded-input border border-transparent bg-field pl-1.5 pr-4 transition focus-within:border-brand focus-within:bg-white focus-within:ring-4 focus-within:ring-brand/15 ${state}`}>
          <span className="flex h-8 items-center rounded-lg bg-[#e8f0ff] px-2.5 text-[12px] font-extrabold text-navy">{prefix}</span>
          <input
            id={inputId}
            type={type}
            required={required}
            min={type === "number" ? 0 : undefined}
            {...aria}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className="tabular w-full bg-transparent text-right text-[15px] font-bold text-ink outline-none placeholder:font-normal placeholder:text-faint"
          />
        </div>
      ) : (
        <input
          id={inputId}
          type={type}
          required={required}
          min={type === "number" ? 0 : undefined}
          {...aria}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`${FIELD} ${state} h-11`}
        />
      )}

      {error ? (
        <p id={messageId} role="alert" className="text-[12px] font-semibold text-bad">
          {error}
        </p>
      ) : helper ? (
        <p id={messageId} className="text-[12px] text-faint">
          {helper}
        </p>
      ) : null}
    </div>
  );
}
