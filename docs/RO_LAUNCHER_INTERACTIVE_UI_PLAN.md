# Plan de implementación: demo interactiva de nndsk-ro-launcher

**Rol de este documento:** especificación cerrada para un implementer (Composer 2.5). Cero juicio de diseño o arquitectura. Si un paso no está aquí, no se hace.

**Fase actual:** solo plan. Este PR no cambia UI, no añade React, no toca capturas.

**Repos**

- Portfolio (target): `Nandem1/nndsk-portfolio-astro` · live `https://nndsk.dev` · stack Astro 6 estático + Tailwind v4 + bun 1.3.9.
- Launcher (fuente de verdad de la UI): `Nandem1/nndsk-ro-launcher` @ `main` auditado 2026-09-17 · Tauri v2 + React 18 + Rust · Vite + Tailwind v3 · Zustand · Lucide. Ventana fija 1280×820, `backgroundColor: #09090b`.

**Producción:** no mergear a `main`, no desplegar.

**Cita de Vicente (objetivo):** que la UI se pudiera usar en vez de usar la foto.

**Protocolo del implementer**

1. Leer este archivo entero antes de tocar código.
2. **Rebase obligatorio** sobre el branch de PR #2 (`cursor/ro-launcher-featured-plan-cef7`) o sobre `main` si #2 ya mergió. No reimplementar spotlight / caso de estudio desde `main` actual: `main` todavía no tiene `ProjectSpotlight.astro` ni `/projects/nndsk-ro-launcher/`.
3. Ejecutar la lista archivo-a-archivo de la sección 7 en ese orden.
4. No improvisar colores, radios, motion, copy, servidores ficticios, ni flujos extra.
5. No tocar Mercado House (Go/Gin), Hero, Bio, EcoRetirosRM, gisan, hyprtask.
6. No copiar el tema zinc/ámbar/glass del launcher al portfolio.
7. Nunca afirmar que el sitio lanza Ragnarok Online, Wine, Proton, ni el cliente.

---

## 0. Cómo se apoya en PR #2

PR #2 (`https://github.com/Nandem1/nndsk-portfolio-astro/pull/2`, branch `cursor/ro-launcher-featured-plan-cef7`) ya entrega:

- Home: `ProjectSpotlight.astro` con captura `rolauncher1.png` a la izquierda (el `<a>` envuelve la foto y navega al caso).
- Caso: `src/pages/projects/nndsk-ro-launcher.astro` con hero `rolauncher1.png` + galería `rolauncher2.png`.
- Copy SEO, chips, Runtime / Herramientas, CTAs P1.
- Schema: `spotlight`, `caseStudyPath`.
- Copy actual del caso: «UI del launcher. Sin Live: es una app de escritorio.» y «Código en GitHub. No hay demo web.»

Este plan **no reemplaza** ese PR. Lo extiende:

| Superficie PR #2                  | v1 de este plan                                                                                          |
| --------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Spotlight: foto clicable → caso   | Quitar el `<a>` que envuelve la foto. Meter isla compacta usable. CTAs de la columna derecha no cambian. |
| Caso: hero foto `rolauncher1.png` | Reemplazar el `<figure>` hero por isla `full`.                                                           |
| Caso: galería `rolauncher2.png`   | **Conservar.** Es la app sobre el cliente; no se puede simular en el browser.                            |
| «No hay demo web.»                | Reescribir (sección 7.6).                                                                                |
| Archivos de capturas              | No borrar. Fallback noscript + prueba in-game.                                                           |

Si #2 no está mergido al implementar: `git fetch origin cursor/ro-launcher-featured-plan-cef7 && git rebase origin/cursor/ro-launcher-featured-plan-cef7`. Resolver conflictos a favor de este plan en los puntos de foto/copy listados arriba; no revertir P1 UX de CTAs.

---

## 1. Auditoría del frontend del launcher

No hay router. Una sola vista React: `src/app/App.tsx` montada desde `src/main.tsx`. Modos `prep` | `ingame` (`src/app/uiMode.store.ts`). Vista de tools `combat` | `buffs`.

### 1.1 Mapa de archivos (fuente de verdad)

