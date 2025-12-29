'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface TextAreaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}

export default function TextArea({
  label,
  value,
  onChange,
  placeholder = '',
  rows = 4,
  required = false,
}: TextAreaProps) {
  return (
    <motion.div 
      className="space-y-2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <label className="block text-lg font-bold text-sns-dark">
        {label}
        {required && <span className="text-hero-spidey ml-1">*</span>}
      </label>
      <motion.textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-5 py-4 border-3 border-hero-thanos/40 rounded-2xl text-lg focus:border-hero-thanos focus:outline-none focus:ring-4 focus:ring-hero-thanos/30 transition-all resize-none bg-white/80 backdrop-blur shadow-inner placeholder:text-gray-400"
        style={{
          borderWidth: '3px'
        }}
        whileFocus={{ scale: 1.01, boxShadow: '0 0 20px rgba(103,58,183,0.3)' }}
      />
    </motion.div>
  );
}
