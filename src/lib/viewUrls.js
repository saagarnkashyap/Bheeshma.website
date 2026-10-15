export const SITE_URL = 'https://bheeshma.vercel.app/';

const VIEW_IDS = new Set(['home', 'chapters', 'emotions', 'audio', 'chat', 'about', 'bookmarks', 'zen']);

export const getViewHref = (view, chapter = 1, verse) => {
  if (view === 'home') return '/';

  const params = new URLSearchParams({ view });
  if (view === 'chapters') {
    params.set('chapter', String(chapter));
    if (Number.isInteger(verse) && verse >= 1) params.set('verse', String(verse));
  }

  return `/?${params.toString()}`;
};

export const getViewState = () => {
  const params = new URLSearchParams(window.location.search);
  const requestedView = params.get('view');
  const currentView = VIEW_IDS.has(requestedView) ? requestedView : 'home';
  const requestedChapter = Number.parseInt(params.get('chapter'), 10);
  const currentChapter = Number.isInteger(requestedChapter) && requestedChapter >= 1 && requestedChapter <= 18
    ? requestedChapter
    : 1;
  const requestedVerse = Number.parseInt(params.get('verse'), 10);
  const currentVerse = Number.isInteger(requestedVerse) && requestedVerse >= 1 && requestedVerse <= 700
    ? requestedVerse
    : 1;

  return { currentView, currentChapter, currentVerse };
};

export const getViewUrl = (view, chapter = 1, verse) => new URL(getViewHref(view, chapter, verse), SITE_URL).toString();
