export const READING_PROGRESS_STORAGE_KEY = 'bheeshma_reading_progress';

const isValidChapter = (chapter) => Number.isInteger(chapter) && chapter >= 1 && chapter <= 18;
const isValidVerse = (verse) => Number.isInteger(verse) && verse >= 1 && verse <= 700;

export const getReadingProgress = () => {
  try {
    const storedProgress = JSON.parse(window.localStorage.getItem(READING_PROGRESS_STORAGE_KEY) || 'null');

    if (!storedProgress || !isValidChapter(storedProgress.chapter) || !isValidVerse(storedProgress.verse)) {
      return null;
    }

    return {
      chapter: storedProgress.chapter,
      verse: storedProgress.verse,
    };
  } catch {
    return null;
  }
};

export const saveReadingProgress = (chapter, verse) => {
  if (!isValidChapter(chapter) || !isValidVerse(verse)) return;

  try {
    window.localStorage.setItem(
      READING_PROGRESS_STORAGE_KEY,
      JSON.stringify({ chapter, verse }),
    );
  } catch {
    // Ignore storage failures so reading remains available in restricted browsers.
  }
};
