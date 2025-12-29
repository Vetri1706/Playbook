'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useSoundEffects } from '@/components/SoundEffects';
import Confetti from '@/components/Confetti';

export default function HomePage() {
  const [showConfetti, setShowConfetti] = useState(false);
  const { playSuccess } = useSoundEffects();

  const handleStartClick = () => {
    playSuccess();
    setShowConfetti(true);
  };

  // Large floating superhero images around the edges
  const floatingHeroes = [
    { src: '/images/spidermansmall.png', alt: 'Spider-Man', size: 'w-32 h-32 md:w-40 md:h-40', position: 'top-[5%] left-[3%]' },
    { src: '/images/hulk.png', alt: 'Hulk', size: 'w-36 h-36 md:w-44 md:h-44', position: 'top-[8%] right-[5%]' },
    { src: '/images/ironman.png', alt: 'Iron Man', size: 'w-28 h-28 md:w-36 md:h-36', position: 'top-[40%] left-[2%]' },
    { src: '/images/blackwidow.png', alt: 'Black Widow', size: 'w-28 h-28 md:w-32 md:h-32', position: 'top-[35%] right-[3%]' },
    { src: '/images/Captain america.png', alt: 'Captain America', size: 'w-32 h-32 md:w-40 md:h-40', position: 'bottom-[25%] left-[4%]' },
    { src: '/images/thorhammer.png', alt: 'Thor', size: 'w-24 h-24 md:w-32 md:h-32', position: 'bottom-[20%] right-[6%]' },
    { src: '/images/supergirl.png', alt: 'Supergirl', size: 'w-28 h-28 md:w-36 md:h-36', position: 'bottom-[8%] left-[8%]' },
    { src: '/images/wonderwomanlogo.png', alt: 'Wonder Woman', size: 'w-24 h-24 md:w-28 md:h-28', position: 'bottom-[12%] right-[2%]' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      <Confetti trigger={showConfetti} />
      
      {/* Vibrant rainbow animated background */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(226,54,54,0.10) 0%, rgba(243,112,33,0.10) 15%, rgba(255,235,59,0.10) 30%, rgba(0,166,81,0.10) 45%, rgba(4,118,242,0.10) 60%, rgba(103,58,183,0.10) 75%, rgba(244,179,194,0.10) 90%, rgba(226,54,54,0.10) 100%)'
          }}
          animate={{
            background: [
              'linear-gradient(135deg, rgba(226,54,54,0.15) 0%, rgba(243,112,33,0.15) 15%, rgba(255,235,59,0.15) 30%, rgba(0,166,81,0.15) 45%, rgba(4,118,242,0.15) 60%, rgba(103,58,183,0.15) 75%, rgba(244,179,194,0.15) 90%, rgba(226,54,54,0.15) 100%)',
              'linear-gradient(135deg, rgba(103,58,183,0.15) 0%, rgba(226,54,54,0.15) 15%, rgba(243,112,33,0.15) 30%, rgba(255,235,59,0.15) 45%, rgba(0,166,81,0.15) 60%, rgba(4,118,242,0.15) 75%, rgba(103,58,183,0.15) 90%, rgba(244,179,194,0.15) 100%)',
            ]
          }}
          transition={{ duration: 12, repeat: Infinity, repeatType: 'reverse' }}
        />
        
        {/* Large floating colorful orbs */}
        <motion.div 
          className="absolute top-0 left-0 w-[400px] h-[400px] bg-gradient-to-br from-hero-spidey/40 to-hero-spidey-blue/30 rounded-full blur-3xl"
          animate={{ scale: [1, 1.4, 1], x: [0, 50, 0], y: [0, -40, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute top-10 right-0 w-[500px] h-[500px] bg-gradient-to-br from-hero-thanos/30 to-hero-peppa/40 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], x: [0, -60, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-0 left-10 w-[450px] h-[450px] bg-gradient-to-br from-sns-green/40 to-hero-hulk/30 rounded-full blur-3xl"
          animate={{ y: [0, 60, 0] }}
          transition={{ duration: 9, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-gradient-to-br from-hero-startup/50 to-sns-orange/40 rounded-full blur-3xl"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 7, repeat: Infinity }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/3 w-[350px] h-[350px] bg-gradient-to-br from-hero-frozen/40 to-hero-cap-blue/30 rounded-full blur-3xl"
          animate={{ x: [-40, 40, -40], y: [-30, 30, -30] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute top-1/3 right-1/3 w-[300px] h-[300px] bg-gradient-to-br from-hero-peppa/40 to-hero-bheem/30 rounded-full blur-3xl"
          animate={{ scale: [1.1, 0.9, 1.1], rotate: [0, 180, 360] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
      </div>

      {/* Large floating superhero images around the edges */}
      {floatingHeroes.map((hero, index) => (
        <motion.div
          key={hero.alt}
          className={`absolute ${hero.position} ${hero.size} z-20`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            y: [0, -12, 0],
            rotate: index % 2 === 0 ? [-6, 6, -6] : [6, -6, 6],
          }}
          transition={{ 
            opacity: { delay: 0.3 + index * 0.1, duration: 0.5 },
            scale: { delay: 0.3 + index * 0.1, duration: 0.5, type: 'spring' },
            y: { delay: 0.8, duration: 2.5 + index * 0.3, repeat: Infinity },
            rotate: { delay: 0.8, duration: 3.5 + index * 0.2, repeat: Infinity },
          }}
          whileHover={{ scale: 1.15, rotate: 10 }}
        >
          <div className="relative w-full h-full drop-shadow-2xl">
            <Image src={hero.src} alt={hero.alt} fill className="object-contain" />
          </div>
        </motion.div>
      ))}

      <motion.div 
        className="max-w-5xl w-full text-center space-y-4 md:space-y-6 relative z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* Logos */}
        <motion.div 
          className="flex justify-center gap-4 md:gap-8 mb-4 md:mb-6"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <motion.div 
            className="bg-white/95 backdrop-blur-lg p-3 md:p-5 rounded-3xl shadow-2xl border-4 border-sns-orange"
            whileHover={{ scale: 1.1, rotate: 3 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-24 h-12 md:w-40 md:h-20 relative">
              <Image src="/images/snslogo.png" alt="SNS" fill className="object-contain" />
            </div>
          </motion.div>
          <motion.div 
            className="bg-white/95 backdrop-blur-lg p-3 md:p-5 rounded-3xl shadow-2xl border-4 border-sns-green"
            whileHover={{ scale: 1.1, rotate: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-24 h-12 md:w-40 md:h-20 relative">
              <Image src="/images/snsacademylogo.png" alt="SNS Academy" fill className="object-contain" />
            </div>
          </motion.div>
        </motion.div>

        {/* Main Title with rainbow gradient */}
        <motion.h1 
          className="text-4xl md:text-6xl lg:text-8xl font-display font-black"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        >
          <motion.span 
            className="bg-clip-text text-transparent drop-shadow-lg inline-block"
            style={{
              backgroundImage: 'linear-gradient(135deg, #E23636 0%, #F37021 20%, #FFEB3B 40%, #00A651 60%, #0476F2 80%, #673ab7 100%)',
              backgroundSize: '200% 200%'
            }}
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            Design Thinking
          </motion.span>
          <br />
          <motion.span 
            className="bg-clip-text text-transparent inline-block"
            style={{
              backgroundImage: 'linear-gradient(135deg, #673ab7 0%, #E23636 33%, #F37021 66%, #FFEB3B 100%)',
              backgroundSize: '200% 200%'
            }}
            animate={{ 
              backgroundPosition: ['100% 50%', '0% 50%', '100% 50%'],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Playbook
          </motion.span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          className="text-xl md:text-2xl lg:text-3xl font-bold drop-shadow-lg"
          style={{
            background: 'linear-gradient(90deg, #E23636, #F37021, #FFEB3B)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Join the mission to solve problems like a superhero!
        </motion.p>

        {/* Main Hero Characters Row - LARGE */}
        <motion.div 
          className="my-6 md:my-8 flex justify-center items-center gap-4 md:gap-8"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 150 }}
        >
          {/* Dora */}
          <motion.div 
            className="relative w-20 h-20 md:w-28 md:h-28"
            animate={{ y: [0, -15, 0], rotate: [-5, 5, -5] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            whileHover={{ scale: 1.2 }}
          >
            <Image src="/images/dora.png" alt="Dora" fill className="object-contain drop-shadow-xl" />
          </motion.div>

          {/* Peppa */}
          <motion.div 
            className="relative w-24 h-24 md:w-32 md:h-32"
            animate={{ y: [0, -12, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 2.8, repeat: Infinity, delay: 0.2 }}
            whileHover={{ scale: 1.2 }}
          >
            <Image src="/images/peppapig.png" alt="Peppa Pig" fill className="object-contain drop-shadow-xl" />
          </motion.div>

          {/* Spider-Man - MAIN - Extra Large */}
          <motion.div 
            className="relative w-40 h-40 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #E23636 0%, #0476F2 100%)',
              boxShadow: '0 30px 100px rgba(226,54,54,0.7), 0 0 0 12px rgba(4,118,242,0.5), 0 0 0 24px rgba(226,54,54,0.3)'
            }}
            animate={{ 
              y: [0, -25, 0],
              rotate: [-3, 3, -3],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ scale: 1.2 }}
          >
            <Image src="/images/spidermansmall.png" alt="Spider-Man" fill className="object-contain p-6 md:p-8" priority />
          </motion.div>

          {/* Bheem */}
          <motion.div 
            className="relative w-24 h-24 md:w-32 md:h-32"
            animate={{ y: [0, -12, 0], rotate: [5, -5, 5] }}
            transition={{ duration: 2.6, repeat: Infinity, delay: 0.4 }}
            whileHover={{ scale: 1.2 }}
          >
            <Image src="/images/chottabheem.png" alt="Chhota Bheem" fill className="object-contain drop-shadow-xl" />
          </motion.div>

          {/* Olaf */}
          <motion.div 
            className="relative w-20 h-20 md:w-28 md:h-28"
            animate={{ y: [0, -15, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: 0.6 }}
            whileHover={{ scale: 1.2 }}
          >
            <Image src="/images/olaf.png" alt="Olaf" fill className="object-contain drop-shadow-xl" />
          </motion.div>
        </motion.div>

        {/* Second Row of Characters - Medium */}
        <motion.div 
          className="flex justify-center items-center gap-3 md:gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          {[
            { src: '/images/masha.png', delay: 0 },
            { src: '/images/tom.png', delay: 0.1 },
            { src: '/images/jerry.png', delay: 0.2 },
            { src: '/images/jackie.png', delay: 0.3 },
            { src: '/images/jade.png', delay: 0.4 },
            { src: '/images/pawpatrol.png', delay: 0.5 },
            { src: '/images/joy.png', delay: 0.6 },
          ].map((hero, i) => (
            <motion.div
              key={i}
              className="w-12 h-12 md:w-16 md:h-16 relative"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
              transition={{ 
                opacity: { delay: 0.8 + hero.delay },
                scale: { delay: 0.8 + hero.delay, type: 'spring' },
                y: { delay: 1.2, duration: 2, repeat: Infinity }
              }}
              whileHover={{ scale: 1.4, rotate: 15 }}
            >
              <Image src={hero.src} alt="Character" fill className="object-contain drop-shadow-lg" />
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div 
          className="pt-6 md:pt-8"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, type: 'spring' }}
        >
          <Link href="/step1" onClick={handleStartClick}>
            <motion.div
              className="inline-block font-black text-xl md:text-2xl lg:text-3xl px-10 md:px-16 py-5 md:py-7 rounded-full text-white cursor-pointer relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #E23636 0%, #F37021 25%, #FFEB3B 50%, #00A651 75%, #0476F2 100%)',
                backgroundSize: '200% 200%',
                boxShadow: '0 25px 80px rgba(226,54,54,0.6), 0 15px 40px rgba(243,112,33,0.5), 0 0 0 6px rgba(255,235,59,0.4)'
              }}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                y: [0, -10, 0],
              }}
              whileHover={{ 
                scale: 1.15, 
                boxShadow: '0 35px 100px rgba(226,54,54,0.8), 0 20px 50px rgba(243,112,33,0.7), 0 0 0 8px rgba(255,235,59,0.6)',
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ 
                backgroundPosition: { duration: 3, repeat: Infinity },
                y: { duration: 1.5, repeat: Infinity }
              }}
            >
              <motion.span
                className="relative z-10 drop-shadow-lg"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                START YOUR MISSION
              </motion.span>
              
              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                animate={{ x: ['-200%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              />
            </motion.div>
          </Link>
        </motion.div>

        {/* Tagline */}
        <motion.p 
          className="text-lg md:text-xl font-bold pt-2 md:pt-4"
          style={{
            background: 'linear-gradient(90deg, #673ab7, #0476F2, #00A651)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Think like a designer. Solve like a hero.
        </motion.p>
      </motion.div>
    </div>
  );
}
