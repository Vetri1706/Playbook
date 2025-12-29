'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSoundEffects } from './SoundEffects';

const stepColors = [
  { bg: '#FF6600', border: '#4B5320' },
  { bg: '#673ab7', border: '#F4B3C2' },
  { bg: '#212121', border: '#9C27B0' },
  { bg: '#B3E5FC', border: '#0288D1' },
  { bg: '#0D47A1', border: '#B71C1C' },
];

export default function ProgressBar() {
  const pathname = usePathname();
  const { playPop } = useSoundEffects();
  
  const steps = [
    { number: 1, path: '/step1', label: 'Empathize' },
    { number: 2, path: '/step2', label: 'Define' },
    { number: 3, path: '/step3', label: 'Ideate' },
    { number: 4, path: '/step4', label: 'Evaluate' },
    { number: 5, path: '/step5', label: 'Prototype' },
  ];

  const currentStep = steps.find(s => s.path === pathname)?.number || 0;

  return (
    <motion.div 
      className="w-full max-w-4xl mx-auto py-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <Link
              href={step.path}
              onClick={() => playPop()}
              className={`flex flex-col items-center group ${
                step.number <= currentStep ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              <motion.div
                className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-lg shadow-lg ${
                  step.number === currentStep ? 'ring-4' : ''
                }`}
                style={{
                  background: step.number <= currentStep 
                    ? `linear-gradient(135deg, ${stepColors[index].bg}, ${stepColors[index].border})`
                    : '#E0E0E0',
                  color: step.number <= currentStep ? '#FFFFFF' : '#9E9E9E',
                  boxShadow: step.number === currentStep 
                    ? `0 8px 25px ${stepColors[index].bg}60, 0 0 0 4px ${stepColors[index].border}`
                    : 'none',
                }}
                initial={{ scale: 0 }}
                animate={{ 
                  scale: step.number === currentStep ? [1, 1.1, 1] : 1,
                }}
                transition={{ 
                  scale: { duration: 1.5, repeat: step.number === currentStep ? Infinity : 0 },
                  delay: index * 0.1
                }}
                whileHover={{ scale: 1.15, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                {step.number < currentStep ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' }}
                  >
                    ✓
                  </motion.span>
                ) : (
                  step.number
                )}
              </motion.div>
              <motion.span 
                className={`text-xs mt-2 font-bold ${
                  step.number === currentStep ? 'text-sns-orange' : 'text-gray-600'
                }`}
                animate={step.number === currentStep ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {step.label}
              </motion.span>
            </Link>
            {index < steps.length - 1 && (
              <motion.div
                className="flex-1 h-2 mx-2 rounded-full overflow-hidden"
                style={{
                  background: '#E0E0E0'
                }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${stepColors[index].bg}, ${stepColors[index + 1].bg})`
                  }}
                  initial={{ width: '0%' }}
                  animate={{ 
                    width: step.number < currentStep ? '100%' : '0%'
                  }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                />
              </motion.div>
            )}
          </React.Fragment>
        ))}
      </div>
    </motion.div>
  );
}
