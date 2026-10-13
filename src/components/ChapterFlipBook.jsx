import React, { forwardRef, useCallback, useEffect, useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { useReducedMotion } from 'framer-motion';
import ChapterExplorer from './ChapterExplorer';
import '../App.css';

const TOTAL_CHAPTERS = 18;

const FlipPage = forwardRef(({ children, chapterNumber, isActive = false }, ref) => (
  <div
    ref={ref}
    className="chapter-flip-page"
    data-density="soft"
    data-chapter={chapterNumber ?? 'blank'}
  >
    <div className="chapter-flip-page-content">
      {chapterNumber ? children : <div className="chapter-flip-blank" aria-hidden="true" />}
    </div>
    {isActive && <span className="sr-only">Current chapter page</span>}
  </div>
));

FlipPage.displayName = 'FlipPage';

const ChapterFlipBook = ({
  chapterNumber,
  initialVerse = 1,
  onChapterChange,
  onVerseChange,
  onPlayAudio,
}) => {
  const bookRef = useRef(null);
  const pendingChapterRef = useRef(null);
  const isFlippingRef = useRef(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    pendingChapterRef.current = null;
    isFlippingRef.current = false;
  }, [chapterNumber]);

  const requestChapterChange = useCallback((nextChapter) => {
    if (
      nextChapter < 1
      || nextChapter > TOTAL_CHAPTERS
      || nextChapter === chapterNumber
      || isFlippingRef.current
    ) {
      return;
    }

    const pageFlip = bookRef.current?.pageFlip?.();

    if (shouldReduceMotion || !pageFlip) {
      onChapterChange(nextChapter);
      return;
    }

    pendingChapterRef.current = nextChapter;
    isFlippingRef.current = true;

    if (nextChapter > chapterNumber) {
      pageFlip.flipNext('top');
    } else {
      pageFlip.flipPrev('top');
    }
  }, [chapterNumber, onChapterChange, shouldReduceMotion]);

  const handleFlip = useCallback((event) => {
    const requestedChapter = pendingChapterRef.current;
    const targetChapter = requestedChapter
      ?? (event.data > 1 ? chapterNumber + 1 : chapterNumber - 1);

    pendingChapterRef.current = null;
    isFlippingRef.current = false;

    if (
      targetChapter >= 1
      && targetChapter <= TOTAL_CHAPTERS
      && targetChapter !== chapterNumber
    ) {
      onChapterChange(targetChapter);
    }
  }, [chapterNumber, onChapterChange]);

  const pageChapters = [chapterNumber - 1, chapterNumber, chapterNumber + 1];

  return (
    <div className="chapter-flip-book-shell" aria-label="Chapter reader">
      <HTMLFlipBook
        key={chapterNumber}
        ref={bookRef}
        className="chapter-flip-book"
        width={900}
        height={1500}
        size="stretch"
        minWidth={600}
        maxWidth={1200}
        minHeight={650}
        maxHeight={1900}
        startPage={1}
        drawShadow
        maxShadowOpacity={0.52}
        flippingTime={780}
        usePortrait
        autoSize
        showPageCorners={false}
        clickEventForward
        disableFlipByClick
        mobileScrollSupport
        onFlip={handleFlip}
      >
        {pageChapters.map((pageChapter) => (
          <FlipPage
            key={pageChapter}
            chapterNumber={pageChapter >= 1 && pageChapter <= TOTAL_CHAPTERS ? pageChapter : null}
            isActive={pageChapter === chapterNumber}
          >
            <ChapterExplorer
              chapterNumber={pageChapter}
              initialVerse={pageChapter === chapterNumber ? initialVerse : 1}
              active={pageChapter === chapterNumber}
              onChapterChange={requestChapterChange}
              onVerseChange={pageChapter === chapterNumber ? onVerseChange : undefined}
              onPlayAudio={onPlayAudio}
            />
          </FlipPage>
        ))}
      </HTMLFlipBook>
    </div>
  );
};

export default ChapterFlipBook;
