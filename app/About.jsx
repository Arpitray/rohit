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
    const ctx = gsap.context(() => {
      // Use a scrubbed ScrollTrigger so the entrance animations are fully controlled by scroll progress.
      // This replaces the previous toggleActions/duration-driven timeline. Durations here are
      // smaller because scrub maps the timeline progress to scroll.
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

    return () => ctx.revert()
  }, [])

  return (
    <div ref={rootRef} className='relative h-screen' data-section="about">
      {/* 3D model gets covered by this layer */}

      {/* About content layer with glassmorphism effect */}
      <div className="relative z-20 h-full flex items-center justify-center textured-black-bg" 
           style={{
             background: 'rgba(0, 0, 0, 0.35)',
             backdropFilter: 'blur(20px)',
             WebkitBackdropFilter: 'blur(20px)',
             border: 'none',
             boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.6)',
             WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)',
             maskImage: 'linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)'
           }}>
        {/* Your about content goes here */}
        <div ref={contentRef} className="content h-[85vh] w-[95%] flex items-center rounded-2xl textured-black-overlay"
             style={{
               background: '#151515',
               backdropFilter: 'blur(10px)',
               WebkitBackdropFilter: 'blur(10px)',
               border: '1px solid rgba(255, 255, 255, 0.04)',
               boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.3)'
             }}>
            <div className="profile-card-container h-156 w-1/2 m-8 flex justify-center items-center">
                <ProfileCard 
                  name="Rohit Kumar"
                  title="Web Developer"
                  handle="rohitkumar"
                  status="Available for projects"
                  contactText="Contact Me"
                  onContactClick={() => {
                    // Add your contact logic here
                    console.log('Contact clicked!');
                  }}
                />
            </div>
            <div className="te w-1/2 m-8 self-start mt-26 ">
                <h1 className='text-9xl font-bold mb-4 w-full text-center text-white font-["clashB"] leading-wider'
                    style={{ 
                      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' 
                    }}>
                  About Me
                </h1>
                <p className='text-4xl mt-6 leading-relaxed text-gray-300 font-["clashB"]'
                   style={{ 
                     textShadow: '0.5px 0.5px 1px rgba(0, 0, 0, 0.6)' 
                   }}>
                    I'm Rohit Kumar, a passionate web developer with expertise in creating dynamic and responsive web applications. With a strong foundation in JavaScript, React, and Node.js, I enjoy building user-friendly interfaces and seamless backend systems.
                </p>
            </div>
        </div>
      </div>
    </div>
  )
}
export default About
