import React, { useEffect, useState } from 'react';
import { ArrowRight, BookmarkX, BookOpen } from 'lucide-react';
import useGitaData from '../hooks/useGitaData';
import { getViewHref } from '../lib/viewUrls';
import { getBookmarks, parseBookmarkKey, removeBookmark } from '../lib/bookmarks';
import '../App.css';

const BookmarksView = ({ onViewChange }) => {
  const { getShlokaData, loading } = useGitaData();
  const [bookmarkKeys, setBookmarkKeys] = useState(getBookmarks);

  useEffect(() => {
    const syncBookmarks = () => setBookmarkKeys(getBookmarks());

    window.addEventListener('bookmarkschange', syncBookmarks);
    window.addEventListener('storage', syncBookmarks);
    return () => {
      window.removeEventListener('bookmarkschange', syncBookmarks);
      window.removeEventListener('storage', syncBookmarks);
    };
  }, []);

  if (loading) {
    return <div className="flex h-64 items-center justify-center text-soft-gold">Opening saved verses...</div>;
  }

  const savedVerses = bookmarkKeys
    .map(parseBookmarkKey)
    .filter(Boolean)
    .map(({ chapter, verse }) => {
      const shloka = getShlokaData(chapter, verse);
      return shloka ? { chapter, verse, shloka } : null;
    })
    .filter(Boolean);

  const openVerse = (event, chapter, verse) => {
    event.preventDefault();
    onViewChange('chapters', chapter, verse);
  };

  return (
    <div className="bookmarks-view reading-shell px-5 py-10 lg:px-10 lg:py-14 xl:px-16">
      <div className="mx-auto max-w-5xl">
        <header className="bookmarks-header">
          <div>
            <p className="section-kicker mb-4">Your reading list</p>
            <h1 className="font-heading text-4xl text-cosmic-blue sm:text-5xl">Saved verses.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-soft-gold">
              Keep the passages you want to return to. Saved verses stay on this browser and device.
            </p>
          </div>
          <p className="bookmarks-count" aria-live="polite">
            {savedVerses.length} saved verse{savedVerses.length === 1 ? '' : 's'}
          </p>
        </header>

        {savedVerses.length > 0 ? (
          <div className="bookmark-list" aria-label="Saved verses">
            {savedVerses.map(({ chapter, verse, shloka }) => (
              <article className="bookmark-entry" key={`${chapter}-${verse}`}>
                <div className="bookmark-entry-content">
                  <p className="section-kicker">Bhagavad Gita {chapter}.{verse}</p>
                  <p className="bookmark-entry-sanskrit font-sanskrit">{shloka.sanskrit_text}</p>
                  <p className="bookmark-entry-meaning">{shloka.meaning}</p>
                </div>
                <div className="bookmark-entry-actions">
                  <a
                    href={getViewHref('chapters', chapter, verse)}
                    onClick={(event) => openVerse(event, chapter, verse)}
                    className="bookmark-read-link"
                  >
                    Read verse
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <button
                    type="button"
                    className="icon-button"
                    onClick={() => removeBookmark(chapter, verse)}
                    aria-label={`Remove Bhagavad Gita ${chapter}.${verse} from saved verses`}
                    title="Remove saved verse"
                  >
                    <BookmarkX className="h-4 w-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="bookmark-empty">
            <span className="bookmark-empty-icon"><BookOpen className="h-5 w-5" /></span>
            <h2 className="font-heading text-2xl text-cosmic-blue">Nothing saved yet.</h2>
            <p className="mt-2 max-w-md text-sm leading-7 text-soft-gold">
              Bookmark a verse while reading and it will appear here for your next visit.
            </p>
            <button type="button" className="bookmark-empty-link" onClick={() => onViewChange('chapters')}>
              Start reading
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarksView;
