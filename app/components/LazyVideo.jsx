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
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [hasError, setHasError] = useState(false)
  const videoRef = useRef(null)

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

  const handleLoadedData = () => {
    setIsLoaded(true)
    setHasError(false)
  }

  const handleError = () => {
    setHasError(true)
    setIsLoaded(false)
  }

  return (
    <div ref={videoRef} className={className}>
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
            className="absolute top-0 left-0 w-full h-full object-cover"
            src={src}
            onLoadedData={handleLoadedData}
            onError={handleError}
            style={{ 
              opacity: isLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out'
            }}
            {...props}
          />
        </>
      )}
    </div>
  )
}

export default LazyVideo