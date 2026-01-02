'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import PageTransition from './PageTransition';

export type TemplatePage = {
  key: string;
  label?: string;
  content: React.ReactNode;
};

/**
 * App-like wrapper for PDF template screens.
 * Keeps the exact template content, but presents it as a single “screen” with in-app navigation.
 */
export default function TemplatePager({
  pages,
  title,
  routePrev,
  routeNext,
}: {
  pages: TemplatePage[];
  title: string;
  routePrev: string;
  routeNext: string;
}) {
  const safePages = useMemo(() => (pages.length ? pages : []), [pages]);
  const [index, setIndex] = useState(0);

  const pageCount = safePages.length;
  const current = safePages[Math.min(index, Math.max(0, pageCount - 1))];

  const atStart = index <= 0;
  const atEnd = index >= pageCount - 1;

  if (!current) return null;

  return (
    <div className="space-y-4">
      <div className="no-print flex items-center justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-sns-dark">{title}</div>
          <div className="text-xs text-gray-600">
            Screen {index + 1} of {pageCount}
            {current.label ? ` • ${current.label}` : ''}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {atStart ? (
            <Link href={routePrev}>
              <Button variant="secondary">← Back</Button>
            </Link>
          ) : (
            <Button variant="secondary" onClick={() => setIndex((i) => Math.max(0, i - 1))}>
              ← Back
            </Button>
          )}

          {atEnd ? (
            <Link href={routeNext}>
              <Button variant="primary">Next →</Button>
            </Link>
          ) : (
            <Button variant="primary" onClick={() => setIndex((i) => Math.min(pageCount - 1, i + 1))}>
              Next →
            </Button>
          )}
        </div>
      </div>

      <PageTransition key={current.key}>{current.content}</PageTransition>
    </div>
  );
}
