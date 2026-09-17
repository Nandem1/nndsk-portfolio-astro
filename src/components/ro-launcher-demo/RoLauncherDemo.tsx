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
  className?: string;
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

export default function RoLauncherDemo({ variant, className = '' }: RoLauncherDemoProps) {
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

  const rootChrome = isCompact
    ? `${demoChrome} h-full flex flex-col min-h-0 overflow-hidden rounded-lg border-0 ro-shadow-glass`
    : `${demoChrome} h-full flex flex-col min-h-0 overflow-hidden`;

  const bodyGrid = isCompact
    ? 'grid flex-1 min-h-0 grid-cols-1 md:grid-cols-[280px_minmax(0,1fr)] gap-2 md:gap-3 px-2 md:px-3 pb-2 md:pb-3 pt-0 overflow-hidden max-w-full'
    : 'grid flex-1 min-h-0 grid-cols-1 md:grid-cols-[minmax(280px,320px)_minmax(0,1fr)] gap-3 p-3 pt-0 overflow-hidden max-w-full';

  return (
    <div
      className={`${rootChrome} ${className}`.trim()}
      role="region"
      aria-label="Demo de RO-Launcher"
    >
      <DemoHeader />
      <div className={bodyGrid}>
        <div className="min-h-0 min-w-0 overflow-y-auto overflow-x-hidden md:overflow-y-auto">
          <DemoRail
            state={state}
            dispatch={dispatch}
            onLaunchClick={onLaunchClick}
            showReset={!isCompact}
            compact={isCompact}
          />
        </div>
        <div className="flex flex-col gap-2 min-h-0 min-w-0 overflow-hidden">
          <DemoCenter
            state={state}
            dispatch={dispatch}
            showTools={!isCompact}
            compact={isCompact}
          />
          {!isCompact && <DemoLogs state={state} dispatch={dispatch} />}
        </div>
      </div>
    </div>
  );
}
