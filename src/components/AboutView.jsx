import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ExternalLink, Github, Globe, Music, Book, Code } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import DivineHeader from './DivineHeader';
import '../App.css';

const AboutView = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <DivineHeader 
        title="About Bheeshma"
        subtitle="A modern, interactive digital experience of the timeless wisdom of the Bhagavad Gita, crafted with love and reverence for the ancient teachings."
        showOm={true}
      />

      {/* Project Description */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="mb-12"
      >
        <Card className="verse-card">
          <CardHeader>
            <CardTitle className="text-golden-amber flex items-center">
              <Book className="w-6 h-6 mr-3" />
              About This Project
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-soft-gold">
            <p>
              Bheeshma is a modern React-based web application that brings the divine wisdom of the 
              Bhagavad Gita to the digital age. Named after the great warrior and devotee Bhishma, 
              this platform offers an immersive, interactive experience for exploring the 18 chapters 
              and 700 verses of this sacred text.
            </p>
            <p>
              The application features Sanskrit verses with transliterations, English meanings, 
              life applications, emotion-based verse search, and high-quality audio recitations. 
              It's designed to help modern seekers find guidance and wisdom for their daily challenges 
              through the timeless teachings of Lord Krishna.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.4 }}
        className="mb-12"
      >
        <Card className="verse-card">
          <CardHeader>
            <CardTitle className="text-golden-amber">Key Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FeatureItem
                icon={<Book className="w-5 h-5" />}
                title="Complete Text"
                description="All 18 chapters with 700 verses in Sanskrit, transliteration, and English"
              />
              <FeatureItem
                icon={<Heart className="w-5 h-5" />}
                title="Life Guidance"
                description="Emotion-based search to find verses for specific life challenges"
              />
              <FeatureItem
                icon={<Music className="w-5 h-5" />}
                title="Audio Experience"
                description="High-quality Sanskrit recitations with full playback controls"
              />
              <FeatureItem
                icon={<Code className="w-5 h-5" />}
                title="Modern Design"
                description="Responsive, accessible design with divine aesthetics and animations"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Credits */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.6 }}
        className="mb-12"
      >
        <Card className="verse-card">
          <CardHeader>
            <CardTitle className="text-golden-amber">Credits & Acknowledgments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <CreditItem
              icon={<Globe className="w-5 h-5" />}
              title="Gita Supersite (IIT Kanpur)"
              description="Sanskrit audio recitations and verse data"
              link="https://www.gitasupersite.iitk.ac.in/"
            />
            <CreditItem
              icon={<Book className="w-5 h-5" />}
              title="Sanskrit Text & Translations"
              description="Authentic Sanskrit verses with transliterations and meanings"
            />
            <CreditItem
              icon={<Code className="w-5 h-5" />}
              title="Technology Stack"
              description="Built with React, Framer Motion, TailwindCSS, and modern web technologies"
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Typography Credits */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.8 }}
        className="mb-12"
      >
        <Card className="verse-card">
          <CardHeader>
            <CardTitle className="text-golden-amber">Typography & Design</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-soft-gold">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <h4 className="font-sanskrit text-xl text-golden-amber mb-2">Sanskrit Font</h4>
                <p className="text-sm">For Devanagari script</p>
              </div>
              <div className="text-center">
                <h4 className="font-heading text-xl text-golden-amber mb-2">Diomag</h4>
                <p className="text-sm">For headings and titles</p>
              </div>
              <div className="text-center">
                <h4 className="font-body text-xl text-golden-amber mb-2">Barter</h4>
                <p className="text-sm">For body text and UI</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Spiritual Note */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 2.0 }}
      >
        <Card className="verse-card border-2 border-golden-amber/30">
          <CardContent className="p-8 text-center">
            <div className="text-4xl text-golden-amber mb-4">ॐ</div>
            <h3 className="font-heading text-xl text-golden-amber mb-4">
              Dedicated to the Divine
            </h3>
            <p className="text-soft-gold leading-relaxed mb-4">
              This project is offered with devotion to Lord Krishna and all the great teachers 
              who have preserved and shared the wisdom of the Bhagavad Gita throughout the ages. 
              May this digital offering serve as a bridge between ancient wisdom and modern seekers.
            </p>
            <div className="text-golden-amber font-sanskrit text-lg">
              सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः
            </div>
            <div className="text-soft-gold text-sm mt-2 italic">
              May all beings be happy, may all beings be free from illness
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

const FeatureItem = ({ icon, title, description }) => {
  return (
    <motion.div 
      className="flex items-start space-x-3"
      whileHover={{ x: 4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="text-golden-amber mt-1">{icon}</div>
      <div>
        <h4 className="font-semibold text-golden-amber mb-1">{title}</h4>
        <p className="text-sm text-soft-gold">{description}</p>
      </div>
    </motion.div>
  );
};

const CreditItem = ({ icon, title, description, link }) => {
  return (
    <motion.div 
      className="flex items-start space-x-3"
      whileHover={{ x: 4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="text-golden-amber mt-1">{icon}</div>
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <h4 className="font-semibold text-golden-amber">{title}</h4>
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sacred-saffron hover:text-golden-amber divine-transition"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
        <p className="text-sm text-soft-gold mt-1">{description}</p>
      </div>
    </motion.div>
  );
};

export default AboutView;

