import {
  btnXs,
  panelBody,
  panelHeader,
  panelShell,
  panelTitle,
  statusDotOk,
  statusDotPending,
  textDetail,
  textInk,
} from '../chrome/classes';
import { getServerById } from '../mockData';
import type { DemoState } from '../types';

interface Props {
  state: DemoState;
}

function StatusDot({ ok }: { ok: boolean }) {
  return <span className={ok ? statusDotOk : statusDotPending} aria-hidden />;
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
    <div className="flex min-w-0 flex-col gap-1.5 rounded-[9px] bg-[rgb(var(--ro-c-field))] px-2.5 py-2">
      <div className="flex min-w-0 items-center gap-1.5">
        <StatusDot ok={dotOk} />
        <span className={`shrink-0 text-[11px] font-medium ${textInk}`}>{label}</span>
        <span
          className={`min-w-0 flex-1 truncate font-mono text-[11px] text-[rgb(var(--ro-c-muted))]`}
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
        <p className={panelTitle}>Herramientas</p>
      </div>
      <div className={`${panelBody} max-h-28 overflow-x-auto overflow-y-auto`}>
        <div className="grid min-w-[28rem] grid-cols-3 gap-2">
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
    <div className="mt-2 space-y-1 rounded-[9px] bg-[rgb(var(--ro-c-field))] px-2.5 py-2">
      <p className={textDetail}>
        Cliente {server.diagnostics.architecture}
        {apis ? ` · ${apis}` : ''}
      </p>
      {server.diagnostics.warnings.map(warning => (
        <p key={warning} className="ro-notice-warn text-[11px] leading-snug">
          {warning}
        </p>
      ))}
    </div>
  );
}
