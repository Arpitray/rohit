"use client";

import React, { useState, useEffect } from "react";
import TemplateColumn from "./TemplateColumn";

// Default video sources
const VIDEO_SRC = "https://res.cloudinary.com/dsjjdnife/video/upload/f_auto,q_auto/v1758221382/Jackboys_2_travisscott_travisscott_travisscottedits_travisscottfans_jackboys_3danimatio_mwcf5t";
const VIDEO_SRC2 = "https://res.cloudinary.com/dsjjdnife/video/upload/f_auto,q_auto/v1758217507/I_AM_MUSC_-_playboicarti_opium_00pium_riseofcarti_playboicarti_playboicartiedits_iammusic_ig7ceh";
const VIDEO_SRC3 = "https://res.cloudinary.com/dsjjdnife/video/upload/f_auto,q_auto/v1758221513/timeless_dolfia";
const VIDEO_SRC4 = "https://res.cloudinary.com/dsjjdnife/video/upload/f_auto,q_auto/v1758221767/weeknd_rudubi";
const VIDEO_SRC5 = "https://res.cloudinary.com/dsjjdnife/video/upload/f_auto,q_auto/v1758221922/skate_o9ombj";
const VIDEO_SRC6 = "https://res.cloudinary.com/dsjjdnife/video/upload/f_auto,q_auto/v1758222339/sangeet_sintdw";
const VIDEO_SRC7 = "https://res.cloudinary.com/dsjjdnife/video/upload/f_auto,q_auto/v1758222654/dolla_qjius6";
const VIDEO_SRC8 = "https://res.cloudinary.com/dsjjdnife/video/upload/f_auto,q_auto/v1758222673/showreel_c8gkxq";
const VIDEO_SRC9 = "https://res.cloudinary.com/dsjjdnife/video/upload/f_auto,q_auto/v1758222842/butterfly_fw6fcm";
const VIDEO_SRC10 = "https://res.cloudinary.com/dsjjdnife/video/upload/f_auto,q_auto/v1758222888/mahadev_g8gm6x";
const VIDEO_SRC11 = "https://res.cloudinary.com/dsjjdnife/video/upload/f_auto,q_auto/v1758223034/maut_jr4nam";

