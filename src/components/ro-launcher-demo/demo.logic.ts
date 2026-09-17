import { getServerById } from './mockData';
import type { DemoAction, DemoServer, DemoState, PrefixState, RunnerId, ServerId } from './types';

export const PREPARE_STEPS: { step: string; percent: number }[] = [
  { step: 'Creando entorno aislado...', percent: 40 },
  { step: 'Inicializando entorno...', percent: 45 },
  { step: 'Preparando Wine Gecko...', percent: 50 },
  { step: 'Preparando gráficos...', percent: 55 },
  { step: 'Instalando vcredist_2019...', percent: 65 },
  { step: 'Instalando d3dx9...', percent: 75 },
  { step: 'Instalando corefonts...', percent: 88 },
  { step: 'Configurando audio...', percent: 96 },
  { step: '¡Listo!', percent: 100 },
];

export const LOG_PREPARE_INTRO = '[demo] Simulación — no descarga Proton ni escribe un WINEPREFIX.';

export const LOG_PLAY =
  '[demo] Jugar no está disponible en el sitio. RO-Launcher es una app de escritorio Linux.';

export const initialDemoState: DemoState = {
  selectedServerId: 'honeyro',
  selectedRunnerId: 'proton-cachyos',
  runnerOverride: {},
  prefixByKey: {},
  progress: null,
  prepareStepIndex: -1,
  logs: [],
  toolView: 'combat',
  spammerKeys: ['F1'],
  playNotice: null,
};

export function effectiveRunnerId(state: DemoState, server: DemoServer): RunnerId {
  return state.runnerOverride[server.id] ?? server.runnerId;
}

export function prefixKey(serverId: ServerId, runnerId: RunnerId): string {
  return `${serverId}::${runnerId}`;
}

export function getPrefixState(state: DemoState, server: DemoServer): PrefixState {
  const key = prefixKey(server.id, effectiveRunnerId(state, server));
  return state.prefixByKey[key] ?? 'pending';
}

export function gepardMismatchMessage(state: DemoState, server: DemoServer): string | null {
  const gepard = server.gepard;
  if (!gepard.validated || !gepard.recommendedRunnerId || !gepard.fileVersion) {
    return null;
  }
  const effective = effectiveRunnerId(state, server);
  if (effective === gepard.recommendedRunnerId) {
    return null;
  }
  return `Gepard 3.0 build ${gepard.fileVersion} recomienda el perfil validado ${gepard.profileLabel ?? ''}`.trim();
}

export function runnerDotOk(state: DemoState, server: DemoServer): boolean {
  const gepard = server.gepard;
  if (!gepard.validated || !gepard.recommendedRunnerId) {
    return true;
  }
  return effectiveRunnerId(state, server) === gepard.recommendedRunnerId;
}

export function launchButtonLabel(state: DemoState, server: DemoServer): string {
  const prefix = getPrefixState(state, server);
  if (prefix === 'preparing') return 'Configurando...';
  if (prefix === 'ready') return 'Jugar';
  return 'Preparar entorno';
}

export function launchButtonDisabled(state: DemoState, server: DemoServer): boolean {
  return getPrefixState(state, server) === 'preparing';
}

export function demoReducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case 'selectServer':
      return {
        ...state,
        selectedServerId: action.serverId,
        playNotice: null,
      };
    case 'setRunner': {
      const serverId = state.selectedServerId;
      return {
        ...state,
        selectedRunnerId: action.runnerId,
        runnerOverride: { ...state.runnerOverride, [serverId]: action.runnerId },
        playNotice: null,
      };
    }
    case 'prepareStart': {
      const server = getServerById(state.selectedServerId);
      const key = prefixKey(server.id, effectiveRunnerId(state, server));
      const current = state.prefixByKey[key] ?? 'pending';
      if (current === 'ready' || current === 'preparing') {
        return state;
      }
      return {
        ...state,
        prefixByKey: { ...state.prefixByKey, [key]: 'preparing' },
        progress: { step: PREPARE_STEPS[0].step, percent: PREPARE_STEPS[0].percent },
        prepareStepIndex: 0,
        logs: [...state.logs, LOG_PREPARE_INTRO, `[demo] ${PREPARE_STEPS[0].step}`],
        playNotice: null,
      };
    }
    case 'prepareTick': {
      const nextIndex = state.prepareStepIndex + 1;
      if (nextIndex >= PREPARE_STEPS.length) {
        return state;
      }
      const step = PREPARE_STEPS[nextIndex];
      return {
        ...state,
        prepareStepIndex: nextIndex,
        progress: { step: step.step, percent: step.percent },
        logs: [...state.logs, `[demo] ${step.step}`],
      };
    }
    case 'prepareDone': {
      const server = getServerById(state.selectedServerId);
      const key = prefixKey(server.id, effectiveRunnerId(state, server));
      return {
        ...state,
        prefixByKey: { ...state.prefixByKey, [key]: 'ready' },
        progress: null,
        prepareStepIndex: -1,
      };
    }
    case 'prepareInstant': {
      const server = getServerById(state.selectedServerId);
      const key = prefixKey(server.id, effectiveRunnerId(state, server));
      const current = state.prefixByKey[key] ?? 'pending';
      if (current === 'ready' || current === 'preparing') {
        return state;
      }
      return {
        ...state,
        prefixByKey: { ...state.prefixByKey, [key]: 'ready' },
        progress: null,
        prepareStepIndex: -1,
        logs: [...state.logs, LOG_PREPARE_INTRO, '[demo] ¡Listo!'],
        playNotice: null,
      };
    }
    case 'play': {
      const server = getServerById(state.selectedServerId);
      if (getPrefixState(state, server) !== 'ready') {
        return state;
      }
      return {
        ...state,
        logs: [...state.logs, LOG_PLAY],
        playNotice: 'Solo demo — el sitio no lanza el cliente.',
      };
    }
    case 'setToolView':
      return { ...state, toolView: action.view };
    case 'toggleSpammerKey': {
      const keys = state.spammerKeys.includes(action.key)
        ? state.spammerKeys.filter(k => k !== action.key)
        : [...state.spammerKeys, action.key];
      if (keys.length === 0) {
        return state;
      }
      return { ...state, spammerKeys: keys };
    }
    case 'clearLogs':
      return { ...state, logs: [] };
    default:
      return state;
  }
}
