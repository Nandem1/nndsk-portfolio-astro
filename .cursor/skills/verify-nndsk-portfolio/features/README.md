# nndsk-portfolio verification map

This directory is the maintained source for verifying visitor-facing behavior of the nndsk.dev Astro portfolio. Read this index before driving, then use the matching feature file as the recipe.

## Baseline preconditions

- Launch with `.cursor/skills/verify-nndsk-portfolio/scripts/launch.sh` (default `http://127.0.0.1:43211`).
- Run `.cursor/skills/verify-nndsk-portfolio/scripts/doctor.sh` and require `doctor ok` for that URL.
- Never drive `https://nndsk.dev` or a user's `bun run dev` on `:4321`.
- Trailing slashes are required (`/projects/nndsk-ro-launcher/`, not the unsashed path).
- Start every recipe from a fresh load of the listed route unless its preconditions say otherwise.
- Compact demo on home is `client:visible`: scroll it into view before asserting interactivity.
- Case-study demo is `client:load`: wait for region `Demo de RO-Launcher` before clicking launch.

## Driving conventions

- Prefer ARIA roles and accessible names (Spanish strings below) over CSS selectors or coordinates.
- Treat quoted UI copy as literal.
- Browser actions go through Cursor IDE browser against the managed URL.
- HTTP-only checks may use `curl` against the same URL.
- Restore demo state with a full reload (there is no persisted demo state). Do not remove proof artifacts during cleanup.

## Proof and skip reporting

- Capture the user action and the resulting state, not only the final screen.
- UI proof includes an ARIA snapshot and a screenshot with `nndsk` in the header.
- HTTP proof includes status code and a body excerpt.
- Record the feature ID and entry point used with every artifact under `evidence/<feature-id>/`.
- Report an unreachable path with the attempted handle and the unmet precondition.
- Do not report a skipped entry point as verified through a different path.

## Feature entry contract

Each feature file starts with an H1 title and one paragraph describing the user-visible behavior. It then uses exactly four H2 sections in this order.

1. `Sub-features` lists short IDs with one line for each behavior.
2. `How to get to it (user POV)` lists every user entry point.
3. `Driving it with cursor-ide-browser` starts with `Preconditions:` and uses labeled bullets that pair each user action with an exact command and observable result.
4. `Gotchas` lists traps that can waste or invalidate a verification run.

Keep implementation details out of the map. Name only user paths, stable handles, required state, commands, and observable proof.

## Features

- [Home landing](./home.md) covers hero, in-page nav, bio timeline, trabajos index, and 404.
- [Spotlight demo](./spotlight-demo.md) covers the compact RO-Launcher island on home.
- [RO-Launcher case study](./case-study.md) covers the case-study page and the full demo.
- [Works lightbox](./works-lightbox.md) covers opening and closing project galleries.
- [Contact](./contact.md) covers social links and Discord copy.
