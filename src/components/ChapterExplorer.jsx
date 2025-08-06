import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Clock, Target, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import EnhancedShlokaCard from './EnhancedShlokaCard';
import useGitaData from '../hooks/useGitaData';
import '../App.css';

const ChapterExplorer = ({ chapterNumber, onChapterChange, onPlayAudio }) => {
  const { getChapterData, loading } = useGitaData();
  const [currentShlokaIndex, setCurrentShlokaIndex] = useState(0);
  const [showChapterInfo, setShowChapterInfo] = useState(true);

  const chapterData = getChapterData(chapterNumber);

  useEffect(() => {
    setCurrentShlokaIndex(0);
    setShowChapterInfo(true);
  }, [chapterNumber]);

  const handleAudioPlay = (chap, verse) => {
    if (onPlayAudio) {
      onPlayAudio(chap, verse);
    }
  };

  if (loading || !chapterData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-golden-amber">Loading chapter...</div>
      </div>
    );
  }

  const currentShloka = chapterData.shlokas[currentShlokaIndex];
  const totalShlokas = chapterData.shlokas.length;

  const handlePreviousShloka = () => {
    if (currentShlokaIndex > 0) {
      setCurrentShlokaIndex(currentShlokaIndex - 1);
    }
  };

  const handleNextShloka = () => {
    if (currentShlokaIndex < totalShlokas - 1) {
      setCurrentShlokaIndex(currentShlokaIndex + 1);
    }
  };

  const handlePreviousChapter = () => {
    if (chapterNumber > 1) {
      onChapterChange(chapterNumber - 1);
    }
  };

  const handleNextChapter = () => {
    if (chapterNumber < 18) {
      onChapterChange(chapterNumber + 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Chapter Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-4 space-y-4 md:space-y-0">
          <Button
            variant="ghost"
            onClick={handlePreviousChapter}
            disabled={chapterNumber <= 1}
            className="text-golden-amber hover:text-sacred-saffron disabled:opacity-50 order-2 md:order-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous Chapter
          </Button>
          
          <div className="text-center order-1 md:order-2">
            <h1 className="font-heading text-3xl text-golden-amber text-glow mb-2">
              Chapter {chapterData.number}
            </h1>
            <h2 className="font-sanskrit text-xl text-soft-gold">
              {chapterData.name}
            </h2>
          </div>
          
          <Button
            variant="ghost"
            onClick={handleNextChapter}
            disabled={chapterNumber >= 18}
            className="text-golden-amber hover:text-sacred-saffron disabled:opacity-50 order-3"
          >
            Next Chapter
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Chapter Info Toggle */}
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => setShowChapterInfo(!showChapterInfo)}
            className="text-sacred-saffron hover:text-golden-amber"
          >
            {showChapterInfo ? 'Hide' : 'Show'} Chapter Overview
          </Button>
        </div>
      </div>

      {/* Chapter Overview */}
      {showChapterInfo && (
        <Card className="glass-morphism mb-8">
          <CardHeader>
            <CardTitle className="font-heading text-xl text-golden-amber flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Chapter Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary */}
            <div>
              <h3 className="font-heading text-lg text-sacred-saffron mb-3 flex items-center">
                <Target className="w-4 h-4 mr-2" />
                Summary
              </h3>
              <p className="font-body text-white leading-relaxed">
                {chapterData.summary}
              </p>
            </div>

            {/* Main Theme */}
            <div>
              <h3 className="font-heading text-lg text-sacred-saffron mb-3 flex items-center">
                <Lightbulb className="w-4 h-4 mr-2" />
                Main Theme
              </h3>
              <p className="font-body text-white leading-relaxed">
                {chapterData.main_theme}
              </p>
            </div>

            {/* Philosophical Aspects */}
            {chapterData.philosophical_aspects && (
              <div>
                <h3 className="font-heading text-lg text-sacred-saffron mb-3">
                  Philosophical Aspects
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {chapterData.philosophical_aspects.map((aspect, index) => (
                    <div
                      key={index}
                      className="bg-sacred-saffron/10 text-soft-gold px-3 py-2 rounded-lg text-sm"
                    >
                      {aspect}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Life Problems Addressed */}
            {chapterData.life_problems_addressed && (
              <div>
                <h3 className="font-heading text-lg text-sacred-saffron mb-3">
                  Life Problems Addressed
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {chapterData.life_problems_addressed.map((problem, index) => (
                    <div
                      key={index}
                      className="bg-chakra-green/10 text-chakra-green px-3 py-2 rounded-lg text-sm"
                    >
                      {problem}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Yoga Type */}
            {chapterData.yoga_type && (
              <div>
                <h3 className="font-heading text-lg text-sacred-saffron mb-3">
                  Yoga Practice
                </h3>
                <p className="font-body text-white leading-relaxed bg-deep-purple/30 p-4 rounded-lg">
                  {chapterData.yoga_type}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Shloka Navigation */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 space-y-4 md:space-y-0">
        <Button
          variant="ghost"
          onClick={handlePreviousShloka}
          disabled={currentShlokaIndex <= 0}
          className="text-golden-amber hover:text-sacred-saffron disabled:opacity-50 order-2 md:order-1"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous Verse
        </Button>
        
        <div className="text-center order-1 md:order-2">
          <div className="bg-golden-amber text-cosmic-blue px-4 py-2 rounded-full font-semibold">
            Verse {currentShlokaIndex + 1} of {totalShlokas}
          </div>
          <div className="progress-bar mt-2 w-48 mx-auto">
            <div 
              className="h-full bg-gradient-to-r from-chakra-red to-chakra-violet rounded-full transition-all duration-300"
              style={{ width: `${((currentShlokaIndex + 1) / totalShlokas) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <Button
          variant="ghost"
          onClick={handleNextShloka}
          disabled={currentShlokaIndex >= totalShlokas - 1}
          className="text-golden-amber hover:text-sacred-saffron disabled:opacity-50 order-3"
        >
          Next Verse
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Current Shloka */}
      <EnhancedShlokaCard
        shloka={currentShloka}
        chapterNumber={chapterNumber}
        showChapterInfo={false}
        onAudioPlay={handleAudioPlay}
      />

      {/* Quick Navigation */}
      <div className="mt-8 text-center">
        <h3 className="font-heading text-lg text-golden-amber mb-4">Quick Navigation</h3>
        <div className="flex flex-wrap justify-center gap-2 max-h-32 overflow-y-auto">
          {chapterData.shlokas.map((_, index) => (
            <Button
              key={index}
              variant={index === currentShlokaIndex ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrentShlokaIndex(index)}
              className={`w-12 h-8 text-xs ${
                index === currentShlokaIndex 
                  ? 'bg-golden-amber text-cosmic-blue' 
                  : 'text-golden-amber hover:text-sacred-saffron'
              }`}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChapterExplorer;

