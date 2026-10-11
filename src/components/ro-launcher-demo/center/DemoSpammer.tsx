import type { Dispatch } from 'react';
import {
  keyChip,
  keyChipActive,
  keyChipIdle,
  microLabel,
  panelHeader,
  panelIdle,
  panelShell,
  panelTitle,
  panelWarning,
  rangeProgress,
  textDetail,
  textInk,
  toolPanelBody,
} from '../chrome/classes';
import { formatSpammerKeysLabel, toolsReady } from '../demo.logic';
import type { DemoAction, DemoState } from '../types';
import { DemoToggle } from '../chrome/DemoToggle';

const FUNCTION_KEYS = ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9'] as const;
const NUMBER_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'] as const;

interface Props {
  state: DemoState;
  dispatch: Dispatch<DemoAction>;
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
        <p id="ro-demo-spammer-title" className={panelTitle}>
          Spammer
        </p>
      </div>
      <div className={`${toolPanelBody} flex-1 overflow-y-auto`}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className={`truncate text-[13px] font-semibold leading-5 ${textInk}`}>
              {statusLine1}
            </p>
            <p className={textDetail}>{statusLine2}</p>
          </div>
          <DemoToggle
            checked={state.spammerEnabled && ready}
            disabled={!ready || state.spammerKeys.length === 0}
            labelledBy="ro-demo-spammer-title"
            onChange={() => dispatch({ type: 'toggleSpammer' })}
          />
        </div>

        <div className="space-y-1 py-2">
          <div className={`flex justify-between ${textDetail}`}>
            <span className={microLabel}>Teclas</span>
            <span
              className={`ml-2 truncate font-mono ${
                state.spammerEnabled && ready
                  ? 'ro-ok font-medium'
                  : 'text-[rgb(var(--ro-c-muted))]'
              }`}
            >
              {keysLabel}
            </span>
          </div>
          <div className="space-y-1">
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
        </div>

        <div className="flex min-w-0 items-center gap-2 overflow-hidden">
          <span className={`${microLabel} shrink-0`}>Delay</span>
          <input
            type="range"
            min={16}
            max={50}
            step={1}
            disabled={!ready}
            value={state.spammerDelayMs}
            onChange={e => dispatch({ type: 'setSpammerDelay', delayMs: Number(e.target.value) })}
            className="min-w-0 w-full flex-1"
            style={rangeProgress(state.spammerDelayMs, 16, 50)}
            aria-label="Delay del spammer"
          />
          <span className={`${textDetail} w-8 shrink-0 text-right font-mono`}>
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
    <div className="flex gap-1">
      {keys.map(key => {
        const active = selected.has(key);
        return (
          <button
            key={key}
            type="button"
            disabled={disabled}
            onClick={() => onToggle(key)}
            className={`${keyChip} ${active ? keyChipActive : keyChipIdle}`}
          >
            {key}
          </button>
        );
      })}
    </div>
  );
}
