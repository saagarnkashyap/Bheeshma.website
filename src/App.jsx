import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import ChapterExplorer from './components/ChapterExplorer';
import ChakraLoader from './components/ChakraLoader';
import EmotionSearch from './components/EmotionSearch';
import AudioView from './components/AudioView';
import AboutView from './components/AboutView';
import FloatingAudioPlayer from './components/FloatingAudioPlayer';
import SectionLinks from './components/SectionLinks';
import SeoMetadata from './components/SeoMetadata';
import useGitaData from './hooks/useGitaData';
import { getViewHref, getViewState } from './lib/viewUrls';
import './App.css';

const VIEW_LABELS = {
  home: 'Digital study edition',
  chapters: 'Reading room',
  emotions: 'Guidance by subject',
  audio: 'Audio reference',
  chat: 'Assistant',
  about: 'About this edition',
};

function App() {
  const initialViewState = getViewState();
  const [currentView, setCurrentViewState] = useState(initialViewState.currentView);
  const [currentChapter, setCurrentChapterState] = useState(initialViewState.currentChapter);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [audioPlayerVisible, setAudioPlayerVisible] = useState(false);
  const [audioCurrentChapter, setAudioCurrentChapter] = useState(null);
  const [audioCurrentVerse, setAudioCurrentVerse] = useState(null);
  const { gitaData, loading, error } = useGitaData();
  const chapterName = gitaData?.chapters.find((chapter) => chapter.number === currentChapter)?.name;

  const updateUrl = (view, chapter = currentChapter, replace = false) => {
    const params = new URLSearchParams();

    if (view !== 'home') {
      params.set('view', view);
      if (view === 'chapters') params.set('chapter', String(chapter));
    }

    const nextUrl = params.toString() ? `/?${params.toString()}` : '/';
    window.history[replace ? 'replaceState' : 'pushState']({}, '', nextUrl);
  };

  const setCurrentView = (view, chapter = currentChapter) => {
    setCurrentViewState(view);
    if (view === 'chapters') setCurrentChapterState(chapter);
    updateUrl(view, chapter);
  };

  const setCurrentChapter = (chapter) => {
    setCurrentChapterState(chapter);
    if (currentView === 'chapters') updateUrl('chapters', chapter);
  };

  useEffect(() => {
    const handlePopState = () => {
      const nextViewState = getViewState();
      setCurrentViewState(nextViewState.currentView);
      setCurrentChapterState(nextViewState.currentChapter);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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
        return <HomeView onViewChange={setCurrentView} />;
      case 'chapters':
        return (
          <ChapterExplorer
            chapterNumber={currentChapter}
            onChapterChange={setCurrentChapter}
            onPlayAudio={showAudioPlayer}
            onViewChange={setCurrentView}
          />
        );
      case 'emotions':
        return <EmotionSearch onViewChange={setCurrentView} />;
      case 'audio':
        return <AudioViewComponent onPlayAudio={showAudioPlayer} onViewChange={setCurrentView} />;
      case 'chat':
        return <ChatView onViewChange={setCurrentView} />;
      case 'about':
        return <AboutView onViewChange={setCurrentView} />;
      default:
        return <HomeView onViewChange={setCurrentView} onChapterChange={setCurrentChapter} />;
    }
  };

  return (
    <Router>
      <SeoMetadata
        currentView={currentView}
        currentChapter={currentChapter}
        chapterName={chapterName}
      />
      <div className="study-edition divine-bg sacred-pattern relative min-h-screen">
        <header className="site-topbar">
          <a
            href={getViewHref('home')}
            onClick={(event) => {
              event.preventDefault();
              setCurrentView('home');
            }}
            className="site-brand"
          >
            <span className="site-brand-mark">BG</span>
            <span>
              <span className="block font-heading text-lg tracking-tight text-cosmic-blue">Bheeshma</span>
              <span className="block text-[0.6rem] uppercase tracking-[0.18em] text-soft-gold">Digital study edition</span>
            </span>
          </a>
          <div className="site-topbar-meta">
            <span className="hidden sm:inline">{VIEW_LABELS[currentView]}</span>
            {currentView !== 'home' && (
              <a
                href={getViewHref('home')}
                onClick={(event) => {
                  event.preventDefault();
                  setCurrentView('home');
                }}
                className="site-home-link"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Home
              </a>
            )}
          </div>
        </header>

        <main className="relative z-10 min-h-screen min-w-0">
          <AnimatePresence mode="wait">
            <Motion.div
              key={currentView}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
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

const HomeView = ({ onViewChange }) => (
  <div className="relative min-h-screen px-5 py-10 lg:px-10 lg:py-16 xl:px-16">
    <div className="mx-auto max-w-6xl">
      <Motion.section
        className="home-hero"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="max-w-2xl">
          <p className="section-kicker mb-6">Digital study edition</p>
          <h1 className="font-heading text-5xl leading-[1.05] text-cosmic-blue sm:text-6xl lg:text-7xl">
            Bhagavad<br />
            <span className="text-golden-amber">Gita.</span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-8 text-soft-gold sm:text-lg">
            A focused interface for reading the text, studying its context, and listening to
            the verses in Sanskrit.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href={getViewHref('chapters')}
              onClick={(event) => {
                event.preventDefault();
                onViewChange('chapters');
              }}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-cosmic-blue px-6 py-3 text-sm font-medium text-paper transition hover:-translate-y-0.5 hover:bg-golden-amber"
            >
                Open chapters
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href={getViewHref('emotions')}
              onClick={(event) => {
                event.preventDefault();
                onViewChange('emotions');
              }}
              className="inline-flex items-center justify-center rounded-full border border-line-strong px-6 py-3 text-sm font-medium text-cosmic-blue transition hover:border-golden-amber hover:text-golden-amber"
            >
                Find guidance
            </a>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.16em] text-soft-gold/75 sm:gap-7">
            <span>18 chapters</span>
            <span className="h-1 w-1 rounded-full bg-golden-amber" />
            <span>700 verses</span>
            <span className="h-1 w-1 rounded-full bg-golden-amber" />
            <span>For reading and study</span>
          </div>
        </div>

        <div className="home-hero-index" aria-label="Edition contents">
          <p className="section-kicker mb-7">Edition contents</p>
          <div className="home-index-row"><strong>18</strong><span>Chapters</span></div>
          <div className="home-index-row"><strong>700</strong><span>Verses</span></div>
          <div className="home-index-row"><strong>02</strong><span>Languages</span></div>
          <p className="mt-8 border-t border-line pt-5 text-xs leading-6 text-soft-gold">
            Sanskrit text, transliteration, English meaning, and recitation.
          </p>
        </div>
      </Motion.section>

      <SectionLinks
        onViewChange={onViewChange}
        title="Choose a way in."
        description="Start with the part of the Gita that meets you where you are."
      />

      <section className="home-chapter-panel mt-24">
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
          {Array.from({ length: 18 }, (_, i) => i + 1).map((chapterNum) => (
            <a
              key={chapterNum}
              href={getViewHref('chapters', chapterNum)}
              onClick={(event) => {
                event.preventDefault();
                onViewChange('chapters', chapterNum);
              }}
              className="home-chapter-link"
            >
              <span className="font-mono text-xs text-soft-gold/70">{String(chapterNum).padStart(2, '0')}</span>
              <span className="mt-1 text-sm font-medium">Open</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  </div>
);

const EmotionsView = () => <EmotionSearch />;

const AudioViewComponent = ({ onPlayAudio, onViewChange }) => (
  <AudioView onPlayAudio={onPlayAudio} onViewChange={onViewChange} />
);

const ChatView = ({ onViewChange }) => (
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
      <SectionLinks onViewChange={onViewChange} exclude={['chat']} />
    </div>
  </div>
);

export default App;
