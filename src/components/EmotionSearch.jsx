import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, Brain, Zap, Shield, Sun, Moon, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import EnhancedShlokaCard from './EnhancedShlokaCard';
import useGitaData from '../hooks/useGitaData';
import '../App.css';

const EmotionSearch = () => {
  const { getAllEmotions, getEmotionBasedVerses, loading } = useGitaData();
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [verses, setVerses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const emotions = getAllEmotions();

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
    default: Heart
  };

  const emotionColors = {
    anger: 'bg-chakra-red/20 text-chakra-red border-chakra-red/30',
    depression: 'bg-chakra-indigo/20 text-chakra-indigo border-chakra-indigo/30',
    confusion: 'bg-chakra-violet/20 text-chakra-violet border-chakra-violet/30',
    fear: 'bg-chakra-blue/20 text-chakra-blue border-chakra-blue/30',
    anxiety: 'bg-chakra-green/20 text-chakra-green border-chakra-green/30',
    doubt: 'bg-chakra-yellow/20 text-chakra-yellow border-chakra-yellow/30',
    attachment: 'bg-chakra-orange/20 text-chakra-orange border-chakra-orange/30',
    default: 'bg-golden-amber/20 text-golden-amber border-golden-amber/30'
  };

  useEffect(() => {
    if (selectedEmotion) {
      const emotionVerses = getEmotionBasedVerses(selectedEmotion.key);
      setVerses(emotionVerses);
    }
  }, [selectedEmotion, getEmotionBasedVerses]);

  const filteredEmotions = emotions.filter(emotion =>
    emotion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emotion.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEmotionSelect = (emotion) => {
    setSelectedEmotion(emotion);
  };

  const getEmotionColor = (emotionKey) => {
    return emotionColors[emotionKey] || emotionColors.default;
  };

  const getEmotionIcon = (emotionKey) => {
    return emotionIcons[emotionKey] || emotionIcons.default;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-golden-amber">Loading emotions...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="font-heading text-4xl text-golden-amber text-glow mb-4">
          Life Guidance
        </h1>
        <p className="font-body text-xl text-soft-gold max-w-3xl mx-auto">
          Find verses from the Bhagavad Gita that address your emotions and life challenges. 
          Let ancient wisdom guide you through modern struggles.
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-8"
      >
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-golden-amber w-5 h-5" />
          <input
            type="text"
            placeholder="Search emotions or challenges..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-cosmic-blue/50 border border-golden-amber/30 rounded-full text-white placeholder-soft-gold focus:outline-none focus:border-golden-amber focus:ring-2 focus:ring-golden-amber/20"
          />
        </div>
      </motion.div>

      {!selectedEmotion ? (
        <>
          {/* Emotion Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8"
          >
            {filteredEmotions.map((emotion, index) => {
              const IconComponent = getEmotionIcon(emotion.key);
              return (
                <motion.div
                  key={emotion.key}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card
                    className={`cursor-pointer divine-transition border-2 ${getEmotionColor(emotion.key)} hover:shadow-lg`}
                    onClick={() => handleEmotionSelect(emotion)}
                  >
                    <CardContent className="p-4 text-center">
                      <IconComponent className="w-8 h-8 mx-auto mb-3" />
                      <h3 className="font-heading text-lg mb-2">{emotion.name}</h3>
                      <p className="text-sm opacity-80 mb-2">{emotion.description}</p>
                      <div className="text-xs opacity-60">
                        {emotion.count} verse{emotion.count !== 1 ? 's' : ''}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {filteredEmotions.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-soft-gold text-lg">
                No emotions found matching "{searchTerm}"
              </p>
            </motion.div>
          )}
        </>
      ) : (
        <>
          {/* Selected Emotion Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="ghost"
                onClick={() => setSelectedEmotion(null)}
                className="text-golden-amber hover:text-sacred-saffron"
              >
                ← Back to Emotions
              </Button>
              
              <div className="text-center">
                <h2 className="font-heading text-3xl text-golden-amber mb-2">
                  {selectedEmotion.name}
                </h2>
                <p className="text-soft-gold">{selectedEmotion.description}</p>
              </div>
              
              <div className="text-right">
                <span className="text-sm text-soft-gold">
                  {verses.length} verse{verses.length !== 1 ? 's' : ''} found
                </span>
              </div>
            </div>
          </motion.div>

          {/* Verses */}
          <AnimatePresence>
            <div className="space-y-6">
              {verses.map((verse, index) => (
                <motion.div
                  key={`${verse.chapter}-${verse.shloka_number}`}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <EnhancedShlokaCard
                    shloka={verse}
                    chapterNumber={verse.chapter}
                    showChapterInfo={true}
                  />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>

          {verses.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-soft-gold text-lg">
                No verses found for this emotion.
              </p>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default EmotionSearch;

