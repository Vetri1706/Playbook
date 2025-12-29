'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
}

const colors = [
  'rgba(244,179,194,0.25)', // soft pink (Peppa)
  'rgba(179,229,252,0.25)', // soft blue (Frozen)
  'rgba(255,243,224,0.25)', // soft orange
  'rgba(225,245,233,0.25)', // soft green
  'rgba(255,245,157,0.25)', // soft yellow
  'rgba(197,202,233,0.25)', // soft purple
];

export default function ParticleBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 20; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 50 + 30,
        color: colors[Math.floor(Math.random() * colors.length)],
        duration: Math.random() * 10 + 20,
      });
    }
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full blur-xl"
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            x: [0, 60, -60, 30, 0],
            y: [0, -30, 60, -60, 0],
            scale: [1, 1.3, 0.9, 1.1, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
      
      {/* Floating shapes */}
      <motion.div
        className="absolute w-32 h-32 border-4 border-hero-peppa/30 rounded-full"
        style={{ left: '10%', top: '20%' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute w-24 h-24 border-4 border-hero-frozen/30"
        style={{ right: '15%', top: '30%' }}
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute w-20 h-20 border-4 border-path-yellow/30 rounded-lg rotate-45"
        style={{ left: '20%', bottom: '20%' }}
        animate={{ rotate: [45, 405] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}
