"use client";

import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LazyVideo from './LazyVideo'

gsap.registerPlugin(ScrollTrigger)

// Interactive Video Component with mouse movement effect
function InteractiveVideo({ src, title, subtitle = "", titleColor = "text-white" }) {
  const containerRef = useRef(null)
  const videoRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const overlayRef = useRef(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

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
      className="w-[90%] h-[90%] relative overflow-hidden rounded-lg shadow-lg cursor-pointer"
    >
      <div
        ref={videoRef}
        style={{
          transform: `translate(${mousePos.x}px, ${mousePos.y}px) scale(1.3)`,
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
      
      {/* Title and subtitle positioned at bottom-left */}
      <div className="absolute bottom-8 left-8 z-20 pointer-events-none overflow-hidden">
        <h2 
          ref={titleRef}
          className={`text-4xl md:text-5xl lg:text-6xl font-bold ${titleColor} leading-none mb-2`}
          style={{ fontFamily: '"clashB", system-ui, sans-serif' }}
        >
          {title}
        </h2>
        {subtitle && (
          <h3 
            ref={subtitleRef}
            className={`text-lg md:text-xl lg:text-2xl font-medium ${titleColor} leading-tight opacity-80`}
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

  useEffect(() => {
    const ctx = gsap.context(() => {
      const textProjectSection = document.querySelector('[data-section="textproject"]')
      const horizontalTrigger = document.querySelector('#horizontal-scroll-trigger')
      
      if (!textProjectSection || !horizontalTrigger) {
        console.log('Required sections not found')
        return
      }

      // Set initial state - positioned below but fully opaque
      gsap.set(containerRef.current, { 
        y: '100vh',
        opacity: 1,
        x: 0 // Start at x position 0
      })

      let isNewProjectVisible = false

      // Create ScrollTrigger that activates during TextProject pin
      ScrollTrigger.create({
        trigger: textProjectSection,
        start: 'top top',
        end: '+=150vh',
        scrub: 1,
        invalidateOnRefresh: true,
        markers: false,
        onUpdate: (self) => {
          console.log('NewProject appearance progress:', self.progress)
          
          // Show NewProject when we're 30% through the pin with slower animation
          if (self.progress >= 0.3) {
            const adjustedProgress = (self.progress - 0.3) / 0.7 // Normalize 0.3-1.0 to 0-1
            
            // Apply easing for slower, smoother appearance
            const easedProgress = gsap.parseEase("power2.out")(adjustedProgress)
            
            // Move the container into view with slower, smoother animation
            gsap.to(containerRef.current, {
              y: `${100 - (easedProgress * 100)}vh`,
              duration: 1, // Increased from 0.1 for slower animation
              
              overwrite: true
            })

            // Mark as visible when fully appeared
            if (adjustedProgress >= 1 && !isNewProjectVisible) {
              isNewProjectVisible = true
              console.log('NewProject is now fully visible')
            }

            // Animate project cards with slower stagger
            if (projectsRef.current.length > 0) {
              projectsRef.current.forEach((project, index) => {
                const delay = index * 0.15 // Increased delay between cards
                const cardProgress = Math.max(0, adjustedProgress - delay)
                const easedCardProgress = gsap.parseEase("power2.out")(cardProgress)
                
                // Ensure cards remain vertically aligned and fully opaque with slower animation
                gsap.to(project, {
                  y: 0,
                  opacity: 1,
                  duration: 1, // Increased from 0.1 for slower card animation
                  
                  overwrite: true
                })
              })
            }
          } else {
            // Hide NewProject when below 30% with slower animation
            isNewProjectVisible = false
            // Move container back below viewport with slower animation
            gsap.to(containerRef.current, {
              y: '100vh',
              duration: 0.4, // Increased from 0.1 for slower hide animation
            
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
          console.log('Horizontal scroll progress:', self.progress)
          
          // Only do horizontal scrolling if NewProject is visible
          if (isNewProjectVisible && containerRef.current) {
            // Calculate horizontal movement
            // Move from 0vw to -600vw (showing all 6 projects at 120vw each)
            const maxTranslateX = -572 // -600vw to show all 6 projects (120vw each)
            const translateX = self.progress * maxTranslateX
            
            gsap.to(containerRef.current, {
              x: `${translateX}vw`,
              duration: 0.1,
              overwrite: "auto"
            })
            
            console.log('Applying translateX:', translateX)
          }
        }
      })

    }, containerRef)

    return () => ctx.revert()
  }, [])

  const addToRefs = (el) => {
    if (el && !projectsRef.current.includes(el)) {
      projectsRef.current.push(el)
    }
  }

  return (
    <div 
      ref={containerRef}
      className='fixed top-0 left-0 w-[600vw] h-[100vh] flex items-center z-50 textured-black-bg'
      style={{ transform: 'translateY(100vh)' }}
      data-section="newproject"
    >
      <div ref={addToRefs} className="project1 w-[100vw] h-full textured-black-bg flex items-center justify-center relative p-8"
           style={{
             background: 'rgba(0, 0, 0, 0.35)',
             backdropFilter: 'blur(20px)',
             WebkitBackdropFilter: 'blur(20px)',
             border: 'none',
             boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.6)',
             WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)',
             maskImage: 'linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)'
           }}>
        <InteractiveVideo 
          src="https://res.cloudinary.com/dsjjdnife/video/upload/v1757399056/bharudevidhome_eb3vtq"
          title="Project 1"
          subtitle="Web Development"
          titleColor="text-white"
        />
      </div>
      <div ref={addToRefs} className="project2 w-[100vw] h-full textured-black-bg flex items-center justify-center relative p-8"
           style={{
             background: 'rgba(0, 0, 0, 0.35)',
             backdropFilter: 'blur(20px)',
             WebkitBackdropFilter: 'blur(20px)',
             border: 'none',
             boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.6)',
             WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)',
             maskImage: 'linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)'
           }}>
        <InteractiveVideo 
          src="https://res.cloudinary.com/dsjjdnife/video/upload/v1757399056/bharudevidhome_eb3vtq"
          title="Project 2"
          subtitle="Mobile App"
          titleColor="text-white"
        />
      </div>
      <div ref={addToRefs} className="project3 w-[100vw] h-full textured-black-bg flex items-center justify-center relative p-8"
           style={{
             background: 'rgba(0, 0, 0, 0.35)',
             backdropFilter: 'blur(20px)',
             WebkitBackdropFilter: 'blur(20px)',
             border: 'none',
             boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.6)',
             WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)',
             maskImage: 'linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)'
           }}>
        <InteractiveVideo 
          src="https://res.cloudinary.com/dsjjdnife/video/upload/v1757399056/bharudevidhome_eb3vtq"
          title="Project 3"
          subtitle="E-commerce"
          titleColor="text-white"
        />
      </div>
      <div ref={addToRefs} className="project4 w-[100vw] h-full textured-black-bg flex items-center justify-center relative p-8"
           style={{
             background: 'rgba(0, 0, 0, 0.35)',
             backdropFilter: 'blur(20px)',
             WebkitBackdropFilter: 'blur(20px)',
             border: 'none',
             boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.6)',
             WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)',
             maskImage: 'linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)'
           }}>
        <InteractiveVideo 
          src="https://res.cloudinary.com/dsjjdnife/video/upload/v1757399056/bharudevidhome_eb3vtq"
          title="Project 4"
          subtitle="UI/UX Design"
          titleColor="text-white"
        />
      </div>
      <div ref={addToRefs} className="project5 w-[100vw] h-full textured-black-bg flex items-center justify-center relative p-8"
           style={{
             background: 'rgba(0, 0, 0, 0.35)',
             backdropFilter: 'blur(20px)',
             WebkitBackdropFilter: 'blur(20px)',
             border: 'none',
             boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.6)',
             WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)',
             maskImage: 'linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)'
           }}>
        <InteractiveVideo 
          src="https://res.cloudinary.com/dsjjdnife/video/upload/v1757399056/bharudevidhome_eb3vtq"
          title="Project 5"
          subtitle="Brand Identity"
          titleColor="text-white"
        />
      </div>
      <div ref={addToRefs} className="project6 w-[100vw] h-full textured-black-bg flex items-center justify-center relative p-8"
           style={{
             background: 'rgba(0, 0, 0, 0.35)',
             backdropFilter: 'blur(20px)',
             WebkitBackdropFilter: 'blur(20px)',
             border: 'none',
             boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.6)',
             WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)',
             maskImage: 'linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)'
           }}>
        <InteractiveVideo 
          src="https://res.cloudinary.com/dsjjdnife/video/upload/v1757399056/bharudevidhome_eb3vtq"
          title="Project 6"
          subtitle="Digital Marketing"
          titleColor="text-white"
        />
      </div>
    </div>
  )
}

export default NewProject