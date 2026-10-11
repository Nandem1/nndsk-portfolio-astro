import { useLayoutEffect, useRef, type Dispatch } from 'react';
import {
  logWell,
  panelHeader,
  panelShell,
  panelTitle,
  tabActive,
  tabInactive,
  tabList,
  textLink,
} from '../chrome/classes';
import type { DemoAction, DemoState, LogChannel } from '../types';

interface Props {
  state: DemoState;
  dispatch: Dispatch<DemoAction>;
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
      className={`inline-flex h-5 items-center justify-center rounded-[7px] px-2 text-xs font-medium leading-normal transition-colors duration-120 ${
        active ? tabActive : tabInactive
      }`}
    >
      {children}
    </button>
  );
}

export function DemoLogs({ state, dispatch }: Props) {
  const scrollRootRef = useRef<HTMLDivElement>(null);
  const logs = state.logChannel === 'game' ? state.gameLogs : state.toolLogs;
  const emptyLabel =
    state.logChannel === 'game' ? 'Wine / setup / lanzamiento...' : 'AutoPot / PID / memoria...';

  useLayoutEffect(() => {
    const root = scrollRootRef.current;
    if (!root) return;
    root.scrollTop = root.scrollHeight;
  }, [logs, state.logChannel]);

  const setChannel = (channel: LogChannel) => {
    dispatch({ type: 'setLogChannel', channel });
  };

  return (
    <section className={`${panelShell} flex max-h-32 min-h-[7rem] shrink-0 flex-col`}>
      <div className={`${panelHeader} flex-wrap gap-y-1`}>
        <div className="flex min-w-0 items-center gap-2">
          <p className={panelTitle}>Logs</p>
          <div className={`${tabList} h-7`}>
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
            className={textLink}
            onClick={() => dispatch({ type: 'clearLogs' })}
          >
            Limpiar
          </button>
        )}
      </div>
      <div ref={scrollRootRef} className={logWell}>
        {logs.length === 0 ? (
          <p className="select-none text-[rgb(var(--ro-c-muted))]">{emptyLabel}</p>
        ) : (
          logs.map((line, index) => (
            <div key={`${index}-${line}`} className="break-all">
              {line}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