| Superficie    | Path                                                                                      | Qué pinta                                                                                                                                                                                             |
| ------------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Shell         | `src/app/App.tsx`                                                                         | Grid `railWidth × 1fr`, gap 12px, padding 12px. Rail 300px (prep / peek) o 64px (ingame colapsado).                                                                                                   |
| Header        | `src/app/AppHeader.tsx`                                                                   | Título `RO-Launcher` (RO ámbar / resto zinc). Subtítulo `Ragnarok Online · Linux`. Chip «En juego» o «Developed by: nndsk».                                                                           |
| Loading       | `src/app/LoadingScreen.tsx`                                                               | Hasta que `useAppInit` termina. Init llama Tauri.                                                                                                                                                     |
| Servidores    | `src/features/servers/ServerList.tsx`                                                     | Panel «Servidor», radio, + / lápiz / X.                                                                                                                                                               |
| Alta/edición  | `src/features/servers/AddServerModal.tsx`, `EditServerModal.tsx`, `ServerConfigModal.tsx` | Dialog nativo `plugin-dialog` para `.exe`.                                                                                                                                                            |
| Runner        | `src/features/settings/RunnerSelector.tsx`                                                | Panel «Runner predeterminado», `DarkSelect`, nota de runner efectivo del servidor.                                                                                                                    |
| Avanzado      | `src/features/settings/AdvancedSettings.tsx`                                              | Dots: Runner, Audio, Entorno, DXVK, Permisos input, uinput.                                                                                                                                           |
| Discord RP    | `src/features/settings/DiscordPresenceToggle.tsx`                                         | Toggle + persistencia Tauri.                                                                                                                                                                          |
| Rearmar       | `src/features/settings/PrefixResetButton.tsx`                                             | `confirm()` + `reset_prefix`.                                                                                                                                                                         |
| Lanzar        | `src/features/launcher/LaunchButton.tsx`                                                  | Idle: «Preparar entorno» / «Jugar» / «Abrir otro cliente» / «Revisar entorno». Busy: «Comprobando...» / «Configurando...» / «Iniciando...». Error: «Reintentar». Barra de `%` + `setupProgress.step`. |
| Campos launch | `src/features/launcher/LaunchFieldsModal.tsx`                                             | Placeholders de argv.                                                                                                                                                                                 |
| Clientes      | `src/features/launcher/ActiveClients.tsx`                                                 | Lista PID; vacío = no render.                                                                                                                                                                         |
| Rail ingame   | `src/features/launcher/IngameRail.tsx`                                                    | Avatar inicial + stop.                                                                                                                                                                                |
| Herramientas  | `src/features/servers/ServerToolsPanel.tsx`                                               | OpenSetup, Patcher, dgVoodoo + diagnósticos PE/Gepard.                                                                                                                                                |
| Tabs          | `src/app/ToolViewTabs.tsx`                                                                | Combate / Buffs.                                                                                                                                                                                      |
| AutoPot       | `src/features/autopot/AutopotPanel.tsx`                                                   | Barras HP/SP, teclas, umbrales, scanner de memoria.                                                                                                                                                   |
| Spammer       | `src/features/spammer/SpammerPanel.tsx` + `SpammerKeyboard.tsx`                           | Teclado F1–F9 / 0–9, delay, gear switch.                                                                                                                                                              |
| AutoBuff      | `src/features/autobuff/AutobuffPanel.tsx`                                                 | Reglas + toggle.                                                                                                                                                                                      |
| Logs          | `src/features/logs/LogPanels.tsx`                                                         | Tabs Juego / Tools.                                                                                                                                                                                   |
| UI kit        | `src/shared/ui/{Button,Panel,DarkSelect,ToggleSwitch,StatusDot,Checkbox}.tsx`             | Ámbar + glass. **No reutilizar.**                                                                                                                                                                     |
| API           | `src/shared/api.ts`                                                                       | Todo es `invoke()` Tauri.                                                                                                                                                                             |
| Tipos         | `src/shared/types.ts`                                                                     | Contratos.                                                                                                                                                                                            |
| Gepard        | `src-tauri/src/tools/server_tools/gepard.rs`                                              | Matriz SHA-256 → perfil.                                                                                                                                                                              |
| Scan PE       | `src-tauri/src/tools/server_tools/pe.rs`                                                  | Warnings de Gepard en `diagnostics.warnings` (esto **sí** se pinta en Herramientas).                                                                                                                  |
| Setup         | `src-tauri/src/tools/prefix/setup.rs`                                                     | Textos de progreso.                                                                                                                                                                                   |
| Estilos app   | `src/index.css` + `tailwind.config.js`                                                    | zinc-950, ámbar, `shadow-glass`, glows, radial gradients. **Prohibido en el portfolio.**                                                                                                              |

Captura de portfolio `rolauncher1.png` (layout real, HoneyRO seleccionado, AutoPot activo, Spammer F1, logs Wine): confirma el grid rail-izquierda / tools+combat+logs-derecha. El código actual es más nuevo que la foto en un punto: `ToolViewTabs` (Combate | Buffs) existe en `App.tsx` y no aparece en la foto. **Seguir el código, no la foto**, para las tabs.

### 1.2 Tema real vs tema del portfolio

El launcher **no** es Dark Graphite. Es zinc + ámbar + glass + glow + gradientes (Tailwind v3). El portfolio tiene paleta cerrada y prohíbe Nord/glass/gradientes AI (`docs/DARK_GRAPHITE_PLAN.md` §§2.3–2.6).

**Decisión:** la demo es **fiel en estructura y copy en español**, restyleada a Graphite. Un rótulo permanente lo declara. No pixel-match ámbar.

### 1.3 Clasificación v1 (web / mock / Tauri)

| Superficie                                           | Clase                                     | v1                                                                                                                                                                                                                                                                                                           |
| ---------------------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Header, layout 2 columnas, paneles                   | Pure web                                  | Incluir                                                                                                                                                                                                                                                                                                      |
| Lista de servidores + seleccionar                    | Mock data                                 | Incluir (3 fixtures; sin + / editar / borrar)                                                                                                                                                                                                                                                                |
| Recomendación Gepard al cambiar servidor             | Mock (matriz del README / `gepard.rs`)    | Incluir. Banner bajo el runner. La app real lo muestra en `diagnostics.warnings` de Herramientas (`pe.rs` L105–123); `checks[]` de `check_dependencies` **no** se pinta en React. La demo lo hace visible en Runner **y** en Herramientas para que el flujo «elegir servidor → ver recomendación» se sienta. |
| Dropdown de runners                                  | Mock                                      | Incluir. Cambiar runner de un servidor ya «preparado» vuelve el prefix a pendiente (aislado).                                                                                                                                                                                                                |
| Avanzado (dots)                                      | Mock por servidor                         | Incluir 4 líneas: Runner, Entorno, DXVK, Gepard. Omitir Audio / input / uinput (host Linux real).                                                                                                                                                                                                            |
| Preparar entorno + barra de pasos                    | Mock timers + textos reales de `setup.rs` | Incluir. Prefijo de log `[demo]`.                                                                                                                                                                                                                                                                            |
| Jugar / Iniciando / clientes / Detener               | Tauri `launch_game` / `stop_game`         | **No simular un cliente corriendo.** Click en Jugar → aviso honesto + línea de log. No entrar a modo `ingame`. No HP/SP vivos.                                                                                                                                                                               |
| OpenSetup / Patcher / dgVoodoo Abrir·Instalar        | Tauri                                     | Pintar estado mock. Botones disabled + `title="No disponible en demo"`.                                                                                                                                                                                                                                      |
| AutoPot / Spammer / AutoBuff toggles, scanner, evdev | Tauri + sidecars                          | Pintar layout. Toggles y teclas **disabled**. Copy de la app: «Inicia el juego». Tab switch Combate/Buffs **sí** funciona (puro UI). Spammer: teclas F1–0 se pueden marcar visualmente (estado local) porque no invocan input; el toggle del panel sigue disabled.                                           |
| Rearmar entorno                                      | Tauri + `confirm`                         | Botón visible, disabled, `title="No disponible en demo"`.                                                                                                                                                                                                                                                    |
| Discord Rich Presence                                | Tauri                                     | Excluir (no está en el rail de la captura principal; no aporta el flujo v1).                                                                                                                                                                                                                                 |
| Add/Edit server, file picker                         | Tauri dialog                              | Excluir. Sin `+` / lápiz / X.                                                                                                                                                                                                                                                                                |
| LoadingScreen / show_main_window / storage notices   | Tauri                                     | Excluir. La isla hidrata en estado `ready`.                                                                                                                                                                                                                                                                  |
| LaunchFieldsModal                                    | Condicional a placeholders                | Excluir. Fixtures sin placeholders.                                                                                                                                                                                                                                                                          |
| IngameRail / ActiveClients / multi-client            | Requiere proceso                          | Excluir.                                                                                                                                                                                                                                                                                                     |
| Memory scanner, AutoPot live, logs DXGI reales       | Nativo                                    | Excluir. Logs solo de la simulación de Preparar y del click Jugar.                                                                                                                                                                                                                                           |

