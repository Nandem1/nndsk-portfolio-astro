# Plan de implementación: featured + caso de estudio `nndsk-ro-launcher`

**Rol de este documento:** especificación cerrada para un implementer (Composer 2.5). Cero juicio de diseño. Si un paso no está aquí, no se hace.

**Fase actual:** solo plan. Este PR no cambia UI.

**Repo:** `Nandem1/nndsk-portfolio-astro` · live `https://nndsk.dev`  
**Stack:** Astro 6 estático + Tailwind v4 (`@theme`) + Content Collections (`type: 'data'`) · `bun@1.3.9`  
**Visual:** Dark Graphite ya aterrizó en `main` (`docs/DARK_GRAPHITE_PLAN.md` + implementación). Este trabajo **hereda** esos tokens y clases. No reabrir el tema.

**Producción:** no mergear a `main`, no desplegar.

**Protocolo del implementer**

1. Leer este archivo entero antes de tocar código.
2. Leer `docs/DARK_GRAPHITE_PLAN.md` secciones 2.3–2.6 (presupuesto de accent, clases canónicas, motion, radios). Pegar esas clases; no inventar otras.
3. Ejecutar la lista archivo-a-archivo en el orden de la sección 6.
4. Copy: pegar los strings de las secciones 4 y 5. No reescribir, no “mejorar”, no añadir adjetivos.
5. Ante duda de Mercado House (Go/Gin) o EcoRetirosRM: no tocar esos JSON. Ver sección 8.
6. Si un grep de la sección 9.2 encuentra patrones prohibidos en archivos **nuevos o tocados**, falló. Corregir.

---

## 0. Hechos verificados (no inventar fuera de esto)

### 0.1 README público del launcher

Fuente: `https://raw.githubusercontent.com/Nandem1/nndsk-ro-launcher/main/README.md`  
Repo: `https://github.com/Nandem1/nndsk-ro-launcher`

Hechos usables (citar / parafrasear corto; no inflar):

| Hecho | Dónde en el README |
| --- | --- |
| Launcher de Ragnarok Online para Linux, Tauri + React + Rust | H1 `# RO-Launcher` + primer párrafo |
| Perfiles aislados por servidor y runner; no depende del Wine del sistema | primer párrafo + “Perfiles aislados por servidor y runner” |
| Wine/Proton, WINEPREFIX, Proton-CachyOS + UMU administrados | funciones + sección Proton/UMU |
| Pipeline D3D8/9/11 → DXVK → Vulkan; DirectDraw → dgVoodoo (opcional) → D3D11 → DXVK → Vulkan | “Pipeline gráfico” |
| AutoPot, AutoBuff, spammer; Discord Rich Presence | “Funciones principales” |
| Sidecar `ro-sessiond`: child subreaper, padre de wineserver / patcher / `ragexe.exe`; Yama `ptrace_scope=1` basta; no hace falta `ptrace_scope=0` ni `sudo` ni tocar `/etc` | “Supervisor de sesión y memoria” |
| Recomendaciones Gepard **solo** si el SHA-256 de `gepard.dll` coincide con la matriz; hash desconocido = advertencia, no receta | “Matriz Gepard validada” |
| El launcher no modifica Gepard, el cliente ni el tráfico del juego | mismo bloque |
| Datos locales en `~/.local/share/ro-launcher/` | “Datos locales” |
| Dev: Linux x86_64, Vulkan, Node, Rust estable, Tauri v2 | “Desarrollo” |
| Producto se presenta como **RO-Launcher**; repo **nndsk-ro-launcher** | H1 vs URL del repo |

No hay URL Live pública. No hay cifra de usuarios, tráfico, equipo, ni deploy cloud.

### 0.2 Card actual del portafolio

Fuente: `src/content/projects/nndsk-ro-launcher.json` (id de colección = `nndsk-ro-launcher`).

```json
{
  "title": "nndsk-ro-launcher",
  "description": "Launcher para Ragnarok Online en Linux. Gestiona WINEPREFIX, DXVK y dgVoodoo con pipeline gráfico a Vulkan. Incluye AutoPot por lectura de memoria del cliente y Spammer con sidecar evdev, multi-servidor y runners Proton/Wine.",
  "tags": ["Gaming", "Desktop", "Linux"],
  "stack": ["Tauri v2", "Rust", "React", "Wine", "DXVK", "dgVoodoo"],
  "highlights": [
    "AutoPot por lectura de memoria del cliente con perfiles 4RTools",
    "Spammer con sidecar evdev + ydotool, hotkeys F1–F9 / 0–9",
    "Pipeline dgVoodoo → DXVK → Vulkan con proton-cachyos-slr"
  ],
  "thumbnail": "./nndsk-ro-launcher/rolauncher1.png",
  "gallery": ["./nndsk-ro-launcher/rolauncher2.png"],
  "github": "https://github.com/Nandem1/nndsk-ro-launcher",
  "featured": false,
  "year": "2026",
  "order": 3
}
```

Hechos **extra** vs README, usables porque ya están en esta card: perfiles 4RTools; spammer evdev + ydotool; hotkeys F1–F9 / 0–9; runner `proton-cachyos-slr`.

