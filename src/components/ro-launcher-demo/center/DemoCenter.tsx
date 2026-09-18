import type { Dispatch } from 'react';
import { DemoAutobuff } from './DemoAutobuff';
import { DemoAutopot } from './DemoAutopot';
import { DemoSpammer } from './DemoSpammer';
import { DemoToolTabs } from './DemoToolTabs';
import { DemoToolsPanel } from './DemoToolsPanel';
import type { DemoAction, DemoState } from '../types';

interface Props {
  state: DemoState;
  dispatch: Dispatch<DemoAction>;
  showTools: boolean;
}

export function DemoCenter({ state, dispatch, showTools }: Props) {
  return (
    <div className="flex flex-col gap-2.5 min-h-0 min-w-0">
      {showTools && <DemoToolsPanel state={state} />}
      <DemoToolTabs state={state} dispatch={dispatch} />
      <div className="flex-1 min-h-0">
        {state.toolView === 'combat' ? (
          <div
            className="grid grid-cols-1 @min-[28rem]:grid-cols-2 gap-2.5 h-full min-h-[16rem]"
            id="ro-demo-panel-combat"
            role="tabpanel"
            aria-labelledby="ro-demo-tab-combat"
          >
            <DemoAutopot state={state} dispatch={dispatch} />
            <DemoSpammer state={state} dispatch={dispatch} />
          </div>
        ) : (
          <DemoAutobuff state={state} dispatch={dispatch} />
        )}
      </div>
    </div>
  );
}
