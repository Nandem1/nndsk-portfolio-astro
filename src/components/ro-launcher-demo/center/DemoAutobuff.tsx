import { DemoToggle } from '../chrome/DemoToggle';
import {
  focusRing,
  panelBody,
  panelHeader,
  panelIdle,
  panelShell,
  panelSuccess,
  panelTitle,
  selectNative,
} from '../chrome/classes';
import { hasEnabledAutobuffRule, toolsReady } from '../demo.logic';
import { POT_KEYS } from '../mockData';
import type { DemoAction, DemoState, PotKey } from '../types';

interface Props {
  state: DemoState;
  dispatch: React.Dispatch<DemoAction>;
}

export function DemoAutobuff({ state, dispatch }: Props) {
  const ready = toolsReady(state);
  const tone = !ready ? panelIdle : state.autobuffEnabled ? panelSuccess : '';
  const canToggle = ready && hasEnabledAutobuffRule(state);

  const statusLine2 = !ready ? 'Prepara el entorno' : 'Demo — sin cliente real';

  return (
    <section
      className={`${panelShell} h-full min-h-[16rem] w-full ${tone}`}
      id="ro-demo-panel-buffs"
      role="tabpanel"
      aria-labelledby="ro-demo-tab-buffs"
    >
      <div className={panelHeader}>
        <h3 className={panelTitle}>AutoBuff</h3>
      </div>
      <div className={`${panelBody} flex-1 overflow-y-auto`}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-zinc-100 truncate">Sin buffs aplicados</p>
            <p className="text-[10px] text-zinc-600">{statusLine2}</p>
          </div>
          <DemoToggle
            checked={state.autobuffEnabled && ready}
            disabled={!canToggle}
            tone="emerald"
            onChange={() => dispatch({ type: 'toggleAutobuff' })}
          />
        </div>

        <ul className="space-y-1.5">
          {state.autobuffRules.map(rule => (
            <li
              key={rule.id}
              className="flex items-center justify-between gap-2 rounded-lg border border-zinc-800/60 bg-zinc-950/40 px-2.5 py-2"
            >
              <label className="flex items-center gap-2 min-w-0 flex-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rule.enabled}
                  disabled={!ready}
                  onChange={() => dispatch({ type: 'toggleAutobuffRule', ruleId: rule.id })}
                  className={`accent-amber-500 shrink-0 ${focusRing}`}
                />
                <span className="text-[11px] text-zinc-300 truncate">{rule.label}</span>
              </label>
              <select
                className={`${selectNative} text-[11px] py-1 w-16 shrink-0`}
                disabled={!ready}
                value={rule.key}
                onChange={e =>
                  dispatch({
                    type: 'setAutobuffRuleKey',
                    ruleId: rule.id,
                    key: e.target.value as PotKey,
                  })
                }
              >
                {POT_KEYS.map(key => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            </li>
          ))}
        </ul>

        <p className="text-[10px] leading-snug text-zinc-600">
          Activa cada buff y asigna la tecla donde lo tienes configurado en el juego.
        </p>
      </div>
    </section>
  );
}
