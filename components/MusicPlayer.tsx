'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Simple synthesized background music using Web Audio API
const createBackgroundMusic = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    return audioContext;
  } catch {
    return null;
  }
};

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const playNote = useCallback((frequency: number, duration: number, delay: number = 0) => {
    if (!audioContextRef.current || !gainNodeRef.current) return;
    
    const osc = audioContextRef.current.createOscillator();
    const noteGain = audioContextRef.current.createGain();
    
    osc.connect(noteGain);
    noteGain.connect(gainNodeRef.current);
    
    osc.frequency.value = frequency;
    osc.type = 'sine';
    
    const startTime = audioContextRef.current.currentTime + delay;
    noteGain.gain.setValueAtTime(0.1, startTime);
    noteGain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
    
    osc.start(startTime);
    osc.stop(startTime + duration);
    
    oscillatorsRef.current.push(osc);
  }, []);

  const playMelody = useCallback(() => {
    // Simple happy melody notes (C major scale patterns)
    const notes = [
      { freq: 523.25, dur: 0.3 }, // C5
      { freq: 587.33, dur: 0.3 }, // D5
      { freq: 659.25, dur: 0.4 }, // E5
      { freq: 523.25, dur: 0.3 }, // C5
      { freq: 783.99, dur: 0.5 }, // G5
      { freq: 659.25, dur: 0.3 }, // E5
      { freq: 698.46, dur: 0.3 }, // F5
      { freq: 783.99, dur: 0.5 }, // G5
    ];
    
    let delay = 0;
    notes.forEach((note) => {
      playNote(note.freq, note.dur, delay);
      delay += note.dur + 0.1;
    });
  }, [playNote]);

  const startMusic = useCallback(() => {
    audioContextRef.current = createBackgroundMusic();
    if (!audioContextRef.current) return;
    
    gainNodeRef.current = audioContextRef.current.createGain();
    gainNodeRef.current.connect(audioContextRef.current.destination);
    gainNodeRef.current.gain.value = volume;
    
    // Play melody loop
    playMelody();
    intervalRef.current = setInterval(() => {
      playMelody();
    }, 4000);
    
    setIsPlaying(true);
  }, [volume, playMelody]);

  const stopMusic = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    oscillatorsRef.current.forEach(osc => {
      try { osc.stop(); } catch {}
    });
    oscillatorsRef.current = [];
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume;
    }
  }, [volume]);

  useEffect(() => {
    return () => {
      stopMusic();
    };
  }, [stopMusic]);

  const togglePlay = () => {
    if (isPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  };

  return (
    <motion.div 
      className="fixed top-4 right-4 z-50 no-print"
      initial={{ opacity: 0, scale: 0, rotate: -180 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ delay: 1, type: 'spring' }}
    >
      <motion.div 
        className="bg-white/90 backdrop-blur-lg rounded-full shadow-2xl p-2 flex items-center gap-2 border-4 border-hero-startup"
        whileHover={{ scale: 1.05 }}
        onHoverStart={() => setShowVolumeSlider(true)}
        onHoverEnd={() => setShowVolumeSlider(false)}
      >
        <motion.button
          onClick={togglePlay}
          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
          style={{
            background: isPlaying 
              ? 'linear-gradient(135deg, #4CAF50, #00A651)' 
              : 'linear-gradient(135deg, #E23636, #F37021)',
            boxShadow: isPlaying 
              ? '0 4px 20px rgba(76,175,80,0.5)' 
              : '0 4px 20px rgba(226,54,54,0.5)'
          }}
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          animate={isPlaying ? { rotate: [0, 5, -5, 0] } : {}}
          transition={{ duration: 0.5, repeat: isPlaying ? Infinity : 0 }}
        >
          {isPlaying ? '🎵' : '🔇'}
        </motion.button>
        
        <AnimatePresence>
          {showVolumeSlider && isPlaying && (
            <motion.input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-20 h-2 accent-sns-green cursor-pointer"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 80, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
