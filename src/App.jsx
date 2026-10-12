import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { ArrowRight, BookOpen, Heart, Music } from 'lucide-react';
import Navigation from './components/Navigation';
import ChapterExplorer from './components/ChapterExplorer';
import ChakraLoader from './components/ChakraLoader';
import EmotionSearch from './components/EmotionSearch';
import AudioView from './components/AudioView';
import AboutView from './components/AboutView';
import FloatingAudioPlayer from './components/FloatingAudioPlayer';
import useGitaData from './hooks/useGitaData';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [currentChapter, setCurrentChapter] = useState(1);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [audioPlayerVisible, setAudioPlayerVisible] = useState(false);
  const [audioCurrentChapter, setAudioCurrentChapter] = useState(null);
  const [audioCurrentVerse, setAudioCurrentVerse] = useState(null);
  const { loading, error } = useGitaData();

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
        return <HomeView onViewChange={setCurrentView} onChapterChange={setCurrentChapter} />;
      case 'chapters':
        return (
          <ChapterExplorer
            chapterNumber={currentChapter}
            onChapterChange={setCurrentChapter}
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
      default:
        return <HomeView onViewChange={setCurrentView} onChapterChange={setCurrentChapter} />;
    }
  };

  return (
    <Router>
      <div className="divine-bg sacred-pattern relative min-h-screen">
        <Navigation
          currentView={currentView}
          onViewChange={setCurrentView}
          currentChapter={currentChapter}
          onChapterChange={setCurrentChapter}
        />

        <main className="relative z-10 min-h-screen lg:ml-80">
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
          aria-label="Open chat with Bheeshma"
          onClick={() => setCurrentView('chat')}
          className="fixed bottom-6 right-6 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-cosmic-blue text-paper shadow-lg transition hover:-translate-y-1 hover:bg-golden-amber"
          whileTap={{ scale: 0.94 }}
        >
          <span className="font-sanskrit text-lg">ॐ</span>
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

const HomeView = ({ onViewChange, onChapterChange }) => (
  <div className="relative min-h-screen px-5 py-10 lg:px-16 lg:py-16">
    <div className="mx-auto max-w-6xl">
      <Motion.section
        className="home-hero"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="max-w-2xl">
          <p className="section-kicker mb-6">A place for study and stillness</p>
          <h1 className="font-heading text-5xl leading-[1.05] text-cosmic-blue sm:text-6xl lg:text-7xl">
            Return to the<br />
            <span className="text-golden-amber">essential.</span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-8 text-soft-gold sm:text-lg">
            Read the Bhagavad Gita slowly. Sit with each verse, listen to its sound,
            and carry one clear thought into the day.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => onViewChange('chapters')}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-cosmic-blue px-6 py-3 text-sm font-medium text-paper transition hover:-translate-y-0.5 hover:bg-golden-amber"
            >
              Begin reading
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewChange('emotions')}
              className="inline-flex items-center justify-center rounded-full border border-line-strong px-6 py-3 text-sm font-medium text-cosmic-blue transition hover:border-golden-amber hover:text-golden-amber"
            >
              Find a verse for today
            </button>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.16em] text-soft-gold/75 sm:gap-7">
            <span>18 chapters</span>
            <span className="h-1 w-1 rounded-full bg-golden-amber" />
            <span>700 verses</span>
            <span className="h-1 w-1 rounded-full bg-golden-amber" />
            <span>One quiet practice</span>
          </div>
        </div>

        <div className="home-hero-mark" aria-hidden="true">
          <div className="home-om font-sanskrit">ॐ</div>
          <div className="quiet-rule" />
          <p className="font-sanskrit text-lg text-golden-amber/80">शान्तिः शान्तिः शान्तिः</p>
          <p className="mt-3 max-w-[12rem] text-center text-xs leading-6 text-soft-gold">
            May attention become a form of prayer.
          </p>
        </div>
      </Motion.section>

      <section className="mt-24">
        <div className="mb-8 max-w-xl">
          <p className="section-kicker mb-3">Begin anywhere</p>
          <h2 className="font-heading text-3xl text-cosmic-blue sm:text-4xl">Choose your way in.</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <FeatureCard
            title="Read the chapters"
            description="Move through the text with Sanskrit, transliteration, meaning, and context."
            icon={BookOpen}
            onClick={() => onViewChange('chapters')}
          />
          <FeatureCard
            title="Meet the moment"
            description="Find a passage for fear, doubt, grief, anger, or the need for peace."
            icon={Heart}
            onClick={() => onViewChange('emotions')}
          />
          <FeatureCard
            title="Listen closely"
            description="Let the recitation slow you down and give the verse another texture."
            icon={Music}
            onClick={() => onViewChange('audio')}
          />
        </div>
      </section>

      <section className="home-chapter-panel mt-24">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="section-kicker mb-3">The whole path</p>
            <h2 className="font-heading text-3xl text-cosmic-blue sm:text-4xl">Choose a chapter.</h2>
          </div>
          <p className="max-w-xs text-sm leading-6 text-soft-gold">
            There is no correct place to begin. Follow your attention.
          </p>
        </div>
        <div className="mt-8 grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-9">
          {Array.from({ length: 18 }, (_, i) => i + 1).map((chapterNum) => (
            <button
              key={chapterNum}
              type="button"
              onClick={() => {
                onChapterChange(chapterNum);
                onViewChange('chapters');
              }}
              className="home-chapter-link"
            >
              <span className="font-mono text-xs text-soft-gold/70">{String(chapterNum).padStart(2, '0')}</span>
              <span className="mt-1 text-sm font-medium">Chapter</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  </div>
);

const FeatureCard = ({ title, description, icon, onClick, delay = 0 }) => {
  const Icon = icon;

  return (
    <Motion.button
      type="button"
      className="home-feature text-left"
      onClick={onClick}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.99 }}
    >
      <span className="home-feature-icon"><Icon className="h-5 w-5" strokeWidth={1.6} /></span>
      <span className="mt-8 block font-heading text-2xl text-cosmic-blue">{title}</span>
      <span className="mt-3 block text-sm leading-7 text-soft-gold">{description}</span>
      <span className="mt-7 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-golden-amber">
        Open <ArrowRight className="h-3.5 w-3.5" />
      </span>
    </Motion.button>
  );
};

const EmotionsView = () => <EmotionSearch />;

const AudioViewComponent = ({ onPlayAudio }) => <AudioView onPlayAudio={onPlayAudio} />;

const ChatView = () => (
  <div className="min-h-screen px-5 py-16 lg:px-16">
    <div className="mx-auto max-w-3xl">
      <p className="section-kicker mb-4">A future companion</p>
      <h2 className="font-heading text-4xl text-cosmic-blue">Ask Bheeshma.</h2>
      <div className="mt-8 max-w-2xl border-l border-golden-amber pl-6 sm:pl-8">
        <p className="text-lg leading-8 text-soft-gold">
          A contemplative guide for when you want to understand a verse, not rush past it.
          The conversation layer is still being prepared.
        </p>
        <p className="mt-5 font-sanskrit text-lg text-golden-amber">तत्त्वमसि</p>
        <p className="mt-1 text-xs uppercase tracking-[0.14em] text-soft-gold">You are that.</p>
      </div>
    </div>
  </div>
);

export default App;
