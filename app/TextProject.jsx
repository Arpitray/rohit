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
      className='h-screen w-full flex items-center justify-center relative font-["techb"] z-20 textured-black-bg'
      style={{
        background: 'rgba(0, 0, 0, 0.35)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: 'none',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.6)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)',
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)'
      }}
      data-section="textproject"
    >
      <div ref={contentRef} className="transform-origin-center font-['clashB'] leading-4 "
           style={{
             
             padding: '2rem',
             
          
           }}>
        <h1 className='text-8xl font-bold text-center text-white' 
            style={{ 
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.5)' 
            }}>
          Selected Projects
        </h1>
        <p className='text-2xl text-center mt-6 text-white opacity-90'
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