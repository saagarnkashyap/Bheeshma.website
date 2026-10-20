import React from 'react';
import { ArrowRight, Circle } from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import { getViewHref } from '../lib/viewUrls';
import krishnaArjunaChariot from '../assets/images/krishna-arjuna-chariot.webp';
import '../App.css';

const DarkHomeClassicView = ({ onViewChange, chapters, readingProgress }) => (
  <div className="dark-home-page">
    <Motion.section
      className="dark-home-hero"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.65, ease: 'easeOut' }}
    >
      <div className="dark-home-hero-grid">
        <div className="dark-home-copy">
          <p className="dark-home-kicker">Bhagavad Gita / Study edition</p>
          <h1 className="dark-home-title">
            <span>Bhagavad</span>
            <span>Gita</span>
          </h1>
          <div className="dark-home-rule" aria-hidden="true"><span /> <Circle className="h-2 w-2 fill-current" /> <span /></div>
          <p className="dark-home-sanskrit font-sanskrit">यत् भावो, तत् भवति</p>
          <p className="dark-home-translation">You become what you believe.</p>
          <p className="dark-home-description">
            A living study edition for the moment before action — read the verse, face the conflict,
            and choose your dharma.
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
              Enter the text
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
          <div className="dark-home-art-frame" />
          <img src={krishnaArjunaChariot} alt="Illustration of Krishna and Arjuna in the chariot" />
        </figure>
      </div>
    </Motion.section>

    <section className="dark-home-chapters">
      <div className="dark-home-section-heading">
        <div>
          <p className="dark-home-kicker">The field of action</p>
          <h2>Choose your chapter.</h2>
        </div>
        <p>Sanskrit, transliteration, and English.</p>
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
            <span className="dark-home-chapter-number">{chapter.number}</span>
            <span className="dark-home-chapter-name">{chapter.name.replace(/ Yoga$/, '')}</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        ))}
      </div>
    </section>
  </div>
);

export default DarkHomeClassicView;
