import React from 'react';
import { ArrowRight, BookOpen, Heart, Info, MessageCircle, Music } from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import { getViewHref } from '../lib/viewUrls';
import '../App.css';

const sectionItems = [
  {
    id: 'chapters',
    label: 'Read the chapters',
    description: 'Move through the complete text, one verse at a time.',
    icon: BookOpen,
  },
  {
    id: 'emotions',
    label: 'Find guidance',
    description: 'Discover passages connected to feelings and life questions.',
    icon: Heart,
  },
  {
    id: 'audio',
    label: 'Listen to recitations',
    description: 'Hear the Sanskrit and stay with the rhythm of each verse.',
    icon: Music,
  },
  {
    id: 'chat',
    label: 'Ask the assistant',
    description: 'Bring a question about the text into the conversation.',
    icon: MessageCircle,
  },
  {
    id: 'about',
    label: 'About Bheeshma',
    description: 'Learn about this digital study edition and its sources.',
    icon: Info,
  },
];

const SectionLinks = ({ onViewChange, exclude = [], title = 'Keep exploring', description }) => {
  const links = sectionItems.filter((item) => !exclude.includes(item.id));

  return (
    <section className="section-links" aria-labelledby="section-links-title">
      <div className="section-links-heading">
        <div>
          <p className="section-kicker mb-3">Next steps</p>
          <h2 id="section-links-title" className="font-heading text-3xl text-cosmic-blue sm:text-4xl">
            {title}
          </h2>
        </div>
        {description && <p className="max-w-sm text-sm leading-7 text-soft-gold">{description}</p>}
      </div>

      <div className="section-links-grid">
        {links.map(({ id, label, description: itemDescription, icon: Icon }, index) => (
          <Motion.a
            key={id}
            href={getViewHref(id)}
            onClick={(event) => {
              event.preventDefault();
              onViewChange(id);
            }}
            className="section-link-card"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.35, delay: index * 0.04 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.99 }}
          >
            <span className="section-link-icon">
              {React.createElement(Icon, { className: 'h-4 w-4', strokeWidth: 1.7 })}
            </span>
            <span className="mt-6 block font-heading text-xl text-cosmic-blue">{label}</span>
            <span className="mt-2 block text-sm leading-6 text-soft-gold">{itemDescription}</span>
            <span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-golden-amber">
              Open <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Motion.a>
        ))}
      </div>
    </section>
  );
};

export default SectionLinks;
