import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Heart, Pause, Play, Plus, Share2 } from 'lucide-react';
import '../App.css';

const EnhancedShlokaCard = ({ shloka, chapterNumber, onAudioPlay, isPlaying = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  if (!shloka) return null;

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    const bookmarks = JSON.parse(localStorage.getItem('bheeshma_bookmarks') || '[]');
    const bookmarkKey = `${chapterNumber}-${shloka.shloka_number}`;
    const nextBookmarks = isBookmarked
      ? bookmarks.filter((bookmark) => bookmark !== bookmarkKey)
      : [...bookmarks, bookmarkKey];
    localStorage.setItem('bheeshma_bookmarks', JSON.stringify(nextBookmarks));
  };

  const handleShare = async () => {
    const shareText = `${shloka.sanskrit_text}\n\n"${shloka.meaning}"\n\n- Bhagavad Gita ${chapterNumber}.${shloka.shloka_number}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Bhagavad Gita ${chapterNumber}.${shloka.shloka_number}`,
          text: shareText,
        });
      } catch (error) {
        if (error.name !== 'AbortError') console.log('Error sharing:', error);
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareText);
    }
  };

  return (
    <motion.article
      className="shloka-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <header className="shloka-card-header">
        <div>
          <p className="section-kicker mb-2">Bhagavad Gita {chapterNumber}.{shloka.shloka_number}</p>
          <p className="text-xs uppercase tracking-[0.14em] text-soft-gold">A verse to sit with</p>
        </div>
        <div className="shloka-actions">
          <button
            type="button"
            className="icon-button"
            onClick={() => onAudioPlay && onAudioPlay(chapterNumber, shloka.shloka_number)}
            title="Listen to this verse"
            aria-label="Listen to this verse"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <button
            type="button"
            className={`icon-button ${isBookmarked ? 'icon-button-active' : ''}`}
            onClick={handleBookmark}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark this verse'}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this verse'}
          >
            <Heart className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
          <button
            type="button"
            className="icon-button"
            onClick={handleShare}
            title="Share this verse"
            aria-label="Share this verse"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="shloka-text">
        <p className="font-sanskrit text-2xl leading-[2.1] text-cosmic-blue sm:text-3xl">
          {shloka.sanskrit_text}
        </p>
        <p className="mt-5 text-sm italic leading-7 text-soft-gold">{shloka.transliteration}</p>
      </div>

      <div className="shloka-section">
        <div className="shloka-section-heading">
          <BookOpen className="h-4 w-4" />
          <span>Meaning</span>
        </div>
        <p className="text-base leading-8 text-cosmic-blue">{shloka.meaning}</p>
      </div>

      {shloka.life_application && (
        <div className="shloka-section">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="shloka-toggle"
            aria-expanded={isExpanded}
          >
            <span>Life application</span>
            {isExpanded ? <span className="text-lg leading-none">−</span> : <Plus className="h-4 w-4" />}
          </button>
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 14 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="overflow-hidden"
              >
                <p className="border-l border-golden-amber pl-4 text-sm leading-7 text-soft-gold">
                  {shloka.life_application}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {(shloka.keywords?.length > 0 || shloka.addresses_problems?.length > 0) && (
        <footer className="shloka-tags-footer">
          {shloka.keywords?.map((keyword) => (
            <span className="shloka-tag" key={keyword}>{keyword}</span>
          ))}
          {shloka.addresses_problems?.map((problem) => (
            <span className="shloka-tag shloka-tag-muted" key={problem}>{problem.replace(/_/g, ' ')}</span>
          ))}
        </footer>
      )}
    </motion.article>
  );
};

export default EnhancedShlokaCard;
