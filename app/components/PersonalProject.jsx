'use client'
import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register the plugin
gsap.registerPlugin(ScrollTrigger)

function PersonalProject() {
  const containerRef = useRef(null)
  const firstStripRef = useRef(null)
  const secondStripRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    const firstStrip = firstStripRef.current
    const secondStrip = secondStripRef.current

    if (!container || !firstStrip || !secondStrip) return

    console.log('PersonalProject mounted:', {container, firstStrip, secondStrip})


    // First strip visible at 0%
    gsap.set(firstStrip, { 
      x: '0%',
      force3D: true
    })

    // Second strip: place at right end (its width - viewport width)
    // Wait for layout, then measure and set
    setTimeout(() => {
      const stripWidth = secondStrip.offsetWidth;
      const viewportWidth = container.offsetWidth;
      const offset = stripWidth - viewportWidth;
      gsap.set(secondStrip, {
        x: offset,
        force3D: true
      });
    }, 0);

    console.log('Initial positions set')
    
    const scrollTrigger = ScrollTrigger.create({
      trigger: container,
      start: 'top 10%',
      end: 'bottom 0%',
      scrub: 1,
      invalidateOnRefresh: true,
      markers: true,
      onUpdate: (self) => {
        console.log('PersonalProject scroll progress:', self.progress)
        
        const progress = self.progress
        const scrollRange = 100
        
        const firstStripX = 0 - (progress * scrollRange)
        const secondStripX = 0 + (progress * scrollRange)
        
        gsap.set(firstStrip, {
          x: `${firstStripX}%`,
          force3D: true
        })
        
        gsap.set(secondStrip, {
          x: `${secondStripX}%`,
          force3D: true
        })
      }
    })

    return () => {
      scrollTrigger.kill()
    }
  }, [])

  return (
    <div ref={containerRef} className='relative h-screen bg-gray-900 z-60 overflow-hidden'>
      {/* Section title */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
        <h2 className="text-4xl font-bold text-white text-center">Personal Projects</h2>
      </div>
      
      <div className="flex items-center justify-center flex-col h-full">
        {/* First Strip - Scrolls Left */}
        <div className="relative h-[50%] w-full overflow-hidden border-4 border-red-500">
          <div 
            ref={firstStripRef}
            className="firstStrip absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 flex items-center border-2 border-yellow-400"
            style={{ 
              width: '700%', // Reduced from 400% for better visibility
              willChange: 'transform',
              backfaceVisibility: 'hidden'
            }}
          >
            {/* Sample video/content items - 6 cards with proper spacing */}
            <div className="flex items-center h-full pl-4">
              {[...Array(6)].map((_, i) => (
                <div 
                  key={`first-${i}`}
                  className="flex-shrink-0 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 flex items-center justify-center text-white font-bold text-xl shadow-2xl hover:bg-white/20 transition-all duration-300 cursor-pointer mr-4"
                  style={{ 
                    width: '50vw', // Reduced width for better visibility
                    height: '90%', // Reduced height for better visibility
                    willChange: 'transform' 
                  }}
                >
                  <div className="text-center">
                    <div className="text-sm opacity-75 mb-2">CREATIVE</div>
                    <div>Video {i + 1}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Second Strip - Scrolls Right */}
        <div className="relative h-[50%] w-full overflow-hidden border-4 border-green-500">
          <div 
            ref={secondStripRef}
            className="secondStrip absolute top-0 left-0 h-full bg-gradient-to-r from-pink-600 via-pink-700 to-orange-600 flex items-center border-2 border-yellow-400"
            style={{ 
              width: '700%', // Reduced from 400% for better visibility
              willChange: 'transform',
              backfaceVisibility: 'hidden',
              perspective: '1000px'
            }}
          >
            {/* Sample video/content items - 6 cards with proper spacing */}
            <div className="flex items-center h-full pl-4">
              {[...Array(6)].map((_, i) => (
                <div 
                  key={`second-${i}`}
                  className="flex-shrink-0 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 flex items-center justify-center text-white font-bold text-xl shadow-2xl hover:bg-white/20 transition-all duration-300 cursor-pointer mr-4"
                  style={{ 
                    width: '50vw', // Reduced width for better visibility
                    height: '90%', // Reduced height for better visibility
                    willChange: 'transform' 
                  }}
                >
                  <div className="text-center">
                    <div className="text-sm opacity-75 mb-2">TECHNICAL</div>
                    <div>Project {i + 1}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PersonalProject
