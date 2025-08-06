import React from 'react';
import { motion } from 'framer-motion';
import sacredGeometry from '../assets/images/sacred-geometry.jpg';
import sacredMandala from '../assets/images/sacred-mandala.jpg';
import spiritualBackground from '../assets/images/spiritual-background.jpg';

const SacredGeometryBackground = ({ 
  variant = 'geometry', 
  opacity = 0.1, 
  animate = true 
}) => {
  const backgrounds = {
    geometry: sacredGeometry,
    mandala: sacredMandala,
    spiritual: spiritualBackground
  };

  const selectedBg = backgrounds[variant];

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Main Background Image */}
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ 
          opacity: opacity, 
          scale: animate ? [1.1, 1.05, 1.1] : 1.1 
        }}
        transition={{ 
          opacity: { duration: 2 },
          scale: { duration: 20, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${selectedBg})`,
          filter: 'blur(1px) brightness(0.3)',
          mixBlendMode: 'overlay'
        }}
      />

      {/* Geometric Overlays */}
      <div className="absolute inset-0">
        {/* Central Mandala */}
        <motion.div
          animate={animate ? { rotate: 360 } : {}}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-10"
        >
          <div className="w-full h-full border-2 border-golden-amber rounded-full relative">
            <div className="absolute inset-4 border border-sacred-saffron rounded-full">
              <div className="absolute inset-4 border border-soft-gold rounded-full">
                <div className="absolute inset-4 border border-golden-amber rounded-full flex items-center justify-center">
                  <div className="text-4xl text-golden-amber font-sanskrit">ॐ</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Corner Geometries */}
        <motion.div
          animate={animate ? { rotate: -360 } : {}}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-20 w-32 h-32 opacity-5"
        >
          <div className="w-full h-full border border-golden-amber/50 transform rotate-45">
            <div className="absolute inset-2 border border-sacred-saffron/50 transform -rotate-45">
              <div className="absolute inset-2 border border-soft-gold/50 transform rotate-45" />
            </div>
          </div>
        </motion.div>

        <motion.div
          animate={animate ? { rotate: 360 } : {}}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-20 w-24 h-24 opacity-5"
        >
          <div className="w-full h-full border border-sacred-saffron/50 rounded-full">
            <div className="absolute inset-2 border border-golden-amber/50 rounded-full">
              <div className="absolute inset-2 border border-soft-gold/50 rounded-full" />
            </div>
          </div>
        </motion.div>

        {/* Floating Sacred Symbols */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-golden-amber/10 font-sanskrit text-2xl"
            style={{
              left: `${15 + (i * 10)}%`,
              top: `${20 + (i * 8)}%`,
            }}
            animate={animate ? {
              y: [0, -20, 0],
              opacity: [0.1, 0.2, 0.1],
              rotate: [0, 180, 360]
            } : {}}
            transition={{
              duration: 8 + (i * 2),
              repeat: Infinity,
              delay: i * 0.5,
            }}
          >
            {['ॐ', '🕉️', '✦', '◊', '○', '△', '☯', '✧'][i]}
          </motion.div>
        ))}
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-cosmic-blue/20 via-transparent to-deep-purple/20" />
    </div>
  );
};

export default SacredGeometryBackground;

