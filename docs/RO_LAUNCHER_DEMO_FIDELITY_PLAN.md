# Plan de fidelidad: demo interactiva de RO-Launcher

**Rol:** especificación cerrada para Composer. Cero juicio de diseño. Si un paso no está aquí, no se hace.

**Fase:** solo plan. Este PR no cambia UI, no mueve componentes, no restylea.

**Supersede:** este documento **reemplaza** `docs/RO_LAUNCHER_INTERACTIVE_UI_PLAN.md` en tema, layout del centro, unlock de tools, Rearmar, y árbol de archivos. Conserva fixtures (HoneyRO / SakuraRO / unknown), honestidad de Jugar, y la isla React ya existente en PR #2.

**No mergear a `main`.** No desplegar. No tocar el repo `nndsk-ro-launcher`.

**Fuente auditada:** `Nandem1/nndsk-ro-launcher` @ `main` (`5019b921cc7c2182f43298bc37e0fd2822033382`, 2026-09-17). Tauri v2 + React 18 + Tailwind v3. Ventana `1280×820`, `backgroundColor: #09090b` (`src-tauri/tauri.conf.json`).

**Target:** `Nandem1/nndsk-portfolio-astro` encima de PR #2 (`cursor/ro-launcher-featured-plan-cef7`). Isla actual: `src/components/ro-launcher-demo/*` restyleada a Dark Graphite, tools del centro **siempre disabled**.

**Protocolo del implementer**

