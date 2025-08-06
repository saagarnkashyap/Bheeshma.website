import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, BookOpen, Heart, Share2, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import '../App.css';

const EnhancedShlokaCard = ({ 
  shloka, 
  chapterNumber, 
  onAudioPlay, 
  isPlaying = false,
  showChapterInfo = true 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  if (!shloka) return null;

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    const bookmarks = JSON.parse(localStorage.getItem('bheeshma_bookmarks') || '[]');
    const bookmarkKey = `${chapterNumber}-${shloka.shloka_number}`;
    
    if (isBookmarked) {
      const filtered = bookmarks.filter(b => b !== bookmarkKey);
      localStorage.setItem('bheeshma_bookmarks', JSON.stringify(filtered));
    } else {
      bookmarks.push(bookmarkKey);
      localStorage.setItem('bheeshma_bookmarks', JSON.stringify(bookmarks));
    }
  };

  const handleShare = async () => {
    const shareText = `${shloka.sanskrit_text}\n\n"${shloka.meaning}"\n\n- Bhagavad Gita ${chapterNumber}.${shloka.shloka_number}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Bhagavad Gita ${chapterNumber}.${shloka.shloka_number}`,
          text: shareText,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(shareText);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.6, 
        ease: "easeOut",
        staggerChildren: 0.1
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="mb-8"
    >
      <Card className="verse-card divine-transition overflow-hidden relative">
        {/* Floating sparkles on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none"
            >
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-golden-amber"
                  initial={{ 
                    x: Math.random() * 100 + '%', 
                    y: Math.random() * 100 + '%',
                    scale: 0,
                    rotate: 0
                  }}
                  animate={{ 
                    scale: [0, 1, 0],
                    rotate: 360,
                    transition: { 
                      duration: 2, 
                      delay: i * 0.2,
                      repeat: Infinity,
                      repeatDelay: 1
                    }
                  }}
                >
                  <Sparkles className="w-4 h-4" />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <CardHeader className="pb-4">
          <motion.div 
            className="flex items-center justify-between"
            variants={contentVariants}
          >
            <div className="flex items-center space-x-3">
              {showChapterInfo && (
                <motion.div 
                  className="bg-golden-amber text-cosmic-blue px-3 py-1 rounded-full text-sm font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Chapter {chapterNumber}
                </motion.div>
              )}
              <motion.div 
                className="bg-sacred-saffron text-white px-3 py-1 rounded-full text-sm font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Verse {shloka.shloka_number}
              </motion.div>
            </div>
            
            <div className="flex items-center space-x-2">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onAudioPlay && onAudioPlay(chapterNumber, shloka.shloka_number)}
                  className="text-golden-amber hover:text-sacred-saffron"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBookmark}
                  className={`${isBookmarked ? 'text-chakra-red' : 'text-golden-amber'} hover:text-sacred-saffron`}
                >
                  <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="text-golden-amber hover:text-sacred-saffron"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Sanskrit Text */}
          <motion.div 
            className="text-center"
            variants={contentVariants}
          >
            <motion.p 
              className="font-sanskrit text-2xl leading-relaxed text-golden-amber mb-2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {shloka.sanskrit_text}
            </motion.p>
            <motion.p 
              className="font-body text-sm text-soft-gold italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {shloka.transliteration}
            </motion.p>
          </motion.div>

          {/* Meaning */}
          <motion.div 
            className="border-t border-golden-amber/20 pt-4"
            variants={contentVariants}
          >
            <h4 className="font-heading text-lg text-golden-amber mb-3 flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Meaning
            </h4>
            <p className="font-body text-white leading-relaxed">
              {shloka.meaning}
            </p>
          </motion.div>

          {/* Life Application - Expandable */}
          {shloka.life_application && (
            <motion.div 
              className="border-t border-golden-amber/20 pt-4"
              variants={contentVariants}
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="ghost"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="font-heading text-lg text-sacred-saffron hover:text-golden-amber mb-3 p-0 h-auto"
                >
                  Life Application {isExpanded ? '−' : '+'}
                </Button>
              </motion.div>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="glass-morphism p-4 rounded-lg overflow-hidden"
                  >
                    <p className="font-body text-soft-gold leading-relaxed">
                      {shloka.life_application}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Keywords */}
          {shloka.keywords && shloka.keywords.length > 0 && (
            <motion.div 
              className="border-t border-golden-amber/20 pt-4"
              variants={contentVariants}
            >
              <h4 className="font-heading text-sm text-golden-amber mb-2">Key Concepts</h4>
              <div className="flex flex-wrap gap-2">
                {shloka.keywords.map((keyword, index) => (
                  <motion.span
                    key={index}
                    className="bg-sacred-saffron/20 text-sacred-saffron px-2 py-1 rounded-full text-xs font-medium"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(231, 111, 81, 0.3)' }}
                  >
                    {keyword}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Problems Addressed */}
          {shloka.addresses_problems && shloka.addresses_problems.length > 0 && (
            <motion.div 
              className="border-t border-golden-amber/20 pt-4"
              variants={contentVariants}
            >
              <h4 className="font-heading text-sm text-golden-amber mb-2">Addresses</h4>
              <div className="flex flex-wrap gap-2">
                {shloka.addresses_problems.map((problem, index) => (
                  <motion.span
                    key={index}
                    className="bg-chakra-green/20 text-chakra-green px-2 py-1 rounded-full text-xs font-medium"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(39, 174, 96, 0.3)' }}
                  >
                    {problem.replace(/_/g, ' ')}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EnhancedShlokaCard;

