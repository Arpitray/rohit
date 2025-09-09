"use client";

import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Project() {
  const projectRef = useRef(null)
  const boxesContainerRef = useRef(null)
  const box1Ref = useRef(null)
  const box2Ref = useRef(null)
  const box3Ref = useRef(null)
  const box4Ref = useRef(null)
  const box5Ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: projectRef.current,
          start: 'bottom bottom', // when project bottom hits viewport bottom
          end: () => `+=${window.innerHeight}`, // pin for one viewport height while animating
          scrub: 1,
          // pin the whole project section so its background remains visible
          pin: projectRef.current,
          pinSpacing: true,
          // markers: true,
        }
      })

      // Individual box movements to designated positions
      tl.to(box1Ref.current, {
        x: -700, // far left
     // move up
        duration: 0.5,
        ease: 'power2.out'
      }, 0)
      .to(box2Ref.current, {
        x: -350, // left // move up slightly
        duration: 0.5,
        ease: 'power2.out'
      }, 0)
      .to(box3Ref.current, {
        x: 0, // center - stays in place
        y: 0,
        duration: 0.5,
        ease: 'power2.out'
      }, 0)
      .to(box4Ref.current, {
        x: 350, // right // move up slightly
        duration: 0.5,
        ease: 'power2.out'
      }, 0)
      .to(box5Ref.current, {
        x: 700, // far right // move up
        duration: 0.5,
        ease: 'power2.out'
      }, 0)

    }, projectRef)

    return () => ctx.revert()
  }, [])

  return (
    // position and z-index ensure this component sits above the portal 3D canvas
    <div ref={projectRef} className='min-h-[100vh] bg-yellow-200 z-[10001] pointer-events-auto relative flex items-center justify-center'>
      {/* centered stack of boxes - will be pinned by ScrollTrigger at the end of this section */}
  <div ref={boxesContainerRef} className="BOXES flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div ref={box1Ref} className="box1 absolute h-76 w-76 bg-red-500"></div>
          <div ref={box2Ref} className="box1 absolute h-76 w-76 bg-red-500"></div>
          <div ref={box3Ref} className="box1 absolute h-76 w-76 bg-red-500"></div>
          <div ref={box4Ref} className="box1 absolute h-76 w-76 bg-red-500"></div>
          <div ref={box5Ref} className="box1 absolute h-76 w-76 bg-red-500"></div>
            <div ref={box1Ref} className="box1 absolute h-76 w-76 bg-red-500 overflow-hidden">
              <img src="https://i.pinimg.com/736x/7f/dd/31/7fdd319d4ebf18ecc23888940079f726.jpg" alt="" className="h-full w-full object-cover" />
            </div>
            <div ref={box2Ref} className="box1 absolute h-76 w-76 bg-red-500 overflow-hidden">
              <img src="https://i.pinimg.com/736x/7f/dd/31/7fdd319d4ebf18ecc23888940079f726.jpg" alt="" className="h-full w-full object-cover" />
            </div>
            <div ref={box3Ref} className="box1 absolute h-76 w-76 bg-red-500 overflow-hidden">
              <img src="https://i.pinimg.com/736x/7f/dd/31/7fdd319d4ebf18ecc23888940079f726.jpg" alt="" className="h-full w-full object-cover" />
            </div>
            <div ref={box4Ref} className="box1 absolute h-76 w-76 bg-red-500 overflow-hidden">
              <img src="https://i.pinimg.com/736x/7f/dd/31/7fdd319d4ebf18ecc23888940079f726.jpg" alt="" className="h-full w-full object-cover" />
            </div>
            <div ref={box5Ref} className="box1 absolute h-76 w-76 bg-red-500 overflow-hidden">
              <img src="https://i.pinimg.com/736x/7f/dd/31/7fdd319d4ebf18ecc23888940079f726.jpg" alt="" className="h-full w-full object-cover" />
            </div>
        </div>
      </div>
    </div>
  )
}
