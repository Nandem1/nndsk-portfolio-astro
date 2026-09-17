# Plan de implementación: Dark Graphite / anti-AI-template

**Rol de este documento:** especificación cerrada para un implementer (Composer 2.5). Cero juicio de diseño. Si un paso no está aquí, no se hace.

**Fase actual:** solo plan. Este PR no cambia UI.

**Repo:** `Nandem1/nndsk-portfolio-astro` · live `https://nndsk.dev`  
**Stack:** Astro 6 estático + Tailwind v4 (`@theme`) + Content Collections · packageManager `bun@1.3.9`  
**Producción:** no mergear a `main`, no desplegar.

**Protocolo del implementer**

1. Leer este archivo entero antes de tocar código.
2. Ejecutar la lista archivo-a-archivo en el orden de la sección 3.
3. No improvisar colores, radios, motion, ni copy.
4. Si un grep de la sección 6 (patrones prohibidos) encuentra matches en `src/` o `public/`, falló. Corregir.
5. Ante duda de copy de Mercado House (Go/Gin vs Express): no tocar. Ver sección 7.

---

## 1. Auditoría del estado actual

### 1.1 Tokens (fuente de verdad rota)

`src/styles/global.css` `@theme` (lo que realmente pinta Tailwind):

| Token Tailwind | Variable CSS | Hex actual | Lectura |
| --- | --- | --- | --- |
| `background` | `--color-background` | `#0a0f1c` | Navy casi-void, no grafito |
| `foreground` | `--color-foreground` | `#e0e0e0` | Gris claro genérico |
| `accent` | `--color-accent` | `#81a1c1` | Nord frost (`nord9`) |
| `accent-hover` | `--color-accent-hover` | `#88c0d0` | Nord frost (`nord8`), cian |
| `muted` | `--color-muted` | `#7f8da3` | Azul-gris Nord |
| `card` | `--color-card` | `#111827` | Tailwind `gray-900` (navy) |
| `border` | `--color-border` | `#1e293b` | Tailwind `slate-800` |

`src/utils/constants.ts` `THEME_COLORS` (export no usado en componentes, pero desincronizado):

- `muted: '#616e88'` (otro Nord) ≠ CSS `#7f8da3`.
- Resto copia el navy/Nord.

`body` en `global.css` **hardcodea** `#0a0f1c` / `#e0e0e0` en vez de `var(--color-*)`. Idem scrollbar y `::selection`.

Hardcodes duplicados (mismo navy/Nord):

- `src/layouts/Layout.astro` `theme-color` `#0a0f1c`
- `public/favicon.svg` fondo `#0a0f1c`, glifo `#81a1c1`
- `public/manifest.webmanifest` `background_color` / `theme_color` `#0a0f1c`
- `scripts/generate-og.mjs` y `public/og.png` generada
- `src/components/Works.astro` lightbox backdrop `rgba(10, 15, 28, 0.8)` + `backdrop-filter: blur(4px)`

### 1.2 Tipografía

- Inter variable self-hosted: `public/fonts/inter-latin.woff2` + `inter-latin-ext.woff2`. CSP `font-src 'self'` — correcto, no hay Google Fonts.
- Hero eyebrow: `uppercase tracking-wider` → etiqueta de template SaaS.
- H1: `font-bold tracking-tight` + `text-5xl md:text-6xl` → display Vercel/Linear.
- Títulos de sección: `<span class="border-b-2 border-accent/30 pb-2">` (subrayado acento) en Bio, Works, Contacto.
- `font-mono` en años, chips de stack, iniciales placeholder.

**Decisión cerrada:** conservar Inter self-hosted (cero fuentes nuevas, cero cambio de CSP). Cambiar el *tratamiento*, no la familia.

### 1.3 Superficies, chrome, motion — qué lee “AI template”

