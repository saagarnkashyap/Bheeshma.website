export const SITE_URL = 'https://bheeshma.vercel.app/';

const VIEW_IDS = new Set(['home', 'chapters', 'emotions', 'audio', 'chat', 'about']);

export const getViewHref = (view, chapter = 1) => {
  if (view === 'home') return '/';

  const params = new URLSearchParams({ view });
  if (view === 'chapters') params.set('chapter', String(chapter));

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

  return { currentView, currentChapter };
};

export const getViewUrl = (view, chapter = 1) => new URL(getViewHref(view, chapter), SITE_URL).toString();
