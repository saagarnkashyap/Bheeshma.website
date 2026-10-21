import React from 'react';
import { ArrowDownRight, ArrowRight, ArrowUpRight, ChevronsRight } from 'lucide-react';
import { getViewHref } from '../lib/viewUrls';
import { darkArtwork, darkPageArtwork } from '../lib/darkArtwork';

const galleryArtwork = ['chapters', 'emotions', 'audio', 'chat', 'about'].map((view) => darkPageArtwork[view]);

const openArtwork = (event, view, onViewChange) => {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  onViewChange(view);
};

const DarkHomeView = ({ onViewChange, chapters, readingProgress }) => (
  <div className="dark-mode-home">
    <section className="dark-mode-hero">
      <div className="dark-mode-hero-copy">
        <div className="dark-mode-hero-topline"><span>BHAGAVAD GITA</span><span>01 - 18</span></div>
        <p className="dark-mode-eyebrow">A study edition for the moment before action</p>
        <h1><span>FACE THE</span><strong>QUESTION.</strong></h1>
        <p className="dark-mode-hero-description">Eighteen chapters. A dialogue that stays with you. Read the text, hear each verse, and return when you need it.</p>
        <div className="dark-mode-hero-actions">
          <a href={getViewHref('chapters')} onClick={(event) => { event.preventDefault(); onViewChange('chapters'); }} className="dark-mode-action-primary">Enter the chapters <ArrowRight size={20} /></a>
          {readingProgress && <a href={getViewHref('chapters', readingProgress.chapter, readingProgress.verse)} onClick={(event) => { event.preventDefault(); onViewChange('chapters', readingProgress.chapter, readingProgress.verse); }} className="dark-mode-action-secondary">Resume {String(readingProgress.chapter).padStart(2, '0')}.{String(readingProgress.verse).padStart(2, '0')} <ArrowRight size={17} /></a>}
        </div>
        <div className="dark-mode-hero-bottom"><span>READ / LISTEN / REFLECT</span><ArrowDownRight size={22} aria-hidden="true" /></div>
      </div>
      <a className="dark-mode-hero-art" href={getViewHref(darkArtwork[0].view)} onClick={(event) => openArtwork(event, darkArtwork[0].view, onViewChange)}>
        <img src={darkArtwork[0].src} alt={darkArtwork[0].alt} width="735" height="978" fetchPriority="high" />
        <span className="dark-mode-hero-art-caption">THE FIELD / THE CHARIOT <span>Saved verses <ArrowUpRight size={16} aria-hidden="true" /></span></span>
      </a>
    </section>

    <section className="dark-mode-artwork-section" aria-labelledby="dark-mode-artwork-heading">
      <div className="dark-mode-section-intro">
        <div><p className="dark-mode-eyebrow">Visual archive / 01 - 05</p><h2 id="dark-mode-artwork-heading">One text.<br /><em>Many ways in.</em></h2></div>
        <p>The Gita begins as Arjuna faces a crisis on the battlefield. Krishna's dialogue with him explores action, knowledge, devotion, and the self.</p>
      </div>
      <div className="dark-mode-artwork-track">
        {galleryArtwork.map((artwork) => (
          <a className="dark-mode-artwork-card" key={artwork.src} href={getViewHref(artwork.view)} onClick={(event) => openArtwork(event, artwork.view, onViewChange)}>
            <span className="dark-mode-artwork-image"><img src={artwork.src} alt={artwork.alt} loading="lazy" decoding="async" /></span>
            <span className="dark-mode-artwork-caption"><span>{artwork.index} / {artwork.label}</span><span className="dark-mode-artwork-cue">{artwork.pageLabel} <ArrowUpRight size={14} aria-hidden="true" /></span></span>
          </a>
        ))}
      </div>
    </section>

    <section className="dark-mode-chapters" aria-labelledby="dark-mode-chapters-heading">
      <div className="dark-mode-section-intro">
        <div><p className="dark-mode-eyebrow">The reading path / 01 - 18</p><h2 id="dark-mode-chapters-heading">Every chapter<br /><em>opens a door.</em></h2></div>
        <p>Move through the Bhagavad Gita at your pace. Each chapter leads to its verse reader, recitation, and context.</p>
      </div>
      <div className="dark-mode-chapter-grid">
        {chapters.map((chapter) => (
          <a key={chapter.number} href={getViewHref('chapters', chapter.number)} onClick={(event) => { event.preventDefault(); onViewChange('chapters', chapter.number); }} className="dark-mode-chapter-card">
            <span className="dark-mode-chapter-index">CHAPTER / {String(chapter.number).padStart(2, '0')}</span>
            <span className="dark-mode-chapter-number" aria-hidden="true">{String(chapter.number).padStart(2, '0')}</span>
            <span className="dark-mode-chapter-name">{chapter.name}</span>
            <span className="dark-mode-chapter-cue" aria-hidden="true">Read <ChevronsRight size={20} /></span>
          </a>
        ))}
      </div>
    </section>
    <footer className="dark-mode-footer"><span>BHEESHMA</span><span>READ · REFLECT · RETURN</span></footer>
  </div>
);

export default DarkHomeView;