| Elemento | Archivo | Por qué se siente template |
| --- | --- | --- |
| Nav píldora flotante + glass | `Header.astro` | `rounded-full bg-card/80 backdrop-blur-md border-border/50` |
| Anillo glow del avatar | `Hero.astro` | `ring-2 ring-accent/30 ring-offset-4` |
| Eyebrow “Agentic workflow” | `Hero.astro` | microcopy de portfolio-AI |
| CTA primario tintado | `Hero.astro` / `404.astro` | `bg-accent/10 border-accent/30 rounded-lg` |
| Chevron bounce | `Hero.astro` | `animate-bounce` decorativo |
| Cards lift + zoom foto | `Works.astro` | `hover:-translate-y-*` + `group-hover:scale-105` + `rounded-xl` |
| Placeholder mesh | `Works.astro` | `bg-gradient-to-br from-accent/10 via-card to-background` |
| Chips píldora Nord | `Works.astro` | `rounded-full bg-accent/10 text-accent border-accent/30` |
| Dots de timeline acento + scale | `Bio.astro` | `rounded-full bg-accent group-hover:scale-125` |
| Años en accent | `Bio.astro` | `text-accent` en cada `time` |
| Hover social accent fill | `SocialLinks.astro` | `hover:text-accent hover:bg-accent/10` |
| Lightbox glass | `Works.astro` | `backdrop-filter: blur(4px)` |
| Reveal 20px / 500–600ms | `global.css` | entrada “premium SaaS” |
| CTA “Trabajemos juntos” | `Works.astro` | cierre genérico de template |

No hay mesh-gradient de fondo de página ni púrpura/índigo. El problema es **Nord navy + frost cyan + glass + píldoras + bounce**, no un cyberpunk void.

### 1.4 Contenido verificado (no inventar)

Hero (`Hero.astro`):

- H1: `Nande — Fullstack Developer`
- Stack line: `TypeScript • Go • Rust`
- Bio: Mercado House ERP, EcoRetirosRM fullstack, tooling Rust, flujo agentico (Claude Code, Codex, OpenCode). TypeScript, Rust, Go — en ese orden.

Timeline 2023–2026 (`src/content/timeline/`):

| Archivo | year | title |
| --- | --- | --- |
| `2026-presente.json` | 2026 | El presente |
| `2025-vuelta-al-ruedo.json` | 2025 | Vuelta al ruedo |
| `2024-egreso.json` | 2024 | Egreso & la vida real |
| `2023-desafio-latam.json` | 2023 | Desafío LATAM |

Proyectos (`src/content/projects/`, `featured` + `order`):

| Slug | featured | order | year | stack (array) |
| --- | --- | --- | --- | --- |
| EcoRetirosRM | sí | 1 | 2026 | Next.js, React, Tailwind v4, shadcn/ui, Resend, Zod |
| Mercado House | sí | 2 | 2024 | Next.js, Go, PostgreSQL, Wails |
| nndsk-ro-launcher | no | 3 | 2026 | Tauri v2, Rust, React, Wine, DXVK, dgVoodoo |
| nndsk-gisan-astro | no | 4 | 2026 | Astro, GSAP, Lenis, TypeScript |
| nndsk-hyprtask | no | 5 | 2025 | Next.js, React, Zustand, TanStack Query, Radix UI, dnd-kit |

Mercado House **copy** (description + highlight) dice `Go/Gin`. El array `stack` solo dice `Go`. Ver sección 7.

### 1.5 Lo que ya está bien (no “arreglarlo”)

- Una sola página home + 404. Sin blog.
- `output: 'static'`, `prefetch: false`, `devToolbar.enabled: false`.
- Copy de timeline: voz pragmática, operativa, en español. No tocarla.
- `prefers-reduced-motion` ya anula reveal/hero/scroll-smooth.
- Skip-link, `lang="es-CL"`, JSON-LD Person, CSP en middleware + `vercel.json`.
- Iconos `currentColor` — no recolorizar paths.
- Discord copy-to-clipboard en `SocialLinks.astro` — no tocar JS.

---

## 2. Tokens objetivo (fuente de verdad única)

Paleta **Dark Graphite**: carbón mate / metal anodizado. Sesgo frío mínimo (hue ~250–260). No void `#000`. No navy. No Nord. Un solo highlight plata.

