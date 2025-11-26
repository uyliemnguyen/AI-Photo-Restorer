import React, { useState, useRef, useEffect, useCallback } from 'react';

interface ImageComparisonProps {
  beforeImage: string;
  afterImage: string;
}

export const ImageComparison: React.FC<ImageComparisonProps> = ({ beforeImage, afterImage }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Monitor container width to ensure the inner image scales correctly
  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const { left, width } = containerRef.current.getBoundingClientRect();
    const position = ((clientX - left) / width) * 100;
    setSliderPosition(Math.min(Math.max(position, 0), 100));
  }, []);

  const handleMouseDown = () => setIsResizing(true);
  const handleTouchStart = () => setIsResizing(true);

  const handleMouseUp = useCallback(() => setIsResizing(false), []);
  const handleTouchEnd = useCallback(() => setIsResizing(false), []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    e.preventDefault(); 
    handleMove(e.clientX);
  }, [isResizing, handleMove]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isResizing) return;
    // Prevent scrolling on mobile while dragging
    // e.preventDefault() is passive by default in some browsers, relying on touch-action: none in CSS
    handleMove(e.touches[0].clientX);
  }, [isResizing, handleMove]);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchend', handleTouchEnd);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleTouchMove);
    }

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isResizing, handleMouseMove, handleTouchMove, handleMouseUp, handleTouchEnd]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-3xl mx-auto aspect-[4/3] md:aspect-video rounded-2xl overflow-hidden select-none shadow-2xl shadow-black/50 ring-1 ring-slate-700 group"
      style={{ touchAction: 'none' }}
    >
      {/* 
         RIGHT SIDE IMAGE (Background Layer) - Restored Image 
         Since the clipped div sits on top and starts from left, 
         the background is visible on the RIGHT side.
      */}
      <img 
        src={afterImage} 
        alt="Restored" 
        className="absolute top-0 left-0 w-full h-full object-contain bg-slate-900 pointer-events-none" 
        draggable={false}
      />

      {/* 
         LEFT SIDE IMAGE (Clipped Layer) - Original Image 
         This sits on top. Width is determined by slider.
         If slider is at 50%, this takes up the LEFT 50%.
      */}
      <div 
        className="absolute top-0 left-0 h-full overflow-hidden border-r-2 border-white/50 box-content"
        style={{ width: `${sliderPosition}%` }}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-slate-900">
            {/* 
                We force the image width to match the PARENT container width.
                This ensures the image doesn't shrink when the clipping div shrinks.
                It stays "fixed" in position relative to the frame, creating the reveal effect.
            */}
            <img 
                src={beforeImage} 
                alt="Original" 
                className="h-full max-w-none object-contain pointer-events-none" 
                style={{ 
                    width: containerWidth ? `${containerWidth}px` : '100%',
                 }}
                 draggable={false}
            />
        </div>
      </div>

      {/* Slider Handle */}
      <div 
        className="absolute top-0 bottom-0 w-10 -ml-5 cursor-ew-resize z-20 flex items-center justify-center outline-none"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="w-9 h-9 bg-white rounded-full shadow-[0_0_15px_rgba(0,0,0,0.3)] flex items-center justify-center text-indigo-600 transition-transform duration-200 hover:scale-110 active:scale-95 backdrop-blur-md bg-white/90">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 rotate-90">
             <path fillRule="evenodd" d="M6.97 2.47a.75.75 0 011.06 0l4.5 4.5a.75.75 0 01-1.06 1.06L8.25 4.81V16.5a.75.75 0 01-1.5 0V4.81L3.53 8.03a.75.75 0 01-1.06-1.06l4.5-4.5zm9.53 4.28a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V7.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs font-bold tracking-wide pointer-events-none border border-white/10 shadow-lg">
        Original
      </div>
      <div className="absolute bottom-4 right-4 bg-indigo-600/90 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs font-bold tracking-wide pointer-events-none border border-indigo-400/30 shadow-lg">
        Restored
      </div>
    </div>
  );
};