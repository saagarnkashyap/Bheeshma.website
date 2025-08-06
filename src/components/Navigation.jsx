import React, { useState } from 'react';
import { Menu, X, Home, BookOpen, Heart, Music, MessageCircle, Info } from 'lucide-react';
import { Button } from './ui/button';
import useGitaData from '../hooks/useGitaData';
import '../App.css';

const Navigation = ({ 
  currentView, 
  onViewChange, 
  currentChapter, 
  onChapterChange 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { gitaData } = useGitaData();

  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'chapters', label: 'Chapters', icon: BookOpen },
    { id: 'emotions', label: 'Life Help', icon: Heart },
    { id: 'audio', label: 'Audio', icon: Music },
    { id: 'chat', label: 'Chat with Bheeshma', icon: MessageCircle },
    { id: 'about', label: 'About', icon: Info },
  ];

  const handleNavClick = (viewId) => {
    onViewChange(viewId);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-cosmic-blue/80 backdrop-blur-sm text-golden-amber hover:text-sacred-saffron"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <div className={`
        fixed left-0 top-0 h-full w-80 chapter-nav z-40 transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 h-full overflow-y-auto">
          {/* Logo/Title */}
          <div className="mb-8 text-center">
            <h1 className="font-heading text-2xl text-golden-amber text-glow mb-2">
              Bheeshma
            </h1>
            <p className="font-body text-sm text-soft-gold">
              Divine Bhagavad Gita
            </p>
          </div>

          {/* Main Navigation */}
          <div className="space-y-2 mb-8">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? "default" : "ghost"}
                  className={`w-full justify-start divine-transition ${
                    currentView === item.id
                      ? 'bg-golden-amber text-cosmic-blue'
                      : 'text-golden-amber hover:text-sacred-saffron hover:bg-sacred-saffron/10'
                  }`}
                  onClick={() => handleNavClick(item.id)}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {item.label}
                </Button>
              );
            })}
          </div>

          {/* Chapter List */}
          {currentView === 'chapters' && gitaData && (
            <div className="border-t border-golden-amber/20 pt-6">
              <h3 className="font-heading text-lg text-golden-amber mb-4">
                All Chapters
              </h3>
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {gitaData.chapters.map((chapter) => (
                  <Button
                    key={chapter.number}
                    variant={currentChapter === chapter.number ? "default" : "ghost"}
                    size="sm"
                    className={`w-full justify-start text-left divine-transition ${
                      currentChapter === chapter.number
                        ? 'bg-sacred-saffron text-white'
                        : 'text-soft-gold hover:text-golden-amber hover:bg-golden-amber/10'
                    }`}
                    onClick={() => {
                      onChapterChange(chapter.number);
                      setIsOpen(false);
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold">
                        Chapter {chapter.number}
                      </div>
                      <div className="text-xs opacity-80 truncate">
                        {chapter.name}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Progress Indicator */}
          <div className="border-t border-golden-amber/20 pt-6 mt-8">
            <h3 className="font-heading text-sm text-golden-amber mb-3">
              Reading Progress
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-soft-gold">
                <span>Current Chapter</span>
                <span>{currentChapter}/18</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="h-full bg-gradient-to-r from-chakra-red to-chakra-violet rounded-full transition-all duration-500"
                  style={{ width: `${(currentChapter / 18) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Divine Quote */}
          <div className="border-t border-golden-amber/20 pt-6 mt-6">
            <div className="glass-morphism p-4 rounded-lg text-center">
              <p className="font-sanskrit text-sm text-golden-amber mb-2">
                कर्मण्येवाधिकारस्ते मा फलेषु कदाचन
              </p>
              <p className="font-body text-xs text-soft-gold italic">
                "You have the right to perform your actions, but never to the fruits of action"
              </p>
              <p className="font-body text-xs text-sacred-saffron mt-1">
                - Bhagavad Gita 2.47
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Spacer */}
      <div className="lg:ml-80" />
    </>
  );
};

export default Navigation;

