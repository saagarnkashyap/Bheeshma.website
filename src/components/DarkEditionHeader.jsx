import React from 'react';
import { Menu, X } from 'lucide-react';
import { getViewHref } from '../lib/viewUrls';
import ThemeToggle from './ThemeToggle';

const DarkEditionHeader = ({
  navItems,
  currentView,
  currentChapter,
  currentVerse,
  onNavigate,
  isMenuOpen,
  setIsMenuOpen,
  theme,
  onToggleTheme,
}) => (
  <header className="dark-site-topbar">
    <a
      href={getViewHref('home')}
      className="dark-site-brand"
      onClick={(event) => {
        event.preventDefault();
        onNavigate('home');
      }}
    >
      <span className="dark-site-brand-mark" aria-hidden="true">ॐ</span>
      <span>
        <span className="dark-site-brand-name">Bheeshma</span>
        <span className="dark-site-brand-subtitle">The Gita, in focus</span>
      </span>
    </a>

    <button
      type="button"
      className="dark-site-menu-toggle"
      onClick={() => setIsMenuOpen((open) => !open)}
      aria-expanded={isMenuOpen}
      aria-controls="dark-primary-navigation"
      aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
    >
      {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    </button>

    <nav
      id="dark-primary-navigation"
      className={`dark-site-nav ${isMenuOpen ? 'dark-site-nav-open' : ''}`}
      aria-label="Primary navigation"
    >
      {navItems.map(({ id, label }) => (
        <a
          key={id}
          href={getViewHref(id, currentChapter, id === 'chapters' ? currentVerse : undefined)}
          className={`dark-site-nav-link ${currentView === id ? 'dark-site-nav-link-active' : ''}`}
          aria-current={currentView === id ? 'page' : undefined}
          onClick={(event) => {
            event.preventDefault();
            setIsMenuOpen(false);
            onNavigate(id, currentChapter, id === 'chapters' ? currentVerse : 1);
          }}
        >
          <span>{label}</span>
        </a>
      ))}
    </nav>

    <div className="dark-site-actions">
      <ThemeToggle theme={theme} onToggle={onToggleTheme} compact />
    </div>

    {isMenuOpen && (
      <button
        type="button"
        className="dark-site-nav-backdrop"
        onClick={() => setIsMenuOpen(false)}
        aria-label="Close navigation menu"
      />
    )}
  </header>
);

export default DarkEditionHeader;
