import { DEMO_RUNNERS, getServerById } from '../mockData';
import {
  effectiveRunnerId,
  gepardMismatchMessage,
  getPrefixState,
  runnerDotOk,
} from '../demo.logic';
import type { DemoState } from '../types';

function StatusDot({ kind }: { kind: 'ok' | 'pending' | 'mismatch' }) {
  const cls =
    kind === 'ok'
      ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]'
      : kind === 'pending'
        ? 'bg-zinc-600'
        : 'bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.5)]';
  return <span className={`inline-block w-2 h-2 rounded-full shrink-0 ${cls}`} aria-hidden />;
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
          <p className="text-[11px] text-zinc-500 truncate">{line.label}</p>
        </li>
      ))}
    </ul>
  );
}
