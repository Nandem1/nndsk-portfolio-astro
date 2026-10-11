import type { Dispatch } from 'react';
import { focusRing, row, rowSelected, textInk } from '../chrome/classes';
import { DEMO_SERVERS } from '../mockData';
import type { DemoAction, DemoState } from '../types';

interface Props {
  state: DemoState;
  dispatch: Dispatch<DemoAction>;
}

export function DemoServerList({ state, dispatch }: Props) {
  return (
    <ul className="flex max-h-40 flex-col gap-1 overflow-y-auto -mx-1" aria-label="Servidores">
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
                className="h-4 w-4 shrink-0"
              />
              <span
                className={`min-w-0 flex-1 break-words text-sm leading-4 ${textInk} ${
                  selected ? 'font-medium' : ''
                }`}
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