**No hay `link`.** Live no existe. No inventarlo.

### 0.3 Home live / código actual (`main` post-Graphite)

`src/pages/index.astro`: Header → Hero → Bio → Works → SocialLinks → Footer. Una sola página + 404. **Cero rutas `/projects/*`.**

`Works.astro` ya parte en dos:

1. `featured === true` → grid `md:grid-cols-2`: EcoRetirosRM (`order: 1`) + Mercado House (`order: 2`).
2. `featured === false` → grid compacta `sm:grid-cols-2 md:grid-cols-3`: nndsk-ro-launcher (`order: 3`, **solo Repo**), nndsk-gisan-astro (`order: 4`), nndsk-hyprtask (`order: 5`).

No es un grid de 5 cards iguales, pero RO queda **al mismo nivel visual** que gisan/hyprtask. Eso es lo que se degrada: RO sale de esa fila; gisan/hyprtask quedan como “Otros”; MH + Eco siguen en el 2-col de empleabilidad.

Schema `src/content.config.ts`: `featured: z.boolean().default(false)`, `order`, `thumbnail`/`gallery` con `image()`, `link`/`github` opcionales. **No existe `spotlight` ni `caseStudyPath`.**

Capturas **sí están en el repo** (no hay que inventar UI ni poner placeholder):

- `src/content/projects/nndsk-ro-launcher/rolauncher1.png` — UI del launcher (HoneyRO, proton-cachyos-slr, AutoPot, Spammer, logs).
- `src/content/projects/nndsk-ro-launcher/rolauncher2.png` — mismo UI sobre el cliente RO en Linux.

`astro.config.mjs`: `output: 'static'`, `trailingSlash: 'always'`, `site: 'https://nndsk.dev'`, sitemap `@astrojs/sitemap` sin `serialize`. Una página prerendered nueva entra sola al sitemap.

`Layout.astro` ya acepta `title` y `description`; OG/Twitter reusan `/og.png`. No generar un OG nuevo.

Header hoy hace `link.href.replace(/^\//, '')`, así `/#bio` vira `#bio`. En home funciona; en `/projects/nndsk-ro-launcher/` **rompe** la nav. Hay que dejar el href absoluto. Footer usa `href="#top"` — mismo bug; pasar a `/#top`.

Hero copy actual (no tocar; ver sección 5):

> Mantengo el ERP de Mercado House, soy desarrollador fullstack en EcoRetirosRM y construyo tooling en Rust. Trabajo con flujo agentico — Claude Code, Codex, OpenCode. TypeScript, Rust, Go — en ese orden, por ahora.

Graphite tokens canónicos (ya en `global.css`; no redefinirlos):

`#17191c` background · `#1f2227` card · `#343940` border · `#4a5058` border-strong · `#9399a1` muted · `#d5d8dc` foreground · accent `#b6bdc6`.

---

## 1. IA / UX (cerrado)

### 1.1 Dónde va el featured

**Dentro de `#work` (Trabajos), como primer bloque después del heading `Trabajos` + recuento.** No entre Hero y Bio. No reemplaza Bio. No es una sección nueva en `index.astro`.

Orden de la home, invariante salvo el interior de Works:

1. Hero  
2. Bio  
3. Trabajos (`#work`) — **contenido interno nuevo, ver 1.2**  
4. En la web (SocialLinks)  
5. Footer  

`src/pages/index.astro` **no se edita**. El CTA del Hero `Ver trabajos` (`href="#work"`) sigue apuntando al heading; el spotlight queda inmediatamente debajo. Bio `Ver mis proyectos` igual.

### 1.2 Orden interno de Trabajos

Después del `<header>` de la sección, en este orden estricto:

| # | Bloque | Contenido | Layout |
| --- | --- | --- | --- |
| A | Spotlight | solo `nndsk-ro-launcher` (`spotlight: true`) | 1 card full-width, grid `md:grid-cols-2` (foto \| copy). Componente nuevo `ProjectSpotlight.astro`. |
| B | Empleabilidad | EcoRetirosRM + Mercado House (`featured: true` y `spotlight: false`) | El grid featured **actual** `md:grid-cols-2`. **Sin heading extra** (no escribir “Empleabilidad” en UI). Copy/JSON de esas dos cards **intacto**. |
| C | Otros | nndsk-gisan-astro + nndsk-hyprtask (`featured: false` y `spotlight: false`) | Heading `Otros` + grid compacta existente. Con 2 ítems: `grid sm:grid-cols-2 gap-4` (**sin** `md:grid-cols-3`, para no dejar un hueco). |
| D | Pie | `Contacto →` `href="#contact"` | Sin cambios de copy ni clases. |

`nndsk-ro-launcher` **no** se renderiza en B ni en C. Un solo sitio en home: el spotlight.

Filtros mecánicos en `Works.astro` (reemplazan el par `featured` / `rest` actual):

```ts
const spotlight = sortedProjects
  .filter(p => p.data.spotlight)
  .sort((a, b) => a.data.order - b.data.order);
const featured = sortedProjects.filter(p => p.data.featured && !p.data.spotlight);
const rest = sortedProjects.filter(p => !p.data.featured && !p.data.spotlight);
```