### 2.1 Hex canónico (copiar tal cual)

Implementar **exactamente** estos valores. El hex es la fuente de verdad. oklch es documentación.

| Token / clave Tailwind v4 | Variable `@theme` | Hex | oklch (aprox.) | Rol |
| --- | --- | --- | --- | --- |
| `background` | `--color-background` | `#17191c` | `oklch(0.212 0.006 260)` | Página, header sólido, track scrollbar |
| `foreground` | `--color-foreground` | `#d5d8dc` | `oklch(0.882 0.006 250)` | Texto primario, H1, logo |
| `muted` | `--color-muted` | `#9399a1` | `oklch(0.678 0.012 255)` | Texto secundario, chips, años |
| `accent` | `--color-accent` | `#b6bdc6` | `oklch(0.788 0.012 250)` | **Único** highlight plata |
| `accent-hover` | `--color-accent-hover` | `#c8ced6` | `oklch(0.845 0.010 250)` | Hover del único CTA primario |
| `card` | `--color-card` | `#1f2227` | `oklch(0.248 0.008 258)` | Superficie de card / hover social |
| `border` | `--color-border` | `#343940` | `oklch(0.338 0.010 256)` | Filo metal 1px |
| `border-strong` | `--color-border-strong` | `#4a5058` | `oklch(0.42 0.010 256)` | Hover de borde de card (no accent) |
| _(solo CSS)_ | `--color-scrollbar-thumb` | `#3f454d` | — | Thumb scrollbar |

Contraste WCAG AA contra `#17191c` (calculado): foreground 12.32:1 · muted 6.13:1 · accent 9.30:1. Muted sobre card `#1f2227`: 5.55:1.

### 2.2 Bloque `@theme` a dejar en `src/styles/global.css`

Reemplazar el bloque de colores actual. Conservar `--container-*` intactos.

```css
@theme {
  --color-background: #17191c;
  --color-foreground: #d5d8dc;
  --color-accent: #b6bdc6;
  --color-accent-hover: #c8ced6;
  --color-muted: #9399a1;
  --color-card: #1f2227;
  --color-border: #343940;
  --color-border-strong: #4a5058;

  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
  --container-2xl: 42rem;
  --container-3xl: 48rem;
}
```

`body`, `::selection`, scrollbar: **usar variables**, nunca hex sueltos.

```css
body {
  background-color: var(--color-background);
  color: var(--color-foreground);
  /* font-family Inter: dejar la stack actual, no cambiar familia */
}

::selection {
  background-color: color-mix(in srgb, var(--color-accent) 28%, transparent);
  color: var(--color-foreground);
}

::-webkit-scrollbar-track {
  background: var(--color-background);
}
::-webkit-scrollbar-thumb {
  background: #3f454d;
  border-radius: 0;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--color-muted);
}
```

Skip-link: `background: var(--color-accent); color: var(--color-background);` (excepción a11y: el plata es fondo, el carbón es texto). `border-radius: 0`.

### 2.3 Presupuesto de `accent` (regla dura)

`text-accent` / `border-accent` / `bg-accent` / `ring-accent` **solo** en:

1. Línea de stack del Hero: `TypeScript • Go • Rust` (`text-accent font-medium`). **Único texto accent persistente en home.**
2. CTA primario (un botón por vista): `border-border text-foreground` en reposo; `hover:border-accent hover:text-accent`. No `bg-accent/10`.
3. Focus rings: `focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-background` (a11y).
4. Skip-link y `::selection`.
5. Glifo “N” del favicon y de `og.png`.

**Prohibido** gastar accent en: hover de nav/links/social, chips de stack, años del timeline, dots, subrayados de H2, borde hover de cards, número 404, anillo del avatar, bullets `▸`.

### 2.4 Clases canónicas (pegar, no reinventar)

**Header bar**

```
fixed top-0 left-0 right-0 z-50 border-b border-border bg-background
```

Nav interno (sin glass, sin píldora):

