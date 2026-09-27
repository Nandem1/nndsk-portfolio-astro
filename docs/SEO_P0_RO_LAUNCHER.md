# Plan P0 SEO: ficha producto RO-Launcher

**Rol de este documento:** especificación cerrada para Composer **2.5** (no Fast). Cero juicio de copy. Si un paso no está aquí, no se hace.

**Fase actual:** solo plan. Este PR no cambia title, description, H1 ni JSON-LD.

**Implementación:** PR de seguimiento, branch nueva desde `main`. Modelo: Composer 2.5. No Fast.

**Repo:** `Nandem1/nndsk-portfolio-astro` · live `https://nndsk.dev`  
**Página:** `https://nndsk.dev/projects/nndsk-ro-launcher/` — **ficha de producto**, no caso de estudio. Misma URL.  
**Base:** `main` @ `db9d1ba` (`Mejorar SEO y copy del case study RO-Launcher.`). No rebaseear sobre otra rama. No revertir demo, FAQ, OG por página ni el grafo JSON-LD.

**Producción:** no mergear a `main`, no desplegar.

**Protocolo del implementer**

1. Leer este archivo entero antes de tocar código.
2. Editar **solo** los dos archivos de la sección 4, en ese orden.
3. Pegar los strings de la sección 3. No reescribir, no “mejorar”, no añadir adjetivos.
4. No introducir las palabras “caso de estudio”, “case study” ni “caso” en copy/UI. Identificadores internos (`caseStudyJsonLd`, `caseStudyPath`) **no** se renombran.
5. Correr los greps de la sección 6 **antes** de lint/format/check/build. Si un grep falla, corregir; no negociar el copy.
6. Ante duda: no hay duda. La sección 8 cierra las que parecerían abiertas.

---

## 0. Posicionamiento (cerrado)

La URL es la **ficha de producto** de RO-Launcher (landing). No es un case study.

- Copy/UI que este P0 toca: tono producto. Cero “case study”.
- No reescribir el cuerpo (Problema / Enfoque / Técnico / FAQ / Links).
- No cambiar el H1 visible (ya es producto, es-CL).
- El CTA de home `Caso de estudio` **no** entra en este P0 (sección 7).

Idioma: **es-CL primario** + la frase EN exacta `Ragnarok Online Linux launcher` en title, description, `alternateName` y `keywords`.

---

## 1. Contexto GSC (hechos; no son tickets de este P0)

Property `nndsk.dev`, 28 Ago–24 Sep 2026:

- 0 clicks / 17 impressions. Solo la homepage tiene datos.
- URL de producto: no indexada (“Google does not know this URL”). Indexación ya solicitada.
- Sitemap live **sí** lista la URL. GSC leyó el sitemap en Jul 2026 con 0 discovered: anotar, no arreglar plumbing.

Verificado contra live el 2026-09-27:

| Superficie                        | Hecho                                                                                          |
| --------------------------------- | ---------------------------------------------------------------------------------------------- |
| `https://nndsk.dev/robots.txt`    | `Sitemap: https://nndsk.dev/sitemap-index.xml`, `Allow: /`                                     |
| `https://nndsk.dev/sitemap-0.xml` | incluye `https://nndsk.dev/projects/nndsk-ro-launcher/` (`priority` 0.8, `lastmod` 2026-09-18) |
| Canonical live                    | `https://nndsk.dev/projects/nndsk-ro-launcher/`                                                |
| `<html lang>`                     | `es-CL`                                                                                        |
| `robots` meta                     | `index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1`                 |

El hueco de indexación es crawl/GSC, no una URL ausente del sitemap. **No tocar** `astro.config.mjs` sitemap, `robots.txt.ts` ni `vercel.json`.

---

## 2. Audit vs `main` @ `db9d1ba` (claims verificados)

### 2.1 Confirmado — el schema NO es greenfield

`SoftwareApplication` ya existe en producción vía `softwareApplicationJsonLd` + `@graph` en la página de producto.

Live JSON-LD (bloque 2, `@graph`): `WebPage` + `SoftwareApplication` (`@id` `…#app`) + `BreadcrumbList` + `FAQPage`. `applicationCategory: GameApplication`. `operatingSystem: Linux`. `offers.price: 0`.

