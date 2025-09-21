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
  // forceLoad: boolean to force mounting the <video> (bypass IntersectionObserver).
  // Useful when the video is inside a scrollable container that isn't the viewport (mobile stacks).
  forceLoad = false,
  // playSignal: integer that, when incremented, forces a play attempt (useful for mobile user-initiated play)
  playSignal = 0,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const wrapperRef = useRef(null);
  const videoElRef = useRef(null);
  const observerTimeoutRef = useRef(null);

  useEffect(() => {
    // If forceLoad is true, bypass IntersectionObserver and mount immediately
    if (forceLoad) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Debounce intersection changes to reduce scroll lag
        if (observerTimeoutRef.current) {
          clearTimeout(observerTimeoutRef.current);
        }

        observerTimeoutRef.current = setTimeout(() => {
          setIsInView(entry.isIntersecting);
        }, 200); // Increased debounce for better performance
      },
      { 
        threshold,
        rootMargin: '100px' // Larger margin to preload earlier
      }
    );

    if (wrapperRef.current) observer.observe(wrapperRef.current);
    return () => {
      try { observer.disconnect(); } catch (e) { /* ignore */ }
      if (observerTimeoutRef.current) {
        clearTimeout(observerTimeoutRef.current);
      }
    };
  }, [threshold, forceLoad]);

  useEffect(() => {
    const el = videoElRef.current;
    if (!el) return;

    if (isInView) {
      if (shouldAutoplay) {
        // Defer video play to next frame to avoid blocking scroll
        requestAnimationFrame(() => {
          try {
            el.muted = true;
            const p = el.play();
            if (p && p.then) p.catch(() => {});
          } catch (e) {
            // ignore
          }
        });
      }
    } else {
      // Defer video pause to avoid blocking scroll
      requestAnimationFrame(() => {
        try {
          el.pause();
        } catch (e) {
          // ignore
        }
      });
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

  // For mobile/touch devices or when forceLoad is true, always show the video
  const shouldShow = forceLoad || isInView;

  // Attempt to autoplay (muted). If the browser rejects autoplay, attach a one-time
  // user gesture listener to unlock playback (touchstart / click) and retry.
  const unlockRef = useRef(false);

  const attemptPlay = async () => {
    const el = videoElRef.current;
    if (!el) return false;
    try {
      el.muted = true;
      el.loop = true;
      const p = el.play();
      if (p && p.then) {
        await p;
      }
      return true;
    } catch (err) {
      return false;
    }
  };

  useEffect(() => {
    if (!shouldShow) return;
    if (!shouldAutoplay) return;

    let removed = false;
    const tryPlay = async () => {
      const ok = await attemptPlay();
      if (!ok && wrapperRef.current && !unlockRef.current) {
        const unlock = async () => {
          if (unlockRef.current) return;
          unlockRef.current = true;
          await attemptPlay();
          try {
            wrapperRef.current.removeEventListener('touchstart', unlock);
            wrapperRef.current.removeEventListener('click', unlock);
          } catch (e) {}
          removed = true;
        };

        wrapperRef.current.addEventListener('touchstart', unlock, { once: true });
        wrapperRef.current.addEventListener('click', unlock, { once: true });
      }
    };

    // Try immediately
    tryPlay();

    return () => {
      try {
        if (wrapperRef.current && !removed) {
          wrapperRef.current.removeEventListener('touchstart', () => {});
          wrapperRef.current.removeEventListener('click', () => {});
        }
      } catch (e) {}
    };
  }, [shouldShow, shouldAutoplay]);

  return (
    <div ref={wrapperRef} className={wrapperClass}>
      {shouldShow && (
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
            className={`absolute top-0 left-0 w-full h-full block ${fit === 'cover' ? 'object-cover' : 'object-contain'} object-center`}
            src={src}
            preload={preload}
            onLoadedData={handleLoadedData}
            onLoadedMetadata={handleLoadedData}
            onError={handleError}
            style={{
              // Simplified styling for better performance
              opacity: 1,
              zIndex: 50,
              minHeight: '300px',
              minWidth: '200px'
            }}
            autoPlay={shouldAutoplay}
            muted={true}
            // No controls - we'll fallback to user-gesture unlock if autoplay is blocked
            controls={false}
            playsInline={true}
            {...props}
          />
        </>
      )}
    </div>
  );
};

export default LazyVideo;