import type { Dispatch } from 'react';
import { tabActive, tabBtn, tabInactive, tabList } from '../chrome/classes';
import type { DemoAction, DemoState, ToolView } from '../types';

const TABS: { view: ToolView; label: string }[] = [
  { view: 'combat', label: 'Combate' },
  { view: 'buffs', label: 'Buffs' },
];

interface Props {
  state: DemoState;
  dispatch: Dispatch<DemoAction>;
}

export function DemoToolTabs({ state, dispatch }: Props) {
  return (
    <div className={tabList} role="tablist" aria-label="Vista de herramientas">
      {TABS.map(({ view, label }) => {
        const active = state.toolView === view;
        return (
          <button
            key={view}
            type="button"
            role="tab"
            aria-selected={active}
            aria-controls={`ro-demo-panel-${view}`}
            id={`ro-demo-tab-${view}`}
            className={`${tabBtn} ${active ? tabActive : tabInactive}`}
            onClick={() => dispatch({ type: 'setToolView', view })}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
