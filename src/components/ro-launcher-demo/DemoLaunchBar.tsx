import { getServerById } from './mockData';
import { launchButtonDisabled, launchButtonLabel } from './demo.logic';
import { btnDisabled, btnPrimary, focusRing } from './classes';
import type { DemoState } from './types';

interface Props {
  state: DemoState;
  onLaunchClick: () => void;
}

export function DemoLaunchBar({ state, onLaunchClick }: Props) {
  const server = getServerById(state.selectedServerId);
  const disabled = launchButtonDisabled(state, server);
  const label = launchButtonLabel(state, server);
  const { progress, playNotice } = state;

  return (
    <div className="flex flex-col gap-2 shrink-0 border-t border-border pt-3">
      {progress && (
        <div className="space-y-1">
          <div className="flex justify-between gap-2 text-[10px] text-muted">
            <span className="truncate">{progress.step}</span>
            <span className="shrink-0 tabular-nums">{progress.percent}%</span>
          </div>
          <div className="w-full bg-border rounded-md h-1.5 overflow-hidden">
            <div
              className="h-full bg-foreground rounded-md transition-all duration-300"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>
      )}
      <button
        type="button"
        className={`${btnPrimary} ${disabled ? btnDisabled : ''} ${focusRing}`}
        disabled={disabled}
        onClick={onLaunchClick}
      >
        {label}
      </button>
      {playNotice && (
        <p className="text-[11px] text-muted text-center px-2 leading-relaxed" role="status">
          {playNotice}
        </p>
      )}
    </div>
  );
}
