import type { ReactNode } from 'react';
import { panelHeader, panelTitle } from './classes';

export function DemoHeader() {
  return (
    <header className="flex items-end justify-between gap-3 px-3 py-2 border-b border-border bg-card shrink-0">
      <div>
        <h2 className="text-base font-semibold text-foreground tracking-tight">RO-Launcher</h2>
        <p className="text-[11px] text-muted mt-0.5">Ragnarok Online · Linux</p>
      </div>
      <p className="text-[11px] text-muted shrink-0">Demo</p>
    </header>
  );
}

interface DemoPanelProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function DemoPanel({ title, children, className = '' }: DemoPanelProps) {
  return (
    <section
      className={`rounded-md border border-border bg-background flex flex-col shrink-0 ${className}`}
    >
      <div className={panelHeader}>
        <h3 className={panelTitle}>{title}</h3>
      </div>
      <div className="px-3 py-2 flex flex-col gap-2 min-h-0">{children}</div>
    </section>
  );
}
