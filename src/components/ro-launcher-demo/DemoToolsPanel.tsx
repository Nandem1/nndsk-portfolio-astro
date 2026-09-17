import { btnSecondary } from './classes';
import { getServerById } from './mockData';
import type { DemoServer, DemoState } from './types';

interface Props {
  state: DemoState;
}

function ToolCard({
  label,
  detail,
  actionLabel,
}: {
  label: string;
  detail: string;
  actionLabel: string;
}) {
  return (
    <div className="rounded-md border border-border bg-background px-2.5 py-2 flex flex-col gap-1.5 min-w-0">
      <div className="flex items-center gap-1.5 min-w-0">
        <span className="inline-block w-2 h-2 rounded-sm shrink-0 bg-foreground" aria-hidden />
        <span className="text-[11px] text-foreground font-medium shrink-0">{label}</span>
        <span className="text-[10px] text-muted truncate font-mono" title={detail}>
          {detail}
        </span>
      </div>
      <button type="button" disabled title="No disponible en demo" className={btnSecondary}>
        {actionLabel}
      </button>
    </div>
  );
}

export function DemoToolsPanel({ state }: Props) {
  const server = getServerById(state.selectedServerId);
  const dg = server.tools.dgvoodoo;

  return (
    <section className="rounded-md border border-border bg-background shrink-0">
      <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
        <h3 className="text-[10px] font-semibold text-muted uppercase tracking-wide">
          Herramientas
        </h3>
      </div>
      <div className="px-3 py-2 space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <ToolCard label="OpenSetup" detail={server.tools.openSetup.label} actionLabel="Abrir" />
          <ToolCard label="Patcher" detail={server.tools.patcher.label} actionLabel="Abrir" />
          <ToolCard
            label="dgVoodoo"
            detail={dg.detail}
            actionLabel={dg.configured ? 'Config' : 'Instalar'}
          />
        </div>
        <Diagnostics server={server} />
      </div>
    </section>
  );
}

function Diagnostics({ server }: { server: DemoServer }) {
  const apis = server.diagnostics.graphicsApis.join(' + ');
  return (
    <div className="rounded-md border border-border bg-card px-2.5 py-2 space-y-1">
      <p className="text-[10px] text-muted">
        Cliente {server.diagnostics.architecture}
        {apis ? ` · ${apis}` : ''}
      </p>
      {server.diagnostics.warnings.map(warning => (
        <p key={warning} className="text-[10px] leading-snug text-muted">
          {warning}
        </p>
      ))}
    </div>
  );
}
