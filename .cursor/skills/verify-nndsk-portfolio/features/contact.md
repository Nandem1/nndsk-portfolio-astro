# Contact

Contact is the `En la web` section: outbound social links and a Discord control that copies `nandem1` without leaving the page.

## Sub-features

- `contact-heading` shows `En la web` at `/#contact`.
- `contact-outbound` exposes GitHub, LinkedIn, Instagram, and Email with visible names.
- `contact-discord-copy` copies `nandem1` and shows `¡Copiado!` then returns to `Discord`.

## How to get to it (user POV)

- Open `/#contact`.
- Choose header `Contacto` or hero `Escríbeme`.
- From `Trabajos`, choose the `Contacto` jump at the bottom of the section.

## Driving it with cursor-ide-browser

Preconditions:

- `scripts/doctor.sh` reports the managed URL.
- Start at `$URL/` and move to `#contact`.

- **Reveal section.** Choose `Contacto` in `Navegación principal`. Heading `En la web` is in view. Copy mentions GitHub, LinkedIn, Instagram, Discord, and correo.
- **Outbound names.** Nav `Redes sociales` contains links `GitHub`, `LinkedIn`, `Instagram`, `Email`. Do not navigate off-origin; asserting `href` from the snapshot is enough (`https://github.com/Nandem1`, `https://www.linkedin.com/in/vicente-nandev/`, Instagram URL, `mailto:nande@nndsk.dev`).
- **Discord copy.** Choose `Copiar usuario de Discord: nandem1`. The button's visible label becomes `¡Copiado!`. After ~2s it returns to `Discord`. If clipboard read is allowed, it equals `nandem1`; if the browser blocks clipboard, the label change is still the required proof.
- **Proof.** Screenshots `contact.png` and `discord-copied.png` (label `¡Copiado!`), `snapshot.aria.yml`, `notes.md` with feature id `contact`.

## Gotchas

- Discord is a `button`, not a link. There is no Discord profile URL to follow.
- `¡Copiado!` lasts 2000ms. Capture immediately after the click.
- Do not treat a failed clipboard permission as a product bug if the label still flips.
- Email is `nande@nndsk.dev`, not the Gmail address in the README.
