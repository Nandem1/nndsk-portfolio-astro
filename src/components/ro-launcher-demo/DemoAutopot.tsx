import { getServerById } from './mockData';

interface Props {
  serverId: ReturnType<typeof getServerById>['id'];
}

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

export function DemoAutopot({ serverId }: Props) {
  const server = getServerById(serverId);

  return (
    <section
      className="rounded-md border border-border bg-background flex flex-col h-full min-h-[12rem]"
      aria-labelledby="ro-demo-autopot-title"
    >
      <div className="border-b border-border px-3 py-2 shrink-0">
        <h3
          id="ro-demo-autopot-title"
          className="text-[10px] font-semibold text-muted uppercase tracking-wide"
        >
          AutoPot
        </h3>
      </div>
      <div className="px-3 py-2 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{server.name}</p>
            <p className="text-[10px] text-muted">Inicia el juego</p>
          </div>
          <DemoSwitch checked={false} disabled />
        </div>
        <div className="space-y-1.5 rounded-md border border-border bg-card px-2.5 py-2">
          <StatBar label="HP" empty />
          <StatBar label="SP" empty />
        </div>
        <div className="flex gap-2">
          <label className="flex-1 text-[10px] text-muted">
            HP
            <select
              disabled
              className="mt-1 w-full bg-background border border-border rounded-md px-2 py-1 text-sm text-muted opacity-50"
            >
              <option>F9</option>
            </select>
          </label>
          <label className="flex-1 text-[10px] text-muted">
            SP
            <select
              disabled
              className="mt-1 w-full bg-background border border-border rounded-md px-2 py-1 text-sm text-muted opacity-50"
            >
              <option>F8</option>
            </select>
          </label>
        </div>
      </div>
    </section>
  );
}

function StatBar({ label, empty }: { label: string; empty: boolean }) {
  return (
    <div className="space-y-0.5">
      <div className="flex justify-between text-[10px] text-muted">
        <span>{label}</span>
        <span>{empty ? '— / —' : ''}</span>
      </div>
      <div className="h-2 rounded-md overflow-hidden bg-background border border-dashed border-border" />
    </div>
  );
}
