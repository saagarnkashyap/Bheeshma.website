import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Music, Headphones, Volume2, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import DivineHeader from './DivineHeader';
import useGitaData from '../hooks/useGitaData';
import '../App.css';

const AudioView = ({ onPlayAudio }) => {
  const { getChapterData, loading } = useGitaData();
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [selectedVerse, setSelectedVerse] = useState(1);
  const [playlistMode, setPlaylistMode] = useState('chapter'); // 'chapter', 'all', 'favorites'

  const chapterData = getChapterData(selectedChapter);
  const currentShloka = chapterData?.shlokas?.[selectedVerse - 1];

  const handlePlayVerse = (chapter, verse) => {
    setSelectedChapter(chapter);
    setSelectedVerse(verse);
    if (onPlayAudio) {
      onPlayAudio(chapter, verse);
    }
  };

  const handleChapterChange = (newChapter) => {
    setSelectedChapter(newChapter);
    setSelectedVerse(1);
  };

  const handleVerseChange = (newVerse) => {
    setSelectedVerse(newVerse);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-golden-amber">Loading audio experience...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <DivineHeader 
        title="Audio Experience"
        subtitle="Immerse yourself in the divine sounds of Sanskrit recitations from the Bhagavad Gita. Let the ancient verses guide your meditation and spiritual practice."
        showOm={true}
      />

      {/* Audio Controls */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="mb-12"
      >
        <Card className="verse-card">
          <CardHeader>
            <CardTitle className="text-golden-amber flex items-center">
              <Music className="w-6 h-6 mr-3" />
              Audio Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Chapter Selection */}
              <div>
                <h4 className="font-heading text-lg text-golden-amber mb-3">Select Chapter</h4>
                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                  {Array.from({ length: 18 }, (_, i) => i + 1).map((chapterNum) => (
                    <motion.button
                      key={chapterNum}
                      onClick={() => handleChapterChange(chapterNum)}
                      className={`p-3 rounded-lg divine-transition text-center font-semibold ${
                        selectedChapter === chapterNum
                          ? 'bg-golden-amber text-cosmic-blue'
                          : 'bg-cosmic-blue/50 hover:bg-golden-amber hover:text-cosmic-blue text-golden-amber'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {chapterNum}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Verse Selection */}
              <div>
                <h4 className="font-heading text-lg text-golden-amber mb-3">
                  Select Verse (Chapter {selectedChapter})
                </h4>
                <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                  {chapterData?.shlokas?.map((_, index) => {
                    const verseNum = index + 1;
                    return (
                      <motion.button
                        key={verseNum}
                        onClick={() => setSelectedVerse(verseNum)}
                        className={`p-2 rounded-lg divine-transition text-center text-sm font-semibold ${
                          selectedVerse === verseNum
                            ? 'bg-sacred-saffron text-white'
                            : 'bg-cosmic-blue/50 hover:bg-sacred-saffron hover:text-white text-soft-gold'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {verseNum}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Current Selection */}
              <div>
                <h4 className="font-heading text-lg text-golden-amber mb-3">Now Playing</h4>
                <div className="glass-morphism p-4 rounded-lg">
                  <div className="text-center mb-4">
                    <div className="text-2xl text-golden-amber mb-2">
                      {selectedChapter}.{selectedVerse}
                    </div>
                    <div className="text-sm text-soft-gold mb-3">
                      {chapterData?.chapter_name}
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handlePlayVerse(selectedChapter, selectedVerse)}
                    className="w-full bg-golden-amber text-cosmic-blue hover:bg-sacred-saffron font-semibold"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Play Audio
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Current Verse Display */}
      {currentShloka && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="mb-12"
        >
          <Card className="verse-card">
            <CardHeader>
              <CardTitle className="text-golden-amber flex items-center">
                <Headphones className="w-6 h-6 mr-3" />
                Current Verse
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <p className="font-sanskrit text-2xl leading-relaxed text-golden-amber mb-4">
                  {currentShloka.sanskrit_text}
                </p>
                <p className="font-body text-sm text-soft-gold italic mb-4">
                  {currentShloka.transliteration}
                </p>
                <p className="font-body text-white leading-relaxed">
                  {currentShloka.meaning}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Audio Features */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.6 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
      >
        <FeatureCard
          icon={<Volume2 className="w-8 h-8" />}
          title="High Quality Audio"
          description="Crystal clear Sanskrit recitations from Gita Supersite"
          color="bg-chakra-blue/20 text-chakra-blue border-chakra-blue/30"
        />
        
        <FeatureCard
          icon={<Play className="w-8 h-8" />}
          title="Continuous Playback"
          description="Auto-play through verses and chapters seamlessly"
          color="bg-chakra-green/20 text-chakra-green border-chakra-green/30"
        />
        
        <FeatureCard
          icon={<Settings className="w-8 h-8" />}
          title="Playback Controls"
          description="Full control with repeat, shuffle, and volume settings"
          color="bg-chakra-orange/20 text-chakra-orange border-chakra-orange/30"
        />
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.8 }}
      >
        <Card className="verse-card">
          <CardContent className="p-6">
            <h3 className="font-heading text-xl text-golden-amber mb-4 text-center">
              How to Use Audio Experience
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-soft-gold">
              <div>
                <h4 className="font-semibold text-golden-amber mb-2">Getting Started</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Select a chapter from the grid above</li>
                  <li>• Choose a specific verse to begin</li>
                  <li>• Click "Play Audio" to start listening</li>
                  <li>• Use the floating player for controls</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-golden-amber mb-2">Audio Features</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Minimize player to continue browsing</li>
                  <li>• Enable autoplay for continuous listening</li>
                  <li>• Download audio files for offline use</li>
                  <li>• Adjust volume and playback speed</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, color }) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className={`verse-card border-2 ${color} hover:shadow-lg divine-transition`}>
        <CardContent className="p-6 text-center">
          <div className="mb-4 flex justify-center">
            {icon}
          </div>
          <h3 className="font-heading text-lg mb-2">{title}</h3>
          <p className="text-sm opacity-80">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AudioView;

