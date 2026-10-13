import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AnimatePresence, motion as Motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Menu, X } from 'lucide-react';
import ChapterFlipBook from './components/ChapterFlipBook';
import ChakraLoader from './components/ChakraLoader';
import EmotionSearch from './components/EmotionSearch';
import AudioView from './components/AudioView';
import AboutView from './components/AboutView';
import BookmarksView from './components/BookmarksView';
import FloatingAudioPlayer from './components/FloatingAudioPlayer';
import SeoMetadata from './components/SeoMetadata';
import useGitaData from './hooks/useGitaData';
import { getViewHref, getViewState } from './lib/viewUrls';
import './App.css';

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'chapters', label: 'Chapters' },
  { id: 'emotions', label: 'Guidance' },
  { id: 'audio', label: 'Audio' },
  { id: 'chat', label: 'Assistant' },
  { id: 'about', label: 'About' },
  { id: 'bookmarks', label: 'Bookmarks' },
];

const fadeVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: 'easeIn' } },
};

const reducedMotionVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0 } },
  exit: { opacity: 0, transition: { duration: 0 } },
};

function App() {
  const initialViewState = getViewState();
  const [currentView, setCurrentViewState] = useState(initialViewState.currentView);
  const [currentChapter, setCurrentChapterState] = useState(initialViewState.currentChapter);
  const [currentVerse, setCurrentVerseState] = useState(initialViewState.currentVerse);
  const [pageDirection, setPageDirection] = useState(1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [audioPlayerVisible, setAudioPlayerVisible] = useState(false);
  const [audioCurrentChapter, setAudioCurrentChapter] = useState(null);
  const [audioCurrentVerse, setAudioCurrentVerse] = useState(null);
  const shouldReduceMotion = useReducedMotion();
  const { gitaData, loading, error } = useGitaData();
  const chapterName = gitaData?.chapters.find((chapter) => chapter.number === currentChapter)?.name;

  const updateUrl = (view, chapter = currentChapter, verse = currentVerse, replace = false) => {
    const params = new URLSearchParams();

    if (view !== 'home') {
      params.set('view', view);
      if (view === 'chapters') {
        params.set('chapter', String(chapter));
        if (verse > 1) params.set('verse', String(verse));
      }
    }

    const nextUrl = params.toString() ? `/?${params.toString()}` : '/';
    window.history[replace ? 'replaceState' : 'pushState']({}, '', nextUrl);
  };

  const setCurrentView = (view, chapter = currentChapter, verse = 1) => {
    setCurrentViewState(view);
    if (view === 'chapters') {
      setCurrentChapterState(chapter);
      setCurrentVerseState(verse);
    }
    updateUrl(view, chapter, verse);
  };

  const setCurrentChapter = (chapter) => {
    setPageDirection(chapter > currentChapter ? 1 : -1);
    setCurrentChapterState(chapter);
    setCurrentVerseState(1);
    if (currentView === 'chapters') updateUrl('chapters', chapter, 1);
  };

  const setCurrentVerse = (verse) => {
    setCurrentVerseState(verse);
    if (currentView === 'chapters') updateUrl('chapters', currentChapter, verse, true);
  };

  useEffect(() => {
    const handlePopState = () => {
      const nextViewState = getViewState();
      if (nextViewState.currentView === 'chapters' && currentView === 'chapters') {
        setPageDirection(nextViewState.currentChapter >= currentChapter ? 1 : -1);
      }
      setCurrentViewState(nextViewState.currentView);
      setCurrentChapterState(nextViewState.currentChapter);
      setCurrentVerseState(nextViewState.currentVerse);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentChapter, currentView]);

  useEffect(() => {
    const handleMenuKeyDown = (event) => {
      if (event.key === 'Escape') setIsMenuOpen(false);
    };

    window.addEventListener('keydown', handleMenuKeyDown);
    return () => window.removeEventListener('keydown', handleMenuKeyDown);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [currentView]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [currentChapter, currentView]);

  const showAudioPlayer = (chapter, verse) => {
    setAudioCurrentChapter(chapter);
    setAudioCurrentVerse(verse);
    setAudioPlayerVisible(true);
  };

  const hideAudioPlayer = () => {
    setAudioPlayerVisible(false);
    setAudioCurrentChapter(null);
    setAudioCurrentVerse(null);
  };

  const handleAudioNext = () => {
    if (audioCurrentVerse < 47) {
      setAudioCurrentVerse(audioCurrentVerse + 1);
    } else if (audioCurrentChapter < 18) {
      setAudioCurrentChapter(audioCurrentChapter + 1);
      setAudioCurrentVerse(1);
    }
  };

  const handleAudioPrevious = () => {
    if (audioCurrentVerse > 1) {
      setAudioCurrentVerse(audioCurrentVerse - 1);
    } else if (audioCurrentChapter > 1) {
      setAudioCurrentChapter(audioCurrentChapter - 1);
      setAudioCurrentVerse(47);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoading(false), 1400);
    return () => clearTimeout(timer);
  }, []);

  if (isInitialLoading || loading) {
    return <ChakraLoader isLoading={true} message="Opening the text..." />;
  }

  if (error) {
    return (
      <div className="divine-bg flex min-h-screen items-center justify-center px-6">
        <div className="max-w-md text-center">
          <p className="section-kicker mb-4">A pause in the path</p>
          <h2 className="font-heading mb-4 text-3xl text-cosmic-blue">The Gita could not be opened.</h2>
          <p className="text-soft-gold">{error}</p>
        </div>
      </div>
    );
  }

  const renderMainContent = () => {
    switch (currentView) {
      case 'home':
        return <HomeView onViewChange={setCurrentView} chapters={gitaData.chapters} />;
      case 'chapters':
        return (
          <ChapterFlipBook
            chapterNumber={currentChapter}
            initialVerse={currentVerse}
            onChapterChange={setCurrentChapter}
            onVerseChange={setCurrentVerse}
            onPlayAudio={showAudioPlayer}
          />
        );
      case 'emotions':
        return <EmotionSearch />;
      case 'audio':
        return <AudioViewComponent onPlayAudio={showAudioPlayer} />;
      case 'chat':
        return <ChatView />;
      case 'about':
        return <AboutView />;
      case 'bookmarks':
        return <BookmarksView onViewChange={setCurrentView} />;
      default:
        return <HomeView onViewChange={setCurrentView} chapters={gitaData.chapters} />;
    }
  };

  return (
    <Router>
      <SeoMetadata
        currentView={currentView}
        currentChapter={currentChapter}
        currentVerse={currentVerse}
        chapterName={chapterName}
      />
      <div className="study-edition divine-bg sacred-pattern relative min-h-screen">
        <header className="site-topbar">
          <a
            href={getViewHref('home')}
            onClick={(event) => {
              event.preventDefault();
              setIsMenuOpen(false);
              setCurrentView('home');
            }}
            className="site-brand"
          >
            <span className="site-brand-mark" aria-hidden="true">ॐ</span>
            <span className="site-brand-name">BHEESHMA</span>
          </a>
          <button
            type="button"
            className="site-mobile-menu-toggle"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="primary-navigation"
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <nav
            id="primary-navigation"
            className={`site-main-nav ${isMenuOpen ? 'site-main-nav-open' : ''}`}
            aria-label="Primary navigation"
          >
            {NAV_ITEMS.map(({ id, label }) => (
              <a
                key={id}
                href={getViewHref(id, currentChapter, id === 'chapters' ? currentVerse : undefined)}
                onClick={(event) => {
                  event.preventDefault();
                  setIsMenuOpen(false);
                  setCurrentView(id, currentChapter, id === 'chapters' ? currentVerse : 1);
                }}
                className={`site-nav-link ${currentView === id ? 'site-nav-link-active' : ''}`}
                aria-current={currentView === id ? 'page' : undefined}
              >
                {label}
              </a>
            ))}
          </nav>
          {isMenuOpen && (
            <button
              type="button"
              className="site-mobile-nav-backdrop"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close navigation menu"
            />
          )}
          <span className="site-mobile-om" aria-hidden="true">ॐ</span>
        </header>

        <main className="relative z-10 min-h-screen min-w-0">
          <AnimatePresence mode="wait" initial={false} custom={pageDirection}>
            <Motion.div
              key={currentView}
              className="page-turn-stage"
              custom={pageDirection}
              variants={shouldReduceMotion
                ? reducedMotionVariants
                : fadeVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {renderMainContent()}
            </Motion.div>
          </AnimatePresence>
        </main>

        <Motion.button
          type="button"
          aria-label="Open assistant"
          onClick={() => setCurrentView('chat')}
          className={`assistant-launch fixed right-6 z-30 ${audioPlayerVisible ? 'assistant-launch-with-player' : ''}`}
          whileTap={{ scale: 0.94 }}
        >
          Ask
        </Motion.button>

        <FloatingAudioPlayer
          currentChapter={audioCurrentChapter}
          currentVerse={audioCurrentVerse}
          onNext={handleAudioNext}
          onPrevious={handleAudioPrevious}
          onClose={hideAudioPlayer}
          isVisible={audioPlayerVisible}
        />
      </div>
    </Router>
  );
}

const HomeView = ({ onViewChange, chapters }) => (
  <div className="home-page">
    <Motion.section
      className="home-landing"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <div className="home-landing-wash" aria-hidden="true" />
      <span className="home-landing-edge home-landing-edge-left">BHEESHMA · 01</span>
      <span className="home-landing-edge home-landing-edge-right">THE SACRED DIALOGUE</span>
      <div className="home-landing-content">
        <p className="home-landing-eyebrow">A digital study edition</p>
        <h1 className="home-landing-title">Bhagavad Gita</h1>
        <div className="home-landing-rule" aria-hidden="true"><span>ॐ</span></div>

        <div className="home-landing-figure" aria-hidden="true">
          <svg viewBox="0 0 280 360" role="presentation">
            <path className="home-krishna-feather" d="M157 32c20-26 44-25 55-17-20 7-25 21-28 38-8-7-16-13-27-21Z" />
            <circle cx="132" cy="80" r="25" />
            <path d="M105 77c5-28 35-39 59-24l-8 14c-16-8-31-5-51 10Z" />
            <path d="M111 108c19 16 39 18 59 3 4 24 12 41 27 57-14 36-31 65-44 103-16-15-32-16-50-3-7-36-5-72 7-106 8-17 8-34 1-54Z" />
            <path d="M104 130c-22 7-36 22-52 41 27 3 48-6 64-23" />
            <path d="M166 127c22 12 42 18 66 17-15 18-37 22-61 13" />
            <path d="M100 253c-11 30-21 61-40 86 22 4 43-7 60-25l21-59" />
            <path d="M153 253c9 31 19 61 42 85-24 3-45-8-60-27l-20-57" />
            <path className="home-krishna-flute" d="M48 175c52 5 103 4 167-7" />
            <circle className="home-krishna-flute-dot" cx="88" cy="171" r="3" />
            <circle className="home-krishna-flute-dot" cx="111" cy="172" r="3" />
            <circle className="home-krishna-flute-dot" cx="138" cy="170" r="3" />
          </svg>
        </div>

        <p className="home-landing-sanskrit font-sanskrit">यत् भावो, तत् भवति</p>
        <p className="home-landing-translation">You Become what You Believe</p>
        <p className="home-landing-copy">
          Read the verses, sit with their meaning, and return to the wisdom whenever you need it.
        </p>
        <a
          href={getViewHref('chapters')}
          onClick={(event) => {
            event.preventDefault();
            onViewChange('chapters');
          }}
          className="home-landing-cta"
        >
          Enter the Gita
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>

      <div className="home-landing-meta" aria-label="Edition details">
        <span>18 chapters</span>
        <span>700 verses</span>
        <span>Sanskrit · English</span>
      </div>
    </Motion.section>

    <div className="home-page-body">
      <section className="home-chapter-panel">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="section-kicker mb-3">Chapter index</p>
            <h2 className="font-heading text-3xl text-cosmic-blue sm:text-4xl">All chapters.</h2>
          </div>
          <p className="max-w-xs text-sm leading-6 text-soft-gold">
            Select a chapter to begin reading.
          </p>
        </div>
        <div className="mt-8 grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-9">
          {chapters.map((chapter) => (
            <a
              key={chapter.number}
              href={getViewHref('chapters', chapter.number)}
              onClick={(event) => {
                event.preventDefault();
                onViewChange('chapters', chapter.number);
              }}
              className="home-chapter-link"
              title={chapter.name}
            >
              <span className="home-chapter-index">{String(chapter.number).padStart(2, '0')}</span>
              <span className="home-chapter-name">{chapter.name.replace(/ Yoga$/, '')}</span>
              <ArrowRight className="home-chapter-arrow h-4 w-4" />
            </a>
          ))}
        </div>
      </section>
    </div>
  </div>
);

const EmotionsView = () => <EmotionSearch />;

const AudioViewComponent = ({ onPlayAudio }) => (
  <AudioView onPlayAudio={onPlayAudio} />
);

const ChatView = () => (
  <div className="min-h-screen px-5 py-16 lg:px-10 xl:px-16">
    <div className="mx-auto max-w-3xl">
      <p className="section-kicker mb-4">Assistant</p>
      <h2 className="font-heading text-4xl text-cosmic-blue">Ask about the text.</h2>
      <div className="mt-8 max-w-2xl border-l border-golden-amber pl-6 sm:pl-8">
        <p className="text-lg leading-8 text-soft-gold">
          An assistant for questions about chapters, verses, and meanings. This feature is
          currently being prepared.
        </p>
      </div>
    </div>
  </div>
);

export default App;
