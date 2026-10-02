# Plan: dejar de pinear el AppImage en nndsk.dev

**Rol de este documento:** especificación cerrada para Composer **2.5** (no Fast). Cero juicio de copy. Si un
paso no está aquí, no se hace.

**Fase actual:** solo plan. Este PR no cambia UI, hrefs ni JSON-LD.

**Implementación:** PR de seguimiento, branch nueva desde `main`. Modelo: Composer 2.5. No Fast.

**Repo:** `Nandem1/nndsk-portfolio-astro` · live `https://nndsk.dev`  
**Página:** `https://nndsk.dev/projects/nndsk-ro-launcher/` — **ficha de producto**, no caso de estudio.
Misma URL.  
**Base:** `main` @ `82b8cc1` (merge PR #11 `feat/ro-launcher-appimage-cta`). No rebaseear sobre otra
rama. No revertir demo, FAQ, OG por página, grafo JSON-LD ni el P0 SEO EN.

**Visual:** Dark Graphite. No reabrir el tema. UI en español OK.

**Producción:** no mergear a `main`, no desplegar.

**Protocolo del implementer**

1. Leer este archivo entero antes de tocar código.
2. Editar **solo** los dos archivos de la sección 5, en ese orden.
3. Pegar los strings de las secciones 4 y 5. No reescribir, no “mejorar”, no añadir adjetivos.
4. No tocar title, description, H1, `alternateName`, `keywords` EN del P0 SEO.
5. Correr los greps de la sección 7 **antes** de lint/format/check/build. Si un grep falla, corregir.
6. Ante duda: no hay duda. La sección 9 cierra las que parecerían abiertas.

---

## 0. Decisión (cerrada)

**Enfoque de este PR de implementación: A.**

CTA hero, JSON-LD `downloadUrl` y el locator estable apuntan a

`https://github.com/Nandem1/nndsk-ro-launcher/releases/latest`

El usuario elige el AppImage en GitHub. Un click extra. Siempre funciona. Una release nueva del
launcher **no** exige bump del portafolio.

B y C **no** se implementan en este repo en esta fase. Ver §1 y §6.

---

## 1. Por qué A (tradeoffs verificados 2026-10-02)

GitHub `…/releases/latest/download/<filename>` **solo** sirve si `<filename>` existe como asset del
release latest. El AppImage **está versionado**. Comprobado:

| URL                                                            | Resultado                                                                                                   |
| -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `…/releases/latest`                                            | 302 → `…/releases/tag/v0.1.2` (HTML, 200)                                                                   |
| `…/releases/latest/download/RO-Launcher_0.1.2_amd64.AppImage`  | 200 **hoy**; 404 el día que latest deje de ser 0.1.2                                                        |
| `…/releases/latest/download/RO-Launcher_amd64.AppImage`        | 302 → tag latest + mismo nombre → **404** (el asset no existe)                                              |
| `…/releases/latest/download/RO-Launcher_amd64.AppImage.sha256` | **200** (checksum ya es unversioned)                                                                        |
| `…/releases/latest/download/latest.json`                       | **200** (Tauri updater)                                                                                     |
| Live CTA                                                       | pineado a `v0.1.1` / `RO-Launcher_0.1.1_amd64.AppImage` (el binario 0.1.1 sigue existiendo; está **viejo**) |

Assets reales de `v0.1.2`: `latest.json`, `RO-Launcher_0.1.2_amd64.AppImage`,
`.AppImage.sig`, `RO-Launcher_amd64.AppImage.sha256`, `sidecar-layout.txt`. **No** hay
`RO-Launcher_amd64.AppImage`.

### A — `releases/latest` (elegida)

- Siempre 302 al tag latest. Cero pin de versión en el portafolio.
- Extra: el usuario elige el `.AppImage` en la página de GitHub.
- JSON-LD `downloadUrl` deja de ser un binario concreto (schema.org prefiere el fichero). Mejor que
  un URL 404 o un 0.1.1 obsoleto. Cerrado: `downloadUrl` = `releases/latest`.
- Cumple el objetivo **solo** con este repo.

### B — asset unversioned + `latest/download/RO-Launcher_amd64.AppImage`

- One-click real. El checksum **ya** usa este patrón.
- El AppImage **no** está publicado así (404 verificado).
- Exige CI en `Nandem1/nndsk-ro-launcher` (Tauri sigue emitiendo nombre versionado; el updater
  `latest.json` firma `RO-Launcher_0.1.2_amd64.AppImage`). Habría que **añadir** una copia
  unversioned **además** del asset versionado, no sustituirlo.
- Fuera de este repo. Lista en §6. No implementar aquí.

### C — fetch build-time o cliente (`latest.json` / Releases API)

- `latest.json` ya vive en cada release (`version`, `notes`, URLs de asset de la API de GitHub).
- **Build-time:** el estático queda pineado al último deploy de Vercel. **No** cumple “sin bump”.
- **Cliente:** JS extra, `connect-src` a `api.github.com` / GitHub releases, hidratación. El sitio
  es `output: 'static'` y default zero JS. La isla React no se usa para esto. Las URLs de
  `latest.json` son `api.github.com/repos/…/releases/assets/<id>` (no un GET anónimo del AppImage).
- Más código, más superficie, no desbloquea A hoy. **No.**

No hay híbrido A+B en el PR de implementación. El checksum sí puede usar el locator unversioned
**ya existente** (`latest/download/RO-Launcher_amd64.AppImage.sha256`) sin esperar a B.

---

## 2. Hechos en `main` @ `82b8cc1` / live

Fuente única de pin: `src/utils/roLauncherRelease.ts`.

```ts
const VERSION = '0.1.1' as const;
const TAG = `v${VERSION}` as const;
const APP_IMAGE_FILE = `RO-Launcher_${VERSION}_amd64.AppImage` as const;
```

`downloadUrl` = `…/releases/download/v0.1.1/RO-Launcher_0.1.1_amd64.AppImage`.

Consumidores (solo la ficha de producto):

| Superficie        | Uso actual                                                                       |
| ----------------- | -------------------------------------------------------------------------------- |
| Hero CTA          | `href={RO_LAUNCHER_RELEASE.downloadUrl}`, label `Descargar AppImage (Linux x64)` |
| Meta bajo H1      | `· v{RO_LAUNCHER_RELEASE.version}` → live `v0.1.1`                               |
| Instalar          | filename `RO-Launcher_0.1.1_amd64.AppImage` en chmod y ejecutar                  |
| Instalar SHA-256  | `checksumUrl` pineado al tag `v0.1.1` (filename unversioned)                     |
| Instalar Releases | ya `releasesUrl` = `…/releases/latest`                                           |
| JSON-LD           | `softwareVersion: '0.1.1'`, `downloadUrl` = AppImage 0.1.1                       |

Home / spotlight **no** importan `RO_LAUNCHER_RELEASE`. No hay CTA de descarga ahí.

P0 SEO **intacto y no se toca** (live = source):

| Superficie                                                                                      | Valor                                                                                                                                    |
| ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `title` / `<title>` / `og:title` / `twitter:title` / `WebPage.name`                             | `nndsk-ro-launcher: launcher de Ragnarok Online para Linux \| Ragnarok Online Linux launcher`                                            |
| `description` / meta / OG / Twitter / `WebPage.description` / `SoftwareApplication.description` | `Launcher de Ragnarok Online para Linux. Wine, Proton, WINEPREFIX, DXVK y dgVoodoo. AutoPot sin ptrace_scope=0. Tauri v2, React y Rust.` |
| `alternateName`                                                                                 | `['RO-Launcher', 'RO Launcher', 'Ragnarok Online Linux launcher']`                                                                       |
| `keywords`                                                                                      | `Ragnarok Online Linux launcher, RO-Launcher, Tauri v2, React, Rust, Wine, Proton, WINEPREFIX, DXVK, dgVoodoo`                           |

H1 visible: `RO-Launcher`. No tocarlo.

---

## 3. Superficies de la implementación (cerradas)

### 3.1 Hero CTA

- `href` = `RO_LAUNCHER_RELEASE.releasesUrl` (`…/releases/latest`).
- Label **igual**: `Descargar AppImage (Linux x64)`.
- Añadir `target="_blank"` y `rel="noopener noreferrer"` (pasa a GitHub; el Repo de Links ya lo
  hace). Clases `ctaPrimary` intactas.
- Un `ctaPrimary` bajo el título. No segundo botón.

### 3.2 Versión visible

**Omitir.** Quitar ` · v{RO_LAUNCHER_RELEASE.version}` de la línea mono.

Queda exactamente:

```
Launcher de Ragnarok Online para Linux · 2026 · Tauri v2 · React · Rust
```

No escribir “última release”, “v0.1.2”, ni un badge dinámico. El CTA es el locator de latest.

### 3.3 Instalar

Lead intacto: `AppImage para Linux amd64.`

Tres bullets, mismo markup dash que HEAD:

1. **chmod +x:** `el AppImage de la última release`
2. **ejecutar:** `./RO-Launcher_*_amd64.AppImage`
3. **SHA-256:** link de `{checksumFileName}` a `checksumUrl` (latest/download unversioned) · link
   `Releases` a `releasesUrl`. Labels de los links iguales (`RO-Launcher_amd64.AppImage.sha256` y
   `Releases`). Clases `backLinkClass` intactas.

No hardcodear `0.1.1` ni `0.1.2` en el filename.

### 3.4 JSON-LD

Seguir usando `softwareApplicationJsonLd`. **No** editar `src/utils/jsonLd.ts` (los extras
opcionales se quedan).

En la llamada de la página:

- **Quitar** `softwareVersion: RO_LAUNCHER_RELEASE.version`. El helper no emite la clave.
- `downloadUrl: RO_LAUNCHER_RELEASE.releasesUrl` (misma URL que el CTA).

El resto del grafo (WebPage, BreadcrumbList, FAQPage, `offers`, `alternateName`, `keywords`,
`applicationCategory: GameApplication`) **intacto**.

---

## 4. Copy verbatim

### 4.1 Meta bajo H1 (reemplazo del `<p class="text-sm font-mono…">`)

```
Launcher de Ragnarok Online para Linux · 2026 · Tauri v2 · React · Rust
```

### 4.2 CTA

Texto del `<a>`: `Descargar AppImage (Linux x64)`

### 4.3 Instalar — bullets (contenido del `<span>` tras el dash)

```
chmod +x: el AppImage de la última release
ejecutar: ./RO-Launcher_*_amd64.AppImage
```

SHA-256: igual que HEAD (filename del checksum + `Releases`), solo cambia el `href` del checksum a
latest/download.

---

## 5. Lista archivo-a-archivo (orden de ejecución)

No crear otros archivos. No añadir dependencias. No tocar lockfiles.

### 5.1 `src/utils/roLauncherRelease.ts` — reemplazar el módulo entero

```ts
const GITHUB_REPO = 'https://github.com/Nandem1/nndsk-ro-launcher';
const CHECKSUM_FILE = 'RO-Launcher_amd64.AppImage.sha256' as const;

export const RO_LAUNCHER_RELEASE = {
  arch: 'amd64',
  format: 'AppImage',
  appImageFilePattern: 'RO-Launcher_*_amd64.AppImage',
  checksumFileName: CHECKSUM_FILE,
  checksumUrl: `${GITHUB_REPO}/releases/latest/download/${CHECKSUM_FILE}`,
  releasesUrl: `${GITHUB_REPO}/releases/latest`,
} as const;
```

Quitar `VERSION`, `TAG`, `APP_IMAGE_FILE`, `version`, `tag`, `appImageFileName`, `downloadUrl`.

### 5.2 `src/pages/projects/nndsk-ro-launcher.astro`

1. JSON-LD: borrar la línea `softwareVersion: RO_LAUNCHER_RELEASE.version,`. Cambiar
   `downloadUrl: RO_LAUNCHER_RELEASE.downloadUrl` → `downloadUrl: RO_LAUNCHER_RELEASE.releasesUrl`.
2. Meta bajo H1: pegar 4.1. Sin interpolación de versión.
3. CTA: `href={RO_LAUNCHER_RELEASE.releasesUrl}`, `target="_blank"`, `rel="noopener noreferrer"`,
   mismo `class={ctaPrimary}`, mismo texto 4.2.
4. Instalar: `appImageFileName` → copy 4.3. `ejecutar` usa `RO_LAUNCHER_RELEASE.appImageFilePattern`
   con el prefijo `./`. Checksum `href={RO_LAUNCHER_RELEASE.checksumUrl}` (ya latest/download tras
   5.1).

No cambiar `const title` / `const description`. No rename de `caseStudyJsonLd`. No tocar demo,
Problema, Enfoque, Técnico, FAQ, Stack, Links, breadcrumb, H1.

### 5.3 Archivos que NO se tocan

`jsonLd.ts`, `Layout.astro`, `ProjectSpotlight.astro`, `Works.astro`, `Hero.astro`, `index.astro`,
`constants.ts`, `content.config.ts`, JSON de proyectos/timeline, demo React, `global.css`,
`astro.config.mjs`, `vercel.json`, `robots.txt.ts`, sitemap, README de este repo, lockfiles, docs
ajenos a este archivo.

---

## 6. Follow-up en `Nandem1/nndsk-ro-launcher` (otro PR, otro repo)

**Este agente no implementa nada ahí.** Lista para Vicente:

1. **README EN Download** (bloque `Play Ragnarok Online on Linux`): el link
   `[AppImage (Linux x64, v0.1.2)](…/releases/download/v0.1.2/RO-Launcher_0.1.2_amd64.AppImage)` y
   los `chmod`/`./` pinean 0.1.2. Pasarlos a `…/releases/latest` (misma decisión A) o, si aterriza
   B, al locator unversioned.
2. **SHA-256 del README:** ya puede ser
   `…/releases/latest/download/RO-Launcher_amd64.AppImage.sha256` (asset unversioned, 200 hoy). El
   README todavía pinea `v0.1.2` en ese href.
3. **Opcional B — asset unversioned:** en `release.yml`, publicar **además**
   `RO-Launcher_amd64.AppImage` (copia o symlink-as-asset del AppImage versionado). Conservar el
   nombre versionado: `latest.json` + `.sig` del updater Tauri apuntan al filename con `0.1.2`.
   Cuando exista, un PR **futuro** de este portafolio puede cambiar el CTA a
   `…/releases/latest/download/RO-Launcher_amd64.AppImage` (one-click). No es esta fase.

---

## 7. Acceptance checklist (Composer, fase implementación — no este PR)

### 7.1 Grep (vacío en `src/` salvo este doc)

```bash
rg -n '0\.1\.1|0\.1\.2' src
rg -n 'releases/download/v' src
rg -n 'softwareVersion' src/pages/projects/nndsk-ro-launcher.astro
rg -n 'RO_LAUNCHER_RELEASE\.(version|downloadUrl|appImageFileName|tag)' src
```

`softwareVersion` no debe aparecer en la página. `jsonLd.ts` puede seguir declarando el extra
opcional.

### 7.2 P0 SEO (intactos en `src/pages/projects/nndsk-ro-launcher.astro` y en `dist/`)

```bash
rg -n 'Ragnarok Online Linux launcher' src/pages/projects/nndsk-ro-launcher.astro
rg -n 'nndsk-ro-launcher: launcher de Ragnarok Online para Linux \| Ragnarok Online Linux launcher' \
  src/pages/projects/nndsk-ro-launcher.astro
```

Post-build, la frase EN sigue en `dist/projects/nndsk-ro-launcher/index.html` (title, meta, OG,
JSON-LD `alternateName` + `keywords`). **Cero** hits de esa frase en `dist/index.html`.

### 7.3 Comandos

```bash
bun install --frozen-lockfile
bun run lint
bun run format:check
bun run check
bun run build
```

### 7.4 Preview Vercel (y/o `bun run preview`)

Ruta: `/projects/nndsk-ro-launcher/`

1. CTA `Descargar AppImage (Linux x64)` →
   `https://github.com/Nandem1/nndsk-ro-launcher/releases/latest` (`_blank`). Hoy resuelve a
   **v0.1.2**. El usuario ve el AppImage `RO-Launcher_0.1.2_amd64.AppImage` y lo baja ahí.
2. No aparece `v0.1.1` ni `v0.1.2` en el hero ni en Instalar.
3. Instalar: `el AppImage de la última release` + `./RO-Launcher_*_amd64.AppImage`.
4. SHA-256 abre un fichero (200), no 404. Releases abre latest.
5. View source JSON-LD: **sin** `softwareVersion`. `downloadUrl` =
   `https://github.com/Nandem1/nndsk-ro-launcher/releases/latest`. `keywords` / `alternateName` EN
   iguales que live.
6. Title + meta description = strings P0 de §2.
7. Home `/`: sin CTA AppImage, sin versión. Spotlight igual.
8. Dark Graphite en chrome de la página. Demo zinc/ámbar intacta. Sin JS nuevo fuera de la isla.

### 7.5 Lo que este plan no verifica

- Que GitHub publique un AppImage unversioned (B, otro repo).
- Updater Tauri / `latest.json` (ya funciona independiente del portafolio).
- Indexación GSC / Lighthouse.
- Merge / deploy a `nndsk.dev`.

---

## 8. NON-goals

- Merge a `main` / deploy / tocar live.
- Restyle, Graphite, H1, FAQ, demo, spotlight, home copy.
- Renombrar “caso de estudio” / `caseStudyPath` / CTA home `Caso de estudio`.
- Fetch a GitHub API o `latest.json` desde el build o el browser.
- Asset unversioned en el launcher.
- Editar `Nandem1/nndsk-ro-launcher`.
- Cambiar title/description/keywords EN del P0.
- `jsonLd.ts`, Layout, sitemap, `vercel.json`.
- Dependencias nuevas / lockfile.
- Tests runner. Validación = greps + lint + format:check + check + build + preview.

---

## 9. Ambiguities: NONE

| Pregunta que no hay que hacer             | Decisión ya tomada                                                    |
| ----------------------------------------- | --------------------------------------------------------------------- |
| ¿A, B o C?                                | **A**. B/C no en este PR.                                             |
| ¿Híbrido A ahora + CTA one-click después? | Sí, pero el one-click es **otro** PR **después** de B en el launcher. |
| ¿CTA descarga el `.AppImage`?             | No. Va a la página latest.                                            |
| ¿Cambiar el label del CTA?                | No. Sigue `Descargar AppImage (Linux x64)`.                           |
| ¿Mostrar “última release” o `v0.1.2`?     | Omitir la versión visible.                                            |
| ¿`softwareVersion` en JSON-LD?            | Omitir.                                                               |
| ¿`downloadUrl`?                           | `releases/latest`, no un binario.                                     |
| ¿Tocar `jsonLd.ts`?                       | No.                                                                   |
| ¿Filename versionado en Instalar?         | No. Copy §4.3.                                                        |
| ¿Checksum latest/download?                | Sí; el asset unversioned ya existe.                                   |
| ¿`target="_blank"` en el CTA?             | Sí.                                                                   |
| ¿Home / spotlight?                        | No se tocan.                                                          |
| ¿Fetch `latest.json`?                     | No.                                                                   |
| ¿Implementar en el repo del launcher?     | No. Lista §6.                                                         |

---

## 10. Fuera de esta fase (recordatorio)

Este PR de plan **solo** añade `docs/UNPIN_RO_LAUNCHER_LATEST.md`.

La implementación es un PR **siguiente**, branch nueva, todavía **sin** merge a `main`. Composer no
implementa en el mismo PR que este documento.