Recuento del header de sección: sigue usando `sortedProjects.length` (5) y el rango de años. No cambiar el texto `N proyectos · 2024–2025–2026`.

Si `spotlight.length === 0`, no renderizar el bloque A (defensivo). En este PR hay exactamente 1.

### 1.3 Layout del spotlight (home)

Desktop ≥ `md`: dos columnas iguales, sin gap visual interno (`gap-0`). Izquierda imagen `aspect-video` (object-cover, **sin** scale hover). Derecha copy (`p-6 md:p-8`).

Mobile: stacked. Imagen arriba, copy abajo.

La imagen es un `<a href="/projects/nndsk-ro-launcher/">`, no lightbox. El caso de estudio muestra las dos fotos. No duplicar `<dialog>` en el spotlight.

**Clase del `<article>`** — card Graphite 2.4, nada más:

```
rounded-md bg-card border border-border overflow-hidden transition-colors duration-200 hover:border-border-strong
```

Prohibido en este bloque: `hover:-translate-y-*`, `group-hover:scale-*`, `rounded-xl`, `backdrop-blur*`, `bg-gradient-*`, `bg-accent/10`, `animate-bounce`, `tracking-wider`, `uppercase` en el eyebrow, `text-accent` en títulos/chips/bullets.

Markup de copy (derecha), orden fijo:

1. Eyebrow: `p.text-sm.font-mono.text-muted` → `Proyecto destacado`  
2. H3: `h3.text-2xl.font-semibold.text-foreground` → `nndsk-ro-launcher`  
   Año a la derecha, mismo patrón que las cards: `span.text-xs.font-mono.text-muted` → `2026`  
3. Subtítulo humano: `p.text-muted` → `RO-Launcher para Linux`  
4. Párrafo: `project.data.description` (el JSON de la sección 4.2). Clases `text-muted text-sm leading-relaxed`.  
5. Highlights: lista con `–` muted (mismo patrón Graphite de Works, no `▸` ni `text-accent`).  
6. Stack: chips Graphite (`px-2 py-0.5 text-xs rounded-sm bg-transparent text-muted border border-border font-mono`). Mostrar el array completo (no `slice`).  
7. CTAs en fila, `mt-auto pt-2`, **links inline** (no el botón primario del Hero; home ya tiene uno: “Ver trabajos”):

| Label | href | target | Clases |
| --- | --- | --- | --- |
| `Caso de estudio` | `project.data.caseStudyPath` (`/projects/nndsk-ro-launcher/`) | same-origin, sin `_blank` | inline Live/Repo Graphite: `inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent/50 rounded-sm` |
| `Repo` | `project.data.github` | `_blank` `rel="noopener noreferrer"` | iguales + `GitHubIcon` `w-4 h-4` |

Sin botón Live. `aria-label` caso: `Leer caso de estudio: nndsk-ro-launcher`. `aria-label` repo: `Ver código en GitHub: nndsk-ro-launcher`.

Alt de la imagen del spotlight:

`Interfaz de nndsk-ro-launcher (RO-Launcher) en Linux: servidor HoneyRO, runner proton-cachyos-slr, AutoPot y Spammer`

JSON-LD del spotlight: reutilizar `projectSchema` de Works, con este ajuste de URL (una línea):

```ts
const url =
  project.data.link ??
  (project.data.caseStudyPath
    ? new URL(project.data.caseStudyPath, 'https://nndsk.dev').href
    : project.data.github);
```

`applicationCategory` se queda `DeveloperApplication` en home (no reabrir el schema de Eco/MH). El caso de estudio usa schema propio (sección 2.3).

### 1.4 Layout de la página caso de estudio

Página propia, no un `[slug].astro` genérico (los otros proyectos no tienen copy de caso; no generar URLs vacías).

Estructura de página:

```
Layout (title + description de 2.2)
  Header
  main#main-content.px-6.py-24
    article.max-w-3xl.mx-auto  → secciones 4.3
  Footer
```

Sin SocialLinks. Sin islas `client:*`. `export const prerender = true`.

Back link arriba del H1:

```
← Trabajos
```

`href="/#work"`. Clases inline Graphite (`text-sm text-muted hover:text-foreground` + focus ring). No `text-accent`.

CTA de cierre (un solo primario en esta vista, presupuesto Graphite 2.3):

- Primario: `Repo` → GitHub, `_blank`, clases **CTA primario** de Graphite 2.4 (borde `border-border`, hover `border-accent text-accent`). Incluir `GitHubIcon`.  
- Ghost al lado: `← Trabajos` otra vez, clases CTA ghost.

Fotos: `<Image>` de `astro:assets`, `format="webp"`, `width={1200}` / `height={675}` (rolauncher1), y la de gallery. `rounded-md border border-border`. **Sin lightbox.** `loading="eager"` en la primera, `lazy` en la segunda.

---

## 2. Ruta, sitemap, meta, OG

### 2.1 Path canónico

