"use client";

import React, { useEffect, useRef, useState } from "react";
import LazyVideo from "./LazyVideo";

/**
 * TemplateColumn - reusable grid item that can span columns/rows and render a video.
 * props:
 * - src: video src
 * - colSpan: number of columns to span (Tailwind uses col-span-{n})
 * - rowSpan: number of rows to span (Tailwind uses row-span-{n})
 * - className: additional classes for the container
 */
const TemplateColumn = ({
  src,
  colSpan = 1,
  rowSpan = 1,
  className = "",
  showLoader = false,
  // new zoom props
  defaultZoom = false,
  zoomScale = 1.6,
  showZoomButton = false,
  // playSignal forwarded to LazyVideo (increment to trigger play on mobile)
  playSignal = 0,
}) => {
  // local state for zoom and mouse-based parallax
  const containerRef = useRef(null);
  const videoWrapRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(!!defaultZoom);
  // Initialize as false to match server render, detect touch after mount
  const [isTouch, setIsTouch] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playCounter, setPlayCounter] = useState(0);

  useEffect(() => {
    // Run only on client: detect touch-capable devices and mark as mounted.
    if (typeof window === 'undefined') return;
    const touchDetected = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth < 1024;
    setIsTouch(!!touchDetected);
    setMounted(true);

    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const nx = (x / rect.width) * 2 - 1;
      const ny = (y / rect.height) * 2 - 1;

      const moveX = nx * 30; // subtle parallax
      const moveY = ny * 20;
      setMousePos({ x: moveX, y: moveY });
    };

    const handleLeave = () => setMousePos({ x: 0, y: 0 });

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  useEffect(() => {
    const wrap = videoWrapRef.current;
    if (!wrap) return;
    // If defaultZoom is true, use zoomScale; otherwise use 1.0 as base
    // When toggled via isZoomed, apply zoomScale
    const scale = (defaultZoom || isZoomed) ? zoomScale : 1.0;
    wrap.style.transform = `translate(${mousePos.x}px, ${mousePos.y}px) scale(${scale})`;
    wrap.style.transition = 'transform 0.15s ease-out';
  }, [mousePos, isZoomed, zoomScale, defaultZoom]);

  return (
    <div ref={containerRef} className={`relative w-full h-full overflow-hidden ${className}`}>
      <div ref={videoWrapRef} className="w-full h-full">
        {/* Disable autoplay and preload on touch devices to save bandwidth.
            On touch devices we show a poster overlay and only trigger playback
            when the user taps the poster (incrementing playCounter). */}
        <LazyVideo
          src={src}
          fit="cover"
          preload={isTouch && !isPlaying ? 'none' : 'metadata'}
          shouldAutoplay={!isTouch}
          playSignal={playSignal + playCounter}
          loop
          muted
          playsInline
          showLoader={showLoader}
          className="w-full h-full relative"
        />

        {/* Poster overlay for touch devices (mobile). Use derived poster URL (fallback to src + .jpg) */}
        {mounted && isTouch && !isPlaying && (
          (() => {
            const posterUrl = src.includes('res.cloudinary.com') ? `${src}.jpg` : `${src}.jpg`;
            return (
              <div
                role="button"
                tabIndex={0}
                onClick={() => { setIsPlaying(true); setPlayCounter(c => c + 1); }}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setIsPlaying(true); setPlayCounter(c => c + 1); } }}
                className="absolute inset-0 z-40 flex items-center justify-center bg-black bg-opacity-60 cursor-pointer"
                style={{ backgroundImage: `url(${posterUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              >
                <div className="bg-white/90 rounded-full p-3 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            );
          })()
        )}
      </div>

      {showZoomButton && (
        <button
          onClick={() => setIsZoomed((s) => !s)}
          className="absolute top-3 right-3 z-30 bg-black/40 text-white px-2 py-1 rounded"
          style={{ pointerEvents: 'auto' }}
        >
          {isZoomed ? 'Reset' : 'Zoom'}
        </button>
      )}
    </div>
  );
};

export default TemplateColumn;

