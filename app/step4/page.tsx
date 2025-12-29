'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import PlaybookPage from '@/components/PlaybookPage';
import PageHeader from '@/components/PageHeader';
import PageFooter from '@/components/PageFooter';
import { usePlaybook } from '@/context/PlaybookContext';
import { CHARACTERS } from '@/utils/constants';

export default function Step4Page() {
  const { step3, step4, updateStep4 } = usePlaybook();

  const handleScoreChange = (index: number, score: number) => {
    const newEvaluations = [...step4.evaluations];
    newEvaluations[index] = { ...newEvaluations[index], score };
    updateStep4(newEvaluations);
  };

  const handleSolutionChange = (index: number, solves: 'yes' | 'no') => {
    const newEvaluations = [...step4.evaluations];
    newEvaluations[index] = { ...newEvaluations[index], solvesProblem: solves };
    updateStep4(newEvaluations);
  };

  const getIdeaPreview = (idea: { mode: string; content: string }) => {
    if (!idea.content) return 'No idea yet';
    if (idea.mode === 'draw') return 'Drawing';
    return idea.content.substring(0, 20) + (idea.content.length > 20 ? '...' : '');
  };

  return (
    <PlaybookPage heroTheme={CHARACTERS.olaf.colors}>
      {/* Ice blue magical background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-hero-frozen/30 via-white to-hero-frozen/20" />
        <motion.div 
          className="absolute top-10 left-10 w-60 h-60 bg-hero-frozen/40 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <PageHeader
        stepNumber={4}
        title="Evaluate"
        subtitle="The Scorecard"
      />

      {/* Hero characters - Large and centered */}
      <div className="flex justify-center items-center gap-6 md:gap-10 mb-6">
        <motion.div 
          className="flex flex-col items-center"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <div className="w-20 h-20 md:w-28 md:h-28 relative">
            <Image src="/images/olaf.png" alt="Olaf" fill className="object-contain drop-shadow-2xl" />
          </div>
          <span className="text-xs font-bold text-hero-cap-blue mt-1">Olaf</span>
        </motion.div>
        
        <motion.div 
          className="flex flex-col items-center"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, delay: 0.3 }}
        >
          <div className="w-20 h-20 md:w-28 md:h-28 relative">
            <Image src="/images/sven.png" alt="Sven" fill className="object-contain drop-shadow-2xl" />
          </div>
          <span className="text-xs font-bold text-hero-cap-blue mt-1">Sven</span>
        </motion.div>
        
        <motion.div 
          className="flex flex-col items-center"
          animate={{ y: [0, -6, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
        >
          <div className="w-16 h-16 md:w-20 md:h-20 relative">
            <Image src="/images/bruni.png" alt="Bruni" fill className="object-contain drop-shadow-2xl" />
          </div>
          <span className="text-xs font-bold text-hero-cap-blue mt-1">Bruni</span>
        </motion.div>
      </div>

      {/* Title */}
      <motion.div className="text-center mb-4">
        <p className="text-lg md:text-xl font-black text-hero-cap-blue">
          Rate Your Ideas Like a Pro!
        </p>
      </motion.div>

      <div className="space-y-5">
        {/* Scorecard Table - Compact */}
        <motion.div 
          className="overflow-x-auto rounded-2xl shadow-xl border-3 border-hero-frozen"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr className="bg-gradient-to-r from-sns-orange via-hero-spidey to-sns-orange text-white">
                <th className="p-3 text-left text-sm md:text-base font-black border-r border-orange-400">Idea</th>
                <th className="p-3 text-center text-sm md:text-base font-black border-r border-orange-400">Preview</th>
                <th className="p-3 text-center text-sm md:text-base font-black border-r border-orange-400">Score (1-10)</th>
                <th className="p-3 text-center text-sm md:text-base font-black">Solves Problem?</th>
              </tr>
            </thead>
            <tbody>
              {step3.ideas.map((idea, index) => {
                const rowBg = index % 2 === 0 ? 'bg-hero-frozen/10' : 'bg-white';
                return (
                  <tr key={idea.id} className={`${rowBg} hover:bg-hero-startup/20 transition-colors`}>
                    <td className="p-3 border-r border-gray-200 font-black text-hero-cap-blue">
                      Idea {idea.id}
                    </td>
                    <td className="p-3 border-r border-gray-200 text-xs text-gray-600 italic">
                      {getIdeaPreview(idea)}
                    </td>
                    <td className="p-3 border-r border-gray-200">
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={step4.evaluations[index]?.score || 5}
                          onChange={(e) => handleScoreChange(index, parseInt(e.target.value))}
                          className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #0D47A1 0%, #0D47A1 ${((step4.evaluations[index]?.score || 5) - 1) * 11.11}%, #E0E0E0 ${((step4.evaluations[index]?.score || 5) - 1) * 11.11}%, #E0E0E0 100%)`
                          }}
                        />
                        <span className="font-black text-lg text-sns-orange w-8 text-center">
                          {step4.evaluations[index]?.score || 5}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-3 justify-center">
                        <label 
                          className={`flex items-center gap-1 cursor-pointer px-3 py-1 rounded-full font-bold text-sm transition-all ${
                            step4.evaluations[index]?.solvesProblem === 'yes' 
                              ? 'bg-hero-hulk text-white shadow' 
                              : 'bg-gray-100 text-gray-600 hover:bg-hero-hulk/20'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`solve-${idea.id}`}
                            checked={step4.evaluations[index]?.solvesProblem === 'yes'}
                            onChange={() => handleSolutionChange(index, 'yes')}
                            className="sr-only"
                          />
                          Yes
                        </label>
                        <label 
                          className={`flex items-center gap-1 cursor-pointer px-3 py-1 rounded-full font-bold text-sm transition-all ${
                            step4.evaluations[index]?.solvesProblem === 'no' 
                              ? 'bg-hero-spidey text-white shadow' 
                              : 'bg-gray-100 text-gray-600 hover:bg-hero-spidey/20'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`solve-${idea.id}`}
                            checked={step4.evaluations[index]?.solvesProblem === 'no'}
                            onChange={() => handleSolutionChange(index, 'no')}
                            className="sr-only"
                          />
                          No
                        </label>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </motion.div>

        {/* Tip box */}
        <motion.div 
          className="p-4 bg-gradient-to-r from-hero-frozen/30 via-white to-hero-frozen/30 rounded-2xl border-3 border-hero-frozen shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-center text-lg font-black text-hero-cap-blue">
            Tip: Look for the idea with the highest score that solves the problem!
          </p>
        </motion.div>

        {/* Extra characters */}
        <div className="flex justify-center gap-4 pt-2">
          {[
            { src: '/images/dolubolu.png', size: 'w-10 h-10' },
            { src: '/images/jade.png', size: 'w-10 h-10' },
            { src: '/images/jackie.png', size: 'w-10 h-10' },
          ].map((char, i) => (
            <motion.div 
              key={i}
              className={`relative ${char.size}`}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
            >
              <Image src={char.src} alt="Character" fill className="object-contain" />
            </motion.div>
          ))}
        </div>
      </div>

      <PageFooter prevLink="/step3" nextLink="/step5" />
    </PlaybookPage>
  );
}
