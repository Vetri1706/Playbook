'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface InputFieldProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'number';
  required?: boolean;
}

export default function InputField({
  label,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  required = false,
}: InputFieldProps) {
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
      <motion.input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-5 py-4 border-3 border-sns-orange/50 rounded-2xl text-lg focus:border-sns-orange focus:outline-none focus:ring-4 focus:ring-sns-orange/30 transition-all bg-white/80 backdrop-blur shadow-inner placeholder:text-gray-400"
        style={{
          borderWidth: '3px'
        }}
        whileFocus={{ scale: 1.02, boxShadow: '0 0 20px rgba(243,112,33,0.3)' }}
      />
    </motion.div>
  );
}
