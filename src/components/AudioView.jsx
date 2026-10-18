import React, { useState } from 'react';
import { ChevronDown, Headphones, Music, Play, Settings, Volume2 } from 'lucide-react';
import { motion as Motion } from 'framer-motion';
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
    <div className="reading-shell px-5 py-10 lg:px-10 lg:py-14 xl:px-16">
      <div className="mx-auto max-w-5xl">
        <header className="mb-12 max-w-2xl">
          <p className="section-kicker mb-4">Audio reference</p>
          <h1 className="font-heading text-4xl text-cosmic-blue sm:text-5xl">Sanskrit recitation.</h1>
          <p className="mt-5 text-base leading-8 text-soft-gold">
            Select a chapter and verse to hear its Sanskrit recitation.
          </p>
        </header>

        <section className="audio-studio">
          <div className="audio-controls-panel">
            <div className="audio-studio-intro">
              <span className="overview-icon"><Music className="h-4 w-4" /></span>
              <div>
                <p className="text-sm font-semibold text-cosmic-blue">Find a passage</p>
                <p className="mt-1 text-xs text-soft-gold">Choose a chapter, then a verse.</p>
              </div>
            </div>

            <div className="audio-select-grid">
              <label className="audio-select-field">
                <span className="audio-select-label">
                  <span className="audio-select-step">01</span>
                  <span>Chapter</span>
                </span>
                <span className="audio-select-control-wrap">
                  <select
                    className="audio-select-control"
                    value={selectedChapter}
                    onChange={(event) => handleChapterChange(Number(event.target.value))}
                    aria-label="Choose a chapter"
                  >
                    {Array.from({ length: 18 }, (_, index) => index + 1).map((chapter) => {
                      const optionChapter = getChapterData(chapter);
                      return (
                        <option key={chapter} value={chapter}>
                          {String(chapter).padStart(2, '0')} · {optionChapter?.name || `Chapter ${chapter}`}
                        </option>
                      );
                    })}
                  </select>
                  <ChevronDown className="audio-select-chevron" aria-hidden="true" />
                </span>
                <span className="audio-select-hint">{chapterData?.name}</span>
              </label>

              <label className="audio-select-field">
                <span className="audio-select-label">
                  <span className="audio-select-step">02</span>
                  <span>Verse</span>
                </span>
                <span className="audio-select-control-wrap">
                  <select
                    className="audio-select-control"
                    value={selectedVerse}
                    onChange={(event) => setSelectedVerse(Number(event.target.value))}
                    aria-label="Choose a verse"
                  >
                    {chapterData?.shlokas?.map((shloka, index) => {
                      const verse = index + 1;
                      return (
                        <option key={shloka.shloka_number} value={verse}>
                          {String(verse).padStart(2, '0')} · Verse {verse}
                        </option>
                      );
                    })}
                  </select>
                  <ChevronDown className="audio-select-chevron" aria-hidden="true" />
                </span>
                <span className="audio-select-hint">{chapterData?.shlokas?.length || 0} verses available</span>
              </label>
            </div>
          </div>

          <div className="audio-selection">
            <p className="section-kicker">Ready to hear</p>
            <div className="audio-selection-reference">
              <p className="audio-selection-reference-number">{String(selectedChapter).padStart(2, '0')}.{String(selectedVerse).padStart(2, '0')}</p>
              <p className="audio-selection-reference-label">Selected passage</p>
            </div>
            <p className="audio-selection-chapter">
              {chapterData?.name || chapterData?.chapter_name}
            </p>
            <button type="button" onClick={handlePlayVerse} className="audio-play-button">
              <Play className="h-4 w-4 fill-current" />
              Play recitation
            </button>
          </div>
        </section>

        {currentShloka && (
          <Motion.section
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
          </Motion.section>
        )}

        <section className="mt-12 grid gap-3 md:grid-cols-3">
          <AudioFeature icon={Volume2} title="Clear recitation" description="Sanskrit audio sourced from Gita Supersite." />
          <AudioFeature icon={Play} title="Stay with the text" description="Use the floating player while you continue reading." />
          <AudioFeature icon={Settings} title="At your own pace" description="Move between chapters and verses without hurry." />
        </section>

        <section className="mt-14 border-t border-line pt-8">
          <p className="section-kicker mb-4">Listening notes</p>
          <div className="grid gap-8 text-sm leading-7 text-soft-gold md:grid-cols-2">
            <div>
              <p className="font-semibold text-cosmic-blue">For reading</p>
              <p className="mt-2">Play a verse while reading the Sanskrit text and transliteration.</p>
            </div>
            <div>
              <p className="font-semibold text-cosmic-blue">For pronunciation</p>
              <p className="mt-2">Repeat the recitation to become familiar with the verse rhythm and sound.</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

const AudioFeature = ({ icon, title, description }) => (
  <div className="audio-feature">
    <span className="emotion-tile-icon">{React.createElement(icon, { className: 'h-4 w-4', strokeWidth: 1.7 })}</span>
    <p className="mt-5 font-heading text-xl text-cosmic-blue">{title}</p>
    <p className="mt-2 text-sm leading-6 text-soft-gold">{description}</p>
  </div>
);

export default AudioView;
