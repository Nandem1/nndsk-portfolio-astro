# Plan: craft P1 post-merge (disclaimer ×1, Hero CTA, pipeline pills)

**Rol de este documento:** especificación cerrada para Composer. Cero juicio de diseño. Si un paso no está aquí, no se hace.

**Fase actual:** solo plan. Este PR no cambia UI.

**Repo:** `Nandem1/nndsk-portfolio-astro` · live `https://nndsk.dev`  
**Base:** `main` @ merge de [PR #2](https://github.com/Nandem1/nndsk-portfolio-astro/pull/2) (`005f53b`). No rebaseear sobre otra rama. No revertir demo, spotlight ni Graphite.

**Stack:** Astro 6 estático + Tailwind v4 (`@theme`) + Bun 1.3.9.  
**Visual:** heredar Dark Graphite (`docs/DARK_GRAPHITE_PLAN.md` §§2.3–2.6). No reabrir el tema. No tocar tokens de `src/styles/global.css`.

**Producción:** no mergear a `main`, no desplegar.

**Protocolo del implementer**

1. Leer este archivo entero antes de tocar código.
2. Pegar copy y clases de las secciones 2–4. No reescribir, no “mejorar”, no añadir adjetivos.
3. Editar **solo** los dos archivos de la sección 5, en ese orden.
4. Correr los greps de la sección 7 **antes** de lint/format/build. Si un grep falla, corregir; no negociar el copy.
5. Ante duda: no hay duda. La sección 8 cierra las que parecerían abiertas.

---

## 0. Hechos verificados en `main` post-PR #2

### 0.1 Disclaimer del caso — tres menciones de no-launch

Archivo: `src/pages/projects/nndsk-ro-launcher.astro`

| #   | Superficie                       | Líneas (HEAD) | Copy actual                                                                                                            |
| --- | -------------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------- |
| 1   | Rótulo **sobre** la isla `#demo` | 136–138       | `Demo de la UI. No lanza Ragnarok Online ni instala Wine/Proton.`                                                      |
| 2   | Caption **bajo** la isla         | 158–161       | `Tema de RO-Launcher (zinc / ámbar / glass). El resto de la página sigue Dark Graphite.` + `No lanza Ragnarok Online.` |
| 3   | Párrafo de **Links**             | 252–254       | `Código en GitHub. Arriba hay una demo de la UI; no lanza el cliente.`                                                 |

Eso son **tres** avisos de “no lanza” en el chrome Graphite de la página. El P1 pide **uno**.

El caption de HEAD **no** es un `<figcaption>`: es un `<p class="text-sm text-muted mt-2 max-w-3xl">` hermano de la isla, dentro de `#demo`. No convertirlo a figure.

### 0.2 Disclaimer **fuera** de este P1 (no contar, no editar)

Estos strings viven en la isla zinc/ámbar y **no** entran al recuento ×1:

| Archivo                                         | String                                                       |
| ----------------------------------------------- | ------------------------------------------------------------ |
| `src/components/ro-launcher-demo/demo.logic.ts` | `playNotice: 'Solo demo — el sitio no lanza el cliente.'`    |
| mismo                                           | `LOG_PLAY` / `LOG_PREPARE_INTRO` / logs `[demo]`             |
| `src/pages/projects/nndsk-ro-launcher.astro`    | noscript figcaption `Activa JavaScript para usar la demo.`   |
| `src/components/ro-launcher-demo/center/*`      | `Valores de demostración. No hay cliente.` / titles disabled |

`ProjectSpotlight.astro` (home compact) **no** tiene rótulo de no-launch. No añadirle uno.

### 0.3 Hero CTAs — tres botones, un borde

Archivo: `src/components/Hero.astro` líneas 51–70.

Contenedor:

```
flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pt-4
```

Tres `<a>` con el mismo `px-6 py-3 font-medium`. Orden: `Sobre mí` (`#bio`) · `Ver trabajos` (`#work`) · `Escribeme` (`#contact`).

| CTA          | Clases extra vs las otras                                                | Peso visual HEAD       |
| ------------ | ------------------------------------------------------------------------ | ---------------------- |
| Sobre mí     | ghost Graphite 2.4 (`text-muted`, sin borde)                             | botón ghost            |
| Ver trabajos | primario Graphite 2.4 (`border border-border rounded-md` + hover accent) | ya es el único outline |
| Escribeme    | mismo ghost que Sobre mí; copy **sin tilde**                             | botón ghost            |

El fallo no es el primario: `Ver trabajos` ya usa las clases canónicas de Graphite 2.4. El fallo es que Sobre mí / Escribeme **también** tienen padding de botón (`px-6 py-3 rounded-md`), así que hay tres CTAs del mismo tamaño. No se lee “un primario”.

`docs/DARK_GRAPHITE_PLAN.md` §4 prohibió “corregir” `Escribeme` → `Escríbeme`. **Este P1 anula ese veto solo en el label visible del Hero.** Href `#contact` intacto.

### 0.4 Pipeline — un bullet de prosa, cero pills

Mismo archivo de caso, array `technicalRuntime` (líneas 35–56). El segundo ítem es:

```
lead: 'Pipeline'
rest: 'Direct3D 8/9/11 → DXVK → Vulkan. DirectDraw → dgVoodoo (opcional) → D3D11 → DXVK → Vulkan.'
```

Se pinta como `<li>` con dash `–` bajo `<h3>Runtime</h3>` (líneas 185–199). No hay diagrama. No hay Mermaid en el repo (`rg mermaid` = 0). No instalar Mermaid.

### 0.5 Graphite que se reutiliza (no inventar)

Chip / pill (Graphite 2.4, ya usado en Stack del caso y en Works):

```
px-2 py-0.5 text-xs rounded-sm bg-transparent text-muted border border-border font-mono
```

CTA primario Hero (Graphite 2.4; **ya está** en `Ver trabajos`; no cambiarlo):

```
px-6 py-3 text-foreground border border-border rounded-md hover:border-accent hover:text-accent transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-background
```

Link inline Graphite 2.4 (Bio `Ver mis proyectos`, nav, footer). Base a pegar en Sobre mí / Escríbeme, **sin** `px-6` ni `rounded-md`:

```
text-muted hover:text-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent/50 rounded-sm
```

Prohibido en los archivos tocados de esta fase: `from-`/`via-`/`to-`, `backdrop-blur`, `shadow-glass`, `shadow-glow`, `bg-accent/10`, `amber-`, `zinc-` (el chrome Graphite; la isla no se toca), `rounded-xl`, `prose`, `<pre class="mermaid">`, librería Mermaid.

---

## 1. IA / UX (cerrado)

Tres P1. Nada más.

### 1.1 Disclaimer del caso — una mención

| Superficie        | Acción                                                        | Copy final                                                                               |
| ----------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Rótulo sobre demo | **Conservar** (esta es la ×1)                                 | `Demo de la UI. No lanza Ragnarok Online ni instala Wine/Proton.`                        |
| Caption bajo demo | Quitar la segunda frase. Dejar **solo** la nota de tema.      | `Tema de RO-Launcher (zinc / ámbar / glass). El resto de la página sigue Dark Graphite.` |
| Links             | Quitar el disclaimer. Conservar GitHub + que hay demo arriba. | `Código en GitHub. Arriba hay una demo de la UI.`                                        |

No mover el rótulo. No unificar caption+rótulo. No añadir un cuarto aviso. No tocar noscript.

**Aceptación:** aviso de no-launch ×1 en la página de caso = exactamente un match de `no lanza` en `src/pages/projects/nndsk-ro-launcher.astro`.

### 1.2 Hero CTAs — un primario obvio

- **Un** primario: `Ver trabajos`. Clases Graphite 2.4 **sin cambiar**. `href="#work"`.
- `Sobre mí` y `Escríbeme`: **text links**, no ghost-buttons. Mismo orden. Mismos hrefs `#bio` / `#contact`.
- Label visible: `Escríbeme` (con tilde). Solo este nodo. No buscar-reemplazar el resto del repo.

**Aceptación:** en el bloque de CTAs del Hero hay un solo `<a>` con `border border-border`. Los otros dos no tienen `border` ni `px-6`.

### 1.3 Pipeline bajo Runtime — pills HTML, no Mermaid

Bajo `<h3>Runtime</h3>`, **antes** de la `<ul>` de bullets:

1. Label muted mono `Pipeline`.
2. Dos filas de pills Graphite, wrap en mobile:
   - `D3D 8/9/11` → `DXVK` → `Vulkan`
   - `DirectDraw` → `dgVoodoo` → `D3D11` → `DXVK` → `Vulkan`

Sacar el ítem `Pipeline` de `technicalRuntime`. Los otros cuatro bullets (Perfiles aislados, Runners, Gepard, Sin tocar el cliente) se quedan, mismo copy, misma `<ul>`.

Sin `(opcional)` en las pills. Sin `Direct3D` (el brief dice `D3D 8/9/11`). Sin glass, sin gradiente, sin SVG de flujo, sin canvas.

**Aceptación:** las dos rutas se leen en <3 s: dos líneas de chips + flechas `→`, `text-xs font-mono`, `flex-wrap`.

---

## 2. P1 — Disclaimer (copy literal)

### 2.1 Rótulo sobre la isla — NO EDITAR

```astro
<p class="text-sm text-muted mb-3 max-w-3xl">
  Demo de la UI. No lanza Ragnarok Online ni instala Wine/Proton.
</p>
```

Clases, posición (primer hijo de `#demo`), copy: idénticos a HEAD.

### 2.2 Caption bajo la isla — reemplazar el `<p>` entero

De (HEAD):

```astro
<p class="text-sm text-muted mt-2 max-w-3xl">
  Tema de RO-Launcher (zinc / ámbar / glass). El resto de la página sigue Dark Graphite.
  No lanza Ragnarok Online.
</p>
```

A:

```astro
<p class="text-sm text-muted mt-2 max-w-3xl">
  Tema de RO-Launcher (zinc / ámbar / glass). El resto de la página sigue Dark Graphite.
</p>
```

Misma clase. Un solo texto. Sin la frase `No lanza Ragnarok Online.`

### 2.3 Links — reemplazar el párrafo

De:

```
Código en GitHub. Arriba hay una demo de la UI; no lanza el cliente.
```

A:

```
Código en GitHub. Arriba hay una demo de la UI.
```

El `<h2>Links</h2>`, el `mb-6` del `<p class="text-muted leading-relaxed mb-6">`, y los CTAs Repo / `← Trabajos` **no se tocan**.

---

## 3. P1 — Hero CTAs (markup literal)

Archivo: `src/components/Hero.astro`. Editar **solo** el `div` de CTAs (HEAD 51–70). No tocar avatar, H1, `TypeScript • Go • Rust`, ni el párrafo bio.

Reemplazar el bloque entero por:

```astro
    <div
      class="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 pt-4"
      data-hero
      style="--hero-delay: 300ms"
    >
      <a
        href="#bio"
        class="inline-flex items-center py-3 font-medium text-muted hover:text-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-background rounded-sm"
      >
        Sobre mí
      </a>
      <a
        href="#work"
        class="px-6 py-3 text-foreground border border-border rounded-md hover:border-accent hover:text-accent transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-background"
      >
        Ver trabajos
      </a>
      <a
        href="#contact"
        class="inline-flex items-center py-3 font-medium text-muted hover:text-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-background rounded-sm"
      >
        Escríbeme
      </a>
    </div>
```

Notas cerradas:

- Se añade `items-center` al flex (alineación text-link ↔ botón).
- `py-3` en los text links = hit area y alineación vertical con el primario. **No** `px-6`. **No** `rounded-md`. **No** `border`.
- `rounded-sm` es el radio de focus helper Graphite 2.6, no de botón.
- No `text-sm`: el primario no lleva `text-sm`; bajar el cuerpo de los links no está pedido. El contraste es chrome (outline vs texto), no tamaño de fuente.
- No `text-accent` persistente en los links (Graphite 2.3: accent del Hero es solo la línea TypeScript • Go • Rust).
- No reordenar. No añadir un cuarto CTA. No tocar 404 / Bio / Header / Footer.

---

## 4. P1 — Pipeline pills (markup literal)

Todo en `src/pages/projects/nndsk-ro-launcher.astro`. No crear `PipelinePills.astro`. No extraer a `src/utils`.

### 4.1 Frontmatter — array `technicalRuntime`

Borrar el objeto `Pipeline` (HEAD 40–43). El array queda **exactamente** así (cuatro ítems, copy byte-a-byte):

```ts
const technicalRuntime = [
  {
    lead: 'Perfiles aislados',
    rest: 'cambiar runner crea o reutiliza otro prefix; no migra ni borra el anterior.',
  },
  {
    lead: 'Runners',
    rest: 'Proton-CachyOS + UMU administrados, o Wine portable bajo ~/.local/share/ro-launcher/runners/.',
  },
  {
    lead: 'Gepard',
    rest: 'recomendación de runner solo si el SHA-256 de gepard.dll coincide con la matriz validada. Hash desconocido = advertencia, no receta.',
  },
  {
    lead: 'Sin tocar el cliente',
    rest: 'el launcher no modifica Gepard, el cliente ni el tráfico del juego.',
  },
];
```

Añadir **después** de `technicalRuntime` (antes de `technicalHerramientas`):

```ts
const pipelineRoutes: string[][] = [
  ['D3D 8/9/11', 'DXVK', 'Vulkan'],
  ['DirectDraw', 'dgVoodoo', 'D3D11', 'DXVK', 'Vulkan'],
];

const pipelinePillClass =
  'inline-flex px-2 py-0.5 text-xs rounded-sm bg-transparent text-muted border border-border font-mono';
```

No otro array. No `as const` obligatorio; `string[][]` basta. Labels: pegar esos seis strings. No `Direct3D`. No `(opcional)`.

`technicalHerramientas` y `stackChips`: no tocar.

### 4.2 Template — insertar entre el `h3` Runtime y la `ul`

De (HEAD 185–186):

```astro
      <h3 class="text-base font-semibold text-foreground mt-6 mb-3">Runtime</h3>
      <ul class="space-y-1.5" aria-label="Runtime">
```

A:

```astro
      <h3 class="text-base font-semibold text-foreground mt-6 mb-3">Runtime</h3>
      <div class="mb-6" aria-label="Pipeline gráfico">
        <p class="text-xs font-mono text-muted mb-2">Pipeline</p>
        <div class="flex flex-col gap-2">
          {
            pipelineRoutes.map((route) => (
              <ol class="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                {route.map((stage, i) => (
                  <li class="inline-flex items-center gap-x-1.5">
                    {i > 0 && (
                      <span class="text-xs font-mono text-muted select-none" aria-hidden="true">
                        →
                      </span>
                    )}
                    <span class={pipelinePillClass}>{stage}</span>
                  </li>
                ))}
              </ol>
            ))
          }
        </div>
      </div>
      <ul class="space-y-1.5" aria-label="Runtime">
```

El `map` de `technicalRuntime` que sigue **no se toca** (mismo dash `–`, mismas clases).

Wrap mobile: `flex-wrap` + `gap-y-1`. **No** `overflow-x-auto`. **No** `whitespace-nowrap`. Si una fila no cabe a 375 px, las pills bajan de línea; la flecha viaja con el pill siguiente (está dentro del mismo `<li>`).

No `h4`. El `h3` Runtime cubre el bloque; el `p` `Pipeline` es label visual, no heading extra.

---

## 5. Lista archivo-a-archivo (orden de ejecución)

No crear otros archivos. No añadir dependencias. No tocar lockfiles.

### 5.1 `src/components/Hero.astro`

Sustituir el `div` de CTAs por el bloque de §3. Diff esperado: ~15 líneas. `data-hero` y `--hero-delay: 300ms` se conservan.

### 5.2 `src/pages/projects/nndsk-ro-launcher.astro`

En este orden interno:

1. Frontmatter: `technicalRuntime` (§4.1) + `pipelineRoutes` / `pipelinePillClass`.
2. Template Runtime: insertar el bloque pills (§4.2).
3. Caption bajo `#demo` (§2.2).
4. Párrafo de Links (§2.3).
5. Confirmar que el rótulo sobre la isla (§2.1) no se tocó.

No tocar: JSON-LD, H1, lead, meta `2026 · …`, CTAs Repo mobile, `#demo { overflow-anchor: none }`, `RoLauncherDemo`, `<noscript>`, Problema, Enfoque, Herramientas, Stack, gallery, clases `ctaPrimary` / `ctaGhost` / `backLinkClass`.

---

## 6. NON-goals (no tocar)

- Merge a `main` / deploy a `nndsk.dev`.
- Mermaid, mermaid.js, `@mermaid-js/*`, fences `mermaid`, SVG/canvas de flujo.
- Debate 16:9 / aspect-ratio del frame de la demo o de las capturas.
- P2 altura mobile de la demo (`min-h-[28rem]`, `max-h-[36rem]`, compact vs full). **No trivial:** vive en `RoLauncherDemo.tsx` + spotlight. Fuera.
- `src/components/ro-launcher-demo/**` (tema zinc/ámbar, logs, `playNotice`, prepare, tools).
- `src/components/ProjectSpotlight.astro`, `Works.astro`, `Bio.astro`, `Header.astro`, `Footer.astro`.
- `src/pages/index.astro`, `src/pages/404.astro`.
- `src/styles/global.css`, `astro.config.mjs`, `src/content.config.ts`, JSON/PNG de content.
- JSON-LD, SEO title/description del caso.
- Reabrir Graphite (tokens, radios, motion, presupuesto de accent).
- Ghost CTAs del caso (Repo primario + `← Trabajos` ghost): esa vista ya tiene un primario.
- Extraer componente nuevo para las pills.
- Hidratar nada nuevo (`client:*` extra).
- Tests nuevos. Validación = greps §7 + lint + format:check + build.

---

## 7. Aceptación (mecánica)

Correr desde la raíz del repo **después** de los dos edits, **antes** de abrir/actualizar el PR de implementación.

### 7.1 Disclaimer ×1

```bash
rg -n -i 'no lanza' src/pages/projects/nndsk-ro-launcher.astro
```

Salida esperada: **una** línea, el rótulo sobre la isla:

```
Demo de la UI. No lanza Ragnarok Online ni instala Wine/Proton.
```

Cero hits en caption. Cero hits en Links. `rg -c -i 'no lanza' src/pages/projects/nndsk-ro-launcher.astro` → `1`.

No exigir cero hits en `src/components/ro-launcher-demo` (playNotice / logs se quedan).

### 7.2 Caption = solo tema

```bash
rg -n 'Tema de RO-Launcher' src/pages/projects/nndsk-ro-launcher.astro
```

La línea (o el `<p>` contiguo) debe ser exactamente:

```
Tema de RO-Launcher (zinc / ámbar / glass). El resto de la página sigue Dark Graphite.
```

Sin `No lanza` a continuación.

### 7.3 Links sin disclaimer

```bash
rg -n 'Código en GitHub' src/pages/projects/nndsk-ro-launcher.astro
```

Exactamente:

```
Código en GitHub. Arriba hay una demo de la UI.
```

Sin `; no lanza el cliente`.

### 7.4 Hero: un primario

```bash
rg -n 'border border-border' src/components/Hero.astro
```

Un solo hit: el `<a href="#work">`.

```bash
rg -n 'px-6 py-3' src/components/Hero.astro
```

Un solo hit: el mismo `Ver trabajos`.

```bash
rg -n 'Escríbeme|Escribeme|Sobre mí|Ver trabajos' src/components/Hero.astro
```

Tres labels: `Sobre mí`, `Ver trabajos`, `Escríbeme`. Cero `Escribeme` sin tilde en este archivo.

### 7.5 Pipeline: pills, no Mermaid, no bullet Pipeline

```bash
rg -n 'mermaid|Mermaid' src/pages/projects/nndsk-ro-launcher.astro src/components/Hero.astro
```

Cero hits.

```bash
rg -n "lead: 'Pipeline'" src/pages/projects/nndsk-ro-launcher.astro
```

Cero hits.

```bash
rg -n 'D3D 8/9/11|DirectDraw|pipelinePillClass|Pipeline gráfico' src/pages/projects/nndsk-ro-launcher.astro
```

Debe listar el array, las clases y el `aria-label`.

```bash
rg -n 'from-|via-|to-|backdrop-blur|shadow-glass|bg-accent/10' src/pages/projects/nndsk-ro-launcher.astro
```

Cero hits en el markup nuevo (el archivo no los tenía; no introducirlos).

### 7.6 Manual (implementer, no este PR de plan)

Home `/` 1280 y 375:

1. Hero: `Ver trabajos` es el único botón outline. `Sobre mí` / `Escríbeme` se leen como texto.
2. Click `Ver trabajos` → `#work`. Click `Sobre mí` → `#bio`. Click `Escríbeme` → `#contact`.

Caso `/projects/nndsk-ro-launcher/` 1280 y 375:

1. Sobre la demo: el único “no lanza” de la página.
2. Bajo la demo: solo zinc/ámbar vs Graphite.
3. Runtime: label `Pipeline` + dos filas de chips; en 375 las pills wrappean, no hay scroll horizontal del bloque.
4. Links: no repite no-launch.
5. Leer las dos rutas a Vulkan en menos de tres segundos.

Isla: Preparar / Jugar / tools **igual** que HEAD. No es regresión de este P1.

### 7.7 Validación de repo

```bash
bun run lint
bun run format:check
bun run build
```

Si Prettier toca quote style de `Hero.astro` al formatear, aceptar el output de Prettier **en los archivos editados**. No reformatear el repo entero.

---

## 8. Ambiguities: NONE

| Pregunta que no hay que hacer                  | Decisión ya tomada                                                             |
| ---------------------------------------------- | ------------------------------------------------------------------------------ |
| ¿Cuál de las tres menciones se queda?          | La de **encima** de la isla. Caption y Links se recortan.                      |
| ¿El `playNotice` de la isla cuenta para el ×1? | No. El grep es el `.astro` del caso. La isla no se edita.                      |
| ¿Caption pasa a `<figcaption>`?                | No. Sigue siendo el `<p>` hermano.                                             |
| ¿Links pierde también “Arriba hay una demo”?   | No. Solo se corta el disclaimer.                                               |
| ¿Reordenar CTAs del Hero (primario primero)?   | No. Orden HEAD: Sobre mí · Ver trabajos · Escríbeme. El peso lo da el outline. |
| ¿`Escríbeme` vs `Escribeme`?                   | `Escríbeme` en el Hero. Graphite §4 queda anulado **solo** aquí.               |
| ¿Text links `text-sm`?                         | No. Mismo `font-medium` que HEAD; sin `px-6` / `border`.                       |
| ¿Tocar 404 / Bio / Footer?                     | No.                                                                            |
| ¿Pills reemplazan el bullet o se suman?        | Reemplazan. El lead `Pipeline:` sale de `technicalRuntime`.                    |
| ¿`Direct3D` o `D3D 8/9/11`?                    | `D3D 8/9/11`.                                                                  |
| ¿`(opcional)` en dgVoodoo?                     | No, en las pills.                                                              |
| ¿Mermaid “por si acaso”?                       | No. HTML pills.                                                                |
| ¿Componente nuevo?                             | No. Inline en la página de caso.                                               |
| ¿Pills también en el spotlight / home?         | No.                                                                            |
| ¿Altura mobile de la demo, 16:9?               | Fuera.                                                                         |
| ¿Añadir rótulo no-launch en home?              | No.                                                                            |

---

## 9. Fuera de esta fase (recordatorio)

Este PR de plan **solo** añade/actualiza `docs/RO_LAUNCHER_CRAFT_P1_PLAN.md`.

La implementación es un PR **siguiente**, branch nueva, todavía **sin** merge a `main`. Composer no implementa en el mismo PR que este documento.
