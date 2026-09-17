import {
  focusRing,
  innerWell,
  panelBody,
  panelHeader,
  panelIdle,
  panelShell,
  panelTitle,
  panelWarning,
} from '../chrome/classes';
import { formatSpammerKeysLabel, toolsReady } from '../demo.logic';
import type { DemoAction, DemoState } from '../types';
import { DemoToggle } from '../chrome/DemoToggle';

const FUNCTION_KEYS = ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9'] as const;
const NUMBER_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'] as const;

interface Props {
  state: DemoState;
  dispatch: React.Dispatch<DemoAction>;
}

export function DemoSpammer({ state, dispatch }: Props) {
  const ready = toolsReady(state);
  const selected = new Set(state.spammerKeys);
  const keysLabel = formatSpammerKeysLabel(state.spammerKeys);
  const tone = !ready ? panelIdle : state.spammerEnabled ? panelWarning : '';

  const statusLine1 = !ready || !state.spammerEnabled ? 'Inactivo' : `Standby — ${keysLabel}`;

  const statusLine2 = !ready ? 'Prepara el entorno' : 'Demo — sin cliente real';

  return (
    <section className={`${panelShell} h-full min-h-[16rem] ${tone}`}>
      <div className={panelHeader}>
        <h3 className={panelTitle}>Spammer</h3>
      </div>
      <div className={`${panelBody} flex-1 overflow-y-auto pr-0.5`}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-zinc-100 truncate">{statusLine1}</p>
            <p className="text-[10px] text-zinc-600">{statusLine2}</p>
          </div>
          <DemoToggle
            checked={state.spammerEnabled && ready}
            disabled={!ready || state.spammerKeys.length === 0}
            tone="amber"
            onChange={() => dispatch({ type: 'toggleSpammer' })}
          />
        </div>

        <div className={`${innerWell} px-2.5 py-2 space-y-1.5`}>
          <div className="flex justify-between text-[10px]">
            <span className="text-zinc-600 uppercase tracking-wide">Teclas</span>
            <span className="text-zinc-700 truncate ml-2">{keysLabel}</span>
          </div>
          <KeyRow
            keys={FUNCTION_KEYS}
            selected={selected}
            disabled={!ready}
            onToggle={key => dispatch({ type: 'toggleSpammerKey', key })}
          />
          <KeyRow
            keys={NUMBER_KEYS}
            selected={selected}
            disabled={!ready}
            onToggle={key => dispatch({ type: 'toggleSpammerKey', key })}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-600 uppercase tracking-wide shrink-0">Delay</span>
          <input
            type="range"
            min={16}
            max={50}
            step={1}
            disabled={!ready}
            value={state.spammerDelayMs}
            onChange={e => dispatch({ type: 'setSpammerDelay', delayMs: Number(e.target.value) })}
            className="flex-1 accent-amber-500 disabled:opacity-50"
            aria-label="Delay del spammer"
          />
          <span className="text-[10px] text-zinc-500 w-8 text-right shrink-0">
            {state.spammerDelayMs}ms
          </span>
        </div>
      </div>
    </section>
  );
}

function KeyRow({
  keys,
  selected,
  disabled,
  onToggle,
}: {
  keys: readonly string[];
  selected: Set<string>;
  disabled: boolean;
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
            disabled={disabled}
            onClick={() => onToggle(key)}
            className={`min-w-[2rem] px-1 py-1 rounded-md text-[10px] font-semibold border transition-colors duration-200 ${focusRing} disabled:opacity-40 ${
              active
                ? 'border-amber-500/70 bg-amber-500/15 text-amber-200'
                : 'border-zinc-800/80 bg-zinc-950/50 text-zinc-600 hover:text-zinc-400'
            }`}
          >
            {key}
          </button>
        );
      })}
    </div>
  );
}
