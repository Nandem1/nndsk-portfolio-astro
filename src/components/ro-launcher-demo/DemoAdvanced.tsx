import { DEMO_RUNNERS } from './mockData';
import { getServerById } from './mockData';
import {
  effectiveRunnerId,
  getPrefixState,
  gepardMismatchMessage,
  runnerDotOk,
} from './demo.logic';
import type { DemoState } from './types';

function StatusDot({ kind }: { kind: 'ok' | 'pending' | 'mismatch' }) {
  const cls =
    kind === 'ok' ? 'bg-foreground' : kind === 'pending' ? 'bg-muted' : 'bg-border-strong';
  return <span className={`inline-block w-2 h-2 rounded-sm shrink-0 ${cls}`} aria-hidden />;
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
        <li key={line.key} className="flex items-center gap-2 min-w-0">
          <StatusDot kind={line.kind} />
          <p className="text-[11px] text-muted truncate">{line.label}</p>
        </li>
      ))}
    </ul>
  );
}
