import React, { useState } from 'react';
import { Play, Pause, BookOpen, Heart, Share2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import '../App.css';

const ShlokaCard = ({ 
  shloka, 
  chapterNumber, 
  onAudioPlay, 
  isPlaying = false,
  showChapterInfo = true 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  if (!shloka) return null;

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Store in localStorage
    const bookmarks = JSON.parse(localStorage.getItem('bheeshma_bookmarks') || '[]');
    const bookmarkKey = `${chapterNumber}-${shloka.shloka_number}`;
    
    if (isBookmarked) {
      const filtered = bookmarks.filter(b => b !== bookmarkKey);
      localStorage.setItem('bheeshma_bookmarks', JSON.stringify(filtered));
    } else {
      bookmarks.push(bookmarkKey);
      localStorage.setItem('bheeshma_bookmarks', JSON.stringify(bookmarks));
    }
  };

  const handleShare = async () => {
    const shareText = `${shloka.sanskrit_text}\n\n"${shloka.meaning}"\n\n- Bhagavad Gita ${chapterNumber}.${shloka.shloka_number}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Bhagavad Gita ${chapterNumber}.${shloka.shloka_number}`,
          text: shareText,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(shareText);
    }
  };

  return (
    <Card className="verse-card divine-transition mb-6 overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {showChapterInfo && (
              <div className="bg-golden-amber text-cosmic-blue px-3 py-1 rounded-full text-sm font-semibold">
                Chapter {chapterNumber}
              </div>
            )}
            <div className="bg-sacred-saffron text-white px-3 py-1 rounded-full text-sm font-semibold">
              Verse {shloka.shloka_number}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAudioPlay && onAudioPlay(chapterNumber, shloka.shloka_number)}
              className="text-golden-amber hover:text-sacred-saffron"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBookmark}
              className={`${isBookmarked ? 'text-chakra-red' : 'text-golden-amber'} hover:text-sacred-saffron`}
            >
              <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="text-golden-amber hover:text-sacred-saffron"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Sanskrit Text */}
        <div className="text-center">
          <p className="font-sanskrit text-2xl leading-relaxed text-golden-amber mb-2">
            {shloka.sanskrit_text}
          </p>
          <p className="font-body text-sm text-soft-gold italic">
            {shloka.transliteration}
          </p>
        </div>

        {/* Meaning */}
        <div className="border-t border-golden-amber/20 pt-4">
          <h4 className="font-heading text-lg text-golden-amber mb-3 flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            Meaning
          </h4>
          <p className="font-body text-white leading-relaxed">
            {shloka.meaning}
          </p>
        </div>

        {/* Life Application - Expandable */}
        {shloka.life_application && (
          <div className="border-t border-golden-amber/20 pt-4">
            <Button
              variant="ghost"
              onClick={() => setIsExpanded(!isExpanded)}
              className="font-heading text-lg text-sacred-saffron hover:text-golden-amber mb-3 p-0 h-auto"
            >
              Life Application {isExpanded ? '−' : '+'}
            </Button>
            
            {isExpanded && (
              <div className="glass-morphism p-4 rounded-lg">
                <p className="font-body text-soft-gold leading-relaxed">
                  {shloka.life_application}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Keywords */}
        {shloka.keywords && shloka.keywords.length > 0 && (
          <div className="border-t border-golden-amber/20 pt-4">
            <h4 className="font-heading text-sm text-golden-amber mb-2">Key Concepts</h4>
            <div className="flex flex-wrap gap-2">
              {shloka.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="bg-sacred-saffron/20 text-sacred-saffron px-2 py-1 rounded-full text-xs font-medium"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Problems Addressed */}
        {shloka.addresses_problems && shloka.addresses_problems.length > 0 && (
          <div className="border-t border-golden-amber/20 pt-4">
            <h4 className="font-heading text-sm text-golden-amber mb-2">Addresses</h4>
            <div className="flex flex-wrap gap-2">
              {shloka.addresses_problems.map((problem, index) => (
                <span
                  key={index}
                  className="bg-chakra-green/20 text-chakra-green px-2 py-1 rounded-full text-xs font-medium"
                >
                  {problem.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ShlokaCard;

