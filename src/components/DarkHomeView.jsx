import React from 'react';
import { ArrowRight, MoveDownRight } from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import { getViewHref } from '../lib/viewUrls';
import '../App.css';

const krishnaArtwork = '/other%20pics/dark%20theme/840377761_1084744031133592_1741248250194744511_n.jpg';

const DarkHomeView = ({ onViewChange, chapters, readingProgress }) => (
  <div className="dark-home-page">
    <Motion.section
      className="dark-home-hero"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.65, ease: 'easeOut' }}
    >
      <div className="dark-home-hero-grid">
        <div className="dark-home-copy">
          <p className="dark-home-kicker"><span className="dark-home-kicker-mark" aria-hidden="true" /> A study edition for right now</p>
          <h1 className="dark-home-title">
            <span>Bhagavad</span>
            <span>Gita</span>
          </h1>
          <p className="dark-home-description">
            An ancient dialogue for the questions you carry today. Read a passage, hear its recitation,
            and find room to reflect.
          </p>
          <div className="dark-home-actions">
            <a
              href={getViewHref('chapters')}
              className="dark-home-primary-action"
              onClick={(event) => {
                event.preventDefault();
                onViewChange('chapters');
              }}
            >
              Start reading
              <ArrowRight className="h-4 w-4" />
            </a>
            {readingProgress && (
              <a
                href={getViewHref('chapters', readingProgress.chapter, readingProgress.verse)}
                className="dark-home-secondary-action"
                onClick={(event) => {
                  event.preventDefault();
                  onViewChange('chapters', readingProgress.chapter, readingProgress.verse);
                }}
              >
                Resume {String(readingProgress.chapter).padStart(2, '0')}.{String(readingProgress.verse).padStart(2, '0')}
              </a>
            )}
          </div>
        </div>

        <figure className="dark-home-art">
          <div className="dark-home-art-frame">
            <img src={krishnaArtwork} width="736" height="736" fetchPriority="high" alt="Contemporary blue and gold illustration of Krishna" />
          </div>
          <figcaption>Art / Krishna in blue and gold <span>01 — 18</span></figcaption>
        </figure>
      </div>
      <div className="dark-home-hero-footer" aria-hidden="true"><span>18 chapters · 701 verses</span><MoveDownRight size={18} /><span>Scroll to explore</span></div>
    </Motion.section>

    <section className="dark-home-chapters">
      <div className="dark-home-section-heading">
        <div>
          <p className="dark-home-kicker">The reading path / 01—18</p>
          <h2>Explore the chapters<span>.</span></h2>
        </div>
        <p>Every chapter opens the same text in Sanskrit, transliteration, and English.</p>
      </div>
      <div className="dark-home-chapter-grid">
        {chapters.map((chapter) => (
          <a
            key={chapter.number}
            href={getViewHref('chapters', chapter.number)}
            className="dark-home-chapter-card"
            onClick={(event) => {
              event.preventDefault();
              onViewChange('chapters', chapter.number);
            }}
          >
            <span className="dark-home-chapter-number">{String(chapter.number).padStart(2, '0')}</span>
            <span className="dark-home-chapter-name">{chapter.name}</span>
            <span className="dark-home-chapter-action">Read chapter</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        ))}
      </div>
    </section>
    <footer className="dark-home-footer"><span>Bheeshma / Bhagavad Gita study edition</span><span>Read · Reflect · Return</span></footer>
  </div>
);

export default DarkHomeView;
