"use client";

import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ProfileCard from './components/ProfileCard'

gsap.registerPlugin(ScrollTrigger)

function About() {
  const rootRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    // Skip GSAP ScrollTrigger initialization on touch devices (mobile) to avoid mobile triggers
    let ctx;
    try {
      const isTouch = typeof window !== 'undefined' && 'ontouchstart' in window;
      if (!isTouch) {
        ctx = gsap.context(() => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: rootRef.current,
              start: 'top 80%',
              end: 'bottom 60%',
              scrub: true,
              // markers: true,
            }
          })

          // move content up and scale as the user scrolls into the section
          tl.fromTo(
            contentRef.current,
            { y: 20, scale: 0.92, autoAlpha: 0.95 },
            { y: 0, scale: 1, autoAlpha: 1, duration: 0.6, ease: 'power3.out' }
          );

          // ProfileCard slides in from left; scrub will control when it is fully visible
          tl.from(
            contentRef.current.querySelectorAll('.profile-card-container'),
            { x: -100, autoAlpha: 0, duration: 0.5, ease: 'power3.out' },
            '<0.1'
          );

          // Text children animate with a gentle stagger as scroll progresses
          tl.from(
            contentRef.current.querySelectorAll('.te > *'),
            { y: 20, autoAlpha: 0, stagger: 0.12, duration: 0.45, ease: 'power3.out' },
            '<0.05'
          );
        }, rootRef)
      }
    } catch (e) {
      // If anything goes wrong (e.g. window undefined), just skip GSAP for safety on this section
      ctx = undefined
    }

      return () => {
        if (ctx && ctx.revert) ctx.revert()
      }
  }, [])

  return (
    <div ref={rootRef} className='relative h-screen' data-section="about" style={{ transform: 'translateY(-24px)', zIndex: 10 }}>
      <div className="relative z-10 h-full flex items-center justify-center">
        <div ref={contentRef} className="content h-full w-full flex flex-col lg:flex-row items-center px-4 sm:px-6 lg:px-0">
          <div className="profile-card-container h-auto lg:h-156 w-full lg:w-1/2 p-3 sm:p-6 flex justify-center items-center mb-6 lg:mb-0">
            <ProfileCard
              name="Rohit Kumar"
              title="Web Developer"
              handle="rohitkumar"
              status="Available for projects"
              contactText="Contact Me"
              onContactClick={() => { /* contact action handled elsewhere */ }}
            />
          </div>
          <div className="te w-full lg:w-1/2 px-3 sm:px-6 self-center lg:self-start lg:mt-48 text-center lg:text-left">
            <h1 className='text-6xl sm:text-6xl md:text-7xl lg:text-9xl font-bold mb-3 sm:mb-4 w-full text-white font-["clashB"] leading-tight lg:leading-wider' style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
              About Me
            </h1>
            <p className='text-2xl sm:text-xl md:text-2xl lg:text-4xl mt-3 sm:mt-6 leading-relaxed text-gray-300 font-["clashB"]' style={{ textShadow: '0.5px 0.5px 1px rgba(0,0,0,0.6)' }}>
              I'm Rohit Kumar, a passionate web developer with expertise in creating dynamic and responsive web applications. With a strong foundation in JavaScript, React, and Node.js, I enjoy building user-friendly interfaces and seamless backend systems.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
export default About
