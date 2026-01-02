'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

const BASE_W = 768;
const BASE_H = 576;

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

export type PdfRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type PdfPageProps = {
  pageNumber: number;
  children?: React.ReactNode;
  className?: string;
};

export default function PdfPage({ pageNumber, children, className = '' }: PdfPageProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  const backendUrl = useMemo(() => {
    const configured = process.env.NEXT_PUBLIC_BACKEND_URL;
    const fallback = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000';
    const raw = (configured ?? fallback).replace(/\/$/, '');
    return raw;
  }, []);

  const bgSrc = `${backendUrl}/static/pdf_backgrounds/page_${pad2(pageNumber)}.png`;

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;

    const ro = new ResizeObserver(entries => {
      const entry = entries[0];
      if (!entry) return;
      const width = entry.contentRect.width;
      if (!width) return;
      setScale(width / BASE_W);
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className={`w-full max-w-5xl mx-auto ${className}`} ref={hostRef}>
      <div className="relative" style={{ height: BASE_H * scale }}>
        <div
          className="relative"
          style={{
            width: BASE_W,
            height: BASE_H,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          <img
            src={bgSrc}
            alt={`PDF page ${pageNumber}`}
            width={BASE_W}
            height={BASE_H}
            draggable={false}
            className="absolute inset-0 w-full h-full select-none"
            style={{ objectFit: 'contain' }}
          />
          {children}
        </div>
      </div>
    </div>
  );
}

export function PdfBox({
  rect,
  children,
  className = '',
}: {
  rect: PdfRect;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`absolute overflow-hidden ${className}`}
      style={{ left: rect.x, top: rect.y, width: rect.width, height: rect.height }}
    >
      {children}
    </div>
  );
}

export function PdfTextAreaField(props: {
  rect: PdfRect;
  value: string;
  onChangeAction: (value: string) => void;
  className?: string;
  placeholder?: string;
  align?: 'left' | 'center' | 'right';
  fontSize?: number;
  padding?: number;
}) {
  const {
    rect,
    value,
    onChangeAction,
    className = '',
    placeholder = '',
    align = 'left',
    fontSize = 11,
    padding = 4,
  } = props;
  const textAlign = align;

  return (
    <textarea
      value={value}
      onChange={e => onChangeAction(e.target.value)}
      placeholder={placeholder}
      className={`absolute resize-none bg-transparent text-sns-dark placeholder:text-gray-400 focus:outline-none ${className}`}
      style={{
        left: rect.x,
        top: rect.y,
        width: rect.width,
        height: rect.height,
        padding,
        fontSize,
        lineHeight: '1.2',
        textAlign,
      }}
    />
  );
}

export function PdfInputField(props: {
  rect: PdfRect;
  value: string;
  onChangeAction: (value: string) => void;
  className?: string;
  placeholder?: string;
  align?: 'left' | 'center' | 'right';
  fontSize?: number;
  padding?: number;
}) {
  const {
    rect,
    value,
    onChangeAction,
    className = '',
    placeholder = '',
    align = 'left',
    fontSize = 12,
    padding = 4,
  } = props;
  const textAlign = align;

  return (
    <input
      value={value}
      onChange={e => onChangeAction(e.target.value)}
      placeholder={placeholder}
      className={`absolute bg-transparent text-sns-dark placeholder:text-gray-400 focus:outline-none ${className}`}
      style={{
        left: rect.x,
        top: rect.y,
        width: rect.width,
        height: rect.height,
        padding,
        fontSize,
        lineHeight: '1.2',
        textAlign,
      }}
    />
  );
}