```
max-w-3xl mx-auto flex items-center justify-between px-6 py-4
```

Logo: `text-foreground font-semibold text-base sm:text-lg hover:opacity-80 transition-opacity`

Links nav: `text-sm font-medium transition-colors duration-200 text-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-background rounded-sm px-2 py-1`

**CTA primario** (Hero “Ver trabajos”, 404 “Volver al inicio”)

```
px-6 py-3 text-foreground border border-border rounded-md hover:border-accent hover:text-accent transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-background
```

**CTA ghost** (Hero “Sobre mí”, “Escribeme”)

```
px-6 py-3 text-muted hover:text-foreground transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-background rounded-md
```

**H2 de sección** (sin span subrayado)

```
text-3xl font-semibold mb-12 text-center text-foreground
```

Works H2 usa `mb-3` porque hay un subtítulo; el subtítulo `text-muted text-sm` se queda.

**Card featured / compact**

```
group h-full rounded-md bg-card border border-border overflow-hidden flex flex-col transition-colors duration-200 hover:border-border-strong
```

Sin `hover:-translate-y-*`. Fotos: quitar `transition-transform duration-500 group-hover:scale-105`. Dejar `object-cover` nada más.

**Chip de stack**

```
px-2 py-0.5 text-xs rounded-sm bg-transparent text-muted border border-border font-mono
```

**Placeholder sin thumbnail** (featured y compact)

```
relative aspect-video overflow-hidden bg-card border-b border-border
```

Inicial: `text-7xl` (featured) / `text-4xl` (compact) `font-semibold text-muted/30 font-mono select-none` — no `text-accent/20`.

**Link inline** (Live, Repo, CTAs de pie de sección, footer)

```
... text-muted hover:text-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent/50 rounded-sm
```

**Social item**

```
group flex items-center gap-2 px-4 py-2 rounded-md text-muted hover:text-foreground hover:bg-card transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-background
```

### 2.5 Motion

En `global.css`:

- `[data-reveal]`: `translateY(12px)`; transition `opacity 0.35s ease-out, transform 0.35s ease-out`.
- `@keyframes fadeInUp`: `translateY(10px)`; duración `0.4s`.
- Bloque `prefers-reduced-motion`: no cambiar la lógica; sigue anulando animaciones.

No añadir `animate-bounce`, `animate-pulse`, ni transiciones > 400ms salvo el reveal 350ms ya fijado.

### 2.6 Radios y blur

| Uso | Valor |
| --- | --- |
| Cards, botones, inputs, lightbox, chips | `rounded-md` |
| Focus ring helpers, thumbs | `rounded-sm` |
| Avatar foto | `rounded-full` (única excepción) |
| Nav, skip-link, scrollbar thumb | `rounded-none` / sin rounded |
| `backdrop-blur*` / `backdrop-filter` | **cero** en todo el repo `src/` |

### 2.7 `THEME_COLORS` en `src/utils/constants.ts`

Reemplazar el objeto entero por:

```ts
export const THEME_COLORS = {
  background: '#17191c',
  foreground: '#d5d8dc',
  accent: '#b6bdc6',
  accentHover: '#c8ced6',
  muted: '#9399a1',
  card: '#1f2227',
  border: '#343940',
  borderStrong: '#4a5058',
};
```

No usarlo en componentes; existe para no dejar un segundo Nord colgando. No leer estos valores desde JS para pintar UI.

---

## 3. Lista archivo-a-archivo

Orden de ejecución. No crear archivos nuevos de componentes. No añadir dependencias salvo el caso `sharp` de 3.13.

### 3.1 `src/styles/global.css` — OBLIGATORIO, primero

- Sustituir colores `@theme` por el bloque 2.2.
- `body`: `background-color` / `color` → variables. Conservar Inter + `font-feature-settings`.
- `::selection` y scrollbar según 2.2. Thumb `border-radius: 0`.
- Skip-link: `border-radius: 0`.
- Reveal + `fadeInUp` según 2.5.
- No tocar `scroll-behavior`, reset `*`, ni el media query de reduced-motion (salvo que las nuevas animaciones queden cubiertas, que ya lo están).

