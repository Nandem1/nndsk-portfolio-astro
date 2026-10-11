type DemoToggleName = { label: string; labelledBy?: never } | { labelledBy: string; label?: never };

interface DemoToggleBase {
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}

type DemoToggleProps = DemoToggleBase & DemoToggleName;

export function DemoToggle({
  checked,
  disabled = false,
  onChange,
  label,
  labelledBy,
}: DemoToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      {...(labelledBy !== undefined ? { 'aria-labelledby': labelledBy } : { 'aria-label': label })}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative h-5 w-9 shrink-0 rounded-full transition-colors duration-120 disabled:cursor-not-allowed ${
        checked ? 'bg-[rgb(var(--ro-c-ok))]' : 'bg-[rgb(var(--ro-c-track))]'
      }`}
    >
      <span
        className={`absolute top-0.5 h-4 w-4 rounded-full transition-colors duration-120 ${
          checked
            ? 'left-[18px] bg-[rgb(var(--ro-c-surface))]'
            : 'left-0.5 bg-[rgb(var(--ro-c-muted))]'
        }`}
      />
    </button>
  );
}
