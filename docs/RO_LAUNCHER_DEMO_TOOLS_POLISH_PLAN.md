# Plan: padding/toggles simétricos + Prepare 8–12s (tools polish)

**Rol de este documento:** especificación cerrada para Composer. Cero UI en este commit de plan. Si un paso no está aquí, no se hace.

**PR:** [#2](https://github.com/Nandem1/nndsk-portfolio-astro/pull/2) · branch `cursor/ro-launcher-featured-plan-cef7`

**HEAD de partida (no revertir):** `af89927` (home tweaks plan formateado) sobre `84e6a4e` (prepare 0% + sliders compact) sobre `0c58d7f` (scroll fix Preparar/Rearmar). **Esos tres aterrizajes se conservan íntegros.** Este brief **sustituye** solo dos vetos del plan anterior `docs/RO_LAUNCHER_DEMO_HOME_TWEAKS_PLAN.md`:

| Veto anterior (HOME_TWEAKS §1.3)                       | Este brief                               |
| ------------------------------------------------------ | ---------------------------------------- |
| Cero cambios de `gap` / `px` / `py` en AutoPot/Spammer | P0 padding + gap en bodies/wells/toggles |
| Timer 350 ms/paso; no editar `usePrepareTimer`         | P1 tick 900 ms; sí editar el timer       |

No reescribir HOME_TWEAKS. No deshacer `min-w-0 overflow-hidden` ni `PREPARE_STEPS` 0/15/30. No mergear a `main`.

**Brief UX (Vicente, cerrado):** P0 padding/toggles + spacing interno en AutoPot / Spammer / Buffs. P1 Prepare más lento y copy limpio. No rediseñar rail/centro. No reabrir el scroll de `#demo`.

---

## 0. Hechos verificados en HEAD `af89927`

### 0.1 Causa del toggle flush (P0)

`panelBody` (`chrome/classes.ts` 19) es `'px-3 py-2 flex flex-col gap-2 min-h-0'`. Tailwind `px-3` = 12px L y R.

AutoPot y Spammer concatenan `pr-0.5` **después** de `panelBody`:

| Archivo               | Body hoy                                             |
| --------------------- | ---------------------------------------------------- |
| `DemoAutopot.tsx` 88  | `` `${panelBody} flex-1 overflow-y-auto pr-0.5` ``   |
| `DemoSpammer.tsx` 38  | `` `${panelBody} flex-1 overflow-y-auto pr-0.5` ``   |
| `DemoAutobuff.tsx` 38 | `` `${panelBody} flex-1 overflow-y-auto` `` (sin pr) |

`pr-0.5` (2px) **pisa** `padding-right` de `px-3`. Resultado AutoPot/Spammer: L=12px, R=2px. El `DemoToggle` (`w-9 h-5 shrink-0`) queda pegado al borde derecho. Eso es el flush. No es un bug del componente toggle (`DemoToggle.tsx` no se edita).

Buffs no tiene `pr-0.5`, pero comparte `gap-2` (8px entre bloques) y wells `px-2.5` (10px). Entra en el mismo P0 de simetría/spacing.

Filas de toggle hoy: `flex items-start justify-between gap-2` (AutoPot 89, Spammer 39, Autobuff 39). `gap-2` = 8px cumple el mínimo texto↔toggle; el fallo es el inset derecho del panel, no el gap. Aun así se sube a `gap-3` (12px) para no quedar en el suelo del brief.

Fila proactiva AutoPot (107): mismo patrón `justify-between gap-2` + `px-2.5` dentro de un well. El toggle ámbar hereda el crunch derecho del body.

### 0.2 Spacing interno hoy

| Superficie                 | Archivo:líneas           | Clases hoy                                   |
| -------------------------- | ------------------------ | -------------------------------------------- |
| Gap entre bloques del body | `classes.ts` 19          | `gap-2` (8px) vía `panelBody`                |
| Well HP/SP                 | `DemoAutopot.tsx` 102    | `` `${innerWell} px-2.5 py-2 space-y-1.5` `` |
| Well teclas Spammer        | `DemoSpammer.tsx` 52     | igual                                        |
| Well modo proactivo        | `DemoAutopot.tsx` 107    | `px-2.5 py-2` + `gap-2`                      |
| Rows reglas Buffs          | `DemoAutobuff.tsx` 52–56 | `px-2.5 py-2` + `gap-2`                      |
| `innerWell` token          | `classes.ts` 55          | sin padding (`rounded-lg bg-… border-…`)     |

`innerWell` solo se usa en AutoPot y Spammer. Meter `px-4 py-2` en el token no contamina el rail.

`panelBody` **sí** se comparte con rail/logs/Herramientas:

| Uso no-tool                  | Archivo                 | Qué pasa si se cambia `panelBody`       |
| ---------------------------- | ----------------------- | --------------------------------------- |
| Servidor / Runner / Avanzado | `DemoPanel.tsx` 17      | Redibuja el rail — **NO-GO**            |
| Logs scroller                | `DemoLogs.tsx` 76       | Cambia gutter de logs — **NO-GO**       |
| Herramientas (OpenSetup/…)   | `DemoToolsPanel.tsx` 54 | No es AutoPot/Spammer/Buffs — **NO-GO** |

Por eso este brief **no** muta `panelBody`. Crea `toolPanelBody` y lo usan solo los tres paneles de tools.

Tailwind 4: **no** concatenar `panelBody` + `px-4`. El ganador L/R lo decide el CSS generado, no el orden en el `className`. Sustituir el token.

### 0.3 Prepare hoy (P1)

`PREPARE_STEPS` (`demo.logic.ts` 12–25): 12 entradas. Índice 0 = `Resolviendo runner...` **0%**. Índices 1–2 llevan `(simulado)` en la etiqueta de barra/log de paso:

```ts
{ step: 'Preparando runner (simulado)...', percent: 15 },
{ step: 'Instalando DXVK (simulado)...', percent: 30 },
```

`LOG_PREPARE_INTRO` (línea 27) ya es el disclaimer: `'[demo] Simulación — no descarga Proton ni escribe un WINEPREFIX.'` Se queda.

Timer (`RoLauncherDemo.tsx` 20–48, `usePrepareTimer`): dos `setTimeout(..., 350)` — tick y hold de `¡Listo!` 100% antes de `prepareDone`. Reduced-motion: el effect **return** sin timer; el click usa `prepareInstant` (64–67). Instantáneo. No hay ticks cortos que alargar.

Duración actual click→**Jugar** (sin reduced-motion): 12 intervalos × 350 ms = **4.2 s** (11 ticks + 1 hold). Fuera del target 8–12 s.

El array no se acorta ni se alarga. Solo cambia el periodo del timer y dos strings.

Sliders Lectura/Delay ya tienen `min-w-0 overflow-hidden` en la fila y `flex-1 min-w-0 w-full` en el range (`DemoAutopot.tsx` 122–140, `DemoSpammer.tsx` 71–81). **No tocar.**

Scroll lock: `preserveWindowScroll.ts`, `aria-disabled` en Launch/Reset, `#demo { overflow-anchor: none }` / `.ro-demo { overflow-anchor: none }`. **No tocar.** El wrapper de dispatch ya cubre cada `prepareTick`; alargar a 900 ms no exige reabrir el lock.

---

## 1. Aceptación (no negociable)

### 1.1 Padding + toggles (P0)

En `#demo` full **y** home `#work` compact, Combate (AutoPot + Spammer) y tab Buffs:

1. Ningún tool body lleva `pr-0.5` (ni `pr-*` que pise el padding simétrico).
2. Padding L y R del body del tool = **16px** (`px-4`). Mínimo del brief era `px-3`; se cierra `px-4`.
3. Texto de la fila de toggle ↔ thumb del switch: gap computado ≥ 8px. Clase de fila = `gap-3` (12px).
4. Inset del toggle ≥ padding del panel: `padding-right` del body = `padding-left` = 16px. El `DemoToggle` es `shrink-0` y no lleva margen negativo.
5. **Métrica:** `border→toggle` ≈ `border→label izquierdo` ± 2px, medida sobre el **content box** del body (excluye el scrollbar 6px de `tokens.css` 28–31). Snippet en §5.1.
6. Lo mismo en: toggle principal AutoPot, toggle «Modo proactivo», toggle Spammer, toggle AutoBuff.

### 1.2 Spacing interno (P0)

1. Gap vertical entre bloques del tool body = `gap-2.5` (10px). Rango del brief 2.5–3; se cierra **2.5** para no empujar scroll vertical de más en AutoPot (`min-h-[16rem]` se queda).
2. Wells internos (HP/SP, teclas, proactivo, rows de reglas Buffs): padding L = padding R, token **`px-4`** (16px). Nada de `px-2.5` ni `pr-*` suelto.
3. Cero crunch derecho: ningún control (toggle, select de tecla Buffs, valor `Nms` del slider) recortado por el borde del panel.
4. `document.querySelector('.ro-demo').scrollWidth <= clientWidth` en compact 1280 y 375, y en full `#demo`. **No** meter `overflow-x-hidden` en `demoChrome` para “pasar” el check.

### 1.3 Prepare (P1)

Sin reduced-motion, click real en **Preparar entorno**:

1. Primer frame con barra: `Resolviendo runner...` **0%** (igual que HOME_TWEAKS; no se toca el orden ni los percents).
2. Etiquetas de barra **sin** `(simulado)`:

| Orden | `progress.step`          | %      |
| ----- | ------------------------ | ------ |
| 1     | Resolviendo runner...    | 0      |
| 2     | Preparando runner...     | 15     |
| 3     | Instalando DXVK...       | 30     |
| 4–12  | (existentes, sin cambio) | 40→100 |

3. Tiempo click → botón **Jugar** ∈ **[8 s, 12 s]**. Con tick 900 ms: 12 × 900 = **10.8 s**.
4. Reduced-motion: un click → **Jugar** inmediato, sin barra, vía `prepareInstant`. Logs intro + `[demo] ¡Listo!`. No exigir 8–12 s.
5. `LOG_PREPARE_INTRO` y `LOG_AUTOPOT` / `LOG_SPAMMER` / `LOG_AUTOBUFF` / `LOG_RESET` **siguen** diciendo simulación. Solo se limpia el copy de `PREPARE_STEPS`.

### 1.4 Invariantes (NO-GO si se rompen)

1. Scroll fix de `#demo` intacto: no editar `preserveWindowScroll.ts`, no volver a `disabled` HTML en Launch/Reset, no tocar `#demo { overflow-anchor: none }` ni `.ro-demo { overflow-anchor: none }`, no `scrollIntoView` en logs.
2. No rediseñar rail, tabs Combate/Buffs, grid centro, spotlight, `max-h-[36rem]`, `min-h-[16rem]`.
3. No mutar `panelBody` / `panelHeader` (rail, logs, Herramientas).
4. Conservar sliders `min-w-0 overflow-hidden` + range `flex-1 min-w-0 w-full`.
5. No añadir/quitar pasos de `PREPARE_STEPS`. No reescalar percents. ASCII `...`, no `…`.
6. No editar `DemoToggle.tsx`.
7. No merge a `main`.

---

## 2. Decisiones cerradas (cero ambigüedad)

| Tema                                             | Decisión                                                                                                                   |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| Padding tools                                    | **`px-4`** (16px). No `px-3.5`.                                                                                            |
| ¿Mutar `panelBody`?                              | **No.** Token nuevo `toolPanelBody`.                                                                                       |
| `toolPanelBody` exacto                           | `'px-4 py-2 flex flex-col gap-2.5 min-h-0'`                                                                                |
| `pr-0.5`                                         | **Eliminar** en AutoPot y Spammer. No sustituir por otro `pr-*`.                                                           |
| Overflow vertical                                | Se conserva `flex-1 overflow-y-auto` en los tres bodies. El scrollbar 6px de `tokens.css` se queda. No `scrollbar-gutter`. |
| Gap fila toggle (texto ↔ switch)                 | `gap-2` → **`gap-3`** en las 4 filas con `DemoToggle` (3 principales + proactivo).                                         |
| Gap bloques body                                 | **`gap-2.5`** vía `toolPanelBody`.                                                                                         |
| Wells HP/SP y teclas                             | `innerWell` pasa a incluir `px-4 py-2`. Call sites: quitar `px-2.5 py-2`; dejar `space-y-1.5`.                             |
| Well proactivo + rows Buffs                      | `px-2.5` → **`px-4`**. `gap-2` → **`gap-3`**.                                                                              |
| `panelHeader` de tools                           | **No cambiar** (sigue `px-3`). El P0 se mide en el body (label de la fila de toggle, no el título «AutoPot»).              |
| `DemoToggle.tsx`                                 | **No editar.**                                                                                                             |
| Tick Prepare                                     | **`PREPARE_TICK_MS = 900`**. Tick y hold de 100% usan la misma constante.                                                  |
| ¿Por qué no 800 / 1100?                          | 800 → 9.6 s (ok pero más corto). 1100 → 13.2 s (**fuera** de 8–12). 900 → 10.8 s, centro del rango.                        |
| ¿Dónde vive la constante?                        | Export en `demo.logic.ts` junto a `PREPARE_STEPS`. `RoLauncherDemo.tsx` la importa. No hardcodear `900` suelto.            |
| Reduced-motion                                   | **Sin cambio de comportamiento.** Sigue `prepareInstant` + early-return del timer. No introducir ticks cortos.             |
| Copy `(simulado)` en pasos                       | Quitar el literal ` (simulado)` de **dos** strings. Resto del array idéntico.                                              |
| Disclaimers de log                               | **No tocar** `LOG_*`.                                                                                                      |
| ¿Editar `DemoLaunchBar.tsx`?                     | **No.** Ya pinta `progress.step` / `percent`. El copy nuevo fluye solo.                                                    |
| ¿Editar `DemoCenter.tsx` / tabs / rail / logs?   | **No.**                                                                                                                    |
| ¿Editar `types.ts` / `mockData.ts` / tokens.css? | **No.**                                                                                                                    |
| Archivos nuevos de código                        | **Ninguno.** Solo este markdown de plan (ya creado).                                                                       |
| Stack `panelBody` + `px-4`                       | **Prohibido.** Sustituir el import.                                                                                        |

---

## 3. Implementación archivo por archivo

Orden de edición. **Seis archivos de código. Nada más.**

### 3.1 `src/components/ro-launcher-demo/chrome/classes.ts`

Después de `panelBody` (línea 19), **añadir**:

```ts
export const toolPanelBody = 'px-4 py-2 flex flex-col gap-2.5 min-h-0';
```

`panelBody` queda **literalmente** `'px-3 py-2 flex flex-col gap-2 min-h-0'`.

Reemplazar `innerWell` (línea 55) por:

```ts
export const innerWell = 'rounded-lg bg-zinc-950/40 border border-zinc-800/60 px-4 py-2';
```

No tocar `panelHeader`, `panelShell`, `gepardBanner`, `selectNative`, `demoChrome`.

### 3.2 `src/components/ro-launcher-demo/center/DemoAutopot.tsx`

Import: dejar de importar `panelBody`. Importar `toolPanelBody` (y seguir importando `innerWell`).

Body (hoy línea 88):

```tsx
<div className={`${panelBody} flex-1 overflow-y-auto pr-0.5`}>
```

Queda:

```tsx
<div className={`${toolPanelBody} flex-1 overflow-y-auto`}>
```

Fila toggle principal (hoy 89): `gap-2` → `gap-3`:

```tsx
<div className="flex items-start justify-between gap-3">
```

Well HP/SP (hoy 102): quitar `px-2.5 py-2` (ya van en el token):

```tsx
<div className={`${innerWell} space-y-1.5`}>
```

Well proactivo (hoy 107): `gap-2` → `gap-3`, `px-2.5` → `px-4`:

```tsx
<div className="flex items-center justify-between gap-3 rounded-lg border border-amber-500/15 bg-amber-500/5 px-4 py-2">
```

No cambiar StatBar, sliders (`min-w-0 overflow-hidden` / `w-full`), grid HP/SP, perfil de memoria, `min-h-[16rem]`, copy, handlers.

### 3.3 `src/components/ro-launcher-demo/center/DemoSpammer.tsx`

Mismo swap de import `panelBody` → `toolPanelBody`.

Body (hoy 38):

```tsx
<div className={`${toolPanelBody} flex-1 overflow-y-auto`}>
```

Fila toggle (hoy 39): `gap-3`. Well teclas (hoy 52): `` `${innerWell} space-y-1.5` ``.

No cambiar `FUNCTION_KEYS` / `NUMBER_KEYS`, `KeyRow`, slider Delay, `w-8`, `min-h-[16rem]`.

### 3.4 `src/components/ro-launcher-demo/center/DemoAutobuff.tsx`

Import: `panelBody` → `toolPanelBody`. No usa `innerWell`.

Body (hoy 38):

```tsx
<div className={`${toolPanelBody} flex-1 overflow-y-auto`}>
```

Fila toggle (hoy 39): `gap-3`.

Cada `li` de regla (hoy 56): `gap-2` → `gap-3`, `px-2.5` → `px-4`:

```tsx
className =
  'flex items-center justify-between gap-3 rounded-lg border border-zinc-800/60 bg-zinc-950/40 px-4 py-2';
```

`ul` se queda `space-y-1.5` (agrupa reglas; no son bloques de panel). No cambiar checkbox, `selectNative`, copy, `id="ro-demo-panel-buffs"`.

### 3.5 `src/components/ro-launcher-demo/demo.logic.ts`

1. Añadir **inmediatamente después** de `PREPARE_STEPS` (antes de `LOG_PREPARE_INTRO`):

```ts
export const PREPARE_TICK_MS = 900;
```

2. En el array, **solo** estas dos líneas cambian:

```ts
{ step: 'Preparando runner...', percent: 15 },
{ step: 'Instalando DXVK...', percent: 30 },
```

Array resultante **exacto**:

```ts
export const PREPARE_STEPS: { step: string; percent: number }[] = [
  { step: 'Resolviendo runner...', percent: 0 },
  { step: 'Preparando runner...', percent: 15 },
  { step: 'Instalando DXVK...', percent: 30 },
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
```

No tocar reducer (`prepareStart` / `prepareTick` / `prepareDone` / `prepareInstant` / `resetPrefix`). No tocar ninguna `LOG_*`.

### 3.6 `src/components/ro-launcher-demo/RoLauncherDemo.tsx`

Import: añadir `PREPARE_TICK_MS` al import existente de `./demo.logic`.

En `usePrepareTimer`, los dos `350` (líneas 39 y 45) pasan a `PREPARE_TICK_MS`:

```ts
if (state.prepareStepIndex >= PREPARE_STEPS.length - 1) {
  const doneTimer = window.setTimeout(() => {
    dispatch({ type: 'prepareDone' });
  }, PREPARE_TICK_MS);
  return () => window.clearTimeout(doneTimer);
}

const tickTimer = window.setTimeout(() => {
  dispatch({ type: 'prepareTick' });
}, PREPARE_TICK_MS);
```

No tocar `prepareInstant`, `captureWindowScrollFromPointer`, `usePreservedWindowScrollDispatch`, grid, `max-h-[36rem]`, `variant`.

### 3.7 Fuera de alcance (no editar)

`DemoToggle.tsx`, `DemoLaunchBar.tsx`, `DemoResetButton.tsx`, `preserveWindowScroll.ts`, `DemoLogs.tsx`, `DemoCenter.tsx`, `DemoToolsPanel.tsx`, `DemoToolTabs.tsx`, `DemoRail.tsx`, `DemoPanel.tsx`, `tokens.css`, `types.ts`, `mockData.ts`, `ProjectSpotlight.astro`, `Works.astro`, `index.astro`, `src/pages/projects/nndsk-ro-launcher.astro`, `Layout.astro`, `Header.astro`, `global.css`, `middleware.ts`, `astro.config.mjs`.

No reescribir `docs/RO_LAUNCHER_DEMO_HOME_TWEAKS_PLAN.md`, `docs/RO_LAUNCHER_DEMO_SCROLL_FIX_PLAN.md` ni otros planes.

---

## 4. Por qué no hace falta más

- El flush es `pr-0.5` pisando `px-3`. Quitar `pr-*` y usar `px-4` simétrico en un token propio cierra inset L/R. El switch ya es `shrink-0`; no hay que envolverlo ni darle `mr-*`.
- `gap-3` en la fila cumple «≥8px al texto» con margen. `justify-between` ya empuja el toggle al borde **interno** del padding; el padding es el inset.
- Wells con el mismo `px-4` evitan un gutter interior más estrecho a la derecha (el crunch que se veía con body R=2px + well `px-2.5`).
- `toolPanelBody` aísla tools del rail. Tocar `panelBody` redibujaría Servidor/Runner/Avanzado — vetado.
- 900 ms × 12 intervalos = 10.8 s sin tocar la longitud del array ni LaunchBar. Reduced-motion sigue el camino corto (`prepareInstant`).
- Quitar `(simulado)` de dos labels no toca el disclaimer de logs: `prepareStart` sigue anteponiendo `LOG_PREPARE_INTRO`.

---

## 5. Pasos de verificación para Composer

Sustituir `PREVIEW` por la URL Ready del check de Vercel **después** del commit de implementación (no este plan). Trailing slash (`astro.config.mjs` `trailingSlash: 'always'`).

Chrome con UI. No usar `|Δ|=0` de Playwright headless como aceptación de scroll (falso negativo ya documentado).

### 5.1 Toggles + padding — `#demo` y `#work`

Viewport **1280×720**.

1. `PREVIEW/projects/nndsk-ro-launcher/#demo` (full) y `PREVIEW/#work` (compact).
2. Combate: AutoPot y Spammer visibles. Buffs: click tab **Buffs**.
3. DevTools snippet (pegar en cada panel; AutoPot = primer `section` de `#ro-demo-panel-combat`):

```js
(() => {
  const pass = (name, body, row) => {
    const cs = getComputedStyle(body);
    const padL = parseFloat(cs.paddingLeft);
    const padR = parseFloat(cs.paddingRight);
    const toggle = row.querySelector('[role="switch"]');
    const label = row.firstElementChild;
    const br = body.getBoundingClientRect();
    const left = label.getBoundingClientRect().left - (br.left + body.clientLeft);
    const right =
      br.left + body.clientLeft + body.clientWidth - toggle.getBoundingClientRect().right;
    const gap = toggle.getBoundingClientRect().left - label.getBoundingClientRect().right;
    const okPad = padL === 16 && padR === 16;
    const okInset = Math.abs(left - right) <= 2;
    const okGap = gap >= 8;
    console.log(name, { padL, padR, left, right, gap, okPad, okInset, okGap });
    return okPad && okInset && okGap;
  };
  const combat = document.querySelector('#ro-demo-panel-combat');
  const autopot = combat.querySelectorAll('section')[0];
  const spammer = combat.querySelectorAll('section')[1];
  const apBody = autopot.children[1];
  const spBody = spammer.children[1];
  const a1 = pass('AutoPot main', apBody, apBody.children[0]);
  const a2 = pass('AutoPot proactive', apBody, apBody.children[2]);
  const s1 = pass('Spammer', spBody, spBody.children[0]);
  document.querySelector('#ro-demo-tab-buffs').click();
  const buff = document.querySelector('#ro-demo-panel-buffs');
  const bBody = buff.children[1];
  const b1 = pass('Buffs', bBody, bBody.children[0]);
  console.log('PASS', a1 && a2 && s1 && b1);
})();
```

Criterio: `PASS true`. `pr-0.5` no aparece en el HTML hidratado de esos bodies.

4. Tras Preparar (tools unlocked): repetir el snippet. Encender los cuatro toggles; el inset no cambia.

### 5.2 Spacing + no scroll-x

Misma isla, viewports **1280×720** y **375×812**:

```js
(() => {
  const root = document.querySelector('.ro-demo');
  const dx = root.scrollWidth - root.clientWidth;
  console.log('ro-demo Δx', dx, 'PASS', dx <= 0);
})();
```

Criterio: `Δx <= 0`. Wells: `padding-left === padding-right` (16px) en HP/SP, teclas, proactivo, rows Buffs. Ningún thumb de range ni toggle recortado. **No** “arreglar” con `overflow-x-hidden` en `.ro-demo`.

Compact: sliders Lectura/Delay siguen dentro (regresión de `84e6a4e`).

### 5.3 Prepare 8–12 s + copy limpio

Sin reduced-motion. `PREVIEW/#work` o `#demo`:

1. Click real **Preparar entorno**.
2. Inmediato: `Resolviendo runner...` + `0%`.
3. Siguiente etiqueta visible: `Preparando runner...` (**sin** `(simulado)`), luego `Instalando DXVK...` (**sin** `(simulado)`), luego `Creando entorno aislado...`.
4. Cronometrar click → **Jugar**:

```js
(() => {
  const btn = [...document.querySelectorAll('.ro-demo button')].find(b =>
    /Preparar entorno|Configurando|Jugar/.test(b.textContent)
  );
  const t0 = performance.now();
  const iv = setInterval(() => {
    if (btn.textContent.trim() === 'Jugar') {
      const ms = performance.now() - t0;
      console.log('prepare ms', ms, 'PASS', ms >= 8000 && ms <= 12000);
      clearInterval(iv);
    }
  }, 100);
  btn.click();
})();
```

Criterio: `PASS true` (esperado ~10800 ms). Full: primera línea de log de juego sigue siendo `LOG_PREPARE_INTRO`; las líneas de paso **no** contienen `(simulado)`.

5. Reduced-motion (`prefers-reduced-motion: reduce`): un click → **Jugar**, sin barra, sin esperar 8 s.

### 5.4 Regresión scroll `#demo` (smoke)

`PREVIEW/projects/nndsk-ro-launcher/#demo`. Click Preparar y Rearmar en Chrome UI. `|Δ scrollY| ≤ 20`, hash `#demo`. Si se rompe: revertir cualquier toque accidental a `preserveWindowScroll.ts` / LaunchBar / `#demo`; este brief no autoriza compensar el scroll.

### 5.5 Repo

```text
bun run format
bun run lint
bun run format:check
bun run check
bun run build
```

---

## 6. Protocolo del implementer

1. Leer este archivo entero.
2. Partir de HEAD actual de `cursor/ro-launcher-featured-plan-cef7` (`af89927` + este plan). No revertir scroll fix ni prepare 0% / sliders. No rebasear a `main`.
3. Aplicar §3.1 → §3.6 en ese orden. Diff esperado: un token nuevo, `innerWell` +px, tres bodies sin `pr-0.5`, cuatro `gap-3`, wells `px-4`, dos strings de paso, una constante 900 y dos `setTimeout` usándola.
4. Commit (mensaje: `Polish RO demo tool padding and prepare timing`).
5. Push al mismo branch. Verificar en el **preview Vercel nuevo** con §5.1–§5.3, no solo local.
6. Pegar en el PR: `padL/padR/left/right/gap` de los cuatro toggles, `Δx` compacto 1280 y 375, `prepare ms`, y que las etiquetas ya no dicen `(simulado)`.
7. Si el toggle sigue flush: no achicar `DemoToggle`, no meter `pr-2` a ciegas. Comprobar que el HTML hidratado usa `toolPanelBody` / `px-4` y **cero** `pr-0.5`. Si `panelBody` sigue en el className, Tailwind 4 puede haber ganado con `px-3`+`pr-*`; hay que **sustituir** el token, no apilarlo.
8. Si Prepare dura &lt;8 s: confirmar que ambos timeouts usan `PREPARE_TICK_MS` (el hold de 100% también). Si dura &gt;12 s: no bajar el array; el valor cerrado es 900, no 1100.
9. No merge a `main`.
