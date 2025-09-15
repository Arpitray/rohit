
'use client';

import { motion, useMotionValue } from 'framer-motion';
import React, { useEffect, useRef, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Center, Environment } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const pexelsImages = [
  'https://images.pexels.com/photos/32617821/pexels-photo-32617821.jpeg',
  'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg',
  'https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg',
  'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg',
  'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg',
  'https://images.pexels.com/photos/2387793/pexels-photo-2387793.jpeg',
  'https://images.pexels.com/photos/1591447/pexels-photo-1591447.jpeg',
  'https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg',
  'https://images.pexels.com/photos/1323712/pexels-photo-1323712'
];

// 3D Model component with cursor following
function Model3D({ modelPath, position = [0, 0, 0], scale = [1, 1, 1], maxRotation = 0.3, initialRotation = [0, 0, 0] }) {
  const gltf = useGLTF(modelPath);
  const groupRef = useRef();
  const targetRot = useRef({ x: 0, y: 0 });
  const isPointerDown = useRef(false);
  const prevPointer = useRef({ x: 0, y: 0 });

  // Update target rotation based on mouse position (hover) and on drag (pointer)
  useEffect(() => {
    const onMove = (e) => {
      if (isPointerDown.current) return; // when dragging we use pointermove
      const nx = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      const ny = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1
      targetRot.current.x = -ny * maxRotation;
      targetRot.current.y = nx * maxRotation;
    };

    const onPointerDown = (e) => {
      isPointerDown.current = true;
      prevPointer.current.x = e.clientX;
      prevPointer.current.y = e.clientY;
    };

    const onPointerMove = (e) => {
      if (!isPointerDown.current) return;
      const dx = (e.clientX - prevPointer.current.x) / window.innerWidth; // normalized delta
      const dy = (e.clientY - prevPointer.current.y) / window.innerHeight;
      // apply incremental rotation change for dragging
      targetRot.current.y += dx * maxRotation * 2.0;
      targetRot.current.x += -dy * maxRotation * 2.0;
      prevPointer.current.x = e.clientX;
      prevPointer.current.y = e.clientY;
    };

    const onPointerUp = () => {
      isPointerDown.current = false;
    };

    // Touch fallback handlers
    const onTouchStart = (t) => {
      const touch = t.touches && t.touches[0];
      if (!touch) return;
      onPointerDown(touch);
    };
    const onTouchMove = (t) => {
      const touch = t.touches && t.touches[0];
      if (!touch) return;
      onPointerMove(touch);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onPointerUp);
    };
  }, [maxRotation]);

  // Smooth interpolation to target rotation
  useFrame(() => {
    if (!groupRef.current) return;
    const lerp = (a, b, t) => a + (b - a) * t;
    groupRef.current.rotation.x = lerp(groupRef.current.rotation.x, targetRot.current.x, 0.08);
    groupRef.current.rotation.y = lerp(groupRef.current.rotation.y, targetRot.current.y, 0.08);
  });

  // apply an initial rotation (useful when model faces X axis in modeling tool)
  useEffect(() => {
    if (!groupRef.current) return;
    try {
      groupRef.current.rotation.set(initialRotation[0] || 0, initialRotation[1] || 0, initialRotation[2] || 0);
    } catch (e) {
      // ignore if rotation cannot be set immediately
    }
  }, [initialRotation]);

  return (
    <Center>
      <group ref={groupRef} position={position} scale={scale}>
        <primitive object={gltf.scene} dispose={null} />
      </group>
    </Center>
  );
}

