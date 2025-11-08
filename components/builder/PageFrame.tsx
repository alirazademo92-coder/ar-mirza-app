import React from 'react';

interface PageFrameProps {
  unitNumber?: number | string;
  unitTitle?: string;
  classNumber?: string;
  pageNumber: number;
}

const PageFrame: React.FC<PageFrameProps> = ({ unitNumber, unitTitle, classNumber, pageNumber }) => {
  // Using a full SVG implementation for header and footer to guarantee
  // crisp rendering and perfect alignment in the generated PDF,
  // finally resolving the long-standing html2canvas issues.
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col p-4 font-sans">
      
      {/* 
        Header SVG
        - viewBox is set to a fixed coordinate system (e.g., 800x32) to make positioning predictable.
        - preserveAspectRatio="none" ensures the SVG stretches to fill the container's height (h-8).
      */}
      <header className="flex-shrink-0 h-8">
        <svg width="100%" height="100%" viewBox="0 0 800 32" preserveAspectRatio="none" className="text-zinc-700 dark:text-zinc-200">
          {/* Background Bar: The main grey bar for the entire header. */}
          <rect x="0" y="0" width="800" height="32" className="fill-zinc-600" />
          
          {/* Left Section: UNIT */}
          <g id="unit-section">
            {/* The two colored boxes: one for the "UNIT" text and one for the number. */}
            <rect x="10" y="6" width="50" height="20" className="fill-zinc-600" />
            <rect x="60" y="6" width="28" height="20" className="fill-white" />

            {/* Thin white strokes to create the inset border effect. */}
            <line x1="10" y1="6.5" x2="88" y2="6.5" stroke="white" strokeWidth="1" />
            <line x1="10" y1="25.5" x2="88" y2="25.5" stroke="white" strokeWidth="1" />

            {/* Text elements are rendered on top of the boxes. 
                dominantBaseline="central" and textAnchor="middle" ensure perfect centering. */}
            <text
                x="35"
                y="16"
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-white text-[16px] font-bold"
                letterSpacing="2"
            >
                UNIT
            </text>
            <text
                x="74"
                y="16"
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-zinc-800 text-[18px] font-bold"
            >
                {unitNumber}
            </text>
          </g>
          
          {/* Center Section: Title */}
          <text x="400" y="16" dominantBaseline="central" textAnchor="middle" className="fill-white text-[16px] font-semibold tracking-widest truncate">
            {unitTitle?.toUpperCase()}
          </text>
          
          {/* Right Section: CLASS */}
          <g id="class-section">
            {/* The two colored boxes for the number and "CLASS" text. */}
            <rect x="702" y="6" width="28" height="20" className="fill-white" />
            <rect x="730" y="6" width="60" height="20" className="fill-zinc-600" />
            
            {/* Thin white strokes for the inset border effect. */}
            <line x1="702" y1="6.5" x2="790" y2="6.5" stroke="white" strokeWidth="1" />
            <line x1="702" y1="25.5" x2="790" y2="25.5" stroke="white" strokeWidth="1" />

            {/* Text elements for the class number and label. */}
            <text 
                x="716" 
                y="16"
                textAnchor="middle" 
                dominantBaseline="central"
                className="fill-zinc-800 text-[18px] font-bold"
            >
                {classNumber}
            </text>
            <text 
                x="760"
                y="16"
                textAnchor="middle" 
                dominantBaseline="central"
                className="fill-white text-[16px] font-bold"
                letterSpacing="2"
            >
                CLASS
            </text>
          </g>
        </svg>
      </header>
      
      {/* Dotted Border Area: A simple div with CSS borders for the vertical page lines. */}
      <div className="flex-grow w-full relative">
        <div className="absolute top-0 bottom-0 left-0 w-full h-full border-l border-r border-dotted border-zinc-300 dark:border-zinc-700"></div>
      </div>

      {/* 
        Footer SVG 
        - Contains two lines and a central circle with the page number.
        - The structure is simple and robust for PDF conversion.
      */}
      <footer className="flex-shrink-0 h-10 flex items-center justify-center">
        <svg width="100%" height="100%" viewBox="0 0 800 40" preserveAspectRatio="none">
          {/* Lines on either side of the circle. */}
          <line x1="0" y1="20" x2="370" y2="20" className="stroke-zinc-600" strokeWidth="2" />
          <line x1="430" y1="20" x2="800" y2="20" className="stroke-zinc-600" strokeWidth="2" />
          
          {/* Circle in the middle. */}
          <circle cx="400" cy="20" r="14" className="stroke-zinc-600" strokeWidth="2" fill="none" />
          
          {/* Page Number Text, perfectly centered in the circle. */}
          <text x="400" y="20" dominantBaseline="central" textAnchor="middle" className="text-[16px] font-bold fill-zinc-700 dark:fill-zinc-200">
            {pageNumber}
          </text>
        </svg>
      </footer>

    </div>
  );
};

export default PageFrame;