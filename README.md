# <img src="Bheeshma%20logo.png" alt="Bheeshma Logo" width="25" height="25"> Bheeshma - Divine Bhagavad Gita

A modern, interactive React web application that brings the timeless wisdom of the Bhagavad Gita to the digital age. Named after the great warrior-sage Bhishma, this platform offers an immersive spiritual experience for exploring the 18 chapters and 700 verses of this sacred text.
<p align="center">
  <img src="Bheeshma%20logo.png" alt="Bheeshma Logo" width="150" height="150">
</p>

## Features

### Complete Sacred Text
- All 18 chapters with 700 verses
- Sanskrit text with accurate transliterations
- English meanings and interpretations
- Life applications for practical wisdom

### Emotion-Based Guidance
- Search verses by emotions and life challenges
- 20+ categories including Fear, Anger, Depression, Confusion
- Personalized spiritual guidance for modern problems
- Interactive emotion cards with verse recommendations

### Audio Experience
- High-quality Sanskrit recitations from Gita Supersite
- Full-featured audio player with controls
- Chapter and verse navigation
- Download audio for offline listening
- Autoplay and repeat functionality

### Divine Aesthetics
- Floating sacred particles and Om symbols
- Chakra-themed color palette
- Glass morphism effects and smooth animations
- Responsive design for all devices
- Custom Sanskrit typography

### Interactive Features
- Progress tracking with localStorage
- Bookmarking favorite verses
- Share verses on social media
- Quick navigation between chapters
- Expandable life application sections

## Technology Stack

- **Frontend**: React 19 with Vite
- **Styling**: TailwindCSS with custom divine theme
- **Animations**: Framer Motion + AOS
- **Icons**: Lucide React
- **Audio**: HTML5 Audio API
- **Data**: JSON-based verse database
- **Deployment**: Vercel/Netlify ready

## Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bheeshma-divine
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Start development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

## Responsive Design

Bheeshma is fully responsive and optimized for:
- 📱 Mobile devices (375px+)
- 📟 Tablets (768px+)
- 💻 Laptops (1024px+)
- 🖥️ Desktop (1440px+)


## Data Structure

The comprehensive JSON database:

```json
{
  "chapter_number": 1,
  "chapter_name": "Arjuna Visada Yoga",
  "shlokas": [
    {
      "shloka_number": 1,
      "sanskrit_text": "धृतराष्ट्र उवाच...",
      "transliteration": "dhṛtarāṣṭra uvāca...",
      "meaning": "Dhritarashtra said...",
      "life_application": "Practical wisdom...",
      "keywords": ["dharma", "conflict"],
      "addresses_problems": ["fear", "confusion"]
    }
  ]
}
```

## Audio Integration

Audio recitations are sourced from the prestigious **Gita Supersite (IIT Kanpur)**:
- URL Pattern: `https://www.gitasupersite.iitk.ac.in/srimad/sloka/audio/{chapter}/{chapter}_{verse}.mp3`
- High-quality Sanskrit pronunciation
- Chapter-wise organization
- Graceful fallback for unavailable audio

## Emotion-Based Search

The application maps verses to human emotions and challenges:

### Supported Emotions
- **Negative**: Anger, Fear, Depression, Anxiety, Confusion, Doubt
- **Challenges**: Death of loved one, Discrimination, Loneliness, Pride
- **Positive**: Seeking peace, Practicing forgiveness, Spiritual growth

### Search Algorithm
1. Keywords extracted from verse content
2. Semantic mapping to emotional categories  
3. Relevance scoring based on context
4. Filtered results with explanations


## Contributing 🤝

We welcome contributions to make Bheeshma even more divine! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request


## License 📄 

This project is open source and available under the [MIT License](LICENSE).

## Credits & Acknowledgments 🙏 

### Data Sources
- **Gita Supersite (IIT Kanpur)** - Sanskrit audio recitations and verse data
- **Traditional Sanskrit Texts** - Authentic verses and translations

### Inspiration
This project is dedicated to Lord Krishna and all the great teachers who have preserved and shared the wisdom of the Bhagavad Gita throughout the ages.

## Support 📞

For questions, suggestions, or spiritual discussions:
- Create an issue on GitHub
- Email: saagarcourses@gmail.com
- Linkedin: [[@saagarnkashyap](https://www.linkedin.com/in/saagar-n-kashyap/)]

---


> *"You have the right to perform your actions, but never to the fruits of action"*  
> — Bhagavad Gita 2.47

This digital offering is created with devotion and offered freely to all seekers. May it serve as a bridge between ancient wisdom and modern hearts.

**सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः**  
*May all beings be happy, may all beings be free from illness*

---

Made with Bhakti and Devotion towards Lord Krishna

Sarva Loka Sukhino Bhavantu 🙏
