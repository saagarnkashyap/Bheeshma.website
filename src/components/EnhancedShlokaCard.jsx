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
  const [selectedScript, setSelectedScript] = useState('devanagari');
  const [showCommentaries, setShowCommentaries] = useState(false);
  const [isBookmarkedState, setIsBookmarkedState] = useState(() => (
    shloka ? isBookmarked(chapterNumber, shloka.shloka_number) : false
  ));
  const [shareStatus, setShareStatus] = useState('idle');
  const shlokaNumber = shloka?.shloka_number;

  useEffect(() => {
    if (!shlokaNumber) return;

    setIsBookmarkedState(isBookmarked(chapterNumber, shlokaNumber));
    setShareStatus('idle');
    setShowCommentaries(false);
  }, [chapterNumber, shlokaNumber]);

  useEffect(() => {
    if (shareStatus === 'idle') return undefined;

    const timeout = window.setTimeout(() => setShareStatus('idle'), 3500);
    return () => window.clearTimeout(timeout);
  }, [shareStatus]);

  if (!shloka) return null;

  const scriptOptions = [
    { key: 'devanagari', label: 'Devanagari' },
    { key: 'roman', label: 'English transliteration' },
    { key: 'kannada', label: 'Kannada' },
    { key: 'telugu', label: 'Telugu' },
  ].filter(({ key }) => shloka.scripts?.[key] || (key === 'devanagari' && shloka.sanskrit_text) || (key === 'roman' && shloka.transliteration));
  const selectedScriptText = shloka.scripts?.[selectedScript]
    || (selectedScript === 'devanagari' ? shloka.sanskrit_text : selectedScript === 'roman' ? shloka.transliteration : null);
  const translationText = shloka.translation?.purohitSwami || shloka.meaning;
  const commentaries = shloka.commentaries || {};
  const hasCompleteCommentary = [
    commentaries.shankaracharya,
    commentaries.madhvacharya,
    commentaries.ramanujacharya,
  ].every(Boolean);

  const handleBookmark = () => {
    setIsBookmarkedState(toggleBookmark(chapterNumber, shloka.shloka_number));
  };

  const handleShare = async () => {
    const shareUrl = new URL(
      getViewHref('chapters', chapterNumber, shloka.shloka_number),
      window.location.origin,
    ).toString();
    const shareText = `${selectedScriptText}\n\n"${translationText}"\n\n- Bhagavad Gita ${chapterNumber}.${shloka.shloka_number}`;
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
        {scriptOptions.length > 1 && (
          <div className="shloka-language-switcher" aria-label="Verse script">
            <span className="shloka-language-label">Script</span>
            <div className="shloka-language-options" role="group">
              {scriptOptions.map(({ key, label }) => (
                <button
                  type="button"
                  key={key}
                  className={`shloka-language-button ${selectedScript === key ? 'is-active' : ''}`}
                  onClick={() => setSelectedScript(key)}
                  aria-pressed={selectedScript === key}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
        <p className={`${selectedScript === 'devanagari' ? 'font-sanskrit' : 'font-body'} text-2xl leading-[2.1] text-cosmic-blue sm:text-3xl`}>
          {selectedScriptText}
        </p>
      </div>

      <div className="shloka-section">
        <div className="shloka-section-heading">
          <BookOpen className="h-4 w-4" />
          <span>Translation</span>
        </div>
        <p className="text-base leading-8 text-cosmic-blue">{translationText}</p>
      </div>

      {hasCompleteCommentary && (
        <div className="shloka-section shloka-commentary-section">
          <button
            type="button"
            onClick={() => setShowCommentaries(!showCommentaries)}
            className="shloka-toggle"
            aria-expanded={showCommentaries}
          >
            <span>Sanskrit commentaries</span>
            {showCommentaries ? <span className="text-lg leading-none">−</span> : <Plus className="h-4 w-4" />}
          </button>
          <AnimatePresence initial={false}>
            {showCommentaries && (
              <Motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 14 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="shloka-commentaries"
              >
                <div className="shloka-commentary">
                  <h3>Shankaracharya</h3>
                  <p>{commentaries.shankaracharya}</p>
                </div>
                <div className="shloka-commentary">
                  <h3>Madhvacharya</h3>
                  <p>{commentaries.madhvacharya}</p>
                </div>
                <div className="shloka-commentary">
                  <h3>Ramanujacharya</h3>
                  <p>{commentaries.ramanujacharya}</p>
                </div>
              </Motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* {shloka.life_application && (
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
      )} */}

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
