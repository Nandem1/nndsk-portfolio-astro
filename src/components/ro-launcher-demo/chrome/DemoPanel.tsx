import type { ReactNode } from 'react';
import { panelBody, panelHeader, panelShell, panelTitle } from './classes';

interface DemoPanelProps {
  title: string;
  children: ReactNode;
  className?: string;
  toneClass?: string;
}

export function DemoPanel({ title, children, className = '', toneClass = '' }: DemoPanelProps) {
  return (
    <section className={`${panelShell} shrink-0 ${toneClass} ${className}`}>
      <div className={panelHeader}>
        <p className={panelTitle}>{title}</p>
      </div>
      <div className={panelBody}>{children}</div>
    </section>
  );
}
