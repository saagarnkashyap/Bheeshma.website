# 🕉️ Bheeshma - Divine Bhagavad Gita

A modern, interactive React web application that brings the timeless wisdom of the Bhagavad Gita to the digital age. Named after the great warrior-sage Bhishma, this platform offers an immersive spiritual experience for exploring the 18 chapters and 700 verses of this sacred text.

![Bheeshma Screenshot](https://via.placeholder.com/800x400/1a1b3a/f4a261?text=Bheeshma+Divine+Interface)

## ✨ Features

### 📖 Complete Sacred Text
- All 18 chapters with 700 verses
- Sanskrit text with accurate transliterations
- English meanings and interpretations
- Life applications for practical wisdom

### 💝 Emotion-Based Guidance
- Search verses by emotions and life challenges
- 20+ categories including Fear, Anger, Depression, Confusion
- Personalized spiritual guidance for modern problems
- Interactive emotion cards with verse recommendations

### 🎵 Audio Experience
- High-quality Sanskrit recitations from Gita Supersite
- Full-featured audio player with controls
- Chapter and verse navigation
- Download audio for offline listening
- Autoplay and repeat functionality

### 🎨 Divine Aesthetics
- Floating sacred particles and Om symbols
- Chakra-themed color palette
- Glass morphism effects and smooth animations
- Responsive design for all devices
- Custom Sanskrit typography

### 🔮 Interactive Features
- Progress tracking with localStorage
- Bookmarking favorite verses
- Share verses on social media
- Quick navigation between chapters
- Expandable life application sections

## 🛠️ Technology Stack

- **Frontend**: React 19 with Vite
- **Styling**: TailwindCSS with custom divine theme
- **Animations**: Framer Motion + AOS
- **Icons**: Lucide React
- **Audio**: HTML5 Audio API
- **Data**: JSON-based verse database
- **Deployment**: Vercel/Netlify ready

## 🚀 Quick Start

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

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
pnpm build
# or
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

## 📱 Responsive Design

Bheeshma is fully responsive and optimized for:
- 📱 Mobile devices (375px+)
- 📟 Tablets (768px+)
- 💻 Laptops (1024px+)
- 🖥️ Desktop (1440px+)

## 🎨 Design System

### Color Palette
- **Cosmic Blue**: `#1a1b3a` - Primary background
- **Golden Amber**: `#f4a261` - Primary accent
- **Sacred Saffron**: `#e76f51` - Secondary accent
- **Soft Gold**: `#e9c46a` - Text highlights
- **Chakra Colors**: Full spectrum for emotion categories

### Typography
- **Sanskrit Font**: For Devanagari script
- **Diomag**: Headings and titles
- **Barter**: Body text and UI elements

## 📚 Data Structure

The application uses a comprehensive JSON database containing:

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

## 🎵 Audio Integration

Audio recitations are sourced from the prestigious **Gita Supersite (IIT Kanpur)**:
- URL Pattern: `https://www.gitasupersite.iitk.ac.in/srimad/sloka/audio/{chapter}/{chapter}_{verse}.mp3`
- High-quality Sanskrit pronunciation
- Chapter-wise organization
- Graceful fallback for unavailable audio

## 🔍 Emotion-Based Search

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

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Netlify
```bash
# Build the project
pnpm build

# Deploy dist/ folder to Netlify
```

### Manual Deployment
1. Run `pnpm build`
2. Upload `dist/` contents to your web server
3. Configure server for SPA routing

## 🤝 Contributing

We welcome contributions to make Bheeshma even more divine! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Development Guidelines
- Follow React best practices
- Maintain responsive design
- Preserve spiritual aesthetics
- Test on multiple devices
- Document new features

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Credits & Acknowledgments

### Data Sources
- **Gita Supersite (IIT Kanpur)** - Sanskrit audio recitations and verse data
- **Traditional Sanskrit Texts** - Authentic verses and translations

### Technology
- **React Team** - Amazing framework
- **Framer Motion** - Beautiful animations
- **TailwindCSS** - Utility-first styling
- **Lucide** - Beautiful icons

### Inspiration
This project is dedicated to Lord Krishna and all the great teachers who have preserved and shared the wisdom of the Bhagavad Gita throughout the ages.

## 📞 Support

For questions, suggestions, or spiritual discussions:
- Create an issue on GitHub
- Email: [your-email@domain.com]
- Twitter: [@your-handle]

---

## 🕉️ Spiritual Note

> *"You have the right to perform your actions, but never to the fruits of action"*  
> — Bhagavad Gita 2.47

This digital offering is created with devotion and offered freely to all seekers. May it serve as a bridge between ancient wisdom and modern hearts.

**सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः**  
*May all beings be happy, may all beings be free from illness*

---

Made with 💝 and devotion for the divine wisdom of the Bhagavad Gita.

