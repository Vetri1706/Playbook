'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import PlaybookPage from '@/components/PlaybookPage';
import PageHeader from '@/components/PageHeader';
import PageFooter from '@/components/PageFooter';
import InputField from '@/components/InputField';
import TextArea from '@/components/TextArea';
import CanvasDrawing from '@/components/CanvasDrawing';
import Confetti, { CelebrationStars } from '@/components/Confetti';
import { usePlaybook } from '@/context/PlaybookContext';
import { CHARACTERS } from '@/utils/constants';
import { useSoundEffects } from '@/components/SoundEffects';

export default function Step5Page() {
  const { step5, updateStep5 } = usePlaybook();
  const [ideaMode, setIdeaMode] = useState<'draw' | 'write'>(step5.bestIdea.mode);
  const [showCelebration, setShowCelebration] = useState(false);
  const { playCelebration, playPop } = useSoundEffects();

  const handleIdeaContentChange = (content: string) => {
    updateStep5({
      bestIdea: {
        mode: ideaMode,
        content,
      },
    });
  };

  useEffect(() => {
    if (step5.ideaName && step5.bestIdea.content && !showCelebration) {
      setShowCelebration(true);
      playCelebration();
    }
  }, [step5.ideaName, step5.bestIdea.content, showCelebration, playCelebration]);

  return (
    <PlaybookPage heroTheme={CHARACTERS.captainamerica.colors}>
      <Confetti trigger={showCelebration} />
      <CelebrationStars show={showCelebration} />
      
      {/* Red, white, blue patriotic background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-hero-cap-blue/10 via-white to-hero-cap-red/10" />
        <motion.div 
          className="absolute top-0 left-0 w-72 h-72 bg-hero-cap-blue/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-0 right-0 w-72 h-72 bg-hero-cap-red/20 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <PageHeader
        stepNumber={5}
        title="Prototype"
        subtitle="The Final Solution"
      />

      {/* Hero characters - Large and visible */}
      <div className="flex justify-center items-center gap-4 md:gap-8 mb-6">
        <motion.div 
          className="w-20 h-20 md:w-28 md:h-28 relative"
          animate={{ y: [0, -10, 0], rotate: [-3, 3, -3] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <Image src="/images/Captain america.png" alt="Captain America" fill className="object-contain drop-shadow-2xl" />
        </motion.div>
        
        <motion.div 
          className="w-16 h-16 md:w-20 md:h-20 relative"
          animate={{ scale: [1, 1.1, 1], rotate: [0, 360] }}
          transition={{ scale: { duration: 2, repeat: Infinity }, rotate: { duration: 4, repeat: Infinity, ease: 'linear' } }}
        >
          <Image src="/images/captainlogo.png" alt="Shield" fill className="object-contain drop-shadow-2xl" />
        </motion.div>
        
        <motion.div 
          className="w-16 h-16 md:w-24 md:h-24 relative"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, delay: 0.3 }}
        >
          <Image src="/images/blackwidow.png" alt="Black Widow" fill className="object-contain drop-shadow-2xl" />
        </motion.div>
        
        <motion.div 
          className="w-14 h-14 md:w-18 md:h-18 relative"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        >
          <Image src="/images/thorhammer.png" alt="Thor Hammer" fill className="object-contain drop-shadow-2xl" />
        </motion.div>
      </div>

      {/* Title */}
      <motion.div className="text-center mb-6">
        <h2 
          className="text-2xl md:text-3xl font-display font-black"
          style={{ 
            background: 'linear-gradient(90deg, #0D47A1, #B71C1C, #0D47A1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          Your Super IDEA
        </h2>
        <p className="text-base text-gray-600">Choose your best idea and bring it to life!</p>
      </motion.div>

      <div className="space-y-5">
        {/* Idea Name */}
        <motion.div
          className="p-5 bg-gradient-to-r from-hero-cap-blue/10 to-hero-cap-red/10 rounded-2xl border-3 border-hero-cap-blue/40 shadow-lg"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <InputField
            label="The super IDEA is called..."
            value={step5.ideaName}
            onChange={(value) => updateStep5({ ideaName: value })}
            placeholder="Give your idea a cool superhero name!"
            required
          />
        </motion.div>

        {/* Best Idea */}
        <motion.div 
          className="space-y-3 p-5 bg-gradient-to-br from-hero-startup/10 to-white rounded-2xl border-3 border-dashed border-hero-startup/60 shadow-lg"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between flex-wrap gap-3">
            <label className="block text-lg font-black text-sns-dark">
              My best idea is...
              <span className="text-hero-spidey ml-1">*</span>
            </label>
            <div className="flex gap-2">
              <motion.button
                onClick={() => { setIdeaMode('write'); playPop(); }}
                className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${
                  ideaMode === 'write'
                    ? 'bg-gradient-to-r from-hero-cap-blue to-hero-cap-red text-white shadow-lg'
                    : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-hero-cap-blue'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Write
              </motion.button>
              <motion.button
                onClick={() => { setIdeaMode('draw'); playPop(); }}
                className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${
                  ideaMode === 'draw'
                    ? 'bg-gradient-to-r from-hero-cap-blue to-hero-cap-red text-white shadow-lg'
                    : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-hero-cap-red'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Draw
              </motion.button>
            </div>
          </div>

          {ideaMode === 'write' ? (
            <textarea
              value={step5.bestIdea.content}
              onChange={(e) => handleIdeaContentChange(e.target.value)}
              placeholder="Describe your amazing superhero idea in detail..."
              rows={6}
              className="w-full px-4 py-3 border-3 border-hero-cap-blue/30 rounded-xl text-base focus:border-hero-cap-blue focus:outline-none focus:ring-3 focus:ring-hero-cap-blue/20 resize-none bg-white"
            />
          ) : (
            <CanvasDrawing
              width={600}
              height={300}
              onSave={handleIdeaContentChange}
              initialData={step5.bestIdea.content}
            />
          )}
        </motion.div>

        {/* Summary */}
        <motion.div
          className="p-5 bg-gradient-to-r from-sns-green/10 to-hero-hulk/10 rounded-2xl border-3 border-sns-green/40 shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <TextArea
            label="How will your idea solve the problem?"
            value={step5.summary}
            onChange={(value) => updateStep5({ summary: value })}
            placeholder="Explain how your superhero idea will save the day..."
            rows={4}
            required
          />
        </motion.div>

        {/* Celebration box */}
        <motion.div 
          className="p-6 bg-gradient-to-r from-hero-cap-blue/20 via-hero-startup/20 to-hero-cap-red/20 rounded-2xl border-3 border-hero-startup text-center shadow-xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-xl md:text-2xl font-black text-hero-cap-blue mb-2">
            Congratulations, Super Designer!
          </p>
          <p className="text-base text-gray-700 mb-3">
            You have completed all steps! You are a real Design Thinking Hero!
          </p>
          <div className="flex justify-center gap-3">
            {[
              '/images/wonderwomanlogo.png',
              '/images/spidermanlogo.png',
              '/images/hulklogo.png',
              '/images/ironman logo.png',
            ].map((src, i) => (
              <motion.div 
                key={i}
                className="w-12 h-12 relative" 
                animate={{ y: [0, -6, 0], scale: [1, 1.1, 1] }} 
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              >
                <Image src={src} alt="Hero Logo" fill className="object-contain" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <PageFooter prevLink="/step4" nextLink="/print" />
    </PlaybookPage>
  );
}
