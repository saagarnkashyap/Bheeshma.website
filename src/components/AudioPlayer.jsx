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
  onNext, 
  onPrevious,
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
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [currentAudioUrl, repeat, autoplay, onNext]);

  useEffect(() => {
    if (currentAudioUrl) {
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);
    }
  }, [currentAudioUrl]);

  // Don't render the audio player if there's no valid audio URL
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

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newVolume = Math.max(0, Math.min(1, percent));
    audio.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
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

  const downloadAudio = () => {
    if (currentAudioUrl) {
      const link = document.createElement('a');
      link.href = currentAudioUrl;
      link.download = `Chapter_${currentChapter}_Verse_${currentVerse}.mp3`;
      link.click();
    }
  };

  if (isMinimized) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <Card className="glass-morphism w-80">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePlay}
                  className="text-golden-amber hover:text-sacred-saffron"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <div className="text-sm text-white">
                  Chapter {currentChapter}, Verse {currentVerse}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleMinimize}
                className="text-golden-amber hover:text-sacred-saffron"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
        <audio ref={audioRef} src={currentAudioUrl} />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8"
    >
      <Card className="glass-morphism">
        <CardContent className="p-6">
          <div className="text-center mb-4">
            <h3 className="font-heading text-lg text-golden-amber mb-2">
              Chapter {currentChapter}, Verse {currentVerse}
            </h3>
            <p className="text-sm text-soft-gold">Sanskrit Recitation</p>
          </div>

          {error && (
            <div className="text-center text-red-400 mb-4 text-sm">
              {error}
            </div>
          )}

          {/* Progress Bar */}
          <div className="mb-6">
            <div 
              className="w-full h-2 bg-cosmic-blue/30 rounded-full cursor-pointer"
              onClick={handleSeek}
            >
              <div 
                className="h-full bg-gradient-to-r from-golden-amber to-sacred-saffron rounded-full transition-all duration-300"
                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-soft-gold mt-2">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevious}
              className="text-golden-amber hover:text-sacred-saffron"
              title="Previous Verse"
            >
              <SkipBack className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="lg"
              onClick={togglePlay}
              disabled={isLoading}
              className="text-golden-amber hover:text-sacred-saffron w-12 h-12 rounded-full"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-golden-amber border-t-transparent rounded-full animate-spin" />
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
              <SkipForward className="w-5 h-5" />
            </Button>
          </div>

          {/* Additional Controls */}
          <div className="flex items-center justify-between">
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
              
              {onToggleMinimize && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleMinimize}
                  className="text-golden-amber hover:text-sacred-saffron"
                  title="Minimize Player"
                >
                  <Minimize2 className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="flex items-center space-x-2">
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
                className="w-16 h-1 bg-cosmic-blue/30 rounded-full cursor-pointer"
                onClick={handleVolumeChange}
              >
                <div 
                  className="h-full bg-golden-amber rounded-full"
                  style={{ width: `${isMuted ? 0 : volume * 100}%` }}
                />
              </div>
            </div>
          </div>

          <audio ref={audioRef} src={currentAudioUrl} />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AudioPlayer;

