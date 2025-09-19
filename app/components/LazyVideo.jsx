"use client";

import React, { useEffect, useRef, useState } from 'react';

/**
 * LazyVideo Component with Intersection Observer
 * Optimizes video loading by only loading videos when they come into view
 */
const LazyVideo = ({
  src,
  className = "",
  showLoader = true,
  threshold = 0.25,
  loaderClassName = "absolute inset-0 bg-gray-800 flex items-center justify-center",
  fit = 'contain', // 'cover' | 'contain'
  preload = 'metadata', // 'auto' | 'metadata' | 'none'
  shouldAutoplay = true,
  // playSignal: integer that, when incremented, forces a play attempt (useful for mobile user-initiated play)
  playSignal = 0,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const wrapperRef = useRef(null);
  const videoElRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // update visibility continuously; play when visible, pause when not
        setIsInView(entry.isIntersecting);
      },
      { threshold }
    );

    if (wrapperRef.current) observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, [threshold]);

  useEffect(() => {
    const el = videoElRef.current;
    if (!el) return;

    if (isInView) {
      if (shouldAutoplay) {
        // ensure muted so autoplay is allowed
        try {
          el.muted = true;
          const p = el.play();
          if (p && p.then) p.catch(() => {});
        } catch (e) {
          // ignore
        }
      }
    } else {
      // pause when out of view to save CPU/bandwidth
      try {
        el.pause();
      } catch (e) {
        // ignore
      }
    }
  }, [isInView, shouldAutoplay]);

  // If playSignal increments (user tapped play on mobile), force the video to render and try to play
  const playSignalRef = useRef(playSignal);
  useEffect(() => {
    if (playSignal === playSignalRef.current) return;
    // store new value
    playSignalRef.current = playSignal;

    const el = videoElRef.current;
    if (!el) {
      // If not rendered yet, mark in-view so it mounts; IntersectionObserver will handle playback when it becomes visible
      setIsInView(true);
      return;
    }

    try {
      // user-initiated play should allow sound if desired; keep muted to match autoplay behavior
      el.muted = true;
      const p = el.play();
      if (p && p.then) p.catch(() => {});
    } catch (e) {
      // ignore
    }
  }, [playSignal]);

  const handleLoadedData = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(false);
  };

  const wrapperClass = `${className} ${fit === 'contain' ? 'bg-black' : ''}`;

  return (
    <div ref={wrapperRef} className={wrapperClass}>
      {isInView && (
        <>
          {showLoader && !isLoaded && !hasError && (
            <div className={loaderClassName}>
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {hasError && (
            <div className={loaderClassName}>
              <div className="text-white text-center">
                <div className="mb-2">⚠️</div>
                <div className="text-sm">Video failed to load</div>
              </div>
            </div>
          )}

          <video
            ref={videoElRef}
            className={`absolute top-0 left-0 w-full h-full ${fit === 'cover' ? 'object-cover' : 'object-contain'} object-center`}
            src={src}
            preload={preload}
            onLoadedData={handleLoadedData}
            onError={handleError}
            style={{
              opacity: isLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out',
            }}
            autoPlay={shouldAutoplay}
            muted={true}
            playsInline={true}
            {...props}
          />
        </>
      )}
    </div>
  );
};

export default LazyVideo;