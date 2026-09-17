const RULES = [
  { label: 'Blessing', key: 'F1' },
  { label: 'Agi Up', key: 'F2' },
];

function DemoSwitch({ checked, disabled }: { checked: boolean; disabled: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      className="relative w-9 h-5 rounded-md border border-border bg-background shrink-0 opacity-50 cursor-not-allowed"
    >
      <span
        className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-sm bg-foreground transition-transform duration-200 ${
          checked ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

export function DemoAutobuff() {
  return (
    <section
      className="rounded-md border border-border bg-background flex flex-col h-full min-h-[12rem]"
      id="ro-demo-panel-buffs"
      role="tabpanel"
      aria-labelledby="ro-demo-tab-buffs"
    >
      <div className="border-b border-border px-3 py-2 shrink-0">
        <h3 className="text-[10px] font-semibold text-muted uppercase tracking-wide">AutoBuff</h3>
      </div>
      <div className="px-3 py-2 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">Sin buffs aplicados</p>
            <p className="text-[10px] text-muted">Inicia el juego</p>
          </div>
          <DemoSwitch checked={false} disabled />
        </div>
        <ul className="space-y-1.5">
          {RULES.map(rule => (
            <li
              key={rule.label}
              className="flex items-center justify-between gap-2 rounded-md border border-border bg-card px-2.5 py-2 opacity-50"
            >
              <span className="text-[11px] text-muted">{rule.label}</span>
              <span className="text-[10px] font-mono text-muted">{rule.key}</span>
            </li>
          ))}
        </ul>
        <p className="text-[10px] leading-snug text-muted">
          Activa cada buff y asigna la tecla donde lo tienes configurado en el juego.
        </p>
      </div>
    </section>
  );
}
