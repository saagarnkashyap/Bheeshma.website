import React from 'react';
import { ArrowDownRight, ArrowRight, ChevronsRight } from 'lucide-react';
import { getViewHref } from '../lib/viewUrls';
import { darkArtwork } from '../lib/darkArtwork';

const DarkThreeHomeView = ({ onViewChange, chapters, readingProgress }) => (
  <div className="dark-three-home">
    <section className="dark-three-hero">
      <div className="dark-three-hero-copy">
        <div className="dark-three-hero-topline"><span>BHAGAVAD GITA</span><span>01 - 18</span></div>
        <p className="dark-three-eyebrow">A study edition for the moment before action</p>
        <h1><span>FACE THE</span><strong>QUESTION.</strong></h1>
        <p className="dark-three-hero-description">Eighteen chapters. A dialogue that stays with you. Read the text, hear each verse, and return when you need it.</p>
        <div className="dark-three-hero-actions">
          <a href={getViewHref('chapters')} onClick={(event) => { event.preventDefault(); onViewChange('chapters'); }} className="dark-three-action-primary">Enter the chapters <ArrowRight size={20} /></a>
          {readingProgress && <a href={getViewHref('chapters', readingProgress.chapter, readingProgress.verse)} onClick={(event) => { event.preventDefault(); onViewChange('chapters', readingProgress.chapter, readingProgress.verse); }} className="dark-three-action-secondary">Resume {String(readingProgress.chapter).padStart(2, '0')}.{String(readingProgress.verse).padStart(2, '0')} <ArrowRight size={17} /></a>}
        </div>
        <div className="dark-three-hero-bottom"><span>READ / LISTEN / REFLECT</span><ArrowDownRight size={22} aria-hidden="true" /></div>
      </div>
      <figure className="dark-three-hero-art">
        <img src={darkArtwork[0].src} alt={darkArtwork[0].alt} width="735" height="978" fetchPriority="high" />
        <figcaption>ARTWORK / THE FIELD <span>001</span></figcaption>
      </figure>
    </section>

    <section className="dark-three-artwork-section" aria-labelledby="dark-three-artwork-heading">
      <div className="dark-three-section-intro">
        <div><p className="dark-three-eyebrow">Visual archive / 02 - 06</p><h2 id="dark-three-artwork-heading">One text.<br /><em>Many ways in.</em></h2></div>
        <p>The same verses across every edition. These original artworks set the atmosphere around the reading, while the text stays clear.</p>
      </div>
      <div className="dark-three-artwork-track">
        {darkArtwork.slice(1).map((artwork, index) => (
          <figure className={`dark-three-artwork-card dark-three-artwork-card-${index + 2}`} key={artwork.src}>
            <div className="dark-three-artwork-image"><img src={artwork.src} alt={artwork.alt} loading="lazy" decoding="async" /></div>
            <figcaption><span>{String(index + 2).padStart(2, '0')} / {artwork.label}</span><span>ARCHIVE</span></figcaption>
          </figure>
        ))}
      </div>
    </section>

    <section className="dark-three-chapters" aria-labelledby="dark-three-chapters-heading">
      <div className="dark-three-section-intro">
        <div><p className="dark-three-eyebrow">The reading path / 01 - 18</p><h2 id="dark-three-chapters-heading">Every chapter<br /><em>opens a door.</em></h2></div>
        <p>Move through the Bhagavad Gita at your pace. Each chapter leads to its verse reader, recitation, and context.</p>
      </div>
      <div className="dark-three-chapter-grid">
        {chapters.map((chapter) => (
          <a key={chapter.number} href={getViewHref('chapters', chapter.number)} onClick={(event) => { event.preventDefault(); onViewChange('chapters', chapter.number); }} className="dark-three-chapter-card">
            <span className="dark-three-chapter-index">CHAPTER / {String(chapter.number).padStart(2, '0')}</span>
            <span className="dark-three-chapter-number" aria-hidden="true">{String(chapter.number).padStart(2, '0')}</span>
            <span className="dark-three-chapter-name">{chapter.name}</span>
            <span className="dark-three-chapter-cue" aria-hidden="true">Read <ChevronsRight size={20} /></span>
          </a>
        ))}
      </div>
    </section>
    <footer className="dark-three-footer"><span>BHEESHMA</span><span>READ · REFLECT · RETURN</span></footer>
  </div>
);

export default DarkThreeHomeView;
