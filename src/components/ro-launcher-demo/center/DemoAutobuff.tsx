import type { Dispatch } from 'react';
import { DemoToggle } from '../chrome/DemoToggle';
import {
  panelHeader,
  panelIdle,
  panelShell,
  panelSuccess,
  panelTitle,
  selectNative,
  textDetail,
  textInk,
  toolPanelBody,
} from '../chrome/classes';
import { hasEnabledAutobuffRule, toolsReady } from '../demo.logic';
import { POT_KEYS } from '../mockData';
import type { DemoAction, DemoState, PotKey } from '../types';

interface Props {
  state: DemoState;
  dispatch: Dispatch<DemoAction>;
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
        <p id="ro-demo-autobuff-title" className={panelTitle}>
          AutoBuff
        </p>
      </div>
      <div className={`${toolPanelBody} flex-1 overflow-y-auto`}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className={`truncate text-sm font-semibold ${textInk}`}>Sin buffs aplicados</p>
            <p className={textDetail}>{statusLine2}</p>
          </div>
          <DemoToggle
            checked={state.autobuffEnabled && ready}
            disabled={!canToggle}
            labelledBy="ro-demo-autobuff-title"
            onChange={() => dispatch({ type: 'toggleAutobuff' })}
          />
        </div>

        <ul className="space-y-1.5">
          {state.autobuffRules.map(rule => (
            <li key={rule.id} className="flex items-center justify-between gap-3 py-1.5">
              <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={rule.enabled}
                  disabled={!ready}
                  onChange={() => dispatch({ type: 'toggleAutobuffRule', ruleId: rule.id })}
                  className="h-4 w-4 shrink-0"
                />
                <span className="truncate text-[11px] text-[rgb(var(--ro-c-ink))]">
                  {rule.label}
                </span>
              </label>
              <label className="sr-only" htmlFor={`ro-demo-autobuff-key-${rule.id}`}>
                Tecla para {rule.label}
              </label>
              <select
                id={`ro-demo-autobuff-key-${rule.id}`}
                className={`${selectNative} w-16 shrink-0 py-1 text-[11px]`}
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

        <p className={`${textDetail} leading-snug`}>
          Activa cada buff y asigna la tecla donde lo tienes configurado en el juego.
        </p>
      </div>
    </section>
  );
}
