'use client';

import React from 'react';

export function Heading({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <h1 className={`text-xl md:text-2xl font-bold text-sns-dark ${className}`}>{children}</h1>;
}

export function Subheading({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <h2 className={`text-sm font-semibold text-gray-700 ${className}`}>{children}</h2>;
}

export function Paragraph({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <p className={`text-sm text-gray-700 leading-6 ${className}`}>{children}</p>;
}

export function Label({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <span className={`text-xs font-semibold text-gray-600 ${className}`}>{children}</span>;
}
