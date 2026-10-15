import React, { useState, useRef, useEffect } from 'react';
import { motion as Motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  X
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { getChapterVerseCount, getGitaSupersiteAudioUrl } from '../lib/audioUrls';
import '../App.css';

const FloatingAudioPlayer = ({ 
  currentChapter, 
  currentVerse, 
  onNext, 
  onPrevious,
  onClose,
  autoPlay = false,
  isVisible = true
}) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const previousVolumeRef = useRef(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const shouldReduceMotion = useReducedMotion();

  const currentAudioUrl = getGitaSupersiteAudioUrl(currentChapter, currentVerse);
  const chapterVerseCount = getChapterVerseCount(currentChapter);
  const hasPreviousVerse = currentChapter > 1 || currentVerse > 1;
  const hasNextVerse = currentChapter < 18 || currentVerse < chapterVerseCount;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentAudioUrl) return;

    const handleLoadedData = () => {
      setDuration(audio.duration);
      setError(null);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (onNext) {
        onNext();
      }
    };

    const handleError = () => {
      setError('Failed to load audio');
      setIsLoading(false);
      setIsPlaying(false);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      setIsLoading(false);
    };

    const handlePause = () => setIsPlaying(false);
    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);

    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [currentAudioUrl, onNext]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentAudioUrl) return undefined;

    let cancelled = false;
    setCurrentTime(0);
    setDuration(0);
    setError(null);
    setIsPlaying(false);
    setIsLoading(autoPlay);
    audio.pause();
    audio.load();

    if (!autoPlay) return undefined;

    const startPlayback = async () => {
      if (cancelled) return;

      try {
        await audio.play();
        if (!cancelled) setIsPlaying(true);
      } catch (error) {
        if (!cancelled) {
          console.error('Audio autoplay error:', error);
          setError('Click play to start this audio');
          setIsPlaying(false);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    audio.addEventListener('canplay', startPlayback, { once: true });

    return () => {
      cancelled = true;
      audio.removeEventListener('canplay', startPlayback);
      audio.pause();
    };
  }, [currentAudioUrl, autoPlay]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        setIsLoading(true);
        await audio.play();
        setIsPlaying(true);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Audio play error:', error);
      setError('Failed to play audio');
      setIsLoading(false);
      setIsPlaying(false);
    }
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = Number(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isMuted || volume === 0) {
      const restoredVolume = previousVolumeRef.current || 0.5;
      audio.volume = restoredVolume;
      setVolume(restoredVolume);
      setIsMuted(false);
    } else {
      previousVolumeRef.current = volume;
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e) => {
    const audio = audioRef.current;
    if (!audio) return;

    const nextVolume = Number(e.target.value);
    audio.volume = nextVolume;
    setVolume(nextVolume);
    setIsMuted(nextVolume === 0);

    if (nextVolume > 0) {
      previousVolumeRef.current = nextVolume;
    }
  };

  const handlePrevious = () => {
    if (onPrevious) onPrevious();
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentAudioUrl || !isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      <Motion.div
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 100, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 100, scale: 0.8 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30,
          duration: 0.5 
        }}
        className="audio-player-floating fixed bottom-4 right-4 z-50"
        role="region"
        aria-label="Audio player"
      >
        <Card className="audio-player">
          <CardContent className="audio-player-content">
            <div className="audio-player-header">
              <div className="audio-player-heading">
                <span className="audio-player-label">Now playing</span>
                <span className="audio-player-title">
                  Chapter {currentChapter} · Verse {currentVerse}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="audio-control h-6 w-6 p-0"
                aria-label="Close audio player"
                title="Close audio player"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>

            <div className="audio-player-timeline">
              <div className="audio-progress-control">
                <div className="audio-progress-track w-full h-1 rounded-full" aria-hidden="true">
                  <div
                    className="audio-progress-fill h-full rounded-full transition-all duration-300"
                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>
                <input
                  type="range"
                  className="audio-progress-slider"
                  min="0"
                  max={duration || 0}
                  step="0.1"
                  value={Math.min(currentTime, duration || 0)}
                  onChange={handleSeek}
                  disabled={!duration}
                  aria-label="Audio position"
                  aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
                />
              </div>
              <div className="audio-player-time">
                <span><span className="sr-only">Elapsed time: </span>{formatTime(currentTime)}</span>
                <span><span className="sr-only">Duration: </span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="audio-controls-row">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrevious}
                disabled={!hasPreviousVerse}
                className="audio-control audio-transport-button h-8 w-8 p-0"
                aria-label="Previous verse"
                title="Previous Verse"
              >
                <SkipBack className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={togglePlay}
                disabled={isLoading}
                className="audio-control audio-play-control audio-transport-button h-10 w-10 p-0 rounded-full"
                aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
                title={isPlaying ? 'Pause audio' : 'Play audio'}
              >
                {isLoading ? (
                  <div className="audio-player-spinner w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleNext}
                disabled={!hasNextVerse}
                className="audio-control audio-transport-button h-8 w-8 p-0"
                aria-label="Next verse"
                title="Next Verse"
              >
                <SkipForward className="w-4 h-4" />
              </Button>

              <div className="audio-volume-control">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMute}
                  className="audio-control h-8 w-8 p-0"
                  title={isMuted || volume === 0 ? 'Unmute audio' : 'Mute audio'}
                  aria-label={isMuted || volume === 0 ? 'Unmute audio' : 'Mute audio'}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </Button>
                <input
                  type="range"
                  className="audio-volume-slider"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  aria-label="Volume level"
                  aria-valuenow={Math.round((isMuted ? 0 : volume) * 100)}
                  aria-valuetext={`${Math.round((isMuted ? 0 : volume) * 100)} percent`}
                />
              </div>
            </div>

            {error && (
              <div className="audio-player-error text-center mt-2 text-xs" role="alert" aria-live="assertive">
                {error}
              </div>
            )}

            <audio ref={audioRef} src={currentAudioUrl} preload="auto" />
          </CardContent>
        </Card>
      </Motion.div>
    </AnimatePresence>
  );
};

export default FloatingAudioPlayer;

