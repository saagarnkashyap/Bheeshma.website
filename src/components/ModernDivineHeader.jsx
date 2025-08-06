import React from 'react';
import { motion } from 'framer-motion';
import cosmicPortal from '../assets/images/cosmic-portal.jpg';
import etherealNebula from '../assets/images/ethereal-nebula.jpg';
import '../App.css';

const ModernDivineHeader = ({ 
  title, 
  subtitle, 
  showOm = true, 
  backgroundImage = 'cosmic',
  height = 'h-96'
}) => {
  const backgroundImages = {
    cosmic: cosmicPortal,
    ethereal: etherealNebula,
    none: null
  };

  const selectedBg = backgroundImages[backgroundImage];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className={`relative ${height} flex items-center justify-center overflow-hidden rounded-3xl mb-12`}
      style={{
        background: selectedBg 
          ? `linear-gradient(rgba(11, 20, 38, 0.7), rgba(42, 27, 61, 0.8)), url(${selectedBg})`
          : 'linear-gradient(135deg, var(--cosmic-blue) 0%, var(--deep-purple) 50%, var(--ethereal-purple) 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Cosmic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-cosmic-blue/60 via-deep-purple/40 to-ethereal-purple/60" />
      
      {/* Sacred Geometry Overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-golden-amber/30 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 border border-sacred-saffron/30 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-soft-gold/20 rounded-full animate-pulse" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-golden-amber/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.4, 0.8, 0.4],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        {showOm && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1.5, delay: 0.5, type: "spring" }}
            className="text-6xl md:text-8xl text-golden-amber mb-6 font-sanskrit"
            style={{
              filter: 'drop-shadow(0 0 20px rgba(244, 162, 97, 0.6))',
              textShadow: '0 0 30px rgba(244, 162, 97, 0.8)'
            }}
          >
            ॐ
          </motion.div>
        )}
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="font-heading text-4xl md:text-6xl lg:text-7xl text-white mb-6 leading-tight"
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f4a261 50%, #e76f51 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 0 40px rgba(244, 162, 97, 0.3)'
          }}
        >
          {title}
        </motion.h1>
        
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="font-body text-lg md:text-xl text-soft-gold leading-relaxed max-w-3xl mx-auto"
            style={{
              textShadow: '0 0 20px rgba(242, 233, 228, 0.3)'
            }}
          >
            {subtitle}
          </motion.p>
        )}
        
        {/* Divine Separator */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 1.2 }}
          className="mt-8 mx-auto w-32 h-px bg-gradient-to-r from-transparent via-golden-amber to-transparent"
        />
        
        {/* Sacred Symbol */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="mt-6 text-2xl text-golden-amber"
        >
          ✦
        </motion.div>
      </div>

      {/* Bottom Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cosmic-blue/80 to-transparent" />
    </motion.div>
  );
};

export default ModernDivineHeader;

