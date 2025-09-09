"use client";

import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function About() {
  const rootRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // allow optional duration via data-duration on the root element
      const provided = parseFloat(rootRef.current?.dataset?.duration)
      const contentDur = Number.isFinite(provided) ? provided : 0.8

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 70%',
          // play when entering, reverse when leaving (both directions) so content appears/disappears
          toggleActions: 'play reverse play reverse',
          // markers: true,
        }
      })

      // move content up from y:200 and scale from 0.6 -> 1 as section enters (opacity stays 1)
      tl.fromTo(
        contentRef.current,
        { y: 20, scale: 0.8, autoAlpha: 1 },
        { y: 0, scale: 1, autoAlpha: 1, duration: contentDur, ease: 'power3.out' }
      );

      // then animate the image appearance: slide in from left
      tl.from(
        contentRef.current.querySelectorAll('.image'),
        { x: -150, autoAlpha: 0, duration: 0.7, ease: 'power3.out' }
      );

      // finally animate text children (staggered)
      tl.from(
        contentRef.current.querySelectorAll('.te > *'),
        { y: 20, autoAlpha: 0, stagger: 0.12, duration: 0.6, ease: 'power3.out' }
      );
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={rootRef} className='relative h-screen' data-section="about">
      {/* 3D model gets covered by this layer */}

      {/* About content layer that covers the 3D model */}
      <div className="relative z-[10000] h-full bg-[#01161e] backdrop-blur-sm flex items-center justify-center">
        {/* Your about content goes here */}
        <div ref={contentRef} className="content h-[85vh] w-[95%] bg-[#edede9] flex items-center">
            <div className="image h-156 w-1/2 m-8">
                <img className='h-full w-[70%] object-cover' src="https://res.cloudinary.com/dsjjdnife/image/upload/v1755711983/load2_z4atye" alt="" />
            </div>
            <div className="te w-1/2 m-8 self-start mt-26">
                <h1 className='text-7xl font-bold mb-4 w-ful text-center '>About Me</h1>
                <p className='text-2xl mt-6 leading-relaxed'>
                    I'm Rohit Kumar, a passionate web developer with expertise in creating dynamic and responsive web applications. With a strong foundation in JavaScript, React, and Node.js, I enjoy building user-friendly interfaces and seamless backend systems. My goal is to deliver high-quality code and innovative solutions that enhance user experiences.
                </p>
            </div>
        </div>
      </div>
    </div>
  )
}
export default About
