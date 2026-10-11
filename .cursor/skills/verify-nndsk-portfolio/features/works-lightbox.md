# Works lightbox

Featured (and some compact) project cards open a modal gallery of screenshots. The visitor can open it from the thumbnail or strip, then close it.

## Sub-features

- `lightbox-open-featured` opens Mercado House and EcoRetirosRM galleries from the large cards.
- `lightbox-open-otros` opens galleries for compact cards that have more than one image (`nndsk-gisan-astro`, `nndsk-hyprtask`).
- `lightbox-close-button` closes via `Cerrar (ESC)`.
- `lightbox-close-escape` closes via Escape.
- `lightbox-images` shows multiple captures inside `Galería de <title>`.

## How to get to it (user POV)

- On `/`, scroll to `Trabajos`.
- Choose `Abrir galería de Mercado House` (hero thumbnail) or a strip thumbnail.
- Choose `Abrir galería de EcoRetirosRM`.
- Under `Otros`, choose `Abrir galería de nndsk-gisan-astro` or `nndsk-hyprtask` when those cards have a gallery button.
- Close with `Cerrar (ESC)`, Escape, or a click on the dialog backdrop.

## Driving it with cursor-ide-browser

Preconditions:

- `scripts/doctor.sh` reports the managed URL.
- Start at `$URL/` with `#work` in view. No dialog should be open.

- **Open Mercado House.** Choose `Abrir galería de Mercado House`. A dialog named `Galería de Mercado House` is open (`dialog[open]` / modal). Images `Captura 1 de Mercado House` and `Captura 2 de Mercado House` (at least) are inside it.
- **Close button.** Choose `Cerrar (ESC)`. The dialog is no longer open. `Trabajos` remains on the page.
- **Reopen EcoRetirosRM.** Choose `Abrir galería de EcoRetirosRM`. Dialog `Galería de EcoRetirosRM` opens.
- **Escape.** Press `Escape`. The dialog closes.
- **Spotlight has no lightbox.** The nndsk-ro-launcher spotlight uses the live demo, not `Abrir galería de nndsk-ro-launcher`. Do not expect that button on the spotlight card.
- **Proof.** Screenshots `open.png` (dialog visible) and `closed.png` (no modal), `snapshot.aria.yml` while open, `notes.md` with feature id `works-lightbox` and which card was used.

## Gotchas

- Openers are `data-dialog-open` buttons handled by `public/scripts/site.js`. A snapshot taken before that script runs will click a button that does nothing. Wait until the button is present, click, then assert the dialog — retry once if the first click is a no-op after load.
- Cards with a single image and no gallery do not get an open button. Do not fail `Otros` because a card without a gallery cannot open.
- Backdrop click closes only when the click target is the `dialog.lightbox` element itself, not an inner image.
- Do not use the case-study page to prove this feature; galleries there are static figures, not this dialog.
