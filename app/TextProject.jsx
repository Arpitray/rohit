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
      className='h-screen w-full bg-gray-400 flex items-center justify-center relative z-30'
      data-section="textproject"
    >
      <div ref={contentRef} className="transform-origin-center">
        <h1 className='text-8xl font-bold text-center'>Selected Projects</h1>
        <p className='text-2xl text-center mt-6 opacity-80'>
          Discover my latest work and creative solutions
        </p>
      </div>
    </div>
  )
}

export default TextProject