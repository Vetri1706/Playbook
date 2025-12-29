'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import ProgressBar from './ProgressBar';
import { CHARACTERS, STEPS } from '@/utils/constants';

interface PageHeaderProps {
  stepNumber: number;
  title: string;
  subtitle?: string;
  characterKey?: keyof typeof CHARACTERS;
}

export default function PageHeader({ stepNumber, title, subtitle, characterKey }: PageHeaderProps) {
  const step = STEPS.find(s => s.number === stepNumber);
  const charKey = characterKey || step?.char || 'kimpossible';
  const character = CHARACTERS[charKey];

  return (
    <div className="mb-6">
      <ProgressBar />
      
      {/* Header with Hero Theme - Compact layout */}
      <div className="text-center mt-6 relative">
        {/* Colorful Step Number Badge */}
        <motion.div 
          className="inline-block px-6 py-2 rounded-full font-black text-lg text-white shadow-xl mb-4"
          style={{ 
            background: `linear-gradient(135deg, ${character.colors.primary} 0%, ${character.colors.secondary} 100%)`,
            boxShadow: `0 8px 25px ${character.colors.primary}50, 0 0 0 4px ${character.colors.primary}20`
          }}
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200 }}
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <motion.span
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            STEP {stepNumber} of 5
          </motion.span>
        </motion.div>

        {/* LARGE Hero Image - Main character with glow effect */}
        <motion.div 
          className="relative w-72 h-72 md:w-96 md:h-96 mx-auto mb-8"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
          whileHover={{ scale: 1.1 }}
        >
          {/* Glow effect */}
          <div 
            className="absolute inset-0 rounded-full blur-2xl opacity-50"
            style={{ backgroundColor: character.colors.primary }}
          />
          <Image 
            src={character.src} 
            alt={character.alt} 
            fill 
            className="object-contain drop-shadow-2xl relative z-10" 
          />
        </motion.div>

        {/* Character label */}
        <motion.span
          className="inline-block px-5 py-2 rounded-full text-base font-bold text-white mb-6"
          style={{ backgroundColor: character.colors.primary }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {character.alt}
        </motion.span>

        {/* Title with gradient - no overlap */}
        <motion.h1 
          className="text-3xl md:text-4xl lg:text-5xl font-display font-black mb-2"
          style={{ 
            background: `linear-gradient(135deg, ${character.colors.primary} 0%, ${character.colors.secondary} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.2))'
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: 'spring' }}
        >
          {title}
        </motion.h1>

        {/* Subtitle with accent color */}
        {subtitle && (
          <motion.p 
            className="text-xl md:text-2xl font-bold px-5 py-2 rounded-full inline-block"
            style={{ 
              backgroundColor: `${character.colors.secondary}20`,
              color: character.colors.secondary,
              border: `3px dashed ${character.colors.secondary}`
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </div>
  );
}

