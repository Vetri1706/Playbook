'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PlaybookPageProps {
  children: React.ReactNode;
  className?: string;
  heroTheme?: {
    primary: string;
    secondary: string;
    background: string;
  };
}

export default function PlaybookPage({ children, className = '', heroTheme }: PlaybookPageProps) {
  // Vibrant rainbow gradient as default
  const rainbowBg = `
    linear-gradient(135deg, 
      rgba(243,112,33,0.15) 0%, 
      rgba(226,54,54,0.12) 15%, 
      rgba(103,58,183,0.12) 30%, 
      rgba(0,166,81,0.15) 45%, 
      rgba(4,118,242,0.12) 60%, 
      rgba(255,235,59,0.15) 75%, 
      rgba(156,39,176,0.12) 90%, 
      rgba(243,112,33,0.15) 100%
    )
  `;

  const heroGradient = heroTheme 
    ? `linear-gradient(135deg, ${heroTheme.background} 0%, #ffffff 40%, ${heroTheme.background} 100%)`
    : rainbowBg;

  return (
    <div 
      className="min-h-screen py-8 px-4 relative overflow-hidden"
      style={{ 
        background: heroGradient,
        backgroundColor: '#ffffff'
      }}
    >
      {/* Animated floating orbs */}
      <motion.div 
        className="absolute top-0 left-0 w-40 h-40 bg-hero-spidey rounded-full blur-3xl opacity-20"
        animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div 
        className="absolute top-20 right-10 w-32 h-32 bg-hero-thanos rounded-full blur-3xl opacity-20"
        animate={{ x: [0, -30, 0], y: [0, 50, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-20 left-20 w-48 h-48 bg-sns-green rounded-full blur-3xl opacity-15"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-10 right-20 w-36 h-36 bg-hero-frozen rounded-full blur-3xl opacity-25"
        animate={{ y: [0, -40, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
      />
      <motion.div 
        className="absolute top-1/2 left-1/2 w-56 h-56 bg-hero-startup rounded-full blur-3xl opacity-10"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      />

      {/* Hero-specific glows */}
      {heroTheme && (
        <>
          <motion.div 
            className="absolute -top-20 -left-20 w-80 h-80 rounded-full blur-3xl opacity-30" 
            style={{ backgroundColor: heroTheme.primary }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.4, 0.3] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          <motion.div 
            className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full blur-3xl opacity-25" 
            style={{ backgroundColor: heroTheme.secondary }}
            animate={{ scale: [1.2, 1, 1.2] }}
            transition={{ duration: 7, repeat: Infinity }}
          />
        </>
      )}

      {/* Main content card */}
      <motion.div 
        className={`relative max-w-5xl mx-auto bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 md:p-12 border-4 ${className}`}
        style={heroTheme ? {
          borderColor: heroTheme.primary,
          boxShadow: `
            0 25px 80px ${heroTheme.primary}40, 
            0 0 0 2px ${heroTheme.primary}20,
            inset 0 1px 0 rgba(255,255,255,0.8)
          `
        } : {
          borderImage: 'linear-gradient(135deg, #F37021, #E23636, #673ab7, #00A651, #0476F2) 1',
          boxShadow: '0 25px 80px rgba(243,112,33,0.3), 0 0 0 2px rgba(243,112,33,0.1)'
        }}
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
      >
        {children}
      </motion.div>
    </div>
  );
}
