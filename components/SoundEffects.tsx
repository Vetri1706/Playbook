'use client';

import { useRef, useCallback } from 'react';

// Sound effect URLs (using Web Audio API for generated sounds)
const createBeep = (frequency: number, duration: number, type: OscillatorType = 'sine') => {
  if (typeof window === 'undefined') return () => {};
  
  return () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (e) {
      // Audio not supported
    }
  };
};

export const useSoundEffects = () => {
  const playClick = useCallback(() => {
    createBeep(800, 0.1, 'sine')();
  }, []);

  const playSuccess = useCallback(() => {
    createBeep(523.25, 0.15, 'sine')();
    setTimeout(() => createBeep(659.25, 0.15, 'sine')(), 100);
    setTimeout(() => createBeep(783.99, 0.2, 'sine')(), 200);
  }, []);

  const playPop = useCallback(() => {
    createBeep(1200, 0.05, 'sine')();
  }, []);

  const playWhoosh = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.2);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (e) {}
  }, []);

  const playCelebration = useCallback(() => {
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => {
      setTimeout(() => createBeep(freq, 0.2, 'sine')(), i * 100);
    });
  }, []);

  return {
    playClick,
    playSuccess,
    playPop,
    playWhoosh,
    playCelebration,
  };
};

// Hook for button with sound
export const useButtonSound = () => {
  const { playClick, playPop } = useSoundEffects();
  
  const handleClick = useCallback((callback?: () => void) => {
    playPop();
    callback?.();
  }, [playPop]);

  return handleClick;
};