1. Leer este archivo entero antes de tocar código.
2. Rebase sobre `origin/cursor/ro-launcher-featured-plan-cef7` (o `main` si #2 ya mergió).
3. Ejecutar la lista de la sección 8 en ese orden.
4. No improvisar colores, copy, servidores, ni flujos.
5. No tocar Mercado House, Hero, Bio, EcoRetirosRM, gisan, hyprtask.
6. **Excepción Graphite (Vicente):** el **widget** usa el tema real zinc/ámbar/glass. El **resto de la página** sigue Dark Graphite. No añadir ámbar a `src/styles/global.css` ni a `@theme`.
7. Nunca afirmar que el sitio lanza Ragnarok Online, Wine, Proton, ni el cliente. Play no entra a modo `ingame`.

---

## 0. Qué hay hoy (PR #2) y qué falla

La isla **ya existe** y **ya está partida en varios TSX**. No reescribir desde cero. Fallos que Composer debe corregir en **un solo pass**:

| Hallazgo | Evidencia | Acción |
| --- | --- | --- |
| Chrome Graphite, no el de la app | `classes.ts` usa `bg-card` / `border-border` / `text-foreground` / `text-accent`. Header `RO-Launcher` todo plata. | Restylear el widget a zinc/ámbar/glass (tabla §2). |
| Centro existe en `full` pero Graphite y muerto | `RoLauncherDemo.tsx` monta AutoPot/Spammer/AutoBuff. Toggles `disabled` forever. Compact **omite** el centro. Vicente: el centro faltó; v1 debe incluirlo. | Centro en compact **y** full. Unlock tras Preparar → `ready` (P0). |
| Tools no se pueden usar | `DemoAutopot.tsx` / `DemoSpammer.tsx` / `DemoAutobuff.tsx`: `DemoSwitch disabled`. Delay slider disabled. Keys de AutoPot disabled. | Tras `ready`, interactivos (P0). |
| Teclas HP/SP invertidas vs app | Demo: HP `F9`, SP `F8`. App: `DEFAULT_AUTOPOT_CONFIG` HP `F8`, SP `F9` (`src/shared/constants.ts`). | Corregir. |
| Delay Spammer `15ms` | App: default `16`, rango `16–50` (`SpammerDelayControl.tsx`). | Corregir. |
| Preparar no se “siente” 100% | `prepareDone` pone `progress: null` y esconde la barra. El botón sí dice `Configurando...` durante `preparing`. | Barra visible en 100% + `¡Listo!` un tick; botón `Configurando...` hasta ese tick (P1). |
| Herramientas se cortan | 3 cards en `max-w-3xl`; `HoneyRO Patcher.exe` truncate sin scroll del panel. | Truncate + `title` + scroll interno (P1). |
| Rearmar forever disabled sin porqué | `DemoResetButton.tsx`: `disabled` + `title="No disponible en demo"`. | Helper visible, o noop demo cuando `ready` (P1). |
| Archivos planos + `DemoSwitch` triplicado + `DemoPanel` dentro de `DemoHeader.tsx` | 17 files en un folder. | Mover al árbol §5. |

---

## 1. Layout real (wire de regiones)

No hay router. Una vista: `src/app/App.tsx`. Grid **2 columnas**, no 3. Vicente llama «centro» a la columna `1fr` (tools de combate/buffs).

```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER  «RO» ámbar + «-Launcher» zinc   |  Demo (prep chip)     │  AppHeader.tsx
├─────────────────┬───────────────────────────────────────────────┤
│ RAIL 300px      │ CENTRO (1fr)                                  │
│ gap 12px p-12   │                                               │
│                 │  ┌─ Herramientas (solo mode=prep) ─────────┐  │  ServerToolsPanel.tsx
│ Servidor        │  │ OpenSetup | Patcher | dgVoodoo + diag   │  │
│ Runner pred.    │  └─────────────────────────────────────────┘  │
│ Avanzado        │  ┌─ tabs Combate | Buffs ──────────────────┐  │  ToolViewTabs.tsx
│ (Discord: no)   │  └─────────────────────────────────────────┘  │
│ Rearmar         │  ┌─ combat: AutoPot | Spammer (grid-cols-2)─┐ │  AutopotPanel / SpammerPanel
│ ─────────────── │  │  buffs:  AutoBuff full width             │ │  AutobuffPanel.tsx
│ Preparar/Jugar  │  └─────────────────────────────────────────┘  │
│                 │  ┌─ Logs h-44  Juego | Tools ──────────────┐  │  LogPanels.tsx
│                 │  └─────────────────────────────────────────┘  │
└─────────────────┴───────────────────────────────────────────────┘
```

Constantes de `App.tsx`: `RAIL_EXPANDED_PX = 300`, `gap-3` (12px), `p-3`, `main` `gridTemplateColumns: ${railWidth}px 1fr`. Centro: `flex flex-col gap-2.5`. Combate: `grid h-full grid-cols-2 gap-2.5`. Logs: `shrink-0 flex h-44`.

**Modo demo:** siempre `prep` (rail 300px). No `ingame`, no rail 64px, no `IngameRail`, no chip «En juego».

| Región | Path launcher | v1 demo |
| --- | --- | --- |
| Header | `src/app/AppHeader.tsx` | Incluir. Título fiel. Derecha: texto `Demo` (honestidad), no «Developed by» ni chip ingame. |
| Servidor | `src/features/servers/ServerList.tsx` | Incluir radios. Sin + / lápiz / X. |
| Runner | `src/features/settings/RunnerSelector.tsx` | Incluir `<select>` nativo restyleado (no portar `DarkSelect` portal). Banner Gepard ámbar. |
| Avanzado | `src/features/settings/AdvancedSettings.tsx` | 4 líneas: Runner, Entorno, DXVK, Gepard. |
| Discord | `DiscordPresenceToggle.tsx` | **Excluir.** |
| Rearmar | `PrefixResetButton.tsx` | Incluir en `full`. Ver §6.E. |
| Launch | `src/features/launcher/LaunchButton.tsx` | Preparar / Configurando... / Jugar. |
| Herramientas | `ServerToolsPanel.tsx` + cards en el mismo file | `full` only. Botones nativos disabled. |
| Tabs | `src/app/ToolViewTabs.tsx` | Combate / Buffs. Compact **y** full. |
| AutoPot | `src/features/autopot/AutopotPanel.tsx` | Compact **y** full. Unlock P0. Sin MemoryScannerModal. |
| Spammer | `SpammerPanel.tsx` + `SpammerKeyboard.tsx` + `SpammerDelayControl.tsx` | Compact **y** full. F1–F9 y 0–9 (no QWERTY, no GearSwitch). Unlock P0. |
| AutoBuff | `AutobuffPanel.tsx` | Compact **y** full. 2 reglas preset. Unlock P0. Sin «Nuevo buff». |
| Logs | `LogPanels.tsx` + `LogPanelView.tsx` | `full` only. Tabs Juego / Tools. |

---

## 2. Token table (launcher → demo)

Paleta Tailwind v3 default. Hex = Tailwind 3.4. El portfolio es Tailwind v4: las utilities `zinc-*` / `amber-*` / `emerald-*` / `sky-*` / `red-*` **siguen existiendo** porque `global.css` no hace `--color-*: initial`. **Usar esas utilities dentro de `.ro-demo`.** No copiar hex sueltos salvo sombras/fondos de `tokens.css`.

| Rol | Launcher (class / file) | Hex | Demo (class en `.ro-demo`) |
| --- | --- | --- | --- |
| Fondo ventana / isla | `body` `bg-zinc-950` + `backgroundColor: #09090b` | `#09090b` | `bg-zinc-950` + radial de `tokens.css` |
| Texto primario | `text-zinc-100` | `#f4f4f5` | `text-zinc-100` |
| Título RO | `text-amber-400` (`AppHeader.tsx`) | `#fbbf24` | `text-amber-400` solo en «RO» |
| Título -Launcher | `text-zinc-100` | `#f4f4f5` | `text-zinc-100` |
| Subtítulo | `text-zinc-500` | `#71717a` | `text-zinc-500` |
| Label panel | `text-zinc-500 uppercase tracking-[0.14em] text-[10px]` (`Panel.tsx`) | `#71717a` | igual |
| Hint / disabled copy | `text-zinc-600` | `#52525b` | `text-zinc-600` |
| Fila no sel. | `text-zinc-200` | `#e4e4e7` | `text-zinc-200` |
| Fila sel. | `bg-amber-500/10 border-amber-500/20 text-amber-100 shadow-glow-amber` (`ServerList.tsx`) | ámbar `#f59e0b` | mismas classes + sombra de `tokens.css` |
| Panel shell | `rounded-xl border bg-gradient-to-b from-zinc-800/30 to-zinc-900/50 backdrop-blur-sm shadow-glass border-white/[0.06]` (`Panel.tsx`) | zinc-800 `#27272a` · zinc-900 `#18181b` | `panel` en `chrome/classes.ts` |
| Panel idle (tools locked) | `border-white/[0.04] opacity-60` tone `idle` | — | aplicar cuando `!toolsReady` |
| Panel success (AutoPot/AutoBuff on) | `border-emerald-500/30 shadow-glow-emerald` | emerald-500 `#10b981` | cuando toggle on + `toolsReady` |
| Panel warning (Spammer on) | `border-amber-500/30 shadow-glow-amber` | `#f59e0b` | cuando Spammer on + `toolsReady` |
| Inner well | `rounded-lg bg-zinc-950/40 border-zinc-800/60` | — | igual |
| Header app | `border-white/[0.06] bg-zinc-950/60 backdrop-blur-sm` | — | igual |
| CTA primario (Jugar) | `Button` primary: `border-amber-500/30 bg-amber-500/10 text-amber-100 hover:bg-amber-500/15 hover:border-amber-500/50 hover:shadow-glow-amber` + `focus-visible:ring-2 focus-visible:ring-amber-500/40` (`Button.tsx`) | — | `btnPrimary` |
| CTA secundario (Preparar / Rearmar) | `Button` secondary: `border-zinc-700/60 bg-zinc-900/40 text-zinc-300 hover:border-amber-500/40 hover:text-amber-300` | zinc-700 `#3f3f46` | `btnSecondary` |
| Progress track | `bg-zinc-800 rounded-full h-1.5` | `#27272a` | igual |
| Progress fill | `bg-gradient-to-r from-amber-600 via-amber-300 to-amber-400` (`LaunchButton.tsx`) | amber-600 `#d97706` · amber-300 `#fcd34d` · amber-400 `#fbbf24` | igual |
| Toggle off | `bg-zinc-800 border-zinc-700/80 rounded-full` (`ToggleSwitch.tsx`) | — | `chrome/DemoToggle.tsx` |
| Toggle on emerald | `bg-emerald-500/80 border-emerald-400/50 shadow-glow-emerald` | emerald-400 `#34d399` | AutoPot / AutoBuff |
| Toggle on ámbar | `bg-amber-500/80 border-amber-400/50 shadow-glow-amber` | — | Spammer + Modo proactivo |
| Knob | `w-3.5 h-3.5 rounded-full bg-white` | `#fff` | igual |
| StatusDot ok | `bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)] rounded-full w-2 h-2` | — | Avanzado / Herramientas |
| StatusDot warn | `bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.5)]` | — | mismatch Gepard |
| StatusDot neutral | `bg-zinc-600` | `#52525b` | pending |
| HP bar | `from-red-600 to-red-400` | red-600 `#dc2626` · red-400 `#f87171` | solo con valores demo |
| SP bar | `from-sky-600 to-sky-400` | sky-600 `#0284c7` · sky-400 `#38bdf8` | solo con valores demo |
| Tab activa | `bg-amber-500/15 text-amber-200 border-amber-500/40` (`ToolViewTabs.tsx`) | amber-200 `#fde68a` | igual |
| Tab inactiva | `text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04]` | — | igual |
| Keychip on | `border-amber-500/70 bg-amber-500/15 text-amber-200` (`SpammerKeyboard.tsx`) | — | igual |
| Keychip off | `border-zinc-800/80 bg-zinc-950/50 text-zinc-600` | — | igual |
| Banner Gepard | `border-amber-500/15 bg-amber-500/5 text-amber-300/90` (`RunnerSelector.tsx`) | — | igual |
| Warning diag | `text-amber-400/80` (`ServerToolsPanel.tsx`) | amber-400 `#fbbf24` | igual |
| Focus (P2) | `focus-visible:ring-2 focus-visible:ring-amber-500/40` | — | radios, select, botones, tabs, toggles, keychips |
| Logs body | `bg-zinc-950/50 rounded-lg border-white/[0.04] font-mono text-[11px]` | — | igual |
| Scrollbar (isla) | thumb `bg-zinc-700 rounded-full` 6px (`index.css`) | zinc-700 `#3f3f46` | scoped en `tokens.css` |

**Sombras custom** (Tailwind v3 `tailwind.config.js`; v4 del portfolio no las tiene). Declarar en `tokens.css` bajo `.ro-demo`:

```css
.ro-demo {
  color-scheme: dark;
  background-color: #09090b;
  background-image:
    radial-gradient(ellipse 80% 50% at 50% -20%, rgb(245 158 11 / 0.08), transparent),
    radial-gradient(ellipse 60% 40% at 100% 100%, rgb(245 158 11 / 0.04), transparent);
}
.ro-demo .ro-shadow-glass {
  box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.05), 0 8px 24px -12px rgb(0 0 0 / 0.7);
}
.ro-demo .ro-shadow-glow-amber {
  box-shadow: 0 0 20px -6px rgb(245 158 11 / 0.3);
}
.ro-demo .ro-shadow-glow-emerald {
  box-shadow: 0 0 20px -6px rgb(16 185 129 / 0.3);
}
.ro-demo .ro-shadow-glow-red {
  box-shadow: 0 0 20px -6px rgb(239 68 68 / 0.3);
}
```

En `classes.ts` usar `ro-shadow-glass` / `ro-shadow-glow-amber` (etc.), **no** `shadow-glass` (no existe en el portfolio).

**Prohibido fuera de `src/components/ro-launcher-demo/`:** `amber-`, `zinc-`, `emerald-`, `sky-`, `backdrop-blur`, `bg-gradient`, `rounded-xl`, `rounded-full` (salvo el skip-link existente). **Dentro** del folder, esos patrones son **obligatorios** (fieles a la app).

**Prohibido dentro de la isla:** tokens Graphite `bg-card`, `bg-background`, `text-foreground`, `text-muted`, `text-accent`, `border-border`, `border-border-strong`, `ring-accent`. Acceptance grep §9.

Radios: paneles `rounded-xl`; wells/cards `rounded-lg`; toggles y dots `rounded-full`. No `rounded-md` Graphite en el chrome de la isla.

Motion: `duration-150` / `duration-200` / progress `duration-500` como `LaunchButton`. `prefers-reduced-motion` global del sitio ya anula transiciones. Reduced-motion: Preparar salta a `ready` en un tick (sin barra).

Tipografía: heredar Inter. No Lucide. Tabs Combate/Buffs: texto + SVG inline 14×14 en `chrome/DemoIcons.tsx` (paths simples swords/sparkles; no añadir `lucide-react`).

---

## 3. Compact vs full (centro incluido en v1)

`RoLauncherDemo` sigue con `variant: 'compact' | 'full'`.

Ambas variantes usan el **mismo grid** con container query para no mentir el layout en el spotlight estrecho:

```
root: class="ro-demo @container …"
body: class="grid grid-cols-1 @min-[40rem]:grid-cols-[minmax(220px,300px)_1fr] gap-3 p-3"
combat: class="grid grid-cols-1 @min-[28rem]:grid-cols-2 gap-2.5 h-full min-h-[12rem]"
```

| Superficie | variant | Rail | Centro (tabs + AutoPot/Spammer/AutoBuff) | Herramientas | Logs | Rearmar |
| --- | --- | --- | --- | --- | --- | --- |
| Home spotlight | `compact` | sí | **sí (P0 / Vicente)** | no | no | no |
| Caso `#demo` | `full` | sí | **sí** | sí | sí | sí |

Compact `min-h-[28rem]` (ya no 22rem: hay centro). `max-h-[36rem] overflow-y-auto` en el body compacto para que el spotlight no explote. Full: sin max-height; el caso da ancho.

**Ancho del caso:** `src/pages/projects/nndsk-ro-launcher.astro` hoy `article.max-w-3xl` (~48rem) aplasta 2 columnas + 3 tool cards.

Cambio cerrado:

```astro
<article class="max-w-5xl mx-auto">
  <div class="max-w-3xl">  <!-- h1, lead, CTAs mobile, Problema…Links -->
  <div id="demo" class="mt-8">  <!-- isla full, usa los 5xl -->
```

El bloque `#demo` **no** va dentro de `max-w-3xl`. Prosa (Problema, Enfoque, Técnico, Stack, galería, Links) sí. JSON-LD / CTAs P1 intactos.

Figcaption (reemplaza el texto Graphite actual):

`Tema de RO-Launcher (zinc / ámbar / glass). El resto de la página sigue Dark Graphite. No lanza Ragnarok Online.`

Rótulo sobre la isla (sin cambio de sentido):

`Demo de la UI. No lanza Ragnarok Online ni instala Wine/Proton.`

---

## 4. Web vs nativo (honestidad)

| Superficie | Clase | v1 |
| --- | --- | --- |
| Chrome, grid, tabs, radios, select runner | Pure web | Incluir |
| Preparar entorno + pasos `setup.rs` | Mock timers | Incluir. Logs `[demo]`. Botón `Configurando...`. Barra → 100%. |
| Jugar | Tauri `launch_game` | **No simular cliente.** Notice + log. No `ingame`. No PID. |
| AutoPot / AutoBuff / Spammer **controles** | En app: requieren `isRunning` + memoria/evdev | **Tras prefix `ready`, usables en demo** (P0). Copy honesta `Demo — sin cliente real`. HP/SP **estáticos** de fixture, no un live-feed. Logs `[demo]` al toggle. |
| Memory scanner «Encontrar», perfiles 4RTools | Tauri | Pintar fila Perfil `Auto` disabled. Botón Encontrar disabled `title="No disponible en demo"`. |
| OpenSetup / Patcher / dgVoodoo Abrir·Instalar | Tauri | Disabled + `title="No disponible en demo"`. |
| Rearmar | Tauri `reset_prefix` | Noop demo cuando `ready` (§6.E). |
| GearSwitch, QWERTY spammer, alta de servers, Discord, LoadingScreen, LaunchFieldsModal, ActiveClients | — | Fuera de v1. |

**Unlock (cerrado, P0):** `toolsReady = getPrefixState(...) === 'ready'`. **No** depende de Jugar. Jugar no habilita ni deshabilita tools. Cambiar servidor/runner a un prefix `pending` vuelve a lockear tools (opacity-60, toggles disabled, barras vacías).

Antes de `ready`, status de tools: `Prepara el entorno` (no `Inicia el juego`: en el sitio Prepare es el unlock, Play no lanza).

---

## 5. Árbol de archivos (Composer crea / mueve)

Directorio actual plano → este árbol. **Mover** (git mv) los TSX existentes; no duplicar. `RoLauncherDemo.tsx` queda thin: reducer + compose.

```
src/components/ro-launcher-demo/
  RoLauncherDemo.tsx              # root island. import './tokens.css'
  tokens.css                      # NUEVO. .ro-demo radiales + sombras + scrollbar 6px
  types.ts                        # + campos P0 (ver §6)
  mockData.ts                     # fixtures intactos + DEMO_HP/SP
  demo.logic.ts                   # + toolsReady, prepare hold 100%, resetPrefix, tool actions
  chrome/
    classes.ts                    # MOVE + reescribir a zinc/ámbar (era classes.ts Graphite)
    DemoHeader.tsx                # MOVE; «RO» ámbar / «-Launcher» zinc / derecha Demo
    DemoPanel.tsx                 # NUEVO (extraer de DemoHeader.tsx)
    DemoToggle.tsx                # NUEVO (eliminar los 3 DemoSwitch locales)
    DemoIcons.tsx                 # NUEVO; SVG inline swords + sparkles 14px
  rail/
    DemoServerList.tsx            # MOVE
    DemoRunnerPanel.tsx           # MOVE
    DemoAdvanced.tsx              # MOVE
    DemoLaunchBar.tsx             # MOVE
    DemoResetButton.tsx           # MOVE; ya no forever-disabled mudo
  center/
    DemoToolsPanel.tsx            # MOVE; scroll interno P1
    DemoToolTabs.tsx              # MOVE
    DemoAutopot.tsx               # MOVE; P0 usable
    DemoSpammer.tsx               # MOVE; P0 usable
    DemoAutobuff.tsx              # MOVE; P0 usable
  logs/
    DemoLogs.tsx                  # MOVE; tabs Juego / Tools
```

Imports `@/components/ro-launcher-demo/...` o relativos. Pages **no cambian el path del root**: siguen importando `RoLauncherDemo.tsx`.

**No crear** `RoLauncherDemoIsland.astro`. Hydration igual que ahora: caso `client:load`, spotlight `client:visible`.

**No tocar** `package.json` / lockfile / `astro.config.mjs` (React ya está). No Lucide, no Zustand, no `@tauri-apps/*`.

---

## 6. Estado, copy y flujos (cerrados)

### 6.1 State extra (añadir a `types.ts` / `initialDemoState`)

Campos actuales se quedan. Añadir:

```ts
export interface DemoState {
  // ...existentes
  logChannel: 'game' | 'tools';
  autopotEnabled: boolean;
  autopotProactive: boolean;
  autopotHpKey: 'F8'; // default; el tipo real es las POT_KEYS
  autopotSpKey: 'F9';
  autopotHpPercent: 80;
  autopotSpPercent: 50;
  autopotDelayMs: 100; // min 10 max 200 como AutopotPanel
  spammerEnabled: boolean;
  spammerDelayMs: 16; // clamp 16–50
  autobuffEnabled: boolean;
  autobuffRules: { id: string; label: string; key: string; enabled: boolean }[];
}
```

Defaults (copiar `src/shared/constants.ts` del launcher):

- AutoPot: enabled false, hpKey `F8`, spKey `F9`, hpPercent 80, spPercent 50, delayMs 100, proactive false.
- Spammer: enabled false, delayMs 16, keys `['F1']`.
- AutoBuff rules (2, no Blessing/Agi Up):

  1. `{ id: 'rule-conc', label: 'Concentration Potion', key: 'F1', enabled: true }`
  2. `{ id: 'rule-awak', label: 'Awakening Potion', key: 'F2', enabled: true }`

  (presets reales de `AutobuffRulesEditor.tsx`, grupo Potions).

HP/SP demo (solo pintar si `toolsReady`):

```ts
export const DEMO_VITALS = { hpCur: 1840, hpMax: 2000, spCur: 420, spMax: 600 };
```

Estáticos. **Prohibido** setInterval que baje HP (pareceria cliente vivo).

Acciones nuevas: `toggleAutopot`, `toggleAutopotProactive`, `setAutopotField`, `toggleSpammer`, `setSpammerDelay`, `toggleAutobuff`, `toggleAutobuffRule`, `setAutobuffRuleKey`, `setLogChannel`, `resetPrefix`.

`toolsReady(state)` = `getPrefixState(state, server) === 'ready'`.

Al `selectServer` / `setRunner`: no resetear config de tools (se conserva); el lock es solo visual/disabled vía `toolsReady`.

Al `resetPrefix`: prefix de la key actual → borrar del map (pending), `autopotEnabled/spammerEnabled/autobuffEnabled` → false, `playNotice` null, log tools+game.

### 6.2 Flujo A — servidor / Gepard (igual que el plan previo)

Tres radios. Banners y mismatch **con clases ámbar**, no Graphite muted.

### 6.3 Flujo B — Preparar (P1 100% + Configurando…)

Pasos **exactos** (omitir WebView2; los fixtures no lo piden), de `src-tauri/src/tools/prefix/setup.rs`:

| step | % |
| --- | --- |
| Creando entorno aislado... | 40 |
| Inicializando entorno... | 45 |
| Preparando Wine Gecko... | 50 |
| Preparando gráficos... | 55 |
| Instalando vcredist_2019... | 65 |
| Instalando d3dx9... | 75 |
| Instalando corefonts... | 88 |
| Configurando audio... | 96 |
| ¡Listo! | 100 |

Reglas cerradas:

1. Durante **todo** `prefix === 'preparing'`, incluyendo el frame de 100%, el botón muestra exactamente `Configurando...` (copy de `LaunchButton.tsx` status `'setting-up'`). Disabled.
2. Variante del botón en preparing: `btnSecondary` (como `buildMode` de la app). Idle pendiente: secondary «Preparar entorno». Idle ready: `btnPrimary` «Jugar».
3. La barra permanece visible con `¡Listo!` y `100%` **350ms** (un tick más). **No** llamar `prepareDone` en el mismo tick que se pinta 100%.
4. Tras `prepareDone`: `progress: null`, botón `Jugar`, `toolsReady === true`.
5. Primera línea de log game: `[demo] Simulación — no descarga Proton ni escribe un WINEPREFIX.` Cada paso: `[demo] <step>`.
6. Reduced-motion: `prepareInstant` → ready inmediato, logs intro + `[demo] ¡Listo!`, sin barra. Tools unlock igual.

### 6.4 Flujo C — Jugar (sin cambio de honestidad)

Click Jugar: log `[demo] Jugar no está disponible en el sitio. RO-Launcher es una app de escritorio Linux.` + `role="status"` `Solo demo — el sitio no lanza el cliente.` No `Iniciando...`. No HP vivo extra. Tools **siguen** usables si ya estaban `ready`.

### 6.5 Flujo D — centro usable (P0) **must-fix**

Cuando `!toolsReady`: paneles tone idle (`opacity-60`), toggles disabled, barras `— / —` dashed, selects/slider disabled, status `Prepara el entorno`. Tabs Combate/Buffs **sí** cambian (puro UI). Keychips Spammer: se pueden marcar siempre (como ahora) **o** lockearlos hasta ready — **cerrado: keychips y delay también locked hasta ready**, para que el gesto «Preparar → usar tools» sea el demo. (Antes los keychips andaban con tools dead; eso confundía.)

Cuando `toolsReady`:

**AutoPot**

- Status línea 1: nombre del servidor.
- Status línea 2: toggle off → `Demo — sin cliente real`; on → `Simulado`.
- Toggle emerald funciona. Log tools: `[demo] AutoPot simulado. No lee memoria ni envía teclas.`
- Barras HP/SP con `DEMO_VITALS` y gradientes red/sky + texto `1840 / 2000 (92%)` y `420 / 600 (70%)`.
- Modo proactivo: toggle ámbar usable. No log extra.
- Slider Lectura 10–200 usable, muestra `{n}ms`.
- Selects HP/SP: options = `F1–F9` + `0–9` (`POT_KEYS`). Defaults F8/F9.
- Inputs % HP/SP 1–99.
- Fila «Perfil de memoria» select `Auto` disabled. «Encontrar» disabled `title="No disponible en demo"`.
- Hint bajo el panel (siempre, `text-zinc-600`): `Valores de demostración. No hay cliente.`

**Spammer**

- Línea 1 off: `Inactivo`; on: `Standby — {keys}` (formato de `SpammerPanel.tsx`).
- Línea 2: `Demo — sin cliente real`.
- Toggle ámbar. Disabled si `spammerKeys.length === 0`. Log: `[demo] Spammer simulado. No inyecta input (evdev/ydotool).`
- Keychips F1–F9 y 0–9 togglables; no permitir array vacío (igual que el reducer actual).
- Delay slider 16–50, `accent-amber-500`, label `Delay` + `{n}ms`.
- **No** GearSwitch. **No** ciclos incrementando.

**AutoBuff**

- Línea 1: `Sin buffs aplicados` (no fingir `lastAppliedRule`).
- Línea 2: `Demo — sin cliente real`.
- Toggle emerald. Disabled si ninguna regla `enabled`. Log: `[demo] AutoBuff simulado. No lee estados ni envía teclas.`
- Cada regla: checkbox (o click en row) + select de tecla `POT_KEYS`. Usable.
- Hint de la app: `Activa cada buff y asigna la tecla donde lo tienes configurado en el juego.`
- Sin botón «Nuevo buff».

**Tabs:** `role="tablist"`; activo con clases ámbar de `ToolViewTabs.tsx`. SVG inline opcional a la izquierda del label.

### 6.6 Flujo E — Rearmar (P1)

`full` only.

| Prefix | Botón | Helper visible (`text-[10px] text-zinc-600` debajo) |
| --- | --- | --- |
| `pending` / `preparing` | disabled, label `Rearmar entorno` | `Disponible cuando el entorno está listo.` |
| `ready` | enabled, `btnSecondary` | `Simulación: vuelve este perfil a pendiente. No borra un prefix real.` |

Click en `ready`: dispatch `resetPrefix`. Log game: `[demo] Rearmar simulado — no borra un WINEPREFIX.` Prefix pending, tools lock, botón launch vuelve a `Preparar entorno`. **Sin** `window.confirm` (el helper ya es el aviso; un confirm nativo en un portfolio se siente roto).

`title` del botón disabled: el mismo helper. No `title="No disponible en demo"`.

### 6.7 Flujo F — Herramientas (P1 truncate + scroll)

Panel `full` only. Cuerpo:

```
className="max-h-40 overflow-x-auto overflow-y-auto"
inner grid: className="grid grid-cols-3 gap-2 min-w-[28rem]"
```

Cada card: `min-w-0`. Label `shrink-0`. Detail `truncate font-mono text-[10px] text-zinc-600` + `title={fullString}` (p.ej. `HoneyRO Patcher.exe`). Diagnósticos **dentro del mismo scroll**, warnings `leading-snug` wrap, `text-amber-400/80`. Botones Abrir/Config/Instalar disabled `title="No disponible en demo"`.

Dots: found/configured → ok; else neutral.

### 6.8 Logs (`full`)

Tabs `Juego` | `Tools` (clases de `LogPanels.tsx`). Empty: Juego `Wine / setup / lanzamiento...`; Tools `AutoPot / PID / memoria...`. Prepare/Jugar/Rearmar → canal game. Toggles de tools → canal tools. Limpiar limpia el canal activo. Auto-scroll al último. Prefijo `[demo]` en **todas** las líneas mock.

---

## 7. Qué cambiar en el `RoLauncherDemo` actual

No un rewrite ciego. Diff conceptual:

1. `import './tokens.css'`. Root `className={`ro-demo @container ${demoChrome}`}` — `demoChrome` ya no Graphite: `rounded-xl border border-white/[0.06] overflow-hidden bg-zinc-950 ro-shadow-glass`.
2. Extraer `DemoRail` a no ser necesario como file; puede quedarse función local en el root o `rail/DemoRail.tsx` si el root pasa de ~160 líneas.
3. Compact: **montar** `DemoToolTabs` + combat/buffs. Hoy el branch compact solo pinta `DemoRail`.
4. Grid container-query §3 (hoy `md:grid-cols-[minmax(240px,280px)_1fr]` viewport, no container — en spotlight md el viewport es ancho y el island es estrecho: 2 col aplastadas).
5. Pasar `toolsReady` a AutoPot/Spammer/AutoBuff/Reset.
6. `DemoHeader`: partir «RO» / «-Launcher»; quitar `text-foreground`.
7. Borrar `DemoSwitch` locales; usar `DemoToggle`.
8. `classes.ts` reescrito; grep Graphite debe quedar vacío en el folder.
9. Caso Astro: figcaption nueva; `#demo` a `max-w-5xl`; prosa `max-w-3xl`.
10. Spotlight: quitar `min-h-[22rem]` fijo o subirlo; el compact trae centro (`min-h-[28rem]`). `p-3` se queda. Noscript intacto.
11. Defaults AutoPot F8/F9, Spammer delay 16, reglas Concentration/Awakening.

`ProjectSpotlight.astro` y la page **siguen** importando el mismo `RoLauncherDemo.tsx`.

---

## 8. Orden de implementación

1. Crear folders `chrome/ rail/ center/ logs/`. `git mv` los TSX. Extraer `DemoPanel`, `DemoToggle`, `DemoIcons`. Fix imports.
2. Añadir `tokens.css`. Reescribir `chrome/classes.ts`. Restylear Header, Panel, ServerList, Runner, Advanced, LaunchBar.
3. State + reducer P0/P1 (`demo.logic.ts`, `types.ts`). Hold 100%. `resetPrefix`. Tool actions.
4. `DemoAutopot` / `DemoSpammer` / `DemoAutobuff` usables. `DemoToolsPanel` scroll. `DemoResetButton` helper/noop. `DemoLogs` dos canales.
5. `RoLauncherDemo.tsx` compose compact+full con centro.
6. Page caso: ancho 5xl + figcaption. Spotlight: min-height.
7. `bun run format && bun run lint && bun run format:check && bun run check && bun run build`.

---

## 9. Acceptance checklist (must-fix en el mismo pass)

Composer no cierra el PR de implementación hasta marcar todo.

### Build

- [ ] Branch basado en PR #2.
- [ ] Sin deps nuevas.
- [ ] `bun run format && bun run lint && bun run format:check && bun run check && bun run build` verdes.
- [ ] Grep en `src/components/ro-launcher-demo` **sin** `bg-card`, `text-foreground`, `text-muted`, `text-accent`, `border-border`, `bg-background`, `ring-accent` (Graphite).
- [ ] Grep en `src/components/ro-launcher-demo` **con** `text-amber-400`, `bg-zinc-950`, `ro-shadow-glass`.
- [ ] Grep en `src/` fuera de `ro-launcher-demo` **sin** `amber-` / `zinc-` nuevos.
- [ ] `global.css` `@theme` Graphite intacto.
- [ ] Sin `@tauri-apps`, `lucide`, `zustand`, `invoke(`.
- [ ] Árbol §5 (no un solo TSX gigante; no 17 files planos).

### Vicente — tema

- [ ] Widget: fondo `#09090b` + radiales ámbar, paneles glass `rounded-xl`, «RO» ámbar / «-Launcher» zinc.
- [ ] Página alrededor (Header, h1 del caso, Trabajos, Footer): Graphite sin ámbar.
- [ ] Figcaption declara los dos temas.

### Vicente — centro

- [ ] Caso `full`: rail | (Herramientas + tabs + AutoPot/Spammer o AutoBuff + Logs).
- [ ] Home `compact`: rail + tabs + AutoPot/Spammer o AutoBuff (centro visible sin abrir el caso).
- [ ] Tabs Combate/Buffs cambian el panel en compact y full.

### P0 — tools usables tras Preparar

- [ ] Antes de Preparar: toggles disabled, status `Prepara el entorno`, barras vacías.
- [ ] Tras Preparar → ready (barra llegó a 100% y desapareció): AutoPot toggle enciende, barras muestran 1840/2000 y 420/600, selects HP/SP y % funcionan, modo proactivo funciona.
- [ ] Spammer toggle enciende, keychips y delay 16–50 funcionan, status `Standby — …`.
- [ ] AutoBuff toggle enciende, reglas Concentration Potion / Awakening Potion check+tecla funcionan.
- [ ] Cada toggle appende log `[demo] …` en canal Tools (visible en `full`).
- [ ] Jugar **no** es el unlock. Jugar sigue mostrando el notice y **no** lanza RO.
- [ ] Cambiar a un servidor cuyo prefix no está ready vuelve a lockear tools.
- [ ] Reduced-motion: Preparar instantáneo también unlockea tools.
- [ ] Ningún string `Iniciando...`, `En juego`, PID, HP animado “live”.

### P1 — Configurando… + 100%

- [ ] Click Preparar: botón pasa a `Configurando...` (no se queda en Preparar ni salta a Jugar antes de 100%).
- [ ] La barra pinta 40 → … → 96 → **100** con copy de paso `¡Listo!` visible ≥350ms.
- [ ] Recién entonces el botón es `Jugar` y la barra se oculta.

### P1 — Herramientas

- [ ] Labels/detalle (`HoneyRO Patcher.exe`, banners Gepard largos) truncan con `title` del texto completo.
- [ ] El cuerpo del panel scrollea (`max-h-40 overflow-x-auto overflow-y-auto`); no recorta sin recurso.
- [ ] Abrir/Instalar/Config siguen disabled con `title="No disponible en demo"`.

### P1 — Rearmar

- [ ] Pending: disabled + helper visible `Disponible cuando el entorno está listo.`
- [ ] Ready: enabled + helper `Simulación: vuelve este perfil a pendiente. No borra un prefix real.`
- [ ] Click: vuelve a Preparar, tools locked, log `[demo] Rearmar simulado — no borra un WINEPREFIX.`

### P2 — focus/contraste

- [ ] Cubierto por tokens ámbar: `focus-visible:ring-2 focus-visible:ring-amber-500/40` en radios, select, CTA, tabs, toggles, keychips.
- [ ] Contraste del widget: zinc-100 sobre zinc-950; ámbar-400 en título (no usar amber-500/10 como único texto).
- [ ] No hace falta un pass Graphite de focus dentro de la isla.

### Honestidad / a11y

- [ ] Rótulo demo visible sin hover.
- [ ] `role="region"` `aria-label="Demo de RO-Launcher"`.
- [ ] `lang` del documento `es-CL`.
- [ ] Sin JS: noscript `rolauncher1.png`.
- [ ] `rolauncher2.png` sigue bajo Stack.
- [ ] EcoRetirosRM / Mercado House intactos.

### Browser (Composer)

- [ ] Home `/#work` ~1280 y ~375: compacta usable, centro visible, Preparar → tools.
- [ ] Caso `/projects/nndsk-ro-launcher/` ~1280: 2 columnas rail+centro; ~375: stack. Flujo B+C+D+E+F.

---

## 10. Fuera de v1

- Modo `ingame`, rail 64px, ActiveClients, Detener, HP/SP live, scanner, GearSwitch, QWERTY, alta de servers, Discord, LoadingScreen, LaunchFieldsModal, persistencia, i18n, tests runner, embed AppImage.
- Compartir código con el repo launcher.
- Añadir ámbar al `@theme` global.

---

## 11. AMBIGUITIES

Ninguna. Cerrado con evidencia de `nndsk-ro-launcher` @ `main` y del island Graphite en PR #2.

Decisiones Vicente que este plan fija (no reabrir):

1. **Colores reales en el widget**, Graphite en la página.
2. **Centro (AutoPot / AutoBuff / Spammer) en v1**, compact y full.
3. **Árbol §5**, no un componente gigante ni 17 files planos.
4. **P0:** tools usables tras Preparar → ready (demo), no eternamente disabled, no fingir cliente.
5. **P1:** 100% + `Configurando...`; Herramientas truncate+scroll; Rearmar helper o noop.
6. **P2:** focus/contraste = tokens de la app, no Graphite.
