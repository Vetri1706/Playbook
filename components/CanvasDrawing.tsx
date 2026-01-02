'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

interface CanvasDrawingProps {
  width?: number;
  height?: number;
  onSave: (dataURL: string) => void;
  initialData?: string;
  showClearButton?: boolean;
  canvasClassName?: string;
  containerClassName?: string;
  exportWithWhiteBackground?: boolean;
}

export default function CanvasDrawing({
  width = 400,
  height = 300,
  onSave,
  initialData,
  showClearButton = true,
  canvasClassName = '',
  containerClassName = '',
  exportWithWhiteBackground = true,
}: CanvasDrawingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const isDrawingRef = useRef(false);
  const [isReady, setIsReady] = useState(false);

  const dpr = useMemo(() => {
    if (typeof window === 'undefined') return 1;
    return Math.max(1, Math.min(3, window.devicePixelRatio || 1));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Ensure CSS size matches our logical coordinate system.
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Scale the backing store for crispness and correct pointer math on HiDPI screens.
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw in logical (CSS pixel) coordinates.
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctxRef.current = ctx;
    setIsReady(true);

    // Default: keep canvas transparent so the PDF background shows through.
    // We still export with a white background for reliable PDF cropping.
    ctx.clearRect(0, 0, width, height);

    if (initialData) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
      };
      img.src = initialData;
    }
  }, [initialData, width, height, dpr]);

  const getPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;

    // Map from current (potentially CSS-transformed) box to our logical coordinate system.
    const scaleX = width / rect.width;
    const scaleY = height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    return { x, y };
  };

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    const p = getPoint(e);
    if (!p) return;

    isDrawingRef.current = true;
    (e.currentTarget as HTMLCanvasElement).setPointerCapture(e.pointerId);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const ctx = ctxRef.current;
    if (!isDrawingRef.current || !ctx) return;
    const p = getPoint(e);
    if (!p) return;

    ctx.lineTo(p.x, p.y);
    ctx.strokeStyle = '#222222';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!exportWithWhiteBackground) {
      onSave(canvas.toDataURL());
      return;
    }

    const tmp = document.createElement('canvas');
    tmp.width = canvas.width;
    tmp.height = canvas.height;
    const tctx = tmp.getContext('2d');
    if (!tctx) {
      onSave(canvas.toDataURL());
      return;
    }
    tctx.fillStyle = 'white';
    tctx.fillRect(0, 0, tmp.width, tmp.height);
    tctx.drawImage(canvas, 0, 0);
    onSave(tmp.toDataURL());
  };

  const clearCanvas = () => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    onSave('');
  };

  return (
    <div className={containerClassName}>
      <div className="relative">
        <canvas
          ref={canvasRef}
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerCancel={stopDrawing}
          onPointerLeave={stopDrawing}
          className={`block cursor-crosshair touch-none select-none ${canvasClassName}`}
        />
        {showClearButton ? (
          <button
            type="button"
            onClick={clearCanvas}
            className="absolute top-2 right-2 rounded-md border border-gray-200 bg-white/80 px-2 py-1 text-xs text-gray-700 backdrop-blur hover:bg-white"
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}
