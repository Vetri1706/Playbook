'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Calm page transition (Material/Notion-ish): small fade + slight lift.
 * Respects prefers-reduced-motion.
 */
export default function PageTransition({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
