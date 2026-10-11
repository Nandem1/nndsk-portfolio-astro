# Home landing

Home is the portfolio landing page: identity, in-page navigation, bio timeline, project index, and a path back from unknown URLs.

## Sub-features

- `home-hero` shows the avatar, h1 `Nande — Fullstack Developer`, and stack line `TypeScript • Go • Rust`.
- `home-nav` jumps to Bio, Trabajos, and Contacto from the sticky header.
- `home-bio` renders the timeline including `El presente`.
- `home-works` lists the spotlight `nndsk-ro-launcher` plus featured cards Mercado House and EcoRetirosRM.
- `home-404` serves the not-found page for an unknown path and returns to `/#top`.

## How to get to it (user POV)

- Open `/`.
- Choose header links `Bio`, `Proyectos`, or `Contacto`.
- Choose hero links `Sobre mí`, `Ver trabajos`, or `Escríbeme`.
- Open an unknown path such as `/no-existe/` and choose `Volver al inicio`.
- Choose footer `↑ Inicio`.

## Driving it with cursor-ide-browser

Preconditions:

- `scripts/doctor.sh` reports the managed URL (default `http://127.0.0.1:43211`).
- Start at a fresh `GET /`.

- **Load home.** Navigate to `$URL/`. The document title contains `nndsk`, `html lang` is `es-CL`, and heading `Nande — Fullstack Developer` is visible.
- **HTTP identity.** `curl -sS -D - -o /tmp/home.html "$URL/"` returns `200` and the body contains `Nande — Fullstack Developer` and `id="bio"`.
- **Nav Bio.** Choose `Bio` in `Navegación principal`. The heading `Bio` is in view and a timeline item titled `El presente` is present.
- **Nav Trabajos.** Choose `Proyectos`. The heading `Trabajos` is in view and the spotlight heading `nndsk-ro-launcher` is present. Featured cards include `Mercado House` and `EcoRetirosRM`. Compact cards under `Otros` include `nndsk-gisan-astro` and `nndsk-hyprtask`.
- **Nav Contacto.** Choose `Contacto`. The heading `En la web` is in view.
- **Skip link.** Focus the skip link `Saltar al contenido principal` and activate it. `#main-content` receives the jump.
- **404.** Navigate to `$URL/no-existe/`. Heading `Página no encontrada` is visible. `curl -sS -o /dev/null -w "%{http_code}" "$URL/no-existe/"` is `404`. Choose `Volver al inicio`; the URL hash is `/#top` or `/` and the hero h1 is visible.
- **Proof.** Save `doctor.txt`, `home.html` excerpt, `snapshot.aria.yml` of `/`, screenshots `hero.png` and `works.png`, and `notes.md` recording `home` plus the 404 status code.

## Gotchas

- Header `Proyectos` goes to `/#work`, not a `/projects/` index. There is no projects listing route.
- Home demo is below the fold on typical viewports; `home-works` only requires the spotlight title, not a hydrated island (see `spotlight-demo.md`).
- View-transition hash handling can settle scroll on `pagereveal`. Assert the target heading, not a pixel scroll offset.
- `curl` on `/no-existe` without the trailing slash may redirect; use `/no-existe/`.
- `browser_click` on `Volver al inicio` may only focus the link. If the URL stays `/no-existe/`, press Enter on the focused link. Success is `/#top` plus heading `Nande — Fullstack Developer`.
- Do not count production CDN caching. This proof is the local instance only.
