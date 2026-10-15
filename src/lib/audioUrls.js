const GITA_SUPERSITE_AUDIO_BASE_URL =
  'https://www.gitasupersite.in/books/audio/bhagavad_gita';

const VERSE_COUNTS = [
  0, 47, 72, 43, 42, 29, 47, 30, 28, 34,
  42, 55, 20, 35, 27, 20, 24, 28, 78,
];

/**
 * Gita Supersite publishes one Sanskrit MP3 per verse using the project's
 * chapter/verse numbering, for example CHAP1/1-1.MP3 and CHAP18/18-78.MP3.
 */
export const getGitaSupersiteAudioUrl = (chapter, verse) => {
  const chapterNumber = Number(chapter);
  const verseNumber = Number(verse);

  if (
    !Number.isInteger(chapterNumber) ||
    !Number.isInteger(verseNumber) ||
    chapterNumber < 1 ||
    chapterNumber > 18 ||
    verseNumber < 1 ||
    verseNumber > VERSE_COUNTS[chapterNumber]
  ) {
    return null;
  }

  return `${GITA_SUPERSITE_AUDIO_BASE_URL}/CHAP${chapterNumber}/${chapterNumber}-${verseNumber}.MP3`;
};

export { GITA_SUPERSITE_AUDIO_BASE_URL };
