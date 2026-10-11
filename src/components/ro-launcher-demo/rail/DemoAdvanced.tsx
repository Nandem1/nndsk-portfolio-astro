import { DEMO_RUNNERS, getServerById } from '../mockData';
import {
  effectiveRunnerId,
  gepardMismatchMessage,
  getPrefixState,
  runnerDotOk,
} from '../demo.logic';
import { statusDotOk, statusDotPending, statusDotWarn, textDetail } from '../chrome/classes';
import type { DemoState } from '../types';

function StatusDot({ kind }: { kind: 'ok' | 'pending' | 'mismatch' }) {
  const cls = kind === 'ok' ? statusDotOk : kind === 'pending' ? statusDotPending : statusDotWarn;
  return <span className={cls} aria-hidden />;
}

interface Props {
  state: DemoState;
}

export function DemoAdvanced({ state }: Props) {
  const server = getServerById(state.selectedServerId);
  const prefix = getPrefixState(state, server);
  const runnerOk = runnerDotOk(state, server);
  const effectiveName =
    DEMO_RUNNERS.find(r => r.id === effectiveRunnerId(state, server))?.name ?? '';

  const lines = [
    {
      key: 'runner',
      kind: runnerOk ? ('ok' as const) : ('mismatch' as const),
      label: `Runner · ${effectiveName}`,
    },
    {
      key: 'prefix',
      kind: prefix === 'ready' ? ('ok' as const) : ('pending' as const),
      label: prefix === 'ready' ? 'Entorno aislado · listo' : 'Entorno aislado · pendiente',
    },
    {
      key: 'dxvk',
      kind: prefix === 'ready' ? ('ok' as const) : ('pending' as const),
      label: prefix === 'ready' ? 'DXVK · instalado' : 'DXVK · pendiente',
    },
    {
      key: 'gepard',
      kind:
        server.gepard.validated && !gepardMismatchMessage(state, server)
          ? ('ok' as const)
          : ('mismatch' as const),
      label: server.gepard.validated ? 'Gepard · perfil validado' : 'Gepard · sin receta',
    },
  ];

  return (
    <ul className="space-y-1.5">
      {lines.map(line => (
        <li key={line.key} className="flex min-w-0 items-center gap-2">
          <StatusDot kind={line.kind} />
          <p className={`${textDetail} truncate`}>{line.label}</p>
        </li>
      ))}
    </ul>
  );
}
