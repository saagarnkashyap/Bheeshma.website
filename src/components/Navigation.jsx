import React, { useState } from 'react';
import { BookOpen, Heart, Home, Info, Menu, MessageCircle, Music, X } from 'lucide-react';
import useGitaData from '../hooks/useGitaData';
import { getViewHref } from '../lib/viewUrls';
import '../App.css';

const navigationItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'chapters', label: 'Chapters', icon: BookOpen },
  { id: 'emotions', label: 'Guidance', icon: Heart },
  { id: 'audio', label: 'Audio', icon: Music },
  { id: 'chat', label: 'Assistant', icon: MessageCircle },
  { id: 'about', label: 'About', icon: Info },
];

const Navigation = ({ currentView, onViewChange, currentChapter, onChapterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { gitaData } = useGitaData();

  const handleNavClick = (event, viewId) => {
    event.preventDefault();
    onViewChange(viewId);
    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
        onClick={() => setIsOpen(!isOpen)}
        className={`navigation-toggle lg:hidden fixed top-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-paper/90 text-cosmic-blue shadow-sm backdrop-blur ${isOpen ? 'navigation-toggle-open' : ''}`}
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          className="lg:hidden fixed inset-0 z-40 bg-cosmic-blue/35 backdrop-blur-[2px]"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`chapter-nav fixed left-0 top-0 z-40 h-full w-80 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex h-full flex-col overflow-y-auto px-5 py-7 lg:px-7">
          <a
            href={getViewHref('home')}
            onClick={(event) => handleNavClick(event, 'home')}
            className="mb-10 flex items-center gap-3 text-left"
          >
            <span className="nav-mark">BG</span>
            <span>
              <span className="block font-heading text-2xl tracking-tight text-paper">Bheeshma</span>
              <span className="mt-0.5 block text-[0.65rem] uppercase tracking-[0.22em] text-paper/55">
                Digital study edition
              </span>
            </span>
          </a>

          <div className="mb-8">
            <p className="nav-section-label">Navigate</p>
            <nav className="space-y-1.5" aria-label="Main navigation">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;

                return (
                  <a
                    key={item.id}
                    href={getViewHref(item.id, currentChapter)}
                    onClick={(event) => handleNavClick(event, item.id)}
                    className={`nav-item ${isActive ? 'nav-item-active' : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon className="h-4 w-4 shrink-0" strokeWidth={1.7} />
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </nav>
          </div>

          {currentView === 'chapters' && gitaData && (
            <div className="border-t border-paper/10 pt-6">
            <p className="nav-section-label">Chapter index</p>
              <div className="space-y-1">
                {gitaData.chapters.map((chapter) => {
                  const isActive = currentChapter === chapter.number;

                  return (
                    <a
                      key={chapter.number}
                      href={getViewHref('chapters', chapter.number)}
                      onClick={(event) => {
                        event.preventDefault();
                        onChapterChange(chapter.number);
                        setIsOpen(false);
                      }}
                      className={`chapter-item ${isActive ? 'chapter-item-active' : ''}`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <span className="w-7 shrink-0 font-mono text-xs opacity-60">
                        {String(chapter.number).padStart(2, '0')}
                      </span>
                      <span className="min-w-0 text-left">
                        <span className="block truncate text-sm">{chapter.name}</span>
                        <span className="mt-0.5 block text-[0.65rem] uppercase tracking-[0.12em] opacity-45">
                          {chapter.shlokas.length} verses
                        </span>
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-auto border-t border-paper/10 pt-6">
            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between text-[0.68rem] uppercase tracking-[0.14em] text-paper/55">
                <span>Reading progress</span>
                <span>{currentChapter}/18</span>
              </div>
              <div className="progress-bar">
                <div
                  className="h-full rounded-full bg-saffron-light transition-all duration-500"
                  style={{ width: `${(currentChapter / 18) * 100}%` }}
                />
              </div>
            </div>

            <div className="nav-quote">
              <p className="mb-3 font-sanskrit text-sm leading-relaxed text-paper/85">
                कर्मण्येवाधिकारस्ते मा फलेषु कदाचन
              </p>
              <p className="text-xs leading-relaxed text-paper/55">
                You have control over action, not its result.
              </p>
              <p className="mt-2 text-[0.65rem] uppercase tracking-[0.14em] text-saffron-light">
                Gita 2.47
              </p>
            </div>
          </div>
        </div>
      </aside>

    </>
  );
};

export default Navigation;
