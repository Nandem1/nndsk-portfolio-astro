export type RunnerId = 'proton-cachyos' | 'wine-7.16';

export type ServerId = 'honeyro' | 'sakuraro' | 'unknown';

export type PotKey =
  | 'F1'
  | 'F2'
  | 'F3'
  | 'F4'
  | 'F5'
  | 'F6'
  | 'F7'
  | 'F8'
  | 'F9'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '0';

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

export type LogChannel = 'game' | 'tools';

export interface AutobuffRuleState {
  id: string;
  label: string;
  key: string;
  enabled: boolean;
}

export interface DemoState {
  selectedServerId: ServerId;
  selectedRunnerId: RunnerId;
  runnerOverride: Partial<Record<ServerId, RunnerId>>;
  prefixByKey: Record<string, PrefixState>;
  progress: { step: string; percent: number } | null;
  prepareStepIndex: number;
  gameLogs: string[];
  toolLogs: string[];
  logChannel: LogChannel;
  toolView: ToolView;
  spammerKeys: string[];
  playNotice: string | null;
  autopotEnabled: boolean;
  autopotProactive: boolean;
  autopotHpKey: PotKey;
  autopotSpKey: PotKey;
  autopotHpPercent: number;
  autopotSpPercent: number;
  autopotDelayMs: number;
  spammerEnabled: boolean;
  spammerDelayMs: number;
  autobuffEnabled: boolean;
  autobuffRules: AutobuffRuleState[];
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
  | { type: 'clearLogs' }
  | { type: 'setLogChannel'; channel: LogChannel }
  | { type: 'toggleAutopot' }
  | { type: 'toggleAutopotProactive' }
  | { type: 'setAutopotField'; field: AutopotField; value: string | number }
  | { type: 'toggleSpammer' }
  | { type: 'setSpammerDelay'; delayMs: number }
  | { type: 'toggleAutobuff' }
  | { type: 'toggleAutobuffRule'; ruleId: string }
  | { type: 'setAutobuffRuleKey'; ruleId: string; key: PotKey }
  | { type: 'resetPrefix' };

export type AutopotField = 'hpKey' | 'spKey' | 'hpPercent' | 'spPercent' | 'delayMs';
