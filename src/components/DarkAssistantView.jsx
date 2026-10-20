import React from 'react';
import { ArrowRight, Brain, Search, Sparkles } from 'lucide-react';
import { getViewHref } from '../lib/viewUrls';

const DarkAssistantView = ({ onViewChange, darkVersion = '2' }) => {
  const navigate = (event, view) => {
    event.preventDefault();
    onViewChange(view);
  };

  return (
  <div className="dark-assistant-page">
    <div className="dark-assistant-grid">
      <header className="dark-assistant-header">
        <p className="dark-home-kicker">The inner battlefield</p>
        <h1>{darkVersion === '1' ? 'Ask the text' : 'A question can'}<br /><span>{darkVersion === '1' ? 'what moves you.' : 'open a path.'}</span></h1>
        <p>
          {darkVersion === '1'
            ? 'A guided space for questions about chapters, verses, and life.'
            : 'Begin with a feeling, a question, or a passage you want to understand.'}
        </p>
      </header>

      <section className="dark-assistant-panel" aria-label="Assistant preparation notice">
        <div className="dark-assistant-symbol"><Brain className="h-12 w-12" /></div>
        <h2>{darkVersion === '1' ? 'Start with the question beneath the question.' : 'Explore while the assistant is being built.'}</h2>
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