P0 **no** crea schema nuevo. P0 **mejora** keywords EN + title/description.

`Layout.astro` ya emite Person + WebSite. No duplicar. No tocar Layout.

### 2.2 Title / description / H1 actuales (live = source)

Archivo: `src/pages/projects/nndsk-ro-launcher.astro` L29–31 y L185–187.

| Superficie                                                                                            | Valor actual                                                                                                                                                                 | ¿P0 lo cambia? |
| ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `const title` / `<title>` / `og:title` / `twitter:title` / `WebPage.name`                             | `nndsk-ro-launcher: launcher de Ragnarok Online para Linux` (57 chars)                                                                                                       | **Sí**         |
| `const description` / meta / OG / Twitter / `WebPage.description` / `SoftwareApplication.description` | `nndsk-ro-launcher (RO-Launcher) es un launcher de Ragnarok Online para Linux: Tauri v2, React y Rust. WINEPREFIX, DXVK/Vulkan, AutoPot y supervisor de sesión.` (158 chars) | **Sí**         |
| H1 visible                                                                                            | `RO-Launcher — launcher de Ragnarok Online para Linux`                                                                                                                       | **No**         |
| `ogImageAlt`                                                                                          | `RO-Launcher (nndsk-ro-launcher) — launcher de Ragnarok Online para Linux`                                                                                                   | **No**         |

`Layout.astro` usa `title` y `description` tal cual (no añade sufijo `· nndsk`). Cambiar las dos constantes cubre document meta + nodos WebPage / SoftwareApplication.description. No editar Layout.

### 2.3 Keywords actuales — el gap real

`src/utils/jsonLd.ts` L46–47:

```ts
...(project.data.stack &&
  project.data.stack.length > 0 && { keywords: project.data.stack.join(', ') }),
```

`SoftwareApplicationExtras` **no** tiene `keywords`. Live emite:

`Tauri v2, Rust, React, Wine, Proton, DXVK, dgVoodoo`

Falta `Ragnarok Online Linux launcher`. El helper se usa también en `Works.astro` (cards home) **sin extras** — el default `stack.join` debe quedarse igual.

`alternateName` live: `["RO-Launcher","RO Launcher"]`. Falta la frase EN.

### 2.4 Claims del brief descartados o acotados

| Claim                                  | Veredicto                                                                                 |
| -------------------------------------- | ----------------------------------------------------------------------------------------- |
| Schema greenfield                      | Falso. Ya está.                                                                           |
| Hay que tocar H1                       | Falso para P0. H1 ya es ficha producto es-CL.                                             |
| Hay que tocar `nndsk-ro-launcher.json` | No en P0. Description del card home ya es producto; la homepage ya tiene impresiones GSC. |
| Sitemap no lista la URL                | Falso en live. GSC Jul/0 discovered es lag, no plumbing P0.                               |

---

## 3. Copy final (pegar tal cual)

### 3.1 Title (90 chars)

```
nndsk-ro-launcher: launcher de Ragnarok Online para Linux | Ragnarok Online Linux launcher
```

SERP puede truncar el tramo EN después de `|`. Eso está aceptado. La frase EN queda en el HTML.

Formato Prettier (`printWidth` 100): la asignación mide 107 chars, **debe** partir así:

```ts
const title =
  'nndsk-ro-launcher: launcher de Ragnarok Online para Linux | Ragnarok Online Linux launcher';
```

### 3.2 Description (167 chars)

```
Launcher de Ragnarok Online para Linux (Ragnarok Online Linux launcher). Wine/Proton, WINEPREFIX, DXVK y dgVoodoo; AutoPot sin ptrace_scope=0. Tauri v2 + React + Rust.
```

Pegar verbatim. No recortar a 160. La frase EN va en los primeros ~80 chars (visible en snippet).

`const description` también supera 100 cols: dejar que Prettier parta la string. No reescribir para “que quepa en una línea”.

### 3.3 JSON-LD — `alternateName` y `keywords`

En la llamada a `softwareApplicationJsonLd(project, { … })` de la página de producto:

**`alternateName` (reemplazar el array entero):**

```ts
alternateName: ['RO-Launcher', 'RO Launcher', 'Ragnarok Online Linux launcher'],
```

**`keywords` (nuevo extra; reemplaza el `stack.join` solo en esta página):**

