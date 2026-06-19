# Repository Guidelines

## Project Structure & Module Organization

This is a static Astro portfolio site. Source code lives in `src/`: routes in `src/pages`, shared UI in `src/components`, layout shells in `src/layouts`, global CSS in `src/styles`, and helpers/constants in `src/utils`. Content collections are under `src/content`: Markdown blog posts in `blog`, JSON project entries in `projects`, and JSON timeline entries in `timeline`. Collection schemas are defined in `src/content.config.ts`; update them before adding new content fields. Static public assets belong in `public`. Generated output such as `dist`, `.astro`, and `node_modules` should not be edited.

## Build, Test, and Development Commands

Use Bun 1.3.9, matching `package.json` and CI.

- `bun install --frozen-lockfile` installs dependencies from the lockfile.
- `bun run dev` starts the Astro development server.
- `bun run build` creates the static production build in `dist/`.
- `bun run preview` serves the built site locally.
- `bun run lint` runs ESLint over JavaScript and TypeScript.
- `bun run format:check` verifies Prettier formatting.
- `bun run format` applies Prettier formatting.

## Coding Style & Naming Conventions

Prettier uses 2 spaces, semicolons, single quotes, trailing commas where valid in ES5, `printWidth: 100`, and LF endings. ESLint enforces recommended JavaScript and TypeScript rules, rejects `any`, and allows intentionally unused variables only when prefixed with `_`. Use PascalCase for Astro components, kebab-case for route and content slugs, and the `@/*` alias for imports from `src`.

## Testing Guidelines

There is no dedicated test framework configured yet. Treat `bun run lint`, `bun run format:check`, and `bun run build` as the required validation suite before opening a PR. For content-only changes, still run `bun run build` to catch schema, route, and Markdown errors.

## Commit & Pull Request Guidelines

The current history is minimal and does not establish a formal commit convention. Use short, imperative commit messages such as `Add project collection entry` or `Fix blog date formatting`. Pull requests should include a concise summary, validation commands run, linked issue if applicable, and screenshots for visual changes. CI runs on pushes and pull requests to `main`.

## Agent-Specific Notes

Keep changes scoped to source and content files. Do not modify generated folders or lockfiles unless dependency changes require it. Preserve Astro static output assumptions in `astro.config.mjs`.
