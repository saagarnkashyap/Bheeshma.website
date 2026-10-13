# Responsive audit

Audit date: 2026-10-13
Branch: `feat/responsive-audit-fix`

## Scope

The audit covers the six user-facing views currently rendered by the single-page app:

- Home
- Chapters / verse reader
- Guidance / emotion search
- Audio reference
- Assistant
- About

Device bands used for the audit:

- Small mobile: 320–374px
- Standard mobile: 375–767px
- Tablet: 768–1023px
- Desktop: 1024px and wider

## Baseline checks

- `npm run build`: passes.
- `npm run lint`: fails on pre-existing issues in `AudioPlayer-broken.jsx`, unused imports in legacy header/player/background components, and `__dirname` in `vite.config.js`. These are recorded separately from the responsive changes.
- The audit is based on the current layout rules and component structure. Runtime visual checks are still required at the four viewport bands after implementation.

## Findings by page and device

| Page | Small mobile | Standard mobile | Tablet | Desktop |
| --- | --- | --- | --- | --- |
| Home | Hero and chapter index fit, but fixed assistant control can collide with the audio player and dense card/header spacing is fragile below 360px. | Usable; floating controls need safe-area spacing. | Usable; hero breakpoint is tied to 900px while the main navigation changes at 1024px, creating a narrow transition band. | Usable; content width is constrained by the fixed navigation rail. |
| Chapters | Verse card header/actions can become cramped; long Sanskrit/transliteration strings need an explicit wrap rule. | Same risk on long chapter names and verse metadata; fixed controls can cover reading content. | At 768–900px the stacked layout works; at 901–1023px the header/audio-related shared layouts can become cramped before their breakpoints switch. | At 1024px the sidebar consumes 320px and leaves a narrow reading column; header needs flexible children to avoid squeezing navigation buttons. |
| Guidance | Emotion cards fit in one column, but selected-result headers and verse card action rows need wrapping safeguards. | Usable after action-row and long-text wrapping fixes. | Two-column cards are appropriate; selected-result header should remain flexible. | Three-column cards are appropriate. |
| Audio | The studio stacks at 900px and below, but the floating player can consume most of the viewport width and compete with the assistant button. | Same floating-player collision risk; safe-area padding is needed. | The 901–1023px three-column studio is too tight for a 13rem selection column; the selection panel should span a full row before the single-column breakpoint. | Three-column studio is appropriate once panel children are allowed to shrink. |
| Assistant | Text wraps acceptably, but the fixed assistant launcher overlaps the floating player when audio is active. | Same overlap risk. | Usable. | Usable. |
| About | Long feature/credit rows need min-width guards so icons and text do not force horizontal overflow. | Usable after text wrapping guards. | Feature grid correctly collapses below 900px. | Two-column feature grid is appropriate. |

## Shared issues to fix

1. Add global horizontal-overflow protection and `min-width: 0` behavior for the main content column.
2. Make the mobile navigation drawer use the dynamic viewport height and a width that fits screens narrower than 320px.
3. Make the floating audio player full-width within mobile gutters and account for safe-area insets.
4. Move the assistant launcher above the audio player while the player is visible.
5. Add explicit wrapping/min-width rules for verse headers, Sanskrit/transliteration, chapter headers, and about-page text rows.
6. Add an intermediate audio layout for the narrow desktop/tablet transition band.
7. Re-check `prefers-reduced-motion` behavior and the existing build/lint baseline after changes.

## Acceptance criteria

- No horizontal page overflow at 320, 360, 390, 768, 834, 1024, 1280, and 1440px widths.
- Navigation remains reachable and readable at every width.
- Floating audio controls stay within viewport gutters and do not cover the assistant launcher.
- Long Sanskrit, transliteration, chapter titles, emotion descriptions, and source credits wrap within their containers.
- All six views retain usable spacing and touch targets on mobile.

## Implementation record

- `7227a2c` — hardened the shared app shell, mobile drawer, fixed-player sizing, safe-area spacing, and launcher collision handling.
- `285896f` — tuned page padding and the 901–1100px transition layouts for the home, chapter, audio, guidance, and about views.
- `7f20c5f` — added touch-target sizing, flexible verse headers, long-text wrapping, and compact mobile card spacing.
- Tracked `dist/` output was refreshed after each implementation stage.
- Final `npm run build`: passes.
- Final `npm run lint`: still reports the pre-existing errors listed under Baseline checks; no new responsive lint errors were introduced.
