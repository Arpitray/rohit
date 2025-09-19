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
}) => {
  // local state for zoom and mouse-based parallax
  const containerRef = useRef(null);
  const videoWrapRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(!!defaultZoom);
  // Detect touch support on client only to avoid SSR reference to `window`.
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Run only on client: detect touch-capable devices.
    try {
      setIsTouch(typeof window !== 'undefined' && 'ontouchstart' in window);
    } catch (e) {
      setIsTouch(false);
    }

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
        {/* Disable autoplay and preload on touch devices to save bandwidth. */}
        <LazyVideo
          src={src}
          fit="cover"
          preload={isTouch ? 'none' : 'metadata'}
          shouldAutoplay={!isTouch}
          loop
          muted
          playsInline
          showLoader={showLoader}
          className="w-full h-full relative"
        />
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

