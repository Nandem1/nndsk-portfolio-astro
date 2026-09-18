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
        <h3 className={panelTitle}>{title}</h3>
      </div>
      <div className={panelBody}>{children}</div>
    </section>
  );
}
