# Plan: fijar scrollY en Preparar / Rearmar (caso `#demo`)

**Rol de este documento:** especificación cerrada para Composer. Cero UI en este commit de plan. Si un paso no está aquí, no se hace.

**PR:** [#2](https://github.com/Nandem1/nndsk-portfolio-astro/pull/2) · branch `cursor/ro-launcher-featured-plan-cef7`

**HEAD de partida (no revertir):** `8a6ef2b` = reset a `50ea635` + deltas de altura combat `min-h-[16rem]` / Herramientas `max-h-28` / Logs `min-h-[7rem] max-h-32` + parche parcial de logs (`scrollTop` interno, `overscroll-contain`, `overflow-anchor` solo en `.ro-demo`).

**Producción:** no mergear a `main`.

---

## 0. Bug medido (fuente de verdad = preview Vercel, no Playwright local)

URL de verificación (preview del PR, trailing slash + hash):

`https://nndsk-portfolio-astro-git-cur-371093-vicentes-projects-945ef44d.vercel.app/projects/nndsk-ro-launcher/#demo`

| Acción   | scrollY antes → después | Δ        | Hash    | Viewport resultante      |
| -------- | ----------------------- | -------- | ------- | ------------------------ |
| Preparar | 255 → 935               | **+680** | `#demo` | aterriza en **Problema** |
| Rearmar  | 500 → 955               | **+455** | `#demo` | aterriza en **Problema** |

El hash **no** se borra. El salto es `window` (documento), no el panel de logs.

**Playwright local de Composer reportó `|Δ|=0` y es un falso negativo.** No usar ese resultado como aceptación. Causas cerradas:

1. Viewport de automatización más alto que la demo → `focus()` / anchoring / `scrollIntoView` son no-ops porque Limpiar / logs / `h2` Problema ya están en pantalla.
2. `page.evaluate(() => el.click())` o CDP click sin foco real no dispara el scroll-on-focus del motor.
3. Headless no aplica overflow-anchor igual que Chrome con ventana real.
4. Medir `scrollY` en el mismo tick del click, antes de `prepareTick` (350 ms) y del rAF de anchoring, oculta el salto.

La corrección **tiene** que funcionar en Chrome real sobre esa URL con hash `#demo` y un viewport donde `#demo` sea más alto que `innerHeight` (p.ej. 1280×720).

---

## 1. Por qué el parche actual no basta

Estado en HEAD, y por qué cada pieza es insuficiente:

| Pieza actual                                                                              | Archivo:líneas                            | Por qué no cierra el NO-GO                                                                                                                                                                                                  |
| ----------------------------------------------------------------------------------------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Auto-scroll de logs con `root.scrollTop = root.scrollHeight` (ya no hay `scrollIntoView`) | `DemoLogs.tsx` 40–44, 74–76               | Correcto y **se conserva**. No mueve `window`. El salto medido sigue existiendo, así que el origen no era (solo) el sentinel.                                                                                               |
| `overscroll-contain` en el scroller de logs                                               | `DemoLogs.tsx` 76                         | Solo contiene chain de rueda/touch **dentro** del panel. No impide overflow-anchor ni scroll-on-focus del documento. **No es suficiente** (confirmado por UX).                                                              |
| `overflow-anchor: none` en `.ro-demo`                                                     | `tokens.css` 1–3                          | Según CSS Overflow, anula el ancla **en `.ro-demo` y descendientes**. No cubre captions ni el wrapper `#demo` en `nndsk-ro-launcher.astro` 129–157. El ancla candidato es el párrafo _debajo_ de la isla, todavía en vista. |
| Alturas combat 16rem / logs más bajos                                                     | `DemoCenter.tsx` 21–22, `DemoLogs.tsx` 51 | Cambian cuánto de Problema cabe bajo el fold; no impiden un `scrollTo` activo de 400–700 px.                                                                                                                                |

No hay `focus(` en el árbol de la demo hoy. Eso **no** significa que no haya scroll por foco: el motor lo hace al aplicar `HTMLElement.focus()` implícito cuando un botón **`disabled` pierde el foco**.

---

## 2. Causa raíz (cerrada, no alternativa)

Tres mecanismos se suman. Implementar los tres. No elegir uno.

### 2.1 Overflow-anchor del documento, ancla **fuera** de `.ro-demo`

`#demo` (Astro) contiene: caption superior + isla `.ro-demo` + caption inferior. Al hacer Preparar:

- `prepareStart` (`demo.logic.ts` 161–180) monta la barra de progreso (`DemoLaunchBar.tsx` 22–35, condicional `{progress && …}`) y añade 2 líneas de log.
- Cada `prepareTick` (timer `RoLauncherDemo.tsx` 20–43, cada 350 ms) añade otra línea.
- `prepareDone` (32–36) desmonta la barra (`progress: null`).

Chrome elige como ancla un nodo **visible que no tiene `overflow-anchor: none`**: el caption de `nndsk-ro-launcher.astro` 152–155 o el `h2` Problema en 161. Si el ancla está _por debajo_ de la isla que crece, el motor **sube `window.scrollY`** para dejar el ancla quieto. Resultado: la demo se va hacia arriba y Problema entra al viewport. El hash sigue `#demo` porque nadie toca `location`.

Rearmar (`resetPrefix`, `demo.logic.ts` 343–362) es **un solo commit** (log + prefix pending + tools off + helper del botón). Por eso Δ455 < Δ680: un salto, no 9 ticks. Misma clase de bug.

### 2.2 Scroll-on-focus al poner `disabled` en el botón clicado

| Acción   | Botón clicado (queda :focus) | Siguiente commit                                                       | Efecto del motor                                                                                                                                                                     |
| -------- | ---------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Preparar | `DemoLaunchBar.tsx` 36–43    | `disabled={true}` vía `launchButtonDisabled` (`demo.logic.ts` 108–110) | Un `button[disabled]` no puede ser el focused element. Chrome mueve el foco y hace `scrollIntoView` implícito.                                                                       |
| Rearmar  | `DemoResetButton.tsx` 21–26  | `disabled={!ready}` pasa a `true`                                      | Igual. El siguiente foco plausible es **Limpiar** (`DemoLogs.tsx` 64–71), que **aparece** en `prepareStart` cuando `logs.length > 0`, al fondo de una demo más alta que el viewport. |

Eso alinea los números: desde `scrollY≈255` (top de `#demo` bajo el header fijo de 5 rem, `Header.astro` 16 y 49) hasta `≈935` (tope de Problema). Rearmar parte de `500` (usuario ya bajó un poco para ver el rail) y termina cerca del mismo sitio (`955`).

Amplificador: `html { scroll-behavior: smooth }` en `global.css` 52–54. Cualquier `scrollTo`/`focus` del motor **anima** esos 400–700 px. **No tocar** `global.css` (home, nav, skip-link). El restore propio debe forzar `scroll-behavior: auto` en `documentElement` solo durante el `scrollTo` síncrono.

### 2.3 Playwright |Δ|=0 no contradice 2.1–2.2

Si `innerHeight` deja Limpiar/Problema en pantalla, el scroll-on-focus es 0. La medición de UX es en ventana real + `#demo`.

---

## 3. Aceptación (no negociable)

Tras **Preparar** (cuando el botón dice `Jugar`) **y** tras **Rearmar** (botón otra vez `Preparar entorno`):

1. `|window.scrollY_después − window.scrollY_antes| ≤ 20`
2. El `h2` cuyo `textContent.trim() === 'Problema'` cumple `getBoundingClientRect().top >= window.innerHeight` (no entra al viewport). Tolerancia: `top >= innerHeight - 1`.
3. `location.hash` sigue siendo `#demo` (con o sin `/` previa; el path no cambia).
4. No se “arregla” con `history.replaceState`, `location.hash = ''`, `scrollIntoView` sobre `#demo`, ni navegando a otra ruta.
5. No se toca layout de home (`ProjectSpotlight.astro`, `Works.astro`, `index.astro`, crop/`aspect-video`).

---

## 4. Decisiones cerradas (cero ambigüedad)

| Tema                                           | Decisión                                                                                                                                              |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| ¿Persistir/restaurar `window.scrollY`?         | **Sí, obligatorio.** Envuelve **todos** los `dispatch` de la isla (prepare ticks incluidos).                                                          |
| ¿Cuándo capturar?                              | Inmediatamente **antes** de cada `dispatch`.                                                                                                          |
| ¿Cuándo restaurar?                             | `useLayoutEffect` (antes del paint) **más 2 `requestAnimationFrame`**. Chrome ancla y mueve foco _después_ del layout.                                |
| ¿`behavior: 'smooth'` / `'auto'`?              | Nunca. `html.style.scrollBehavior = 'auto'` → `window.scrollTo(x, y)` → restaurar el style. No usar el overload que hereda `scroll-behavior: smooth`. |
| ¿`flushSync` extra en el click?                | **No.** Un solo mecanismo (dispatch envuelto + layout/rAF).                                                                                           |
| ¿`overflow-anchor` en `#demo`?                 | **Sí, obligatorio** (UX lo marcó opcional; aquí se cierra a sí). El de `.ro-demo` **se queda**.                                                       |
| ¿`overflow-anchor` solo en logs?               | **No.** Ya cubierto por `.ro-demo`. No añadir más CSS de logs.                                                                                        |
| ¿Quitar `overscroll-contain` de logs?          | **No.** Se queda. No es la solución, es inocuo.                                                                                                       |
| ¿Volver a `scrollIntoView` en logs?            | **Prohibido.**                                                                                                                                        |
| ¿`useEffect` vs `useLayoutEffect` en logs?     | Cambiar el auto-scroll interno a **`useLayoutEffect`**. Sigue siendo solo `scrollTop` del root interno.                                               |
| ¿`focus()` nuevo?                              | **No añadir** `focus()`. Si en el diff aparece uno, **obligatorio** `{ preventScroll: true }`.                                                        |
| ¿`disabled` HTML en Preparar/Rearmar?          | **Sustituir por `aria-disabled`** en esos dos botones para no expulsar el foco. Guard en `onClick`. Estilo visual: clase `btnDisabled` ya existente.  |
| ¿`onMouseDown={preventDefault}` para no focar? | **No.** Rompe el anillo de foco al click. `aria-disabled` basta.                                                                                      |
| ¿Hash / `history` / `scrollRestoration`?       | **No tocar.**                                                                                                                                         |
| ¿`global.css` `scroll-behavior`?               | **No tocar.**                                                                                                                                         |
| ¿Home / compact / spotlight?                   | **No tocar markup ni alturas.** El wrap de `dispatch` vive en el root de la isla; compact hereda el restore sin cambios de layout.                    |
| ¿Reducer / copy / timers 350 ms / pasos?       | **No tocar** `demo.logic.ts` salvo que un tipo lo exija (no lo exige).                                                                                |
| ¿Archivo nuevo del hook?                       | **Sí:** `src/components/ro-launcher-demo/preserveWindowScroll.ts`. Un solo export `usePreservedWindowScrollDispatch`.                                 |

---

## 5. Implementación archivo por archivo

Orden de edición. No crear otros archivos.

### 5.1 Nuevo: `src/components/ro-launcher-demo/preserveWindowScroll.ts`

Implementar **exactamente** esta forma (nombres libres solo si coinciden semánticamente; la semántica no):

```ts
import { useCallback, useLayoutEffect, useRef, type Dispatch } from 'react';
import type { DemoAction } from './types';

function restoreWindowScroll(x: number, y: number): void {
  const html = document.documentElement;
  const previous = html.style.scrollBehavior;
  html.style.scrollBehavior = 'auto';
  window.scrollTo(x, y);
  html.style.scrollBehavior = previous;
}

export function usePreservedWindowScrollDispatch(
  dispatch: Dispatch<DemoAction>
): Dispatch<DemoAction> {
  const savedRef = useRef<{ x: number; y: number } | null>(null);
  const rafRef = useRef<number[]>([]);

  useLayoutEffect(() => {
    const saved = savedRef.current;
    if (!saved || typeof window === 'undefined') {
      return;
    }

    restoreWindowScroll(saved.x, saved.y);

    rafRef.current.forEach(id => window.cancelAnimationFrame(id));
    rafRef.current = [];

    const raf1 = window.requestAnimationFrame(() => {
      restoreWindowScroll(saved.x, saved.y);
      const raf2 = window.requestAnimationFrame(() => {
        restoreWindowScroll(saved.x, saved.y);
        savedRef.current = null;
      });
      rafRef.current.push(raf2);
    });
    rafRef.current.push(raf1);

    return () => {
      rafRef.current.forEach(id => window.cancelAnimationFrame(id));
      rafRef.current = [];
    };
  });

  return useCallback(
    (action: DemoAction) => {
      if (typeof window !== 'undefined') {
        savedRef.current = { x: window.scrollX, y: window.scrollY };
      }
      dispatch(action);
    },
    [dispatch]
  );
}
```

No dejar rAF huérfanos: el cleanup del `useLayoutEffect` cancela `raf1` y `raf2`.

No usar `any`. No leer `location.hash`. No llamar `focus`.

### 5.2 `src/components/ro-launcher-demo/RoLauncherDemo.tsx`

Hoy: `useReducer` en 47, `usePrepareTimer(state, dispatch)` en 48, `onLaunchClick` despacha en 54/62/64, `DemoRail` / `DemoCenter` / `DemoLogs` reciben ese `dispatch`.

Cambio:

1. Importar `usePreservedWindowScrollDispatch`.
2. `const [state, dispatchRaw] = useReducer(demoReducer, initialDemoState);`
3. `const dispatch = usePreservedWindowScrollDispatch(dispatchRaw);`
4. Pasar **`dispatch` envuelto** a `usePrepareTimer`, `onLaunchClick`, `DemoRail`, `DemoCenter`, `DemoLogs`.

Así cada `prepareTick` / `prepareDone` / `prepareInstant` captura `scrollY` **antes** del commit que reflowea. No envolver solo el click de Preparar: los 8 ticks + hold de 350 ms (`RoLauncherDemo.tsx` 32–41) son commits distintos.

No añadir `className` al root. No cambiar `bodyClass` ni grid.

### 5.3 `src/pages/projects/nndsk-ro-launcher.astro` línea 129

Hoy:

```astro
<div id="demo" class="mt-8">
```

Queda:

```astro
<div id="demo" class="mt-8 [overflow-anchor:none]">
```

No mover `id="demo"`. No envolver la isla en otro frame, `aspect-video`, ni `overflow-hidden` extra. No tocar el `h2` Problema (línea 161) ni el `max-w-3xl` de la prosa (160).

### 5.4 `src/components/ro-launcher-demo/tokens.css` líneas 1–3

Dejar:

```css
.ro-demo {
  color-scheme: dark;
  overflow-anchor: none;
```

No poner `#demo` aquí (el wrapper es Astro; el arbitrary de 5.3 es la fuente). No borrar la regla de `.ro-demo`.

### 5.5 `src/components/ro-launcher-demo/logs/DemoLogs.tsx`

- Líneas 40–44: cambiar `useEffect` → `useLayoutEffect` (actualizar el import de la línea 1). Cuerpo **idéntico**: `root.scrollTop = root.scrollHeight`. Cero `scrollIntoView`.
- Línea 76: conservar `overflow-y-auto overscroll-contain`.
- Línea 51: conservar `min-h-[7rem] max-h-32`.
- No reintroducir el `div` sentinel.

### 5.6 `src/components/ro-launcher-demo/rail/DemoLaunchBar.tsx` líneas 36–43

Sustituir `disabled={disabled}` HTML por `aria-disabled`.

```tsx
<button
  type="button"
  className={`${btnBase} ${variantClass} ${disabled ? btnDisabled : ''} ${focusRing}`}
  aria-disabled={disabled}
  onClick={() => {
    if (disabled) return;
    onLaunchClick();
  }}
>
  {label}
</button>
```

`btnDisabled` (`classes.ts` 36) ya pone `pointer-events-none` + opacity. El guard cubre activación por teclado (Enter/Espacio) con `aria-disabled`.

No llamar `focus()`. No `preventDefault` en `mousedown`.

### 5.7 `src/components/ro-launcher-demo/rail/DemoResetButton.tsx` líneas 21–26

Mismo patrón:

```tsx
<button
  type="button"
  aria-disabled={!ready}
  title={helper}
  className={`${btnBase} ${btnSecondary} py-2 text-[11px] ${focusRing} ${
    !ready ? btnDisabled : ''
  }`}
  onClick={() => {
    if (!ready) return;
    dispatch({ type: 'resetPrefix' });
  }}
>
  Rearmar entorno
</button>
```

Importar `btnDisabled` desde `../chrome/classes`. Tras Rearmar el botón **conserva el foco** (ya no es `HTML disabled`), así el motor no busca a Limpiar ni hace scroll.

### 5.8 Fuera de alcance (no editar)

`demo.logic.ts`, `types.ts`, `mockData.ts`, `DemoCenter.tsx`, `DemoAutopot.tsx`, `DemoSpammer.tsx`, `DemoAutobuff.tsx`, `DemoToolsPanel.tsx`, `DemoRail.tsx` (salvo que el wrap de dispatch fluya por props, ya ocurre), `ProjectSpotlight.astro`, `Works.astro`, `index.astro`, `Layout.astro`, `Header.astro`, `global.css`, `middleware.ts`, `astro.config.mjs`, `public/scripts/site.js`.

---

## 6. Por qué este combo, no un subconjunto

- Solo `overflow-anchor` en `#demo`: no cubre el `focus()` implícito al `disabled`. Rearmar seguiría saltando si el foco vuela a Limpiar.
- Solo `aria-disabled`: no cubre overflow-anchor en los ticks de prepare (el botón ya no cambia `disabled` entre ticks, pero los logs/progreso sí reflowean).
- Solo restore en el click, no en el timer: Preparar seguiría acumulando Δ en 10 commits (`prepareStart` + 8 `prepareTick` 0→8 + hold `prepareDone`).
- Restore sin anular `scroll-behavior: smooth`: `scrollTo` animado pelea con el siguiente tick a 350 ms y **no** deja `|Δ|≤20`.
- Quitar el hash: viola aceptación 3–4. Prohibido aunque baje el Δ.

---

## 7. Pasos de verificación para Composer (preview real)

Sustituir `PREVIEW` por la URL Ready del check de Vercel del PR (mismo host que en §0). Trailing slash obligatorio (`astro.config.mjs` `trailingSlash: 'always'`).

### 7.1 Condiciones

- Chrome estable **con UI** (no solo headless). DevTools abierto.
- Viewport **1280×720** (o `innerHeight ≤ 800`). Confirmar en consola: `window.innerHeight`.
- Navegar a `PREVIEW/projects/nndsk-ro-launcher/#demo` (recarga completa, no SPA).
- Esperar a que la isla hidrate (`client:load`): el botón `Preparar entorno` es clicable.
- Confirmar `location.hash === '#demo'`.
- No pulsar el header ni enlaces. No borrar el hash.

Si `#demo` no queda cerca del top: `document.getElementById('demo').scrollIntoView({ block: 'start' })` **una vez**, luego **no** volver a llamarlo durante la prueba. Anotar `scrollY` tras ese alineado inicial.

### 7.2 Snippet (pegar en consola **antes** de clicar)

```js
(() => {
  const problema = [...document.querySelectorAll('h2')].find(
    h => h.textContent.trim() === 'Problema'
  );
  const rect = () => problema.getBoundingClientRect();
  const report = tag =>
    console.log(tag, {
      scrollY: window.scrollY,
      hash: location.hash,
      problemaTop: rect().top,
      innerHeight: window.innerHeight,
      problemaInView: rect().top < window.innerHeight && rect().bottom > 0,
    });
  window.__roScroll = { before: window.scrollY, report };
  report('BASELINE');
})();
```

### 7.3 Preparar

1. `window.__roScroll.before = window.scrollY`
2. Click real de ratón en **Preparar entorno** (no `element.click()` desde consola: eso a veces no replica foco).
3. Esperar a que el botón lea **Jugar** (~3.2 s: 9 pasos × 350 ms + hold 350 ms en `RoLauncherDemo.tsx` 32–41).
4. Ejecutar:

```js
{
  const after = window.scrollY;
  const delta = after - window.__roScroll.before;
  window.__roScroll.report('AFTER_PREPARAR');
  console.log('|Δ|', Math.abs(delta), 'PASS', Math.abs(delta) <= 20);
}
```

Criterio: `|Δ|≤20`, `hash === '#demo'`, `problemaInView === false`.

### 7.4 Rearmar

1. Sin recargar. `window.__roScroll.before = window.scrollY`
2. Click real en **Rearmar entorno**.
3. El botón de launch vuelve a **Preparar entorno**. Medir en el siguiente frame (doble rAF) si hace falta:

```js
requestAnimationFrame(() =>
  requestAnimationFrame(() => {
    const after = window.scrollY;
    const delta = after - window.__roScroll.before;
    window.__roScroll.report('AFTER_REARMAR');
    console.log('|Δ|', Math.abs(delta), 'PASS', Math.abs(delta) <= 20);
  })
);
```

Mismos criterios que 7.3.

### 7.5 Playwright (opcional, nunca único)

Si se usa, **obligatorio**:

- `viewport: { width: 1280, height: 720 }`
- `goto(PREVIEW + '/projects/nndsk-ro-launcher/#demo')`
- `locator.click()` (no `evaluate(click)`)
- `expect` **después** de `getByRole('button', { name: 'Jugar' })` visible
- assert `page.url()` contiene `#demo`
- assert `|Δ scrollY| ≤ 20` y `Problema` `top >= innerHeight`

Un `|Δ|=0` en viewport 1080p **no** cuenta.

### 7.6 Regresiones rápidas (mismo preview)

- Header / `#work` no forman parte de esta prueba.
- Compact en home: no medir, no reestilar. Solo comprobar que la isla compacta sigue renderizando (smoke).
- Reduced motion: `prepareInstant` (`RoLauncherDemo.tsx` 58–62) también pasa por el dispatch envuelto; `|Δ|≤20` igual.
- Logs: al preparar, el panel interno sigue pegado al último renglón **sin** mover la ventana.
- Teclado: Tab hasta **Preparar entorno**, Enter. Mismo `|Δ|`. El foco permanece en el botón (`aria-disabled=true`, label `Configurando...` → `Jugar`).

---

## 8. Validación de repo (después del fix, no de este plan)

```text
bun run format
bun run lint
bun run format:check
bun run build
```

`bun run check` si el `package.json` del HEAD lo define.

---

## 9. Protocolo del implementer

1. Leer este archivo entero.
2. Partir de `8a6ef2b` en `cursor/ro-launcher-featured-plan-cef7`. No rebasear a un crop/`aspect-video` posterior. No revertir las alturas 16rem / `max-h-28` / `max-h-32`.
3. Aplicar §5 en ese orden.
4. Commit del fix (mensaje: `Fix RO demo window scroll on prepare and rearm`).
5. Push al mismo branch. Verificar en el **preview Vercel nuevo** con §7, no solo local.
6. Pegar en el PR los cuatro números: `scrollY` antes/después Preparar, antes/después Rearmar, ambos `|Δ|`, `problemaInView`, `hash`.
7. Si el preview sigue NO-GO: no “compensar” bajando alturas ni quitando el hash. Revisar que el dispatch del timer usa el wrapper y que `restoreWindowScroll` anula `scroll-behavior`.
   )
