import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Brain, Heart, Moon, Search, Shield, Sparkles, Star, Sun, Zap } from 'lucide-react';
import EnhancedShlokaCard from './EnhancedShlokaCard';
import useGitaData from '../hooks/useGitaData';
import '../App.css';

const emotionIcons = {
  anger: Zap,
  depression: Moon,
  confusion: Brain,
  fear: Shield,
  anxiety: Heart,
  doubt: Search,
  attachment: Heart,
  greed: Star,
  pride: Sun,
  lust: Heart,
  default: Sparkles,
};

const EmotionSearch = () => {
  const { getAllEmotions, getEmotionBasedVerses, loading } = useGitaData();
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [verses, setVerses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const emotions = getAllEmotions();

  useEffect(() => {
    if (selectedEmotion) setVerses(getEmotionBasedVerses(selectedEmotion.key));
  }, [selectedEmotion, getEmotionBasedVerses]);

  const filteredEmotions = emotions.filter((emotion) =>
    emotion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emotion.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return <div className="flex h-64 items-center justify-center text-soft-gold">Gathering passages...</div>;
  }

  if (selectedEmotion) {
    return (
      <div className="reading-shell px-5 py-10 lg:px-10 lg:py-14 xl:px-16">
        <div className="mx-auto max-w-5xl">
          <button
            type="button"
            onClick={() => setSelectedEmotion(null)}
            className="mb-12 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-soft-gold transition hover:text-golden-amber"
          >
            <ArrowLeft className="h-4 w-4" />
            All subjects
          </button>
          <header className="mb-12 flex flex-col justify-between gap-5 border-b border-line pb-8 sm:flex-row sm:items-end">
            <div>
              <p className="section-kicker mb-4">Selected subject</p>
              <h1 className="font-heading text-4xl text-cosmic-blue sm:text-5xl">{selectedEmotion.name}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-soft-gold">{selectedEmotion.description}</p>
            </div>
            <p className="text-xs uppercase tracking-[0.14em] text-soft-gold">
              {verses.length} passage{verses.length === 1 ? '' : 's'}
            </p>
          </header>

          <div className="space-y-8">
            <AnimatePresence>
              {verses.map((verse, index) => (
                <Motion.div
                  key={`${verse.chapter}-${verse.shloka_number}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                >
                  <EnhancedShlokaCard shloka={verse} chapterNumber={verse.chapter} showChapterInfo />
                </Motion.div>
              ))}
            </AnimatePresence>
          </div>

          {verses.length === 0 && (
            <div className="border-l border-golden-amber py-2 pl-5 text-sm text-soft-gold">
              No passages are mapped to this feeling yet.
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="reading-shell px-5 py-10 lg:px-10 lg:py-14 xl:px-16">
      <div className="mx-auto max-w-5xl">
        <header className="mb-12 max-w-2xl">
          <p className="section-kicker mb-4">Guidance by subject</p>
          <h1 className="font-heading text-4xl text-cosmic-blue sm:text-5xl">Find a relevant passage.</h1>
          <p className="mt-5 text-base leading-8 text-soft-gold">
            Browse passages associated with common emotions, questions, and life challenges.
          </p>
        </header>

        <label className="search-field mb-10 block max-w-xl">
          <Search className="h-4 w-4 shrink-0 text-golden-amber" />
          <input
            type="search"
            placeholder="Search fear, doubt, loneliness..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            aria-label="Search emotions and challenges"
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEmotions.map((emotion, index) => {
            const Icon = emotionIcons[emotion.key] || emotionIcons.default;
            return (
              <Motion.button
                key={emotion.key}
                type="button"
                className="emotion-tile text-left"
                onClick={() => setSelectedEmotion(emotion)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.035 }}
                whileHover={{ y: -2 }}
              >
                <span className="emotion-tile-icon"><Icon className="h-4 w-4" strokeWidth={1.7} /></span>
                <span className="mt-5 block font-heading text-xl text-cosmic-blue">{emotion.name}</span>
                <span className="mt-2 block text-sm leading-6 text-soft-gold">{emotion.description}</span>
                <span className="mt-5 flex items-center justify-between text-[0.68rem] uppercase tracking-[0.14em] text-golden-amber">
                  <span>{emotion.count} passage{emotion.count === 1 ? '' : 's'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Motion.button>
            );
          })}
        </div>

        {filteredEmotions.length === 0 && (
          <div className="border-l border-golden-amber py-2 pl-5 text-sm text-soft-gold">
            No feelings matched “{searchTerm}”.
          </div>
        )}
      </div>
    </div>
  );
};

export default EmotionSearch;
