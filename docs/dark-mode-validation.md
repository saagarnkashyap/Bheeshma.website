# Dark edition validation

The design branch was created from `715eedb153d0d1632c5db162592c89812f23f8d8`. The existing checked-in Gita data, Light styles, and Zen styles were not edited.

## Rendered review

Chrome was driven with Playwright against the local Vite server. Before edits and after the final design pass, full-page screenshots covered Home, chapter 2 verse 47, and Zen at 1440 × 900, 768 × 1024, and 390 × 844 in both Light and Dark. Additional Dark screenshots covered Guidance, a selected subject, Audio, Bookmarks, Assistant, and About, including mobile views for Guidance, Audio, Bookmarks, and Assistant.

All 12 Light/Zen before-and-after screenshot pairs had identical dimensions. Ten pairs matched pixel-for-pixel; the two remaining Light chapter captures had mean RGB differences below 0.001 on a 0–255 scale, consistent with capture timing. The three Zen pairs in each theme were pixel-identical.

## Behavior and accessibility

- Dark and Light expose the same eight navigation labels and URL destinations. Chapter 2.47 rendered identical Sanskrit, transliteration, and English text in both themes.
- The browser journey exercised script switching, bookmark save and recall, sharing feedback, verse playback controls, keyboard verse navigation, Guidance search and subject results, Audio chapter/verse selection, Zen entry, the mobile menu, and theme persistence.
- Dark views had no horizontal overflow at 390 px. A keyboard tab showed a visible solid focus outline. With reduced motion requested, the dark view entrance animation was disabled.
- axe-core WCAG 2.1 A/AA checks returned no violations for Dark Home, Chapters, Guidance, Audio, Bookmarks, Assistant, and About at desktop width, and for Home, Chapters, Guidance, and Audio at mobile width.

## Tooling and external service

`npm run build` passes. Vite continues to warn about the large existing bundled Gita dataset. `npm run lint` reports zero errors and six existing Fast Refresh warnings in untouched `src/components/ui` files. The repository has no separate typecheck or test script.

The floating player opened with the expected chapter 2.47 MP3 URL and exposed its controls. In the automated Chrome environment, the external Gita Supersite stream returned a media format error; a direct HTTPS probe also failed during TLS shutdown. Playback completion could not be verified. The audio URL builder and player logic were not changed in this branch.
