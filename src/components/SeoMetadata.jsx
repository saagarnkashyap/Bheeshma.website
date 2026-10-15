import { useEffect } from 'react';
import { getViewUrl } from '../lib/viewUrls';

const DEFAULT_METADATA = {
  title: 'Bheeshma | Bhagavad Gita Study Edition',
  description:
    'Explore the complete Bhagavad Gita with Sanskrit verses, transliterations, meanings, life guidance, and recitations.',
};

const getMetadata = (view, chapterNumber, chapterName) => {
  switch (view) {
    case 'chapters':
      return {
        title: `Chapter ${chapterNumber}${chapterName ? ` — ${chapterName}` : ''} | Bhagavad Gita | Bheeshma`,
        description: `Read Bhagavad Gita Chapter ${chapterNumber}${chapterName ? `, ${chapterName},` : ''} with Sanskrit verses, transliteration, English meaning, context, and recitation.`,
      };
    case 'emotions':
      return {
        title: 'Bhagavad Gita Guidance for Life | Bheeshma',
        description:
          'Find relevant Bhagavad Gita verses and practical guidance for emotions, challenges, and everyday life.',
      };
    case 'audio':
      return {
        title: 'Bhagavad Gita Sanskrit Recitations | Bheeshma',
        description:
          'Listen to Sanskrit recitations of the Bhagavad Gita while reading its verses and meanings.',
      };
    case 'chat':
      return {
        title: 'Ask About the Bhagavad Gita | Bheeshma',
        description:
          'Explore questions about Bhagavad Gita chapters, verses, themes, and meanings with Bheeshma.',
      };
    case 'about':
      return {
        title: 'About Bheeshma | Divine Bhagavad Gita',
        description:
          'Learn about Bheeshma, a focused digital study edition of the Bhagavad Gita for reading, reference, and listening.',
      };
    case 'bookmarks':
      return {
        title: 'Saved Bhagavad Gita Verses | Bheeshma',
        description: 'Return to your saved Bhagavad Gita verses and continue your personal reading journey.',
      };
    case 'zen':
      return {
        title: 'Zen Recitation | Bhagavad Gita | Bheeshma',
        description: 'Listen through the Bhagavad Gita in continuous Sanskrit recitation with Devanagari text and transliteration.',
      };
    default:
      return DEFAULT_METADATA;
  }
};

const updateMeta = (selector, content) => {
  const element = document.querySelector(selector);
  if (element) element.setAttribute('content', content);
};

const SeoMetadata = ({ currentView, currentChapter, currentVerse, chapterName }) => {
  useEffect(() => {
    const metadata = getMetadata(currentView, currentChapter, chapterName);
    const pageUrl = getViewUrl(currentView, currentChapter, currentVerse);

    document.title = metadata.title;
    updateMeta('meta[name="description"]', metadata.description);
    updateMeta('meta[property="og:title"]', metadata.title);
    updateMeta('meta[property="og:description"]', metadata.description);
    updateMeta('meta[name="twitter:title"]', metadata.title);
    updateMeta('meta[name="twitter:description"]', metadata.description);
    updateMeta('meta[property="og:url"]', pageUrl);
    updateMeta('meta[name="twitter:url"]', pageUrl);
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', pageUrl);
  }, [chapterName, currentChapter, currentVerse, currentView]);

  return null;
};

export default SeoMetadata;