| | Valor |
| --- | --- |
| Archivo | `src/pages/projects/nndsk-ro-launcher.astro` |
| URL | `https://nndsk.dev/projects/nndsk-ro-launcher/` |
| Pathname | `/projects/nndsk-ro-launcher/` (`trailingSlash: 'always'`) |
| Id colección | `nndsk-ro-launcher` |
| `getEntry` | `await getEntry('projects', 'nndsk-ro-launcher')` |

Si `getEntry` devuelve `undefined`, `throw new Error('Missing projects entry nndsk-ro-launcher')` para fallar el build. No `Astro.redirect`.

**No** crear `/rolauncher`, `/relauncher`, ni redirects en `astro.config.mjs`. El 1-impression `rolauncher` se cubre con title/description/H1 que incluyen `nndsk-ro-launcher` y `RO-Launcher`. No mencionar el typo `relauncher` en la página.

### 2.2 Title / description / OG / Twitter / canonical

`Layout.astro` **no se modifica**. La página pasa props:

```ts
const title = 'nndsk-ro-launcher — RO-Launcher para Linux · nndsk';
const description =
  'nndsk-ro-launcher (RO-Launcher) es un launcher de Ragnarok Online para Linux: Tauri v2, React y Rust. WINEPREFIX, DXVK/Vulkan, AutoPot y supervisor de sesión.';
```

`<Layout title={title} description={description}>` — robots default (`index, follow, ...`).

Efecto mecánico (ya lo hace Layout):

| Meta | Valor |
| --- | --- |
| `<title>` | `nndsk-ro-launcher — RO-Launcher para Linux · nndsk` |
| `meta name="description"` | el `description` de arriba (incluye el string `nndsk-ro-launcher` y el título humano `RO-Launcher`) |
| `og:type` | `website` (default Layout) |
| `og:url` / canonical | `https://nndsk.dev/projects/nndsk-ro-launcher/` |
| `og:title` / `twitter:title` | = `title` |
| `og:description` / `twitter:description` | = `description` |
| `og:locale` | `es_CL` |
| `og:image` / `twitter:image` | `https://nndsk.dev/og.png` (default; **no** generar OG nuevo ni copiar screenshots a `public/`) |
| `og:image:alt` | el default del Layout (`nndsk — Nande · Fullstack Developer`) — no tocarlo |

No añadir `<meta name="keywords">`.

### 2.3 JSON-LD en la página de caso (además del de Person/WebSite del Layout)

