'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import PlaybookPage from '@/components/PlaybookPage';
import PageHeader from '@/components/PageHeader';
import PageFooter from '@/components/PageFooter';
import DrawingBox from '@/components/DrawingBox';
import { usePlaybook } from '@/context/PlaybookContext';
import { CHARACTERS } from '@/utils/constants';

export default function Step3Page() {
  const { step3, updateStep3 } = usePlaybook();

  const handleIdeaChange = (index: number, mode: 'draw' | 'write', content: string) => {
    const newIdeas = [...step3.ideas];
    newIdeas[index] = { ...newIdeas[index], mode, content };
    updateStep3(newIdeas);
  };

  return (
    <PlaybookPage heroTheme={CHARACTERS.blackpanther.colors}>
      {/* Dark vibrant background with neon accents */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-hero-panther/5 via-white to-hero-panther-purple/10" />
        <motion.div 
          className="absolute top-0 left-0 w-80 h-80 bg-hero-panther-purple/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-0 right-0 w-80 h-80 bg-hero-jerry/20 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <PageHeader
        stepNumber={3}
        title="Ideate"
        subtitle="Crazy 6"
      />

      {/* Hero characters - Large and visible */}
      <div className="flex justify-center items-center gap-6 md:gap-10 mb-6">
        <motion.div 
          className="flex flex-col items-center"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <div className="w-36 h-36 md:w-52 md:h-52 relative">
            <Image src="/images/blackpantherlogo.png" alt="Black Panther" fill className="object-contain drop-shadow-2xl" />
          </div>
          <span className="text-xs font-bold text-hero-panther mt-1">Black Panther</span>
        </motion.div>

        {/* Supporting characters */}
        {[
          { src: '/images/hulk.png', size: 'w-14 h-14 md:w-20 md:h-20' },
          { src: '/images/ironman.png', size: 'w-14 h-14 md:w-20 md:h-20' },
          { src: '/images/spike.png', size: 'w-12 h-12 md:w-16 md:h-16' },
        ].map((char, i) => (
          <motion.div 
            key={i}
            className={`relative ${char.size}`}
            animate={{ y: [0, -6, 0], rotate: i % 2 === 0 ? [0, 5, 0] : [0, -5, 0] }}
            transition={{ duration: 2 + i * 0.3, repeat: Infinity }}
          >
            <Image src={char.src} alt="Hero" fill className="object-contain drop-shadow-lg" />
          </motion.div>
        ))}

        <motion.div 
          className="flex flex-col items-center"
          animate={{ y: [0, -8, 0], rotate: [-3, 3, -3] }}
          transition={{ duration: 2.8, repeat: Infinity }}
        >
          <div className="flex gap-1">
            <div className="w-24 h-24 md:w-36 md:h-36 relative">
              <Image src="/images/tom.png" alt="Tom" fill className="object-contain drop-shadow-lg" />
            </div>
            <div className="w-24 h-24 md:w-36 md:h-36 relative">
              <Image src="/images/jerry.png" alt="Jerry" fill className="object-contain drop-shadow-lg" />
            </div>
          </div>
          <span className="text-xs font-bold text-hero-jerry mt-1">Tom & Jerry</span>
        </motion.div>
      </div>

      {/* Title prompt */}
      <motion.div className="text-center mb-6">
        <p className="text-lg md:text-xl font-black text-hero-panther-purple">
          Come up with <span className="text-sns-orange">6 wild ideas</span>! Be CRAZY!
        </p>
      </motion.div>

      <div className="space-y-5">
        {/* Ideas Grid - Colorful numbered boxes */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {step3.ideas.map((idea, index) => {
            const colors = [
              { bg: 'from-hero-panther-purple/10', border: '#9C27B0', accent: '#9C27B0' },
              { bg: 'from-hero-jerry/15', border: '#A1887F', accent: '#A1887F' },
              { bg: 'from-sns-orange/10', border: '#F37021', accent: '#F37021' },
              { bg: 'from-hero-hulk/10', border: '#4CAF50', accent: '#4CAF50' },
              { bg: 'from-hero-startup/15', border: '#FFEB3B', accent: '#D4A000' },
              { bg: 'from-hero-spidey/10', border: '#E23636', accent: '#E23636' },
            ];
            const color = colors[index];
            
            return (
              <motion.div
                key={idea.id}
                className={`p-4 bg-gradient-to-br ${color.bg} to-white rounded-2xl border-3 shadow-lg`}
                style={{ borderColor: color.border, borderWidth: '3px' }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ scale: 1.02 }}
              >
                <div 
                  className="text-center mb-2 text-lg font-black"
                  style={{ color: color.accent }}
                >
                  Idea #{idea.id}
                </div>
                <DrawingBox
                  ideaNumber={idea.id}
                  mode={idea.mode}
                  content={idea.content}
                  onModeChange={(mode) => handleIdeaChange(index, mode, idea.content)}
                  onContentChange={(content) => handleIdeaChange(index, idea.mode, content)}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Encouragement box */}
        <motion.div 
          className="p-4 bg-gradient-to-r from-hero-panther/10 via-hero-panther-purple/10 to-hero-jerry/10 rounded-2xl border-3 border-dashed border-hero-panther-purple/40 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-lg font-black text-hero-panther-purple">
            No idea is too wild! The crazier the better!
          </p>
        </motion.div>
      </div>

      <PageFooter prevLink="/step2" nextLink="/step4" />
    </PlaybookPage>
  );
}
