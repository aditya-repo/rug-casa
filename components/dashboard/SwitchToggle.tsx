"use client";

type SwitchToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  id?: string;
};

export function SwitchToggle({
  checked,
  onChange,
  disabled = false,
  label,
  id,
}: SwitchToggleProps) {
  const switchId = id ?? "switch-toggle";

  return (
    <label
      htmlFor={switchId}
      className={`inline-flex items-center gap-2 ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
    >
      <span className="relative inline-flex h-6 w-11 shrink-0">
        <input
          id={switchId}
          type="checkbox"
          role="switch"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-neutral-300 transition-colors peer-checked:bg-emerald-500 peer-focus-visible:ring-2 peer-focus-visible:ring-rc-accent peer-focus-visible:ring-offset-2 peer-disabled:cursor-not-allowed"
        />
        <span
          aria-hidden
          className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5"
        />
      </span>
      {label ? <span className="text-sm font-medium text-neutral-700">{label}</span> : null}
    </label>
  );
}