### 3.2 `src/utils/constants.ts`

- Solo `THEME_COLORS` (sección 2.7).
- No tocar `AUTHOR`, `NAV_LINKS`, `SOCIAL_LINKS`, `SITE_METADATA`, `AVATAR_URL`.

### 3.3 `src/layouts/Layout.astro`

- `<meta name="theme-color" content="#17191c" />`
- No tocar JSON-LD, analytics, skip-link markup, `lang`, OG tags (la imagen se regenera en 3.13; las metas siguen apuntando a `/og.png`).

### 3.4 `src/components/Header.astro`

- `<header>` y `<nav>`: clases de 2.4. Eliminar `rounded-full`, `bg-card/80`, `backdrop-blur-md`, `px-6 py-4` del header externo (el padding pasa al nav).
- Logo: `font-semibold` + `hover:opacity-80` (quitar `hover:text-accent`).
- Links: `hover:text-foreground`, `duration-200`, `rounded-sm`.
- Conservar spacer `<div class="h-20">`.

### 3.5 `src/components/Hero.astro`

- Avatar wrapper: `w-32 h-32 rounded-full overflow-hidden ring-1 ring-border ring-offset-2 ring-offset-background` (quitar `ring-2 ring-accent/30 ring-offset-4`).
- **Borrar** el `<p class="text-muted text-sm uppercase tracking-wider">Fullstack Dev · Agentic workflow</p>`. El H1 ya dice el rol; el eyebrow es template + “Agentic”.
- H1: `text-5xl md:text-6xl font-semibold text-foreground tracking-normal` (quitar `font-bold tracking-tight`).
- Stack line: **dejar** `text-xl text-accent font-medium`.
- Párrafo bio: **no cambiar una letra** (incluye “flujo agentico — Claude Code, Codex, OpenCode”).
- CTAs: primario / ghost según 2.4. Conservar hrefs `#bio` `#work` `#contact`. Conservar el texto `Escribeme` (sin tilde) — es voz de Vicente, no un typo a “corregir”.
- **Borrar** el bloque scroll indicator (`absolute bottom-8 animate-bounce` + svg). No reemplazar por otro chevron.

### 3.6 `src/components/Bio.astro`

- H2: clases de sección 2.4. Quitar el `<span class="border-b-2 ...">`; el texto `Bio` queda directo en el `h2`.
- Dot: reemplazar `w-3 h-3 rounded-full bg-accent group-hover:scale-125 transition-transform duration-300` por `w-2 h-2 bg-muted mt-1.5` (cuadrado, sin hover scale).
- `time`: `text-sm font-mono text-muted` (no `text-accent`).
- CTA “Ver mis proyectos”: `hover:text-foreground`, `duration-200`. Conservar el copy.

### 3.7 `src/components/Works.astro`

- H2: `text-3xl font-semibold mb-3 text-foreground`. Quitar el span subrayado. Conservar el recuento `N proyectos · años`.
- Featured + compact articles: clase card 2.4. Quitar `rounded-xl` / `rounded-lg`, quitar translates.
- Imágenes: quitar scale-on-hover.
- Placeholders: sólido 2.4, no `bg-gradient-to-br`.
- Chips: clase chip 2.4. Conservar `slice(0, 4)` en compact.
- Highlights: el `▸` `text-accent` → `<span class="text-muted mt-0.5 shrink-0" aria-hidden="true">–</span>` (en-dash, muted).
- Live/Repo: `hover:text-foreground`.
- Lightbox: `rounded-md` (no `xl`). Quitar `backdrop:bg-background/80` glass. En `<style>`:

```css
dialog.lightbox::backdrop {
  background-color: color-mix(in srgb, var(--color-background) 88%, black);
}
```

Sin `backdrop-filter`. Botón cerrar: `rounded-md hover:border-border-strong hover:text-foreground` (no `hover:border-accent/50`).

