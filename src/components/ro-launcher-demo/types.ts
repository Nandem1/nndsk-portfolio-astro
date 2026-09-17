export type RunnerId = 'proton-cachyos' | 'wine-7.16';

export type ServerId = 'honeyro' | 'sakuraro' | 'unknown';

export interface DemoRunner {
  id: RunnerId;
  name: string;
  kind: 'proton' | 'wine';
}

export interface GepardInfo {
  present: boolean;
  validated: boolean;
  productVersion?: '3.0';
  fileVersion?: '26.8.26.1' | '26.9.3.1';
  profileLabel?: string;
  recommendedRunnerId?: RunnerId;
  banner: string;
  mismatchRemediation?: string;
}

export interface ToolInfoMock {
  found: boolean;
  label: string;
}

export interface DemoServer {
  id: ServerId;
  name: string;
  runnerId: RunnerId;
  gepard: GepardInfo;
  tools: {
    openSetup: ToolInfoMock;
    patcher: ToolInfoMock;
    dgvoodoo: { configured: boolean; detail: string };
  };
  diagnostics: {
    architecture: 'PE32';
    graphicsApis: string[];
    warnings: string[];
  };
}

export type PrefixState = 'pending' | 'preparing' | 'ready';

export type ToolView = 'combat' | 'buffs';

export interface DemoState {
  selectedServerId: ServerId;
  selectedRunnerId: RunnerId;
  runnerOverride: Partial<Record<ServerId, RunnerId>>;
  prefixByKey: Record<string, PrefixState>;
  progress: { step: string; percent: number } | null;
  prepareStepIndex: number;
  logs: string[];
  toolView: ToolView;
  spammerKeys: string[];
  playNotice: string | null;
}

export type DemoAction =
  | { type: 'selectServer'; serverId: ServerId }
  | { type: 'setRunner'; runnerId: RunnerId }
  | { type: 'prepareStart' }
  | { type: 'prepareTick' }
  | { type: 'prepareDone' }
  | { type: 'prepareInstant' }
  | { type: 'play' }
  | { type: 'setToolView'; view: ToolView }
  | { type: 'toggleSpammerKey'; key: string }
  | { type: 'clearLogs' };
