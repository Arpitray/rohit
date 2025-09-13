"use client";

import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

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
          
          // Show NewProject when we're 30% through the pin
          if (self.progress >= 0.3) {
            const adjustedProgress = (self.progress - 0.3) / 0.7 // Normalize 0.3-1.0 to 0-1
            
            // Move the container into view (keep opacity at 1)
            gsap.to(containerRef.current, {
              y: `${100 - (adjustedProgress * 100)}vh`,
              duration: 0.1,
              overwrite: true
            })

            // Mark as visible when fully appeared
            if (adjustedProgress >= 1 && !isNewProjectVisible) {
              isNewProjectVisible = true
              console.log('NewProject is now fully visible')
            }

            // Animate project cards
            if (projectsRef.current.length > 0) {
              projectsRef.current.forEach((project, index) => {
                const delay = index * 0.1
                const cardProgress = Math.max(0, adjustedProgress - delay)
                
                // Ensure cards remain vertically aligned and fully opaque
                gsap.to(project, {
                  y: 0,
                  opacity: 1,
                  duration: 0.1,
                  overwrite: true
                })
              })
            }
          } else {
            // Hide NewProject when below 30%
            isNewProjectVisible = false
            // Move container back below viewport (keep opacity at 1)
            gsap.to(containerRef.current, {
              y: '100vh',
              duration: 0.1,
              overwrite: true
            })
          }
        }
      })

      // Create horizontal scrolling effect using the spacer div as trigger
      ScrollTrigger.create({
        trigger: horizontalTrigger,
        start: 'top bottom',
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
            const maxTranslateX = -680 // -600vw to show all 6 projects (120vw each)
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
      className='fixed top-0 left-0 w-[720vw] h-[100vh] flex items-center z-50 bg-white'
      data-section="newproject"
    >
      <div ref={addToRefs} className="project1 w-[120vw] h-full bg-green-300 flex items-center justify-center">
        <h2 className="text-6xl font-bold text-white">Project 1</h2>
      </div>
      <div ref={addToRefs} className="project2 w-[120vw] h-full bg-blue-300 flex items-center justify-center">
        <h2 className="text-6xl font-bold text-white">Project 2</h2>
      </div>
      <div ref={addToRefs} className="project3 w-[120vw] h-full bg-red-300 flex items-center justify-center">
        <h2 className="text-6xl font-bold text-white">Project 3</h2>
      </div>
      <div ref={addToRefs} className="project4 w-[120vw] h-full bg-yellow-300 flex items-center justify-center">
        <h2 className="text-6xl font-bold text-black">Project 4</h2>
      </div>
      <div ref={addToRefs} className="project5 w-[120vw] h-full bg-purple-300 flex items-center justify-center">
        <h2 className="text-6xl font-bold text-white">Project 5</h2>
      </div>
      <div ref={addToRefs} className="project6 w-[120vw] h-full bg-pink-300 flex items-center justify-center">
        <h2 className="text-6xl font-bold text-white">Project 6</h2>
      </div>
    </div>
  )
}

export default NewProject