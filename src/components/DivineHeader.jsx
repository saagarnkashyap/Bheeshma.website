import React from 'react';
import { motion } from 'framer-motion';

const DivineHeader = ({ title, subtitle, showOm = true }) => {
  return (
    <motion.div 
      className="text-center mb-12 relative"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      {/* Sacred Om Symbol */}
      {showOm && (
        <motion.div
          className="absolute -top-8 left-1/2 transform -translate-x-1/2"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
        >
          <div className="text-6xl text-golden-amber opacity-30 font-sanskrit">
            ॐ
          </div>
        </motion.div>
      )}

      {/* Main Title */}
      <motion.h1 
        className="font-heading text-5xl lg:text-7xl text-golden-amber text-glow mb-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
      >
        {title}
      </motion.h1>

      {/* Subtitle */}
      {subtitle && (
        <motion.p 
          className="font-body text-xl lg:text-2xl text-soft-gold max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
        >
          {subtitle}
        </motion.p>
      )}

      {/* Decorative Line */}
      <motion.div 
        className="mt-8 flex justify-center items-center space-x-4"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
      >
        <div className="h-px bg-gradient-to-r from-transparent via-golden-amber to-transparent w-32"></div>
        <div className="text-golden-amber text-2xl">✦</div>
        <div className="h-px bg-gradient-to-r from-transparent via-golden-amber to-transparent w-32"></div>
      </motion.div>
    </motion.div>
  );
};

export default DivineHeader;

