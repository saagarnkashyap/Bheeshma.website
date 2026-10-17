import React, { forwardRef, useCallback, useEffect, useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { useReducedMotion } from 'framer-motion';
import ChapterExplorer from './ChapterExplorer';
import '../App.css';

const TOTAL_CHAPTERS = 18;
const PAGE_DRAG_THRESHOLD = 32;
const INTERACTIVE_TARGET_SELECTOR = 'button, a, input, select, textarea, summary, [role="button"]';

const isInteractiveTarget = (target) => (
  target instanceof Element && Boolean(target.closest(INTERACTIVE_TARGET_SELECTOR))
);

const getPagePoint = (shell, event) => {
  const bookElement = shell.querySelector('.stf__parent') ?? shell;
  const bounds = bookElement.getBoundingClientRect();

  return {
    x: event.clientX - bounds.left,
    y: event.clientY - bounds.top,
  };
};

const FlipPage = forwardRef(({ children, chapterNumber, isActive = false }, ref) => (
  <div
    ref={ref}
    className="chapter-flip-page"
    data-density="soft"
    data-chapter={chapterNumber ?? 'blank'}
  >
    <div
      className="chapter-flip-page-content"
    >
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
  const bookShellRef = useRef(null);
  const gestureRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    pendingChapterRef.current = null;
    isFlippingRef.current = false;

    const pageFlip = bookRef.current?.pageFlip?.();
    const expectedPageIndex = chapterNumber - 1;

    if (pageFlip && pageFlip.getCurrentPageIndex() !== expectedPageIndex) {
      pageFlip.turnToPage(expectedPageIndex);
    }
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

    const expectedPageIndex = chapterNumber - 1;
    if (pageFlip.getCurrentPageIndex() !== expectedPageIndex) {
      pageFlip.turnToPage(expectedPageIndex);
    }

    pendingChapterRef.current = nextChapter;
    isFlippingRef.current = true;

    // react-pageflip applies `disableFlipByClick` inside its public flip
    // methods too. Temporarily bypass that guard for an explicit button
    // action while keeping ordinary page clicks from starting a flip.
    const settings = pageFlip.getSettings();
    const wasClickFlipDisabled = settings.disableFlipByClick;
    settings.disableFlipByClick = false;

    try {
      if (nextChapter > chapterNumber) {
        pageFlip.flipNext('top');
      } else {
        pageFlip.flipPrev('top');
      }
    } finally {
      settings.disableFlipByClick = wasClickFlipDisabled;
    }
  }, [chapterNumber, onChapterChange, shouldReduceMotion]);

  const handleFlip = useCallback((event) => {
    const requestedChapter = pendingChapterRef.current;
    const targetChapter = requestedChapter ?? (event.data + 1);

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

  const handlePointerDownCapture = useCallback((event) => {
    if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return;

    if (isInteractiveTarget(event.target)) {
      gestureRef.current = { ignored: true };
      return;
    }

    gestureRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      dragging: false,
      ignored: false,
    };
  }, []);

  const handlePointerMoveCapture = useCallback((event) => {
    const gesture = gestureRef.current;
    if (
      !gesture
      || gesture.ignored
      || gesture.pointerId !== event.pointerId
    ) {
      return;
    }

    const deltaX = event.clientX - gesture.startX;
    const deltaY = event.clientY - gesture.startY;

    if (!gesture.dragging) {
      const isHorizontalDrag = Math.abs(deltaX) >= PAGE_DRAG_THRESHOLD
        && Math.abs(deltaX) > Math.abs(deltaY);

      if (!isHorizontalDrag) return;

      const pageFlip = bookRef.current?.pageFlip?.();
      if (!pageFlip || isFlippingRef.current) return;

      pageFlip.startUserTouch(getPagePoint(bookShellRef.current, {
        clientX: gesture.startX,
        clientY: gesture.startY,
      }));
      gesture.dragging = true;
      isFlippingRef.current = true;
      event.currentTarget.setPointerCapture?.(event.pointerId);
    }

    const pageFlip = bookRef.current?.pageFlip?.();
    if (!pageFlip) return;

    if (event.cancelable) event.preventDefault();
    pageFlip.userMove(getPagePoint(bookShellRef.current, event), true);
  }, []);

  const finishPointerGesture = useCallback((event) => {
    const gesture = gestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) {
      gestureRef.current = null;
      return;
    }

    if (gesture.dragging) {
      const pageFlip = bookRef.current?.pageFlip?.();
      pageFlip?.userStop(getPagePoint(bookShellRef.current, event));

      const dragDirection = event.clientX - gesture.startX;
      const canTurnToAdjacentChapter = dragDirection < 0
        ? chapterNumber < TOTAL_CHAPTERS
        : chapterNumber > 1;

      if (!canTurnToAdjacentChapter) isFlippingRef.current = false;
    }

    event.currentTarget.releasePointerCapture?.(event.pointerId);
    gestureRef.current = null;
  }, [chapterNumber]);

  const pageChapters = Array.from({ length: TOTAL_CHAPTERS }, (_, index) => index + 1);

  return (
    <div
      ref={bookShellRef}
      className="chapter-flip-book-shell"
      aria-label="Chapter reader"
      onPointerDownCapture={handlePointerDownCapture}
      onPointerMoveCapture={handlePointerMoveCapture}
      onPointerUpCapture={finishPointerGesture}
      onPointerCancelCapture={finishPointerGesture}
    >
      <HTMLFlipBook
        ref={bookRef}
        className="chapter-flip-book"
        width={900}
        height={1500}
        size="stretch"
        minWidth={600}
        maxWidth={1200}
        minHeight={650}
        maxHeight={1900}
        startPage={chapterNumber - 1}
        drawShadow
        maxShadowOpacity={0.52}
        flippingTime={780}
        usePortrait
        autoSize
        showPageCorners={false}
        clickEventForward
        disableFlipByClick
        // PageFlip's native click handler also treats corner taps as flips.
        // Pointer gestures are handled by the shell so taps stay taps.
        useMouseEvents={false}
        onFlip={handleFlip}
      >
        {pageChapters.map((pageChapter) => (
          <FlipPage
            key={pageChapter}
            chapterNumber={pageChapter}
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
