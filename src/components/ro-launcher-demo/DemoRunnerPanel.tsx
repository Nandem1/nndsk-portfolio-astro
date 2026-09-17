import { DEMO_RUNNERS } from './mockData';
import { effectiveRunnerId, gepardMismatchMessage } from './demo.logic';
import { getServerById } from './mockData';
import { selectNative } from './classes';
import type { DemoAction, DemoState } from './types';

interface Props {
  state: DemoState;
  dispatch: React.Dispatch<DemoAction>;
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
      <p className="text-[10px] leading-relaxed text-muted">{server.gepard.banner}</p>
      {mismatch && (
        <p className="text-[10px] leading-relaxed text-muted">
          {mismatch}
          {server.gepard.mismatchRemediation ? ` ${server.gepard.mismatchRemediation}` : ''}
        </p>
      )}
      <div className="rounded-md border border-border bg-card px-2.5 py-2">
        <p className="text-[10px] leading-relaxed text-muted">
          Runner efectivo de {server.name}: {effectiveName}
        </p>
        <p className="mt-0.5 text-[9px] leading-relaxed text-muted">
          Propio del servidor; el predeterminado global no lo reemplaza.
        </p>
      </div>
    </div>
  );
}
