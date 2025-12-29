'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePlaybook } from '@/context/PlaybookContext';
import { useSoundEffects } from './SoundEffects';

export default function FloatingPrintButton() {
  const { user, step1, step2, step3, step5 } = usePlaybook();
  const { playSuccess } = useSoundEffects();

  const getCompletionStatus = () => {
    let completed = 0;
    let total = 5;

    if (user.name && user.age) completed++;
    if (step1.problem) completed++;
    if (step2.who && step2.what) completed++;
    if (step3.ideas.some(idea => idea.content)) completed++;
    if (step5.ideaName) completed++;

    return { completed, total };
  };

  const { completed, total } = getCompletionStatus();

  return (
    <Link href="/print" onClick={() => playSuccess()}>
      <motion.div
        className="fixed bottom-8 right-8 text-white px-8 py-5 rounded-full shadow-2xl font-bold no-print z-50 cursor-pointer"
        style={{
          background: 'linear-gradient(135deg, #00A651 0%, #4CAF50 50%, #00A651 100%)',
        }}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ 
          scale: 1, 
          rotate: 0,
          boxShadow: [
            '0 10px 40px rgba(0,166,81,0.5), 0 0 0 4px rgba(76,175,80,0.3)',
            '0 15px 50px rgba(0,166,81,0.7), 0 0 0 8px rgba(76,175,80,0.4)',
            '0 10px 40px rgba(0,166,81,0.5), 0 0 0 4px rgba(76,175,80,0.3)',
          ]
        }}
        transition={{ 
          scale: { type: 'spring', stiffness: 200 },
          boxShadow: { duration: 2, repeat: Infinity }
        }}
        whileHover={{ 
          scale: 1.1,
          rotate: [0, -5, 5, 0],
        }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div 
          className="text-center"
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="text-xl font-black flex items-center gap-2">
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            >
              🖨️
            </motion.span>
            Save & Print
          </div>
          <div className="text-sm opacity-90 font-semibold">
            {completed}/{total} Steps Complete
          </div>
        </motion.div>
        
        {/* Sparkle effects */}
        <motion.div
          className="absolute -top-1 -right-1 text-xl"
          animate={{ 
            scale: [0, 1.2, 0],
            rotate: [0, 180],
            opacity: [0, 1, 0]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ✨
        </motion.div>
        <motion.div
          className="absolute -bottom-1 -left-1 text-lg"
          animate={{ 
            scale: [0, 1, 0],
            rotate: [0, -180],
            opacity: [0, 1, 0]
          }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        >
          ⭐
        </motion.div>
      </motion.div>
    </Link>
  );
}
