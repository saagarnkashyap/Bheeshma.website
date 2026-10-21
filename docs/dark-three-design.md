# Dark 3 — The Field After Dusk

Base: `origin/main` at `42582f059498ed50df6670b16b73a85ac6ef6edb`.

## Direction study

| Direction | Palette and character | Assessment |
| --- | --- | --- |
| Ember archive | Obsidian, oxblood, warm bone and restrained brass; poster sized chapter numerals and cinematic image panels | Strongest match for the existing red, black, monochrome and blue art. High contrast reading surfaces can stay quiet. |
| Signal green | Coal and acid green; utilitarian typography and exposed grids | Distinctive, but clashes with most artwork and reads too much like a game interface. |
| Ultraviolet night | Near black, violet and icy cyan; luminous glass and soft depth | Suits the blue Krishna image, but too close to the product feel of Dark 2 and weakens the red posters. |

Chosen: **Ember archive**. The impact comes from editorial scale, asymmetry and the supplied artwork, not from distorting verses or making long reading areas luminous. The interface uses bone text on nearly black surfaces, red for action and wayfinding, and brass for metadata. Motion is limited to image reveal, card lift and short directional feedback; reduced motion removes it.

## Artwork inventory

The six JPEGs in `public/other pics/dark theme` are the supplied originals. Their embedded typography remains part of the pictures; UI copy does not present it as scripture. The generated `krishna-blue-gold-extended.webp` is excluded from the UI. The original blue image is 736 × 736 and its source itself excludes Krishna's face; no crop can restore that missing detail. It should be shown as a smaller complete composition, never a portrait claim.

| File prefix | Size | Use |
| --- | --- | --- |
| `598256351` | 735 × 978 | Landing hero, full poster |
| `797643567` | 735 × 490 | Home artwork index and About |
| `840377761` | 736 × 736 | Home artwork index and Audio |
| `840697317` | 736 × 1313 | Home artwork index and Guidance |
| `841532556` | 736 × 1308 | Home artwork index and Chapters |
| `845482537` | 736 × 920 | Home artwork index and Bookmarks / Assistant |

No license metadata or attribution file was found in the repository. These were already present in the project; provenance needs confirmation before wider reuse outside it.

## Isolation

Dark 3 is selected with `?dark=3` and `data-dark-version="3"`. New styling lives in its own scoped stylesheet. Dark 1 and Dark 2 remain switchable. Light and Zen continue through their existing rendering paths and do not receive the artwork banner or Dark 3 CSS.

## Validation

- Desktop (1440 px), tablet (768 px), and mobile (390 px) rendered without horizontal overflow or JavaScript page errors. All six original images loaded when brought into view; the remaining mobile images use native lazy loading.
- Home lists all 18 chapters. Every non-Zen content view (Chapters, Guidance, Audio, Assistant, About, Bookmarks) displays its assigned original artwork. The generated extension was removed from the project; Dark 2 now displays the uncropped original square image.
- Deep link `?dark=3&view=chapters&chapter=2&verse=47` opened the requested passage. Dark 1, Dark 2 and Dark 3 switching retained that location.
- On mobile, bookmarking 2.47 produced one saved entry, verse audio opened the floating player, and searching Guidance for `fear` filtered to one tile. The mobile menu exposed all three dark choices.
- Fresh Light and Zen sessions rendered their original headers and had no Dark 3 artwork banner or JavaScript errors. No content data, Light stylesheet or Zen component changed.
- `npm run build` succeeded; `npm run lint` reported zero errors and the six pre-existing React Refresh warnings in UI primitives.
