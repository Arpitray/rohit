"use client";

import { useEffect, useRef } from 'react'
import Lenis from '@studio-freight/lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function LenisProvider({ children }) {
  const lenisRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const lenis = new Lenis({
      duration: 1.2, // Increased from 1.2 for slower scrolling
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      direction: 'vertical',
      gestureOrientation: 'vertical',
      lerp: 0.06, // Reduced from 0.1 for smoother, slower interpolation
      wheelMultiplier: 1.3, // Reduce wheel scroll sensitivity
      touchMultiplier: 0.8, // Reduce touch scroll sensitivity
      smoothWheel: true,
    })

    lenisRef.current = lenis

    function raf(time) {
      lenis.raf(time)
      // update ScrollTrigger on each frame so it uses Lenis' scroll position
      ScrollTrigger.update()
      requestAnimationFrame(raf)
    }

    // Setup scrollerProxy so GSAP uses Lenis for scroll positions
    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value)
        }
        return lenis.scroll
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }
      },
      // pinType is needed for mobile/transform pinning
      pinType: document.documentElement.style.transform ? 'transform' : 'fixed'
    })

  // Refresh ScrollTrigger once after Lenis has initialized
  ScrollTrigger.refresh()

    const rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      // destroy lenis instance
      try { lenis.destroy() } catch (e) { /* ignore */ }
    }
  }, [])

  return children || null
}
