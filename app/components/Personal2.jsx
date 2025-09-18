"use client";

import React from "react";
import TemplateColumn from "./TemplateColumn";

// Default video source (replace with your own video in /public or remote URL)
const VIDEO_SRC = "https://res.cloudinary.com/dsjjdnife/video/upload/v1753776808/vid5_zgcqro.mp4";

function Personal2() {
  // Define video configurations with different sizes
  const videoConfigs = [
    { id: 1, colSpan: 2, rowSpan: 2, src: VIDEO_SRC }, // Large featured video
    { id: 2, colSpan: 1, rowSpan: 2, src: VIDEO_SRC }, // Regular video
    { id: 3, colSpan: 1, rowSpan: 2, src: VIDEO_SRC }, // Regular video
    { id: 4, colSpan: 2, rowSpan: 2, src: VIDEO_SRC }, // Wide video
    { id: 5, colSpan: 1, rowSpan: 2, src: VIDEO_SRC }, // Tall video
    { id: 6, colSpan: 1, rowSpan: 2, src: VIDEO_SRC },
  ];

  // Function to organize videos into responsive rows
  const organizeVideosIntoRows = (videos) => {
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
    <div className="relative z-60">
      {/* Background image (covers full viewport) */}
      

      {/* Subtle glassmorphism backdrop with gradient blending edges */}
      <div
        className="absolute inset-0 -z-5"
        style={{
          // backgroundColor: 'rgba(255,255,255,0.03)',
          // backdropFilter: 'blur(6px)',
          // WebkitBackdropFilter: 'blur(6px)',
          // maskImage: 'radial-gradient(ellipse at center, black 60%, transparent 100%)',
          // WebkitMaskImage: 'radial-gradient(ellipse at center, black 60%, transparent 100%)',
        }}
      />

      {/* Content container */}
      <div className="min-h-screen w-full relative z-10">
        {/* Content with padding */}
        <div className="p-3 sm:p-4 lg:p-6">
          {/* Page heading */}
          <h2 className="text-2xl sm:text-3xl lg:text-6xl font-bold text-center font-['clashB'] mt-12 tracking-widest text-white mb-4 md:mb-12">Personal projects</h2>

          {/* Responsive video rows container */}
          <div className="space-y-3 sm:space-y-4 lg:space-y-6">
            {videoRows.map((row, rowIndex) => {
              // total columns is the sum of colSpan values in this row
              const totalCols = row.reduce((s, v) => s + (v.colSpan || 1), 0);
              const maxRowSpan = Math.max(...row.map(v => v.rowSpan || 1));

              return (
                <div key={rowIndex} className="w-full">
                  {/* Dynamic grid based on videos in this row */}
                  <div
                    className={`grid gap-3 sm:gap-4 lg:gap-6 [--row-h:96px] sm:[--row-h:128px] md:[--row-h:160px] lg:[--row-h:192px] xl:[--row-h:224px]`}
                    style={{
                      gridTemplateColumns: `repeat(${totalCols}, 1fr)`,
                      gridAutoRows: 'var(--row-h)'
                    }}
                  >
                    {row.map((video) => (
                      <div
                        key={video.id}
                        className="relative min-h-0 min-w-0"
                        style={{
                          gridColumn: `span ${video.colSpan || 1}`,
                          gridRow: `span ${video.rowSpan || 1}`,
                        }}
                      >
                        <TemplateColumn
                          src={video.src}
                          colSpan={video.colSpan}
                          rowSpan={video.rowSpan}
                          className="w-full h-full object-cover rounded-md sm:rounded-lg overflow-hidden shadow-lg"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Personal2;