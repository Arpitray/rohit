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
    <div ref={rootRef} className='relative h-screen' data-section="about" style={{ transform: 'translateY(-24px)', zIndex: 10 }}>
      {/* 3D model gets covered by this layer */}

      {/* About content layer with glassmorphism effect */}
  <div className="relative z-10 h-full flex items-center justify-center " 
           style={{
             // make the section transparent so the underlying canvas shows through
             background: 'transparent',
             border: 'none'
           }}>
        {/* Your about content goes here */}
  <div ref={contentRef} className="content h-full w-full flex items-center"
             style={{
               // make the inner content full-bleed and visually merge with surrounding areas
               background: 'transparent',
               backdropFilter: 'none',
               WebkitBackdropFilter: 'none'
             }}>
            <div className="profile-card-container h-156 w-1/2 p-6 flex justify-center items-center">
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
            <div className="te w-1/2 px-6 self-start mt-48 ">
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