```ts
keywords: [
  'Ragnarok Online Linux launcher',
  'RO-Launcher',
  'Tauri v2',
  'React',
  'Rust',
  'Wine',
  'Proton',
  'WINEPREFIX',
  'DXVK',
  'dgVoodoo',
],
```

Orden cerrado. No añadir AutoPot, UMU, Vulkan ni “supervisor de sesión” a `keywords`. Esos viven en description / cuerpo.

JSON-LD emitido (campo `keywords`, string coma-espacio, igual que hoy):

```
Ragnarok Online Linux launcher, RO-Launcher, Tauri v2, React, Rust, Wine, Proton, WINEPREFIX, DXVK, dgVoodoo
```

`SoftwareApplication.name` sigue siendo `project.data.title` → `nndsk-ro-launcher`. No override de `name`.

---

## 4. Diff intent (solo estos archivos)

### 4.1 `src/utils/jsonLd.ts` — primero

En `SoftwareApplicationExtras` añadir:

```ts
keywords?: string[];
```

Sustituir el bloque que hoy hace `keywords: project.data.stack.join(', ')` por un valor derivado:

1. Si `extras?.keywords` está definido y `length > 0` → `extras.keywords.join(', ')`.
2. Si no, el default actual: `project.data.stack` con `length > 0` → `stack.join(', ')`.
3. Si ninguno → no emitir `keywords`.

Forma esperada (ajustable a Prettier; semántica no):

```ts
const keywords =
  extras?.keywords && extras.keywords.length > 0
    ? extras.keywords.join(', ')
    : project.data.stack && project.data.stack.length > 0
      ? project.data.stack.join(', ')
      : undefined;

return {
  // ...campos existentes sin reordenar...
  ...(keywords && { keywords }),
  ...(project.data.year && { dateCreated: `${project.data.year}-01-01` }),
  applicationCategory: extras?.applicationCategory ?? 'DeveloperApplication',
  author: { '@id': personId() },
};
```

Quitar el spread viejo de `project.data.stack && … { keywords: … }`. No emitir `keywords` dos veces.

**No cambiar** la firma pública más que el extra opcional. `Works.astro` no se toca: sin `extras.keywords` el default de stack se conserva.

No añadir `keywords` al schema de content collections.

### 4.2 `src/pages/projects/nndsk-ro-launcher.astro` — segundo

1. Reemplazar `const title` y `const description` (L29–31) por las constantes de §3.1–3.2.
2. En el objeto extras de `softwareApplicationJsonLd` (hoy L74–84):
   - `alternateName` → array de §3.3.
   - Añadir `keywords` → array de §3.3.
   - Dejar intactos: `id`, `url`, `description` (la const nueva fluye sola), `applicationCategory`, `operatingSystem`, `image`, `isPartOf`, `offers`.
3. **No** renombrar `caseStudyJsonLd`.
4. **No** editar H1, FAQ, cuerpo, demo, `ogImageAlt`, breadcrumb visible, CTAs.

`WebPage.name` / `WebPage.description` ya usan `title` y `description`: se actualizan solos.

---

## 5. Archivos que el implementer no toca

- `src/layouts/Layout.astro`
- `src/content/projects/nndsk-ro-launcher.json`
- `src/content.config.ts`
- `src/components/ProjectSpotlight.astro`
- `src/components/Works.astro`
- `astro.config.mjs`
- `src/pages/robots.txt.ts`
- `vercel.json`
- `AGENTS.md`
- isla React `src/components/ro-launcher-demo/**`
- este archivo `docs/SEO_P0_RO_LAUNCHER.md` (salvo typo que rompa el plan; no “mejorar” el copy del plan)

---

## 6. Aceptación

Correr **en este orden**. Parar al primer fallo.

### 6.1 Greps de copy (antes de format)

```bash
rg -n -F "nndsk-ro-launcher: launcher de Ragnarok Online para Linux | Ragnarok Online Linux launcher" \
  src/pages/projects/nndsk-ro-launcher.astro

rg -n -F "Launcher de Ragnarok Online para Linux (Ragnarok Online Linux launcher). Wine/Proton, WINEPREFIX, DXVK y dgVoodoo; AutoPot sin ptrace_scope=0. Tauri v2 + React + Rust." \
  src/pages/projects/nndsk-ro-launcher.astro

rg -n -F "Ragnarok Online Linux launcher" src/pages/projects/nndsk-ro-launcher.astro src/utils/jsonLd.ts
```

