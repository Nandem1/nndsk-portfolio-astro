import { launchButtonDisabled, launchButtonLabel, launchButtonVariant } from '../demo.logic';
import { getServerById } from '../mockData';
import { captureWindowScrollFromPointer } from '../preserveWindowScroll';
import { btnBase, btnPrimary, btnPrimaryDisabled, textDetail } from '../chrome/classes';
import { IconHammer, IconPlay } from '../chrome/DemoIcons';
import type { DemoState } from '../types';

interface Props {
  state: DemoState;
  onLaunchClick: () => void;
}

export function DemoLaunchBar({ state, onLaunchClick }: Props) {
  const server = getServerById(state.selectedServerId);
  const disabled = launchButtonDisabled(state, server);
  const label = launchButtonLabel(state, server);
  const variant = launchButtonVariant(state, server);
  const { progress, playNotice } = state;

  // The desktop app paints "Preparar entorno" with the primary accent too; the
  // variant only picks the icon (Hammer while building, Play when ready).
  const Icon = variant === 'primary' ? IconPlay : IconHammer;

  return (
    <div className="flex shrink-0 flex-col gap-2 border-t border-[rgb(var(--ro-c-line))] pt-3">
      {progress && (
        <div className="space-y-1">
          <div className={`flex justify-between gap-2 ${textDetail}`}>
            <span className="truncate">{progress.step}</span>
            <span className="shrink-0 font-mono tabular-nums">{progress.percent}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[rgb(var(--ro-c-panel-raised))]">
            <div
              className="ro-demo-progress-fill h-full rounded-full bg-[rgb(var(--ro-c-muted))]"
              style={{
                width: `${progress.percent}%`,
                transitionProperty: 'width',
                transitionDuration: `${progress.durationMs}ms`,
                transitionTimingFunction: 'cubic-bezier(0.33, 0, 0.2, 1)',
              }}
            />
          </div>
        </div>
      )}
      <button
        type="button"
        className={`${btnBase} ${disabled ? btnPrimaryDisabled : btnPrimary}`}
        aria-disabled={disabled}
        onPointerDownCapture={() => captureWindowScrollFromPointer()}
        onClick={() => {
          if (disabled) return;
          onLaunchClick();
        }}
      >
        {!disabled && <Icon />}
        {label}
      </button>
      {playNotice && (
        <p className={`${textDetail} px-2 text-center leading-relaxed`} role="status">
          {playNotice}
        </p>
      )}
    </div>
  );
}
