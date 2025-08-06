import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from './components/Navigation';
import ChapterExplorer from './components/ChapterExplorer';
import ChakraLoader from './components/ChakraLoader';
import FloatingParticles from './components/FloatingParticles';
import ModernDivineHeader from './components/ModernDivineHeader';
import SacredGeometryBackground from './components/SacredGeometryBackground';
import ScrollAnimations from './components/ScrollAnimations';
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
  
  // Floating Audio Player State
  const [audioPlayerVisible, setAudioPlayerVisible] = useState(false);
  const [audioCurrentChapter, setAudioCurrentChapter] = useState(null);
  const [audioCurrentVerse, setAudioCurrentVerse] = useState(null);
  
  const { loading, error } = useGitaData();

  // Audio Player Control Functions
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
    // Logic to go to next verse
    if (audioCurrentVerse < 47) { // Assuming max verses per chapter
      setAudioCurrentVerse(audioCurrentVerse + 1);
    } else if (audioCurrentChapter < 18) {
      setAudioCurrentChapter(audioCurrentChapter + 1);
      setAudioCurrentVerse(1);
    }
  };

  const handleAudioPrevious = () => {
    // Logic to go to previous verse
    if (audioCurrentVerse > 1) {
      setAudioCurrentVerse(audioCurrentVerse - 1);
    } else if (audioCurrentChapter > 1) {
      setAudioCurrentChapter(audioCurrentChapter - 1);
      setAudioCurrentVerse(47); // Assuming max verses, should be dynamic
    }
  };

  useEffect(() => {
    // Simulate initial loading with divine quotes
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isInitialLoading) {
    return <ChakraLoader isLoading={true} message="Loading Divine Wisdom..." />;
  }

  if (error) {
    return (
      <div className="divine-bg min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-heading text-sacred-saffron mb-4">
            Error Loading Gita Data
          </h2>
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
        return <EmotionsView />;
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
      <div className="divine-bg min-h-screen sacred-pattern relative">
        <FloatingParticles />
        <ScrollAnimations />
        
        <Navigation
          currentView={currentView}
          onViewChange={setCurrentView}
          currentChapter={currentChapter}
          onChapterChange={setCurrentChapter}
        />
        
        <main className="lg:ml-80 min-h-screen relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {renderMainContent()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Floating Chatbot */}
        <motion.div 
          className="fixed bottom-6 right-6 z-30"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <button
            onClick={() => setCurrentView('chat')}
            className="bg-golden-amber text-cosmic-blue p-4 rounded-full shadow-lg hover:bg-sacred-saffron divine-transition chakra-glow"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3.04 1.05 4.35L1 22l5.65-2.05C8.96 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.4 0-2.76-.3-4.05-.85L6 20l.85-1.95C6.3 16.76 6 15.4 6 14c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z"/>
            </svg>
          </button>
        </motion.div>

        {/* Floating Audio Player */}
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

// Home View Component
const HomeView = ({ onViewChange, onChapterChange }) => {
  return (
    <div className="relative">
      <SacredGeometryBackground variant="geometry" opacity={0.08} />
      <div className="relative z-10 p-6 lg:p-12">
        <div className="max-w-6xl mx-auto">
          {/* Modern Divine Header */}
          <ModernDivineHeader 
            title="Bheeshma"
            subtitle="Experience the divine wisdom of the Bhagavad Gita in a modern, interactive format. Discover timeless teachings that guide you through life's challenges."
            backgroundImage="cosmic"
            height="h-96"
          />
          
          {/* Action Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <motion.button
              onClick={() => onViewChange('chapters')}
              className="emotion-tag text-lg px-8 py-4 rounded-full"
              whileHover={{ scale: 1.05, boxShadow: "0 8px 32px rgba(244, 162, 97, 0.4)" }}
              whileTap={{ scale: 0.95 }}
            >
              Start Reading
            </motion.button>
            <motion.button
              onClick={() => onViewChange('emotions')}
              className="bg-sacred-saffron text-white px-8 py-4 rounded-full font-semibold hover:bg-golden-amber hover:text-cosmic-blue divine-transition"
              whileHover={{ scale: 1.05, boxShadow: "0 8px 32px rgba(231, 111, 81, 0.4)" }}
              whileTap={{ scale: 0.95 }}
            >
              Find Life Guidance
            </motion.button>
          </motion.div>

          {/* Features Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4, staggerChildren: 0.2 }}
          >
            <FeatureCard
              title="18 Sacred Chapters"
              description="Explore all chapters with Sanskrit verses, transliterations, and profound meanings"
              icon="📖"
              onClick={() => onViewChange('chapters')}
              delay={0}
            />
            <FeatureCard
              title="Life Guidance"
              description="Find verses that address your emotions and life challenges"
              icon="💝"
              onClick={() => onViewChange('emotions')}
              delay={0.2}
            />
            <FeatureCard
              title="Audio Experience"
              description="Listen to beautiful Sanskrit recitations while you read"
              icon="🎵"
              onClick={() => onViewChange('audio')}
              delay={0.4}
            />
          </motion.div>

          {/* Quick Chapter Access */}
          <motion.div 
            className="glass-morphism p-8 rounded-2xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
          >
            <h2 className="font-heading text-2xl text-golden-amber mb-6 text-center">
              Quick Chapter Access
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-9 gap-3">
              {Array.from({ length: 18 }, (_, i) => i + 1).map((chapterNum) => (
                <motion.button
                  key={chapterNum}
                  onClick={() => {
                    onChapterChange(chapterNum);
                    onViewChange('chapters');
                  }}
                  className="aspect-square bg-gradient-to-br from-cosmic-blue to-deep-purple border border-golden-amber/30 rounded-xl text-golden-amber font-semibold hover:border-golden-amber hover:bg-golden-amber hover:text-cosmic-blue divine-transition flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {chapterNum}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ title, description, icon, onClick, delay = 0 }) => {
  return (
    <motion.div 
      className="verse-card p-6 cursor-pointer"
      onClick={onClick}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 1.6 + delay, ease: "easeOut" }}
      whileHover={{ 
        y: -8, 
        scale: 1.05,
        boxShadow: "0 12px 40px rgba(244, 162, 97, 0.2)",
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div 
        className="text-4xl mb-4 text-center"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, delay: 1.8 + delay, ease: "easeOut" }}
      >
        {icon}
      </motion.div>
      <motion.h3 
        className="font-heading text-xl text-golden-amber mb-3 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 2.0 + delay }}
      >
        {title}
      </motion.h3>
      <motion.p 
        className="font-body text-soft-gold text-center leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 2.2 + delay }}
      >
        {description}
      </motion.p>
    </motion.div>
  );
};

// Placeholder Views
const EmotionsView = () => <EmotionSearch />;

const AudioViewComponent = ({ onPlayAudio }) => <AudioView onPlayAudio={onPlayAudio} />;

const ChatView = () => (
  <div className="p-6 lg:p-12">
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="font-heading text-3xl text-golden-amber mb-6">Chat with Bheeshma</h2>
      <div className="glass-morphism p-8 rounded-2xl">
        <div className="text-6xl text-golden-amber mb-4">🕉️</div>
        <p className="text-soft-gold mb-6">
          Divine AI chatbot coming soon! This will be your spiritual guide to help you understand 
          the deeper meanings of the Bhagavad Gita and apply its wisdom to your daily life.
        </p>
        <div className="text-sm text-golden-amber">
          "Ask and you shall receive, seek and you shall find"
        </div>
      </div>
    </div>
  </div>
);

export default App;

