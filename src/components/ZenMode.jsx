import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useGitaData from '../hooks/useGitaData';
import { getGitaSupersiteAudioUrl } from '../lib/audioUrls';
import '../App.css';

const formatTime = (time) => {
  if (!Number.isFinite(time) || time < 0) return '00:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const getVerseQueue = (gitaData) => (
  gitaData?.chapters?.flatMap((chapter) => chapter.shlokas.map((shloka, index) => ({
    chapterNumber: chapter.number,
    chapterName: chapter.name || chapter.chapter_name || `Chapter ${chapter.number}`,
    verseNumber: shloka.shloka_number || index + 1,
    shloka,
  }))) ?? []
);

const ZenMode = ({ initialChapter = 1, initialVerse = 1, onExit }) => {
  const { gitaData, loading, error } = useGitaData();
  const audioRef = useRef(null);
  const shouldContinueRef = useRef(true);
  const playbackGenerationRef = useRef(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackError, setPlaybackError] = useState(null);
  const [hasResolvedInitialVerse, setHasResolvedInitialVerse] = useState(false);

  const verses = useMemo(() => getVerseQueue(gitaData), [gitaData]);
  const currentVerse = verses[currentIndex] ?? null;
  const currentAudioUrl = hasResolvedInitialVerse && currentVerse
    ? getGitaSupersiteAudioUrl(currentVerse.chapterNumber, currentVerse.verseNumber)
    : null;
  const progress = duration ? Math.min(100, (currentTime / duration) * 100) : 0;
  const isFirstVerse = currentIndex === 0;
  const isLastVerse = verses.length > 0 && currentIndex === verses.length - 1;

  useEffect(() => {
    if (!verses.length) return;

    const requestedIndex = verses.findIndex((verse) => (
      verse.chapterNumber === initialChapter && verse.verseNumber === initialVerse
    ));

    setCurrentIndex(requestedIndex >= 0 ? requestedIndex : 0);
    setHasResolvedInitialVerse(true);
  }, [initialChapter, initialVerse, verses]);

  useEffect(() => {
    if (!currentVerse) return;

    const params = new URLSearchParams(window.location.search);
    params.set('view', 'zen');
    params.set('chapter', String(currentVerse.chapterNumber));
    params.set('verse', String(currentVerse.verseNumber));
    window.history.replaceState({}, '', `/?${params.toString()}`);
  }, [currentVerse]);

  useEffect(() => {
    if (!currentVerse || typeof navigator === 'undefined' || !('mediaSession' in navigator)) return undefined;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: `Chapter ${String(currentVerse.chapterNumber).padStart(2, '0')} · Verse ${String(currentVerse.verseNumber).padStart(2, '0')}`,
      artist: 'Bheeshma · Zen Mode',
      album: currentVerse.chapterName,
    });

    return () => {
      navigator.mediaSession.metadata = null;
    };
  }, [currentVerse]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentAudioUrl) return undefined;
    const playbackGeneration = ++playbackGenerationRef.current;

    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handlePlay = () => {
      setIsPlaying(true);
      setIsLoading(false);
    };
    const handlePause = () => setIsPlaying(false);
    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleError = () => {
      setPlaybackError('This recitation could not be loaded.');
      setIsLoading(false);
      setIsPlaying(false);
    };
    const handleEnded = () => {
      if (currentIndex >= verses.length - 1) {
        shouldContinueRef.current = false;
        setIsPlaying(false);
        return;
      }

      setCurrentIndex((index) => index + 1);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);

    setCurrentTime(0);
    setDuration(0);
    setPlaybackError(null);
    setIsLoading(shouldContinueRef.current);
    audio.pause();
    audio.load();

    const startPlayback = async () => {
      if (!shouldContinueRef.current) return;

      try {
        await audio.play();
        if (
          playbackGenerationRef.current !== playbackGeneration
          || audioRef.current !== audio
        ) return;
        setIsPlaying(true);
      } catch {
        if (
          playbackGenerationRef.current !== playbackGeneration
          || audioRef.current !== audio
        ) return;
        setPlaybackError('Press play to begin the recitation.');
        setIsPlaying(false);
        setIsLoading(false);
      }
    };

    audio.addEventListener('canplay', startPlayback, { once: true });

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('canplay', startPlayback);
      audio.pause();
      playbackGenerationRef.current += 1;
    };
  }, [currentAudioUrl, currentIndex, verses.length]);

  const togglePlayback = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      shouldContinueRef.current = false;
      playbackGenerationRef.current += 1;
      audio.pause();
      return;
    }

    shouldContinueRef.current = true;
    const playbackGeneration = ++playbackGenerationRef.current;
    setIsLoading(true);
    setPlaybackError(null);

    try {
      await audio.play();
      if (
        playbackGenerationRef.current !== playbackGeneration
        || audioRef.current !== audio
      ) return;
    } catch {
      if (
        playbackGenerationRef.current !== playbackGeneration
        || audioRef.current !== audio
      ) return;
      setPlaybackError('Press play to begin the recitation.');
      setIsLoading(false);
    }
  }, [isPlaying]);

  const goToVerse = useCallback((nextIndex) => {
    if (nextIndex < 0 || nextIndex >= verses.length) return;
    shouldContinueRef.current = true;
    playbackGenerationRef.current += 1;
    setCurrentIndex(nextIndex);
  }, [verses.length]);

  const handleSeek = useCallback((event) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const nextTime = Number(event.target.value);
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  }, [duration]);

  const seekBy = useCallback((offset) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration)) return;

    const nextTime = Math.max(0, Math.min(audio.duration, audio.currentTime + offset));
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  }, []);

  useEffect(() => {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return undefined;

    const mediaSession = navigator.mediaSession;
    const setActionHandler = (action, handler) => {
      try {
        mediaSession.setActionHandler(action, handler);
      } catch {
        // Some browsers expose Media Session but not every action.
      }
    };

    setActionHandler('play', () => { void togglePlayback(); });
    setActionHandler('pause', () => { void togglePlayback(); });
    setActionHandler('nexttrack', () => goToVerse(currentIndex + 1));
    setActionHandler('previoustrack', () => goToVerse(currentIndex - 1));
    setActionHandler('seekbackward', (details) => seekBy(-(details.seekOffset || 10)));
    setActionHandler('seekforward', (details) => seekBy(details.seekOffset || 10));
    setActionHandler('seekto', (details) => {
      const audio = audioRef.current;
      if (!audio || !Number.isFinite(details.seekTime)) return;
      audio.currentTime = Math.max(0, Math.min(audio.duration || details.seekTime, details.seekTime));
      setCurrentTime(audio.currentTime);
    });

    return () => {
      ['play', 'pause', 'nexttrack', 'previoustrack', 'seekbackward', 'seekforward', 'seekto'].forEach((action) => {
        setActionHandler(action, null);
      });
    };
  }, [currentIndex, goToVerse, seekBy, togglePlayback]);

  useEffect(() => {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;
    navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
  }, [isPlaying]);

  if (loading || !hasResolvedInitialVerse) {
    return (
      <div className="zen-mode zen-mode-state">
        <p className="zen-micro-label">ZEN MODE</p>
        <p>Loading the recitation...</p>
      </div>
    );
  }

  if (error || !currentVerse) {
    return (
      <div className="zen-mode zen-mode-state">
        <p className="zen-micro-label">ZEN MODE</p>
        <p>Unable to open the Gita recitation.</p>
        <button type="button" className="zen-button zen-button-secondary" onClick={onExit}>EXIT ZEN</button>
      </div>
    );
  }

  return (
    <div className="zen-mode">
      <header className="zen-header">
        <div>
          <p className="zen-wordmark">BHEESHMA</p>
          <p className="zen-micro-label">ZEN MODE - BHAGAVAD GITA</p>
        </div>
        <button type="button" className="zen-text-button" onClick={onExit}>EXIT</button>
      </header>

      <main className="zen-main">
        <p className="sr-only" aria-live="polite">
          Now playing Chapter {currentVerse.chapterNumber}, Verse {currentVerse.verseNumber}.
        </p>

        <div className="zen-now-playing">
          <div className="zen-player-header">
            <p className="zen-micro-label">NOW PLAYING</p>
            <p className="zen-counter">
              CHAPTER {String(currentVerse.chapterNumber).padStart(2, '0')} / VERSE {String(currentVerse.verseNumber).padStart(2, '0')}
            </p>
          </div>

          <div className="zen-player-title">
            <h1 className="zen-chapter-title">{currentVerse.chapterName}</h1>
          </div>
        </div>

        <article className="zen-verse">
          <p className="zen-sanskrit font-sanskrit">{currentVerse.shloka.sanskrit_text}</p>
          <p className="zen-transliteration">{currentVerse.shloka.transliteration}</p>
        </article>

        <section className="zen-player" aria-label="Continuous Gita recitation" aria-busy={isLoading}>
          <div className="zen-progress-wrap">
            <input
              type="range"
              className="zen-progress-slider"
              min="0"
              max={duration || 0}
              step="0.1"
              value={Math.min(currentTime, duration || 0)}
              onChange={handleSeek}
              disabled={!duration}
              aria-label="Recitation progress"
            />
            <div className="zen-progress-track" aria-hidden="true">
              <span style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="zen-time-row">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          <div className="zen-transport-row">
            <button type="button" className="zen-transport-button" onClick={() => goToVerse(currentIndex - 1)} disabled={isFirstVerse} aria-label="Previous verse">|&lt;</button>
            <button type="button" className="zen-play-button" onClick={togglePlayback} disabled={isLoading} aria-busy={isLoading} aria-label={isPlaying ? 'Pause recitation' : 'Play recitation'}>
              <span key={isPlaying ? 'pause' : 'play'} className="zen-play-label" aria-hidden="true">
                {isPlaying ? 'PAUSE' : 'PLAY'}
              </span>
            </button>
            <button type="button" className="zen-transport-button" onClick={() => goToVerse(currentIndex + 1)} disabled={isLastVerse} aria-label="Next verse">&gt;|</button>
          </div>

          {(playbackError || isLastVerse) && (
            <p className="zen-status" role={playbackError ? 'alert' : undefined}>
              {playbackError || 'You have reached the end of the recitation.'}
            </p>
          )}
        </section>

      </main>

      <footer className="zen-footer">
        <span>{currentIndex + 1} / {verses.length} VERSES</span>
        <span>CONTINUOUS RECITATION</span>
      </footer>

      <audio ref={audioRef} src={currentAudioUrl || undefined} preload="auto" playsInline aria-label="Gita recitation audio" />
    </div>
  );
};

export default ZenMode;
