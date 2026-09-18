# Repository Guidelines

This file is the source of truth for agents in this repo. If it conflicts with `.agents/skills/astro-framework/`, this file wins.

This is a **static** Astro 7 portfolio (`output: 'static'`, no adapter). It is not a blog, not an SSR app, and not a React SPA.

## Stack (locked)

- Astro ^7, React 19, Tailwind 4 (`@tailwindcss/vite`), Zod via `astro/zod`, Bun 1.3.9
- React is allowed **only** in `src/components/ro-launcher-demo/`
- Content Layer: `src/content.config.ts` with `glob` loaders
- Collections: `projects` (JSON + PNG next to JSON), `timeline` (JSON). There is **no** `blog` collection.

## Layout

- `src/pages/` — routes only. Keep `export const prerender = true`.
- `src/layouts/Layout.astro` — document shell, Fonts API `<Font>`, OG `/og.png`, Person/WebSite JSON-LD.
- `src/components/` — static `.astro`. Icons in `src/components/icons/`.
- `src/components/ro-launcher-demo/` — the only hydrated island.
- `src/content/` — collection entries. Schemas live in `src/content.config.ts` (not `src/content/config.ts`).
- `src/styles/global.css` — Tailwind v4 `@import 'tailwindcss'` + `@theme`. Semantic color tokens live here, not in TS.
- `src/utils/` — `constants.ts` (author/nav/social/site), `jsonLd.ts`, `ui.ts` (shared CTA classes).
- `src/assets/fonts/` — Inter woff2 consumed by Astro Fonts API.
- `public/` — favicons, `og.png`, manifest, `scripts/site.js`. Do not put fonts or content images here.

Do not edit `dist/`, `.astro/`, or `node_modules/`. Do not change `bun.lock` unless the task installs/removes a dependency.

## Commands

Use Bun 1.3.9.

- `bun install --frozen-lockfile`
- `bun run dev`
- `bun run build`
- `bun run preview`
- `bun run lint`
- `bun run format` / `bun run format:check`
- `bun run check`
- Required validation before finishing work: `bun run lint`, `bun run format:check`, `bun run check`, `bun run build`.

## Astro rules

MUST:

- Default to zero JS. Question every `client:` directive.
- Home spotlight island: `client:visible`. Case-study hero island: `client:load`.
- Pass only serializable props into islands (this island accepts only `variant: 'compact' | 'full'`).
- Query one entry with `getEntry`; lists with `getCollection`. Do not wrap content loaders in try/catch — let the static build fail.
- Use `OptimizedPicture.astro` (`<Picture formats={['avif', 'webp']}>`) for all images. Meaningful `alt` always.
- Import from `src/` with the `@/` alias.
- Define `interface Props` only when the `.astro` component accepts props.
- Keep `trailingSlash: 'always'`. Internal links to pages use a trailing slash (`/projects/nndsk-ro-launcher/`).
- Site identity URLs in JSON-LD use `SITE_METADATA.url`. Canonical/OG URL uses `Astro.site`.
- Interactivity that is not the RO demo stays in `.astro` `<script>` or `public/scripts/site.js` — do not add new React islands for it.
- Add `data-astro-prefetch` only on the case-study CTA (global `prefetchAll` is false).
- Page transitions use CSS `@view-transition { navigation: auto }` in `src/styles/global.css` (MPA cross-document); do not add `ClientRouter`.

MUST NOT:

- Switch `output` away from `'static'` or add an SSR adapter.
- Add `ClientRouter` or Astro `transition:` directives.
- Enable React Compiler (`babel-plugin-react-compiler`) until `@astrojs/react` prebundles `react/compiler-runtime`.
- Use `client:only` for `RoLauncherDemo`.
- Hydrate Header, Footer, nav, Bio, Works cards, or SocialLinks with React.
- Add Markdown/MDX/blog collections unless explicitly asked.
- Put collection images in `public/` or use string paths for local images.
- Duplicate CTA class strings or SoftwareApplication JSON-LD; use `src/utils/ui.ts` and `src/utils/jsonLd.ts`.
- Reintroduce `src/middleware.ts` for security headers (Vercel `vercel.json` owns production headers).
- Allow unused remote image hosts in `astro.config.mjs` / CSP.
- Silence content/schema errors with empty fallbacks on `index`.

## React island rules (`src/components/ro-launcher-demo/`)

- Public API: `RoLauncherDemo({ variant })` only. No callbacks from `.astro`.
- State: `useReducer` + `demo.logic.ts`. Do not scatter `useState` for the same machine.
- Keep `usePreservedWindowScrollDispatch`. Do not remove it to “simplify”.
- `compact` hides logs/reset/tools; `full` shows them. Do not create a second entry bundle unless explicitly asked.
- React 19 server APIs (`use`, `useActionState`, Actions) do not apply here (static island).
- New UI inside the demo is `.tsx` in `chrome/`, `center/`, `rail/`, or `logs/`. Logic stays in `demo.logic.ts`.

## Content rules

- Update `src/content.config.ts` before adding fields.
- New project: `src/content/projects/<slug>.json` + images in `src/content/projects/<slug>/`.
- `spotlight: true` is reserved for the RO launcher card on home. A case-study page is a dedicated file under `src/pages/projects/<slug>.astro` (do not introduce `getStaticPaths` until there is a second case study).
- `featured` = large cards with lightbox. Neither flag = compact “Otros” cards.

## Style

Prettier: 2 spaces, semicolons, single quotes, ES5 trailing commas, `printWidth` 100, LF. ESLint: no `any`; unused vars only if prefixed `_`. PascalCase components, kebab-case slugs. Tailwind semantic tokens (`bg-background`, `text-muted`, `border-border`) — no new raw hex in components.

## Commits

Short imperative messages (`Fix case study getEntry`, `Add Fonts API`). Do not commit unless asked.

## Out of scope unless asked

ClientRouter / Astro View Transitions router, React Compiler, dynamic case-study routes, blog, test runner, `astro:env`, Actions, adapters, splitting the React island into multiple islands.