- CTA de pie: texto **`Contacto`** (reemplaza `Trabajemos juntos`). Conservar `href="#contact"` y la flecha `→`. Clases `hover:text-foreground duration-200`.

### 3.8 `src/components/SocialLinks.astro`

- H2: clases de sección; quitar span subrayado. Copy del H2 (`En la web`) y del párrafo: no cambiar.
- Links + botón Discord: clase social 2.4. Quitar `hover:text-accent hover:bg-accent/10` y `duration-300` / `transition-all`.
- No tocar el `<script>` de clipboard.

### 3.9 `src/components/Footer.astro`

- `hover:text-foreground duration-200` en “↑ Inicio”.
- Copy `© {year} nndsk · por Nande`: no cambiar.

### 3.10 `src/pages/404.astro`

- Número 404: `text-6xl md:text-8xl font-semibold text-foreground mb-4` (no `text-accent`, no `font-bold`).
- Botón “Volver al inicio”: CTA primario 2.4.
- Copy de títulos/párrafo: no cambiar.

### 3.11 `public/favicon.svg`

```svg
<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="64" height="64" rx="14" fill="#17191c"/>
  <path d="M18 44V20h4.5l15 16.5V20H42v24h-4.5L22.5 27.5V44H18z" fill="#b6bdc6"/>
</svg>
```

Path idéntico; solo fills.

### 3.12 `public/manifest.webmanifest`

- `background_color`: `#17191c`
- `theme_color`: `#17191c`
- Resto igual.

### 3.13 `scripts/generate-og.mjs` + `public/og.png`

Sustituir hex:

| Uso en el SVG | Hex nuevo |
| --- | --- |
| fondo rect 1200×630 | `#17191c` |
| barra superior y glifos N | `#b6bdc6` |
| rects del monograma | `#1f2227` |
| “Nande” | `#d5d8dc` |
| “Fullstack Developer” | `#b6bdc6` |
| divisor | `#343940` |
| stack + `nndsk.dev` | `#9399a1` |

No cambiar layout, textos, ni path `nPath`.

Regenerar:

```bash
bun scripts/generate-og.mjs
```

`sharp` no está en `package.json` (el script lo importa). Si falla el módulo:

```bash
bun add -d sharp
bun scripts/generate-og.mjs
```

Esa es la **única** excepción permitida al lockfile. No añadir otras deps.

### 3.14 `public/apple-touch-icon.png` y `public/favicon.ico`

Deben coincidir con el SVG nuevo. Tras 3.11, rasterizar (si `sharp` está disponible tras 3.13):

```bash
bun -e '
import sharp from "sharp";
await sharp("public/favicon.svg").resize(180,180).png().toFile("public/apple-touch-icon.png");
await sharp("public/favicon.svg").resize(32,32).toFile("public/favicon-32.png");
'
```

Para `.ico`: si no hay encoder ico, dejar `favicon.ico` como PNG 32×32 copiado no es válido. Opción mecánica: instalar nada; generar `favicon.ico` con sharp no siempre emite ICO. **Hacer esto:** actualizar `favicon.svg` (browsers modernos) + `apple-touch-icon.png` PNG 180. Si `favicon.ico` no se puede regenerar sin deps extra, **actualizar igualmente** copiando un PNG 32×32 no. Mejor: usar ImageMagick si existe (`convert public/favicon.svg -define icon:auto-resize=32,16 public/favicon.ico`). Si ni sharp-ico ni convert están, dejar `favicon.ico` viejo **y anotarlo en el PR de implementación** como leftover de una sola asset legacy — no bloquear el resto.

Prioridad: SVG + apple-touch-icon + og.png + theme-color. `favicon.ico` es best-effort.

### 3.15 Archivos que NO se tocan

Ver sección 5. Incluye todo `src/content/**`, `index.astro`, middleware, `astro.config.mjs`, iconos, `public/scripts/site.js`, `README.md`, `AGENTS.md`, este plan.

---

## 4. Copy: permitido vs prohibido

**Default: visual/sistema. No reescribir biografía ni proyectos.**