// 3D Canvas component positioned at specific screen location
function PositionedModel({ modelPath, position, canvasStyle, scale = [0.5, 0.5, 0.5], maxRotation = 0.2, cameraConfig = {} }) {
  const defaultCamera = { position: [0, 0, 3], fov: 45 };
  const camera = { ...defaultCamera, ...cameraConfig };
  
  return (
    <div className={`fixed pointer-events-none ${position}`} z-20 style={{ ...canvasStyle, zIndex: -1 }}>
      <Canvas
        className="w-full h-full"
        camera={camera}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Suspense fallback={null}>
          <Environment preset="studio" background={false} />
          <Model3D 
            modelPath={modelPath} 
            scale={scale} 
            maxRotation={maxRotation}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

// Raw Logo Model Component - Center of screen with specific camera settings
function RawLogoModel({ modelRef }) {
  return (
    <div ref={modelRef} className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-grab" 
         style={{ width: '2000px', height: '2000px', touchAction: 'none', zIndex: 1 }}>
      <Canvas
        className="w-full h-full"
        camera={{ 
          position: [0, 0, 2],    // Camera distance and angle
          fov: 50,                // Field of view
          rotation: [0, 0, 0]     // Camera rotation
        }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <pointLight position={[-5, -5, -5]} intensity={0.3} />
        <Suspense fallback={null}>
          <Environment preset="sunset" background={false} />
          <Model3D 
            modelPath="/raw_logo.glb"
            scale={[0.6, 0.6, 0.6]}
            maxRotation={0.22}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

// Music Model Component - Top left corner with specific camera settings
function MusicModel({ modelRef }) {
  return (
  <div ref={modelRef} className="fixed z-[1] top-8 left-8 cursor-grab" 
     style={{ width: '400px', height: '400px', touchAction: 'none' }}>
      <Canvas
        className="w-full h-full"
        camera={{ 
          position: [0, 0, 2],     // Direct front view - centered camera
          fov: 45,                 // Wider field of view for better visibility
          rotation: [0, 0, 0]      // No camera tilt - facing directly forward
        }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[0, 5, 5]} intensity={1.0} />
        <directionalLight position={[0, -5, 5]} intensity={0.5} />
        <pointLight position={[2, 2, 2]} intensity={0.4} />
        <Suspense fallback={null}>
          <Environment preset="studio" background={false} />
          <Model3D 
            modelPath="/newMusic3.glb"
            scale={[0.5, 0.5, 0.5]}
            maxRotation={0.1}
            // start with a rightward-facing bias so its resting pose matches hover-on-right
            initialRotation={[0, 2, 0]}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default function Home() {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const rawLogoRef = useRef(null);
  const musicModelRef = useRef(null);
  const x = useMotionValue(0); // pixel translateX
  const y = useMotionValue(0); // pixel translateY
  
  // Generate fewer, static image positions for better performance
  const imagePositions = useState(() => 
    pexelsImages.map((_, index) => ({
      x: Math.random() * 160 + 20, // 20% to 180% of viewport width
      y: Math.random() * 110 + 20, // 20% to 130% of viewport height
      size: Math.random() * 120 + 80, // Random size between 80px and 200px
      rotation: Math.random() * 40 - 20, // Random rotation between -20 and 20 degrees
      zIndex: Math.floor(Math.random() * 5) + 1
    }))
  )[0];

  // Initialize center positions (pixel values) and add RAF-throttled mouse handler
  useEffect(() => {
    // refs for dimensions and targets to avoid closures
    const vwRef = { current: window.innerWidth };
    const vhRef = { current: window.innerHeight };
  const extraWRef = { current: vwRef.current }; // 100vw
  const extraHRef = { current: 0.5 * vhRef.current }; // 50vh

    // center the canvas
    x.set(-extraWRef.current / 2);
    y.set(-extraHRef.current / 2);

    const target = { x: x.get(), y: y.get() };

    // mousemove simply updates target values (cheap)
    const onMove = (e) => {
      const mx = Math.max(0, Math.min(e.clientX, vwRef.current));
      const my = Math.max(0, Math.min(e.clientY, vhRef.current));

      target.x = -vwRef.current * (mx / vwRef.current); // -vw .. 0
      target.y = -extraHRef.current * (my / vhRef.current); // -extraH .. 0
    };

    // Resize handler updates refs
    const onResize = () => {
      vwRef.current = window.innerWidth;
      vhRef.current = window.innerHeight;
      extraWRef.current = vwRef.current;
      extraHRef.current = 0.5 * vhRef.current;
      // recenter targets
      target.x = -extraWRef.current / 2;
      target.y = -extraHRef.current / 2;
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    // RAF loop: lerp current x/y towards target for smooth, low-cost animation
    let rafId = 0;
    const lerp = (a, b, t) => a + (b - a) * t;
    const loop = () => {
      const currentX = x.get();
      const currentY = y.get();
      const nextX = lerp(currentX, target.x, 0.12);
      const nextY = lerp(currentY, target.y, 0.12);

      // only set when change is meaningful to avoid work
      if (Math.abs(nextX - currentX) > 0.1) x.set(nextX);
      if (Math.abs(nextY - currentY) > 0.1) y.set(nextY);

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(rafId);
    };
  }, [x, y]);

  // GSAP ScrollTrigger for dynamic blur effect on video and 3D models
  useEffect(() => {
    if (!videoRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to([videoRef.current, rawLogoRef.current, musicModelRef.current], {
        filter: "blur(50px)",
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "+=200vh",
          scrub: 1,
          onUpdate: (self) => {
            // Map scroll progress (0 to 1) to blur (0px to 50px)
            const blurAmount = self.progress * 100;
            
            // Apply blur to video
            if (videoRef.current) {
              videoRef.current.style.filter = `blur(${blurAmount}px)`;
            }
            
            // Apply blur to 3D models
            if (rawLogoRef.current) {
              rawLogoRef.current.style.filter = `blur(${blurAmount}px)`;
            }
            if (musicModelRef.current) {
              musicModelRef.current.style.filter = `blur(${blurAmount}px)`;
            }
          }
        }
      });
    }, [videoRef, rawLogoRef, musicModelRef]);

    return () => ctx.revert();
  }, []);

  return (
    <div className="fixed top-0 left-0 w-screen h-screen overflow-hidden textured-black-bg z-0">
      <motion.div
        ref={containerRef}
        className="relative w-[200vw] h-[150vh] will-change-transform"
        style={{ x, y }}
        transition={{
          type: "spring",
          stiffness: 40,   // Reduced for smoother motion
          damping: 40,     // Increased for less bounce
          mass: 1.5        // Increased for more natural feel
        }}
      >
        {/* Background video covering the whole canvas (200vw x 150vh) */}
        <video
          ref={videoRef}
          className="landing-bg-video absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
          src="https://res.cloudinary.com/dsjjdnife/video/upload/v1757399056/bharudevidhome_eb3vtq"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{ transform: 'scale(1)', transformOrigin: 'center' }}
        />

  {/* subtle dark overlay so glass sections read better */}
  <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(0,0,0,0.35)' }} />

        {/* Modern glassmorphism overlay above the video - frosted glass effect.
            The 3D model canvases are rendered outside this container with higher z-index, so they remain sharp. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{ 
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
            
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
          }}
        />


  {/* Overlays and 3D canvas removed per request: keep only the raw background video and interaction */}

  {/* glassmorphism overlay removed per request */}

  {/* images removed per request */}

  {/* navigation hints removed per request */}

  {/* center content removed per request */}
      </motion.div>

      {/* 3D Model Overlays - Each with separate camera configurations */}
      
      {/* Raw Logo Model - Center of screen with custom camera angle */}
      <RawLogoModel modelRef={rawLogoRef} />
      
      {/* Music Model - Top left corner with different camera setup */}
      <MusicModel modelRef={musicModelRef} />

  {/* 3D model rendered inline so it scrolls with the page (moved inside motion container) */}

  {/* mouse cursor removed to avoid per-frame React updates */}

  {/* progress indicator removed per request */}
    </div>
  );
}
