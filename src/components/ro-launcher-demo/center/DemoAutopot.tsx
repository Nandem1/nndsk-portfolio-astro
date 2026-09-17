import { DemoToggle } from '../chrome/DemoToggle';
import {
  innerWell,
  panelBody,
  panelHeader,
  panelIdle,
  panelShell,
  panelSuccess,
  panelTitle,
  selectNative,
} from '../chrome/classes';
import { toolsReady } from '../demo.logic';
import { DEMO_VITALS, getServerById, POT_KEYS } from '../mockData';
import type { DemoAction, DemoState } from '../types';

interface Props {
  state: DemoState;
  dispatch: React.Dispatch<DemoAction>;
  compact?: boolean;
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
  tone: 'red' | 'blue';
}) {
  const empty = max <= 0;
  const pct = empty ? 0 : Math.round((cur / max) * 100);
  const gradient = tone === 'red' ? 'from-red-600 to-red-400' : 'from-sky-600 to-sky-400';

  return (
    <div className="space-y-0.5">
      <div
        className={`flex justify-between text-[10px] ${empty ? 'text-zinc-700' : 'text-zinc-500'}`}
      >
        <span>{label}</span>
        <span>
          {empty ? '— / —' : `${cur.toLocaleString()} / ${max.toLocaleString()} (${pct}%)`}
        </span>
      </div>
      <div
        className={`h-2 rounded-full overflow-hidden ${
          empty ? 'bg-zinc-900/80 border border-dashed border-zinc-800/80' : 'bg-zinc-800'
        }`}
      >
        {!empty && (
          <div
            className={`h-full bg-gradient-to-r ${gradient} transition-all duration-300`}
            style={{ width: `${pct}%` }}
          />
        )}
      </div>
    </div>
  );
}

export function DemoAutopot({ state, dispatch, compact = false }: Props) {
  const server = getServerById(state.selectedServerId);
  const ready = toolsReady(state);
  const tone = !ready ? panelIdle : state.autopotEnabled ? panelSuccess : '';

  const statusLine2 = !ready
    ? 'Prepara el entorno'
    : state.autopotEnabled
      ? 'Simulado'
      : 'Demo — sin cliente real';

  const hpCur = ready ? DEMO_VITALS.hpCur : 0;
  const hpMax = ready ? DEMO_VITALS.hpMax : 0;
  const spCur = ready ? DEMO_VITALS.spCur : 0;
  const spMax = ready ? DEMO_VITALS.spMax : 0;

  return (
    <section
      className={`${panelShell} h-full ${compact ? 'min-h-0' : 'min-h-[14rem] md:min-h-[16rem]'} ${tone}`}
      aria-labelledby="ro-demo-autopot-title"
    >
      <div className={panelHeader}>
        <h3 id="ro-demo-autopot-title" className={panelTitle}>
          AutoPot
        </h3>
      </div>
      <div className={`${panelBody} flex-1 overflow-y-auto pr-0.5`}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-zinc-100 truncate">{server.name}</p>
            <p className="text-[10px] text-zinc-600">{statusLine2}</p>
          </div>
          <DemoToggle
            checked={state.autopotEnabled && ready}
            disabled={!ready}
            tone="emerald"
            onChange={() => dispatch({ type: 'toggleAutopot' })}
          />
        </div>

        <div className={`${innerWell} px-2.5 py-2 space-y-1.5`}>
          <StatBar label="HP" cur={hpCur} max={hpMax} tone="red" />
          <StatBar label="SP" cur={spCur} max={spMax} tone="blue" />
        </div>

        <div className="flex items-center justify-between gap-2 rounded-lg border border-amber-500/15 bg-amber-500/5 px-2.5 py-2">
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-amber-100/90">Modo proactivo</p>
            <p className="text-[10px] leading-snug text-zinc-500">
              Envía HP entre recuperaciones para reducir la reacción con latencia alta.
            </p>
          </div>
          <DemoToggle
            checked={state.autopotProactive}
            disabled={!ready}
            tone="amber"
            onChange={() => dispatch({ type: 'toggleAutopotProactive' })}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-600 uppercase tracking-wide shrink-0">
            Lectura
          </span>
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
            className="flex-1 accent-amber-500 disabled:opacity-50"
            aria-label="Delay de lectura AutoPot"
          />
          <span className="text-[10px] text-zinc-500 w-10 text-right shrink-0">
            {state.autopotDelayMs}ms
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <div className="space-y-1">
            <span className="text-[10px] text-zinc-600 uppercase tracking-wide">HP</span>
            <div className="flex gap-1">
              <select
                className={`${selectNative} text-[11px] py-1`}
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
              <input
                type="number"
                min={1}
                max={99}
                disabled={!ready}
                value={state.autopotHpPercent}
                onChange={e =>
                  dispatch({
                    type: 'setAutopotField',
                    field: 'hpPercent',
                    value: e.target.value,
                  })
                }
                className="w-12 rounded-md border border-zinc-700/80 bg-zinc-950/60 py-1 text-center text-[11px] text-zinc-200 disabled:opacity-50"
                aria-label="Porcentaje de HP"
              />
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-zinc-600 uppercase tracking-wide">SP</span>
            <div className="flex gap-1">
              <select
                className={`${selectNative} text-[11px] py-1`}
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
              <input
                type="number"
                min={1}
                max={99}
                disabled={!ready}
                value={state.autopotSpPercent}
                onChange={e =>
                  dispatch({
                    type: 'setAutopotField',
                    field: 'spPercent',
                    value: e.target.value,
                  })
                }
                className="w-12 rounded-md border border-zinc-700/80 bg-zinc-950/60 py-1 text-center text-[11px] text-zinc-200 disabled:opacity-50"
                aria-label="Porcentaje de SP"
              />
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] text-zinc-600 uppercase tracking-wide">
              Perfil de memoria
            </span>
            <button
              type="button"
              disabled
              title="No disponible en demo"
              className="text-[10px] text-zinc-700"
            >
              Encontrar
            </button>
          </div>
          <select className={selectNative} disabled value="">
            <option value="">Auto</option>
          </select>
        </div>

        <p className="text-[10px] leading-snug text-zinc-600">
          Valores de demostración. No hay cliente.
        </p>
      </div>
    </section>
  );
}
