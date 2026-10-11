import type { CSSProperties } from 'react';

export const demoChrome =
  'ro-demo @container overflow-hidden rounded-[14px] border border-[rgb(var(--ro-c-line-soft))] bg-[rgb(var(--ro-c-surface))]';

export const panelShell =
  'flex min-h-0 flex-col rounded-[14px] border border-[rgb(var(--ro-c-line-soft))] bg-[rgb(var(--ro-c-panel))] transition-colors duration-120';

export const panelIdle = 'panel-idle';

export const panelSuccess = '';

export const panelWarning = '';

export const panelHeader = 'flex shrink-0 items-center justify-between gap-2 px-[18px] pb-2 pt-4';

export const panelTitle =
  'ro-panel-title ro-ink shrink-0 font-sans text-[15px] font-semibold leading-5 tracking-normal';

export const panelBody = 'flex min-h-0 flex-col gap-2 px-[18px] pb-4 pt-2';

export const toolPanelBody = 'flex min-h-0 flex-col gap-2.5 px-[18px] pb-4 pt-2';

export const row =
  'flex min-h-10 items-center gap-2.5 rounded-[9px] px-3 transition-colors duration-120 hover:bg-[rgb(var(--ro-c-panel-raised))]';

export const rowSelected = 'bg-[rgb(var(--ro-c-panel-raised))]';

export const btnBase =
  'inline-flex w-full items-center justify-center gap-1.5 font-medium select-none transition-colors duration-120 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[rgb(var(--ro-c-accent))] disabled:pointer-events-none';

export const btnPrimary =
  'rounded-[11px] bg-[rgb(var(--ro-c-accent))] p-[13px] text-sm font-semibold leading-normal text-[rgb(var(--ro-c-on-accent))] hover:bg-[color-mix(in_srgb,rgb(var(--ro-c-accent))_90%,rgb(var(--ro-c-ink)))]';

export const btnSecondary =
  'rounded-[9px] bg-[rgb(var(--ro-c-panel-raised))] px-3.5 py-2 text-[13px] leading-normal text-[rgb(var(--ro-c-ink))] hover:bg-[rgb(var(--ro-c-line))]';

export const btnPrimaryDisabled =
  'pointer-events-none rounded-[11px] bg-[rgb(var(--ro-c-panel-raised))] p-[13px] text-sm font-semibold leading-normal text-[rgb(var(--ro-c-muted))]';

export const btnSecondaryDisabled =
  'pointer-events-none rounded-[9px] bg-[rgb(var(--ro-c-panel-raised))] px-3.5 py-2 text-[13px] leading-normal text-[rgb(var(--ro-c-muted))]';

export const btnXs =
  'inline-flex items-center justify-center rounded-[9px] bg-[rgb(var(--ro-c-panel-raised))] px-3 py-[5px] text-xs leading-normal text-[rgb(var(--ro-c-ink))] transition-colors duration-120 hover:bg-[rgb(var(--ro-c-line))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[rgb(var(--ro-c-accent))] disabled:pointer-events-none disabled:text-[rgb(var(--ro-c-muted))]';

export const selectFace =
  'rounded-[9px] border border-[rgb(var(--ro-c-line))] bg-[rgb(var(--ro-c-field))] font-mono text-[12.5px] leading-[normal] text-[rgb(var(--ro-c-ink))] transition-colors duration-120 hover:border-[rgb(var(--ro-c-line-strong))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[rgb(var(--ro-c-accent))]';

export const selectNative = `${selectFace} w-full pl-3 pr-9 py-2`;

export const selectCompact = `${selectFace} w-full pl-2 pr-8 py-1`;

export const selectKeycap = `${selectFace} w-[68px] shrink-0 pl-2 pr-8 py-1 font-medium`;

export const selectFlex = `${selectFace} min-w-0 flex-1 pl-2 pr-8 py-1 font-medium`;

export const tabBtn =
  'flex flex-1 items-center justify-center gap-1.5 rounded-[8px] px-7 py-1.5 text-center font-sans text-[12.5px] font-medium leading-normal transition-colors duration-120 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[rgb(var(--ro-c-accent))]';

export const tabActive = 'bg-[rgb(var(--ro-c-line))] text-[rgb(var(--ro-c-ink))]';

export const tabInactive =
  'text-[rgb(var(--ro-c-muted))] hover:bg-[rgb(var(--ro-c-panel-raised))] hover:text-[rgb(var(--ro-c-ink))]';

export const tabList =
  'flex shrink-0 gap-1 rounded-[11px] border border-[rgb(var(--ro-c-line-soft))] bg-[rgb(var(--ro-c-panel))] p-[3px]';

export const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-[rgb(var(--ro-c-accent))]';

export const gepardBanner = 'ro-notice-warn';

export const microLabel =
  'self-center font-sans text-xs font-medium leading-normal text-[rgb(var(--ro-c-muted))] normal-case';

export const statusDotOk = 'inline-block h-2 w-2 shrink-0 rounded-full bg-[rgb(var(--ro-c-ok))]';

export const statusDotPending =
  'inline-block h-2 w-2 shrink-0 rounded-full bg-[rgb(var(--ro-c-muted))]';

export const statusDotWarn =
  'inline-block h-2 w-2 shrink-0 rounded-full bg-[rgb(var(--ro-c-warn))]';

export const keyChip =
  'min-w-0 flex-1 h-7 p-0 font-mono rounded-[7px] text-[11.5px] leading-normal transition-colors duration-120 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[rgb(var(--ro-c-accent))]';

export const keyChipActive =
  'bg-[rgb(var(--ro-c-accent))] font-medium text-[rgb(var(--ro-c-on-accent))]';

export const keyChipIdle =
  'bg-[rgb(var(--ro-c-panel-raised))] font-normal text-[rgb(var(--ro-c-muted))] hover:bg-[rgb(var(--ro-c-line))] hover:text-[rgb(var(--ro-c-ink))]';

export const fieldCompact =
  'w-full rounded-[9px] border border-[rgb(var(--ro-c-line))] bg-[rgb(var(--ro-c-field))] py-1 pl-1.5 pr-4 text-center font-mono text-[12.5px] leading-[normal] text-[rgb(var(--ro-c-ink))] disabled:text-[rgb(var(--ro-c-muted))]';

export const logWell =
  'mx-[18px] mb-4 min-h-0 flex-1 overflow-y-auto overscroll-contain rounded-[9px] border border-[rgb(var(--ro-c-line))] bg-[rgb(var(--ro-c-surface))] px-3 py-2 font-mono text-[11px] leading-relaxed text-[rgb(var(--ro-c-muted))]';

export const textInk = 'ro-ink';
export const textMuted = 'text-[rgb(var(--ro-c-muted))]';
export const textDetail = 'text-[11px] text-[rgb(var(--ro-c-muted))]';

export const textLink =
  'text-[11px] text-[rgb(var(--ro-c-muted))] transition-colors duration-120 hover:text-[rgb(var(--ro-c-ink))]';

export function rangeProgress(value: number, min: number, max: number) {
  const pct = max > min ? Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100)) : 0;
  return { '--range-progress': `${pct}%` } as CSSProperties;
}
