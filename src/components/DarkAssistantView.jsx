import React from 'react';
import { ArrowRight, Brain, Search, Sparkles } from 'lucide-react';
import { getViewHref } from '../lib/viewUrls';

const DarkAssistantView = ({ onViewChange }) => {
  const navigate = (event, view) => {
    event.preventDefault();
    onViewChange(view);
  };

  return (
  <div className="dark-assistant-page">
    <div className="dark-assistant-grid">
      <header className="dark-assistant-header">
        <p className="dark-home-kicker">The inner battlefield</p>
        <h1>Ask the text<br /><span>what moves you.</span></h1>
        <p>
          A guided space for questions about chapters, verses, and life.
        </p>
      </header>

      <section className="dark-assistant-panel" aria-label="Assistant preparation notice">
        <div className="dark-assistant-symbol"><Brain className="h-12 w-12" /></div>
        <h2>Start with the question beneath the question.</h2>
        <p>
          Assistant coming soon. Until then, use Guidance to enter through a feeling or challenge.
        </p>
        <div className="dark-assistant-links">
          <a href={getViewHref('emotions')} onClick={(event) => navigate(event, 'emotions')}><Search className="h-4 w-4" /> Browse guidance <ArrowRight className="h-4 w-4" /></a>
          <a href={getViewHref('chapters')} onClick={(event) => navigate(event, 'chapters')}><Sparkles className="h-4 w-4" /> Open the chapters <ArrowRight className="h-4 w-4" /></a>
        </div>
      </section>

    </div>
  </div>
  );
};

export default DarkAssistantView;
