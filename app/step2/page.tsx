'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import PlaybookPage from '@/components/PlaybookPage';
import PageHeader from '@/components/PageHeader';
import PageFooter from '@/components/PageFooter';
import TextArea from '@/components/TextArea';
import { usePlaybook } from '@/context/PlaybookContext';
import { CHARACTERS } from '@/utils/constants';

export default function Step2Page() {
  const { step2, updateStep2 } = usePlaybook();

  return (
    <PlaybookPage heroTheme={CHARACTERS.thanos.colors}>
      {/* Vibrant purple-pink gradient background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-hero-thanos/15 via-white to-hero-peppa/15" />
        <motion.div 
          className="absolute top-0 left-0 w-[400px] h-[400px] bg-gradient-to-br from-hero-thanos/30 to-hero-peppa/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.4, 1], x: [0, 60, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tl from-hero-peppa/30 to-hero-startup/20 rounded-full blur-3xl"
          animate={{ scale: [1.3, 1, 1.3], y: [0, -60, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <PageHeader
        stepNumber={2}
        title="Define"
        subtitle="The Problem Story"
      />

      {/* Hero characters - Large and side by side */}
      <div className="flex justify-center items-center gap-6 md:gap-12 mb-6">
        <motion.div 
          className="flex flex-col items-center"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          whileHover={{ scale: 1.1 }}
        >
          <div className="w-48 h-48 md:w-72 md:h-72 relative">
            <Image src="/images/Thanos.png" alt="Thanos" fill className="object-contain drop-shadow-2xl" />
          </div>
          <span className="text-sm font-bold text-hero-thanos mt-1">Thanos</span>
        </motion.div>

        {/* Center supporting characters */}
        <div className="flex gap-3 md:gap-4">
          {[
            { src: '/images/peppafamily.png', size: 'w-14 h-14 md:w-20 md:h-20' },
            { src: '/images/peppahouse.png', size: 'w-12 h-12 md:w-16 md:h-16' },
            { src: '/images/thanos kid.png', size: 'w-14 h-14 md:w-20 md:h-20' },
          ].map((char, i) => (
            <motion.div 
              key={i}
              className={`relative ${char.size}`}
              animate={{ y: [0, -6, 0], rotate: i % 2 === 0 ? [0, 5, 0] : [0, -5, 0] }}
              transition={{ duration: 2 + i * 0.3, repeat: Infinity }}
            >
              <Image src={char.src} alt="Character" fill className="object-contain drop-shadow-lg" />
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="flex flex-col items-center"
          animate={{ y: [0, -10, 0], rotate: [-3, 3, -3] }}
          transition={{ duration: 2.8, repeat: Infinity }}
          whileHover={{ scale: 1.1 }}
        >
          <div className="w-48 h-48 md:w-72 md:h-72 relative">
            <Image src="/images/peppapig.png" alt="Peppa Pig" fill className="object-contain drop-shadow-2xl" />
          </div>
          <span className="text-sm font-bold text-hero-peppa mt-1">Peppa Pig</span>
        </motion.div>
      </div>

      {/* Title prompt */}
      <motion.div 
        className="text-center mb-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <motion.p 
          className="text-xl md:text-2xl font-black"
          style={{ 
            background: 'linear-gradient(90deg, #673ab7, #F4B3C2, #F37021)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          Tell Your Problem Story!
        </motion.p>
      </motion.div>

      <div className="space-y-5">
        {/* Problem Story Grid - Colorful cards */}
        <div className="grid md:grid-cols-2 gap-4">
          <motion.div
            className="p-5 rounded-3xl border-4 shadow-xl"
            style={{
              background: 'linear-gradient(135deg, rgba(103,58,183,0.15) 0%, white 100%)',
              borderColor: '#673ab7'
            }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <TextArea
              label="Who is facing the problem?"
              value={step2.who}
              onChange={(value) => updateStep2({ who: value })}
              placeholder="Describe who has this problem..."
              rows={4}
            />
          </motion.div>
          
          <motion.div
            className="p-5 rounded-3xl border-4 shadow-xl"
            style={{
              background: 'linear-gradient(135deg, rgba(244,179,194,0.2) 0%, white 100%)',
              borderColor: '#F4B3C2'
            }}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
          >
            <TextArea
              label="What is happening?"
              value={step2.what}
              onChange={(value) => updateStep2({ what: value })}
              placeholder="What exactly is going wrong..."
              rows={4}
            />
          </motion.div>
          
          <motion.div
            className="p-5 rounded-3xl border-4 shadow-xl"
            style={{
              background: 'linear-gradient(135deg, rgba(255,235,59,0.2) 0%, white 100%)',
              borderColor: '#FFEB3B'
            }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
          >
            <TextArea
              label="When/Where does it happen?"
              value={step2.when}
              onChange={(value) => updateStep2({ when: value })}
              placeholder="At home? School? Morning?"
              rows={4}
            />
          </motion.div>
          
          <motion.div
            className="p-5 rounded-3xl border-4 shadow-xl"
            style={{
              background: 'linear-gradient(135deg, rgba(243,112,33,0.15) 0%, white 100%)',
              borderColor: '#F37021'
            }}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
          >
            <TextArea
              label="Why is it a problem?"
              value={step2.why}
              onChange={(value) => updateStep2({ why: value })}
              placeholder="How does it make people feel?"
              rows={4}
            />
          </motion.div>
        </div>

        {/* Supporting characters row */}
        <div className="flex justify-center gap-4 md:gap-6">
          {[
            { src: '/images/chottabheem.png', size: 'w-12 h-12 md:w-16 md:h-16' },
            { src: '/images/chutki.png', size: 'w-10 h-10 md:w-14 md:h-14' },
            { src: '/images/khalia.png', size: 'w-10 h-10 md:w-14 md:h-14' },
            { src: '/images/dolubolu.png', size: 'w-10 h-10 md:w-14 md:h-14' },
          ].map((char, i) => (
            <motion.div 
              key={i}
              className={`relative ${char.size}`}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2 + i * 0.2, repeat: Infinity, delay: i * 0.15 }}
            >
              <Image src={char.src} alt="Character" fill className="object-contain drop-shadow-lg" />
            </motion.div>
          ))}
        </div>

        {/* Tip box */}
        <motion.div 
          className="p-4 rounded-2xl text-center shadow-lg"
          style={{
            background: 'linear-gradient(135deg, rgba(103,58,183,0.1), rgba(244,179,194,0.15))',
            border: '3px dashed #673ab7'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-lg font-black text-hero-thanos">
            Think like a storyteller - every great solution starts with understanding the problem!
          </p>
        </motion.div>
      </div>

      <PageFooter prevLink="/step1" nextLink="/step3" />
    </PlaybookPage>
  );
}
