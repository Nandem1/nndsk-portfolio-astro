import { focusRing } from './classes';
import type { DemoAction, DemoState } from './types';

const FUNCTION_KEYS = ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9'] as const;
const NUMBER_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'] as const;

interface Props {
  state: DemoState;
  dispatch: React.Dispatch<DemoAction>;
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

export function DemoSpammer({ state, dispatch }: Props) {
  const selected = new Set(state.spammerKeys);
  const keysLabel = state.spammerKeys.join(', ') || '—';

  return (
    <section className="rounded-md border border-border bg-background flex flex-col h-full min-h-[12rem]">
      <div className="border-b border-border px-3 py-2 shrink-0">
        <h3 className="text-[10px] font-semibold text-muted uppercase tracking-wide">Spammer</h3>
      </div>
      <div className="px-3 py-2 flex flex-col gap-2 flex-1 min-h-0 overflow-y-auto">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">Inactivo</p>
            <p className="text-[10px] text-muted">Inicia el juego</p>
          </div>
          <DemoSwitch checked={false} disabled />
        </div>
        <div className="rounded-md border border-border bg-card px-2.5 py-2 space-y-1.5">
          <div className="flex justify-between text-[10px]">
            <span className="text-muted uppercase tracking-wide">Teclas</span>
            <span className="text-muted truncate ml-2">{keysLabel}</span>
          </div>
          <KeyRow
            keys={FUNCTION_KEYS}
            selected={selected}
            onToggle={key => dispatch({ type: 'toggleSpammerKey', key })}
          />
          <KeyRow
            keys={NUMBER_KEYS}
            selected={selected}
            onToggle={key => dispatch({ type: 'toggleSpammerKey', key })}
          />
        </div>
        <p className="text-[10px] text-muted">Delay: 15ms</p>
        <input type="range" disabled className="w-full opacity-50" aria-label="Delay del spammer" />
      </div>
    </section>
  );
}

function KeyRow({
  keys,
  selected,
  onToggle,
}: {
  keys: readonly string[];
  selected: Set<string>;
  onToggle: (key: string) => void;
}) {
  return (
    <div className="flex gap-1 flex-wrap">
      {keys.map(key => {
        const active = selected.has(key);
        return (
          <button
            key={key}
            type="button"
            onClick={() => onToggle(key)}
            className={`min-w-[2rem] px-1 py-1 rounded-md text-[10px] font-semibold border transition-colors duration-200 ${focusRing} ${
              active
                ? 'border-border-strong bg-background text-foreground'
                : 'border-border bg-card text-muted hover:text-foreground'
            }`}
          >
            {key}
          </button>
        );
      })}
    </div>
  );
}
