import { btnXs } from '../chrome/classes';
import { getServerById } from '../mockData';
import { panelBody, panelHeader, panelShell, panelTitle } from '../chrome/classes';
import type { DemoState } from '../types';

interface Props {
  state: DemoState;
}

function StatusDot({ ok }: { ok: boolean }) {
  const cls = ok ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]' : 'bg-zinc-600';
  return <span className={`inline-block w-2 h-2 rounded-full shrink-0 ${cls}`} aria-hidden />;
}

function ToolCard({
  label,
  detail,
  actionLabel,
  dotOk,
}: {
  label: string;
  detail: string;
  actionLabel: string;
  dotOk: boolean;
}) {
  return (
    <div className="rounded-lg border border-white/[0.04] bg-zinc-950/40 px-2.5 py-2 flex flex-col gap-1.5 min-w-0">
      <div className="flex items-center gap-1.5 min-w-0">
        <StatusDot ok={dotOk} />
        <span className="text-[11px] text-zinc-300 font-medium shrink-0">{label}</span>
        <span
          className="text-[10px] text-zinc-600 truncate font-mono min-w-0 flex-1"
          title={detail}
        >
          {detail}
        </span>
      </div>
      <button type="button" disabled title="No disponible en demo" className={btnXs}>
        {actionLabel}
      </button>
    </div>
  );
}

export function DemoToolsPanel({ state }: Props) {
  const server = getServerById(state.selectedServerId);
  const dg = server.tools.dgvoodoo;

  return (
    <section className={`${panelShell} shrink-0`}>
      <div className={panelHeader}>
        <h3 className={panelTitle}>Herramientas</h3>
      </div>
      <div className={`${panelBody} max-h-40 overflow-x-auto overflow-y-auto`}>
        <div className="grid grid-cols-3 gap-2 min-w-[28rem]">
          <ToolCard
            label="OpenSetup"
            detail={server.tools.openSetup.label}
            actionLabel="Abrir"
            dotOk={server.tools.openSetup.found}
          />
          <ToolCard
            label="Patcher"
            detail={server.tools.patcher.label}
            actionLabel="Abrir"
            dotOk={server.tools.patcher.found}
          />
          <ToolCard
            label="dgVoodoo"
            detail={dg.detail}
            actionLabel={dg.configured ? 'Config' : 'Instalar'}
            dotOk={dg.configured}
          />
        </div>
        <Diagnostics server={server} />
      </div>
    </section>
  );
}

function Diagnostics({ server }: { server: ReturnType<typeof getServerById> }) {
  const apis = server.diagnostics.graphicsApis.join(' + ');
  return (
    <div className="mt-2 rounded-lg border border-white/[0.04] bg-zinc-950/30 px-2.5 py-2 space-y-1">
      <p className="text-[10px] text-zinc-500">
        Cliente {server.diagnostics.architecture}
        {apis ? ` · ${apis}` : ''}
      </p>
      {server.diagnostics.warnings.map(warning => (
        <p key={warning} className="text-[10px] leading-snug text-amber-400/80">
          {warning}
        </p>
      ))}
    </div>
  );
}
