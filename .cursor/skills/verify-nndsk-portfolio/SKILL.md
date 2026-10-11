---
name: verify-nndsk-portfolio
description: Drive the nndsk.dev Astro portfolio (static web UI) the way a visitor would — home, RO-Launcher demo island, case study, lightbox, and contact. Use when proving UI behavior after a change, before finishing a UI task, or when asked to verify the site locally.
---

# Verify nndsk-portfolio

Static Astro 7 portfolio (`output: 'static'`, no adapter, no blog). A visitor sees HTML pages plus one React island: `RoLauncherDemo` (`variant: 'compact' | 'full'`). There is no logged-in state, no API, and no Playwright/Cypress harness.

This skill is for a cold agent. Read `features/README.md` before driving. Prove the mapped entry points, not an internal setter.

## Surface

Primary: web UI at the managed local origin.

Routes that exist:

- `/` — home (hero, bio timeline, trabajos, contacto)
- `/projects/nndsk-ro-launcher/` — case study + full demo (`client:load`)
- `/robots.txt` — generated allow-all + sitemap line
- unknown paths — `src/pages/404.astro`

The compact demo on home hydrates with `client:visible`. The case-study demo hydrates with `client:load`. Header, footer, nav, bio, works cards, and social links are static HTML. Extra page JS is `public/scripts/site.js` (lightbox + `[data-reveal]`) and the Discord copy handler in `SocialLinks.astro`.

Internal links use trailing slashes (`trailingSlash: 'always'`).

## Launch

One managed instance. Default bind: `127.0.0.1:43211` (`VERIFY_HOST` / `VERIFY_PORT`). Do **not** attach to a user's `bun run dev` on `:4321`. If `.run/state.env` already has a live PID, refuse and tell the operator to run cleanup. If `:43211` is occupied by a process this skill did not start, refuse — do not kill by process name.

From repo root:

```bash
.cursor/skills/verify-nndsk-portfolio/scripts/launch.sh
```

Ready when stdout prints `ready http://127.0.0.1:43211 pid=<n>` and `GET /` returns 200. The helper double-forks Astro into a new session (`scripts/daemonize-astro.py`) so the agent shell can exit without taking the server with it. The Astro log is `.cursor/skills/verify-nndsk-portfolio/.run/astro.log`.

Teardown:

```bash
.cursor/skills/verify-nndsk-portfolio/scripts/cleanup.sh
```

No auth, env files, or seed data. `bun install --frozen-lockfile` runs only if `node_modules` is missing. Runtime is Bun 1.3.9.

`bun run preview` after `bun run build` is production-like static serving. Use `scripts/launch.sh` (`astro dev`) unless a bug is build-output-only.

## Doctor

Run first whenever anything looks off:

```bash
.cursor/skills/verify-nndsk-portfolio/scripts/doctor.sh
.cursor/skills/verify-nndsk-portfolio/scripts/doctor.sh --json
```

Pass means: managed PID alive, port owned by that PID (or its child), `GET /` 200 with hero `Nande — Fullstack Developer` and region `Demo de RO-Launcher`, `GET /projects/nndsk-ro-launcher/` 200 with the case-study h1, `GET /robots.txt` 200 with `Allow: /`.

If doctor fails, do not drive. Read `.run/astro.log`, then launch or cleanup.

## Drive

No in-repo browser test runner. Drive the real pages with Cursor IDE browser (`cursor-ide-browser`) plus `curl` for HTTP-only checks.

Browser recipe:

1. `scripts/doctor.sh` must pass.
2. `browser_tabs` list, then `browser_navigate` to the managed `URL` from doctor (not production `https://nndsk.dev`).
3. `browser_lock` with `action: "lock"` before a sequence of clicks.
4. `browser_snapshot` for refs and accessible names. Prefer role + name over CSS or coordinates.
5. `browser_click` / `browser_fill` / `browser_press_key` / `browser_scroll` using those refs.
6. `browser_take_screenshot` with `filename` under `evidence/<feature-id>/`. Cursor may write the PNG under `$TMPDIR/cursor/screenshots/<absolute-path>`. Copy that file into `evidence/<feature-id>/` before cleanup.
7. `browser_lock` with `action: "unlock"` when the run is done.

Stable handles (Spanish UI strings, copy exactly):