function Personal2() {
  const [screenSize, setScreenSize] = useState('desktop');
  // playSignal increments will be forwarded to videos to trigger programmatic play where needed
  const [playSignal, setPlaySignal] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setScreenSize('mobile');
      } else if (window.innerWidth < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    // nothing mobile-specific here any longer

    handleResize(); // Set initial size
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Define video configurations with different sizes
  const videoConfigs = [
    // Add or edit the `defaultZoom`, `zoomScale`, and `showZoomButton` fields here to control
    // zoom behavior per-video directly from the `Personal2` component.
    { id: 1, colSpan: 2, rowSpan: 3, src: VIDEO_SRC, defaultZoom: true, zoomScale: 1.17, showZoomButton: false }, 
    { id: 2, colSpan: 1, rowSpan: 3, src: VIDEO_SRC2, defaultZoom: true, zoomScale: 1.1, showZoomButton: false }, 
    { id: 3, colSpan: 1, rowSpan: 3, src: VIDEO_SRC3, defaultZoom: true, zoomScale: 1.1, showZoomButton: false }, 
    { id: 4, colSpan: 1, rowSpan: 3, src: VIDEO_SRC4, defaultZoom: true, zoomScale: 1.2, showZoomButton: false }, 
    { id: 5, colSpan: 1, rowSpan: 3, src: VIDEO_SRC5, defaultZoom: true, zoomScale: 1.1, showZoomButton: false },
    { id: 6, colSpan: 1, rowSpan: 3, src: VIDEO_SRC6, defaultZoom: true, zoomScale: 1.1, showZoomButton: false },
    { id: 7, colSpan: 1, rowSpan: 3, src: VIDEO_SRC7, defaultZoom: true, zoomScale: 1.1, showZoomButton: false },
    { id: 8, colSpan: 1, rowSpan: 3, src: VIDEO_SRC8, defaultZoom: true, zoomScale: 1.1, showZoomButton: false },
    { id: 9, colSpan: 1, rowSpan: 3, src: VIDEO_SRC9, defaultZoom: true, zoomScale: 1.1, showZoomButton: false },
    { id: 10, colSpan: 1, rowSpan: 3, src: VIDEO_SRC10, defaultZoom: true, zoomScale: 1.1, showZoomButton: false },
    { id: 11, colSpan: 1, rowSpan: 3, src: VIDEO_SRC11, defaultZoom: true, zoomScale: 1.1, showZoomButton: false },
  ];

  // Organize videos into responsive rows
  const organizeVideosIntoRows = (videos) => {
    if (screenSize === 'mobile') {
      // Mobile: first video full width, then pairs
      const rows = [];
      
      // First video gets its own row (full width)
      if (videos.length > 0) {
        rows.push([videos[0]]);
      }
      
      // Remaining videos in pairs (2 per row)
      const remainingVideos = videos.slice(1);
      for (let i = 0; i < remainingVideos.length; i += 2) {
        const pair = remainingVideos.slice(i, i + 2);
        rows.push(pair);
      }
      
      return rows;
    } else if (screenSize === 'tablet') {
      // Tablet: two per row
      const rows = [];
      for (let i = 0; i < videos.length; i += 2) {
        rows.push(videos.slice(i, i + 2));
      }
      return rows;
    }
    
  // Desktop: original complex grid layout
    const rows = [];
    let currentRow = [];
    let currentRowSpaceUsed = 0;
    const maxRowSpace = 3; // Maximum space units per row

    videos.forEach((video) => {
      const videoSpace = video.colSpan || 1; // Space this video takes

      // Check if video fits in current row
      if (currentRowSpaceUsed + videoSpace <= maxRowSpace && currentRow.length < 3) {
        currentRow.push(video);
        currentRowSpaceUsed += videoSpace;
      } else {
        // Start new row if current row has videos
        if (currentRow.length > 0) {
          rows.push([...currentRow]);
        }
        currentRow = [video];
        currentRowSpaceUsed = videoSpace;
      }
    });

    // Add last row if it has videos
    if (currentRow.length > 0) {
      rows.push(currentRow);
    }

    return rows;
  };

  const videoRows = organizeVideosIntoRows(videoConfigs);

  return (
    <div className="relative z-60 px-4 sm:px-8 md:px-16 lg:px-22">
      {/* Background image (covers full viewport) */}
      <img
        src="https://res.cloudinary.com/dsjjdnife/image/upload/v1758224595/9a760c179266081.64f6eab350316_dix0po.webp"
        alt="personal-bg"
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          filter: 'blur(1px) brightness(0.6)',
          opacity: 0.95,
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Subtle glassmorphism backdrop with gradient blending edges */}
      <div
        className="absolute inset-0 -z-5"
        style={{
          backgroundColor: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          maskImage: 'radial-gradient(ellipse at center, black 60%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 60%, transparent 100%)',
        }}
      />

      {/* Content container */}
      <div className="min-h-screen w-full relative z-10 pb-22">
        {/* Content with padding */}
        <div className="p-3 sm:p-4 md:p-6 lg:p-6">
          {/* Page heading */}
          <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-6xl font-bold text-center font-['clashB'] mt-6 sm:mt-8 md:mt-10 lg:mt-12 tracking-widest text-white mb-3 sm:mb-6 md:mb-8 lg:mb-12">Personal projects</h2>

          {/* Responsive video rows container */}
          <div className="space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-6">
            {videoRows.map((row, rowIndex) => {
                          const totalCols = row.reduce((s, v) => s + (v.colSpan || 1), 0);
                          const maxRowSpan = Math.max(...row.map(v => v.rowSpan || 1));
              
              const isMobileFirstRow = screenSize === 'mobile' && rowIndex === 0;
              const isMobilePairRow = screenSize === 'mobile' && rowIndex > 0;

              return (
                <div key={rowIndex} className="w-full">
                  {/* dynamic grid for this row */}
                  <div
                    className={`grid gap-2 sm:gap-3 md:gap-4 lg:gap-6 [--row-h:280px] sm:[--row-h:200px] md:[--row-h:160px] lg:[--row-h:192px] xl:[--row-h:310px] 
                      ${isMobileFirstRow ? 'grid-cols-1' : ''} 
                      ${isMobilePairRow ? 'grid-cols-2' : ''} 
                      ${screenSize === 'tablet' ? 'grid-cols-2' : ''} 
                      ${screenSize === 'desktop' ? '' : ''}`}
                    style={{
                      gridTemplateColumns: screenSize === 'desktop' ? `repeat(${totalCols}, 1fr)` : undefined,
                      gridAutoRows: 'var(--row-h)'
                    }}
                  >
                    {row.map((video) => (
                      <div
                        key={video.id}
                        className={`relative min-h-0 min-w-0 
                          ${isMobileFirstRow ? 'col-span-1' : ''} 
                          ${isMobilePairRow ? 'col-span-1' : ''}`}
                        style={{
                          // On desktop, preserve original grid spans
                          gridColumn: screenSize === 'desktop' ? `span ${video.colSpan || 1}` : undefined,
                          gridRow: screenSize === 'desktop' ? `span ${video.rowSpan || 1}` : 'span 1',
                        }}
                      >
                        {screenSize === 'mobile' ? (
                          // Simplified mobile video - no loading during scroll
                          <div 
                            className="w-full h-full object-cover rounded-md sm:rounded-lg overflow-hidden shadow-lg bg-black flex items-center justify-center cursor-pointer relative"
                            onClick={(e) => {
                              const video = e.currentTarget.querySelector('video');
                              const overlay = e.currentTarget.querySelector('.play-overlay');
                              if (video && !video.src) {
                                video.src = video.dataset.src;
                                video.load();
                                video.muted = true;
                                video.play().catch(() => {});
                                if (overlay) overlay.style.display = 'none';
                              } else if (video) {
                                video.muted = true;
                                video.play().catch(() => {});
                                if (overlay) overlay.style.display = 'none';
                              }
                            }}
                          >
                            <video
                              className="w-full h-full object-cover"
                              data-src={video.src}
                              muted
                              loop
                              playsInline
                              controls={false}
                              preload="none"
                            />
                            <div className="play-overlay absolute inset-0 bg-black/50 flex items-center justify-center text-white">
                              <div className="text-center">
                                <div className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center mb-2 mx-auto">
                                  <div className="w-0 h-0 border-l-4 border-l-white border-t-2 border-t-transparent border-b-2 border-b-transparent ml-1"></div>
                                </div>
                                <span className="text-sm">Tap to play</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          // Use TemplateColumn with LazyVideo for desktop/tablet
                          <TemplateColumn
                            src={video.src}
                            colSpan={video.colSpan}
                            rowSpan={video.rowSpan}
                            className="w-full h-full object-cover rounded-md sm:rounded-lg overflow-hidden shadow-lg"
                            defaultZoom={video.defaultZoom}
                            zoomScale={video.zoomScale}
                            showZoomButton={video.showZoomButton}
                            playSignal={playSignal}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile overlay removed: videos will appear directly on mobile */}
    </div>
  );
}

export default Personal2;