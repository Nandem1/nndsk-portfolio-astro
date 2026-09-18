import { launchButtonDisabled, launchButtonLabel, launchButtonVariant } from '../demo.logic';
import { getServerById } from '../mockData';
import { captureWindowScrollFromPointer } from '../preserveWindowScroll';
import { btnBase, btnDisabled, btnPrimary, btnSecondary, focusRing } from '../chrome/classes';
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

  const variantClass = variant === 'primary' ? btnPrimary : btnSecondary;

  return (
    <div className="flex flex-col gap-2 shrink-0 border-t border-white/[0.06] pt-3">
      {progress && (
        <div className="space-y-1">
          <div className="flex justify-between gap-2 text-[10px] text-zinc-500">
            <span className="truncate">{progress.step}</span>
            <span className="shrink-0 tabular-nums">{progress.percent}%</span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-600 via-amber-300 to-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>
      )}
      <button
        type="button"
        className={`${btnBase} ${variantClass} ${disabled ? btnDisabled : ''} ${focusRing}`}
        aria-disabled={disabled}
        onPointerDownCapture={() => captureWindowScrollFromPointer()}
        onClick={() => {
          if (disabled) return;
          onLaunchClick();
        }}
      >
        {label}
      </button>
      {playNotice && (
        <p className="text-[11px] text-zinc-500 text-center px-2 leading-relaxed" role="status">
          {playNotice}
        </p>
      )}
    </div>
  );
}
