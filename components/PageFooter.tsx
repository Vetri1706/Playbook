'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSoundEffects } from './SoundEffects';

interface PageFooterProps {
  prevLink?: string;
  nextLink?: string;
  showPrint?: boolean;
}

export default function PageFooter({ prevLink, nextLink, showPrint = false }: PageFooterProps) {
  const { playWhoosh, playSuccess } = useSoundEffects();

  return (
    <motion.div 
      className="flex justify-between items-center pt-8 mt-8 border-t-4 border-dashed border-sns-orange/30 no-print"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      {/* Previous Button */}
      <div>
        {prevLink ? (
          <Link href={prevLink} onClick={() => playWhoosh()}>
            <motion.div
              className="px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-full font-bold text-base md:text-lg shadow-lg cursor-pointer"
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              ← Previous
            </motion.div>
          </Link>
        ) : (
          <div className="w-32" /> 
        )}
      </div>

      {/* Next Button - Always visible and prominent */}
      <div className="flex gap-3 md:gap-4">
        {showPrint && (
          <Link href="/print" onClick={() => playSuccess()}>
            <motion.div
              className="px-5 py-3 md:px-8 md:py-4 bg-gradient-to-r from-hero-hulk to-sns-green text-white rounded-full font-bold text-base md:text-lg shadow-lg cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Print Playbook
            </motion.div>
          </Link>
        )}
        {nextLink && (
          <Link href={nextLink} onClick={() => playWhoosh()}>
            <motion.div
              className="px-8 py-3 md:px-12 md:py-4 text-white rounded-full font-black text-lg md:text-xl shadow-2xl cursor-pointer relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #00A651 0%, #4CAF50 50%, #00A651 100%)',
                boxShadow: '0 10px 40px rgba(0,166,81,0.5), 0 0 0 4px rgba(0,166,81,0.2)'
              }}
              whileHover={{ 
                scale: 1.15, 
                x: 5,
                boxShadow: '0 15px 50px rgba(0,166,81,0.7), 0 0 0 6px rgba(0,166,81,0.3)'
              }}
              whileTap={{ scale: 0.95 }}
              animate={{
                y: [0, -5, 0],
              }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              <motion.span
                className="relative z-10 flex items-center gap-2"
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                NEXT
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                >
                  →
                </motion.span>
              </motion.span>
              
              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
              />
            </motion.div>
          </Link>
        )}
      </div>
    </motion.div>
  );
}
