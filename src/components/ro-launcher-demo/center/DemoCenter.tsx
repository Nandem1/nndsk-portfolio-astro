import { DemoAutobuff } from './DemoAutobuff';
import { DemoAutopot } from './DemoAutopot';
import { DemoSpammer } from './DemoSpammer';
import { DemoToolTabs } from './DemoToolTabs';
import { DemoToolsPanel } from './DemoToolsPanel';
import type { DemoAction, DemoState } from '../types';

interface Props {
  state: DemoState;
  dispatch: React.Dispatch<DemoAction>;
  showTools: boolean;
  compact?: boolean;
}

export function DemoCenter({ state, dispatch, showTools, compact = false }: Props) {
  const combatGrid = compact
    ? 'grid grid-cols-2 gap-2 h-full min-h-0 min-w-0'
    : 'grid grid-cols-1 md:grid-cols-2 gap-2.5 h-full min-h-[9rem] min-w-0';

  return (
    <div className="flex flex-col gap-2 min-h-0 min-w-0 flex-1 overflow-hidden">
      {showTools && <DemoToolsPanel state={state} />}
      <DemoToolTabs state={state} dispatch={dispatch} />
      <div className="flex-1 min-h-0 min-w-0 overflow-hidden">
        {state.toolView === 'combat' ? (
          <div
            className={combatGrid}
            id="ro-demo-panel-combat"
            role="tabpanel"
            aria-labelledby="ro-demo-tab-combat"
          >
            <DemoAutopot state={state} dispatch={dispatch} compact={compact} />
            <DemoSpammer state={state} dispatch={dispatch} compact={compact} />
          </div>
        ) : (
          <DemoAutobuff state={state} dispatch={dispatch} compact={compact} />
        )}
      </div>
    </div>
  );
}
