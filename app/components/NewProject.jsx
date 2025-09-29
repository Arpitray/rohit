"use client";

import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LazyVideo from './LazyVideo'

gsap.registerPlugin(ScrollTrigger)

// Interactive Video Component with mouse movement effect
function InteractiveVideo({ src, title, subtitle = "", titleColor = "text-white", defaultZoom = false, zoomScale = 1.8, showZoomButton = false }) {
  const containerRef = useRef(null)
  const videoRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const overlayRef = useRef(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [isZoomed, setIsZoomed] = useState(!!defaultZoom)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [showVideoCover, setShowVideoCover] = useState(true)
  const [videoPlaying, setVideoPlaying] = useState(false)

  useEffect(() => {
    // Detect touch device - check multiple indicators
    const touchDetected = typeof window !== 'undefined' && (
      'ontouchstart' in window || 
      navigator.maxTouchPoints > 0 || 
      window.innerWidth < 1024
    );
    setIsTouchDevice(touchDetected);
  }, [])

  // Handle play button click
  const handlePlayClick = () => {
    setShowVideoCover(false)
    setVideoPlaying(true)
  }

  useEffect(() => {
    const container = containerRef.current
    const titleElement = titleRef.current
    const subtitleElement = subtitleRef.current
    const overlay = overlayRef.current
    
    if (!container || !titleElement || !overlay || isTouchDevice) return

    // Split title into words for word-level animation (whole word appears at once)
    const titleWords = titleElement.textContent.split(' ').map((word, index, arr) => {
      const span = document.createElement('span')
      // keep words as a unit; append a trailing space for separation except last
      span.textContent = word + (index < arr.length - 1 ? '\u00A0' : '')
      span.style.display = 'inline-block'
      span.style.transform = 'translateY(100%)'
      span.style.opacity = '0'
      return span
    })

    titleElement.innerHTML = ''
    titleWords.forEach(w => titleElement.appendChild(w))

    // Split subtitle into words for animation (if subtitle exists)
    let subtitleWords = []
    if (subtitleElement && subtitle) {
      subtitleWords = subtitleElement.textContent.split(' ').map((word, index, arr) => {
        const span = document.createElement('span')
        span.textContent = word + (index < arr.length - 1 ? '\u00A0' : '')
        span.style.display = 'inline-block'
        span.style.transform = 'translateY(100%)'
        span.style.opacity = '0'
        return span
      })

      subtitleElement.innerHTML = ''
      subtitleWords.forEach(w => subtitleElement.appendChild(w))
    }

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      // Normalize mouse position to -1 to 1 range
      const normalizedX = (x / rect.width) * 2 - 1
      const normalizedY = (y / rect.height) * 2 - 1
      
      // Scale the movement (adjust these values to control sensitivity)
      const moveX = normalizedX * 20 // Reduced from 80px to 20px for performance
      const moveY = normalizedY * 15 // Reduced from 60px to 15px for performance
      
      setMousePos({ x: moveX, y: moveY })
    }

    const handleMouseEnter = () => {
      setIsHovered(true)
      
      // Animate overlay in
      gsap.to(overlay, {
        opacity: 0.7,
        duration: 0.3,
        ease: "power2.out"
      })
      
      // Animate title words from bottom to top (words appear as whole units)
      gsap.to(titleWords, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.06,
        ease: "power3.out"
      })

      // Animate subtitle words with 0.4s delay
      if (subtitleWords.length > 0) {
        gsap.to(subtitleWords, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.06,
          ease: "power3.out",
          delay: 0.4
        })
      }
    }

    const handleMouseLeave = () => {
      setIsHovered(false)
      setMousePos({ x: 0, y: 0 })
      
      // Animate overlay out
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out"
      })
      
      // Animate title words back down
      gsap.to(titleWords, {
        y: '100%',
        opacity: 0,
        duration: 0.4,
        stagger: 0.03,
        ease: "power2.in"
      })

      // Animate subtitle words back down
      if (subtitleWords.length > 0) {
        gsap.to(subtitleWords, {
          y: '100%',
          opacity: 0,
          duration: 0.4,
          stagger: 0.03,
          ease: "power2.in"
        })
      }
    }

    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseenter', handleMouseEnter)
    container.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseenter', handleMouseEnter)
      container.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [isTouchDevice])

  return (
    <div 
      ref={containerRef}
      className="w-[90%] sm:w-[85%] md:w-[90%] h-[60%] sm:h-[70%] md:h-[90%] relative overflow-hidden rounded-lg shadow-lg cursor-pointer"
      data-interactive-video="true"
      style={{ minHeight: '300px' }}
    >
      <div
        ref={videoRef}
        style={{
          transform: isTouchDevice 
            ? 'scale(1.0)' 
            : `translate(${mousePos.x}px, ${mousePos.y}px) scale(1.05)`,
          transition: isTouchDevice ? 'none' : 'transform 0.1s ease-out',
          minHeight: '300px'
        }}
        className="w-full h-full"
      >
        <LazyVideo 
          className="absolute inset-0 w-full h-full"
          fit="cover"
          src={src}
          autoPlay={videoPlaying}
          muted
          loop
          playsInline
          preload={showVideoCover ? 'none' : 'metadata'}
          // Disable autoplay when cover is shown
          shouldAutoplay={!showVideoCover && videoPlaying}
          forceLoad={false}
        />

        {/* Video Cover Overlay with Play Button */}
        {showVideoCover && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-black/60 to-gray-800/80 flex items-center justify-center z-50 cursor-pointer backdrop-blur-sm"
               onClick={handlePlayClick}>
            
            {/* Central Play Button */}
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 sm:p-6 md:p-8 hover:bg-white/30 transition-all duration-300 transform hover:scale-110 shadow-2xl">
              <div className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 relative">
                {/* Play Triangle */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-0 h-0 border-l-[12px] sm:border-l-[18px] md:border-l-[24px] border-r-0 border-t-[6px] sm:border-t-[9px] md:border-t-[12px] border-b-[6px] sm:border-b-[9px] md:border-b-[12px] border-l-white border-t-transparent border-b-transparent ml-1 sm:ml-2"></div>
                </div>
              </div>
            </div>
            
            {/* Video title overlay on cover */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1" 
                  style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)' }}>
                {title}
              </h3>
              {subtitle && (
                <p className="text-sm sm:text-base opacity-90" 
                   style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}>
                  {subtitle}
                </p>
              )}
            </div>

          
          </div>
        )}
      </div>
      
      {/* Dark overlay that appears on hover */}
      <div 
        ref={overlayRef}
        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 pointer-events-none z-10"
      />

      {/* Optional zoom toggle button (top-right) - only shown when showZoomButton is true */}
      {showZoomButton && (
        <button
          onClick={() => setIsZoomed((s) => !s)}
          className={`absolute top-4 right-4 z-30 bg-black/40 text-white px-3 py-1 rounded backdrop-blur-sm hover:bg-black/60`}
          aria-pressed={isZoomed}
          title={isZoomed ? 'Reset zoom' : 'Zoom in'}
          style={{ pointerEvents: 'auto' }}
        >
          {isZoomed ? 'Reset' : 'Zoom'}
        </button>
      )}
      
      {/* Title and subtitle positioned at bottom-left */}
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-8 z-20 pointer-events-none overflow-hidden">
        {isTouchDevice ? (
          // Simple static titles for mobile
          <>
            <h2 
              ref={titleRef}
              className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold ${titleColor} leading-none mb-1 sm:mb-2`}
              style={{ fontFamily: '"clashB", system-ui, sans-serif' }}
            >
              {title}
            </h2>
            {subtitle && (
              <h3 
                ref={subtitleRef}
                className={`text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-medium ${titleColor} leading-tight opacity-80`}
                style={{ fontFamily: '"clashS", system-ui, sans-serif' }}
              >
                {subtitle}
              </h3>
            )}
          </>
        ) : (
          // Animated titles for desktop
          <>
            <h2 
              ref={titleRef}
              className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold ${titleColor} leading-none mb-1 sm:mb-2`}
              style={{ fontFamily: '"clashB", system-ui, sans-serif' }}
            >
              {title}
            </h2>
            {subtitle && (
              <h3 
                ref={subtitleRef}
                className={`text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-medium ${titleColor} leading-tight opacity-80`}
                style={{ fontFamily: '"clashS", system-ui, sans-serif' }}
              >
                {subtitle}
              </h3>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function NewProject() {
  const containerRef = useRef(null)
  const projectsRef = useRef([])
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024) // Tablet and mobile
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const textProjectSection = document.querySelector('[data-section="textproject"]')
      const horizontalTrigger = document.querySelector('#horizontal-scroll-trigger')
      
      if (!textProjectSection || !horizontalTrigger) {
        return
      }

      // keep visibility flag available for both mobile and desktop
      let isNewProjectVisible = false

      if (isMobile) {
        // Mobile/Tablet: Simple static positioning - no complex animations
        gsap.set(containerRef.current, { 
          y: 0,
          opacity: 1,
          x: 0,
          position: 'relative'
        })

        // Simple trigger to show content after text project
        ScrollTrigger.create({
          trigger: textProjectSection,
          start: 'bottom top',
          end: 'bottom top',
          onEnter: () => {
            if (containerRef.current) {
              gsap.set(containerRef.current, {
                y: 0,
                opacity: 1,
                x: 0
              })
              isNewProjectVisible = true
            }
          }
        })
      } else {
        // Desktop: original behavior (appearance animation)
        gsap.set(containerRef.current, { 
          y: '100vh',
          opacity: 1,
          x: 0
        })
        
        ScrollTrigger.create({
          trigger: textProjectSection,
          start: 'top top',
          end: '+=150vh',
          scrub: 1,
          invalidateOnRefresh: true,
          markers: false,
          onUpdate: (self) => {
            if (self.progress >= 0.3) {
              const adjustedProgress = (self.progress - 0.3) / 0.7
              const easedProgress = gsap.parseEase("power2.out")(adjustedProgress)
              
              gsap.to(containerRef.current, {
                y: `${100 - (easedProgress * 100)}vh`,
                duration: 1,
                overwrite: true
              })

              if (adjustedProgress >= 1 && !isNewProjectVisible) {
                isNewProjectVisible = true
              }

              if (projectsRef.current.length > 0) {
                projectsRef.current.forEach((project, index) => {
                  const delay = index * 0.15
                  const cardProgress = Math.max(0, adjustedProgress - delay)
                  const easedCardProgress = gsap.parseEase("power2.out")(cardProgress)
                  
                  gsap.to(project, {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    overwrite: true
                  })
                })
              }
            } else {
              isNewProjectVisible = false
              gsap.to(containerRef.current, {
                y: '100vh',
                duration: 0.4,
                overwrite: true
              })
            }
          }
        })

        // Create horizontal scrolling effect using the spacer div as trigger
        // ONLY on desktop - disable on mobile to prevent glitches and improve performance
        ScrollTrigger.create({
          trigger: horizontalTrigger,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
          invalidateOnRefresh: true,
          markers: false,
          onUpdate: (self) => {
            // Only do horizontal scrolling if NewProject is visible
            if (isNewProjectVisible && containerRef.current) {
              // Determine number of projects and translate accordingly
              const numProjects = projectsRef.current.length || 6
              const maxTranslateX = -100 * (numProjects - 1) // -100vw per shift
              const translateX = self.progress * maxTranslateX

              gsap.to(containerRef.current, {
                x: `${translateX}vw`,
                duration: 0.1,
                overwrite: "auto"
              })
            }
          }
        })
      }

    }, containerRef)

    return () => {
      try { ctx.revert() } catch (e) { /* ignore if ctx wasn't created */ }
    }
  }, [isMobile])

  const addToRefs = (el) => {
    if (el && !projectsRef.current.includes(el)) {
      projectsRef.current.push(el)
    }
  }

  // Total number of projects (used to calculate container width for horizontal scroll)
  const TOTAL_PROJECTS = 6

  return (
    <div 
      ref={containerRef}
      className={`${isMobile ? 'relative flex flex-col overflow-y-auto' : 'fixed top-0 left-0 flex'} items-center z-50 textured-black-bg`}
      style={{ 
        transform: isMobile ? 'none' : 'translateY(100vh)', 
        width: isMobile ? '100vw' : `${TOTAL_PROJECTS * 100}vw`, 
        height: isMobile ? 'auto' : '100vh' 
      }}
      data-section="newproject"
    >
  <div ref={addToRefs} className={`project1 ${isMobile ? 'w-full min-h-[50vh]' : 'w-[100vw] h-full'} textured-black-bg flex items-center justify-center relative ${isMobile ? 'p-2' : 'p-8'}`}
           data-project-link="https://github.com/project1"
           style={{
             background: 'rgba(0, 0, 0, 0.35)',
             backdropFilter: 'blur(20px)',
             WebkitBackdropFilter: 'blur(20px)',
             border: 'none',
             boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.6)',
             WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)',
             maskImage: 'linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)'
           }}>
        {/* Background image behind project 1 (blurred, non-interactive) */}
        <img
          src="https://res.cloudinary.com/dsjjdnife/image/upload/v1758210854/unnamed_rkr7do.png"
          alt="project-bg"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            filter: 'blur(6px) brightness(0.9)',
            opacity: 0.95,
            pointerEvents: 'none',
            zIndex: 0
          }}
        />

        <div className="relative z-20 w-full h-full flex items-center justify-center">
          <InteractiveVideo 
            src="https://res.cloudinary.com/dsjjdnife/video/upload/v1758047615/Legacy_lngu1r.mp4"
            title="Legacy"
            subtitle="Raftar and kashmr"
            titleColor="text-white"
            defaultZoom={true}
            zoomScale={1.7}
            showZoomButton={false}
          />
        </div>
      </div>
  <div ref={addToRefs} className={`project2 ${isMobile ? 'w-full min-h-[50vh]' : 'w-[100vw] h-full'} textured-black-bg flex items-center justify-center relative ${isMobile ? 'p-2' : 'p-8'}`}
           data-project-link="https://github.com/project2"
           style={{
             background: 'rgba(0, 0, 0, 0.35)',
             backdropFilter: 'blur(20px)',
             WebkitBackdropFilter: 'blur(20px)',
             border: 'none',
             boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.6)',
             WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)',
             maskImage: 'linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)'
           }}>
               <img
          src="https://res.cloudinary.com/dsjjdnife/image/upload/v1758212073/1e993446-0780-4f01-91e5-bc8eaf966e95_fzsnbs.png"
          alt="project-bg"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            filter: 'blur(6px) brightness(0.9)',
            opacity: 0.95,
            pointerEvents: 'none',
            zIndex: 0
          }}
        />
        <div className="relative z-20 w-full h-full flex items-center justify-center">
          <InteractiveVideo 
            src="https://res.cloudinary.com/dsjjdnife/video/upload/v1753776820/vid11_m3t9ob.mp4"
            title="Project 2"
            subtitle="Mobile App"
            titleColor="text-white"
          />
        </div>
      </div>
  <div ref={addToRefs} className={`project3 ${isMobile ? 'w-full min-h-[50vh]' : 'w-[100vw] h-full'} textured-black-bg flex items-center justify-center relative ${isMobile ? 'p-2' : 'p-8'}`}
           data-project-link="https://example.com/project3"
           style={{
             background: 'rgba(0, 0, 0, 0.35)',
             backdropFilter: 'blur(20px)',
             WebkitBackdropFilter: 'blur(20px)',
             border: 'none',
             boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.6)',
             WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)',
             maskImage: 'linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)'
           }}>
                   <img
          src="https://res.cloudinary.com/dsjjdnife/image/upload/v1758212388/f281833f-81dc-4dec-971e-4f8ec8368a4e_kvyfgf.png"
          alt="project-bg"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            filter: 'blur(6px) brightness(0.9)',
            opacity: 0.95,
            pointerEvents: 'none',
            zIndex: 0
          }}
        />
        <div className="relative z-20 w-full h-full flex items-center justify-center">
          <InteractiveVideo 
            src="https://res.cloudinary.com/dsjjdnife/video/upload/v1757399056/bharudevidhome_eb3vtq.mp4"
            title="Project 3"
            subtitle="E-commerce"
            titleColor="text-white"
          />
        </div>
        
      </div>
  <div ref={addToRefs} className={`project4 ${isMobile ? 'w-full min-h-[50vh]' : 'w-[100vw] h-full'} textured-black-bg flex items-center justify-center relative ${isMobile ? 'p-2' : 'p-8'}`}
           data-project-link="https://example.com/project4"
           style={{
             background: 'rgba(0, 0, 0, 0.35)',
             backdropFilter: 'blur(20px)',
             WebkitBackdropFilter: 'blur(20px)',
             border: 'none',
             boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.6)',
             WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)',
             maskImage: 'linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)'
           }}>
             <img
          src="https://res.cloudinary.com/dsjjdnife/image/upload/v1758223790/unnamed_soecjn.png"
          alt="project-bg"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            filter: 'blur(6px) brightness(0.9)',
            opacity: 0.95,
            pointerEvents: 'none',
            zIndex: 0
          }}
        />
        <div className="relative z-20 w-full h-full flex items-center justify-center">
          <InteractiveVideo 
            src="https://res.cloudinary.com/dsjjdnife/video/upload/v1753776816/vid14_rvtcvi.mp4"
            title="Project 4"
            subtitle="UI/UX Design"
            titleColor="text-white"
          />
        </div>
      </div>
  <div ref={addToRefs} className={`project5 ${isMobile ? 'w-full min-h-[50vh]' : 'w-[100vw] h-full'} textured-black-bg flex items-center justify-center relative ${isMobile ? 'p-2' : 'p-8'}`}
           data-project-link="https://example.com/project5"
           style={{
             background: 'rgba(0, 0, 0, 0.35)',
             backdropFilter: 'blur(20px)',
             WebkitBackdropFilter: 'blur(20px)',
             border: 'none',
             boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.6)',
             WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)',
             maskImage: 'linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)'
           }}>
             <img
          src="https://res.cloudinary.com/dsjjdnife/image/upload/v1758224112/unnamed_b9ncst.png"
          alt="project-bg"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            filter: 'blur(6px) brightness(0.9)',
            opacity: 0.95,
            pointerEvents: 'none',
            zIndex: 0
          }}
        />
        <div className="relative z-20 w-full h-full flex items-center justify-center">
          <InteractiveVideo 
            src="https://res.cloudinary.com/dsjjdnife/video/upload/v1753776816/vid10_zpxivm.mp4"
            title="Project 5"
            subtitle="Brand Identity"
            titleColor="text-white"
          />
        </div>
      </div>
  <div ref={addToRefs} className={`project6 ${isMobile ? 'w-full min-h-[50vh]' : 'w-[100vw] h-full'} textured-black-bg flex items-center justify-center relative ${isMobile ? 'p-2' : 'p-8'}`}
           data-project-link="https://example.com/project6"
           style={{
             background: 'rgba(0, 0, 0, 0.35)',
             backdropFilter: 'blur(20px)',
             WebkitBackdropFilter: 'blur(20px)',
             border: 'none',
             boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.6)',
             WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)',
             maskImage: 'linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)'
           }}>
             <img
          src="https://res.cloudinary.com/dsjjdnife/image/upload/v1758224183/unnamed_x8jeay.png"
          alt="project-bg"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            filter: 'blur(6px) brightness(0.9)',
            opacity: 0.95,
            pointerEvents: 'none',
            zIndex: 0
          }}
        />
        <div className="relative z-20 w-full h-full flex items-center justify-center">
          <InteractiveVideo 
            src="https://res.cloudinary.com/dsjjdnife/video/upload/v1753776810/vid8_anmfk0.mp4"
            title="Project 6"
            subtitle="Digital Marketing"
            titleColor="text-white"
          />
        </div>
      </div>
    </div>
  )
}

export default NewProject