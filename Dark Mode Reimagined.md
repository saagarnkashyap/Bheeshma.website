# BHEESHMA — Dark Mode Reimagined

## Mission
Reimagine ONLY the Dark Mode of Bheeshma.website as a distinctive, polished, emotionally resonant, Gen Z / Gen Alpha-facing interpretation of the Bhagavad Gita. Execute the full implementation, not just a proposal. You have broad creative and technical autonomy within the strict boundaries below.

Repository: https://github.com/saagarnkashyap/Bheeshma.website/

## 0. Git safety — mandatory before editing
1. Inspect `git status`, branches, remotes, and any uncommitted/untracked work. Never discard or overwrite user work.
2. Fetch the latest `origin/main` and create a **new branch** named `design/dark-mode-reimagined` directly from `origin/main`. Do not base it on the currently checked-out branch or a stale local main.
3. If that branch name already exists, **do not reset, delete, force-update, or reuse it blindly**. Choose a unique suffixed branch (e.g. `design/dark-mode-reimagined-v2`) and report the name.
4. If a dirty worktree or branch conflict makes switching unsafe, stop and ask before touching anything.
5. Keep ALL implementation changes on the new branch. Do not alter `main`, other branches, or their histories. Do not push or merge without authorization.
6. Commit frequently at meaningful, independently understandable milestones (audit/setup, tokens, core UI, assets, motion, responsive, validation, polish). Commit messages should be descriptive. Avoid committing generated build output unless repository conventions require it.

## 1. Understand the actual product
Read the root README and thoroughly inspect the current repository, including routes, page layouts, theme management, components, styles, content database, chapter/verse display, Sanskrit/transliteration/translation rendering, audio, navigation, search, emotion guidance, bookmarks, progress persistence, sharing, responsive behavior, and accessibility. The README describes a React 19 + Vite + Tailwind application with Framer Motion/AOS, 18 chapters and 700 verses, audio and emotion-based exploration; verify what is ACTUALLY implemented in the checked-out code, which may differ from the public README.

Inspect all three experiences: Light, Dark, and Zen. Identify shared components and theme-specific styling. Determine exactly how to change Dark without affecting the other two. Treat the current Light and Zen experiences as approved baselines.

## 2. Non-negotiable product constraints
- **ONLY Dark Mode is being redesigned.** Light Mode and Zen Mode must look and behave the same as before, including their typography, layout, animation, colors, imagery, navigation, and responsiveness. Do not “improve” them incidentally.
- Dark and Light must expose the **same underlying data, features, interactions, and navigation destinations**. They can look and feel different but must remain functionally equivalent.
- Keep the overall information architecture and broad structure of Dark largely aligned with Light. This is NOT a separate, drastically different app like Zen. Recompose visual presentation, hierarchy, surfaces, components, decoration, transitions, imagery, and microinteractions as appropriate without hiding or removing information.
- Never alter the Bhagavad Gita's canonical chapter names/numbers, verse identifiers, Sanskrit verses, transliterations, meanings/translations, interpretations, or their source data. Do not paraphrase, fabricate, modernize, or rewrite sacred text. Preserve accuracy and diacritics.
- You MAY change noncanonical UI copy, section labels, marketing headings, microcopy, onboarding text, and decorative slogans, as long as they are respectful, accurate, and do not misrepresent scripture or alter user data.
- Preserve accessibility, keyboard support, screen-reader semantics, contrast, reduced-motion preferences, performance, responsive behavior, audio functionality, persistence, deep links, and theme switching.
- Dark Mode must not become a gimmick, gaming UI, or disrespectful meme aesthetic. Aim for contemporary, art-directed, immersive, expressive, and spiritually grounded.

## 3. Target audience and creative freedom
Light Mode already appeals to older/millennial audiences and Zen is beloved. Dark Mode should speak to younger Gen Z / Gen Alpha audiences through a fundamentally different visual personality while remaining inviting to everyone.

Explore boldly: palettes (not just generic black/purple neon), expressive but readable typography, depth, editorial layout, intentional contrast, illustrations, modern graphic motifs, kinetic typography, layered gradients, subtle textures, motion choreography, hover/tap feedback, scroll reveals, immersive chapter and verse presentation, cards, controls, navigation, and audio-player treatment. Prefer a cohesive visual language over unrelated flashy effects. Ensure Sanskrit and long-form reading remain calm and readable.

**Content and cultural context should determine the design**, not vice versa. The interface is a respectful bridge between ancient philosophy and contemporary visual culture.

