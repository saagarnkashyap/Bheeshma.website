import React, { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AnimatePresence, motion as Motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ChakraLoader from './components/ChakraLoader';
import DarkAssistantView from './components/DarkAssistantView';
import DarkEditionHeader from './components/DarkEditionHeader';
import DarkHomeView from './components/DarkHomeView';
import FloatingAudioPlayer from './components/FloatingAudioPlayer';
import SeoMetadata from './components/SeoMetadata';
import ThemeToggle from './components/ThemeToggle';
import ZenMode from './components/ZenMode';
import { getReadingProgress, saveReadingProgress } from './lib/readingProgress';
import { getViewHref, getViewState } from './lib/viewUrls';
import { getChapterVerseCount } from './lib/audioUrls';
import chapterCatalog from './assets/bhagavad_gita_chapter_catalog.json';
import krishnaArjunaChariot from './assets/images/krishna-arjuna-chariot.webp';
import './App.css';
import './dark-edition.css';

const ChapterFlipBook = lazy(() => import('./components/ChapterFlipBook'));
const EmotionSearch = lazy(() => import('./components/EmotionSearch'));
const AudioView = lazy(() => import('./components/AudioView'));
const AboutView = lazy(() => import('./components/AboutView'));
const BookmarksView = lazy(() => import('./components/BookmarksView'));

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'chapters', label: 'Chapters' },
  { id: 'emotions', label: 'Guidance' },
  { id: 'audio', label: 'Audio' },
  { id: 'chat', label: 'Assistant' },
  { id: 'about', label: 'About' },
  { id: 'bookmarks', label: 'Bookmarks' },
  { id: 'zen', label: 'Zen' },
];

const THEME_STORAGE_KEY = 'bheeshma-theme';

const fadeVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: 'easeIn' } },
};

