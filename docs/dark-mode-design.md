# Dark Mode Reimagined: design record

This branch starts at `origin/main` commit `715eedb153d0d1632c5db162592c89812f23f8d8`. Only the dark study edition is in scope. Light and Zen are the approved baselines. All canonical content and application data remain in their existing sources.

## Directions explored

| Direction | Character and image fit | Strength | Concern |
| --- | --- | --- | --- |
| Crimson broadside | Red, black, compressed poster type, using the red Krishna/Arjuna posters | Immediate energy | Too close to the current dark edition; embedded slogans are unsuitable beside scripture and the red surfaces strain long reading. |
| Electric cosmos | Indigo, cyan, animated geometry, using the blue Krishna collage | Strong visual link to the supplied digital art | Continuous glow and motion would compete with Sanskrit, add visual noise, and cost more on small devices. |
| **Monsoon atlas** | Midnight blue and deep teal, parchment text, saffron and cool mint accents; the blue Krishna collage stays inside a quiet framed image | Contemporary editorial hierarchy with a calm reading surface, strong contrast, and a distinct identity across every view | Needs careful containment of artwork and restrained accents to avoid a game interface. |

Monsoon atlas is the chosen direction. Its visual language uses generous type, chapter folios, fine rules, quiet grain, and a small number of luminous accents. It gives the hero and discovery views expressive composition while keeping verse text on stable, opaque surfaces. Motion is limited to entrances and direct interaction feedback and yields to reduced-motion preference.

## Artwork audit

Six user-provided JPEGs exist under `public/other pics/dark theme/`. They are 735–736 px wide and about 60–173 KB each. They contain no author or license attribution in their metadata. The blue Krishna collage (`840377761_1084744031133592_1741248250194744511_n.jpg`, 736 × 736) is suitable as a contained image. The red Krishna posters (`598256351...`, `841532556...`) and monochrome warrior (`845482537...`) contain baked-in, unverified wording; the thorn-crowned figure (`797643567...`) has weak Gita relevance; the Hanuman portrait (`840697317...`) belongs to a different narrative context. The existing shared chariot asset appears watermarked, so the new dark hero does not reuse it.

## Isolation and parity

The app already selects dark-specific Home, Header, and Assistant components. Shared chapter, guidance, audio, about, bookmark, and player components keep their data and behavior. New presentation rules belong in a stylesheet scoped to the dark edition and outside `.zen-edition`; Light and Zen styles and scripts stay untouched. Dark chapter cards will show full canonical catalog names.
