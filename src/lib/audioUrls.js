const GEETANJALI_AUDIO_BASE_URL =
  'https://media.githubusercontent.com/media/geetanjaliapp/geetanjali/main/public/audio/mp3';

const VERSE_COUNTS = [
  0, 47, 72, 43, 42, 29, 47, 30, 28, 34,
  42, 55, 20, 35, 27, 20, 24, 28, 78,
];

/**
 * Geetanjali publishes one Sanskrit MP3 per verse using the project's
 * chapter/verse numbering, for example BG_1_1.mp3 and BG_18_78.mp3.
 */
export const getGeetanjaliAudioUrl = (chapter, verse) => {
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

  return `${GEETANJALI_AUDIO_BASE_URL}/${String(chapterNumber).padStart(2, '0')}/BG_${chapterNumber}_${verseNumber}.mp3`;
};

export { GEETANJALI_AUDIO_BASE_URL };
