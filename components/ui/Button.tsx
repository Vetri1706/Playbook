'use client';

import React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

const base =
  'inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-sns-orange/40 disabled:opacity-50 disabled:cursor-not-allowed';

const variants: Record<Variant, string> = {
  primary: 'bg-sns-green text-white hover:opacity-95',
  secondary: 'bg-white text-sns-dark border border-gray-200 hover:bg-gray-50',
  ghost: 'bg-transparent text-sns-dark hover:bg-gray-100',
};

export function Button({ variant = 'secondary', className = '', ...rest }: Props) {
  return <button className={`${base} ${variants[variant]} ${className}`} {...rest} />;
}
