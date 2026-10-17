# Gita Supersite Data Migration — Source of Truth

## Objective

Replace the app's dependency on the current Bhagavad Gita content dataset with a normalized dataset generated from Saagar's referenced Gita Supersite scraper/repository, while preserving the existing dataset until the new implementation is proven stable.

This work is being done on the dedicated branch:

`feature/gitasupersite-data`

## Saagar's requirements

For every verse, provide:

- Devanagari Sanskrit text (`language=dv`)
- Roman transliteration (`language=ro`)
- Kannada verse (`language=kn`)
- Telugu verse (`language=te`)
- Purohit Swami English translation (`etpurohit=1`)
- Sanskrit commentary by Sri Shankaracharya (`scsh=1`)
- Sanskrit commentary by Sri Madhvacharya (`scmad=1`)
- Sanskrit commentary by Sri Ramanujacharya (`scram=1`)

The translation/commentary selection behavior corresponds to the Gita Supersite parameters:

- `choose=1` — show selected translations/commentaries
- `field_chapter_value=N` — chapter
- `field_nsutra_value=N` — verse/shloka

The three Sanskrit commentaries are optional for users. The frontend must expose the Sanskrit-commentary option only when all three requested commentaries are available for the relevant content. Missing commentary data must remain explicit rather than being silently substituted.

## Source and acquisition strategy

Saagar initially suggested scraping `old.gitasupersite.in` directly, then provided this repository as the preferred alternative:

`https://github.com/shyamperi/gitasupersite.iitk.ac.in`

That repository contains a scraper for the IIT Kanpur Gita Supersite; it is not assumed to be a ready-made drop-in database. Use/adapt its generated output rather than writing an unrelated scraper or scraping the website at frontend runtime.

The intended flow is:

`Gita Supersite scraper/repository -> generated source data -> normalized Bheeshma data -> React frontend`

The upstream scraper currently points at `www.gitasupersite.iitk.ac.in`, which redirects to a redesigned site whose HTML does not match its selectors. The legacy endpoint Saagar originally referenced, `https://old.gitasupersite.in`, still serves the expected HTML. The Bheeshma-specific importer should therefore use the legacy endpoint while retaining the GitHub repository as the documented scraper reference.

Before publishing generated content, verify source attribution, licensing/redistribution constraints, completeness, and the actual availability of the requested fields.

## Repository and data safety rules

- Do not delete or overwrite the existing JSON dataset during the migration.
- The current dataset remains available as a fallback/reference until the new path is fully validated.
- The current metadata and chapter-catalog JSON files should also be preserved unless a later change is explicitly justified.
- No backend is required for this migration. Do not introduce runtime scraping or a server solely because the content schema changes.
- A build-time/local data-generation step is preferred. The frontend should consume checked-in generated data or a clearly documented generated-data artifact.
- Keep progress, assumptions, source mappings, validation results, and unresolved issues documented in this file or linked project files.

## Data-model direction

Design a normalized verse model that can represent at least:

- chapter number and verse number
- chapter metadata needed by the existing app
- Devanagari, Roman, Kannada, and Telugu verse text
- Purohit English translation
- Shankaracharya, Madhvacharya, and Ramanujacharya Sanskrit commentary
- source/provenance and availability metadata where useful

Missing values should be represented consistently, preferably as `null` or an equivalent explicit value. The frontend availability check must be based on the normalized model, not on brittle string checks or assumptions about source keys.

The current JSON may include non-verse application data such as emotion/problem mappings. Preserve or migrate those consumers deliberately so existing features continue working.

## Frontend scope

The existing visual design should be preserved wherever possible. Required UI changes are limited to supporting Saagar's new content capabilities:

- Allow users to view Devanagari, Roman, Kannada, and Telugu verse forms.
- Display Purohit Swami's English translation.
- Provide an optional Sanskrit-commentary control/section.
- Show that commentary control only when all three requested Sanskrit commentaries are available.
- Keep existing reading, bookmark, audio, navigation, emotion, and sharing behavior working.

Any UI changes belong only in the existing light and dark modes. Zen mode must remain as clean as it currently is and must not receive the new controls or visual clutter unless explicitly requested later.

Do not perform a broad visual redesign as part of this migration.

## Implementation milestones and commit policy

Work incrementally. It is acceptable and encouraged to commit small, coherent milestones rather than combining the entire effort into one commit. Keep commits focused and descriptive. Suggested milestones:

1. Add and commit this source-of-truth TODO file before implementation.
2. Inspect the scraper repository/output and record source-key mappings and completeness findings.
3. Add a local acquisition or transformation script/configuration without changing the active app data path.
4. Generate and validate the new normalized dataset while preserving the old JSON.
5. Add data-access/adaptation code and migrate consumers safely.
6. Add light/dark-mode verse language, translation, and commentary behavior while leaving Zen mode unchanged.
7. Run lint, production build, targeted data checks, and manual/runtime checks.
8. Update documentation and record any unresolved source/licensing/data gaps.
9. Only after explicit approval, consider removing obsolete data or migration code.

At each milestone, record what changed, how it was verified, and any follow-up work in this file or a linked progress document.

## Acceptance criteria

- Existing `bhagavad_gita_complete.json` remains intact during implementation.
- The new source data covers all 18 chapters and the source's explicit chapter-count contract, or any gaps are identified and documented. The current chapter counts sum to 701 even though the common summary is 700 verses; preserve and report that discrepancy rather than silently dropping a verse.
- The requested four verse scripts are available where expected.
- Purohit English translation is mapped correctly.
- Each requested Sanskrit commentary is mapped independently and accurately.
- The Sanskrit-commentary option appears only when all three commentaries are available.
- Existing app features continue to function with the new data source.
- New controls appear only in light/dark modes; Zen mode remains visually and functionally clean.
- `pnpm lint` and `pnpm build` pass, along with targeted data validation.
- Source attribution and redistribution constraints are documented before release.

## Current status

- Branch created: `feature/gitasupersite-data`
- Source-of-truth TODO file: committed as the first implementation commit.
- Existing JSON: preserved.
- Backend: not planned for this migration.
- Acquisition/normalization script added: `scripts/gitasupersite_data.py`.
- Source dependencies documented: `scripts/requirements.txt`.
- Raw acquisition output is ignored under `data/gitasupersite-raw/`.
- Full acquisition completed into `src/assets/bhagavad_gita_supersite.json`.
- Validation passed for 18 chapters and 701 verses: all four scripts and all Purohit translations are present; 413 verses have all three Sanskrit commentaries available.
- The old JSON remains intact and is no longer the active verse-data import path.
- The changed feature files lint cleanly; the repository lint command now exits successfully with existing Fast Refresh warnings only.
- Production build and runtime smoke checks remain to be completed.
