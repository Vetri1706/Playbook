'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CHARACTERS } from '@/utils/constants';

interface HeroImageProps {
  characterKey: keyof typeof CHARACTERS;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  position?: 'center' | 'left' | 'right' | 'top';
  showLabel?: boolean;
}

const sizeClasses = {
  sm: 'w-20 h-20 md:w-24 md:h-24',
  md: 'w-28 h-28 md:w-36 md:h-36',
  lg: 'w-40 h-40 md:w-52 md:h-52',
  xl: 'w-56 h-56 md:w-72 md:h-72',
};

export default function HeroImage({ 
  characterKey, 
  size = 'md',
  position = 'center',
  showLabel = false
}: HeroImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState('');
  const character = CHARACTERS[characterKey];

  useEffect(() => {
    setImageSrc(character.src);
  }, [characterKey, character.src]);

  const positionClasses = {
    center: 'mx-auto',
    left: 'ml-0 mr-auto',
    right: 'ml-auto mr-0',
    top: 'mx-auto',
  };

  if (!imageSrc) {
    return null;
  }

  return (
    <motion.div 
      className={`relative ${sizeClasses[size]} ${positionClasses[position]}`}
      initial={{ opacity: 0, scale: 0, rotate: -20 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      <motion.div 
        className="w-full h-full overflow-visible relative"
        style={{
          filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.3))'
        }}
        animate={{ 
          y: [0, -8, 0],
          rotate: [-2, 2, -2],
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        whileHover={{ 
          scale: 1.15, 
          rotate: 5,
          filter: 'drop-shadow(0 15px 35px rgba(0,0,0,0.4))'
        }}
        whileTap={{ scale: 0.95 }}
      >
        {!imageError ? (
          <Image
            src={imageSrc}
            alt={character.alt}
            fill
            className="object-contain"
            sizes={`(max-width: 768px) ${size === 'sm' ? '80px' : size === 'md' ? '112px' : size === 'lg' ? '160px' : '224px'}, ${size === 'sm' ? '96px' : size === 'md' ? '144px' : size === 'lg' ? '208px' : '288px'}`}
            onError={() => setImageError(true)}
          />
        ) : (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center rounded-2xl"
            style={{
              background: `linear-gradient(135deg, ${character.colors.primary}, ${character.colors.secondary})`,
              boxShadow: `0 10px 30px ${character.colors.primary}50`
            }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="text-center">
              <motion.div 
                className={`${
                  size === 'sm' ? 'text-3xl' : 
                  size === 'md' ? 'text-4xl' : 
                  size === 'lg' ? 'text-5xl' : 
                  'text-6xl'
                }`}
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {character.emoji}
              </motion.div>
            </div>
          </motion.div>
        )}
      </motion.div>
      
      {showLabel && (
        <motion.p 
          className="text-center mt-2 font-black text-sm px-3 py-1 rounded-full"
          style={{ 
            backgroundColor: character.colors.primary,
            color: '#FFFFFF'
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {character.alt}
        </motion.p>
      )}
    </motion.div>
  );
}
