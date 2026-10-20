# Bheeshma — Bhagavad Gita study edition

<p align="center">
  <img src="Bheeshma%20logo.png" alt="Bheeshma logo" width="140" height="140">
</p>

Bheeshma is a React web app for reading and listening to the Bhagavad Gita. It has 18 chapters, chapter context, verse text in four scripts, an English translation, subject-based guidance, bookmarks, and Sanskrit recitation. The bundled reading dataset contains **701 verse records**.

## What you can do

| View | Experience |
| --- | --- |
| **Home** | Start reading from the chapter index or resume the last verse opened in the reader. The light and dark themes have different home layouts. |
| **Chapters** | Read one verse at a time with chapter summaries and themes, chapter and verse navigation, a verse jump field, and left/right keyboard navigation. Larger screens use a page flip chapter reader; mobile uses a standard reader. |
| **Guidance** | Browse 20 subjects, including fear, anger, loneliness, and seeking peace. Search filters subject names and descriptions; selecting a subject shows its mapped verses. |
| **Audio** | Choose a chapter and verse, read its text and translation, and start its Sanskrit recitation in the floating player. The player stays available outside Zen mode, repeats the selected verse, and provides previous/next, seeking, and volume controls. |
| **Assistant** | A coming-soon page with links to Guidance and Chapters. There is no working chat assistant yet. |
| **About** | Read the project's purpose and source acknowledgments. |
| **Bookmarks** | Revisit and remove verses saved in this browser. |
| **Zen** | Follow the text in a focused, full-screen continuous recitation view. It shows the Sanskrit verse and transliteration, advances to the next verse when audio ends, and provides playback, seeking, and verse controls. |

### Reading and appearance modes

- **Light and dark themes** change the site's appearance. The selected theme is saved in the browser and applies to the main views; each theme has its own Home and Assistant layout.
- **Chapter reader** is the study view. It presents chapter context and a verse card with Devanagari, Roman transliteration, Kannada, and Telugu script options when available, plus the Purohit Swami English translation. A Sanskrit commentary section appears only when the Shankaracharya, Madhvacharya, and Ramanujacharya commentaries are all available for that verse.
- **Zen mode** is a separate, minimal listening view. It plays verse recitations in sequence and has its own player. Its presentation is independent of the light/dark theme and it does not show the English translation or chapter study panels.

The chapter verse card can play audio, bookmark a verse, and share its text and direct link. Sharing uses the browser's share menu when available and otherwise copies the text and link. Chapter and Zen locations can be linked with URL parameters, for example `/?view=chapters&chapter=2&verse=47` and `/?view=zen&chapter=2&verse=47`.

Bookmarks, reading position, and theme preference use browser `localStorage`. They stay on the same browser and device; the app has no account sync. Audio is streamed from Gita Supersite, so listening requires access to that service.

Audio download and offline listening are not features of the current interface.

## Where the data comes from

The app loads checked-in JSON at runtime. It does not scrape Gita Supersite in the browser and does not need an application backend.

| File or service | Role |
| --- | --- |
| [`src/assets/bhagavad_gita_supersite.json`](src/assets/bhagavad_gita_supersite.json) | Main reading dataset used by Chapters, Guidance, Audio, Bookmarks, and Zen. It contains 18 chapters, 701 verse records, and 20 predefined subject mappings. Verse records include source URLs. |
| [IIT Kanpur Gita Supersite](https://old.gitasupersite.in/srimad) | Source fetched by `scripts/gitasupersite_data.py` for verse text in Devanagari, Roman, Kannada, and Telugu; the Purohit Swami English translation; and available Sanskrit commentaries by Shankaracharya, Madhvacharya, and Ramanujacharya. |
| [`src/assets/bhagavad_gita_complete.json`](src/assets/bhagavad_gita_complete.json) | Older local dataset. The importer carries over chapter details, subject-to-verse mappings, and fields such as keywords, interpretations, and life applications. It is an input to normalization, **not** a runtime fallback. The repository does not document the original provenance of these added fields. |
| [`src/assets/bhagavad_gita_meta_data.json`](src/assets/bhagavad_gita_meta_data.json) | Separate local chapter and topic metadata loaded by the data hook. |
| [`src/assets/bhagavad_gita_chapter_catalog.json`](src/assets/bhagavad_gita_chapter_catalog.json) | Lightweight chapter names for the home page and navigation. |
| [Gita Supersite audio](https://www.gitasupersite.in/books/audio/bhagavad_gita/) | Remote MP3 files used by the floating player and Zen mode. The app constructs URLs like `https://www.gitasupersite.in/books/audio/bhagavad_gita/CHAP2/2-47.MP3`. Audio files are not bundled with the app. |

Guidance is based on the `problem_solutions_map` in the main JSON file. The search box filters the 20 subject cards by their names and descriptions; it does not search all verse text or calculate semantic relevance scores. Each subject's predefined references determine the verses shown.

The available subjects are anger, depression, confusion, dealing with envy, death of a loved one, feeling demotivated, feeling discriminated against, fear, feeling sinful, forgetfulness, greed, laziness, loneliness, losing hope, lust, practicing forgiveness, pride, seeking peace, temptation, and an uncontrolled mind.

The main JSON also retains `life_application` and `interpretation` fields from the older dataset. The current verse card does not display a life application panel. Similarly, commentaries can be present in the data without appearing in the reader when the full set of three is unavailable.

### Refreshing the verse dataset

The importer fetches source pages into ignored, resumable files in `data/gitasupersite-raw/`, combines them with the older local dataset, and writes the app-facing JSON. Refreshing data is a development task; it is not required to run the checked-in app.

```bash
python -m pip install -r scripts/requirements.txt
pnpm data:fetch
pnpm data:normalize
pnpm data:validate
```

`data:fetch` contacts the legacy Gita Supersite endpoint. `data:normalize` writes `src/assets/bhagavad_gita_supersite.json`. `data:validate` checks the generated dataset for all 18 chapters and required verse fields. The importer and its exact source-field mappings are in [`scripts/gitasupersite_data.py`](scripts/gitasupersite_data.py).

## Run locally

Install Node.js and use pnpm (the repository pins pnpm 10) or npm. Python is needed only to refresh the dataset.

```bash
pnpm install
pnpm dev
```

With npm, use `npm install` and `npm run dev`. Other available commands are `pnpm build` for a production build, `pnpm preview` to serve that build locally, and `pnpm lint` for ESLint.

## Technology

React 19 and Vite power the frontend. The interface uses Tailwind CSS, custom CSS, Framer Motion, Lucide icons, and `react-pageflip` for the larger-screen chapter reader. Playback uses the browser's HTML audio element.

## License and contributions

This repository currently has no license file. If you want to contribute, open an issue or pull request in the project repository.

## Contact

- Email: saagarcourses@gmail.com
- LinkedIn: [Saagar N. Kashyap](https://www.linkedin.com/in/saagar-n-kashyap/)
