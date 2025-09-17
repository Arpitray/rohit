"use client";

import React from "react";
import LazyVideo from "./LazyVideo";

/**
 * TemplateColumn - reusable grid item that can span columns/rows and render a video.
 * props:
 * - src: video src
 * - colSpan: number of columns to span (Tailwind uses col-span-{n})
 * - rowSpan: number of rows to span (Tailwind uses row-span-{n})
 * - className: additional classes for the container
 */
const TemplateColumn = ({
  src,
  colSpan = 1,
  rowSpan = 1,
  className = "",
  showLoader = false,
}) => {
  // TemplateColumn is now a neutral container — the parent grid controls spans via inline styles
  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <LazyVideo src={src} autoplay loop muted playsInline showLoader={showLoader} className="w-full h-full relative" />
    </div>
  );
};

export default TemplateColumn;

