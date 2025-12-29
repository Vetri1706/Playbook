'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import PlaybookPage from '@/components/PlaybookPage';
import PageHeader from '@/components/PageHeader';
import PageFooter from '@/components/PageFooter';
import InputField from '@/components/InputField';
import TextArea from '@/components/TextArea';
import CanvasDrawing from '@/components/CanvasDrawing';
import { usePlaybook } from '@/context/PlaybookContext';
import { CHARACTERS } from '@/utils/constants';

export default function Step1Page() {
  const { user, step1, updateUser, updateStep1 } = usePlaybook();
  const [feelingsMode, setFeelingsMode] = useState<'draw' | 'write'>(step1.feelings.mode);

  const handleFeelingsContentChange = (content: string) => {
    updateStep1({
      feelings: {
        mode: feelingsMode,
        content,
      },
    });
  };

  return (
    <PlaybookPage heroTheme={CHARACTERS.kimpossible.colors}>
      {/* Vibrant rainbow gradient background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-hero-kim-orange/15 via-white to-hero-bheem/15" />
        <motion.div 
          className="absolute top-0 left-0 w-[400px] h-[400px] bg-gradient-to-br from-hero-kim-orange/30 to-hero-bheem/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], x: [0, 50, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tl from-sns-green/30 to-hero-hulk/20 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], y: [0, -50, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <PageHeader
        stepNumber={1}
        title="Empathize & Define"
        subtitle="The Detective"
      />

      {/* Supporting characters row - Large and visible */}
      <div className="flex justify-center items-center gap-4 md:gap-8 mb-8">
        {[
          { src: '/images/dora.png', alt: 'Dora', size: 'w-20 h-20 md:w-28 md:h-28' },
          { src: '/images/masha.png', alt: 'Masha', size: 'w-16 h-16 md:w-24 md:h-24' },
          { src: '/images/supergirl.png', alt: 'Supergirl', size: 'w-24 h-24 md:w-32 md:h-32' },
          { src: '/images/pawpatrol.png', alt: 'Paw Patrol', size: 'w-16 h-16 md:w-24 md:h-24' },
          { src: '/images/dorabag.png', alt: 'Dora Bag', size: 'w-14 h-14 md:w-20 md:h-20' },
        ].map((char, i) => (
          <motion.div
            key={char.alt}
            className={`relative ${char.size}`}
            animate={{ 
              y: [0, -10, 0],
              rotate: i % 2 === 0 ? [-5, 5, -5] : [5, -5, 5]
            }}
            transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.1 }}
            whileHover={{ scale: 1.2 }}
          >
            <Image src={char.src} alt={char.alt} fill className="object-contain drop-shadow-xl" />
          </motion.div>
        ))}
      </div>

      <div className="space-y-6 relative z-10">
        {/* User Info with vibrant rainbow styling */}
        <motion.div 
          className="grid md:grid-cols-2 gap-6 p-6 rounded-3xl border-4 shadow-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(255,102,0,0.1) 0%, rgba(255,153,51,0.1) 50%, rgba(75,83,32,0.1) 100%)',
            borderColor: '#FF6600'
          }}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <InputField
            label="Who are you? (Your superhero name!)"
            value={user.name}
            onChange={(value) => updateUser({ name: value })}
            placeholder="Enter your name"
            required
          />
          <InputField
            label="How old are you?"
            value={user.age || ''}
            onChange={(value) => updateUser({ age: parseInt(value) || 0 })}
            placeholder="8"
            type="number"
            required
          />
        </motion.div>

        {/* Problem Statement with colorful border */}
        <motion.div
          className="p-6 rounded-3xl border-4 shadow-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(243,112,33,0.1) 0%, white 50%, rgba(0,166,81,0.1) 100%)',
            borderColor: '#F37021'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <TextArea
            label="What problem do you want to solve? (Be a detective!)"
            value={step1.problem}
            onChange={(value) => updateStep1({ problem: value })}
            placeholder="Describe the problem here... What mystery do you want to solve?"
            rows={4}
            required
          />
        </motion.div>

        {/* Feelings Section with colorful tabs */}
        <motion.div 
          className="space-y-4 p-6 rounded-3xl border-4 shadow-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(76,175,80,0.1) 0%, white 50%, rgba(255,153,51,0.1) 100%)',
            borderColor: '#4CAF50'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <label className="block text-lg font-black text-sns-dark">
              Show how the person with the problem feels
            </label>
            <div className="flex gap-3">
              <motion.button
                onClick={() => setFeelingsMode('write')}
                className={`px-5 py-2 rounded-full font-bold text-base transition-all ${
                  feelingsMode === 'write'
                    ? 'text-white shadow-lg'
                    : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-hero-hulk'
                }`}
                style={feelingsMode === 'write' ? { background: 'linear-gradient(135deg, #4CAF50, #00A651)' } : {}}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                Write It
              </motion.button>
              <motion.button
                onClick={() => setFeelingsMode('draw')}
                className={`px-5 py-2 rounded-full font-bold text-base transition-all ${
                  feelingsMode === 'draw'
                    ? 'text-white shadow-lg'
                    : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-sns-orange'
                }`}
                style={feelingsMode === 'draw' ? { background: 'linear-gradient(135deg, #F37021, #FF9933)' } : {}}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                Draw It
              </motion.button>
            </div>
          </div>

          {/* Emotion character helpers - LARGER */}
          <div className="flex justify-center gap-6 py-2">
            {[
              { src: '/images/joy.png', alt: 'Happy' },
              { src: '/images/fearfrominsideout.png', alt: 'Fear' },
              { src: '/images/insideout anger.png', alt: 'Anger' },
            ].map((char, i) => (
              <motion.div 
                key={char.alt}
                className="w-14 h-14 md:w-18 md:h-18 relative" 
                animate={{ y: [0, -8, 0], scale: [1, 1.1, 1] }} 
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              >
                <Image src={char.src} alt={char.alt} fill className="object-contain" />
              </motion.div>
            ))}
          </div>

          {feelingsMode === 'write' ? (
            <motion.textarea
              value={step1.feelings.content}
              onChange={(e) => handleFeelingsContentChange(e.target.value)}
              placeholder="Describe the feelings (sad, happy, confused, worried, excited...)"
              rows={5}
              className="w-full px-5 py-4 border-4 border-hero-hulk/40 rounded-2xl text-lg focus:border-hero-hulk focus:outline-none focus:ring-4 focus:ring-hero-hulk/30 resize-none bg-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          ) : (
            <CanvasDrawing
              width={600}
              height={250}
              onSave={handleFeelingsContentChange}
              initialData={step1.feelings.content}
            />
          )}
        </motion.div>
      </div>

      <PageFooter prevLink="/" nextLink="/step2" />
    </PlaybookPage>
  );
}
