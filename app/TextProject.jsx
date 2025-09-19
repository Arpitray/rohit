"use client";

import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function TextProject() {
  const containerRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pin the TextProject section and animate scale/opacity on scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=150vh', // Pin for longer duration to allow NewProject to fully appear
          pin: true,
          pinSpacing: false, // Prevent extra spacing that causes scroll jumping
          scrub: 1, // Smooth scrubbing animation
          anticipatePin: 1,
          invalidateOnRefresh: true,
          markers: false, // Disable markers
        }
      })

      // Scale down and fade out the content as user scrolls
      tl.to(contentRef.current, {
        scale: 0.8,
        opacity: 0.2,
        y: -100,
        duration: 1,
        ease: 'power2.out'
      })

    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div 
      ref={containerRef} 
      className='min-
      h-screen w-full flex items-center justify-center relative font-["techb"] z-30 bg-[#0b0b0b]'
      style={{
        // Use a neutral dark background color as fallback if image fails
        backgroundColor: 'rgba(10,10,10,1)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: 'none',
        // Add fade-in from top to eliminate border-like appearance
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 100%)'
      }}
      data-section="textproject"
    >
      {/* Background image layer (absolute) - falls back to hidden on error */}
      <img
        src="https://res.cloudinary.com/dsjjdnife/image/upload/v1758026377/selected_failro.jpg"
        alt="Selected projects background"
        className="absolute inset-0 w-full h-full object-cover z-10"
        loading="lazy"
        style={{
          filter: 'blur(4px)',
          transform: 'scale(1.06)'
        }}
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
      />
      {/* Dark translucent overlay to keep text readable */}
      <div className="absolute inset-0 bg-black/40 z-20 pointer-events-none" />

      <div ref={contentRef} className="transform-origin-center font-['clashB'] leading-4 relative z-30 px-4 sm:px-8 py-8 md:py-0"
           style={{
             padding: '1rem',
           }}>
        <h1 className='text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-center text-white' 
            style={{ 
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.5)' 
            }}>
          Selected Projects
        </h1>
        <p className='text-base sm:text-lg md:text-xl lg:text-2xl text-center mt-3 sm:mt-6 text-white opacity-90'
           style={{ 
             textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7), 0 0 10px rgba(0, 0, 0, 0.4)' 
           }}>
          Discover my latest work and creative solutions
        </p>
      </div>
    </div>
  )
}

export default TextProject