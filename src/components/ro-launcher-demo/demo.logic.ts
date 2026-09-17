import { getServerById } from './mockData';
import type {
  DemoAction,
  DemoServer,
  DemoState,
  PotKey,
  PrefixState,
  RunnerId,
  ServerId,
} from './types';

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

export const LOG_AUTOPOT = '[demo] AutoPot simulado. No lee memoria ni envía teclas.';
export const LOG_SPAMMER = '[demo] Spammer simulado. No inyecta input (evdev/ydotool).';
export const LOG_AUTOBUFF = '[demo] AutoBuff simulado. No lee estados ni envía teclas.';
export const LOG_RESET = '[demo] Rearmar simulado — no borra un WINEPREFIX.';

export const initialDemoState: DemoState = {
  selectedServerId: 'honeyro',
  selectedRunnerId: 'proton-cachyos',
  runnerOverride: {},
  prefixByKey: {},
  progress: null,
  prepareStepIndex: -1,
  gameLogs: [],
  toolLogs: [],
  logChannel: 'game',
  toolView: 'combat',
  spammerKeys: ['F1'],
  playNotice: null,
  autopotEnabled: false,
  autopotProactive: false,
  autopotHpKey: 'F8',
  autopotSpKey: 'F9',
  autopotHpPercent: 80,
  autopotSpPercent: 50,
  autopotDelayMs: 100,
  spammerEnabled: false,
  spammerDelayMs: 16,
  autobuffEnabled: false,
  autobuffRules: [
    { id: 'rule-conc', label: 'Concentration Potion', key: 'F1', enabled: true },
    { id: 'rule-awak', label: 'Awakening Potion', key: 'F2', enabled: true },
  ],
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

export function toolsReady(state: DemoState, server?: DemoServer): boolean {
  const s = server ?? getServerById(state.selectedServerId);
  return getPrefixState(state, s) === 'ready';
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

export type LaunchButtonVariant = 'primary' | 'secondary';

export function launchButtonVariant(state: DemoState, server: DemoServer): LaunchButtonVariant {
  const prefix = getPrefixState(state, server);
  if (prefix === 'ready') return 'primary';
  return 'secondary';
}

export function hasEnabledAutobuffRule(state: DemoState): boolean {
  return state.autobuffRules.some(rule => rule.enabled);
}

export function clampSpammerDelay(delayMs: number): number {
  return Math.min(50, Math.max(16, delayMs));
}

export function clampAutopotDelay(delayMs: number): number {
  return Math.min(200, Math.max(10, delayMs));
}

export function formatSpammerKeysLabel(keys: string[]): string {
  return keys.join(', ') || '—';
}

function appendGameLog(state: DemoState, line: string): DemoState {
  return { ...state, gameLogs: [...state.gameLogs, line] };
}

function appendToolLog(state: DemoState, line: string): DemoState {
  return { ...state, toolLogs: [...state.toolLogs, line] };
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
      return appendGameLog(
        appendGameLog(
          {
            ...state,
            prefixByKey: { ...state.prefixByKey, [key]: 'preparing' },
            progress: { step: PREPARE_STEPS[0].step, percent: PREPARE_STEPS[0].percent },
            prepareStepIndex: 0,
            playNotice: null,
          },
          LOG_PREPARE_INTRO
        ),
        `[demo] ${PREPARE_STEPS[0].step}`
      );
    }
    case 'prepareTick': {
      const nextIndex = state.prepareStepIndex + 1;
      if (nextIndex >= PREPARE_STEPS.length) {
        return state;
      }
      const step = PREPARE_STEPS[nextIndex];
      return appendGameLog(
        {
          ...state,
          prepareStepIndex: nextIndex,
          progress: { step: step.step, percent: step.percent },
        },
        `[demo] ${step.step}`
      );
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
      return appendGameLog(
        appendGameLog(
          {
            ...state,
            prefixByKey: { ...state.prefixByKey, [key]: 'ready' },
            progress: null,
            prepareStepIndex: -1,
            playNotice: null,
          },
          LOG_PREPARE_INTRO
        ),
        '[demo] ¡Listo!'
      );
    }
    case 'play': {
      const server = getServerById(state.selectedServerId);
      if (getPrefixState(state, server) !== 'ready') {
        return state;
      }
      return appendGameLog(
        {
          ...state,
          playNotice: 'Solo demo — el sitio no lanza el cliente.',
        },
        LOG_PLAY
      );
    }
    case 'setToolView':
      return { ...state, toolView: action.view };
    case 'toggleSpammerKey': {
      if (!toolsReady(state)) {
        return state;
      }
      const keys = state.spammerKeys.includes(action.key)
        ? state.spammerKeys.filter(k => k !== action.key)
        : [...state.spammerKeys, action.key];
      if (keys.length === 0) {
        return state;
      }
      return { ...state, spammerKeys: keys };
    }
    case 'clearLogs':
      if (state.logChannel === 'game') {
        return { ...state, gameLogs: [] };
      }
      return { ...state, toolLogs: [] };
    case 'setLogChannel':
      return { ...state, logChannel: action.channel };
    case 'toggleAutopot': {
      if (!toolsReady(state)) {
        return state;
      }
      const next = !state.autopotEnabled;
      if (!next) {
        return { ...state, autopotEnabled: false };
      }
      return appendToolLog({ ...state, autopotEnabled: true }, LOG_AUTOPOT);
    }
    case 'toggleAutopotProactive':
      if (!toolsReady(state)) {
        return state;
      }
      return { ...state, autopotProactive: !state.autopotProactive };
    case 'setAutopotField': {
      if (!toolsReady(state)) {
        return state;
      }
      const { field, value } = action;
      if (field === 'hpKey' || field === 'spKey') {
        return { ...state, [field]: value as PotKey };
      }
      if (field === 'hpPercent' || field === 'spPercent') {
        const n = Math.min(99, Math.max(1, Number(value) || 1));
        return { ...state, [field]: n };
      }
      if (field === 'delayMs') {
        return { ...state, autopotDelayMs: clampAutopotDelay(Number(value)) };
      }
      return state;
    }
    case 'toggleSpammer': {
      if (!toolsReady(state) || state.spammerKeys.length === 0) {
        return state;
      }
      const next = !state.spammerEnabled;
      if (!next) {
        return { ...state, spammerEnabled: false };
      }
      return appendToolLog({ ...state, spammerEnabled: true }, LOG_SPAMMER);
    }
    case 'setSpammerDelay':
      if (!toolsReady(state)) {
        return state;
      }
      return { ...state, spammerDelayMs: clampSpammerDelay(action.delayMs) };
    case 'toggleAutobuff': {
      if (!toolsReady(state) || !hasEnabledAutobuffRule(state)) {
        return state;
      }
      const next = !state.autobuffEnabled;
      if (!next) {
        return { ...state, autobuffEnabled: false };
      }
      return appendToolLog({ ...state, autobuffEnabled: true }, LOG_AUTOBUFF);
    }
    case 'toggleAutobuffRule': {
      if (!toolsReady(state)) {
        return state;
      }
      const autobuffRules = state.autobuffRules.map(rule =>
        rule.id === action.ruleId ? { ...rule, enabled: !rule.enabled } : rule
      );
      const hasEnabled = autobuffRules.some(rule => rule.enabled);
      return {
        ...state,
        autobuffRules,
        autobuffEnabled: hasEnabled ? state.autobuffEnabled : false,
      };
    }
    case 'setAutobuffRuleKey':
      if (!toolsReady(state)) {
        return state;
      }
      return {
        ...state,
        autobuffRules: state.autobuffRules.map(rule =>
          rule.id === action.ruleId ? { ...rule, key: action.key } : rule
        ),
      };
    case 'resetPrefix': {
      const server = getServerById(state.selectedServerId);
      const key = prefixKey(server.id, effectiveRunnerId(state, server));
      if (getPrefixState(state, server) !== 'ready') {
        return state;
      }
      const { [key]: _removed, ...restPrefix } = state.prefixByKey;
      return appendGameLog(
        {
          ...state,
          prefixByKey: restPrefix,
          progress: null,
          prepareStepIndex: -1,
          playNotice: null,
          autopotEnabled: false,
          spammerEnabled: false,
          autobuffEnabled: false,
        },
        LOG_RESET
      );
    }
    default:
      return state;
  }
}
