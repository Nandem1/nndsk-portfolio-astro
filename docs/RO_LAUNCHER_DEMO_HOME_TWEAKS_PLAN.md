# Plan: Prepare desde 0% + sliders Lectura/Delay sin overflow (home compact)

**Rol de este documento:** especificación cerrada para Composer. Cero UI en este commit de plan. Si un paso no está aquí, no se hace.

**PR:** [#2](https://github.com/Nandem1/nndsk-portfolio-astro/pull/2) · branch `cursor/ro-launcher-featured-plan-cef7`

**HEAD de partida (no revertir):** `0c58d7f` = scroll fix de Preparar/Rearmar ya aterrizado (`preserveWindowScroll.ts`, `aria-disabled` en Launch/Reset, `overflow-anchor: none` en `#demo`, auto-scroll interno de logs). **Ese fix se conserva íntegro.**

**Producción:** no mergear a `main`.

**Brief UX (Vicente, cerrado):** dos P0 en la demo compacta de `#work`. No densificar paneles AutoPot/Spammer. No rediseñar layout. No reabrir el scroll de `#demo`.

---

## 0. Hechos verificados en HEAD `0c58d7f`

### 0.1 Prepare hoy arranca en 40%

Fuente: `src/components/ro-launcher-demo/demo.logic.ts` 12–22.

```ts
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
```

El primer commit de `prepareStart` (mismo archivo 161–180) pinta `PREPARE_STEPS[0]`. Por eso el click en **Preparar entorno** muestra de inmediato `Creando entorno aislado...` **40%**. No hay pasos de runner ni DXVK.

La barra vive en `DemoLaunchBar.tsx` 23–35: `{progress && …}` + `progress.step` + `progress.percent` + `style={{ width: \`${progress.percent}%\` }}`. Un objeto `{ step, percent: 0 }` es truthy: la barra **sí** se monta a 0%. No hace falta tocar ese JSX.

El timer (`RoLauncherDemo.tsx` 20–48) ya itera `PREPARE_STEPS.length` a 350 ms y hace hold 350 ms en el último índice antes de `prepareDone`. **No hardcodea 9.** Añadir 3 entradas al array alarga el flujo solo. No editar el timer.

Home compact **no** monta `DemoLogs` (`RoLauncherDemo.tsx` 96: `{!isCompact && <DemoLogs … />}`). En `#work` las etiquetas de paso **solo** se leen en la barra del rail (`DemoLaunchBar`). No “arreglar” visibilidad reintroduciendo logs en compact.

Puntos de entrada que comparten el mismo `PREPARE_STEPS`:

| Superficie | Archivo | `variant` | Preparar visible |
| ---------- | ------- | --------- | ---------------- |
| Home `#work` spotlight | `ProjectSpotlight.astro` 54 | `compact` | sí (rail + LaunchBar) |
| Caso `#demo` | `nndsk-ro-launcher.astro` 139 | `full` | sí (más logs) |

Aceptación UX se mide en **home `#work`**. Full hereda el array sin cambios extra.

### 0.2 Sliders Lectura/Delay overflow en compact

Compact (`variant="compact"`) **sí** monta AutoPot + Spammer: `DemoCenter.tsx` 20–28 siempre pinta el grid combate; `showTools={!isCompact}` solo oculta `DemoToolsPanel`.

Filas actuales (causa): `input[type=range]` con `flex-1` **sin** `min-w-0`. El UA le da min-content horizontal (~150px+). En flex-col (`panelBody`) el hijo tiene `min-width: auto`, así que la fila no encoge. El thumb y el track se salen del panel.

| Control | Archivo:líneas | Row hoy | Range hoy | Valor |
| ------- | -------------- | ------- | --------- | ----- |
| Lectura AutoPot | `DemoAutopot.tsx` 122–146 | `flex items-center gap-2` | `flex-1 accent-amber-500 disabled:opacity-50` | `w-10 shrink-0` (`{n}ms`) |
| Delay Spammer | `DemoSpammer.tsx` 71–87 | `flex items-center gap-2` | igual | `w-8 shrink-0` |

Por qué pega en home y no tanto en el caso: `.ro-demo` es `@container`. Spotlight a `md` deja la isla en ~mitad de card. A ancho isla ≥ 40rem el rail es `minmax(220px,300px)` y el centro queda estrecho; a isla ≥ 28rem el combate pasa a 2 columnas (`DemoCenter.tsx` 22). Cada panel AutoPot/Spammer puede bajar de ~170px. Ahí el range nativo desborda.

`demoChrome` ya trae `overflow-hidden` (`classes.ts` 1–2). Eso **no** impide `scrollWidth > clientWidth` del body compacto (`max-h-[36rem] overflow-y-auto` en `RoLauncherDemo.tsx` 75: `overflow-y: auto` puede abrir overflow-x). La corrección es en la fila del range, no un rediseño del chrome.

---

## 1. Aceptación (no negociable)

### 1.1 Prepare desde 0% (P0)

En home, isla compacta de `#work` (spotlight), **sin** reduced-motion:

1. Click real en **Preparar entorno**.
2. El **primer** frame con barra muestra exactamente `Resolviendo runner...` y **`0%`**. La barra de relleno tiene `width: 0%` (no 40%).
3. Orden visible **antes** de cualquier paso de entorno:
   1. `Resolviendo runner...` — 0%
   2. `Preparando runner (simulado)...` — 15%
   3. `Instalando DXVK (simulado)...` — 30%
   4. `Creando entorno aislado...` — 40%
4. Siguen los 8 pasos ya existentes (45 → 100) sin cambiar copy ni porcentajes.
5. Al terminar: botón **Jugar**, `progress === null`, tools unlock igual que hoy.

Reduced-motion: sin cambio. Sigue `prepareInstant` (ready inmediato, logs intro + `[demo] ¡Listo!`, sin barra).

### 1.2 Sliders sin overflow horizontal (P0)

En la misma isla compacta de `#work`, viewport desktop del spotlight (p.ej. 1280×720, card `md:grid-cols-2`):

1. `document.querySelector('.ro-demo').scrollWidth <= document.querySelector('.ro-demo').clientWidth` (igualdad; no scrollbar horizontal).
2. Paneles AutoPot y Spammer: el thumb del range queda **dentro** del borde del panel, no recortado por el chrome de la isla ni empujando el layout.
3. Tras Preparar → Jugar, arrastrar Lectura (10–200) y Delay (16–50): el thumb sigue dentro; el valor `Nms` permanece visible a la derecha, `shrink-0`.
4. Compact en 1 columna (viewport ~375px, combate `grid-cols-1`): tampoco overflow-x.

Full `#demo`: mismos classNames; no se mide como P0, no se restila.

### 1.3 Invariantes (NO-GO si se rompen)

1. Scroll fix de `#demo` intacto: no editar `preserveWindowScroll.ts`, no volver a `disabled` HTML en Launch/Reset, no tocar `#demo { overflow-anchor: none }`, no `scrollIntoView` en logs.
2. No densificar AutoPot/Spammer: cero cambios de `gap`, `px`/`py`, `min-h-[16rem]`, StatBar, teclas, selects HP/SP, modo proactivo, copy.
3. No rediseñar rail, tabs, spotlight, crop, `aspect-video`, `max-h-[36rem]`.
4. Timer sigue 350 ms/paso + hold 350 ms en 100%. No acelerar para “compensar” 3 pasos extra.
5. No merge a `main`.

---

## 2. Decisiones cerradas (cero ambigüedad)

| Tema | Decisión |
| ---- | -------- |
| Dónde viven los 3 pasos nuevos | **Solo** prepend en `PREPARE_STEPS`. Reducer/timer/LaunchBar ya consumen el array. |
| Copy exacto (ASCII `...`, no ellipsis unicode `…`) | `Resolviendo runner...` · `Preparando runner (simulado)...` · `Instalando DXVK (simulado)...` |
| `~15%` / `~30%` del brief | Enteros **15** y **30**. |
| Porcentajes 40–100 existentes | **Idénticos**. No reescalar la curva. |
| ¿Editar `RoLauncherDemo.tsx` / `usePrepareTimer`? | **No.** `PREPARE_STEPS.length` ya gobierna. 12 pasos × 350 ms + hold 350 ms ≈ 4.55 s hasta Jugar. |
| ¿Editar `DemoLaunchBar.tsx` para 0%? | **No.** `{progress && …}` + `width: ${percent}%` ya pintan 0%. Tocarlo arriesga el `aria-disabled` del scroll fix. |
| ¿Mostrar logs en compact para las etiquetas? | **No.** La barra del rail es la superficie en `#work`. |
| ¿Cambiar `prepareInstant` / reduced-motion? | **No.** |
| ¿Cambiar `LOG_PREPARE_INTRO` u otras constantes de log? | **No.** Cada paso sigue logueando `[demo] ${step}` vía `prepareStart`/`prepareTick`. En full, runner/DXVK aparecen en logs **antes** de entorno. En compact no hay panel de logs. |
| Fila slider | Añadir exactamente `min-w-0 overflow-hidden` al container flex. |
| Range | Reemplazar `flex-1 accent-amber-500 disabled:opacity-50` por `flex-1 min-w-0 w-full accent-amber-500 disabled:opacity-50`. |
| Labels `Lectura` / `Delay` y `Nms` | Conservar `shrink-0`. No achicar `w-10` / `w-8`. |
| ¿`min-w-0` extra en `panelShell` / `panelBody` / grid combate? | **No.** El brief cierra la fila + el range. No rediseñar el panel. |
| ¿Tocar Buffs / Autobuff? | **No.** No tiene esos sliders. |
| ¿Tocar `types.ts` / `clampAutopotDelay` / `clampSpammerDelay`? | **No.** Rangos 10–200 y 16–50 siguen. |
| Archivos nuevos | **Ninguno.** |

---

## 3. Implementación archivo por archivo

Orden de edición. **Tres archivos. Nada más.**

### 3.1 `src/components/ro-launcher-demo/demo.logic.ts` líneas 12–22

Reemplazar el array `PREPARE_STEPS` por **exactamente**:

```ts
export const PREPARE_STEPS: { step: string; percent: number }[] = [
  { step: 'Resolviendo runner...', percent: 0 },
  { step: 'Preparando runner (simulado)...', percent: 15 },
  { step: 'Instalando DXVK (simulado)...', percent: 30 },
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

No tocar `prepareStart` / `prepareTick` / `prepareDone` / `prepareInstant` / `resetPrefix`. El índice 0 pasa a ser runner 0%; los logs de full y el texto de la barra siguen a `PREPARE_STEPS[i]`.

No reordenar. No interpolar pasos extra. No traducir `(simulado)`.

### 3.2 `src/components/ro-launcher-demo/center/DemoAutopot.tsx` líneas 122–146

Hoy:

```tsx
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-600 uppercase tracking-wide shrink-0">
            Lectura
          </span>
          <input
            type="range"
            min={10}
            max={200}
            step={1}
            disabled={!ready}
            value={state.autopotDelayMs}
            onChange={e =>
              dispatch({
                type: 'setAutopotField',
                field: 'delayMs',
                value: Number(e.target.value),
              })
            }
            className="flex-1 accent-amber-500 disabled:opacity-50"
            aria-label="Delay de lectura AutoPot"
          />
```

Queda: el `div` pasa a `className="flex items-center gap-2 min-w-0 overflow-hidden"`. El `input` pasa a `className="flex-1 min-w-0 w-full accent-amber-500 disabled:opacity-50"`.

No cambiar `min`/`max`/`step`/`aria-label`/`onChange`. No cambiar el `span` del valor `w-10`. No tocar StatBar, proactivo, HP/SP, perfil de memoria, `min-h-[16rem]`, `panelBody`.

### 3.3 `src/components/ro-launcher-demo/center/DemoSpammer.tsx` líneas 71–87

Hoy:

```tsx
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-600 uppercase tracking-wide shrink-0">Delay</span>
          <input
            type="range"
            min={16}
            max={50}
            step={1}
            disabled={!ready}
            value={state.spammerDelayMs}
            onChange={e => dispatch({ type: 'setSpammerDelay', delayMs: Number(e.target.value) })}
            className="flex-1 accent-amber-500 disabled:opacity-50"
            aria-label="Delay del spammer"
          />
```

Queda: el `div` pasa a `className="flex items-center gap-2 min-w-0 overflow-hidden"`. El `input` pasa a `className="flex-1 min-w-0 w-full accent-amber-500 disabled:opacity-50"`.

No cambiar teclas F1–F9 / 0–9, `innerWell`, toggle, `w-8` del valor, `min-h-[16rem]`.

### 3.4 Fuera de alcance (no editar)

`RoLauncherDemo.tsx`, `DemoLaunchBar.tsx`, `DemoResetButton.tsx`, `preserveWindowScroll.ts`, `DemoLogs.tsx`, `DemoCenter.tsx`, `DemoAutobuff.tsx`, `DemoToolsPanel.tsx`, `DemoToolTabs.tsx`, `DemoRail.tsx`, `chrome/classes.ts`, `tokens.css`, `types.ts`, `mockData.ts`, `ProjectSpotlight.astro`, `Works.astro`, `index.astro`, `src/pages/projects/nndsk-ro-launcher.astro`, `Layout.astro`, `Header.astro`, `global.css`, `middleware.ts`, `astro.config.mjs`.

No reescribir `docs/RO_LAUNCHER_DEMO_SCROLL_FIX_PLAN.md` ni otros planes. Este archivo es la spec del implementer.

---

## 4. Por qué no hace falta más

- Prepend en `PREPARE_STEPS` basta: `prepareStart` ya asigna `progress` al índice 0; cada `prepareTick` avanza. 0% no es un caso especial.
- LaunchBar no necesita `percent === 0 ? …`: `width: 0%` en un track `overflow-hidden` es una barra vacía con label `0%`.
- `min-w-0` en la fila anula `min-width: auto` del ítem flex-col. `min-w-0 w-full` / `flex-1 min-w-0` deja encoger el range por debajo de su min-content nativo. `overflow-hidden` recorta el thumb si el UA lo pinta fuera del track. Eso es el P0; no hay que compactar el panel.
- Tres pasos extra = tres `dispatch` más. El wrapper de scroll ya captura cada tick. No retocar el lock.

---

## 5. Pasos de verificación para Composer

Sustituir `PREVIEW` por la URL Ready del check de Vercel **después** del commit de implementación (no este plan). Trailing slash (`astro.config.mjs` `trailingSlash: 'always'`).

### 5.1 Prepare 0% — home `#work`

1. Chrome con UI. Viewport **1280×720**.
2. `PREVIEW/` (home) → scroll a `#work` (o `PREVIEW/#work`).
3. Isla compacta hidratada (`client:visible`): botón **Preparar entorno** clicable.
4. DevTools en la barra (LaunchBar, texto `text-[10px]` junto al `N%`).
5. Click real en **Preparar entorno**.
6. **Inmediatamente** (antes de ~350 ms): el step es `Resolviendo runner...` y el porcentaje es `0%`.
7. Confirmar secuencia a ojo o con un observer del texto del step:

| Orden | `progress.step` | `progress.percent` |
| ----- | --------------- | ------------------ |
| 1 | Resolviendo runner... | 0 |
| 2 | Preparando runner (simulado)... | 15 |
| 3 | Instalando DXVK (simulado)... | 30 |
| 4 | Creando entorno aislado... | 40 |
| … | (existentes, sin cambio) | 45 … 100 |

Snippet opcional (pegar **antes** del click):

```js
(() => {
  const seen = [];
  const root = document.querySelector('.ro-demo');
  const mo = new MutationObserver(() => {
    const labels = [...root.querySelectorAll('.tabular-nums')];
    const pct = labels[0]?.textContent?.trim();
    const step = labels[0]?.previousElementSibling?.textContent?.trim();
    const key = `${step}|${pct}`;
    if (step && pct && seen[seen.length - 1] !== key) seen.push(key);
  });
  mo.observe(root, { subtree: true, childList: true, characterData: true });
  window.__roPrep = { seen, stop: () => mo.disconnect() };
})();
```

Tras **Jugar** (~4.55 s): `window.__roPrep.stop()` y comprobar que `seen[0]` empieza por `Resolviendo runner...|0%` y que `Preparando runner` / `Instalando DXVK` aparecen **antes** de `Creando entorno aislado`.

8. Reduced-motion (`prefers-reduced-motion: reduce`): un click → **Jugar** sin barra. No exigir los 3 pasos.

### 5.2 Overflow sliders — misma isla compacta

Antes y después de Preparar:

```js
(() => {
  const root = document.querySelector('.ro-demo');
  const dx = root.scrollWidth - root.clientWidth;
  console.log('ro-demo Δx', dx, 'PASS', dx <= 0);
})();
```

Criterio: `Δx <= 0`.

Thumbs: en AutoPot (label Lectura) y Spammer (label Delay), el círculo del range no cruza el padding derecho del panel ni empuja una scrollbar horizontal en `.ro-demo` ni en `body`.

Tras Jugar: arrastrar Lectura a 10 y a 200; Delay a 16 y a 50. `Δx` sigue `<= 0`. El texto `10ms` / `200ms` / `16ms` / `50ms` no se come el track (labels `shrink-0` intactos).

Repetir overflow en viewport **375×812** (home, spotlight apilado). Combate 1 col. Mismo `Δx <= 0`.

### 5.3 Regresión scroll `#demo` (smoke, no reabrir el plan de scroll)

No es el P0 de este brief. Un click Preparar en `PREVIEW/projects/nndsk-ro-launcher/#demo` no debe lanzar a **Problema**. Si se mide: `|Δ scrollY| ≤ 20`, hash `#demo`. Si se rompe: **revertir cualquier toque accidental** a `preserveWindowScroll.ts` / LaunchBar / `#demo`; este brief no autoriza “compensar” el scroll.

### 5.4 Repo

```text
bun run format
bun run lint
bun run format:check
bun run build
```

`bun run check` si `package.json` lo define.

---

## 6. Protocolo del implementer

1. Leer este archivo entero.
2. Partir de `0c58d7f` en `cursor/ro-launcher-featured-plan-cef7`. No revertir el scroll fix. No rebasear a `main`.
3. Aplicar §3.1 → §3.2 → §3.3. Diff esperado: un array + dos `className` de fila + dos `className` de `input`.
4. Commit (mensaje: `Tweak RO demo prepare steps and compact sliders`).
5. Push al mismo branch. Verificar en el **preview Vercel nuevo** con §5.1 y §5.2 (home `#work`), no solo local.
6. Pegar en el PR: primer step+percent al click, que runner/DXVK preceden a entorno, y `Δx` del `.ro-demo` compacto en 1280 y 375.
7. Si overflow sigue: **no** bajar `min-h-[16rem]`, no meter `overflow-x-hidden` en el chrome, no densificar. Revisar que las cuatro clases de §2 están literales en el HTML hidratado. Si el thumb nativo aún pinta fuera, `overflow-hidden` en la fila es el recorte; no achicar el panel.
8. No merge a `main`.
