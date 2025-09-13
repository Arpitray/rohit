"use client";

import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LazyVideo from './LazyVideo'

gsap.registerPlugin(ScrollTrigger)

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
        markers: { startColor: "blue", endColor: "blue" },
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
      className='fixed top-0 left-0 w-[600vw] h-[100vh] flex items-center z-50 bg-white'
      style={{ transform: 'translateY(100vh)' }}
      data-section="newproject"
    >
      <div ref={addToRefs} className="project1 w-[100vw] h-full bg-green-300 flex items-center justify-center relative p-8">
        <div className="w-[90%] h-[90%] relative overflow-hidden rounded-lg shadow-lg">
          <LazyVideo 
            className="absolute top-0 left-0 w-full h-full"
            src="https://res.cloudinary.com/dsjjdnife/video/upload/v1757399056/bharudevidhome_eb3vtq"
            autoPlay
            muted
            loop
            playsInline
          />
          <h2 className="text-6xl font-bold text-white z-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">Project 1</h2>
        </div>
      </div>
      <div ref={addToRefs} className="project2 w-[100vw] h-full bg-blue-300 flex items-center justify-center relative p-8">
        <div className="w-[90%] h-[90%] relative overflow-hidden rounded-lg shadow-lg">
          <LazyVideo 
            className="absolute top-0 left-0 w-full h-full"
            src="https://res.cloudinary.com/dsjjdnife/video/upload/v1757399056/bharudevidhome_eb3vtq"
            autoPlay
            muted
            loop
            playsInline
          />
          <h2 className="text-6xl font-bold text-white z-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">Project 2</h2>
        </div>
      </div>
      <div ref={addToRefs} className="project3 w-[100vw] h-full bg-red-300 flex items-center justify-center relative p-8">
        <div className="w-[90%] h-[90%] relative overflow-hidden rounded-lg shadow-lg">
          <LazyVideo 
            className="absolute top-0 left-0 w-full h-full"
            src="https://res.cloudinary.com/dsjjdnife/video/upload/v1757399056/bharudevidhome_eb3vtq"
            autoPlay
            muted
            loop
            playsInline
          />
          <h2 className="text-6xl font-bold text-white z-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">Project 3</h2>
        </div>
      </div>
      <div ref={addToRefs} className="project4 w-[100vw] h-full bg-yellow-300 flex items-center justify-center relative p-8">
        <div className="w-[90%] h-[90%] relative overflow-hidden rounded-lg shadow-lg">
          <LazyVideo 
            className="absolute top-0 left-0 w-full h-full"
            src="https://res.cloudinary.com/dsjjdnife/video/upload/v1757399056/bharudevidhome_eb3vtq"
            autoPlay
            muted
            loop
            playsInline
          />
          <h2 className="text-6xl font-bold text-black z-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">Project 4</h2>
        </div>
      </div>
      <div ref={addToRefs} className="project5 w-[100vw] h-full bg-purple-300 flex items-center justify-center relative p-8">
        <div className="w-[90%] h-[90%] relative overflow-hidden rounded-lg shadow-lg">
          <LazyVideo 
            className="absolute top-0 left-0 w-full h-full"
            src="https://res.cloudinary.com/dsjjdnife/video/upload/v1757399056/bharudevidhome_eb3vtq"
            autoPlay
            muted
            loop
            playsInline
          />
          <h2 className="text-6xl font-bold text-white z-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">Project 5</h2>
        </div>
      </div>
      <div ref={addToRefs} className="project6 w-[100vw] h-full bg-pink-300 flex items-center justify-center relative p-8">
        <div className="w-[90%] h-[90%] relative overflow-hidden rounded-lg shadow-lg">
          <LazyVideo 
            className="absolute top-0 left-0 w-full h-full"
            src="https://res.cloudinary.com/dsjjdnife/video/upload/v1757399056/bharudevidhome_eb3vtq"
            autoPlay
            muted
            loop
            playsInline
          />
          <h2 className="text-6xl font-bold text-white z-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">Project 6</h2>
        </div>
      </div>
    </div>
  )
}

export default NewProject