### Permitido (lista cerrada)

| Ubicación | De | A | Motivo |
| --- | --- | --- | --- |
| `Hero.astro` eyebrow | `Fullstack Dev · Agentic workflow` | **eliminar el nodo** | Microcopy AI + redundante con el H1 |
| `Works.astro` CTA pie | `Trabajemos juntos` | `Contacto` | Cierre de template; destino `#contact` |

### Prohibido

- Inventar NestJS, Kubernetes, AWS, “high-traffic”, equipos multi-persona, “senior”, “lead de plataforma”.
- Reescribir timeline JSON, descriptions/highlights/stack de proyectos, `SITE_METADATA.description`, README.
- “Corregir” `Escribeme` → `Escríbeme`.
- “Corregir” Mercado House `Go/Gin` → Express o cualquier otro stack. **AMBIGÜEDAD, sección 7.**
- Traducir `Live` / `Repo`.
- Añadir eyebrow nuevo (“Building the future”, “Crafting experiences”, ubicación inventada, etc.).
- Tocar el párrafo del Hero que menciona Claude Code / Codex / OpenCode (es hecho personal, no badge).

---

## 5. NON-goals (no tocar)

- Merge a `main` / deploy a producción / `nndsk.dev` live.
- Rutas nuevas, blog, CMS, i18n, dark/light toggle.
- Fuentes nuevas o CDN de fonts. Inter se queda.
- `astro.config.mjs` (`output: 'static'`, image domains, sitemap).
- `src/middleware.ts` y `vercel.json` (CSP, cache). No hace falta ampliar `font-src`.
- `src/content.config.ts` y cualquier JSON/PNG bajo `src/content/`.
- `src/pages/index.astro`, `src/pages/robots.txt.ts`.
- `src/components/icons/*`, `public/scripts/site.js`.
- Hidratar islas (`client:*`). El Discord script inline se queda.
- View Transitions, prefetch.
- Sombras (`shadow-*`), glow, mesh, noise overlays, grain, scanlines, cyberpunk.
- Púrpura, índigo, violet, fuchsia, cian Nord, navy `#0a0f1c` / `#111827` / `#1e293b`.
- Glassmorphism (`backdrop-blur`, fondos `/80` sobre blur).
- Cambiar `featured` / `order` / thumbnails.
- Tests nuevos (no hay framework). Validación = lint + format + build.

---

## 6. Acceptance checklist (Composer)

### 6.1 Comandos (cwd repo, Bun 1.3.9)

```bash
bun install --frozen-lockfile
# si 3.13 añadió sharp, entonces SIN frozen: bun install
bun run format
bun run lint
bun run format:check
bun run build
```

Build debe salir 0. `dist/` no se commitea.

Si se añadió `sharp`, el lockfile `bun.lock` / el que use el repo entra en el PR de **implementación**, no en este.

### 6.2 Grep de patrones prohibidos (debe ser vacío en `src/` y `public/` excepto este doc)

```bash
rg -n "backdrop-blur|backdrop-filter" src public --glob '!docs/**'
rg -n "bg-gradient|from-accent/10|animate-bounce|tracking-wider" src
rg -n "#0a0f1c|#81a1c1|#88c0d0|#111827|#1e293b|#616e88" src public scripts
rg -n "Agentic workflow|Trabajemos juntos" src
rg -n "hover:-translate-y|group-hover:scale-105|rounded-full bg-card" src
```

Excepción `rounded-full`: solo el avatar en `Hero.astro`.

Excepción hex `#b6bdc6` / `#17191c`: favicon, manifest, generate-og, theme-color, `THEME_COLORS`. No en componentes Tailwind (ahí se usan clases semánticas).

### 6.3 Checks visuales (dev o preview)

```bash
bun run preview
# o bun run dev
```

Ejercer como usuario, no solo screenshot:

**Home `/` desktop ~1280 y mobile ~375**

