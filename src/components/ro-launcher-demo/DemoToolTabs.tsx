import { tab, tabActive, focusRing } from './classes';
import type { DemoAction, DemoState, ToolView } from './types';

const TABS: { view: ToolView; label: string }[] = [
  { view: 'combat', label: 'Combate' },
  { view: 'buffs', label: 'Buffs' },
];

interface Props {
  state: DemoState;
  dispatch: React.Dispatch<DemoAction>;
}

export function DemoToolTabs({ state, dispatch }: Props) {
  return (
    <div
      className="shrink-0 flex gap-1 rounded-md border border-border bg-background p-1"
      role="tablist"
      aria-label="Vista de herramientas"
    >
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
            className={`${tab} ${active ? tabActive : ''} ${focusRing}`}
            onClick={() => dispatch({ type: 'setToolView', view })}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
