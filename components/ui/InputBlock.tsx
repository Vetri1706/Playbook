'use client';

import React from 'react';
import { Label, Paragraph } from './Text';

/**
 * Reusable block for form controls.
 * Use to keep spacing/typography consistent across screens.
 */
export default function InputBlock({
  label,
  help,
  children,
  className = '',
}: {
  label: string;
  help?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-lg border border-gray-200 bg-white p-4 ${className}`}>
      <div className="flex flex-col gap-1">
        <Label className="text-gray-800">{label}</Label>
        {help ? <Paragraph className="text-xs leading-5">{help}</Paragraph> : null}
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}
