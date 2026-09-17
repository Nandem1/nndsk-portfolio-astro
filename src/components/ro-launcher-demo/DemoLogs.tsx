import { btnSecondary } from './classes';
import type { DemoAction, DemoState } from './types';

interface Props {
  state: DemoState;
  dispatch: React.Dispatch<DemoAction>;
}

export function DemoLogs({ state, dispatch }: Props) {
  const { logs } = state;

  return (
    <section className="rounded-md border border-border bg-background flex flex-col flex-1 min-h-[11rem]">
      <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2 shrink-0">
        <h3 className="text-[10px] font-semibold text-muted uppercase tracking-wide">Logs</h3>
        {logs.length > 0 && (
          <button
            type="button"
            className={`${btnSecondary} uppercase tracking-wider`}
            onClick={() => dispatch({ type: 'clearLogs' })}
          >
            Limpiar
          </button>
        )}
      </div>
      <div className="flex-1 min-h-0 bg-background border-t border-border overflow-y-auto font-mono text-[11px] leading-relaxed px-3 py-2">
        {logs.length === 0 ? (
          <p className="text-muted select-none">Wine / setup / lanzamiento...</p>
        ) : (
          logs.map((line, index) => (
            <div key={`${index}-${line}`} className="break-all text-muted">
              {line}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
