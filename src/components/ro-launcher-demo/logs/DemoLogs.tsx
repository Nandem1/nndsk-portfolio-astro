import { useEffect, useRef } from 'react';
import { btnXs, panelBody, panelHeader, panelShell, panelTitle } from '../chrome/classes';
import type { DemoAction, DemoState, LogChannel } from '../types';

interface Props {
  state: DemoState;
  dispatch: React.Dispatch<DemoAction>;
}

function LogTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40 ${
        active
          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/25'
          : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
      }`}
    >
      {children}
    </button>
  );
}

export function DemoLogs({ state, dispatch }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const logs = state.logChannel === 'game' ? state.gameLogs : state.toolLogs;
  const emptyLabel =
    state.logChannel === 'game' ? 'Wine / setup / lanzamiento...' : 'AutoPot / PID / memoria...';

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [logs, state.logChannel]);

  const setChannel = (channel: LogChannel) => {
    dispatch({ type: 'setLogChannel', channel });
  };

  return (
    <section className={`${panelShell} shrink-0 flex flex-col min-h-[11rem] max-h-44`}>
      <div className={`${panelHeader} flex-wrap gap-y-1`}>
        <div className="flex items-center gap-2 min-w-0">
          <h3 className={panelTitle}>Logs</h3>
          <div className="flex gap-1">
            <LogTab active={state.logChannel === 'game'} onClick={() => setChannel('game')}>
              Juego
            </LogTab>
            <LogTab active={state.logChannel === 'tools'} onClick={() => setChannel('tools')}>
              Tools
            </LogTab>
          </div>
        </div>
        {logs.length > 0 && (
          <button
            type="button"
            className={`${btnXs} uppercase tracking-wider`}
            onClick={() => dispatch({ type: 'clearLogs' })}
          >
            Limpiar
          </button>
        )}
      </div>
      <div
        className={`${panelBody} flex-1 min-h-0 bg-zinc-950/50 rounded-lg border border-white/[0.04] overflow-y-auto font-mono text-[11px] leading-relaxed mx-3 mb-2`}
      >
        {logs.length === 0 ? (
          <p className="text-zinc-600 select-none">{emptyLabel}</p>
        ) : (
          logs.map((line, index) => (
            <div key={`${index}-${line}`} className="break-all text-zinc-500">
              {line}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </section>
  );
}
