import { focusRing, row, rowSelected } from '../chrome/classes';
import { DEMO_SERVERS } from '../mockData';
import type { DemoAction, DemoState } from '../types';

interface Props {
  state: DemoState;
  dispatch: React.Dispatch<DemoAction>;
}

export function DemoServerList({ state, dispatch }: Props) {
  return (
    <ul className="flex flex-col gap-0.5 max-h-40 overflow-y-auto -mx-1" aria-label="Servidores">
      {DEMO_SERVERS.map(server => {
        const selected = state.selectedServerId === server.id;
        return (
          <li key={server.id}>
            <label className={`${row} cursor-pointer ${selected ? rowSelected : ''} ${focusRing}`}>
              <input
                type="radio"
                name="ro-demo-server"
                value={server.id}
                checked={selected}
                onChange={() => dispatch({ type: 'selectServer', serverId: server.id })}
                className="w-3.5 h-3.5 shrink-0 accent-amber-500"
              />
              <span
                className={`text-sm truncate ${selected ? 'text-amber-100 font-medium' : 'text-zinc-200'}`}
              >
                {server.name}
              </span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}
