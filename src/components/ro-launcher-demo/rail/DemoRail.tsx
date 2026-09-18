import type { Dispatch } from 'react';
import { DemoPanel } from '../chrome/DemoPanel';
import { DemoAdvanced } from './DemoAdvanced';
import { DemoLaunchBar } from './DemoLaunchBar';
import { DemoResetButton } from './DemoResetButton';
import { DemoRunnerPanel } from './DemoRunnerPanel';
import { DemoServerList } from './DemoServerList';
import type { DemoAction, DemoState } from '../types';

interface Props {
  state: DemoState;
  dispatch: Dispatch<DemoAction>;
  onLaunchClick: () => void;
  showReset: boolean;
}

export function DemoRail({ state, dispatch, onLaunchClick, showReset }: Props) {
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
      {showReset && <DemoResetButton state={state} dispatch={dispatch} />}
      <DemoLaunchBar state={state} onLaunchClick={onLaunchClick} />
    </div>
  );
}
