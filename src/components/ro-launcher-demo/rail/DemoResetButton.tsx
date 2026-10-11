import type { Dispatch } from 'react';
import { getPrefixState } from '../demo.logic';
import { getServerById } from '../mockData';
import { captureWindowScrollFromPointer } from '../preserveWindowScroll';
import { btnBase, btnSecondary, btnSecondaryDisabled, textDetail } from '../chrome/classes';
import type { DemoAction, DemoState } from '../types';

interface Props {
  state: DemoState;
  dispatch: Dispatch<DemoAction>;
}

export function DemoResetButton({ state, dispatch }: Props) {
  const server = getServerById(state.selectedServerId);
  const prefix = getPrefixState(state, server);
  const ready = prefix === 'ready';
  const helper = ready
    ? 'Simulación: vuelve este perfil a pendiente. No borra un prefix real.'
    : 'Disponible cuando el entorno está listo.';

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        aria-disabled={!ready}
        title={helper}
        className={`${btnBase} ${ready ? btnSecondary : btnSecondaryDisabled}`}
        onPointerDownCapture={() => captureWindowScrollFromPointer()}
        onClick={() => {
          if (!ready) return;
          dispatch({ type: 'resetPrefix' });
        }}
      >
        Rearmar entorno
      </button>
      <p className={`${textDetail} px-0.5 leading-snug`}>{helper}</p>
    </div>
  );
}
