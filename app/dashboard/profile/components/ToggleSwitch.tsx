type ToggleSwitchProps = { checked: boolean; onChange: (v: boolean) => void };

export function ToggleSwitch({ checked, onChange }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={"relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors " + (checked ? "bg-ok" : "bg-line")}
    >
      <span className={"inline-block size-5 transform rounded-full bg-white shadow transition-transform " + (checked ? "translate-x-6" : "translate-x-1")} />
    </button>
  );
}
