"use client";

import React, { useEffect, useRef, useState } from 'react'

/**
 * LazyVideo Component with Intersection Observer
 * Optimizes video loading by only loading videos when they come into view
 * 
 * @param {string} src - Video source URL
 * @param {string} className - CSS classes for the container
 * @param {boolean} showLoader - Whether to show loading spinner (default: true)
 * @param {number} threshold - Intersection observer threshold (default: 0.1)
 * @param {object} ...props - Additional props passed to video element
 */
const LazyVideo = ({ 
  src, 
  className = "", 
  showLoader = true, 
  threshold = 0.1,
  loaderClassName = "absolute inset-0 bg-gray-800 flex items-center justify-center",
  // fit: 'cover' | 'contain' - default to contain so the whole video is visible
  fit = 'contain',
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [hasError, setHasError] = useState(false)
  const videoRef = useRef(null)
  const videoElRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    if (videoRef.current) {
      observer.observe(videoRef.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  // Try to play the video when it becomes visible. Some browsers require a user gesture
  // unless the video is muted. We still attempt programmatic play and ignore rejection.
  useEffect(() => {
    if (isInView && videoElRef.current) {
      const el = videoElRef.current
      // ensure muted so autoplay is allowed in most browsers
      el.muted = true
      const playPromise = el.play()
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise.catch(() => {
          // ignore autoplay rejection; video will remain paused until user interacts
        })
      }
    }
  }, [isInView])

  const handleLoadedData = () => {
    setIsLoaded(true)
    setHasError(false)
  }

  const handleError = () => {
    setHasError(true)
    setIsLoaded(false)
  }

  // if using contain, add a neutral background so letterboxing looks clean
  const wrapperClass = `${className} ${fit === 'contain' ? 'bg-black' : ''}`;

  return (
    <div ref={videoRef} className={wrapperClass}>
      {isInView && (
        <>
          {showLoader && !isLoaded && !hasError && (
            <div className={loaderClassName}>
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
            onLoadedData={handleLoadedData}
            onError={handleError}
            style={{ 
              opacity: isLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out'
            }}
            // ensure autoplay, muted and playsInline are set explicitly
            autoPlay={true}
            muted={true}
            playsInline={true}
            {...props}
          />
        </>
      )}
    </div>
  )
}

export default LazyVideo