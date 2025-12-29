'use client';

import React from 'react';
import { motion } from 'framer-motion';
import CanvasDrawing from './CanvasDrawing';
import { useSoundEffects } from './SoundEffects';

interface DrawingBoxProps {
  ideaNumber: number;
  mode: 'draw' | 'write';
  content: string;
  onModeChange: (mode: 'draw' | 'write') => void;
  onContentChange: (content: string) => void;
}

const boxColors = [
  { bg: '#FFEBEE', border: '#E23636', accent: '#F37021' },
  { bg: '#E8F5E9', border: '#4CAF50', accent: '#00A651' },
  { bg: '#E3F2FD', border: '#0476F2', accent: '#0D47A1' },
  { bg: '#F3E5F5', border: '#9C27B0', accent: '#673ab7' },
  { bg: '#FFF3E0', border: '#FF9933', accent: '#F37021' },
  { bg: '#E1F5FE', border: '#00ADEF', accent: '#0288D1' },
];

export default function DrawingBox({
  ideaNumber,
  mode,
  content,
  onModeChange,
  onContentChange,
}: DrawingBoxProps) {
  const colorScheme = boxColors[(ideaNumber - 1) % boxColors.length];
  const { playPop } = useSoundEffects();
  
  return (
    <motion.div 
      className="rounded-2xl p-5 space-y-3 shadow-lg"
      style={{
        backgroundColor: colorScheme.bg,
        border: `4px solid ${colorScheme.border}`,
        boxShadow: `0 8px 25px ${colorScheme.border}30`
      }}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: ideaNumber * 0.1, type: 'spring' }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: `0 12px 35px ${colorScheme.border}50`
      }}
    >
      <div className="flex items-center justify-between">
        <motion.h3 
          className="font-black text-xl"
          style={{ color: colorScheme.border }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          💡 IDEA {ideaNumber}
        </motion.h3>
        <div className="flex gap-2">
          <motion.button
            onClick={() => { onModeChange('write'); playPop(); }}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              mode === 'write'
                ? 'text-white shadow-lg'
                : 'bg-white/80 text-gray-700'
            }`}
            style={mode === 'write' ? {
              background: `linear-gradient(135deg, ${colorScheme.border}, ${colorScheme.accent})`
            } : {}}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            ✏️ Write
          </motion.button>
          <motion.button
            onClick={() => { onModeChange('draw'); playPop(); }}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              mode === 'draw'
                ? 'text-white shadow-lg'
                : 'bg-white/80 text-gray-700'
            }`}
            style={mode === 'draw' ? {
              background: `linear-gradient(135deg, ${colorScheme.border}, ${colorScheme.accent})`
            } : {}}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            🎨 Draw
          </motion.button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {mode === 'write' ? (
          <textarea
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder={`Write your amazing idea ${ideaNumber} here... Be creative! 🌟`}
            rows={6}
            className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-4 resize-none bg-white/90 text-gray-800 placeholder:text-gray-400 font-medium text-lg"
            style={{
              border: `3px solid ${colorScheme.border}50`,
              boxShadow: `inset 0 2px 6px ${colorScheme.border}20`
            }}
          />
        ) : (
          <CanvasDrawing
            width={300}
            height={200}
            onSave={onContentChange}
            initialData={content}
          />
        )}
      </motion.div>
    </motion.div>
  );
}
