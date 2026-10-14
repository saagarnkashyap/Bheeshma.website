# TODO: Complete Dark Theme Alternate Experience

## Concept

Create a complete alternate visual system for the Bhagavad Gita website:

1. Keep the existing light theme as the calm, parchment-like study edition.
2. Add a site-wide toggle that switches between the light theme and a distinct dark theme.
3. Make the dark theme feel fierce, nocturnal, dramatic, and transformative rather than simply darker.
4. Preserve the meaning and usability of the interface while changing its complete visual language.

The light theme should feel like quiet, sunlit contemplation and steady study. The dark theme should feel like dharma forged through struggle, power, and transformation.

## Theme direction

The toggle must change the whole look and feel across every page and every responsive layout, including:

- Backgrounds, surfaces, gradients, textures, and overall atmosphere.
- Text and display fonts, including headings, navigation, labels, Sanskrit, and body copy where appropriate.
- Text, border, icon, button, and focus-state contrast.
- Accent colors, highlights, shadows, glows, and image treatments.
- Boxes, cards, controls, dividers, rules, progress indicators, and audio-player styling.
- Border radii, density, spacing character, and the balance between soft and sharp shapes.
- Illustrations, decorative imagery, overlays, and blend/filter treatments.
- Page transitions, hover states, loading states, ambient motion, and other animation behavior.

The dark theme should draw from the provided references: near-black and charcoal foundations, strong crimson/red energy, restrained gold, occasional cool blue/green tones, high-contrast typography, grain, and cinematic atmospheric movement.

## Implementation direction

Use one persistent theme toggle in the shared site header so it remains available on desktop and mobile.

- Use semantic theme state rather than duplicating every page.
- Store the selected theme locally so it survives navigation and reloads.
- Default to the existing light theme unless a saved preference is present.
- Add accessible labels, focus states, keyboard support, and `aria-pressed` state to the toggle.
- Keep the toggle compact enough for the mobile header without colliding with the menu, logo, or navigation.
- Centralize theme tokens with CSS variables or equivalent semantic styles.
- Audit all existing hard-coded colors, fonts, shadows, borders, gradients, and animation values so no page is left with accidental light-theme styling.

## Content and component coverage

Apply the alternate treatment consistently to:

- Home and landing sections.
- Chapter index and chapter reading views.
- Sanskrit, transliteration, meanings, life applications, and verse metadata.
- Emotion-based guidance and search results.
- Audio pages, audio cards, floating audio player, and playback states.
- Bookmarks, assistant, about page, loading states, empty states, and error states.
- Navigation, mobile menu, assistant launcher, buttons, inputs, tags, cards, dialogs, and progress controls.

## Motion and accessibility

- Give each theme its own motion character instead of reusing identical animation values.
- Keep light-theme motion subtle and contemplative.
- Let dark-theme motion feel slower, more cinematic, and atmospheric, with restrained ember/glow or depth effects.
- Avoid motion that competes with reading or makes controls feel unstable.
- Respect `prefers-reduced-motion` in both themes.
- Maintain readable contrast and visible focus indicators in both themes.
- Test theme transitions on touch devices, keyboard navigation, and narrow screens.

## Completion criteria

The feature is complete when the toggle is visible and usable on every page and at desktop/mobile breakpoints, the preference persists across reloads, and the two themes clearly differ in typography, color, contrast, shapes, components, imagery, and animation. No route, control, loading state, or responsive layout should look unfinished or accidentally inherit the wrong theme.

