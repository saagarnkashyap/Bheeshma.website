import React from 'react';
import '../App.css';

const ChakraLoader = ({ isLoading = true, message = "Loading Divine Wisdom..." }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center divine-bg">
      <div className="text-center">
        {/* Chakra Spinning Animation */}
        <div className="relative mb-8">
          <div className="chakra-spin w-24 h-24 mx-auto">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Outer Ring - Root Chakra */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="var(--chakra-red)"
                strokeWidth="2"
                opacity="0.8"
              />
              {/* Second Ring - Sacral Chakra */}
              <circle
                cx="50"
                cy="50"
                r="37"
                fill="none"
                stroke="var(--chakra-orange)"
                strokeWidth="2"
                opacity="0.8"
              />
              {/* Third Ring - Solar Plexus Chakra */}
              <circle
                cx="50"
                cy="50"
                r="29"
                fill="none"
                stroke="var(--chakra-yellow)"
                strokeWidth="2"
                opacity="0.8"
              />
              {/* Fourth Ring - Heart Chakra */}
              <circle
                cx="50"
                cy="50"
                r="21"
                fill="none"
                stroke="var(--chakra-green)"
                strokeWidth="2"
                opacity="0.8"
              />
              {/* Fifth Ring - Throat Chakra */}
              <circle
                cx="50"
                cy="50"
                r="13"
                fill="none"
                stroke="var(--chakra-blue)"
                strokeWidth="2"
                opacity="0.8"
              />
              {/* Sixth Ring - Third Eye Chakra */}
              <circle
                cx="50"
                cy="50"
                r="8"
                fill="none"
                stroke="var(--chakra-indigo)"
                strokeWidth="2"
                opacity="0.8"
              />
              {/* Center - Crown Chakra */}
              <circle
                cx="50"
                cy="50"
                r="3"
                fill="var(--chakra-violet)"
                opacity="0.9"
              />
              
              {/* Sacred Geometry - Flower of Life Pattern */}
              <g opacity="0.3">
                <circle cx="50" cy="35" r="8" fill="none" stroke="var(--golden-amber)" strokeWidth="1"/>
                <circle cx="43" cy="42" r="8" fill="none" stroke="var(--golden-amber)" strokeWidth="1"/>
                <circle cx="57" cy="42" r="8" fill="none" stroke="var(--golden-amber)" strokeWidth="1"/>
                <circle cx="43" cy="58" r="8" fill="none" stroke="var(--golden-amber)" strokeWidth="1"/>
                <circle cx="57" cy="58" r="8" fill="none" stroke="var(--golden-amber)" strokeWidth="1"/>
                <circle cx="50" cy="65" r="8" fill="none" stroke="var(--golden-amber)" strokeWidth="1"/>
              </g>
            </svg>
          </div>
          
          {/* Pulsing Glow Effect */}
          <div className="absolute inset-0 chakra-glow rounded-full opacity-50"></div>
        </div>

        {/* Loading Text */}
        <div className="text-center">
          <h2 className="text-2xl font-heading text-glow mb-4 text-white">
            {message}
          </h2>
          <div className="flex justify-center space-x-1 mb-4">
            <div className="w-2 h-2 bg-golden-amber rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
            <div className="w-2 h-2 bg-sacred-saffron rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
            <div className="w-2 h-2 bg-golden-amber rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
          </div>
          <p className="text-soft-gold font-body text-sm opacity-80">
            "The soul is neither born, and nor does it die" - Bhagavad Gita 2.20
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChakraLoader;