---

## 2. Arquitectura elegida

### Elegida: isla React simplificada, solo en el portfolio

Una isla `RoLauncherDemo` con `variant: 'compact' | 'full'`. Mock data y reducer locales. Cero `@tauri-apps/*`, cero Zustand, cero Lucide, cero imports del repo launcher.

**Hydration**

- Spotlight (home, below the fold): `client:visible`.
- Caso (hero, above the fold): `client:load`.
- **No** `client:only`. SSR del estado inicial (HoneyRO seleccionado, entorno pendiente, botón «Preparar entorno») para que sin JS se vea el chrome estático; `noscript` muestra `rolauncher1.png`.

**Por qué no las alternativas**

| Alternativa                                    | Rechazo                                                                                                                                                                             |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Extraer / compartir componentes del launcher   | No hay monorepo. El UI kit del launcher es ámbar+glass+zinc (v3) y cada feature llama `api.invoke`. Traerlo viola Graphite y arrastra Tauri.                                        |
| Embed del `vite build` del launcher            | `useAppInit` invoca `list_servers`, `load_settings`, `show_main_window` al boot → error en el browser. Tema prohibido. Ventana 1280×820. CSP del portfolio `X-Frame-Options: DENY`. |
| iframe a un demo hosteado                      | No existe. Mismo DENY / Tauri.                                                                                                                                                      |
| Vanilla en `public/scripts/site.js`            | Demasiado estado (servidor × prefix × runner × progreso × tabs). React es el stack de la app y Astro ya contempla islas.                                                            |
| Portar el App.tsx entero con `api.ts` mockeado | Cientos de archivos, Zustand, Lucide, glass, scanners. Fuera de v1. Recrear el subconjunto Graphite es más chico y controlable.                                                     |

**Dependencias nuevas (únicas permitidas)**

- `react` y `react-dom` (18.x, la misma major del launcher).
- `@astrojs/react` compatible con Astro 6.
- `@types/react`, `@types/react-dom` en devDependencies.

Instalar con bun; **sí** actualizar `bun.lock` (excepción a «no tocar lockfile»: aquí hay deps nuevas). No añadir Lucide, Zustand, Tailwind v3, ni paquetes Tauri.

`astro.config.mjs`: `import react from '@astrojs/react'` y `integrations: [react(), sitemap(...)]`. Conservar `output: 'static'`.

**CSP:** `script-src 'self'` ya cubre `/_astro/*.js`. Tras el build, Composer **debe** abrir `dist/projects/nndsk-ro-launcher/index.html` y `dist/index.html` y confirmar que la isla no inyecta `<script>` inline. Si Astro emite inline de hidratación y el CSP lo bloquea: no poner `'unsafe-inline'`. Usar el mecanismo de hashes/nonces de Astro si existe en 6.x; si no, documentar el HTML ofensor en el PR de implementación y parar — no debilitar CSP a ciegas. No tocar `connect-src` (la demo no hace fetch).

**ESLint:** hoy `bun run lint` es `eslint . --ext .js,.ts` (no `.tsx`). Ampliar a `.tsx` y `eslint-plugin-react-hooks` (devDep). `no-explicit-any` sigue. Variables intencionalmente unused: prefijo `_`.

**TipScript:** `astro/tsconfigs/strict` + `@astrojs/react` activa `jsx: react-jsx`. No añadir `any`.

---

## 3. Dónde vive (placement)

### 3.1 Caso de estudio — isla `full` (experiencia principal)

