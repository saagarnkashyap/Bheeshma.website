import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Repeat, 
  Shuffle,
  Download,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import audioLinksData from '../assets/gita_audio_links.json';
import '../App.css';

const AudioPlayer = ({ 
  currentChapter, 
  currentVerse, 
  onChapterChange, 
  onVerseChange,
  isMinimized = false,
  onToggleMinimize 
}) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [autoplay, setAutoplay] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [error, setError] = useState(null);

  // Generate audio URL based on provided audio links
  const getAudioUrl = (chapter, verse) => {
    try {
      // Check if chapter and verse are valid
      if (!chapter || !verse) {
        return null;
      }
      
      const audioPath = audioLinksData[chapter.toString()]?.[verse.toString()];
      if (audioPath) {
        // Use the Gita Supersite base URL with the provided audio path
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
      if (repeat) {
        audio.currentTime = 0;
        audio.play();
        setIsPlaying(true);
      } else if (autoplay && onNext) {
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
      audio.removeEventListener('timeupdate', handleTimeUpda  };

  const handleSeek = (e) => {ayer if there's no valid audio URL
  if (!currentAudioUrl) {
    return null;
  }

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
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [autoplay, repeat]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error('Audio play error:', err);
      setError('Failed to play audio');
    }
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newVolume = Math.max(0, Math.min(1, percent));
    
    setVolume(newVolume);
    setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handlePrevious = () => {
    if (currentVerse > 1) {
      onVerseChange(currentVerse - 1);
    } else if (currentChapter > 1) {
      onChapterChange(currentChapter - 1);
      // Note: Would need to know the last verse of previous chapter
      onVerseChange(1);
    }
  };

  const handleNext = () => {
    // Note: Would need to know the total verses in current chapter
    onVerseChange(currentVerse + 1);
  };

  const formatTime = (time) => {
    if (!time || !isFinite(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const downloadAudio = () => {
    const link = document.createElement('a');
    link.href = currentAudioUrl;
    link.download = `BG_${currentChapter}_${currentVerse}.mp3`;
    link.click();
  };

  if (isMinimized) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-20 right-6 z-40"
      >
        <Card className="bg-cosmic-blue/90 backdrop-blur-md border-golden-amber/30">
          <CardContent className="p-3 flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePlay}
              disabled={isLoading}
              className="text-golden-amber hover:text-sacred-saffron"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-golden-amber border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>
            
            <div className="text-sm text-soft-gold">
              {currentChapter}.{currentVerse}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleMinimize}
              className="text-golden-amber hover:text-sacred-saffron"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
        
        <audio
          ref={audioRef}
          src={currentAudioUrl}
          preload="metadata"
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-6 left-6 right-6 lg:left-80 z-40"
    >
      <Card className="bg-cosmic-blue/95 backdrop-blur-md border-golden-amber/30 shadow-2xl">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-heading text-lg text-golden-amber">
                Chapter {currentChapter}, Verse {currentVerse}
              </h3>
              <p className="text-sm text-soft-gold">Sanskrit Recitation</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={downloadAudio}
                className="text-golden-amber hover:text-sacred-saffron"
                title="Download Audio"
              >
                <Download className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleMinimize}
                className="text-golden-amber hover:text-sacred-saffron"
                title="Minimize Player"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div 
              className="w-full h-2 bg-cosmic-blue/50 rounded-full cursor-pointer"
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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRepeat(!repeat)}
                className={`${repeat ? 'text-sacred-saffron' : 'text-golden-amber'} hover:text-sacred-saffron`}
                title="Repeat"
              >
                <Repeat className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrevious}
                className="text-golden-amber hover:text-sacred-saffron"
                title="Previous Verse"
              >
                <SkipBack className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="lg"
                onClick={togglePlay}
                disabled={isLoading}
                className="text-golden-amber hover:text-sacred-saffron bg-golden-amber/10 hover:bg-golden-amber/20"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-golden-amber border-t-transparent rounded-full animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNext}
                className="text-golden-amber hover:text-sacred-saffron"
                title="Next Verse"
              >
                <SkipForward className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAutoplay(!autoplay)}
                className={`${autoplay ? 'text-sacred-saffron' : 'text-golden-amber'} hover:text-sacred-saffron`}
                title="Autoplay"
              >
                <Shuffle className="w-4 h-4" />
              </Button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMute}
                className="text-golden-amber hover:text-sacred-saffron"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </Button>
              
              <div 
                className="w-20 h-2 bg-cosmic-blue/50 rounded-full cursor-pointer"
                onClick={handleVolumeChange}
              >
                <div 
                  className="h-full bg-gradient-to-r from-golden-amber to-sacred-saffron rounded-full"
                  style={{ width: `${isMuted ? 0 : volume * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-3 text-center text-sm text-chakra-red"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
      
      <audio
        ref={audioRef}
        src={currentAudioUrl}
        preload="metadata"
      />
    </motion.div>
  );
};

export default AudioPlayer;

