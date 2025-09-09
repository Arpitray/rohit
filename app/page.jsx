
'use client';

import { motion, useMotionValue } from 'framer-motion';
import { useEffect, useRef, useState, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { createPortal } from 'react-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html, Center, Environment, ContactShadows } from '@react-three/drei';

// Small overlay canvas that loads the GLB model from public folder
function ModelScene() {
  const gltf = useGLTF('/RaW..glb');
  console.log('GLTF loaded:', !!gltf, gltf && gltf.scene && gltf.scene.children.length);

  // Ensure meshes aren't frustum-culled and are visible; enable shadows and reflectivity
  if (gltf && gltf.scene) {
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.frustumCulled = false;
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.metalness = Math.max(0, child.material.metalness ?? 0.5);
          child.material.roughness = Math.min(1, child.material.roughness ?? 0.35);
          if ('envMapIntensity' in child.material) {
            child.material.envMapIntensity = Math.max(1, child.material.envMapIntensity ?? 1.5);
          }
        }
      }
    });
  }

 
  const groupRef = useRef();
  const targetRot = useRef({ x: 0, y: 0 });

  // mousemove updates the target rotation (normalized -1..1)
  useEffect(() => {
    const onMove = (e) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2; // -1 .. 1
      const ny = (e.clientY / window.innerHeight - 0.5) * 2; // -1 .. 1
  const maxX = 0.22; // tilt up/down (radians) - increased for stronger follow
  const maxY = 0.15; // rotate left/right - increased for stronger follow
      targetRot.current.x = -ny * maxX; // invert so moving up tilts down slightly
      targetRot.current.y = nx * maxY;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // Smoothly interpolate rotation towards target on each frame
  useFrame(() => {
    const g = groupRef.current;
    if (!g) return;
  const lerp = (a, b, t) => a + (b - a) * t;
  // faster interpolation for snappier follow
  g.rotation.x = lerp(g.rotation.x, targetRot.current.x, 0.14);
  g.rotation.y = lerp(g.rotation.y, targetRot.current.y, 0.14);
  });

  return (
    <Center>
      <group ref={groupRef} position={[0, -0.05, 0]} scale={[0.4, 0.4, 0.4]}>
        <primitive object={gltf.scene} dispose={null} />
      </group>
    </Center>
  );
}

function CanvasOverlay() {
  return (
  <Canvas className="w-full h-full" frameloop="always" camera={{ position: [0, 0, 2.2], fov: 40 }} shadows dpr={[1, 1.5]}>
      <hemisphereLight intensity={0.35} groundColor={'#111827'} />
      <ambientLight intensity={0.25} />
      <directionalLight castShadow intensity={1.6} position={[5, 5, 5]} shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
      <Suspense fallback={<Html center>Loading...</Html>}>
        <Environment preset="studio" background={false} />
        <ModelScene />
      </Suspense>
      <ContactShadows position={[0, -1.2, 0]} opacity={0.6} blur={6} far={10} />
      <OrbitControls enablePan={false} enableZoom={false} autoRotate={false} />
    </Canvas>
  );
}

// Portal the overlay to document.body so it's not clipped by ancestor transforms/overflow
// Separate 3D model component that can be used in other pages
export function ThreeDModel() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
      <div className="pointer-events-auto w-[120rem] h-[120rem] overflow-visible">
        <CanvasOverlay />
      </div>
    </div>
  );
}

function PortalCanvas() {
  const [portalEl, setPortalEl] = useState(null);

  useEffect(() => {
    const el = document.createElement('div');
    el.style.position = 'fixed';
    el.style.inset = '0';
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'center';
    el.style.pointerEvents = 'none';
    el.style.zIndex = '9999';
    document.body.appendChild(el);
    setPortalEl(el);
    return () => {
      if (el && el.parentNode) el.parentNode.removeChild(el);
      setPortalEl(null);
    };
  }, []);

  if (!portalEl) return null;

  return createPortal(
    <div className="pointer-events-none w-full h-full flex items-center justify-center">
      <div className="pointer-events-auto w-[120rem] h-[120rem] overflow-x-hidden">
        <CanvasOverlay />
      </div>
    </div>,
    portalEl
  );
}

const pexelsImages = [
  'https://images.pexels.com/photos/32617821/pexels-photo-32617821.jpeg',
  'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg',
  'https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg',
  'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg',
  'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg',
  'https://images.pexels.com/photos/2387793/pexels-photo-2387793.jpeg',
  'https://images.pexels.com/photos/1591447/pexels-photo-1591447.jpeg',
  'https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg',
  'https://images.pexels.com/photos/1323712/pexels-photo-1323712.jpeg'
];

export default function Home() {
  const containerRef = useRef(null);
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

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-transparent overflow-x-hidden">
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
          className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
          src="https://res.cloudinary.com/dsjjdnife/video/upload/v1757399056/bharudevidhome_eb3vtq"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          // subtle scale + color grading filter for cinematic look
          style={{
            transform: 'scale(1)',
            transformOrigin: 'center',
            filter: 'brightness(0.58) contrast(1.06) saturate(1.12) sepia(0.04) hue-rotate(-6deg)'
          }}
        />

        {/* cinematic color overlay (subtle teal/indigo grade + darken) */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(12,18,40,0.22), rgba(0,0,0,0.5))',
            mixBlendMode: 'overlay'
          }}
        />

        {/* vignette to darken edges */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)'
          }}
        />

        {/* Subtle dim overlay to keep text readable */}
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />

        {/* Grain/noise overlay on top of the video */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), radial-gradient(rgba(0,0,0,0.02) 1px, transparent 1px)',
            backgroundSize: '3px 3px, 6px 6px',
            mixBlendMode: 'overlay',
            opacity: 0.18
          }}
        />

  {/* glassmorphism overlay removed per request */}

  {/* images removed per request */}

  {/* navigation hints removed per request */}

  {/* center content removed per request */}
      </motion.div>

  {/* 3D overlay - only renders when Home component is active */}
  <PortalCanvas />

  {/* mouse cursor removed to avoid per-frame React updates */}

  {/* progress indicator removed per request */}
    </div>
  );
}
