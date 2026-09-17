import { useCallback, useEffect, useReducer } from 'react';
import './tokens.css';
import { demoChrome } from './chrome/classes';
import { DemoHeader } from './chrome/DemoHeader';
import { DemoCenter } from './center/DemoCenter';
import { PREPARE_STEPS, demoReducer, getPrefixState, initialDemoState } from './demo.logic';
import { DemoLogs } from './logs/DemoLogs';
import { DemoRail } from './rail/DemoRail';
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
  const bodyClass = isCompact ? 'max-h-[36rem] overflow-y-auto' : 'min-h-[28rem]';

  return (
    <div
      className={`${demoChrome} ${isCompact ? 'min-h-[28rem]' : ''}`}
      role="region"
      aria-label="Demo de RO-Launcher"
    >
      <DemoHeader />
      <div
        className={`grid grid-cols-1 @min-[40rem]:grid-cols-[minmax(220px,300px)_1fr] gap-3 p-3 ${bodyClass}`}
      >
        <DemoRail
          state={state}
          dispatch={dispatch}
          onLaunchClick={onLaunchClick}
          showReset={!isCompact}
        />
        <div className="flex flex-col gap-2.5 min-h-0 min-w-0">
          <DemoCenter state={state} dispatch={dispatch} showTools={!isCompact} />
          {!isCompact && <DemoLogs state={state} dispatch={dispatch} />}
        </div>
      </div>
    </div>
  );
}
