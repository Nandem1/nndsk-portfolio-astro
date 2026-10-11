import type { Dispatch } from 'react';
import { DemoToggle } from '../chrome/DemoToggle';
import {
  fieldCompact,
  microLabel,
  panelHeader,
  panelIdle,
  panelShell,
  panelSuccess,
  panelTitle,
  selectFlex,
  selectNative,
  textDetail,
  textInk,
  toolPanelBody,
} from '../chrome/classes';
import { toolsReady } from '../demo.logic';
import { DEMO_VITALS, getServerById, POT_KEYS } from '../mockData';
import type { DemoAction, DemoState } from '../types';

interface Props {
  state: DemoState;
  dispatch: Dispatch<DemoAction>;
}

function StatBar({
  label,
  cur,
  max,
  tone,
}: {
  label: string;
  cur: number;
  max: number;
  tone: 'hp' | 'sp';
}) {
  const empty = max <= 0;
  const pct = empty ? 0 : Math.round((cur / max) * 100);
  const fill = tone === 'hp' ? 'bg-[rgb(var(--ro-c-bad))]' : 'bg-[rgb(var(--ro-c-info))]';

  return (
    <div className="space-y-0.5">
      <div className={`flex justify-between text-[11px] ${textDetail}`}>
        <span>{label}</span>
        <span>
          {empty ? '— / —' : `${cur.toLocaleString()} / ${max.toLocaleString()} (${pct}%)`}
        </span>
      </div>
      <div
        className={`h-1.5 overflow-hidden rounded-full bg-[rgb(var(--ro-c-panel-raised))] ${
          empty ? 'border border-dashed border-[rgb(var(--ro-c-line))]' : ''
        }`}
      >
        {!empty && <div className={`h-full ${fill}`} style={{ width: `${pct}%` }} />}
      </div>
    </div>
  );
}

function PercentField({
  value,
  disabled,
  ariaLabel,
  onChange,
}: {
  value: number | string;
  disabled: boolean;
  ariaLabel: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative w-14 shrink-0">
      <input
        type="number"
        min={1}
        max={99}
        disabled={disabled}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={fieldCompact}
        aria-label={ariaLabel}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-1.5 flex items-center font-mono text-[11px] tabular-nums text-[rgb(var(--ro-c-muted))]"
      >
        %
      </span>
    </div>
  );
}

export function DemoAutopot({ state, dispatch }: Props) {
  const server = getServerById(state.selectedServerId);
  const ready = toolsReady(state);
  const tone = !ready ? panelIdle : state.autopotEnabled ? panelSuccess : '';

  const statusLine2 = !ready
    ? 'Prepara el entorno'
    : state.autopotEnabled
      ? 'Sin cliente'
      : 'Demo — sin cliente real';

  const hpCur = ready ? DEMO_VITALS.hpCur : 0;
  const hpMax = ready ? DEMO_VITALS.hpMax : 0;
  const spCur = ready ? DEMO_VITALS.spCur : 0;
  const spMax = ready ? DEMO_VITALS.spMax : 0;

  return (
    <section
      className={`${panelShell} h-full min-h-[16rem] ${tone}`}
      aria-labelledby="ro-demo-autopot-title"
    >
      <div className={panelHeader}>
        <p id="ro-demo-autopot-title" className={panelTitle}>
          AutoPot
        </p>
      </div>
      <div className={`${toolPanelBody} flex-1 overflow-y-auto`}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className={`truncate text-sm font-semibold ${textInk}`}>{server.name}</p>
            <p className={textDetail}>{statusLine2}</p>
          </div>
          <DemoToggle
            checked={state.autopotEnabled && ready}
            disabled={!ready}
            labelledBy="ro-demo-autopot-title"
            onChange={() => dispatch({ type: 'toggleAutopot' })}
          />
        </div>

        <StatBar label="HP" cur={hpCur} max={hpMax} tone="hp" />
        <StatBar label="SP" cur={spCur} max={spMax} tone="sp" />

        <div className="flex items-center justify-between gap-2 py-2">
          <div className="min-w-0">
            <p
              id="ro-demo-autopot-proactive-label"
              className={`text-[11px] font-medium ${textInk}`}
            >
              Modo proactivo
            </p>
            <p className={`${textDetail} leading-snug`}>
              Envía HP entre recuperaciones para reducir la reacción con latencia alta.
            </p>
          </div>
          <DemoToggle
            checked={state.autopotProactive}
            disabled={!ready}
            labelledBy="ro-demo-autopot-proactive-label"
            onChange={() => dispatch({ type: 'toggleAutopotProactive' })}
          />
        </div>

        <div className="flex min-w-0 items-center gap-2 overflow-hidden">
          <span className={`${microLabel} shrink-0`}>Lectura</span>
          <input
            type="range"
            min={10}
            max={200}
            step={1}
            disabled={!ready}
            value={state.autopotDelayMs}
            onChange={e =>
              dispatch({
                type: 'setAutopotField',
                field: 'delayMs',
                value: Number(e.target.value),
              })
            }
            className="min-w-0 w-full flex-1 disabled:opacity-50"
            aria-label="Delay de lectura AutoPot"
          />
          <span className={`${textDetail} w-10 shrink-0 text-right`}>{state.autopotDelayMs}ms</span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2">
            <label htmlFor="ro-demo-autopot-memory-profile" className={microLabel}>
              Perfil de memoria
            </label>
            <button type="button" disabled title="No disponible en demo" className={textDetail}>
              Encontrar
            </button>
          </div>
          <select id="ro-demo-autopot-memory-profile" className={selectNative} disabled value="">
            <option value="">Auto</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label htmlFor="ro-demo-autopot-hp-key" className={microLabel}>
              <span className="sr-only">Tecla de </span>HP
            </label>
            <div className="flex items-center gap-1">
              <select
                id="ro-demo-autopot-hp-key"
                className={selectFlex}
                disabled={!ready}
                value={state.autopotHpKey}
                onChange={e =>
                  dispatch({
                    type: 'setAutopotField',
                    field: 'hpKey',
                    value: e.target.value,
                  })
                }
              >
                {POT_KEYS.map(key => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
              <PercentField
                value={state.autopotHpPercent}
                disabled={!ready}
                ariaLabel="Porcentaje de HP"
                onChange={value =>
                  dispatch({
                    type: 'setAutopotField',
                    field: 'hpPercent',
                    value,
                  })
                }
              />
            </div>
          </div>
          <div className="space-y-1">
            <label htmlFor="ro-demo-autopot-sp-key" className={microLabel}>
              <span className="sr-only">Tecla de </span>SP
            </label>
            <div className="flex items-center gap-1">
              <select
                id="ro-demo-autopot-sp-key"
                className={selectFlex}
                disabled={!ready}
                value={state.autopotSpKey}
                onChange={e =>
                  dispatch({
                    type: 'setAutopotField',
                    field: 'spKey',
                    value: e.target.value,
                  })
                }
              >
                {POT_KEYS.map(key => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
              <PercentField
                value={state.autopotSpPercent}
                disabled={!ready}
                ariaLabel="Porcentaje de SP"
                onChange={value =>
                  dispatch({
                    type: 'setAutopotField',
                    field: 'spPercent',
                    value,
                  })
                }
              />
            </div>
          </div>
        </div>

        <p className={`${textDetail} leading-snug`}>Valores de demostración. No hay cliente.</p>
      </div>
    </section>
  );
}