const darkFadeVariants = {
  initial: { opacity: 0, y: 18, clipPath: 'inset(0 0 12% 0)' },
  animate: {
    opacity: 1,
    y: 0,
    clipPath: 'inset(0 0 0% 0)',
    transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -14,
    clipPath: 'inset(0 0 100% 0)',
    transition: { duration: 0.34, ease: [0.65, 0, 0.35, 1] },
  },
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
  const [readingProgress, setReadingProgress] = useState(() => getReadingProgress());
  const [pageDirection, setPageDirection] = useState(1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [audioPlayerVisible, setAudioPlayerVisible] = useState(false);
  const [audioShouldPlay, setAudioShouldPlay] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';

    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    return savedTheme === 'dark' ? 'dark' : 'light';
  });
  const shouldReduceMotion = useReducedMotion();
  const chapterName = chapterCatalog.find((chapter) => chapter.number === currentChapter)?.name;
  const mainContentRef = useRef(null);
  const handleZenVerseChange = useCallback((chapter, verse) => {
    setCurrentChapterState(chapter);
    setCurrentVerseState(verse);
  }, []);

  const updateUrl = (view, chapter = currentChapter, verse = currentVerse, replace = false) => {
    const params = new URLSearchParams();

    if (view !== 'home') {
      params.set('view', view);
      if (view === 'chapters' || view === 'zen') {
        params.set('chapter', String(chapter));
        if (view === 'chapters' && verse > 1) params.set('verse', String(verse));
        if (view === 'zen') params.set('verse', String(verse));
      }
    }

    const nextUrl = params.toString() ? `/?${params.toString()}` : '/';
    window.history[replace ? 'replaceState' : 'pushState']({}, '', nextUrl);
  };

  const setCurrentView = (view, chapter = currentChapter, verse = 1) => {
    setCurrentViewState(view);
    if (view === 'zen') {
      setAudioPlayerVisible(false);
      setAudioShouldPlay(false);
    }
    if (view === 'chapters') {
      setCurrentChapterState(chapter);
      setCurrentVerseState(verse);
      if (audioPlayerVisible) setAudioShouldPlay(true);
    }
    updateUrl(view, chapter, verse);
  };

  const setCurrentChapter = (chapter) => {
    setPageDirection(chapter > currentChapter ? 1 : -1);
    setCurrentChapterState(chapter);
    setCurrentVerseState(1);
    if (audioPlayerVisible) setAudioShouldPlay(true);
    if (currentView === 'chapters') updateUrl('chapters', chapter, 1);
  };

  const setCurrentVerse = (verse) => {
    setCurrentVerseState(verse);
    if (audioPlayerVisible) setAudioShouldPlay(true);
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
      if (audioPlayerVisible && nextViewState.currentView === 'chapters') {
        setAudioShouldPlay(true);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [audioPlayerVisible, currentChapter, currentView]);

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
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    if (currentView !== 'chapters') return;

    const nextProgress = { chapter: currentChapter, verse: currentVerse };
    saveReadingProgress(currentChapter, currentVerse);
    setReadingProgress(nextProgress);
  }, [currentChapter, currentVerse, currentView]);

  useEffect(() => {
    if (currentView === 'zen') return;
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [currentChapter, currentView]);

  useEffect(() => {
    if (currentView === 'zen') return;
    mainContentRef.current?.focus({ preventScroll: true });
  }, [currentChapter, currentView]);

  const showAudioPlayer = (chapter, verse) => {
    setPageDirection(chapter >= currentChapter ? 1 : -1);
    setCurrentChapterState(chapter);
    setCurrentVerseState(verse);
    setAudioShouldPlay(true);
    setAudioPlayerVisible(true);
    if (currentView === 'chapters') {
      updateUrl('chapters', chapter, verse, chapter === currentChapter);
    }
  };

  const hideAudioPlayer = () => {
    setAudioPlayerVisible(false);
    setAudioShouldPlay(false);
  };

  const navigateToAudioVerse = (chapter, verse) => {
    if (currentView !== 'chapters') {
      setCurrentView('chapters', chapter, verse);
      return;
    }

    setPageDirection(chapter >= currentChapter ? 1 : -1);
    setCurrentChapterState(chapter);
    setCurrentVerseState(verse);
    setAudioShouldPlay(true);
    updateUrl('chapters', chapter, verse, chapter === currentChapter);
  };

  const handleAudioNext = () => {
    const verseCount = getChapterVerseCount(currentChapter);

    if (currentVerse < verseCount) {
      navigateToAudioVerse(currentChapter, currentVerse + 1);
    } else if (currentChapter < 18) {
      const nextChapter = currentChapter + 1;
      navigateToAudioVerse(nextChapter, 1);
    }
  };

  const handleAudioPrevious = () => {
    if (currentVerse > 1) {
      navigateToAudioVerse(currentChapter, currentVerse - 1);
    } else if (currentChapter > 1) {
      const previousChapter = currentChapter - 1;
      const previousVerse = getChapterVerseCount(previousChapter);
      navigateToAudioVerse(previousChapter, previousVerse);
    }
  };

  const renderMainContent = () => {
    let pageContent;

    switch (currentView) {
      case 'home':
        pageContent = theme === 'dark' ? (
          <DarkHomeView
            onViewChange={setCurrentView}
            chapters={chapterCatalog}
            readingProgress={readingProgress}
          />
        ) : (
          <HomeView
            onViewChange={setCurrentView}
            chapters={chapterCatalog}
            readingProgress={readingProgress}
          />
        );
        break;
      case 'chapters':
        pageContent = (
          <ChapterFlipBook
            chapterNumber={currentChapter}
            initialVerse={currentVerse}
            onChapterChange={setCurrentChapter}
            onVerseChange={setCurrentVerse}
            onPlayAudio={showAudioPlayer}
          />
        );
        break;
      case 'emotions':
        pageContent = <EmotionSearch />;
        break;
      case 'audio':
        pageContent = <AudioView onPlayAudio={showAudioPlayer} />;
        break;
      case 'chat':
        pageContent = theme === 'dark' ? <DarkAssistantView onViewChange={setCurrentView} /> : <ChatView />;
        break;
      case 'about':
        pageContent = <AboutView />;
        break;
      case 'bookmarks':
        pageContent = <BookmarksView onViewChange={setCurrentView} />;
        break;
      case 'zen':
        pageContent = (
          <ZenMode
            initialChapter={currentChapter}
            initialVerse={currentVerse}
            onVerseChange={handleZenVerseChange}
            onExit={() => setCurrentView('home')}
          />
        );
        break;
      default:
        pageContent = (
          <HomeView
            onViewChange={setCurrentView}
            chapters={chapterCatalog}
            readingProgress={readingProgress}
          />
        );
    }

    if (currentView === 'zen') return pageContent;

    return theme === 'dark' ? (
      <div className={`dark-template dark-template-${currentView}`}>
        {pageContent}
      </div>
    ) : pageContent;
  };

  return (
    <Router>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SeoMetadata
        currentView={currentView}
        currentChapter={currentChapter}
        currentVerse={currentVerse}
        chapterName={chapterName}
      />
      <div
        className={`study-edition divine-bg sacred-pattern relative min-h-screen ${audioPlayerVisible ? 'audio-player-open' : ''} ${currentView === 'zen' ? 'zen-edition' : ''}`}
        data-theme={theme}
      >
        {currentView !== 'zen' && theme === 'dark' && (
          <div className="theme-atmosphere" aria-hidden="true">
            <span className="theme-atmosphere-orb theme-atmosphere-orb-red" />
            <span className="theme-atmosphere-orb theme-atmosphere-orb-blue" />
            <span className="theme-atmosphere-scanline" />
          </div>
        )}
        {currentView === 'zen' ? null : theme === 'dark' ? (
          <DarkEditionHeader
            navItems={NAV_ITEMS}
            currentView={currentView}
            currentChapter={currentChapter}
            currentVerse={currentVerse}
            onNavigate={setCurrentView}
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            theme={theme}
            onToggleTheme={() => setTheme((currentTheme) => currentTheme === 'light' ? 'dark' : 'light')}
          />
        ) : (
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
            <span aria-hidden="true">{isMenuOpen ? '×' : '☰'}</span>
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
          <ThemeToggle
            theme={theme}
            onToggle={() => setTheme((currentTheme) => currentTheme === 'light' ? 'dark' : 'light')}
          />
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
        )}

        <main
          id="main-content"
          ref={mainContentRef}
          tabIndex="-1"
          className="relative z-10 min-h-screen min-w-0"
        >
          <AnimatePresence mode="wait" initial={false} custom={pageDirection}>
            <Motion.div
              key={currentView}
              className="page-turn-stage"
              custom={pageDirection}
              variants={shouldReduceMotion
                ? reducedMotionVariants
                : theme === 'dark' ? darkFadeVariants : fadeVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Suspense fallback={<ChakraLoader isLoading={true} message="Opening the text..." />}>
                {renderMainContent()}
              </Suspense>
            </Motion.div>
          </AnimatePresence>
        </main>

        {currentView !== 'zen' && <Motion.button
          type="button"
          aria-label="Open assistant"
          onClick={() => setCurrentView('chat')}
          className={`assistant-launch fixed right-6 z-30 ${audioPlayerVisible ? 'assistant-launch-with-player' : ''}`}
          whileTap={{ scale: 0.94 }}
        >
          Ask
        </Motion.button>}

        {currentView !== 'zen' && <FloatingAudioPlayer
          currentChapter={currentChapter}
          currentVerse={currentVerse}
          onNext={handleAudioNext}
          onPrevious={handleAudioPrevious}
          onClose={hideAudioPlayer}
          autoPlay={audioShouldPlay}
          isVisible={audioPlayerVisible}
        />}
      </div>
    </Router>
  );
}

const HomeView = ({ onViewChange, chapters, readingProgress }) => (
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
          <img src={krishnaArjunaChariot} alt="" role="presentation" />
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
        {readingProgress && (
          <a
            href={getViewHref('chapters', readingProgress.chapter, readingProgress.verse)}
            onClick={(event) => {
              event.preventDefault();
              onViewChange('chapters', readingProgress.chapter, readingProgress.verse);
            }}
            className="home-landing-continue"
          >
            <span>Continue reading</span>
            <span>Chapter {readingProgress.chapter}, verse {readingProgress.verse}</span>
          </a>
        )}
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
