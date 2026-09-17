# Plan: tweaks de layout demo RO-Launcher (option A + centro + bug scroll)

**Rol:** especificación cerrada para Composer 2.5. Cero juicio de diseño. Si un paso no está aquí, no se hace.

**Fase:** este archivo es el plan. El PR que lo contiene **no** implementa UI. El PR de implementación (siguiente agente) sí.

**No mergear a `main`.** No desplegar. No tocar el repo `nndsk-ro-launcher`.

**Base de implementación:** `origin/cursor/ro-launcher-featured-plan-cef7` (PR #2) en el HEAD actual `ff75a0e` (`Fix RO demo layout: 16:9 case study frame and compact work crop`). Rebase sobre esa rama, no sobre `main`.

**Referencia “primera versión certera” (option A):** commit `50ea635` (`Implement RO launcher demo fidelity`). Restaurar **solo** el layout del spotlight home descrito abajo. No revertir el commit entero: el CTA a `#demo`, el frame 16:9 del caso, zinc/ámbar, unlock de tools y Rearmar se quedan.

**Supersede parcial:** este documento gana sobre `docs/RO_LAUNCHER_DEMO_FIDELITY_PLAN.md` **únicamente** en (1) crop/altura del spotlight home, (2) reparto vertical del centro en `variant="full"`, (3) auto-scroll de logs. El resto del plan de fidelidad sigue vigente (tema zinc/ámbar, fixtures, honestidad de Jugar, compact incluye centro).

**Protocolo del implementer**

1. Leer este archivo entero antes de tocar código.
2. `git fetch origin cursor/ro-launcher-featured-plan-cef7 && git rebase origin/cursor/ro-launcher-featured-plan-cef7`.
3. Ejecutar la sección 6 en ese orden.
4. No improvisar clases, breakpoints ni copy.
5. No tocar Mercado House, Hero, Bio, EcoRetirosRM, gisan, hyprtask, Header, Footer, `Works.astro` (salvo que el spotlight se rompa por import — no debería).
6. No tocar `src/pages/projects/nndsk-ro-launcher.astro` salvo grep de verificación (el wrapper 16:9 **no se edita**).
7. Nunca afirmar que el sitio lanza Ragnarok Online.

---

## 0. Qué hay hoy (PR #2 @ `ff75a0e`) y qué falla

| Hallazgo | Evidencia | Acción |
| -------- | --------- | ------ |
| Home `#work` aplasta el rail (runner no se ve) | `ProjectSpotlight.astro` L54–55: la columna de la demo tiene `aspect-video overflow-hidden`. En `md:grid-cols-2` esa columna ~50% de `max-w-5xl` (~32rem). 16:9 → altura ~18rem. Rail (Servidor + Runner + Avanzado + Preparar) no cabe. | Option A: quitar `aspect-video` del home. Restaurar altura tipo `50ea635`. |
| Compact interno usa breakpoint de **viewport** `md:` | `RoLauncherDemo.tsx` L76–77: `md:grid-cols-[280px_minmax(0,1fr)]`. El island vive en una columna ~360–512px; `md` (768px viewport) fuerza rail 280px + centro ~80–230px. `demoChrome` ya es `@container`; `50ea635` usaba `@min-[40rem]`. | Restaurar container query. No `md:` para el grid interno compact. |
| Compact `h-full` depende del crop 16:9 | Spotlight pasa `className="h-full w-full min-h-0"`. El padre ya no tendrá altura 16:9; `h-full` colapsa. | Quitar ese `className`. Compact lleva `min-h` propio. |
| Caso: AutoPot/Spammer/AutoBuff demasiado bajos | `DemoCenter.tsx` combat full: `min-h-[9rem]`. `DemoAutopot`/`DemoSpammer`/`DemoAutobuff` full: `min-h-[9rem] md:min-h-[10rem]`. Herramientas body `max-h-40` (10rem) + header. Logs `min-h-[7rem] max-h-[8.75rem]`. Dentro del 16:9 el centro pierde contra tools+logs. | Recortar Herramientas y Logs. Subir `min-h` del combate/buffs. **No** tocar el wrapper 16:9. |
| Click Preparar / Rearmar salta la página hacia “Problema” | No es `type="button"` (ya está). No hay `<a>` anidado. No existe `id="problema"`. Causa: `DemoLogs.tsx` L40–42 `bottomRef.current?.scrollIntoView({ behavior: 'auto' })`. `prepareStart` / cada `prepareTick` (350ms) / `resetPrefix` hacen `appendGameLog` → el effect dispara `scrollIntoView` con `block: 'start'` por defecto → scrollea el **documento**. El sentinel de logs está al fondo del frame `#demo`; alinear ese nodo al top del viewport deja el `<h2>Problema</h2>` (L169 del caso, sin `id`) en pantalla. Compact **no** monta `DemoLogs`, así que el bug es del caso `full`. | Reemplazar `scrollIntoView` por `scrollTop` en el overflow de logs. |

---

## 1. Option A — Home `#work` spotlight (solo home)

### 1.1 Qué se conserva (no revertir)

En `src/components/ProjectSpotlight.astro` **dejar**:

- Artículo `grid md:grid-cols-2 gap-0` (demo izquierda, copy/CTAs derecha en `md+`). Stack en `<md` (demo arriba, copy abajo).
- Columna copy intacta: kicker, H3, subtítulo, description, highlights (máx 3), stack (máx 4), CTAs.
- `const caseStudyDemoHref = \`${caseStudyHref.replace(/\/$/, '')}#demo\`;`
- Ambos CTAs primarios (mobile L93–100 y desktop L142–149) con `href={caseStudyDemoHref}`.
- `aria-label={\`Caso de estudio con demo interactiva: ${project.data.title}\`}`.
- `RoLauncherDemo client:visible variant="compact"`.
- JSON-LD, noscript `<Image>`, placeholder `aspect-video` del branch **sin** thumbnail (dead path; no tocarlo).
- Tema Graphite del card. Zinc/ámbar solo dentro del island.

### 1.2 Columna demo — clases exactas

**Hoy** (`ff75a0e`, mal):

```
relative aspect-video max-w-full overflow-hidden border-b md:border-b-0 md:border-r border-border bg-card p-2 md:p-3
```

```astro
<RoLauncherDemo client:visible variant="compact" className="h-full w-full min-h-0" />
```

**Target** (option A, alineado a `50ea635` + CTA `#demo` ya conservado):

```
min-h-[28rem] md:min-h-[32rem] border-b md:border-b-0 md:border-r border-border bg-card p-3
```

```astro
<RoLauncherDemo client:visible variant="compact" />
```

Prohibido en esta columna cuando hay thumbnail:

- `aspect-video`
- `object-cover` / crop forzado
- `h-full` / `min-h-0` pasados al island compact
- `p-2` (volver a `p-3`)

El `overflow-hidden` del `<article>` Graphite (rounded card) se queda. La columna demo **no** lleva `overflow-hidden` propio que recorte el rail.

### 1.3 `RoLauncherDemo` compact — clases exactas

`className?: string` **se queda** en las props (lo usa `full`). Compact en home **no** pasa `className`.

**Hoy compact root:**

```
`${demoChrome} h-full flex flex-col min-h-0 overflow-hidden rounded-lg border-0 ro-shadow-glass`
```

**Target compact root:**

```
`${demoChrome} min-h-[28rem] md:min-h-[32rem] flex flex-col max-w-full`
```

No `h-full`. No `rounded-lg border-0` (el chrome del island vuelve a ser `demoChrome`: `rounded-xl` + borde zinc, como `50ea635`). `demoChrome` ya incluye `@container overflow-hidden bg-zinc-950 ro-shadow-glass`.

**Hoy compact body:**

```
grid flex-1 min-h-0 grid-cols-1 md:grid-cols-[280px_minmax(0,1fr)] gap-2 md:gap-3 px-2 md:px-3 pb-2 md:pb-3 pt-0 overflow-hidden max-w-full
```

**Target compact body:**

```
grid flex-1 min-h-0 grid-cols-1 @min-[40rem]:grid-cols-[minmax(220px,300px)_1fr] gap-3 px-3 pb-3 pt-0 max-h-[36rem] overflow-y-auto max-w-full
```

Cerrado, no negociable:

- Container query `@min-[40rem]`, **nunca** `md:` para este grid. En home la columna izquierda del artículo es ~512px (`max-w-5xl` / 2) < 40rem, así que el island compact **apila** rail arriba / centro abajo. Eso es option A: el rail (y el runner) ocupan el ancho del demo y quedan arriba. El 2-col `md:grid-cols-2` es el del **artículo** (demo | copy), no el del island.
- `max-h-[36rem] overflow-y-auto` en el body compacto: si rail + centro superan, el scroll es **interno** al island, no explota `#work`.
- Quitar el wrapper extra de rail `div.min-h-0.overflow-y-auto` que metió `ff75a0e`. `DemoRail` vuelve a ser hijo directo de la celda del grid, igual que `50ea635`.

**Hoy full body — NO CAMBIAR:**

```
grid flex-1 min-h-0 grid-cols-1 md:grid-cols-[minmax(280px,320px)_minmax(0,1fr)] gap-3 p-3 pt-0 overflow-hidden max-w-full
```

**Hoy full root — NO CAMBIAR** (debe seguir llenando el 16:9):

```
`${demoChrome} h-full flex flex-col min-h-0 overflow-hidden`
```

El caso sigue pasando `className="h-full min-h-[24rem] md:min-h-0"`.

### 1.4 Compact: qué se muestra

Sin cambio de superficie respecto a fidelidad:

| Región | compact home |
| ------ | ------------ |
| Rail: Servidor, Runner predeterminado, Avanzado, Preparar/Jugar | sí |
| Centro: tabs Combate/Buffs + AutoPot/Spammer o AutoBuff | sí |
| Herramientas | no (`showTools={!isCompact}`) |
| Logs | no |
| Rearmar | no (`showReset={!isCompact}`) |

No ocultar Avanzado. No sacar el centro. Énfasis en runner = el rail deja de estar recortado por `aspect-video` y queda arriba en el stack del container.

`DemoRail` compact: conservar `compact={true}` (gap-2). Full: `gap-2.5`.

`DemoCenter` compact: conservar `compact={true}` para que AutoPot/Spammer/AutoBuff usen `min-h-0` (el compact no pelea con Herramientas/Logs).

### 1.5 Caso `#demo` 16:9 — no tocar

`src/pages/projects/nndsk-ro-launcher.astro` L133–140 se queda **literal**:

```
class="w-full max-w-full overflow-hidden rounded-md border border-border min-h-[24rem] md:aspect-video md:min-h-[32rem]"
```

```astro
<RoLauncherDemo
  client:load
  variant="full"
  className="h-full min-h-[24rem] md:min-h-0"
/>
```

`id="demo"` se queda. Prosa `max-w-3xl` se queda. Grep post-cambio: este `md:aspect-video` sigue existiendo **solo** aquí (y en cards featured de `Works.astro`, que no se tocan). El de `ProjectSpotlight.astro` en la rama **con** thumbnail desaparece.

---

## 2. Caso: más vertical para AutoPot / Spammer / AutoBuff

Ámbito: **solo `variant="full"`**. El wrapper 16:9 no cambia; se redistribuye el flex **dentro**.

### 2.1 Herramientas — menos alto

Archivo: `src/components/ro-launcher-demo/center/DemoToolsPanel.tsx`

El `<section>` sigue `shrink-0`.

**Hoy** body (L54–56):

```
`${panelBody} max-h-40 min-w-0 overflow-x-auto overflow-y-auto overscroll-x-contain`
```

**Target:**

```
`${panelBody} max-h-[5.5rem] min-w-0 overflow-x-auto overflow-y-auto overscroll-x-contain`
```

No cambiar el grid `grid-cols-3`, las ToolCards, truncate+`title`, ni Diagnostics. Diagnostics sigue **dentro** del body con overflow: si no cabe, se scrollea dentro de Herramientas, no empuja el combate.

### 2.2 Logs — menos alto

Archivo: `src/components/ro-launcher-demo/logs/DemoLogs.tsx`

**Hoy** section:

```
`${panelShell} shrink-0 flex flex-col min-h-[7rem] max-h-[8.75rem]`
```

**Target:**

```
`${panelShell} shrink-0 flex flex-col min-h-[4.75rem] max-h-[5.5rem]`
```

Tabs Juego/Tools, Limpiar, empty copy y overflow interno del body: sin cambio de markup. El body ya es `flex-1 min-h-0 overflow-y-auto`.

### 2.3 Combate / Buffs — más alto

Archivo: `src/components/ro-launcher-demo/center/DemoCenter.tsx`

**Hoy** `combatGrid` full:

```
grid grid-cols-1 md:grid-cols-2 gap-2.5 h-full min-h-[9rem] min-w-0
```

**Target** full:

```
grid grid-cols-1 md:grid-cols-2 gap-2.5 h-full min-h-[14rem] min-w-0
```

Compact `combatGrid` **no cambiar**:

```
grid grid-cols-2 gap-2 h-full min-h-0 min-w-0
```

La columna centro del island full ya es `flex flex-col …`; `DemoCenter` ya tiene `flex-1 min-h-0 overflow-hidden`; el wrap de tabpanels ya tiene `flex-1 min-h-0`. No reestructurar. Solo el `min-h` full.

Archivos: `DemoAutopot.tsx`, `DemoSpammer.tsx`, `DemoAutobuff.tsx`

**Hoy** full (el branch no-compact de className):

```
min-h-[9rem] md:min-h-[10rem]
```

**Target:**

```
min-h-[14rem] md:min-h-[16rem]
```

Conservar `h-full` y el branch compact `min-h-0`. No borrar controles, toggles, ni copy.

Resultado esperado dentro del 16:9 (~36rem de alto en `max-w-5xl`): Herramientas ~header + 5.5rem, tabs ~2rem, Logs ~5.5rem, combate/buffs el `flex-1` restante (≥14rem). HP/SP, teclas y toggles visibles sin que Herramientas/Logs se coman la columna.

---

## 3. BUG — Preparar entorno / Rearmar entorno scrollean a “Problema”

### 3.1 Causa (cerrada)

No buscar `type="button"`, `preventDefault`, ni links anidados. Ya están bien:

- `DemoLaunchBar.tsx` L36–40: `<button type="button" … onClick={onLaunchClick}>`
- `DemoResetButton.tsx` L21–27: `<button type="button" … onClick={() => dispatch({ type: 'resetPrefix' })}>`
- Spotlight: la demo **no** está envuelta en `<a>`.
- Caso: `<h2>Problema</h2>` **no** tiene `id="problema"`. No hay hash `#problema` en el markup. El usuario describe el landing visual.

Cadena real:

1. Click Preparar → `prepareStart` → `appendGameLog` (intro + primer step). Cada 350ms `prepareTick` → otro `appendGameLog`.
2. Click Rearmar (cuando `ready`) → `resetPrefix` → `appendGameLog(LOG_RESET)`.
3. `DemoLogs` effect `[logs, state.logChannel]`:

```ts
bottomRef.current?.scrollIntoView({ behavior: 'auto' });
```

4. `scrollIntoView` sin `block` usa `block: 'start'` y recorre **todos** los scrollers ancestros, incluido `document`. El nodo `bottomRef` vive al final del panel Logs, abajo del frame `#demo`. El documento salta; “Problema” queda en viewport.
5. Durante `Configurando...` el effect se re-dispara cada tick → el scroll del documento se **secuestra** a lo largo de toda la barra.

`DemoLogs` solo se monta en `full`. Home compact no tiene este bug.

### 3.2 Fix exacto

Archivo: `src/components/ro-launcher-demo/logs/DemoLogs.tsx` **únicamente** para este bug.

1. Añadir `const scrollRootRef = useRef<HTMLDivElement>(null);`.
2. Poner `ref={scrollRootRef}` en el div que **ya** tiene `overflow-y-auto` (el body de logs, hoy L72–73).
3. Reemplazar el effect por:

```ts
useEffect(() => {
  const root = scrollRootRef.current;
  if (!root) return;
  root.scrollTop = root.scrollHeight;
}, [logs, state.logChannel]);
```

4. Eliminar `bottomRef` y el `<div ref={bottomRef} />` del final de la lista. Ya no hacen falta.

**Prohibido:**

- `element.scrollIntoView(...)` en cualquier archivo bajo `src/components/ro-launcher-demo/` (incluido `{ block: 'nearest' }` — sigue pudiendo mover el documento).
- `preventDefault` / `type="button"` extra como “fix” de este bug.
- Añadir `id="problema"` al `<h2>`.
- Cambiar `demo.logic.ts` (los logs mock se quedan).

Grep de aceptación: `scrollIntoView` = 0 matches en `src/components/ro-launcher-demo/`.

---

## 4. Archivos — mapa de cambios

| Archivo | Acción |
| ------- | ------ |
| `src/components/ProjectSpotlight.astro` | Quitar `aspect-video` + `overflow-hidden` + `p-2` de la columna con thumbnail. Poner `min-h-[28rem] md:min-h-[32rem] … p-3`. Quitar `className` del `RoLauncherDemo` compact. Conservar `caseStudyDemoHref` y CTAs. |
| `src/components/ro-launcher-demo/RoLauncherDemo.tsx` | Compact root/body según §1.3. Quitar wrapper overflow del rail. Full root/body **sin cambios**. Conservar `className` prop. |
| `src/components/ro-launcher-demo/center/DemoCenter.tsx` | Solo `combatGrid` full → `min-h-[14rem]`. Compact intacto. |
| `src/components/ro-launcher-demo/center/DemoToolsPanel.tsx` | Solo `max-h-40` → `max-h-[5.5rem]`. |
| `src/components/ro-launcher-demo/center/DemoAutopot.tsx` | Full `min-h-[14rem] md:min-h-[16rem]`. Compact `min-h-0` igual. |
| `src/components/ro-launcher-demo/center/DemoSpammer.tsx` | Igual que Autopot. |
| `src/components/ro-launcher-demo/center/DemoAutobuff.tsx` | Igual que Autopot. |
| `src/components/ro-launcher-demo/logs/DemoLogs.tsx` | Alturas §2.2 + fix scroll §3.2. |
| `src/pages/projects/nndsk-ro-launcher.astro` | **No editar.** |
| `src/components/Works.astro` | **No editar.** |
| `src/components/ro-launcher-demo/rail/DemoLaunchBar.tsx` | **No editar.** |
| `src/components/ro-launcher-demo/rail/DemoResetButton.tsx` | **No editar.** |
| `src/components/ro-launcher-demo/demo.logic.ts` | **No editar.** |
| `src/components/ro-launcher-demo/chrome/classes.ts` | **No editar** (`@container` ya está en `demoChrome`). |
| Cualquier otro `src/` o lockfile | **No editar.** |

No crear componentes nuevos. No mover archivos.

---

## 5. Fuera de alcance (rechazar si aparece en el diff)

- Revert completo de `ff75a0e` (eso quitaría el CTA `#demo` y el 16:9 del caso).
- Cambiar `md:aspect-video` del caso.
- Sacar el centro del compact, o meter Herramientas/Logs/Rearmar en compact.
- Cambiar copy, highlights, stack chips, JSON-LD, noscript, CTAs (salvo que un CTA home deje de apuntar a `#demo` — eso sería un bug a corregir).
- Tema Graphite vs zinc/ámbar, tokens, CSP, hidratación (`client:visible` home / `client:load` caso).
- `type="button"` / `preventDefault` / `<form>` nuevos.
- `id="problema"` o anclas nuevas.
- Featured cards EcoRetirosRM / Mercado House, grid Otros, Hero, Bio.

---

## 6. Orden de implementación

1. `ProjectSpotlight.astro` §1.2.
2. `RoLauncherDemo.tsx` compact §1.3 (full no tocar).
3. `DemoToolsPanel.tsx` + `DemoLogs.tsx` alturas §2.1–2.2.
4. `DemoCenter.tsx` + Autopot/Spammer/Autobuff `min-h` full §2.3.
5. `DemoLogs.tsx` scroll fix §3.2 (puede ir en el mismo edit que §2.2).
6. `bun run format` si hace falta. Luego validación §8.

---

## 7. Checklist de aceptación

### Home `/#work` ~1280 y ~1440

- [ ] Artículo 2 columnas: island compact izquierda, copy+CTAs derecha.
- [ ] CTA primario “Caso de estudio” → `/projects/nndsk-ro-launcher/#demo` (mobile y desktop).
- [ ] Repo `_blank` intacto.
- [ ] Grep `ProjectSpotlight.astro`: **cero** `aspect-video` en la rama con thumbnail.
- [ ] Columna demo `min-h-[28rem] md:min-h-[32rem]`. Sin crop 16:9.
- [ ] Rail visible sin recorte: lista de servidores, panel **Runner predeterminado** (select `proton-cachyos-slr` / nombre visible), Avanzado, botón Preparar.
- [ ] Centro compact visible (tabs + AutoPot/Spammer). Si rail+centro > 36rem, scroll **dentro** del island, no la página.
- [ ] Island interno **no** usa `md:grid-cols-[280px_…]`. Sí `@min-[40rem]:…`. En este viewport el container del island es < 40rem → rail apilado encima del centro.

### Home `/#work` ~375

- [ ] Demo arriba, copy abajo. Rail + runner visibles en el primer tramo del island. CTA `#demo` presente.

### Caso `/projects/nndsk-ro-launcher/#demo` ~1280

- [ ] Wrapper sigue `md:aspect-video md:min-h-[32rem]`. Frame ~16:9.
- [ ] Rail | centro. Herramientas más bajo que hoy (`max-h-[5.5rem]` body). Logs más bajo (`max-h-[5.5rem]`). AutoPot + Spammer (Combate) y AutoBuff (Buffs) ocupan el resto; `min-h` full ≥14rem.
- [ ] Toggle AutoPot / teclas / barras HP-SP usables tras Preparar → ready (comportamiento actual, no reimplementar).

### Bug scroll

- [ ] En el caso, click **Preparar entorno**: la página **no** salta hacia “Problema”. El viewport se queda en `#demo`. La barra de progreso y los logs avanzan dentro del panel Logs (`scrollTop` interno).
- [ ] Durante `Configurando...` (varios ticks) el documento no se re-scrollea.
- [ ] Tras ready, click **Rearmar entorno**: mismo criterio; no salta a “Problema”.
- [ ] Click **Jugar** (ready): no salta la página (no usa `scrollIntoView`; solo `playNotice` + log).
- [ ] Grep `src/components/ro-launcher-demo`: cero `scrollIntoView`.
- [ ] `DemoLaunchBar` / `DemoResetButton` siguen `type="button"` (sin diff).

### No regresiones

- [ ] `bun run lint`
- [ ] `bun run format:check`
- [ ] `bun run build`
- [ ] Compact sigue sin Herramientas, Logs ni Rearmar.
- [ ] Full sigue con los tres.
- [ ] CSP / Graphite fuera del folder `ro-launcher-demo/` intactos.

---

## 8. Validación

```bash
bun run lint
bun run format:check
bun run build
```

Verificar en browser (o `bun run preview` + agente computer-use):

1. `/#work` desktop: option A, runner visible, CTA a `#demo`.
2. `/projects/nndsk-ro-launcher/#demo` desktop: 16:9, combate más alto, tools/logs más bajos.
3. Click Preparar y Rearmar: documento no se mueve a “Problema”.

---

## 9. Ambigüedades

Ninguna. Decisiones ya cerradas:

| Tema | Decisión |
| ---- | -------- |
| Option A vs crop 16:9 en home | A. Quitar `aspect-video` home. Caso 16:9 se queda. |
| Grid interno compact | Container `@min-[40rem]`, no `md:`. Home apila rail/centro dentro del island. Artículo sí 2-col en `md+`. |
| Compact incluye centro | Sí, fidelidad P0. No se saca. |
| CTA home | Sigue `#demo`. |
| Alturas tools/logs/combate | `5.5rem` / `5.5rem` / `min-h-[14rem]` (paneles `md:min-h-[16rem]`). |
| Bug scroll | `scrollTop` en overflow de logs. No `scrollIntoView`. No `type="button"` extra. |
| Archivo del caso Astro | Cero edits. |
