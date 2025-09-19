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

  useEffect(() => {
    const container = containerRef.current
    const titleElement = titleRef.current
    const subtitleElement = subtitleRef.current
    const overlay = overlayRef.current
    
    if (!container || !titleElement || !overlay) return

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
      const moveX = normalizedX * 80 // Increased from 20px to 80px max movement
      const moveY = normalizedY * 60 // Increased from 15px to 60px max movement
      
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
  }, [])

  return (
    <div 
      ref={containerRef}
      className="w-[90%] sm:w-[85%] md:w-[90%] h-[60%] sm:h-[70%] md:h-[90%] relative overflow-hidden rounded-lg shadow-lg cursor-pointer"
      data-interactive-video="true"
    >
      <div
        ref={videoRef}
        style={{
          transform: `translate(${mousePos.x}px, ${mousePos.y}px) scale(${isZoomed ? zoomScale : 1.3})`,
          transition: 'transform 0.2s ease-out'
        }}
        className="w-full h-full"
      >
        <LazyVideo 
          className="absolute top-0 left-0 w-full h-full object-cover"
          src={src}
          autoPlay
          muted
          loop
          playsInline
        />
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
        console.log('Required sections not found')
        return
      }

      // keep visibility flag available for both mobile and desktop
      let isNewProjectVisible = false

      if (isMobile) {
        // Mobile/Tablet: set up appearance animation but DO NOT skip horizontal setup
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

              // mark visible when fully appeared on mobile as well
              if (adjustedProgress >= 1 && !isNewProjectVisible) {
                isNewProjectVisible = true
              }
            } else {
              gsap.to(containerRef.current, {
                y: '100vh',
                duration: 0.4,
                overwrite: true
              })
              isNewProjectVisible = false
            }
          }
        })
        // continue to set up horizontal scroll below (no early return)
      }

      // Desktop: original behavior (appearance)
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
          console.log('NewProject appearance progress:', self.progress)
          
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
              console.log('NewProject is now fully visible')
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

    }, containerRef)

    return () => ctx.revert()
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
      className={`fixed top-0 left-0 flex items-center z-50 textured-black-bg`}
      style={{ transform: 'translateY(100vh)', width: `${TOTAL_PROJECTS * 100}vw`, height: '100vh' }}
      data-section="newproject"
    >
  <div ref={addToRefs} className={`project1 w-[100vw] ${isMobile ? 'h-screen' : 'h-full'} textured-black-bg flex items-center justify-center relative ${isMobile ? 'p-4' : 'p-8'}`}
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
  <div ref={addToRefs} className={`project2 w-[100vw] ${isMobile ? 'h-screen' : 'h-full'} textured-black-bg flex items-center justify-center relative ${isMobile ? 'p-4' : 'p-8'}`}
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
        <InteractiveVideo 
        
          src="https://res.cloudinary.com/dsjjdnife/video/upload/v1753776820/vid11_m3t9ob.mp4"
          title="Project 2"
          subtitle="Mobile App"
          titleColor="text-white"
        />
      </div>
  <div ref={addToRefs} className={`project3 w-[100vw] ${isMobile ? 'h-screen' : 'h-full'} textured-black-bg flex items-center justify-center relative ${isMobile ? 'p-4' : 'p-8'}`}
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
        <InteractiveVideo 
          src="https://res.cloudinary.com/dsjjdnife/video/upload/v1757399056/bharudevidhome_eb3vtq"
          title="Project 3"
          subtitle="E-commerce"
          titleColor="text-white"
        />
        
      </div>
  <div ref={addToRefs} className={`project4 w-[100vw] ${isMobile ? 'h-screen' : 'h-full'} textured-black-bg flex items-center justify-center relative ${isMobile ? 'p-4' : 'p-8'}`}
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
        <InteractiveVideo 
          src="https://res.cloudinary.com/dsjjdnife/video/upload/v1753776816/vid14_rvtcvi.mp4"
          title="Project 4"
          subtitle="UI/UX Design"
          titleColor="text-white"
        />
      </div>
  <div ref={addToRefs} className={`project5 w-[100vw] ${isMobile ? 'h-screen' : 'h-full'} textured-black-bg flex items-center justify-center relative ${isMobile ? 'p-4' : 'p-8'}`}
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
        <InteractiveVideo 
          src="https://res.cloudinary.com/dsjjdnife/video/upload/v1753776816/vid10_zpxivm.mp4"
          title="Project 5"
          subtitle="Brand Identity"
          titleColor="text-white"
        />
      </div>
  <div ref={addToRefs} className={`project6 w-[100vw] ${isMobile ? 'h-screen' : 'h-full'} textured-black-bg flex items-center justify-center relative ${isMobile ? 'p-4' : 'p-8'}`}
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
        <InteractiveVideo 
          src="https://res.cloudinary.com/dsjjdnife/video/upload/v1753776810/vid8_anmfk0.mp4"
          title="Project 6"
          subtitle="Digital Marketing"
          titleColor="text-white"
        />
      </div>
    </div>
  )
}

export default NewProject