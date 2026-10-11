# RO-Launcher case study

The case-study page explains the Linux launcher and hosts the full demo: tools strip, logs, reset, and the same prepare/play simulation as home.

## Sub-features

- `case-copy` renders problem, approach, FAQ, and stack.
- `demo-full-chrome` shows Herramientas, Logs, and `Rearmar entorno`.
- `demo-prepare-logs` writes the simulation log line after prepare starts.
- `demo-play-logs` writes the desktop-app log line after `Jugar`.
- `demo-reset` returns the prefix to pending without deleting anything on disk.
- `demo-tools-tabs` switches Combate vs Buffs.

## How to get to it (user POV)

- Open `/projects/nndsk-ro-launcher/` directly.
- From home spotlight, choose `Caso de estudio` (`Leer caso de estudio: nndsk-ro-launcher`).
- From the case study, choose breadcrumb `Inicio` or `Trabajos`.

## Driving it with cursor-ide-browser

Preconditions:

- `scripts/doctor.sh` reports the managed URL.
- Start at a fresh `/projects/nndsk-ro-launcher/` so the demo is `pending`.
- JavaScript is enabled. The `noscript` figure is the fallback, not the path under test.

- **Open from home.** On `/`, choose `Leer caso de estudio: nndsk-ro-launcher`. The URL is `$URL/projects/nndsk-ro-launcher/` and h1 is `RO-Launcher`.
- **HTTP.** `curl -sS -o /dev/null -w "%{http_code}" "$URL/projects/nndsk-ro-launcher/"` is `200`. Body contains `¿Sirve para servidores privados?` and region markup `Demo de RO-Launcher`.
- **Full chrome.** In the demo region, `Herramientas` (OpenSetup / Patcher / dgVoodoo), `Logs`, and `Rearmar entorno` are present. Helper text under reset: `Disponible cuando el entorno está listo.`
- **Prepare.** Choose `Preparar entorno`. Button goes `Configurando...` then `Jugar`. Logs tab `Juego` contains `[demo] Simulación — no descarga Proton ni escribe un WINEPREFIX.`
- **Play.** Choose `Jugar`. Status `Solo demo — el sitio no lanza el cliente.` Logs contain `[demo] Jugar no está disponible en el sitio. RO-Launcher es una app de escritorio Linux.`
- **Reset.** Choose `Rearmar entorno`. Button returns to `Preparar entorno`. AutoPot status returns to `Prepara el entorno`. Logs contain `[demo] Rearmar simulado — no borra un WINEPREFIX.`
- **Tabs.** Choose tab `Buffs`. Tabpanel `AutoBuff` is shown (`aria-labelledby="ro-demo-tab-buffs"`). Choose `Combate`; AutoPot and Spammer return.
- **FAQ.** Headings `¿Sirve para servidores privados?`, `¿Hace falta ptrace_scope=0?`, `¿Modifica Gepard o el cliente?` are on the page.
- **Proof.** `before-prepare.png`, `after-play.png`, `after-reset.png`, `snapshot.aria.yml`, `notes.md` with feature id `case-study`. Confirm no `~/.local/share/ro-launcher` mutation is required for this site (the demo must not create it).

## Gotchas

- `client:load` still needs a moment after navigation. Wait for button `Preparar entorno`, not only the h1.
- Prepare is ~6s of timers. Poll the button label; do not sleep a fixed 1s and fail.
- Logs empty state before activity is `Wine / setup / lanzamiento...` (Juego) or `AutoPot / PID / memoria...` (Tools).
- `Limpiar` appears only when that channel has lines. Clearing logs is not required proof of prepare.
- Compact-on-home is a different chrome set. Do not mark `demo-full-chrome` verified from `/`.
- Repo / GitHub links leave the origin. Do not follow them as part of this proof.