## 4. Local imagery — inspect first
The user has existing imagery in this Windows directory:
`D:\post engg\Bheeshma.website\public\other pics\dark theme\`

Inspect these 4–5 (approximate) images in the actual repository/workspace, including filenames, dimensions, formats, quality, licensing clues, and subject matter. They are described as modern, Pinterest-like, graphic/animated-style interpretations of mythological figures with a Gen Z sensibility. Use them thoughtfully as inspiration and/or integrated artwork if they suit the design; don't blindly use every image. Optimize loading, crop, responsive positioning, and legibility. Do not alter sacred iconography in misleading or irreverent ways.

The path is a local Windows path, not necessarily present in a remote Codex environment. Search the checked-out `public` tree first, including case/spacing variations. **If the files are not accessible, ask the user to provide them or grant workspace access; do not invent or pretend to have inspected them.** Continue other safe analysis while awaiting the assets, but do not finalize an imagery-dependent direction without seeing them.

## 5. Exploration and agents
Use all **relevant available** capabilities: repository search, specialized frontend/design skills, subagents, parallel tasks, browser automation, screenshots, visual diffing, image inspection, and test/build tooling. Discover what is genuinely available; do not assume an unavailable skill or agent exists. Ask only if missing access or assets materially block quality or safety.

If subagents are available, delegate bounded independent work (e.g. theme-isolation audit, content/cultural review, creative directions, UX/accessibility audit, responsive test plan). Coordinate their findings into ONE consistent final design. Avoid parallel agents making conflicting edits to shared files.

Explore at least three substantially different Dark Mode creative directions before implementation. Assess each for uniqueness, emotional resonance, readability, contrast, image fit, performance, accessibility, and preservation of feature parity. Choose and implement the strongest. You need not pause for approval unless truly blocked.

## 6. Implementation architecture
- Prefer theme-scoped tokens, variables, component variants, and selectors rather than broad global CSS changes that could leak into Light/Zen.
- If shared components require modification, ensure behavior and appearance in Light/Zen remain unchanged. Avoid regressions from global typography, layout, or animation rules.
- You may refactor and add dependencies when justified, but avoid gratuitous rewrites or heavyweight animation stacks.
- Retain all data models, saved state, search logic, audio sources, chapter/verse navigation, bookmark behavior, and existing user-facing functionality.
- Handle small screens, touch input, slow devices, and prefers-reduced-motion. Keep animation GPU-friendly and unobtrusive during reading.
- Design a consistent visual system for landing/hero, navigation, chapter discovery, verse reading, emotion guidance, search, audio controls, saved content, dialogs, empty/error/loading states, and footer wherever present in the actual app.
- Preserve theme preference persistence and switching between Dark, Light, and Zen.

## 7. Validate with real rendered visuals
Do not stop at a successful compile. Run the site and inspect actual pages in a browser with screenshots at mobile, tablet, and desktop widths. Evaluate Dark Mode across the full journey: landing → chapters → verses → audio → emotion guidance → bookmarks/progress → theme switching. Test keyboard focus and reduced motion.

Compare **before/after Light and Zen screenshots** (or otherwise systematically verify visual parity), and confirm their features are unaffected. Use automated visual regression tests if feasible. Check Dark/Light feature parity explicitly. Run relevant lint, typecheck, tests, and production build; fix introduced issues. Distinguish pre-existing failures from new ones.

Iterate on contrast, typography, artwork integration, motion timing, spacing, responsiveness, and visual cohesion. Avoid calling it complete after one pass.

## 8. Autonomy, milestones, and reporting
Take the time needed; optimize for craftsmanship, not speed. Work independently and commit often. Do not ask the user to pick routine colors, fonts, layouts, or animations. Ask if required permissions/assets are unavailable, a destructive Git operation would be necessary, or a genuine product decision cannot be inferred.

At the end, report:
- New branch name and base commit from `origin/main`
- Design concept and why it fits Bheeshma's younger audience
- How local artwork was used (or why it was not)
- Pages/components changed and confirmation that Light/Zen are unchanged
- Feature-parity checks and actual visual testing performed
- Test/build results, any remaining issues, and meaningful commit log

**Success criterion:** Dark Mode feels like a purpose-built, contemporary, culturally respectful new visual identity — not merely a recolor — while showing the exact same Bhagavad Gita content and features as Light Mode, and leaving Light and Zen untouched.

Start with Git safety, repository audit, and asset inspection. Then execute the redesign end-to-end.