El tercer comando: **≥ 3 hits** en la página (title, description, `alternateName`) más el array `keywords`. `jsonLd.ts` no tiene que contener la frase (es genérico).

```bash
rg -n "keywords\?:" src/utils/jsonLd.ts
```

Exactamente un extra `keywords?: string[]` en el type.

Prohibido en archivos tocados (copy/UI nueva):

```bash
rg -n -i 'caso de estudio|case study' src/pages/projects/nndsk-ro-launcher.astro src/utils/jsonLd.ts
```

Cero hits. `caseStudyJsonLd` **no** matchea esas frases; no renombrarlo para “pasar el grep”.

H1 intacto:

```bash
rg -n -F "RO-Launcher — launcher de Ragnarok Online para Linux" src/pages/projects/nndsk-ro-launcher.astro
```

Debe seguir en el `<h1>`.

### 6.2 Validación repo (obligatoria)

```bash
bun run lint
bun run format:check
bun run check
bun run build
```

Si `format:check` falla: `bun run format` y re-correr. No pelear con Prettier.

### 6.3 Post-build

```bash
rg -F "Ragnarok Online Linux launcher" dist/projects/nndsk-ro-launcher/index.html
```

Debe aparecer en:

- `<title>`
- `meta name="description"`
- `og:title` y `og:description`
- JSON-LD: `WebPage.name`, `WebPage.description`, `SoftwareApplication.description`, `alternateName`, `keywords`

```bash
rg -F "keywords" dist/projects/nndsk-ro-launcher/index.html
```

El string de keywords del app node debe ser exactamente el de §3.3.

Home no regresiona:

```bash
rg -F "Ragnarok Online Linux launcher" dist/index.html
```

Cero hits (el extra no se pasó en `Works.astro`).

No cambiar `output: 'static'`. No añadir `ClientRouter`. No tocar `bun.lock`.

---

## 7. Fuera de alcance (P0)

- Sitemap plumbing, `lastmod` hardcodeado `2026-09-18` en `astro.config.mjs`, recrawl GSC, Search Console.
- CTA home `Caso de estudio` / `aria-label` `Leer caso de estudio` / campo `caseStudyPath` / rename de `caseStudyJsonLd`.
- H1, FAQ, Problema/Enfoque/Técnico, demo, OG image, `ogImageAlt`.
- `src/content/projects/nndsk-ro-launcher.json` (card home).
- Schema nuevo (Product, Review, HowTo, Article). No segundo `@type` en SoftwareApplication.
- Blog, MDX, adapter SSR, React Compiler, islas nuevas.
- Merge a `main`, deploy, ping a Google.

Deuda consciente (no este PR): el spotlight de home sigue diciendo “Caso de estudio” hacia esta misma URL. Eso es copy de home, no meta de la URL sin indexar.

---

## 8. Decisiones cerradas

1. Title y description de Vicente: **verbatim**. No acortar la description a 160.
2. H1: **no se toca**.
3. Frase EN solo en title, description, `alternateName`, `keywords`. No en H1 ni cuerpo.
4. `keywords` extra es `string[]`; se `join(', ')` en el helper. No merge con `stack`: el array de §3.3 **reemplaza**.
5. Default del helper sin extra: sigue siendo `stack.join`. Home intacto.
6. `alternateName` añade la frase EN como **tercer** ítem; no borrar `RO Launcher`.
7. Una sola llamada a `softwareApplicationJsonLd`. No duplicar el nodo.
8. Identificadores `caseStudy*` se quedan. P0 no es un rename refactor.
9. No bump de `lastmod` del sitemap.
10. Implementer: **Composer 2.5**, no Fast.

---

## 9. Orden de implementación

1. `src/utils/jsonLd.ts` (§4.1)
2. `src/pages/projects/nndsk-ro-launcher.astro` (§4.2)
3. Greps §6.1
4. `bun run format` si hace falta
5. `bun run lint` → `format:check` → `check` → `build` → greps §6.3
6. Commit corto, p. ej. `Add EN keywords to RO-Launcher product SEO`
7. PR de implementación. No mergear. No desplegar.
