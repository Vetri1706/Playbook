'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface StickersProps {
  images: string[];
  variant?: 'mosaic' | 'strip';
  label?: string;
}

const sizeClass = (i: number, variant: 'mosaic' | 'strip') => {
  if (variant === 'mosaic') {
    const pattern = ['xl', 'lg', 'md', 'lg', 'xl', 'md'];
    const size = pattern[i % pattern.length];
    switch (size) {
      case 'xl': return 'h-32 w-32 md:h-44 md:w-44';
      case 'lg': return 'h-24 w-24 md:h-36 md:w-36';
      case 'md': return 'h-20 w-20 md:h-28 md:w-28';
      default: return 'h-16 w-16 md:h-24 md:w-24';
    }
  }
  const pattern = ['lg', 'md', 'lg', 'md', 'lg'];
  const size = pattern[i % pattern.length];
  switch (size) {
    case 'lg': return 'h-24 w-24 md:h-32 md:w-32';
    case 'md': return 'h-20 w-20 md:h-28 md:w-28';
    default: return 'h-20 w-20 md:h-24 md:w-24';
  }
};

export default function Stickers({ images, variant = 'mosaic', label }: StickersProps) {
  return (
    <div className="w-full py-4">
      {label && (
        <motion.p 
          className="text-center text-lg font-bold text-hero-thanos mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {label}
        </motion.p>
      )}
      <div className={variant === 'mosaic' 
        ? 'flex flex-wrap justify-center items-end gap-2 md:gap-4' 
        : 'flex flex-wrap justify-center items-center gap-2 md:gap-3'
      }>
        {images.map((img, i) => (
          <motion.div 
            key={`${img}-${i}`} 
            className={`relative ${sizeClass(i, variant)} cursor-pointer`}
            style={{
              filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.2))'
            }}
            initial={{ 
              opacity: 0, 
              scale: 0, 
              rotate: Math.random() * 40 - 20,
              y: 50
            }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              rotate: (i % 2 === 0 ? -1 : 1) * (3 + i % 4),
              y: (i % 2 === 0 ? -1 : 1) * (5 + i % 3 * 3)
            }}
            transition={{ 
              delay: i * 0.1,
              type: 'spring',
              stiffness: 200,
              damping: 15
            }}
            whileHover={{ 
              scale: 1.3, 
              rotate: 0, 
              y: -10,
              zIndex: 10,
              filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.3))'
            }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              className="w-full h-full relative"
              animate={{ 
                y: [0, -5, 0],
              }}
              transition={{ 
                duration: 2 + i * 0.3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.2
              }}
            >
              <Image
                src={`/images/${img}`}
                alt={img.replace(/\.[a-zA-Z]+$/, '')}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 96px, 176px"
              />
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
