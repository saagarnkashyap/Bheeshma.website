import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, ChevronDown, Lightbulb, Target } from 'lucide-react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import EnhancedShlokaCard from './EnhancedShlokaCard';
import useGitaData from '../hooks/useGitaData';
import '../App.css';

const ChapterExplorer = ({ chapterNumber, onChapterChange, onPlayAudio }) => {
  const { getChapterData, loading } = useGitaData();
  const [currentShlokaIndex, setCurrentShlokaIndex] = useState(0);
  const [showChapterInfo, setShowChapterInfo] = useState(true);
  const [verseInput, setVerseInput] = useState('1');
  const chapterData = getChapterData(chapterNumber);
  const totalShlokas = chapterData?.shlokas?.length ?? 0;

  useEffect(() => {
    setCurrentShlokaIndex(0);
    setShowChapterInfo(true);
    setVerseInput('1');
  }, [chapterNumber]);

  useEffect(() => {
    setVerseInput(String(currentShlokaIndex + 1));
  }, [currentShlokaIndex]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const targetTag = event.target?.tagName;
      if (['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(targetTag)) return;

      if (event.key === 'ArrowLeft' && currentShlokaIndex > 0) {
        setCurrentShlokaIndex((index) => index - 1);
      }

      if (event.key === 'ArrowRight' && currentShlokaIndex < totalShlokas - 1) {
        setCurrentShlokaIndex((index) => index + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentShlokaIndex, totalShlokas]);

  if (loading || !chapterData) {
    return (
      <div className="flex h-64 items-center justify-center text-soft-gold">
        Opening chapter...
      </div>
    );
  }

  const currentShloka = chapterData.shlokas[currentShlokaIndex];
  const hasPreviousVerse = currentShlokaIndex > 0;
  const hasNextVerse = currentShlokaIndex < totalShlokas - 1;

  const goToVerse = (index) => setCurrentShlokaIndex(index);
  const handleVerseJump = (event) => {
    event.preventDefault();
    const requestedVerse = Number.parseInt(verseInput, 10);

    if (requestedVerse >= 1 && requestedVerse <= totalShlokas) {
      goToVerse(requestedVerse - 1);
      return;
    }

    setVerseInput(String(currentShlokaIndex + 1));
  };

  const goToPreviousChapter = () => chapterNumber > 1 && onChapterChange(chapterNumber - 1);
  const goToNextChapter = () => chapterNumber < 18 && onChapterChange(chapterNumber + 1);

  return (
    <div className="reading-shell px-5 py-10 lg:px-10 lg:py-14 xl:px-16">
      <div className="mx-auto max-w-5xl">
        <header className="reading-header">
          <div>
            <p className="section-kicker mb-4">Bhagavad Gita · Chapter {chapterData.number}</p>
            <h1 className="font-heading text-4xl text-cosmic-blue sm:text-5xl">{chapterData.name}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-soft-gold">
              Chapter context and verse-by-verse reading.
            </p>
          </div>
          <div className="chapter-arrows">
            <button
              type="button"
              onClick={goToPreviousChapter}
              disabled={chapterNumber <= 1}
              className="reading-nav-button"
              aria-label="Previous chapter"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>
            <button
              type="button"
              onClick={goToNextChapter}
              disabled={chapterNumber >= 18}
              className="reading-nav-button"
              aria-label="Next chapter"
            >
              <span className="hidden sm:inline">Next</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </header>

        <section className="chapter-overview mt-12">
          <button
            type="button"
            className="flex w-full items-center justify-between text-left"
            onClick={() => setShowChapterInfo(!showChapterInfo)}
            aria-expanded={showChapterInfo}
          >
            <span className="flex items-center gap-3">
              <span className="overview-icon"><BookOpen className="h-4 w-4" /></span>
              <span>
                <span className="block text-sm font-semibold text-cosmic-blue">Chapter overview</span>
                <span className="mt-1 block text-xs text-soft-gold">Context before the verses</span>
              </span>
            </span>
            <ChevronDown className={`h-4 w-4 text-soft-gold transition-transform ${showChapterInfo ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence initial={false}>
            {showChapterInfo && (
              <Motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="overview-grid mt-8 border-t border-line pt-7">
                  <div className="overview-copy">
                    <div className="overview-label"><Target className="h-3.5 w-3.5" /> Summary</div>
                    <p>{chapterData.summary}</p>
                  </div>
                  <div className="overview-copy">
                    <div className="overview-label"><Lightbulb className="h-3.5 w-3.5" /> Main theme</div>
                    <p>{chapterData.main_theme}</p>
                  </div>
                  {chapterData.yoga_type && (
                    <div className="overview-copy">
                      <div className="overview-label">Practice</div>
                      <p>{chapterData.yoga_type}</p>
                    </div>
                  )}
                  {chapterData.philosophical_aspects?.length > 0 && (
                    <div className="overview-copy">
                      <div className="overview-label">Philosophical aspects</div>
                      <div className="shloka-tags">
                        {chapterData.philosophical_aspects.map((aspect, index) => (
                          <span className="shloka-tag" key={index}>{aspect}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Motion.div>
            )}
          </AnimatePresence>
        </section>

        <section className="mt-14">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="section-kicker mb-2">Reading progress</p>
              <p className="font-heading text-2xl text-cosmic-blue">
                Verse {currentShlokaIndex + 1} <span className="text-soft-gold/60">of {totalShlokas}</span>
              </p>
            </div>
            <div className="verse-progress-label">{Math.round(((currentShlokaIndex + 1) / totalShlokas) * 100)}% through</div>
          </div>
          <div className="verse-progress mb-8">
            <div style={{ width: `${((currentShlokaIndex + 1) / totalShlokas) * 100}%` }} />
          </div>

          <EnhancedShlokaCard
            shloka={currentShloka}
            chapterNumber={chapterNumber}
            showChapterInfo={false}
            onAudioPlay={onPlayAudio}
          />
        </section>

        <section className="verse-navigation mt-12 border-t border-line pt-7">
          <div className="verse-navigation-header">
            <div>
              <p className="section-kicker mb-2">Verse navigation</p>
              <p className="text-sm text-soft-gold">Move one verse at a time or jump directly.</p>
            </div>
            <form className="verse-jump-form" onSubmit={handleVerseJump}>
              <label htmlFor="verse-jump">Jump to verse</label>
              <div className="verse-jump-control">
                <input
                  id="verse-jump"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={verseInput}
                  onChange={(event) => setVerseInput(event.target.value.replace(/\D/g, ''))}
                  aria-label={`Jump to a verse from 1 to ${totalShlokas}`}
                />
                <span>of {totalShlokas}</span>
                <button type="submit">Go</button>
              </div>
            </form>
          </div>

          <div className="verse-stepper">
              <button
                type="button"
                onClick={() => goToVerse(currentShlokaIndex - 1)}
                disabled={!hasPreviousVerse}
                className="reading-nav-button"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous verse</span>
              </button>
              <p className="verse-stepper-current" aria-live="polite">
                Verse {currentShlokaIndex + 1} <span>of {totalShlokas}</span>
              </p>
              <button
                type="button"
                onClick={() => goToVerse(currentShlokaIndex + 1)}
                disabled={!hasNextVerse}
                className="reading-nav-button"
              >
                <span>Next verse</span>
                <ArrowRight className="h-4 w-4" />
              </button>
          </div>
        </section>

      </div>
    </div>
  );
};

export default ChapterExplorer;
