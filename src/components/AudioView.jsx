import React, { useState } from 'react';
import { Headphones, Music, Play, Settings, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';
import useGitaData from '../hooks/useGitaData';
import '../App.css';

const AudioView = ({ onPlayAudio }) => {
  const { getChapterData, loading } = useGitaData();
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [selectedVerse, setSelectedVerse] = useState(1);
  const chapterData = getChapterData(selectedChapter);
  const currentShloka = chapterData?.shlokas?.[selectedVerse - 1];

  const handlePlayVerse = () => {
    if (onPlayAudio) onPlayAudio(selectedChapter, selectedVerse);
  };

  const handleChapterChange = (chapter) => {
    setSelectedChapter(chapter);
    setSelectedVerse(1);
  };

  if (loading) {
    return <div className="flex h-64 items-center justify-center text-soft-gold">Preparing the listening room...</div>;
  }

  return (
    <div className="reading-shell px-5 py-10 lg:px-16 lg:py-14">
      <div className="mx-auto max-w-5xl">
        <header className="mb-12 max-w-2xl">
          <p className="section-kicker mb-4">Sound as practice</p>
          <h1 className="font-heading text-4xl text-cosmic-blue sm:text-5xl">Listen to the verse.</h1>
          <p className="mt-5 text-base leading-8 text-soft-gold">
            Choose a chapter, choose a verse, and give the spoken word enough room to arrive.
          </p>
        </header>

        <section className="audio-studio">
          <div className="audio-panel">
            <div className="mb-5 flex items-center gap-3">
              <span className="overview-icon"><Music className="h-4 w-4" /></span>
              <div>
                <p className="text-sm font-semibold text-cosmic-blue">Choose a chapter</p>
                <p className="mt-1 text-xs text-soft-gold">18 chapters of study</p>
              </div>
            </div>
            <div className="audio-chapter-grid">
              {Array.from({ length: 18 }, (_, index) => index + 1).map((chapter) => (
                <button
                  key={chapter}
                  type="button"
                  onClick={() => handleChapterChange(chapter)}
                  className={`audio-choice ${selectedChapter === chapter ? 'audio-choice-active' : ''}`}
                >
                  {String(chapter).padStart(2, '0')}
                </button>
              ))}
            </div>
          </div>

          <div className="audio-panel">
            <div className="mb-5">
              <p className="text-sm font-semibold text-cosmic-blue">Choose a verse</p>
              <p className="mt-1 text-xs text-soft-gold">Chapter {selectedChapter}</p>
            </div>
            <div className="audio-verse-grid">
              {chapterData?.shlokas?.map((shloka, index) => {
                const verse = index + 1;
                return (
                  <button
                    key={shloka.shloka_number}
                    type="button"
                    onClick={() => setSelectedVerse(verse)}
                    className={`audio-choice ${selectedVerse === verse ? 'audio-choice-active' : ''}`}
                  >
                    {String(verse).padStart(2, '0')}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="audio-selection">
            <p className="section-kicker mb-4">Ready to hear</p>
            <p className="font-heading text-3xl text-paper">{selectedChapter}.{selectedVerse}</p>
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-paper/65">
              {chapterData?.name || chapterData?.chapter_name}
            </p>
            <button type="button" onClick={handlePlayVerse} className="audio-play-button mt-8">
              <Play className="h-4 w-4 fill-current" />
              Play recitation
            </button>
          </div>
        </section>

        {currentShloka && (
          <motion.section
            className="audio-verse mt-12"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="mb-8 flex items-center gap-3">
              <Headphones className="h-4 w-4 text-golden-amber" />
              <p className="section-kicker">Current verse</p>
            </div>
            <p className="font-sanskrit text-2xl leading-[2.1] text-cosmic-blue sm:text-3xl">
              {currentShloka.sanskrit_text}
            </p>
            <p className="mt-5 text-sm italic leading-7 text-soft-gold">{currentShloka.transliteration}</p>
            <div className="mt-8 border-t border-line pt-7">
              <p className="text-base leading-8 text-cosmic-blue">{currentShloka.meaning}</p>
            </div>
          </motion.section>
        )}

        <section className="mt-12 grid gap-3 md:grid-cols-3">
          <AudioFeature icon={Volume2} title="Clear recitation" description="Sanskrit audio sourced from Gita Supersite." />
          <AudioFeature icon={Play} title="Stay with the text" description="Use the floating player while you continue reading." />
          <AudioFeature icon={Settings} title="At your own pace" description="Move between chapters and verses without hurry." />
        </section>

        <section className="mt-14 border-t border-line pt-8">
          <p className="section-kicker mb-4">A small ritual</p>
          <div className="grid gap-8 text-sm leading-7 text-soft-gold md:grid-cols-2">
            <div>
              <p className="font-semibold text-cosmic-blue">Before listening</p>
              <p className="mt-2">Choose one verse. Let the room become quiet. Listen once without trying to interpret.</p>
            </div>
            <div>
              <p className="font-semibold text-cosmic-blue">After listening</p>
              <p className="mt-2">Read the translation slowly. Keep one phrase with you as you return to the day.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const AudioFeature = ({ icon: Icon, title, description }) => (
  <div className="audio-feature">
    <span className="emotion-tile-icon"><Icon className="h-4 w-4" strokeWidth={1.7} /></span>
    <p className="mt-5 font-heading text-xl text-cosmic-blue">{title}</p>
    <p className="mt-2 text-sm leading-6 text-soft-gold">{description}</p>
  </div>
);

export default AudioView;
