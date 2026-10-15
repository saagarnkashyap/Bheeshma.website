import React, { useState, useRef, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  RotateCcw,
  RotateCw,
  Volume2, 
  VolumeX,
  X
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { getGitaSupersiteAudioUrl } from '../lib/audioUrls';
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
  const [volume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const currentAudioUrl = getGitaSupersiteAudioUrl(currentChapter, currentVerse);

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
      setIsPlaying(false);
    };

    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
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

  const seekBy = (seconds) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration)) return;

    const newTime = Math.min(Math.max(audio.currentTime + seconds, 0), audio.duration);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
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
        initial={{ opacity: 0, y: 100, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.8 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30,
          duration: 0.5 
        }}
        className="audio-player-floating fixed bottom-4 right-4 z-50 max-w-sm"
      >
        <Card className="audio-player shadow-2xl">
          <CardContent className="p-3">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-golden-amber font-medium">
                Chapter {currentChapter}, Verse {currentVerse}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="audio-control h-6 w-6 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
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
                />
              </div>
              <div className="audio-player-time flex justify-between text-xs mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrevious}
                className="audio-control h-8 w-8 p-0"
                title="Previous Verse"
              >
                <SkipBack className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => seekBy(-5)}
                className="audio-control h-8 w-8 p-0"
                title="Back 5 seconds"
                aria-label="Back 5 seconds"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={togglePlay}
                disabled={isLoading}
                className="audio-control audio-play-control h-10 w-10 p-0 rounded-full"
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
                className="audio-control h-8 w-8 p-0"
                title="Next Verse"
              >
                <SkipForward className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => seekBy(5)}
                className="audio-control h-8 w-8 p-0"
                title="Forward 5 seconds"
                aria-label="Forward 5 seconds"
              >
                <RotateCw className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMute}
                className="audio-control h-8 w-8 p-0"
                title="Toggle Mute"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </Button>
            </div>

            {error && (
              <div className="audio-player-error text-center mt-2 text-xs">
                {error}
              </div>
            )}

            <audio ref={audioRef} src={currentAudioUrl} preload="auto" autoPlay={autoPlay} />
          </CardContent>
        </Card>
      </Motion.div>
    </AnimatePresence>
  );
};

export default FloatingAudioPlayer;

