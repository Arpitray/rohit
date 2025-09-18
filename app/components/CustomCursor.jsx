"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const [isProjectHover, setIsProjectHover] = useState(false);
  const [projectLink, setProjectLink] = useState("");
  const [currentCursorPos, setCurrentCursorPos] = useState({ x: 0, y: 0 });

  // Function to check what element is under the cursor
  const checkElementUnderCursor = useCallback((x, y) => {
    // Use document.elementFromPoint to get the element at cursor position
    const elementUnderCursor = document.elementFromPoint(x, y);
    const projectElement = elementUnderCursor?.closest('[data-project-link]');
    
    if (projectElement && !isProjectHover) {
      const link = projectElement.getAttribute('data-project-link');
      setIsProjectHover(true);
      setProjectLink(link);
      
      // Find the InteractiveVideo container within this project using data attribute
      const interactiveVideoContainer = projectElement.querySelector('[data-interactive-video="true"]');
      if (interactiveVideoContainer) {
        // Dispatch mouseenter on the InteractiveVideo container specifically
        const enterEvent = new MouseEvent('mouseenter', {
          bubbles: true,
          cancelable: true,
          clientX: x,
          clientY: y,
        });
        interactiveVideoContainer.dispatchEvent(enterEvent);
      }
    } else if (!projectElement && isProjectHover) {
      setIsProjectHover(false);
      setProjectLink("");
      
      // Find all InteractiveVideo containers and trigger mouseleave
      const allInteractiveContainers = document.querySelectorAll('[data-interactive-video="true"]');
      allInteractiveContainers.forEach(container => {
        const leaveEvent = new MouseEvent('mouseleave', {
          bubbles: true,
          cancelable: true,
          clientX: x,
          clientY: y,
        });
        container.dispatchEvent(leaveEvent);
      });
    }
  }, [isProjectHover]);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;

    // Track pointer and position the dot exactly under the pointer
    const handleMove = (e) => {
      // Use clientX/Y for accurate viewport coords
      const x = e.clientX;
      const y = e.clientY;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      
      // Update cursor position and check what's under it
      setCurrentCursorPos({ x, y });
      checkElementUnderCursor(x, y);
    };

    // Check element under cursor during any kind of movement or animation
    const handleGenericCheck = () => {
      if (currentCursorPos.x && currentCursorPos.y) {
        checkElementUnderCursor(currentCursorPos.x, currentCursorPos.y);
      }
    };

    // Use requestAnimationFrame for continuous checking during GSAP animations
    let animationFrame;
    const continuousCheck = () => {
      if (currentCursorPos.x && currentCursorPos.y) {
        checkElementUnderCursor(currentCursorPos.x, currentCursorPos.y);
      }
      animationFrame = requestAnimationFrame(continuousCheck);
    };

    // Start continuous checking
    animationFrame = requestAnimationFrame(continuousCheck);

    // Handle click on project areas
    const handleClick = (e) => {
      if (isProjectHover && projectLink) {
        e.preventDefault();
        window.open(projectLink, '_blank');
      }
    };

    // Add class immediately so native cursor is hidden while site is active
    document.documentElement.classList.add("hide-native-cursor");

    // Also remove the class when pointer leaves the window to restore native cursor
    const handleWindowLeave = () => document.documentElement.classList.remove("hide-native-cursor");

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("scroll", handleGenericCheck, true); // Keep scroll detection
    window.addEventListener("resize", handleGenericCheck); // Check on resize too
    window.addEventListener("click", handleClick);
    window.addEventListener("pointerleave", handleWindowLeave);

    // Remove on unmount
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("scroll", handleGenericCheck, true);
      window.removeEventListener("resize", handleGenericCheck);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("pointerleave", handleWindowLeave);
      document.documentElement.classList.remove("hide-native-cursor");
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [checkElementUnderCursor, currentCursorPos, isProjectHover, projectLink]);

  return (
    <div
      ref={dotRef}
      aria-hidden
      className={`custom-cursor-dot pointer-events-none fixed left-0 top-0 z-[9999] ${
        isProjectHover ? 'custom-cursor-visit' : ''
      }`}
      style={{
        transform: "translate3d(-9999px, -9999px, 0)",
      }}
    >
      {isProjectHover && (
        <span className="custom-cursor-text">
          ↗
        </span>
      )}
    </div>
  );
}
