import { IconSparkles, IconSwords } from '../chrome/DemoIcons';
import { focusRing, tabActive, tabBtn, tabInactive } from '../chrome/classes';
import type { DemoAction, DemoState, ToolView } from '../types';

const TABS: { view: ToolView; label: string; Icon: typeof IconSwords }[] = [
  { view: 'combat', label: 'Combate', Icon: IconSwords },
  { view: 'buffs', label: 'Buffs', Icon: IconSparkles },
];

interface Props {
  state: DemoState;
  dispatch: React.Dispatch<DemoAction>;
}

export function DemoToolTabs({ state, dispatch }: Props) {
  return (
    <div
      className="shrink-0 flex gap-1 rounded-lg border border-zinc-800/60 bg-zinc-950/40 p-1"
      role="tablist"
      aria-label="Vista de herramientas"
    >
      {TABS.map(({ view, label, Icon }) => {
        const active = state.toolView === view;
        return (
          <button
            key={view}
            type="button"
            role="tab"
            aria-selected={active}
            aria-controls={`ro-demo-panel-${view}`}
            id={`ro-demo-tab-${view}`}
            className={`${tabBtn} ${focusRing} ${active ? tabActive : tabInactive}`}
            onClick={() => dispatch({ type: 'setToolView', view })}
          >
            <Icon />
            {label}
          </button>
        );
      })}
    </div>
  );
}