1. Header: barra full-width sólida, filo inferior 1px, **sin** píldora ni blur al scrollear.
2. Hero: sin eyebrow, sin chevron bounce; avatar con ring `border` fino; stack line en plata `#b6bdc6`; bio intacta.
3. “Ver trabajos” / “Sobre mí” / “Escribeme”: click y el ancla llega a `#work` / `#bio` / `#contact`.
4. Bio: dots cuadrados muted; años muted no plata; copy 2023–2026 intacta.
5. Trabajos: 2 featured (EcoRetirosRM, Mercado House) + 3 compactas; hover **no** levanta ni zoomea; chips muted con borde, no píldoras cian.
6. Lightbox: abrir galería EcoRetirosRM, cerrar con botón y ESC; backdrop oscuro **sin** blur.
7. Contacto: Discord copia usuario y muestra `¡Copiado!`; GitHub/LinkedIn/etc. siguen `_blank`.
8. Footer: año actual + `por Nande`.

**404 `/no-existe`**

9. Número 404 en foreground, no plata gigante. “Volver al inicio” → `/`.

**A11y / motion**

10. Skip-link visible al Tab; focus rings plata suaves.
11. `prefers-reduced-motion: reduce`: sin fade del hero ni reveal.

**Anti-template (falla si se ve)**

12. Cero cian Nord, cero navy, cero púrpura, cero mesh, cero glass nav.
13. Una sola nota plata persistente: la línea TypeScript • Go • Rust.

### 6.4 Lo que este plan no verifica

- Pixel-perfect contra un Figma (no hay archivo de diseño).
- Lighthouse score (no es meta de esta fase).

---

## 7. Ambiguities que requieren a Vicente

### A1. Mercado House: Go/Gin vs Express — NO BLOQUEA el visual

- En repo, `src/content/projects/mercado-house.json`:
  - `description`: “… Next.js, Go/Gin, PostgreSQL, Wails.”
  - `highlights[2]`: “Backend Go/Gin + frontend Wails desktop”
  - `stack`: `["Next.js", "Go", "PostgreSQL", "Wails"]` (sin Gin)
- El brief de este plan indica que el README de GitHub de MH puede decir Express.
- **Implementer: no editar ese JSON.** No inventar Gin, ni Express, ni “Go (Gin o Express)”.
- Vicente debe confirmar **una** de estas antes de un PR de copy:
  1. Dejar `Go/Gin` (el JSON actual es correcto).
  2. Sustituir `Go/Gin` por `Express` en description + highlight, y decidir si `stack` pasa a incluir `Express`.
  3. Texto mixto factual (p. ej. API Express + servicio Go) — **solo con frase de Vicente**, no inventada.

### A2. `favicon.ico` raster — menor, no bloquea

Si el entorno no puede emitir ICO, el implementer lo declara en el PR de implementación y deja el `.ico` viejo (navy/Nord) como leftover. SVG + apple-touch-icon + theme-color sí deben quedar grafito.

### Resto

**NONE.** Color, radios, motion, acento, eyebrow, CTA “Contacto”, Inter, y non-goals están cerrados. El implementer no pregunta “¿más plata?”, “¿otra fuente?”, “¿glass sutil?”: la respuesta es no.

---

## Apéndice: mapa de clases actuales → nuevas (quick ref)

| Sitio | Quitar | Poner |
| --- | --- | --- |
| Nav | `rounded-full bg-card/80 backdrop-blur-md border border-border/50` | barra `border-b border-border bg-background` |
| Avatar ring | `ring-2 ring-accent/30 ring-offset-4` | `ring-1 ring-border ring-offset-2` |
| H1 / H2 | `font-bold` + underline span | `font-semibold`, sin span |
| Card hover | `-translate-y-*` + `border-accent/50` | `hover:border-border-strong` |
| Img hover | `group-hover:scale-105` | nada |
| Chips | `rounded-full bg-accent/10 text-accent border-accent/30` | chip 2.4 |
| Social hover | `hover:text-accent hover:bg-accent/10` | `hover:text-foreground hover:bg-card` |
| Durations | `duration-300` / `duration-500` | `duration-200` (reveal CSS aparte) |
)
