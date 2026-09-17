import { useEffect, useReducer, useCallback } from 'react';
import { DemoHeader, DemoPanel } from './DemoHeader';
import { DemoServerList } from './DemoServerList';
import { DemoRunnerPanel } from './DemoRunnerPanel';
import { DemoAdvanced } from './DemoAdvanced';
import { DemoLaunchBar } from './DemoLaunchBar';
import { DemoToolsPanel } from './DemoToolsPanel';
import { DemoToolTabs } from './DemoToolTabs';
import { DemoAutopot } from './DemoAutopot';
import { DemoSpammer } from './DemoSpammer';
import { DemoAutobuff } from './DemoAutobuff';
import { DemoLogs } from './DemoLogs';
import { DemoResetButton } from './DemoResetButton';
import { demoChrome } from './classes';
import { PREPARE_STEPS, demoReducer, getPrefixState, initialDemoState } from './demo.logic';
import { getServerById } from './mockData';
import type { DemoAction } from './types';

export interface RoLauncherDemoProps {
  variant: 'compact' | 'full';
}

function usePrepareTimer(state: typeof initialDemoState, dispatch: React.Dispatch<DemoAction>) {
  const server = getServerById(state.selectedServerId);
  const prefix = getPrefixState(state, server);

  useEffect(() => {
    if (prefix !== 'preparing') {
      return;
    }

    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    if (state.prepareStepIndex >= PREPARE_STEPS.length - 1) {
      const doneTimer = window.setTimeout(() => {
        dispatch({ type: 'prepareDone' });
      }, 350);
      return () => window.clearTimeout(doneTimer);
    }

    const tickTimer = window.setTimeout(() => {
      dispatch({ type: 'prepareTick' });
    }, 350);
    return () => window.clearTimeout(tickTimer);
  }, [prefix, state.prepareStepIndex, state.selectedServerId, dispatch, server.id]);
}

function DemoRail({
  state,
  dispatch,
  onLaunchClick,
  showReset,
}: {
  state: typeof initialDemoState;
  dispatch: React.Dispatch<DemoAction>;
  onLaunchClick: () => void;
  showReset: boolean;
}) {
  return (
    <div className="flex flex-col gap-2.5 min-h-0">
      <DemoPanel title="Servidor">
        <DemoServerList state={state} dispatch={dispatch} />
      </DemoPanel>
      <DemoPanel title="Runner predeterminado">
        <DemoRunnerPanel state={state} dispatch={dispatch} />
      </DemoPanel>
      <DemoPanel title="Avanzado">
        <DemoAdvanced state={state} />
      </DemoPanel>
      {showReset && <DemoResetButton />}
      <DemoLaunchBar state={state} onLaunchClick={onLaunchClick} />
    </div>
  );
}

export default function RoLauncherDemo({ variant }: RoLauncherDemoProps) {
  const [state, dispatch] = useReducer(demoReducer, initialDemoState);
  usePrepareTimer(state, dispatch);

  const onLaunchClick = useCallback(() => {
    const server = getServerById(state.selectedServerId);
    const prefix = getPrefixState(state, server);
    if (prefix === 'ready') {
      dispatch({ type: 'play' });
      return;
    }
    if (prefix === 'pending') {
      if (
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        dispatch({ type: 'prepareInstant' });
      } else {
        dispatch({ type: 'prepareStart' });
      }
    }
  }, [state]);

  const isCompact = variant === 'compact';

  return (
    <div
      className={`${demoChrome} ${isCompact ? 'min-h-[22rem]' : ''}`}
      role="region"
      aria-label="Demo de RO-Launcher"
    >
      <DemoHeader />
      {isCompact ? (
        <div className="p-3">
          <DemoRail
            state={state}
            dispatch={dispatch}
            onLaunchClick={onLaunchClick}
            showReset={false}
          />
        </div>
      ) : (
        <div className="grid md:grid-cols-[minmax(240px,280px)_1fr] gap-3 p-3 min-h-[28rem]">
          <DemoRail state={state} dispatch={dispatch} onLaunchClick={onLaunchClick} showReset />
          <div className="flex flex-col gap-2.5 min-h-0 min-w-0">
            <DemoToolsPanel state={state} />
            <DemoToolTabs state={state} dispatch={dispatch} />
            <div className="flex-1 min-h-0">
              {state.toolView === 'combat' ? (
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 h-full min-h-[12rem]"
                  id="ro-demo-panel-combat"
                  role="tabpanel"
                  aria-labelledby="ro-demo-tab-combat"
                >
                  <DemoAutopot serverId={state.selectedServerId} />
                  <DemoSpammer state={state} dispatch={dispatch} />
                </div>
              ) : (
                <DemoAutobuff />
              )}
            </div>
            <DemoLogs state={state} dispatch={dispatch} />
          </div>
        </div>
      )}
    </div>
  );
}
