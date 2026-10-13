import React from 'react';
import { Book, Code, ExternalLink, Globe, Heart, Music } from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import SectionLinks from './SectionLinks';
import '../App.css';

const AboutView = ({ onViewChange }) => (
  <div className="reading-shell px-5 py-10 lg:px-10 lg:py-14 xl:px-16">
    <div className="mx-auto max-w-4xl">
      <header className="about-intro">
        <p className="section-kicker mb-4">About this edition</p>
        <h1 className="font-heading text-4xl text-cosmic-blue sm:text-5xl">About Bheeshma</h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-soft-gold">
          A focused digital edition of the Bhagavad Gita for reading, reference, and listening.
        </p>
      </header>

      <div className="about-content mt-16">
        <AboutSection icon={Book} label="Purpose" title="A clear interface for a substantial text.">
          <p>
            Bheeshma brings the 18 chapters and 700 verses of the Bhagavad Gita into one calm,
            readable place. Sanskrit, transliteration, meaning, life applications, and audio sit
            together without asking the reader to rush.
          </p>
          <p>
            The project is named after Bhishma, a central figure in the Mahabharata and a
            representative of duty, discipline, and sustained study.
          </p>
        </AboutSection>

        <AboutSection icon={Heart} label="Contents" title="The main study tools.">
          <div className="about-feature-grid">
            <FeatureItem icon={Book} title="Complete text" description="All chapters with Sanskrit, transliteration, and English meaning." />
            <FeatureItem icon={Heart} title="Life guidance" description="A way to find passages for particular inner states and challenges." />
            <FeatureItem icon={Music} title="Recitation" description="Audio for listening to the sound and rhythm of each verse." />
            <FeatureItem icon={Code} title="Open craft" description="A thoughtful, responsive interface built for slow reading." />
          </div>
        </AboutSection>

        <AboutSection icon={Globe} label="Sources and thanks" title="Built on careful work that came before.">
          <CreditItem
            icon={Globe}
            title="Gita Supersite (IIT Kanpur)"
            description="Audio recitations and reference material."
            link="https://www.gitasupersite.iitk.ac.in/"
          />
          <CreditItem
            icon={Book}
            title="Sanskrit text and translations"
            description="Traditional verses, transliterations, and meanings used in the reading experience."
          />
          <CreditItem
            icon={Code}
            title="Technology"
            description="React, Framer Motion, TailwindCSS, and the open web."
          />
        </AboutSection>

        <Motion.section
          className="about-dedication"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="font-sanskrit text-4xl text-golden-amber">ॐ</p>
          <p className="mt-5 font-heading text-2xl text-paper">For reading and study.</p>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-paper/65">
            This project is offered with gratitude to everyone who has preserved, studied, and
            shared the Gita. May it help one person find a little more steadiness.
          </p>
          <p className="mt-7 font-sanskrit text-lg text-saffron-light">सर्वे भवन्तु सुखिनः</p>
          <p className="mt-1 text-xs uppercase tracking-[0.14em] text-paper/45">May all beings be happy.</p>
        </Motion.section>

        <SectionLinks
          onViewChange={onViewChange}
          exclude={['about']}
          title="Return to the text."
          description="Choose where you would like to continue your study."
        />
      </div>
    </div>
  </div>
);

const AboutSection = ({ icon, label, title, children }) => (
  <section className="about-section">
    <div className="about-section-label">{React.createElement(icon, { className: 'h-4 w-4' })} {label}</div>
    <h2 className="font-heading text-2xl text-cosmic-blue sm:text-3xl">{title}</h2>
    <div className="about-section-copy mt-6">{children}</div>
  </section>
);

const FeatureItem = ({ icon, title, description }) => (
  <div className="about-feature-item">
    {React.createElement(icon, { className: 'h-4 w-4 shrink-0 text-golden-amber' })}
    <div>
      <p className="font-semibold text-cosmic-blue">{title}</p>
      <p className="mt-1 text-sm leading-6 text-soft-gold">{description}</p>
    </div>
  </div>
);

const CreditItem = ({ icon, title, description, link }) => (
  <div className="about-credit-item">
    {React.createElement(icon, { className: 'mt-1 h-4 w-4 shrink-0 text-golden-amber' })}
    <div>
      <div className="flex items-center gap-2">
        <p className="font-semibold text-cosmic-blue">{title}</p>
        {link && (
          <a href={link} target="_blank" rel="noopener noreferrer" className="text-golden-amber hover:text-sacred-saffron" aria-label={`Open ${title}`}>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
      <p className="mt-1 text-sm leading-6 text-soft-gold">{description}</p>
    </div>
  </div>
);

export default AboutView;
