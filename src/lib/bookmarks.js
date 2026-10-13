export const BOOKMARKS_STORAGE_KEY = 'bheeshma_bookmarks';

export const getBookmarkKey = (chapterNumber, verseNumber) => `${chapterNumber}-${verseNumber}`;

export const parseBookmarkKey = (bookmarkKey) => {
  const [chapter, verse] = String(bookmarkKey).split('-').map(Number);

  if (!Number.isInteger(chapter) || !Number.isInteger(verse) || chapter < 1 || verse < 1) {
    return null;
  }

  return { chapter, verse };
};

export const getBookmarks = () => {
  if (typeof window === 'undefined') return [];

  try {
    const storedBookmarks = JSON.parse(window.localStorage.getItem(BOOKMARKS_STORAGE_KEY) || '[]');
    if (!Array.isArray(storedBookmarks)) return [];

    return [...new Set(storedBookmarks.filter((bookmark) => parseBookmarkKey(bookmark)))];
  } catch {
    return [];
  }
};

const saveBookmarks = (bookmarks) => {
  try {
    window.localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks));
  } catch {
    // Local storage may be unavailable in private browsing or restricted contexts.
  }

  window.dispatchEvent(new CustomEvent('bookmarkschange'));
};

export const isBookmarked = (chapterNumber, verseNumber) => (
  getBookmarks().includes(getBookmarkKey(chapterNumber, verseNumber))
);

export const toggleBookmark = (chapterNumber, verseNumber) => {
  const bookmarkKey = getBookmarkKey(chapterNumber, verseNumber);
  const bookmarks = getBookmarks();
  const wasBookmarked = bookmarks.includes(bookmarkKey);
  const nextBookmarks = wasBookmarked
    ? bookmarks.filter((bookmark) => bookmark !== bookmarkKey)
    : [...bookmarks, bookmarkKey];

  saveBookmarks(nextBookmarks);
  return !wasBookmarked;
};

export const removeBookmark = (chapterNumber, verseNumber) => {
  const bookmarkKey = getBookmarkKey(chapterNumber, verseNumber);
  saveBookmarks(getBookmarks().filter((bookmark) => bookmark !== bookmarkKey));
};