En `src/pages/projects/nndsk-ro-launcher.astro`, **reemplazar** el `<figure>` del hero (`project.data.thumbnail`, ~L124–141 en PR #2) por:

1. Rótulo sobre la isla (Astro estático, no React): `p.text-sm.text-muted` → `Demo de la UI. No lanza Ragnarok Online ni instala Wine/Proton.`
2. `<RoLauncherDemoIsland variant="full" client:load />` dentro de un wrapper `id="demo"` para anclas.
3. `<noscript>` con la misma `<Image>` de `rolauncher1.png` y figcaption `Activa JavaScript para usar la demo.`
4. Figcaption bajo la isla: `Chrome Graphite del sitio. La app de escritorio usa su propio tema. Layout fiel a RO-Launcher.`

No envolver la isla en `<a>`.

La galería `rolauncher2.png` (app sobre el cliente) se queda donde está, **después** de Stack, sin cambios de archivo.

### 3.2 Spotlight home — isla `compact`

En `ProjectSpotlight.astro` (PR #2), la columna izquierda hoy es `<a href={caseStudyHref}><Image thumbnail></a>`.

**Cambiar a:** columna izquierda **sin** `<a>` wrapping. Dentro:

- `div.aspect-video` **no**. La compacta no es 16:9 recortada: es un rail usable con altura intrínseca, `min-h-[22rem]`, `border-b md:border-b-0 md:border-r border-border`, `bg-card`, `p-3`.
- `<RoLauncherDemoIsland variant="compact" client:visible />`.
- `noscript` + `rolauncher1.png` `object-cover` en el mismo slot.

La columna derecha (eyebrow, título, CTAs, highlights, chips) **no cambia** respecto a P1 de PR #2. «Caso de estudio» sigue siendo el CTA primario.

En mobile: compacta encima del copy, igual que la foto ahora. La compacta es una columna (no grid 2 col).

### 3.3 Qué no se toca

- Otras cards de Trabajos (EcoRetirosRM, Mercado House, gisan, hyprtask).
- Lightbox de esos proyectos.
- `rolauncher1.png` / `rolauncher2.png` files: no borrar, no recomprimir.

---

## 4. Look & feel Graphite (cerrado)

Paleta única (Tailwind `@theme` ya existente):

| Token           | Hex       | Uso en la demo                                                                                                                                                                                                  |
| --------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `background`    | `#17191c` | Fondo interior de paneles, track de barras, cuerpo de logs                                                                                                                                                      |
| `card`          | `#1f2227` | Chrome de ventana, rail                                                                                                                                                                                         |
| `border`        | `#343940` | Bordes de panel / botones                                                                                                                                                                                       |
| `border-strong` | `#4a5058` | Servidor seleccionado, hover de fila                                                                                                                                                                            |
| `muted`         | `#9399a1` | Labels, hints, disabled                                                                                                                                                                                         |
| `foreground`    | `#d5d8dc` | Título, nombres, fill de barra HP                                                                                                                                                                               |
| `accent`        | `#b6bdc6` | Solo: focus rings, hover del CTA «Preparar entorno» / «Jugar» (mismo patrón Graphite: reposo `border-border text-foreground`, hover `border-accent text-accent`). **No** rellenar paneles ni radios con accent. |

**Prohibido** en archivos de la demo: `amber`, `zinc`, `emerald`, `sky`, `red`, `yellow`, `orange`, `purple`, `indigo`, `cyan`, `lime`, `from-`/`via-`/`to-` gradients, `backdrop-blur`, `shadow-glass`, `shadow-glow`, `rounded-xl`, `rounded-full` (la excepción Graphite de avatar no aplica aquí), `animate-bounce`, `animate-pulse`, `bg-accent/10` como fill de selección.

Radios: `rounded-md` paneles/botones/inputs; `rounded-sm` chips y dots (dots = cuadrado 8×8 `rounded-sm`, no círculos).

Motion: transiciones `duration-200`. Barra de progreso: `width` `duration-300`. `prefers-reduced-motion: reduce` ya anula transiciones globales; en ese caso el reducer de Preparar salta a `ready` en un solo tick (sin pasos intermedios). No añadir keyframes nuevos.

Tipografía: heredar Inter del sitio. Labels de panel: `text-[10px] font-semibold uppercase tracking-wide text-muted`. Nombres: `text-sm text-foreground`. Hints: `text-[10px] text-muted`. Logs: `font-mono text-[11px]`.

Título del chrome: `RO-Launcher` todo `text-foreground` (no partir «RO» en accent). Subtítulo `Ragnarok Online · Linux`. A la derecha del header de la isla, texto `text-[11px] text-muted`: `Demo`.

CTA Preparar/Jugar: clases Graphite de CTA primario (copiar de `ProjectSpotlight.astro` P1), `w-full`, `rounded-md`. Disabled: `opacity-50 pointer-events-none`.

---

## 5. Flujos v1 (paso a paso)

Estado inicial (SSR + primer paint): servidor `honeyro` seleccionado, runner global `proton-cachyos`, prefix HoneyRO `pending`, botón «Preparar entorno», logs vacíos con placeholder `Wine / setup / lanzamiento...`, tab Combate, AutoPot/Spammer visibles pero disabled.

### Flujo A — compacta y full: elegir servidor y ver recomendación

1. Usuario ve 3 radios: HoneyRO, SakuraRO, Servidor (Gepard no validado).
2. Click SakuraRO → selección visual (`border-border-strong bg-background`), banner Gepard: `Gepard Shield 3.0 (FileVersion 26.9.3.1) reconocido: perfil validado Wine 7.16 old-WoW64 + DXVK 2.6.2.` Runner efectivo del servidor: `wine-7.16`. Avanzado: Runner OK si el select coincide; Entorno pendiente; DXVK pendiente; Gepard warning-as-text (no color ámbar): el mensaje de `pe.rs`.
3. Click HoneyRO → banner `Gepard Shield 3.0 (FileVersion 26.8.26.1) reconocido: perfil validado Proton-CachyOS 11 + DXVK 3.0.1.` Runner efectivo `proton-cachyos`.
4. Click «Servidor (Gepard no validado)» → banner `Build de Gepard no validada; conserva un prefix separado al probar runners.` (texto de `pe.rs` L120–122, sin fingerprint SHA). Runner global, sin receta. Botón sigue siendo «Preparar entorno».

### Flujo B — preparar (simulación honesta)

1. Con HoneyRO y runner `proton-cachyos`, click «Preparar entorno».
2. Botón pasa a disabled «Configurando...». Barra visible. Pasos **exactos** (copiar de `setup.rs`), 350ms cada uno salvo reduced-motion:
   1. `Creando entorno aislado...` 40%
   2. `Inicializando entorno...` 45%
   3. `Preparando Wine Gecko...` 50%
   4. `Preparando gráficos...` 55%
   5. `Instalando vcredist_2019...` 65%
   6. `Instalando d3dx9...` 75%
   7. `Instalando corefonts...` 88%
   8. `Configurando audio...` 96%
   9. `¡Listo!` 100%

3. Cada paso appende en logs: `[demo] <step>`. Primera línea del flujo, antes del paso 1: `[demo] Simulación — no descarga Proton ni escribe un WINEPREFIX.`
4. Al terminar: prefix de **ese** `serverId+runnerId` = `ready`. Avanzado: Entorno listo · aislado; DXVK instalado. Botón idle: «Jugar». Barra se oculta.
5. Cambiar a SakuraRO (otro prefix): Sakura sigue `pending`, botón «Preparar entorno». Volver a HoneyRO: sigue `ready`, botón «Jugar».
6. En HoneyRO `ready`, cambiar el dropdown a `wine-7.16`: prefix de HoneyRO+wine queda `pending` (perfil aislado). Banner Gepard avisa desajuste: `Gepard 3.0 build 26.8.26.1 recomienda el perfil validado Proton-CachyOS 11 + DXVK 3.0.1` + remediation `Selecciona el Proton-CachyOS 11 administrado o un Proton moderno` (`gepard.rs`).

### Flujo C — Jugar (honesto, no fake ingame)

1. Con prefix `ready`, click «Jugar».
2. No se lanza nada. Append log `[demo] Jugar no está disponible en el sitio. RO-Launcher es una app de escritorio Linux.`
3. Debajo del botón, `role="status"`: `Solo demo — el sitio no lanza el cliente.` El texto permanece hasta el próximo cambio de servidor/runner.
4. El botón no pasa a «Iniciando...» ni a «Jugando...». No hay clientes, no hay Detener, no hay HP.

Si el usuario clickea «Preparar entorno» con prefix ya `ready`: no-op (el botón ya dice «Jugar»).

### Flujo D — full only: Herramientas y tabs

1. Panel Herramientas refleja el fixture del servidor (OpenSetup found, Patcher found, dgVoodoo según fixture).
2. Botones Abrir / Instalar / Config / Quitar: `disabled`, `title="No disponible en demo"`.
3. Diagnóstico: `Cliente PE32 · Direct3D` (o el `graphicsApis` del fixture) + warnings Gepard del fixture.
4. Tabs Combate | Buffs: click cambia el panel. Combate = AutoPot + Spammer lado a lado (`grid-cols-1 sm:grid-cols-2`). Buffs = AutoBuff a ancho completo.
5. AutoPot: nombre del servidor, status «Inicia el juego», barras vacías `— / —`, toggles disabled. Selects F9/F8 visibles disabled.
6. Spammer: «Inactivo» / «Inicia el juego». Teclas F1–F9 y 0–9 **sí** togglean selección visual (estado local `spammerKeys: string[]`, default `['F1']` como la captura). Toggle del panel disabled. Delay label `15ms` estático, slider disabled.
7. AutoBuff: «Sin buffs aplicados» / «Inicia el juego». Lista de 2 reglas estáticas disabled (`Blessing`, `Agi Up` — nombres de skill en inglés como el juego; UI alrededor en español).

### Flujo E — compacta (home)

Muestra solo: header Demo, lista servidores, banner Gepard, dropdown runner, 4 dots Avanzado, barra+botón Preparar/Jugar, status Jugar. **No** herramientas, tabs, AutoPot, Spammer, AutoBuff, logs. Flujos A–C idénticos (mismo reducer; compacta no monta los paneles).

Alturas: compacta cabe en la columna spotlight sin scroll interno > 28rem; si el contenido crece, `overflow-y-auto` en la lista de servidores solamente.

### Flujo F — teclado / a11y

- Radios de servidor: `<input type="radio" name="ro-demo-server">` + label. Navegación nativa.
- Runner: `<select>` nativo Graphite (`bg-background border border-border text-foreground text-sm rounded-md px-2 py-1.5`).
- Botón Preparar/Jugar: focus ring Graphite.
- Tabs: `role="tablist"` / `role="tab"` / `aria-selected` / `aria-controls`.
- Isla: `role="region"` `aria-label="Demo de RO-Launcher"`.
- Rótulo demo visible, no solo `sr-only`.

---

## 6. Schema de mock data

Un archivo `src/components/ro-launcher-demo/mockData.ts`. Sin fetch. Nombres de producto en inglés como el repo; UI en español.

```ts
export type RunnerId = 'proton-cachyos' | 'wine-7.16';

export interface DemoRunner {
  id: RunnerId;
  name: string; // visible en el <select>
  kind: 'proton' | 'wine';
}

export interface GepardInfo {
  present: boolean;
  validated: boolean;
  productVersion?: '3.0';
  fileVersion?: '26.8.26.1' | '26.9.3.1';
  profileLabel?: string; // stack_label() de gepard.rs
  recommendedRunnerId?: RunnerId;
  banner: string; // texto ya listo para pintar
  mismatchRemediation?: string;
}

export interface ToolInfoMock {
  found: boolean;
  label: string; // 'Setup.exe' | 'HoneyRO Patcher.exe' | '—' | 'conf OK'
}

export interface DemoServer {
  id: 'honeyro' | 'sakuraro' | 'unknown';
  name: string;
  runnerId: RunnerId; // runner efectivo propio del servidor
  gepard: GepardInfo;
  tools: {
    openSetup: ToolInfoMock;
    patcher: ToolInfoMock;
    dgvoodoo: { configured: boolean; detail: string };
  };
  diagnostics: {
    architecture: 'PE32';
    graphicsApis: string[]; // p.ej. ['Direct3D']
    warnings: string[]; // incluye el banner Gepard (mismo texto)
  };
}

export const DEMO_RUNNERS: DemoRunner[] = [
  {
    id: 'proton-cachyos',
    name: 'proton-cachyos-slr',
    kind: 'proton',
  },
  {
    id: 'wine-7.16',
    name: 'Wine 7.16 old-WoW64',
    kind: 'wine',
  },
];

export const DEMO_SERVERS: DemoServer[] = [
  /* HoneyRO, SakuraRO, unknown — ver valores cerrados abajo */
];
```

**Fixtures cerrados** (no inventar otros servidores: HoneyRO y SakuraRO están en el README público del launcher; el tercero cubre el caso «hash desconocido» del mismo README).

**HoneyRO** (`id: 'honeyro'`)

- `name`: `HoneyRO`
- `runnerId`: `proton-cachyos`
- Gepard validated: product `3.0`, file `26.8.26.1`, profileLabel `Proton-CachyOS 11 + DXVK 3.0.1`, recommendedRunnerId `proton-cachyos`
- `banner`: `Gepard Shield 3.0 (FileVersion 26.8.26.1) reconocido: perfil validado Proton-CachyOS 11 + DXVK 3.0.1.`
- `mismatchRemediation`: `Selecciona el Proton-CachyOS 11 administrado o un Proton moderno`
- tools: OpenSetup `found` label `Setup.exe`; Patcher `found` label `HoneyRO Patcher.exe`; dgVoodoo `configured: true` detail `conf OK`
- diagnostics.graphicsApis: `['Direct3D']`
- diagnostics.warnings: `[banner, 'Se detectó anti-cheat. Confirma con el servidor si Wine, DXVK y la versión de dgVoodoo están permitidos.']`

**SakuraRO** (`id: 'sakuraro'`)

- `name`: `SakuraRO`
- `runnerId`: `wine-7.16`
- Gepard validated: product `3.0`, file `26.9.3.1`, profileLabel `Wine 7.16 old-WoW64 + DXVK 2.6.2`
- `banner`: `Gepard Shield 3.0 (FileVersion 26.9.3.1) reconocido: perfil validado Wine 7.16 old-WoW64 + DXVK 2.6.2.`
- `mismatchRemediation`: `Selecciona Wine 7.16 portable old-WoW64; DXVK 2.6.2 conservará Vulkan moderno`
- tools: OpenSetup found `Setup.exe`; Patcher found `SakuraRO Patcher.exe`; dgVoodoo `configured: false` detail `—`
- graphicsApis: `['Direct3D']`
- warnings: `[banner, anti-cheat warning igual]`

**Servidor (Gepard no validado)** (`id: 'unknown'`)

- `name`: `Servidor (Gepard no validado)`
- `runnerId`: `proton-cachyos` (cae al global; el select puede cambiarlo)
- Gepard present, `validated: false`, sin profileLabel
- `banner`: `Build de Gepard no validada; conserva un prefix separado al probar runners.`
- tools: OpenSetup found `Setup.exe`; Patcher not found label `—`; dgVoodoo not configured
- graphicsApis: `['Direct3D']`
- warnings: `[banner, anti-cheat warning igual]`

**Estado del reducer** (`demo.logic.ts`)

```ts
export type PrefixState = 'pending' | 'preparing' | 'ready';

export interface DemoState {
  selectedServerId: DemoServer['id'];
  selectedRunnerId: RunnerId; // dropdown global; el efectivo es server.runnerId si existe, si el user lo pisa queda selectedRunnerId
  runnerOverride: Partial<Record<DemoServer['id'], RunnerId>>;
  prefixByKey: Record<string, PrefixState>; // key = `${serverId}::${effectiveRunnerId}`
  progress: { step: string; percent: number } | null;
  logs: string[];
  toolView: 'combat' | 'buffs';
  spammerKeys: string[];
  playNotice: string | null;
}

export const initialDemoState: DemoState = {
  selectedServerId: 'honeyro',
  selectedRunnerId: 'proton-cachyos',
  runnerOverride: {},
  prefixByKey: {},
  progress: null,
  logs: [],
  toolView: 'combat',
  spammerKeys: ['F1'],
  playNotice: null,
};
```

`effectiveRunnerId(state, server)` = `state.runnerOverride[server.id] ?? server.runnerId`.

`prefixKey` = `` `${server.id}::${effectiveRunnerId}` ``. Ausente en el map = `pending`.

Acciones: `selectServer`, `setRunner`, `prepareTick` / `prepareStart` / `prepareDone`, `play`, `setToolView`, `toggleSpammerKey`, `clearPlayNotice` (al cambiar server/runner).

Timers de prepare: un `useEffect` en el root que, si `prefix === 'preparing'`, avanza el array `PREPARE_STEPS` (const en `demo.logic.ts`). Cleanup al desmontar o al cambiar `prefixKey`. Reduced motion: `window.matchMedia('(prefers-reduced-motion: reduce)')` → `prepareDone` inmediato + un solo log `[demo] Simulación — no descarga Proton ni escribe un WINEPREFIX.` + `[demo] ¡Listo!`.

No `localStorage`. Cada page load vuelve al inicial.

---

## 7. Lista archivo-a-archivo (portfolio)

Orden de implementación. **Cero cambios en `nndsk-ro-launcher`.**

### 7.1 Deps y config

1. `package.json` — añadir deps §2. Script lint: `eslint . --ext .js,.ts,.tsx`. Correr `bun install` (actualiza `bun.lock`).
2. `astro.config.mjs` — `integrations: [react(), sitemap({ ... })]`. No tocar `output`, `prefetch`, `site`, image service.
3. `eslint.config.js` — `files: ['**/*.ts', '**/*.tsx']`. Añadir `eslint-plugin-react-hooks` recommended. Parser JSX. Conservar `no-explicit-any`.
4. `tsconfig.json` — no hace falta paths extra; alias `@/*` ya cubre `src/components/ro-launcher-demo/*`.

### 7.2 Módulo de la isla (crear)

Directorio `src/components/ro-launcher-demo/`.

| Archivo                      | Contenido                                                                                                                                                                                                                                                                                                                                             |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `types.ts`                   | Tipos de §6 (o reexport desde mockData; no duplicar).                                                                                                                                                                                                                                                                                                 |
| `mockData.ts`                | `DEMO_RUNNERS`, `DEMO_SERVERS`, copy banners.                                                                                                                                                                                                                                                                                                         |
| `demo.logic.ts`              | `initialDemoState`, `demoReducer`, `PREPARE_STEPS`, helpers `effectiveRunner`, `prefixState`, `gepardMismatch`, `launchLabel` (`Preparar entorno` \| `Configurando...` \| `Jugar`). Sin I/O.                                                                                                                                                          |
| `classes.ts`                 | Constantes de className Graphite (panel, panelHeader, row, rowSelected, btnPrimary, btnDisabled, select, tab, tabActive, logLine). Un solo lugar para no derivar ámbar.                                                                                                                                                                               |
| `RoLauncherDemo.tsx`         | Root. Props `{ variant: 'compact' \| 'full' }`. `useReducer` + `useEffect` prepare. Compone los de abajo.                                                                                                                                                                                                                                             |
| `DemoHeader.tsx`             | Título + «Demo».                                                                                                                                                                                                                                                                                                                                      |
| `DemoServerList.tsx`         | Radios. Sin botones +/edit/delete.                                                                                                                                                                                                                                                                                                                    |
| `DemoRunnerPanel.tsx`        | `<select>` + banner Gepard + línea `Runner efectivo de {name}: {runnerName}`.                                                                                                                                                                                                                                                                         |
| `DemoAdvanced.tsx`           | 4 StatusLine. Dot `bg-foreground` ok, `bg-muted` pending, `bg-border-strong` mismatch.                                                                                                                                                                                                                                                                |
| `DemoLaunchBar.tsx`          | Barra de progreso (track `bg-border`, fill `bg-foreground`), botón, `playNotice`.                                                                                                                                                                                                                                                                     |
| `DemoToolsPanel.tsx`         | Solo `full`. 3 cards. Botones disabled. Diagnósticos.                                                                                                                                                                                                                                                                                                 |
| `DemoToolTabs.tsx`           | Solo `full`. Combate / Buffs. Sin iconos Lucide: texto.                                                                                                                                                                                                                                                                                               |
| `DemoAutopot.tsx`            | Solo `full`. Barras vacías, toggles disabled (un `<button role="switch">` Graphite, no círculo emerald).                                                                                                                                                                                                                                              |
| `DemoSpammer.tsx`            | Solo `full`. Teclado F1–F9 + 0–9 (no letras QWERTY en v1: la captura enseña ese subset; `SpammerKeyboard.tsx` también pinta letras pero v1 se queda en F/números como la foto).                                                                                                                                                                       |
| `DemoAutobuff.tsx`           | Solo `full`. 2 reglas disabled.                                                                                                                                                                                                                                                                                                                       |
| `DemoLogs.tsx`               | Solo `full`. Un canal (sin tab Tools). Empty label `Wine / setup / lanzamiento...`. Botón Limpiar (sí, limpia el array local).                                                                                                                                                                                                                        |
| `DemoResetButton.tsx`        | Solo `full`. «Rearmar entorno» disabled.                                                                                                                                                                                                                                                                                                              |
| `RoLauncherDemoIsland.astro` | Wrapper: import del TSX, `interface Props { variant: 'compact' \| 'full' }`, pasa `variant`. **No** pone `client:*` aquí: el page/spotlight lo pone al importar este `.astro`? → **No.** Astro no hidrata un `.astro`. El page debe importar el **`.tsx`** con `client:load` / `client:visible`. Entonces: **no crear Island.astro**. Import directo: |

```astro
import RoLauncherDemo from '../../components/ro-launcher-demo/RoLauncherDemo.tsx';
<RoLauncherDemo client:load variant="full" />
```

Spotlight:

```astro
import RoLauncherDemo from './ro-launcher-demo/RoLauncherDemo.tsx';
<RoLauncherDemo client:visible variant="compact" />
```

Props serializables: solo `variant` string.

### 7.3 Spotlight (PR #2 file)

`src/components/ProjectSpotlight.astro`

- Import `RoLauncherDemo` y `Image` (Image se queda para noscript).
- Reemplazar el bloque `{project.data.thumbnail ? (<a>...<Image/></a>) : placeholder}` por:
  - Columna: `div` con bordes como ahora (`border-b md:border-b-0 md:border-r border-border bg-card`).
  - `RoLauncherDemo client:visible variant="compact"`
  - `<noscript><Image src={thumbnail} ... class="w-full h-auto" /></noscript>`
- **No** `aria-label` de «Leer caso de estudio» en esa columna (ya no es un link). El CTA derecho sigue siéndolo.
- No cambiar JSON-LD, highlights cap 3, chips cap 4, CTAs P1.

### 7.4 Caso de estudio (PR #2 file)

`src/pages/projects/nndsk-ro-launcher.astro`

- Import `RoLauncherDemo`.
- Hero: según §3.1. Wrapper `id="demo" class="mt-8"`.
- Figcaption y rótulo: textos de §3.1.
- `<noscript>` con thumbnail.
- Galería `gallery[0]` intacta.
- Copy Links: reemplazar `Código en GitHub. No hay demo web.` por `Código en GitHub. Arriba hay una demo de la UI; no lanza el cliente.`
- No tocar Problema / Enfoque / Técnico / Stack / JSON-LD / CTAs P1 (salvo que el CTA Repo mobile siga **antes** de la demo, como ahora está antes de la foto).

### 7.5 `Works.astro`

Sin cambios, salvo que PR #2 ya importa `ProjectSpotlight`. No meter la isla aquí.

### 7.6 Contenido / schema

- `src/content/projects/nndsk-ro-launcher.json`: no hace falta campo nuevo. Conservar `thumbnail` y `gallery` (noscript + foto in-game).
- `src/content.config.ts`: no tocar.
- No añadir `link` live al JSON (seguiría implicando que hay un launcher web).

### 7.7 Capturas

| Archivo                                                  | Destino v1                                                               |
| -------------------------------------------------------- | ------------------------------------------------------------------------ |
| `src/content/projects/nndsk-ro-launcher/rolauncher1.png` | Noscript fallback en spotlight y caso. No se pinta si hay JS. No borrar. |
| `src/content/projects/nndsk-ro-launcher/rolauncher2.png` | Galería del caso, después de Stack. Se queda.                            |

No generar OG nuevo. `public/og.png` sigue siendo el del sitio.

### 7.8 Archivos que no se tocan

`Hero.astro`, `Bio.astro`, `Footer.astro` (salvo lo que PR #2 ya hizo con hash links), `Header.astro`, `Layout.astro` (CSP se toca **solo** si §2 lo exige tras evidencia de build), `middleware.ts` / `vercel.json` igual, `global.css` (no hay tokens nuevos), proyectos MH / Eco / gisan / hyprtask, timeline, `docs/DARK_GRAPHITE_PLAN.md`, `docs/RO_LAUNCHER_FEATURED_PLAN.md`.

---

## 8. Copy cerrado (español UI, nombres de producto en inglés)

| Sitio              | Texto                                                                                                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Rótulo caso        | `Demo de la UI. No lanza Ragnarok Online ni instala Wine/Proton.`                                                                                                         |
| Figcaption caso    | `Chrome Graphite del sitio. La app de escritorio usa su propio tema. Layout fiel a RO-Launcher.`                                                                          |
| Noscript           | `Activa JavaScript para usar la demo.`                                                                                                                                    |
| Header isla        | título `RO-Launcher` · subtítulo `Ragnarok Online · Linux` · derecha `Demo`                                                                                               |
| Panel              | `Servidor`                                                                                                                                                                |
| Panel              | `Runner predeterminado`                                                                                                                                                   |
| Runner efectivo    | `Runner efectivo de {name}: {runnerName}`                                                                                                                                 |
| Hint runner propio | `Propio del servidor; el predeterminado global no lo reemplaza.`                                                                                                          |
| Panel              | `Avanzado`                                                                                                                                                                |
| Dots ok            | `Runner · {name}`; `Entorno aislado · listo` / `Entorno aislado · pendiente`; `DXVK · instalado` / `DXVK · pendiente`; `Gepard · perfil validado` / `Gepard · sin receta` |
| Botones            | `Preparar entorno` · `Configurando...` · `Jugar`                                                                                                                          |
| Play notice        | `Solo demo — el sitio no lanza el cliente.`                                                                                                                               |
| Rearmar            | `Rearmar entorno`                                                                                                                                                         |
| Herramientas       | `Herramientas` · `OpenSetup` · `Patcher` · `dgVoodoo` · `Abrir` · `Config`                                                                                                |
| Tabs               | `Combate` · `Buffs`                                                                                                                                                       |
| AutoPot status     | `Inicia el juego`                                                                                                                                                         |
| Spammer            | `Inactivo` · `Inicia el juego` · `Teclas`                                                                                                                                 |
| AutoBuff           | `Sin buffs aplicados` · `Inicia el juego`                                                                                                                                 |
| Logs empty         | `Wine / setup / lanzamiento...`                                                                                                                                           |
| Logs clear         | `Limpiar`                                                                                                                                                                 |
| Links caso         | `Código en GitHub. Arriba hay una demo de la UI; no lanza el cliente.`                                                                                                    |
| Log prepare intro  | `[demo] Simulación — no descarga Proton ni escribe un WINEPREFIX.`                                                                                                        |
| Log play           | `[demo] Jugar no está disponible en el sitio. RO-Launcher es una app de escritorio Linux.`                                                                                |

Títulos de panel en español como la app (`Servidor`, `Herramientas`, `Avanzado`, `Combate`, `Buffs`). Productos: `RO-Launcher`, `HoneyRO`, `SakuraRO`, `OpenSetup`, `Patcher`, `dgVoodoo`, `DXVK`, `Gepard Shield`, `Proton-CachyOS`, `Wine`.

---

## 9. Checklist de aceptación (Composer)

Composer no da por cerrado el PR de implementación hasta marcar todo.

**Build / calidad**

- [ ] Branch de implementación basado en PR #2 (o `main` post-merge).
- [ ] `bun install` + lockfile actualizado solo por React / `@astrojs/react` / types / `eslint-plugin-react-hooks`.
- [ ] `bun run format && bun run lint && bun run format:check && bun run check && bun run build` verdes.
- [ ] `dist/index.html` y `dist/projects/nndsk-ro-launcher/index.html`: isla presente; scripts de hidratación no bloqueados por CSP (verificación en el HTML generado + DevTools console sin errores CSP).
- [ ] Grep en `src/components/ro-launcher-demo/` sin: `amber`, `zinc-`, `emerald`, `sky-`, `red-`, `backdrop-blur`, `bg-gradient`, `rounded-xl`, `@tauri-apps`, `lucide`, `zustand`, `invoke(`.
- [ ] Grep en `src/` sin nuevos `any`.
- [ ] Mercado House JSON / copy intactos (`Go/Gin` no tocado).

**Home (`/#work`)**

- [ ] Spotlight ya no usa la foto como único visual cuando hay JS: hay UI usable (radios + runner + Preparar).
- [ ] Columna derecha P1 intacta (CTA Caso primario, Repo ghost, 3 highlights, 4 chips).
- [ ] Compacta: elegir SakuraRO cambia el banner a Wine 7.16. Preparar corre pasos. Tras Listo, Jugar muestra el notice y **no** inventa un cliente.
- [ ] Sin JS: se ve `rolauncher1.png`.
- [ ] Mobile (~375px): compacta apilada, radios usables, no recorta el botón Preparar. Desktop (~1280): compacta a la izquierda, copy a la derecha.
- [ ] EcoRetirosRM y Mercado House siguen igual.

**Caso (`/projects/nndsk-ro-launcher/`)**

- [ ] Hero es la isla `full`, no la foto.
- [ ] Rótulo honesto visible sin hover.
- [ ] Flujo A+B+C+D de §5.
- [ ] Tabs Combate/Buffs cambian el panel.
- [ ] Abrir/Instalar/Rearmar disabled con title «No disponible en demo».
- [ ] `rolauncher2.png` sigue debajo de Stack.
- [ ] Copy Links actualizado. JSON-LD intacto.
- [ ] `id="demo"` existe.

**Honestidad**

- [ ] Ningún string «Live», «Iniciando...», «Jugando...», PID, HP numérico > 0.
- [ ] Todos los logs de simulación empiezan con `[demo]`.

**A11y**

- [ ] Focus ring visible en radios, select, botón, tabs.
- [ ] `prefers-reduced-motion: reduce`: prepare completa en un tick, sin barra animada.
- [ ] `lang` del documento sigue `es-CL`.

---

## 10. Fuera de v1 (no implementar)

- Modo `ingame`, rail 64px, ActiveClients, Detener, HP/SP vivos, scanner de memoria.
- Alta/edición de servidores, file picker, LaunchFieldsModal.
- Discord Rich Presence.
- Instalar dgVoodoo / abrir OpenSetup / patcher de verdad.
- Embed AppImage / Wine en el browser.
- Compartir código con el repo launcher.
- Teclado QWERTY completo del spammer, GearSwitch, reglas AutoBuff editables.
- Persistencia `localStorage`.
- i18n inglés.
- Tests automatizados (el repo portfolio no tiene runner de test; la validación es lint/format/check/build + browser).

---

## 11. AMBIGUITIES para Vicente

Ninguna. Cerrado con evidencia:

- **Graphite vs ámbar de la app:** paleta del portfolio es constraint duro; el launcher es zinc/ámbar/glass (`src/index.css`, `tailwind.config.js`, captura). Demo restyleada + rótulo.
- **Home y caso, no solo uno:** la cita es reemplazar la foto; la foto está en spotlight y en el hero del caso (PR #2). Compacta / full.
- **Jugar no finge un cliente:** constraint «never fake that it launches RO». Notice + log.
- **Tres servidores:** HoneyRO y SakuraRO salen del README público del launcher (matriz Gepard). El tercero es el caso documentado «cualquier otra build / sin recomendación», sin inventar un private server.
- **Base git:** implementar encima de PR #2, no desde `main` desnudo.
- **Sin cambios en el repo launcher.**

Si Vicente quiere pixel-match ámbar **dentro** del portfolio, eso choca con Dark Graphite y queda para un follow-up explícito, no para v1.
