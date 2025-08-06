import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import audioLinksData from '../assets/gita_audio_links.json';
import '../App.css';

const FloatingAudioPlayer = ({ 
  currentChapter, 
  currentVerse, 
  onNext, 
  onPrevious,
  onClose,
  isVisible = true
}) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generate audio URL based on provided audio links
  const getAudioUrl = (chapter, verse) => {
    try {
      if (!chapter || !verse) {
        return null;
      }
      
      const audioPath = audioLinksData[chapter.toString()]?.[verse.toString()];
      if (audioPath) {
        return `https://www.gitasupersite.iitk.ac.in/sites/default/files/audio/${audioPath}`;
      }
      return null;
    } catch (error) {
      console.error('Error getting audio URL:', error);
      return null;
    }
  };

  const currentAudioUrl = getAudioUrl(currentChapter, currentVerse);

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
    if (currentAudioUrl) {
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);
    }
  }, [currentAudioUrl]);

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
    
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
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
    const audio = audioRef.current;
    if (!audio) return;
    
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
    } else if (onPrevious) {
      onPrevious();
    }
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
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.8 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30,
          duration: 0.5 
        }}
        className="fixed bottom-4 right-4 z-50 max-w-sm"
      >
        <Card className="glass-morphism border border-golden-amber/20 shadow-2xl">
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
                className="text-golden-amber hover:text-sacred-saffron h-6 w-6 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div 
                className="w-full h-1 bg-cosmic-blue/30 rounded-full cursor-pointer"
                onClick={handleSeek}
              >
                <div 
                  className="h-full bg-gradient-to-r from-golden-amber to-sacred-saffron rounded-full transition-all duration-300"
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-soft-gold mt-1">
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
                className="text-golden-amber hover:text-sacred-saffron h-8 w-8 p-0"
                title="Previous Verse"
              >
                <SkipBack className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={togglePlay}
                disabled={isLoading}
                className="text-golden-amber hover:text-sacred-saffron h-10 w-10 p-0 rounded-full bg-golden-amber/10"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-golden-amber border-t-transparent rounded-full animate-spin" />
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
                className="text-golden-amber hover:text-sacred-saffron h-8 w-8 p-0"
                title="Next Verse"
              >
                <SkipForward className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMute}
                className="text-golden-amber hover:text-sacred-saffron h-8 w-8 p-0"
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
              <div className="text-center text-red-400 mt-2 text-xs">
                {error}
              </div>
            )}

            <audio ref={audioRef} src={currentAudioUrl} />
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default FloatingAudioPlayer;

