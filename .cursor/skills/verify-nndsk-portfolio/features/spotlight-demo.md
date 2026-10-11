# Spotlight demo

The compact RO-Launcher island on home lets a visitor select a mock server, prepare a simulated Wine prefix, and see that Play does not launch a game.

## Sub-features

- `demo-compact-visible` hydrates the region `Demo de RO-Launcher` after it enters the viewport.
- `demo-select-server` switches HoneyRO / SakuraRO / unvalidated Gepard and updates the runner banner.
- `demo-prepare` runs `Preparar entorno` until the button reads `Jugar`.
- `demo-play-notice` shows the in-page status that the site does not launch the client.
- `demo-compact-chrome` hides logs, `Rearmar entorno`, and the Herramientas strip.

## How to get to it (user POV)

- Open `/`, scroll to `Trabajos`, use the compact island in the spotlight card.
- From `/projects/nndsk-ro-launcher/`, choose `Inicio` or `← Trabajos` and scroll to the same island.

## Driving it with cursor-ide-browser

Preconditions:

- `scripts/doctor.sh` reports the managed URL.
- Viewport is wide enough to show the spotlight card (`md` two-column). If the compact island is not in the snapshot, scroll `#work` into view and wait for hydration (`client:visible`).
- Start from a fresh `/` so prefix state is `pending`.

- **Reveal island.** Navigate to `$URL/`, scroll until heading `Trabajos` and region `Demo de RO-Launcher` appear. Header text `RO-Launcher` with `Demo` is visible. Button `Preparar entorno` is present.
- **Compact chrome.** Confirm there is no `Rearmar entorno` button, no `Logs` heading, and no `Herramientas` / `OpenSetup` strip. Tabs `Combate` and `Buffs` remain.
- **Select SakuraRO.** Choose radio `SakuraRO`. The runner combobox shows `Wine 7.16 Staging/TkG amd64 · old-WoW64` and the Gepard banner mentions `26.9.3.1`.
- **Select HoneyRO.** Choose radio `HoneyRO`. The combobox shows `nndsk-ro-proton 0.1.0-dev.2` and the banner mentions `26.8.26.1`.
- **Prepare.** Choose `Preparar entorno`. The button becomes `Configurando...` (disabled) then `Jugar` within ~8s. AutoPot status changes from `Prepara el entorno` to `Demo — sin cliente real`. Avanzado includes `Entorno aislado · listo`.
- **Play.** Choose `Jugar`. A status reads `Solo demo — el sitio no lanza el cliente.` No new OS process for the game appears (this site never execs Wine).
- **Proof.** Screenshots `before-prepare.png` (button `Preparar entorno`) and `after-play.png` (status visible), plus `snapshot.aria.yml` of the region. `notes.md` records `spotlight-demo` and that compact chrome stayed hidden.

## Gotchas

- If `prefers-reduced-motion: reduce` is set, prepare is instant (`prepareInstant`) and `Configurando...` may never appear. Assert `Jugar`, not the intermediate label.
- Clicking launch while `Configurando...` is a no-op (`aria-disabled`).
- Compact still shows AutoPot/Spammer; do not fail the proof because those panels exist.
- Hydration will not have happened if the island never entered the viewport. Scroll first.
- Reloading `/` resets prefix state. Do not continue a prepare proof across a reload.
