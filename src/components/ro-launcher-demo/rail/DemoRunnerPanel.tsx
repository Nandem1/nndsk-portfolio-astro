import type { Dispatch } from 'react';
import { DEMO_RUNNERS, getServerById } from '../mockData';
import { effectiveRunnerId, gepardMismatchMessage } from '../demo.logic';
import { gepardBanner, selectNative } from '../chrome/classes';
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
        className={selectNative}
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
        <p className="text-[10px] leading-relaxed text-amber-300/90">
          {mismatch}
          {server.gepard.mismatchRemediation ? ` ${server.gepard.mismatchRemediation}` : ''}
        </p>
      )}
      <div className={`${gepardBanner} text-zinc-500`}>
        <p className="text-[10px] leading-relaxed">
          Runner efectivo de {server.name}: {effectiveName}
        </p>
        <p className="mt-0.5 text-[9px] leading-relaxed text-zinc-600">
          Propio del servidor; el predeterminado global no lo reemplaza.
        </p>
      </div>
    </div>
  );
}
