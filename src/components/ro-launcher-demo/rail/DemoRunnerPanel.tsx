import type { Dispatch } from 'react';
import { DEMO_RUNNERS, getServerById } from '../mockData';
import { effectiveRunnerId, gepardMismatchMessage } from '../demo.logic';
import { gepardBanner, selectNative, textDetail, textMuted } from '../chrome/classes';
import type { DemoAction, DemoState } from '../types';

interface Props {
  state: DemoState;
  dispatch: Dispatch<DemoAction>;
}

export function DemoRunnerPanel({ state, dispatch }: Props) {
  const server = getServerById(state.selectedServerId);
  const effectiveId = effectiveRunnerId(state, server);
  const effectiveName = DEMO_RUNNERS.find(r => r.id === effectiveId)?.name ?? effectiveId;
  const mismatch = gepardMismatchMessage(state, server);

  return (
    <div className="space-y-2">
      <select
        className={`${selectNative} pr-8`}
        value={effectiveId}
        aria-label="Runner predeterminado"
        onChange={e =>
          dispatch({ type: 'setRunner', runnerId: e.target.value as typeof effectiveId })
        }
      >
        {DEMO_RUNNERS.map(runner => (
          <option key={runner.id} value={runner.id}>
            {runner.name}
          </option>
        ))}
      </select>
      <p className={gepardBanner}>{server.gepard.banner}</p>
      {mismatch && (
        <p className={`${textDetail} leading-relaxed text-[rgb(var(--ro-c-warn))]`}>
          {mismatch}
          {server.gepard.mismatchRemediation ? ` ${server.gepard.mismatchRemediation}` : ''}
        </p>
      )}
      <div className={gepardBanner}>
        <p className={`${textDetail} leading-relaxed ${textMuted}`}>
          Runner efectivo de {server.name}: {effectiveName}
        </p>
        <p className="mt-0.5 text-[11px] leading-relaxed text-[rgb(var(--ro-c-muted))]">
          Propio del servidor; el predeterminado global no lo reemplaza.
        </p>
      </div>
    </div>
  );
}
