# Plan: reset demo RO-Launcher a `50ea635` + dos deltas

**Rol:** especificación cerrada para Composer 2.5. Cero juicio de diseño. Si un paso no está aquí, no se hace.

**Fase:** este archivo es el plan. El PR que lo contiene **no** implementa UI. El PR de implementación (siguiente agente) sí.

**No mergear a `main`.** No desplegar. No tocar el repo `nndsk-ro-launcher`.

**Base de implementación:** `origin/cursor/ro-launcher-featured-plan-cef7` (PR #2). HEAD de referencia al escribir esto: `6b597a8` (`Implement RO demo layout tweaks per plan`). Rebase sobre esa rama, no sobre `main`.

**Vicente (cerrado):** volver a la primera versión buena y aplicar **solo** ajustes chicos. Cada iteración de layout (`ff75a0e`, `6b597a8`, plan PR #5) empeoró el demo. No inventar layouts nuevos.

**Supersede:** este documento **reemplaza** `docs/RO_LAUNCHER_DEMO_LAYOUT_TWEAKS_PLAN.md` (PR #5) entero. PR #5 conservaba el frame `md:aspect-video` del caso y parcheaba encima de `ff75a0e`. Ese camino está vetado. El plan de fidelidad (`docs/RO_LAUNCHER_DEMO_FIDELITY_PLAN.md`) sigue vigente para tema zinc/ámbar, unlock de tools, fixtures y honestidad de Jugar — **no** para crop 16:9 ni para el markup de layout posterior a `50ea635`.

**Protocolo del implementer**

1. Leer este archivo entero antes de tocar código.
2. `git fetch origin cursor/ro-launcher-featured-plan-cef7 && git rebase origin/cursor/ro-launcher-featured-plan-cef7`.
3. Ejecutar la sección 6 **en ese orden**. El paso 1 es un `git checkout` de paths, no un rediseño.
4. No improvisar clases, breakpoints, `aspect-video`, props `compact`/`className`, ni copy.
5. No tocar Mercado House, Hero, Bio, EcoRetirosRM, gisan, hyprtask, Header, Footer, `Works.astro`.
6. Nunca afirmar que el sitio lanza Ragnarok Online.

---

## 0. SHA “first good” (cerrado, sin ambigüedad)

| Campo                   | Valor                                                                                                                                                                                                                                       |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **SHA corto**           | `50ea635`                                                                                                                                                                                                                                   |
| **SHA completo**        | `50ea63560974a535a3824cfbec5768dfd54c1ff8`                                                                                                                                                                                                  |
| **Mensaje**             | `Implement RO launcher demo fidelity (zinc/amber, center tools)`                                                                                                                                                                            |
| **Padre**               | `6d6d12b` (solo el plan de fidelidad; sin UI extra)                                                                                                                                                                                         |
| **Por qué es el bueno** | Primera UI con tema real zinc/ámbar/glass, centro AutoPot / Spammer / AutoBuff desbloqueable tras Preparar, Herramientas+Logs solo en `full`, home compact **sin** crop `aspect-video`, caso **sin** frame 16:9. Vicente: UX GO de esa era. |

Candidatos **descartados** (no preguntar a Vicente):

| SHA                    | Por qué no                                                                                                                                                                                                                                   |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `e9de571`              | Primera isla interactiva, pero Graphite (no zinc/ámbar), tools del centro disabled, árbol plano. Anterior a fidelidad.                                                                                                                       |
| `ff75a0e`              | Metió `aspect-video overflow-hidden` en home y `md:aspect-video` en el caso. Recortó el rail en `#work`. Origen del empeoramiento.                                                                                                           |
| `6b597a8` (HEAD PR #2) | Intentó deshacer el crop del home y achicar logs, pero dejó el frame 16:9 del caso, el grid `h-full`/`overflow-hidden`/`className`, props `compact`, y logs a `max-h-[5.5rem]`. Sigue siendo el layout de `ff75a0e` parcheado, no `50ea635`. |

**Método de restore:** `git checkout 50ea635 -- <paths>`. **No** `git revert` de `ff75a0e`/`6b597a8` (ensucia el historial de PR #2 y no es más claro). **No** `git reset --hard 50ea635` (tiraría planes y commits ajenos al demo).

---

## 1. Restore — paths exactos

Después del rebase, **un solo comando**, sin editar a mano todavía:

```bash
git checkout 50ea635 -- \
  src/components/ro-launcher-demo \
  src/components/ProjectSpotlight.astro \
  src/pages/projects/nndsk-ro-launcher.astro
```

Eso restaura el directorio entero del island (árbol idéntico a HEAD: no hay archivos extra post-`50ea635`) más los dos wrappers.

**Inventario (25 files bajo `ro-launcher-demo/` + 2 wrappers).** Los 10 que **hoy** difieren de `50ea635` y deben volver:

| Path                                                        | Qué se tira al restaurar                                                                                                             |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `src/components/ProjectSpotlight.astro`                     | `md:min-h-[32rem]` extra; `caseStudyDemoHref` `#demo` (vuelve el href del caso sin hash, como `50ea635`)                             |
| `src/components/ro-launcher-demo/RoLauncherDemo.tsx`        | prop `className`, grids distintos compact/full, `h-full overflow-hidden`, `compact={}`                                               |
| `src/components/ro-launcher-demo/center/DemoCenter.tsx`     | prop `compact`, `md:grid-cols-2`, `flex-1 overflow-hidden` extra                                                                     |
| `src/components/ro-launcher-demo/center/DemoAutopot.tsx`    | prop `compact`, `min-h-[14rem] md:min-h-[16rem]`                                                                                     |
| `src/components/ro-launcher-demo/center/DemoSpammer.tsx`    | igual                                                                                                                                |
| `src/components/ro-launcher-demo/center/DemoAutobuff.tsx`   | igual                                                                                                                                |
| `src/components/ro-launcher-demo/center/DemoToolsPanel.tsx` | `max-h-[5.5rem]`, `w-max min-w-full sm:min-w-[28rem]`                                                                                |
| `src/components/ro-launcher-demo/logs/DemoLogs.tsx`         | alturas `5.5rem` **y** el `scrollTop` de `6b597a8` (el SHA bueno todavía tiene `scrollIntoView`; el delta §3 lo vuelve a matar bien) |
| `src/components/ro-launcher-demo/rail/DemoRail.tsx`         | prop `compact`                                                                                                                       |
| `src/pages/projects/nndsk-ro-launcher.astro`                | wrapper `md:aspect-video md:min-h-[32rem]` + `className="h-full …"`                                                                  |

Tras el checkout, verificar:

```bash
git diff 50ea635 -- \
  src/components/ro-launcher-demo \
  src/components/ProjectSpotlight.astro \
  src/pages/projects/nndsk-ro-launcher.astro
```

Debe ser **vacío**. Si no, parar.

**No restaurar** `docs/`, lockfiles, `astro.config.mjs`, ni nada fuera de esos paths.

### 1.1 Cómo debe quedar el layout restaurado (no reimplementar: es el texto de `50ea635`)

**Home** (`ProjectSpotlight.astro`, rama con thumbnail):

```
min-h-[28rem] border-b md:border-b-0 md:border-r border-border bg-card p-3
```

```astro
<RoLauncherDemo client:visible variant="compact" />
```

Cero `aspect-video` en esa columna. Cero `className` en el island compact.

**Island compact** (`RoLauncherDemo.tsx`):

- Root: `` `${demoChrome} ${isCompact ? 'min-h-[28rem]' : ''}` ``
- Body: `` `grid grid-cols-1 @min-[40rem]:grid-cols-[minmax(220px,300px)_1fr] gap-3 p-3 ${isCompact ? 'max-h-[36rem] overflow-y-auto' : 'min-h-[28rem]'}` ``
- Sin prop `className`. Sin `compact={}` hacia rail/center.

**Caso** (`nndsk-ro-launcher.astro` `#demo`):

```astro
<div id="demo" class="mt-8">
  …
  <RoLauncherDemo client:load variant="full" />
```

Cero wrapper `md:aspect-video`. El island `full` crece con `min-h-[28rem]` propio. `id="demo"` se queda (ya está en `50ea635`).

---

## 2. Delta 1 — más AutoPot / Spammer / Buffs, menos Herramientas / Logs

Ámbito: **solo clases de altura** en el island restaurado. No props nuevas. No grids nuevos. Compact y full **comparten** las mismas clases de panel (como `50ea635`). Compact no monta Herramientas ni Logs (`showTools={!isCompact}`), así que el recorte de esas dos regiones solo se ve en el caso `full`.

Baseline `50ea635` → target (ajuste chico, **no** los `5.5rem` de PR #5 / `6b597a8`):

| Archivo                               | Clase hoy (`50ea635`)                                                    | Clase target                                                       |
| ------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `center/DemoToolsPanel.tsx` body      | `` `${panelBody} max-h-40 overflow-x-auto overflow-y-auto` ``            | `` `${panelBody} max-h-28 overflow-x-auto overflow-y-auto` ``      |
| `logs/DemoLogs.tsx` `<section>`       | `` `${panelShell} shrink-0 flex flex-col min-h-[11rem] max-h-44` ``      | `` `${panelShell} shrink-0 flex flex-col min-h-[7rem] max-h-32` `` |
| `center/DemoCenter.tsx` grid combate  | `grid grid-cols-1 @min-[28rem]:grid-cols-2 gap-2.5 h-full min-h-[12rem]` | mismo grid, `min-h-[16rem]`                                        |
| `center/DemoAutopot.tsx` `<section>`  | `` `${panelShell} h-full min-h-[12rem] ${tone}` ``                       | `min-h-[16rem]`                                                    |
| `center/DemoSpammer.tsx` `<section>`  | `` `${panelShell} h-full min-h-[12rem] ${tone}` ``                       | `min-h-[16rem]`                                                    |
| `center/DemoAutobuff.tsx` `<section>` | `` `${panelShell} h-full min-h-[12rem] w-full ${tone}` ``                | `min-h-[16rem]`                                                    |

Cerrado:

- `max-h-40` (10rem) → `max-h-28` (7rem) en Herramientas. Diagnostics sigue **dentro** del body con overflow; si no cabe, scroll interno.
- Logs `max-h-44` (11rem) → `max-h-32` (8rem), `min-h-[11rem]` → `min-h-[7rem]`.
- Combate/buffs `min-h-[12rem]` → `min-h-[16rem]` en los **cuatro** sitios (grid + 3 paneles).
- No tocar `grid-cols-3`, ToolCards, tabs Combate/Buffs, copy, toggles, ni `demo.logic.ts`.
- No reintroducir `compact?: boolean`.
- No usar `max-h-[5.5rem]` ni `min-h-[4.75rem]` (eran del frame 16:9).

---

## 3. Delta 2 — P0 hard fix: el documento no scrollea en Preparar / Rearmar / logs

### 3.1 Evidencia (no negociar la causa)

Medición de Vicente en el caso `/projects/nndsk-ro-launcher/#demo`:

- `location.hash` **puede quedarse** `#demo`.
- `window.scrollY` igual salta ~`334` → ~`935` (Δ ≈ 600px).
- La sección **Problema** (`<h2>Problema</h2>` en el caso, ~L169 hoy; **sin** `id`) entra al viewport.

Conclusión cerrada: **arreglar el hash no basta.** No borrar `#demo`, no reescribir `location.hash`, no “scrollear de vuelta” a `#demo` con `scrollIntoView`. Eso es otra fuente de salto.

Causa primaria en `50ea635` (`logs/DemoLogs.tsx`):

```ts
bottomRef.current?.scrollIntoView({ behavior: 'auto' });
```

El effect depende de `[logs, state.logChannel]`. Cadena:

1. **Preparar entorno** → `prepareStart` → dos `appendGameLog`. Cada 350ms `prepareTick` (9 steps en `PREPARE_STEPS`) → otro log. Al final `prepareDone`.
2. **Rearmar entorno** → `resetPrefix` → `appendGameLog(LOG_RESET)`.
3. **Jugar** (ready) → `appendGameLog(LOG_PLAY)` — mismo effect; también cubierto por este fix.
4. `scrollIntoView` sin `block` usa `block: 'start'` y recorre **todos** los scrollers, incluido el documento. El sentinel está al fondo del panel Logs, abajo de `#demo`. Alinearlo al top del viewport deja **Problema** en pantalla. Durante `Configurando...` el effect se re-dispara ~9 veces → secuestra el scroll.

`DemoLogs` solo se monta en `variant="full"`. Home compact no tiene este bug.

`6b597a8` ya cambió a `scrollTop` sobre HEAD viejo; al restaurar `50ea635` **el `scrollIntoView` vuelve**. Hay que matarlo de nuevo, y endurecer contra focus / overflow-anchor / scroll chaining. No confiar en “el hash es `#demo`”.

No es `type="button"` (ya está). No hay `<a>` envolviendo el island. No hay `id="problema"`. No tocar `DemoLaunchBar.tsx` ni `DemoResetButton.tsx` “por si acaso”.

### 3.2 Fix obligatorio — `DemoLogs.tsx`

Estado restaurado: `bottomRef` + sentinel `<div ref={bottomRef} />` + `scrollIntoView`.

Hacer **exactamente**:

1. `const scrollRootRef = useRef<HTMLDivElement>(null);`
2. Poner `ref={scrollRootRef}` en el div que **ya** tiene `overflow-y-auto` (body de logs).
3. Añadir `overscroll-contain` a ese mismo div (Tailwind: `overscroll-behavior: contain`; corta scroll chaining al documento).
4. Reemplazar el effect por:

```ts
useEffect(() => {
  const root = scrollRootRef.current;
  if (!root) return;
  root.scrollTop = root.scrollHeight;
}, [logs, state.logChannel]);
```

5. Borrar `bottomRef` y el `<div ref={bottomRef} />` del final de la lista.

Clase del body de logs **después** de delta 1 + 2 (única combinación permitida):

```
`${panelBody} flex-1 min-h-0 bg-zinc-950/50 rounded-lg border border-white/[0.04] overflow-y-auto overscroll-contain font-mono text-[11px] leading-relaxed mx-3 mb-2`
```

**Prohibido** en todo `src/components/ro-launcher-demo/`:

- `scrollIntoView` (cualquier `block`, incluido `'nearest'` / `'end'` / `{ inline: 'nearest' }`).
- `window.scrollTo` / `window.scrollBy` / asignar `document.documentElement.scrollTop` o `document.body.scrollTop`.
- `element.focus(...)` sin `{ preventScroll: true }`. Hoy no hay `.focus(`; no añadir.
- Mutar `location.hash` / `history.pushState` / `history.replaceState` para “devolver” a `#demo`.
- `id="problema"` u otras anclas nuevas.
- Un `useEffect` que lea `window.scrollY` y lo restaure (parchar el síntoma). El documento **no debe moverse**.

### 3.3 Fix obligatorio — layout thrash (`tokens.css`)

Archivo: `src/components/ro-launcher-demo/tokens.css`.

En el bloque `.ro-demo` existente, añadir **una** declaración:

```css
overflow-anchor: none;
```

Queda:

```css
.ro-demo {
  color-scheme: dark;
  overflow-anchor: none;
  background-color: #09090b;
  /* … resto intacto … */
}
```

Motivo: al aparecer la barra de progreso (`prepareStart`) y al crecer las líneas de log, el overflow-anchor del documento puede ajustar `scrollY` aunque ya no haya `scrollIntoView`. Vicente pidió matar layout thrash que scrollea el documento. No cambiar gradientes ni sombras.

### 3.4 Aceptación P0 (UX medida — no basta un screenshot)

Correr en `/projects/nndsk-ro-launcher/#demo` (o `/projects/nndsk-ro-launcher/#demo` con trailing slash; el `id="demo"` es el mismo), viewport ~1280. Entrar a la página, esperar hidratación (`client:load`), **no** scrollear a mano después.

En consola (o computer-use equivalente), **antes** del click:

```js
const y0 = window.scrollY;
const hash0 = location.hash;
const problema = [...document.querySelectorAll('h2')].find(
  h => h.textContent.trim() === 'Problema'
);
```

**Preparar entorno**

1. Click **Preparar entorno**.
2. Esperar a `¡Listo!` / botón **Jugar** (9 ticks × 350ms + 350ms `prepareDone` ≈ 3.5–4 s). **No** scrollear a mano.
3. Durante `Configurando...` muestrear `window.scrollY` al menos al inicio, a mitad, y al terminar.

Pass **solo si todos** se cumplen:

| Check             | Criterio                                                                                                                                                                                                                                                                                                                                                                                 |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Documento estable | `Math.abs(window.scrollY - y0) <= 20` al inicio, a mitad, al `prepareDone`, y tras el último log.                                                                                                                                                                                                                                                                                        |
| Problema fuera    | `problema.getBoundingClientRect().top >= window.innerHeight` (si ya estaba bajo el fold al `y0`; no debe entrar). Si por un viewport raro Problema ya era visible **antes** del click, no empeorar: `top` no debe **bajar** más de 20px hacia el viewport (el heading no se acerca al `0`). El caso normal medido (~scrollY 334, demo en vista) tiene Problema fuera; debe seguir fuera. |
| Hash irrelevante  | `location.hash` puede seguir `#demo`. **No es criterio de pass.** Si cambia solo, es fail (algo mutó el hash).                                                                                                                                                                                                                                                                           |
| Logs internos     | El panel Logs scrollea **por dentro** (`scrollTop` cerca de `scrollHeight`); las líneas nuevas son visibles dentro del panel.                                                                                                                                                                                                                                                            |

**Rearmar entorno** (después de ready, sin scrollear a mano):

1. Guardar `y1 = window.scrollY` (debe seguir ≈ `y0`).
2. Click **Rearmar entorno**.
3. `Math.abs(window.scrollY - y1) <= 20`.
4. Problema sigue sin entrar al viewport (mismo criterio).

**Jugar** (opcional pero barato, mismo criterio ±20px). No es el bug reportado; no debe introducir uno nuevo.

**Grep de aceptación**

```bash
rg -n 'scrollIntoView|scrollTo\(|scrollBy\(|location\.hash|history\.(push|replace)State' src/components/ro-launcher-demo
rg -n '\.focus\(' src/components/ro-launcher-demo
```

Cero matches (salvo este plan en `docs/`). `overflow-anchor: none` presente en `tokens.css`. `overscroll-contain` presente en el body de logs.

Home `/#work`: compact no monta `DemoLogs`; no hay P0 de documento ahí. No “arreglar” el home con `aspect-video`.

---

## 4. Archivos — mapa

| Archivo                                                                                            | Acción                                                                   |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `src/components/ro-launcher-demo/**` (árbol completo)                                              | Restore `50ea635`, luego deltas §2–§3 solo en los files de abajo         |
| `src/components/ProjectSpotlight.astro`                                                            | Restore `50ea635`. **Stop.** Cero edits después.                         |
| `src/pages/projects/nndsk-ro-launcher.astro`                                                       | Restore `50ea635`. **Stop.** Cero edits después. (`id="demo"` ya viene.) |
| `center/DemoToolsPanel.tsx`                                                                        | Solo `max-h-40` → `max-h-28`                                             |
| `center/DemoCenter.tsx`                                                                            | Solo `min-h-[12rem]` del grid combate → `min-h-[16rem]`                  |
| `center/DemoAutopot.tsx`                                                                           | Solo `min-h-[12rem]` → `min-h-[16rem]`                                   |
| `center/DemoSpammer.tsx`                                                                           | Solo `min-h-[12rem]` → `min-h-[16rem]`                                   |
| `center/DemoAutobuff.tsx`                                                                          | Solo `min-h-[12rem]` → `min-h-[16rem]`                                   |
| `logs/DemoLogs.tsx`                                                                                | Alturas §2 + scroll fix §3.2                                             |
| `tokens.css`                                                                                       | Solo `overflow-anchor: none` en `.ro-demo`                               |
| `RoLauncherDemo.tsx` / `rail/DemoRail.tsx` / chrome / `demo.logic.ts` / `mockData.ts` / `types.ts` | Restore y **no volver a tocar**                                          |
| `Works.astro`, Header, Footer, lockfile                                                            | **No editar**                                                            |

No crear componentes. No mover archivos. No reintroducir `className` ni `compact`.

---

## 5. Fuera de alcance (rechazar si aparece en el diff)

- Cualquier `aspect-video` nuevo o conservado en thumbnail/home o en `#demo` del caso.
- Frame 16:9 / `h-full` / `className` / grids `md:grid-cols-[minmax(280px,320px)_…]` de `ff75a0e`/`6b597a8`.
- Seguir `docs/RO_LAUNCHER_DEMO_LAYOUT_TWEAKS_PLAN.md` (PR #5).
- `max-h-[5.5rem]` / `min-h-[4.75rem]` en Herramientas o Logs.
- Props `compact` / `className` en el island.
- CTA home a `#demo` (no re-añadir `caseStudyDemoHref`; no es un delta de este plan y no es un fix de scroll).
- “Fix” de scroll vía hash, `scrollTo(#demo)`, o restaurar `scrollY` en un effect.
- Sacar el centro del compact, o meter Herramientas/Logs/Rearmar en compact.
- Copy, highlights, JSON-LD, noscript, tema Graphite vs zinc/ámbar, CSP, hidratación (`client:visible` home / `client:load` caso).
- `type="button"` extra, `preventDefault`, `id="problema"`.
- Featured EcoRetirosRM / Mercado House, grid Otros, Hero, Bio.

---

## 6. Orden de implementación

1. Rebase sobre `origin/cursor/ro-launcher-featured-plan-cef7`.
2. Restore §1. Confirmar `git diff 50ea635 -- <paths>` vacío.
3. Delta 1 alturas §2 (ToolsPanel, Logs section classes, Center, Autopot, Spammer, Autobuff).
4. Delta 2 `DemoLogs` scroll §3.2 (mismo file que las alturas de logs).
5. Delta 2 `tokens.css` §3.3.
6. Grep §3.4. `bun run format` si hace falta. Validación §8 + P0 medido §3.4.

---

## 7. Checklist de aceptación

### Restore

- [ ] Diff vs `50ea635` **solo** contiene las clases de §2, el effect/ref/overscroll de §3.2, y `overflow-anchor: none` en `tokens.css`.
- [ ] Cero `aspect-video` en `ProjectSpotlight.astro` (rama con thumbnail) y en `nndsk-ro-launcher.astro`.
- [ ] Cero `className=` en usos de `RoLauncherDemo`.
- [ ] Cero `compact?: boolean` en center/rail.

### Home `/#work` ~1280 / ~1440

- [ ] Artículo 2 columnas: compact izquierda, copy+CTAs derecha.
- [ ] Columna demo `min-h-[28rem]`, `p-3`. Rail (servidores, Runner predeterminado, Avanzado, Preparar) visible, sin crop 16:9.
- [ ] Centro compact visible (tabs + AutoPot/Spammer). Scroll interno del island si rail+centro > `max-h-[36rem]`.
- [ ] Grid interno del island usa `@min-[40rem]`, no `md:` para las 2 columnas del demo.

### Home `/#work` ~375

- [ ] Demo arriba, copy abajo. Rail visible. Sin `aspect-video`.

### Caso `/projects/nndsk-ro-launcher/#demo` ~1280

- [ ] Island `full` a altura natural (`min-h-[28rem]`), **sin** wrapper 16:9.
- [ ] Herramientas body `max-h-28`. Logs `max-h-32`. AutoPot + Spammer (y AutoBuff) `min-h-[16rem]`.
- [ ] Unlock tras Preparar intacto (no reimplementar lógica).

### P0 scroll (obligatorio, medido)

- [ ] Preparar: `|Δ scrollY| ≤ 20` en todo el ciclo (~4 s). Problema **no** entra al viewport.
- [ ] Rearmar: mismo criterio.
- [ ] Hash `#demo` puede quedarse; no se usa como pass/fail ni como remedio.
- [ ] Grep: cero `scrollIntoView` / `scrollTo` / `scrollBy` / mutación de hash en el island.
- [ ] `.ro-demo { overflow-anchor: none; }` y logs `overscroll-contain`.

### No regresiones

- [ ] `bun run lint`
- [ ] `bun run format:check`
- [ ] `bun run build`
- [ ] Compact sin Herramientas, Logs ni Rearmar.
- [ ] Full con los tres.

---

## 8. Validación

```bash
bun run lint
bun run format:check
bun run build
```

Browser (`bun run preview` o `bun run dev` + computer-use):

1. `/#work` desktop: restore option A natural (`50ea635`), runner visible, **sin** crop.
2. `/projects/nndsk-ro-launcher/#demo` desktop: combate más alto que en `50ea635` puro, tools/logs más bajos, **sin** 16:9.
3. P0: click Preparar y Rearmar con `scrollY` medido (§3.4). Fail el PR si Δ > 20px o Problema entra al viewport.

---

## 9. Ambigüedades

Ninguna. Vicente confirmó el baseline `50ea635`. Decisiones cerradas:

| Tema                     | Decisión                                                                                                                                                          |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SHA                      | `50ea63560974a535a3824cfbec5768dfd54c1ff8`                                                                                                                        |
| Método                   | `git checkout 50ea635 --` de los paths §1, no revert/reset del branch                                                                                             |
| 16:9 caso                | Fuera. `50ea635` no lo tenía. No reintroducir.                                                                                                                    |
| Home crop                | Fuera.                                                                                                                                                            |
| Alturas post-restore     | Herramientas `max-h-28`, Logs `max-h-32`/`min-h-[7rem]`, combate/buffs `min-h-[16rem]`                                                                            |
| Scroll P0                | `scrollTop` interno + `overscroll-contain` + `overflow-anchor: none`. Cero `scrollIntoView`/focus-scroll/hash hacks. Δ scrollY ≤ 20. Problema fuera del viewport. |
| Hash `#demo`             | Puede quedarse. No es el bug. No es el fix.                                                                                                                       |
| CTA home `#demo`         | No re-añadir. Restore literal.                                                                                                                                    |
| PR #5 / `6b597a8` layout | Vetados como base de parche.                                                                                                                                      |
