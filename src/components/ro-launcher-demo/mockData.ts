import type { DemoRunner, DemoServer, PotKey } from './types';

export const POT_KEYS: PotKey[] = [
  'F1',
  'F2',
  'F3',
  'F4',
  'F5',
  'F6',
  'F7',
  'F8',
  'F9',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '0',
];

export const DEMO_VITALS = { hpCur: 1840, hpMax: 2000, spCur: 420, spMax: 600 };

const ANTICHEAT_WARNING =
  'Se detectó anti-cheat. Confirma con el servidor si Wine, DXVK y la versión de dgVoodoo están permitidos.';

export const DEMO_RUNNERS: DemoRunner[] = [
  {
    id: 'nndsk-ro-proton-0.1.0-dev.2',
    name: 'nndsk-ro-proton 0.1.0-dev.2',
    kind: 'proton',
  },
  {
    id: 'wine-7.16-staging-tkg-amd64',
    name: 'Wine 7.16 Staging/TkG amd64 · old-WoW64',
    kind: 'wine',
  },
];

export const DEMO_SERVERS: DemoServer[] = [
  {
    id: 'honeyro',
    name: 'HoneyRO',
    runnerId: 'nndsk-ro-proton-0.1.0-dev.2',
    gepard: {
      present: true,
      validated: true,
      productVersion: '3.0',
      fileVersion: '26.8.26.1',
      profileLabel: 'nndsk-ro-proton 0.1.0-dev.2 + DXVK 3.0.1',
      recommendedRunnerId: 'nndsk-ro-proton-0.1.0-dev.2',
      banner:
        'Gepard Shield 3.0 (FileVersion 26.8.26.1) reconocido: perfil validado nndsk-ro-proton 0.1.0-dev.2 + DXVK 3.0.1.',
      mismatchRemediation:
        'Selecciona el nndsk-ro-proton 0.1.0-dev.2 administrado o un Proton moderno',
    },
    tools: {
      openSetup: { found: true, label: 'Setup.exe' },
      patcher: { found: true, label: 'HoneyRO Patcher.exe' },
      dgvoodoo: { configured: true, detail: 'conf OK' },
    },
    diagnostics: {
      architecture: 'PE32',
      graphicsApis: ['Direct3D'],
      warnings: [
        'Gepard Shield 3.0 (FileVersion 26.8.26.1) reconocido: perfil validado nndsk-ro-proton 0.1.0-dev.2 + DXVK 3.0.1.',
        ANTICHEAT_WARNING,
      ],
    },
  },
  {
    id: 'sakuraro',
    name: 'SakuraRO',
    runnerId: 'wine-7.16-staging-tkg-amd64',
    gepard: {
      present: true,
      validated: true,
      productVersion: '3.0',
      fileVersion: '26.9.3.1',
      profileLabel: 'Wine 7.16 Staging/TkG amd64 · old-WoW64 + DXVK 2.6.2',
      recommendedRunnerId: 'wine-7.16-staging-tkg-amd64',
      banner:
        'Gepard Shield 3.0 (FileVersion 26.9.3.1) reconocido: perfil validado Wine 7.16 Staging/TkG amd64 · old-WoW64 + DXVK 2.6.2.',
      mismatchRemediation:
        'Selecciona Wine 7.16 Staging/TkG amd64 · old-WoW64; DXVK 2.6.2 conservará Vulkan moderno',
    },
    tools: {
      openSetup: { found: true, label: 'Setup.exe' },
      patcher: { found: true, label: 'SakuraRO Patcher.exe' },
      dgvoodoo: { configured: false, detail: '—' },
    },
    diagnostics: {
      architecture: 'PE32',
      graphicsApis: ['Direct3D'],
      warnings: [
        'Gepard Shield 3.0 (FileVersion 26.9.3.1) reconocido: perfil validado Wine 7.16 Staging/TkG amd64 · old-WoW64 + DXVK 2.6.2.',
        ANTICHEAT_WARNING,
      ],
    },
  },
  {
    id: 'unknown',
    name: 'Servidor (Gepard no validado)',
    runnerId: 'nndsk-ro-proton-0.1.0-dev.2',
    gepard: {
      present: true,
      validated: false,
      banner: 'Build de Gepard no validada; conserva un prefix separado al probar runners.',
    },
    tools: {
      openSetup: { found: true, label: 'Setup.exe' },
      patcher: { found: false, label: '—' },
      dgvoodoo: { configured: false, detail: '—' },
    },
    diagnostics: {
      architecture: 'PE32',
      graphicsApis: ['Direct3D'],
      warnings: [
        'Build de Gepard no validada; conserva un prefix separado al probar runners.',
        ANTICHEAT_WARNING,
      ],
    },
  },
];

export function getServerById(id: DemoServer['id']): DemoServer {
  const server = DEMO_SERVERS.find(s => s.id === id);
  if (!server) throw new Error(`Unknown demo server: ${id}`);
  return server;
}

export function getRunnerById(id: DemoRunner['id']): DemoRunner {
  const runner = DEMO_RUNNERS.find(r => r.id === id);
  if (!runner) throw new Error(`Unknown demo runner: ${id}`);
  return runner;
}