Un `<script type="application/ld+json">` con **este** objeto (pegar; `codeRepository` no es estándar schema.org — usar `sameAs` + `url`):

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "nndsk-ro-launcher",
  "alternateName": ["RO-Launcher", "RO Launcher"],
  "description": "Launcher de Ragnarok Online para Linux. Tauri v2, React y Rust. WINEPREFIX, DXVK a Vulkan, AutoPot y supervisor de sesión.",
  "url": "https://nndsk.dev/projects/nndsk-ro-launcher/",
  "sameAs": ["https://github.com/Nandem1/nndsk-ro-launcher"],
  "applicationCategory": "GameApplication",
  "operatingSystem": "Linux",
  "author": { "@id": "https://nndsk.dev/#person" }
}
```

No `offers`. No `aggregateRating`. No `downloadUrl`.

### 2.4 Sitemap

En `astro.config.mjs`, el page prerendered entra solo. Añadir `serialize` **solo** para subir prioridad de esta URL. No tocar `filter`, `customPages`, `changefreq`, ni el `priority` default `0.7` del resto.

```js
sitemap({
  filter: page => !page.includes('/draft'),
  customPages: [],
  changefreq: 'weekly',
  priority: 0.7,
  serialize(item) {
    if (item.url.includes('/projects/nndsk-ro-launcher')) {
      return { ...item, priority: 0.8 };
    }
    return item;
  },
}),
```

`robots.txt.ts` no se toca (`Allow: /` + sitemap index).

### 2.5 Nav en páginas internas

`Header.astro`: **eliminar** `link.href.replace(/^\//, '')`. Usar `href={link.href}` (`/#bio`, `/#work`, `/#contact`). El logo ya apunta a `/#top`.

`Footer.astro`: `href="#top"` → `href="/#top"`. Copy `↑ Inicio` y `© {year} nndsk · por Nande` intactos.

Esto también arregla la nav del 404 (hoy los anclas no salen de `/no-existe`). No hace falta tocar `404.astro`.

---

## 3. Screenshot

**Hay asset. No hay placeholder. No se inventa UI.**

| Archivo | Uso |
| --- | --- |
| `src/content/projects/nndsk-ro-launcher/rolauncher1.png` | thumbnail del JSON; foto del spotlight; figura 1 del caso |
| `src/content/projects/nndsk-ro-launcher/rolauncher2.png` | `gallery[0]`; figura 2 del caso (contexto in-game). **No** es la foto del spotlight |

Alts:

- rolauncher1: `Interfaz de nndsk-ro-launcher (RO-Launcher) en Linux: servidor HoneyRO, runner proton-cachyos-slr, AutoPot y Spammer`
- rolauncher2: `nndsk-ro-launcher superpuesto sobre el cliente de Ragnarok Online en Linux, con AutoPot activo`

Cómo se consumen: `getEntry` → `project.data.thumbnail` / `project.data.gallery[0]` con `<Image>` de `astro:assets`. No copiar a `public/`. No URLs remotas.

Si más adelante Vicente tiene una captura mejor: **reemplazar esos dos PNG in-place** (mismos filenames). El implementer de **esta** fase no genera, no busca Unsplash, no dibuja mockups.

Fallback si faltara `thumbnail` (no debería): el placeholder sólido Graphite de Works (`bg-card` + inicial `R` `text-muted/30`). Nunca un mesh/gradient.

---

## 4. Copy (español, voz Nande, títulos tech en inglés)

Reglas de voz: frases cortas. Hechos. Cero marketing. Cero “potente / revolucionario / seamless / next-gen / production-grade / high-traffic”. Cero NestJS, K8s, AWS, “el equipo”, “escalamos”. Tech names en inglés (`WINEPREFIX`, `DXVK`, `Tauri v2`, `ro-sessiond`, `ptrace_scope`).

### 4.1 Schema — campos nuevos

En `src/content.config.ts`, **añadir** a `projects.schema` (dejar el resto igual):

```ts
spotlight: z.boolean().default(false),
caseStudyPath: z.string().optional(),
```

No convertir la colección a `type: 'content'`. No crear collection `caseStudies`. No añadir markdown.

Solo `nndsk-ro-launcher.json` usa los campos nuevos. Eco/MH/gisan/hyprtask: no añadir las claves (el default de `spotlight` cubre `false`; `caseStudyPath` ausente).

### 4.2 JSON final de `nndsk-ro-launcher.json` (pegar entero)

`description` se conserva letra por letra (ya es factual). `featured` sigue `false`. `order` sigue `3` (el spotlight no usa order para colocarse primero; el filtro A lo saca). `github` igual. Sin `link`.

```json
{
  "title": "nndsk-ro-launcher",
  "description": "Launcher para Ragnarok Online en Linux. Gestiona WINEPREFIX, DXVK y dgVoodoo con pipeline gráfico a Vulkan. Incluye AutoPot por lectura de memoria del cliente y Spammer con sidecar evdev, multi-servidor y runners Proton/Wine.",
  "tags": ["Gaming", "Desktop", "Linux"],
  "stack": ["Tauri v2", "Rust", "React", "Wine", "Proton", "DXVK", "dgVoodoo"],
  "highlights": [
    "AutoPot/AutoBuff por lectura de memoria (perfiles 4RTools); spammer evdev + ydotool",
    "Sidecar ro-sessiond: lee el cliente sin ptrace_scope=0",
    "WINEPREFIX aislado por servidor; DXVK → Vulkan; dgVoodoo opcional",
    "Runners Proton/Wine recomendados según hash de gepard.dll"
  ],
  "thumbnail": "./nndsk-ro-launcher/rolauncher1.png",
  "gallery": ["./nndsk-ro-launcher/rolauncher2.png"],
  "github": "https://github.com/Nandem1/nndsk-ro-launcher",
  "spotlight": true,
  "caseStudyPath": "/projects/nndsk-ro-launcher/",
  "featured": false,
  "year": "2026",
  "order": 3
}
```

`Proton` entra al `stack` porque el README nombra Proton-CachyOS. No añadir `UMU` al array (sí va en un bullet del caso). `AutoBuff` y `ro-sessiond` / Gepard hash salen del README; 4RTools / evdev / ydotool salen de la card previa.

El spotlight de home **lee este JSON**. No hardcodear description/highlights/stack en el `.astro` del spotlight.

### 4.3 Página caso — outline + copy literal

Pegar este contenido en `src/pages/projects/nndsk-ro-launcher.astro` (markup Astro; clases al final de este bloque). No añadir secciones extra.

**Back:** `← Trabajos`

**H1:** `nndsk-ro-launcher`  
**Lead (un `<p>`):** `RO-Launcher — launcher de Ragnarok Online para Linux.`  
**Meta línea:** `2026 · Tauri v2 · React · Rust` (`text-sm font-mono text-muted`)

**Figura 1:** thumbnail. Caption (`figcaption text-sm text-muted`): `UI del launcher. Sin Live: es una app de escritorio.`

#### Problema (`h2`: `Problema`)

```
Ragnarok Online en Linux no es instalar y jugar. Cada servidor privado trae su runner, su prefix y a veces un anticheat distinto. Armar Wine + DXVK + dgVoodoo a mano se rompe entre máquinas. Leer HP/SP del cliente para AutoPot suele empujar a ptrace_scope=0. Eso no va a ser un requisito.
```

#### Enfoque (`h2`: `Enfoque`)

```
Un launcher de escritorio, no un script. Tauri v2 + React en la UI, Rust en el host. Un perfil por servidor: runner, WINEPREFIX, DXVK, dgVoodoo si el cliente es DirectDraw. AutoPot, AutoBuff y el spammer salen del mismo lanzamiento. Un sidecar ro-sessiond queda de padre del proceso del juego para leer memoria con Yama en default.
```

#### Técnico (`h2`: `Técnico`)

Lista `–` muted, **exactamente** estos 7 ítems, en este orden:

1. `Perfiles aislados: cambiar runner crea o reutiliza otro prefix; no migra ni borra el anterior.`
2. `Pipeline: Direct3D 8/9/11 → DXVK → Vulkan. DirectDraw → dgVoodoo (opcional) → D3D11 → DXVK → Vulkan.`
3. `Proton-CachyOS + UMU administrados, o Wine portable bajo ~/.local/share/ro-launcher/runners/.`
4. `Recomendación de runner solo si el SHA-256 de gepard.dll coincide con la matriz validada. Hash desconocido = advertencia, no receta.`
5. `El launcher no modifica Gepard, el cliente ni el tráfico del juego.`
6. `AutoPot/AutoBuff por lectura de memoria (perfiles 4RTools). Spammer con sidecar evdev + ydotool, hotkeys F1–F9 / 0–9.`
7. `ro-sessiond: child subreaper, padre de wineserver, patcher y ragexe.exe. No hace falta ptrace_scope=0 ni sudo.`

#### Stack (`h2`: `Stack`)

Chips Graphite, array fijo (no leer más de esto):

`Tauri v2` `Rust` `React` `Wine` `Proton` `DXVK` `dgVoodoo` `UMU`

UMU aparece aquí (README) y no en el JSON `stack` de la card, a propósito: la card del home se queda corta; el caso puede nombrar UMU una vez.

#### Figura 2

gallery[0]. Caption: `Misma app sobre el cliente, en Linux.`

#### Links (`h2`: `Links`)

Párrafo corto antes de los CTAs:

```
Código en GitHub. No hay demo web.
```

Luego el par Repo (primario) + `← Trabajos` (ghost) de 1.4.

### 4.4 Clases de tipografía del caso (Graphite, no inventar)

| Nodo | Clases |
| --- | --- |
| H1 | `text-4xl md:text-5xl font-semibold text-foreground tracking-normal mb-3` |
| Lead | `text-lg text-muted mb-2` |
| H2 | `text-xl font-semibold text-foreground mt-12 mb-4` (sin underline span) |
| Párrafos | `text-muted leading-relaxed` |
| Lista | igual que highlights de Works (`flex gap-2 text-sm text-muted`, dash `–`) |
| `article` | `max-w-3xl mx-auto` |
| Espacio entre figuras y texto | `mt-8` en `<figure>` |

Prohibido: `prose` de Tailwind typography (no está instalado). No markdown render. HTML estático.

### 4.5 Palabras / claims prohibidos en cualquier archivo de esta fase

`NestJS`, `Kubernetes`, `K8s`, `AWS`, `high-traffic`, `scale`, `el equipo`, `senior`, `lead`, `Windows`, `macOS`, `disponible en Steam`, `miles de usuarios`, `producción crítica`, `microservicios`, `Live` (en RO), `relauncher`, Express-en-RO, Gin-en-RO.

No “corregir” Mercado House. No reescribir EcoRetirosRM.

---

## 5. Hero microcopy

**NO hay cambio de Hero.**

El párrafo ya dice “construyo tooling en Rust” y conserva ERP + Eco. Graphite 3.5 / 4 ya ordenó no tocar esa letra. El brand `nndsk-ro-launcher` vive en el spotlight + la página de caso, no en el H1.

Antes = después (referencia; no editar `Hero.astro`):

```
Mantengo el ERP de Mercado House, soy desarrollador fullstack en EcoRetirosRM y construyo tooling en Rust. Trabajo con flujo agentico — Claude Code, Codex, OpenCode. TypeScript, Rust, Go — en ese orden, por ahora.
```

Tampoco tocar H1, stack line `TypeScript • Go • Rust`, ni CTAs.

---

## 6. Lista archivo-a-archivo (orden de ejecución)

No crear otros archivos. No añadir dependencias. No tocar lockfiles.

### 6.1 `src/content.config.ts` — primero

Añadir `spotlight` y `caseStudyPath` como en 4.1. Conservar `image()`, `featured`, `order`, `link`, `github`, `highlights`, `stack`, `tags`, `year`, `thumbnail`, `gallery`.

### 6.2 `src/content/projects/nndsk-ro-launcher.json`

Reemplazar el archivo por el JSON de 4.2. No tocar PNG. No tocar los otros cuatro JSON.

### 6.3 `src/components/Header.astro`

Quitar el `replace(/^\//, '')`. `href={link.href}`. No cambiar clases Graphite del header.

### 6.4 `src/components/Footer.astro`

`href="/#top"`. Nada más.

### 6.5 `src/components/ProjectSpotlight.astro` — CREAR

Componente PascalCase. Frontmatter:

```ts
import type { CollectionEntry } from 'astro:content';
import { Image } from 'astro:assets';
import GitHubIcon from './icons/GitHubIcon.astro';

interface Props {
  project: CollectionEntry<'projects'>;
}

const { project } = Astro.props;
```

Markup según 1.3. `data-reveal` en el wrapper. Sin `<style>` scoped extra. Sin client JS.

JSON-LD: el implementer puede (a) duplicar un `projectSchema` local de 5 líneas, o (b) no poner schema en el spotlight y dejarlo solo en la página de caso. **Cerrado: ponerlo en el spotlight** con la URL del caso (ajuste de 1.3), `@type SoftwareApplication`, `applicationCategory: 'DeveloperApplication'` para no diverger de las otras cards de home.

### 6.6 `src/components/Works.astro`

- Importar `ProjectSpotlight`.  
- Sustituir filtros por el triplete de 1.2.  
- Tras el header de sección, si `spotlight.length > 0`, mapear a `<ProjectSpotlight project={p} />` dentro de un contenedor `space-y-6` (por si un día hay más de uno; hoy hay 1).  
- El grid featured actual se queda, alimentado por `featured` ya filtrado. **No** editar markup interno de esas cards.  
- Antes del grid compacto: si `rest.length > 0`, un `h3.text-lg font-semibold text-center text-muted mb-6` con texto `Otros`.  
- Grid compacto: `class:list={['grid', 'sm:grid-cols-2', 'gap-4', rest.length >= 3 && 'md:grid-cols-3']}`.  
- Ajuste de `url` en `projectSchema` según 1.3 (cubre el spotlight si el schema vive en Works; si el schema del spotlight está en el componente nuevo, aplicar el mismo helper ahí y **dejar** `projectSchema` de Works como está para Eco/MH/gisan/hyprtask — esas no tienen `caseStudyPath`). **Cerrado:** no tocar `projectSchema` de Works. El schema con URL de caso vive solo en `ProjectSpotlight.astro` + la página de caso.  
- Pie `Contacto →` intacto. Lightbox CSS intacto.

### 6.7 `src/pages/projects/nndsk-ro-launcher.astro` — CREAR

Directorio `src/pages/projects/` nuevo. Contenido 1.4 + 2.2 + 2.3 + 4.3 + 4.4. Imports:

```ts
export const prerender = true;

import { getEntry } from 'astro:content';
import { Image } from 'astro:assets';
import Layout from '../../layouts/Layout.astro';
import Header from '../../components/Header.astro';
import Footer from '../../components/Footer.astro';
import GitHubIcon from '../../components/icons/GitHubIcon.astro';
```

Usar alias `@/` si el resto del repo lo usa en páginas (`404` usa relativo; **usar relativo** como `404.astro` / `index.astro` para no mezclar).

### 6.8 `astro.config.mjs`

Solo el `serialize` de 2.4. Conservar `output: 'static'`, `trailingSlash: 'always'`, `legacy.collectionsBackwardsCompat`, image domains, `prefetch: false`.

### 6.9 Archivos que NO se tocan

Ver sección 8. Incluye `Hero.astro`, `Bio.astro`, `index.astro`, `Layout.astro`, `global.css`, `constants.ts`, `middleware.ts`, `vercel.json`, `robots.txt.ts`, `404.astro`, `SocialLinks.astro`, iconos, `public/**`, `scripts/**`, `docs/DARK_GRAPHITE_PLAN.md`, README, lockfiles, JSON de Eco/MH/gisan/hyprtask, PNG de RO.

---

## 7. Visual Graphite — recordatorio duro para UI nueva

Pegar clases de `docs/DARK_GRAPHITE_PLAN.md` §2.4. Tokens ya están en `@theme`; los componentes nuevos usan `bg-card`, `border-border`, `hover:border-border-strong`, `text-foreground`, `text-muted`. **Cero hex en componentes.**

Accent (`text-accent` / `border-accent` / `hover:border-accent hover:text-accent`) **solo** en:

1. Lo que ya existe (stack line del Hero, skip-link, focus rings).  
2. El CTA primario **Repo** de la página de caso (`hover:border-accent hover:text-accent`).  

El spotlight de home **no** gasta accent (links muted→foreground, como Live/Repo).

Radios: `rounded-md` cards/botones/fotos; `rounded-sm` chips y focus helpers. Cero `rounded-xl`. Cero `backdrop-blur`. Cero bounce, mesh, glass, frost, navy, Nord.

Motion: `data-reveal` existente (12px / 350ms). `duration-200` en hovers. Nada > 400ms.

---

## 8. NON-goals

- Merge a `main` / deploy / tocar `nndsk.dev` live.  
- Editar `src/content/projects/mercado-house.json` (claim Go/Gin se queda).  
- Reescribir EcoRetirosRM (description, highlights, schema.org, “startup”).  
- Cambiar `featured`/`order`/`link` de Eco, MH, gisan, hyprtask.  
- Hero copy, timeline JSON, `SITE_METADATA`, README.  
- Tema Graphite: no reabrir `global.css`, favicon, og.png, `THEME_COLORS`.  
- Blog, CMS, i18n, `[slug].astro` genérico, vanity redirects `/rolauncher`.  
- Hidratar islas, View Transitions, prefetch, sombras, glow, grain.  
- Inventar screenshot, OG específico del proyecto, URL Live, cifras, equipo, K8s/AWS/Nest.  
- Dependencias nuevas / lockfile.  
- Tests nuevos. Validación = lint + format + check + build.

---

## 9. Acceptance checklist (Composer, fase implementación — no este PR)

### 9.1 Comandos (cwd repo, Bun 1.3.9)

```bash
bun install --frozen-lockfile
bun run format
bun run lint
bun run format:check
bun run check
bun run build
```

Build 0. `dist/` no se commitea.

Tras el build, deben existir:

- `dist/index.html`
- `dist/projects/nndsk-ro-launcher/index.html`
- `dist/sitemap-0.xml` (o el nombre que emita `@astrojs/sitemap`) con `https://nndsk.dev/projects/nndsk-ro-launcher/`

### 9.2 Grep (vacío en `src/` salvo este doc y `DARK_GRAPHITE_PLAN.md`)

```bash
rg -n "backdrop-blur|backdrop-filter" src public --glob '!docs/**'
rg -n "bg-gradient|from-accent/10|animate-bounce|tracking-wider" src
rg -n "#0a0f1c|#81a1c1|#88c0d0|#111827|#1e293b|#616e88" src public scripts
rg -n "NestJS|Kubernetes|high-traffic|relauncher" src
rg -n "hover:-translate-y|group-hover:scale-105" src
```

En `ProjectSpotlight.astro` y `src/pages/projects/nndsk-ro-launcher.astro` no puede haber `text-accent` salvo el CTA Repo de la página de caso (`hover:text-accent` junto a `hover:border-accent`).

### 9.3 Checks de contenido / DOM (preview o `dist/`)

```bash
bun run preview
```

**Home `/` desktop ~1280 y mobile ~375**

1. Orden de secciones: Hero → Bio → Trabajos → En la web.  
2. Dentro de Trabajos, orden: heading → spotlight `nndsk-ro-launcher` → 2 cards Eco + MH → heading `Otros` → gisan + hyprtask.  
3. `nndsk-ro-launcher` **no** aparece como tercera compacta.  
4. Spotlight: foto = UI del launcher (rolauncher1), no la captura in-game. Click foto o “Caso de estudio” → `/projects/nndsk-ro-launcher/`.  
5. Spotlight tiene `Repo`, **no** tiene `Live`.  
6. Eco y MH: copy, stack, Live, lightbox, orden — iguales que ahora. MH sigue diciendo Go/Gin.  
7. `Otros` visible; dos compactas; en desktop no hay columna vacía de un 3-col.  
8. Recuento sigue `5 proyectos`.  
9. Hero: el párrafo de Mercado House / Eco / tooling Rust **idéntico**.  
10. Header Graphite intacto (barra sólida, sin glass). Spotlight sin lift ni zoom.

**Caso `/projects/nndsk-ro-launcher/`**

11. `<title>` y `og:title` contienen `nndsk-ro-launcher` y `RO-Launcher`.  
12. `meta description` y `og:description` contienen `nndsk-ro-launcher`.  
13. Canonical / `og:url` = `https://nndsk.dev/projects/nndsk-ro-launcher/`.  
14. H1 = `nndsk-ro-launcher`. Hay secciones Problema, Enfoque, Técnico, Stack, Links.  
15. 7 bullets técnicos, en el orden de 4.3. Aparecen `ro-sessiond`, `ptrace_scope=0`, `gepard.dll`, `WINEPREFIX`, `DXVK`.  
16. Dos figuras reales (no placeholder, no Unsplash).  
17. Nav Bio/Proyectos/Contacto lleva a `/#bio` `/#work` `/#contact` (home), no a anclas rotas en el caso. Footer `↑ Inicio` → `/#top`.  
18. `← Trabajos` → `/#work`. Repo → `https://github.com/Nandem1/nndsk-ro-launcher` `_blank`.  
19. No hay botón Live. No hay `relauncher`. No hay Nest/K8s/AWS.  
20. JSON-LD `SoftwareApplication` con `name: nndsk-ro-launcher` y `operatingSystem: Linux`.  
21. Página usable sin JS (solo `site.js` global para reveal; el contenido está en HTML).

**Sitemap / 404**

22. Sitemap incluye la URL del caso con priority 0.8.  
23. `/no-existe` sigue 404; nav ahora sí sale a la home vía `/#...`.

**A11y**

24. Skip-link, focus rings, alts de las dos fotos.  
25. `prefers-reduced-motion`: reveal apagado (ya cubierto en `global.css`).

### 9.4 Lo que este plan no verifica

- Volumen SEO / Search Console (1 impression no es KPI de implementación).  
- Lighthouse score.  
- Pixel-perfect vs Figma (no hay).

---

## 10. Ambiguities para Vicente

**NONE.** IA, ruta, meta, copy, screenshots, Hero, schema, archivos y non-goals están cerrados. El implementer no pregunta “¿featured entre Hero y Bio?”, “¿inventamos un Live?”, “¿[slug] genérico?”, “¿otra captura?”, “¿más plata en el spotlight?”: la respuesta es no.

(El A1 Go/Gin vs Express de `DARK_GRAPHITE_PLAN.md` sigue abierto **fuera** de este trabajo. No se toca MH aquí.)
