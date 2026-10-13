import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { BookOpen, Heart, Pause, Play, Plus, Share2 } from 'lucide-react';
import { getViewHref } from '../lib/viewUrls';
import { isBookmarked, toggleBookmark } from '../lib/bookmarks';
import '../App.css';

const EnhancedShlokaCard = ({
  shloka,
  chapterNumber,
  onAudioPlay,
  isPlaying = false,
  verseNavigation,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBookmarkedState, setIsBookmarkedState] = useState(() => (
    shloka ? isBookmarked(chapterNumber, shloka.shloka_number) : false
  ));
  const [shareStatus, setShareStatus] = useState('idle');
  const shlokaNumber = shloka?.shloka_number;

  useEffect(() => {
    if (!shlokaNumber) return;

    setIsBookmarkedState(isBookmarked(chapterNumber, shlokaNumber));
    setShareStatus('idle');
  }, [chapterNumber, shlokaNumber]);

  useEffect(() => {
    if (shareStatus === 'idle') return undefined;

    const timeout = window.setTimeout(() => setShareStatus('idle'), 3500);
    return () => window.clearTimeout(timeout);
  }, [shareStatus]);

  if (!shloka) return null;

  const handleBookmark = () => {
    setIsBookmarkedState(toggleBookmark(chapterNumber, shloka.shloka_number));
  };

  const handleShare = async () => {
    const shareUrl = new URL(
      getViewHref('chapters', chapterNumber, shloka.shloka_number),
      window.location.origin,
    ).toString();
    const shareText = `${shloka.sanskrit_text}\n\n"${shloka.meaning}"\n\n- Bhagavad Gita ${chapterNumber}.${shloka.shloka_number}`;
    const clipboardText = `${shareText}\n\n${shareUrl}`;

    setShareStatus('sharing');

    try {
      if (navigator.share) {
        await navigator.share({
          title: `Bhagavad Gita ${chapterNumber}.${shloka.shloka_number}`,
          text: shareText,
          url: shareUrl,
        });
        setShareStatus('shared');
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(clipboardText);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = clipboardText;
        textArea.setAttribute('readonly', '');
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        const copied = document.execCommand('copy');
        document.body.removeChild(textArea);
        if (!copied) throw new Error('Clipboard copy was not available.');
      }

      setShareStatus('copied');
    } catch (error) {
      if (error.name === 'AbortError') {
        setShareStatus('idle');
      } else {
        setShareStatus('error');
      }
    }
  };

  return (
    <Motion.article
      className="shloka-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <header className="shloka-card-header">
        <div>
          <p className="section-kicker mb-2">Bhagavad Gita {chapterNumber}.{shloka.shloka_number}</p>
          <p className="text-xs uppercase tracking-[0.14em] text-soft-gold">Sanskrit text and translation</p>
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
            className={`icon-button ${isBookmarkedState ? 'icon-button-active' : ''}`}
            onClick={handleBookmark}
            title={isBookmarkedState ? 'Remove bookmark' : 'Bookmark this verse'}
            aria-label={isBookmarkedState ? 'Remove bookmark' : 'Bookmark this verse'}
          >
            <Heart className={`h-4 w-4 ${isBookmarkedState ? 'fill-current' : ''}`} />
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
        {shareStatus !== 'idle' && (
          <p className="shloka-share-feedback" role="status" aria-live="polite">
            {shareStatus === 'sharing' && 'Opening share options…'}
            {shareStatus === 'shared' && 'Share options opened.'}
            {shareStatus === 'copied' && 'Verse and link copied.'}
            {shareStatus === 'error' && 'Could not share this verse.'}
          </p>
        )}
        {verseNavigation && (
          <div className="shloka-card-navigation">
            {verseNavigation}
          </div>
        )}
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
              <Motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 14 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="overflow-hidden"
              >
                <p className="border-l border-golden-amber pl-4 text-sm leading-7 text-soft-gold">
                  {shloka.life_application}
                </p>
              </Motion.div>
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
    </Motion.article>
  );
};

export default EnhancedShlokaCard;
