'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface PageFooterProps {
  prevLink?: string;
  nextLink?: string;
  showPrint?: boolean;
}

/**
 * Calm footer navigation.
 * Keeps the same flow (prev/next/print) without playful motion/sfx.
 */
export default function PageFooter({ prevLink, nextLink, showPrint = false }: PageFooterProps) {
  return (
    <div className="flex justify-between items-center pt-6 mt-8 border-t border-gray-200 no-print">
      <div>
        {prevLink ? (
          <Link href={prevLink}>
            <Button variant="secondary">← Previous</Button>
          </Link>
        ) : (
          <div className="w-24" />
        )}
      </div>

      <div className="flex gap-3">
        {showPrint ? (
          <Link href="/print">
            <Button variant="secondary">Print Preview</Button>
          </Link>
        ) : null}

        {nextLink ? (
          <Link href={nextLink}>
            <Button variant="primary">Next →</Button>
          </Link>
        ) : null}
      </div>
    </div>
  );
}