| What              | Handle                                                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------------------------------ |
| Skip link         | link `Saltar al contenido principal` → `#main-content`                                                             |
| Logo              | link `nndsk` → `/#top`                                                                                             |
| Nav               | `aria-label="Navegación principal"`; links `Bio` `/#bio`, `Proyectos` `/#work`, `Contacto` `/#contact`             |
| Hero h1           | `Nande — Fullstack Developer`                                                                                      |
| Bio               | heading `Bio`; timeline includes `El presente`                                                                     |
| Works             | heading `Trabajos`; spotlight title `nndsk-ro-launcher`                                                            |
| Compact demo      | region `Demo de RO-Launcher` on `/` (`client:visible` — scroll `#work` into view before clicking)                  |
| Case study CTA    | link `Leer caso de estudio: nndsk-ro-launcher` → `/projects/nndsk-ro-launcher/`                                    |
| Case study h1     | `RO-Launcher`                                                                                                      |
| Full demo         | same region on `/projects/nndsk-ro-launcher/` (`client:load`)                                                      |
| Servers           | radiogroup via `name="ro-demo-server"`; labels `HoneyRO`, `SakuraRO`, `Servidor (Gepard no validado)`              |
| Runner            | combobox `Runner predeterminado`; options `nndsk-ro-proton 0.1.0-dev.2`, `Wine 7.16 Staging/TkG amd64 · old-WoW64` |
| Launch            | button text cycles `Preparar entorno` → `Configurando...` → `Jugar` (~6s unless `prefers-reduced-motion`)          |
| Play notice       | status `Solo demo — el sitio no lanza el cliente.`                                                                 |
| Reset (full only) | button `Rearmar entorno` (inert until prefix ready)                                                                |
| Tools tabs        | tablist `Vista de herramientas`; tabs `Combate` (`#ro-demo-tab-combat`), `Buffs` (`#ro-demo-tab-buffs`)            |
| AutoPot           | heading `AutoPot`; switches have `role="switch"` (no accessible name)                                              |
| Lightbox          | button `Abrir galería de Mercado House` / `EcoRetirosRM`; dialog `Galería de <title>`; `Cerrar (ESC)`              |
| Discord           | button `Copiar usuario de Discord: nandem1`; label becomes `¡Copiado!`                                             |
| 404               | heading `Página no encontrada`; link `Volver al inicio`                                                            |

Launch-button prepare is client-only. Do not assert it via `curl` HTML. Compact hides logs, `Rearmar entorno`, and the Herramientas strip (OpenSetup / Patcher / dgVoodoo). AutoPot / Spammer / tabs remain.

Follow `features/` recipes. A proof that uses one convenient entry point is incomplete when the map lists others.

## Evidence

Directory (survives cleanup; not committed):

`.cursor/skills/verify-nndsk-portfolio/evidence/<feature-id>/`

Required per proof:

- `doctor.txt` — stdout of `scripts/doctor.sh`
- HTTP dump of the route (`curl -sS "$URL<path>"`) when the feature is a page
- ARIA snapshot (browser_snapshot written to `snapshot.aria.yml`) after the user action
- Screenshot of the resulting state (`before` + `after` when the action changes the screen). If `browser_take_screenshot` stores the PNG under `$TMPDIR/cursor/screenshots/`, copy it here.
- `notes.md` — feature id, entry point used, action taken, observable result

Proof standards:

- Exercise the real visitor path. Do not dispatch `demoReducer` actions from the console.
- Capture the action and the resulting state, not only the final screen.
- The demo is a simulation: it must **not** write a WINEPREFIX, download Proton, or launch the game. After `Jugar`, the on-page status is `Solo demo — el sitio no lanza el cliente.`
- After Discord copy, the clipboard should contain `nandem1` (browser clipboard may be blocked; the visible `¡Copiado!` label is required proof, clipboard is extra).
- Lightbox `open` is a `<dialog>` `showModal()`. Assert `dialog.open` / accessible dialog name, not a CSS class.
- Do not treat production `nndsk.dev` as this instance.

## Cleanup

```bash
.cursor/skills/verify-nndsk-portfolio/scripts/cleanup.sh
```

Kills only the PID in `.run/state.env`, then deletes that state file. Does not delete `evidence/`. Does not touch `:4321` or other astro/bun processes.

If a drive fails, run cleanup before the next launch so ports and PIDs are not stranded.

## Helpers

All under `.cursor/skills/verify-nndsk-portfolio/scripts/`. Make them executable (`chmod +x`).

| Script               | What it does                                                                                                           |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `launch.sh`          | Double-forks `bun run astro -- dev --host 127.0.0.1 --port 43211`, writes `.run/state.env`, waits until `GET /` is 200 |
| `daemonize-astro.py` | Called by `launch.sh`; not invoked directly                                                                            |
| `doctor.sh`          | Read-only health of that instance (`--json` for one line)                                                              |
| `cleanup.sh`         | SIGTERM the managed PID and its children only; keeps evidence                                                          |
| `common.sh`          | Paths; sourced by the others, not invoked                                                                              |

Override bind with `VERIFY_HOST` / `VERIFY_PORT`. The skill still tracks a single PID in `.run/state.env`, so do not launch a second managed instance until cleanup.

## Isolate

Two Astro processes can bind different ports. This skill manages one. Never click around in a tab that is already the user's preview. If doctor reports a PID/port mismatch, stop.
