'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';
import type { Project } from '@/lib/projects';

const AUTO_SLIDE_MS = 5000;

interface WorkGalleryProps {
  projects: Project[];
}

export default function WorkGallery({ projects }: WorkGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState<Record<number, boolean>>({});
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const stripRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  // Filter out projects without images to prevent runtime errors
  const validProjects = useMemo(() => {
    return projects.filter(project => project.images && project.images.length > 0);
  }, [projects]);

  // Reset selectedIndex and refs when projects change
  useEffect(() => {
    setSelectedIndex(0);
    thumbRefs.current = [];
    isInitialMount.current = true;
    setIsLoading(true);
    setImageLoaded({});
    // Reset scroll position to start when projects change
    // Use setTimeout to ensure DOM is ready
    setTimeout(() => {
      if (stripRef.current) {
        stripRef.current.scrollLeft = 0;
      }
    }, 50);
  }, [validProjects.length]);

  // Ensure all thumbnails become visible after animation completes
  useEffect(() => {
    // Wait for all animations to complete (max delay + animation duration)
    const maxDelay = (validProjects.length - 1) * 50; // Last thumbnail's delay
    const animationDuration = 600; // Animation duration in ms
    const totalTime = maxDelay + animationDuration + 200; // Add buffer
    
    const timeout = setTimeout(() => {
      // Force all thumbnails to be visible
      thumbRefs.current.forEach((el) => {
        if (el) {
          el.style.opacity = '1';
        }
      });
    }, totalTime);
    
    return () => clearTimeout(timeout);
  }, [validProjects.length]);

  // Handle initial image load - set loading to false after a timeout if image doesn't load
  useEffect(() => {
    if (validProjects.length > 0) {
      // Set a timeout to clear loading state if image takes too long
      const timeout = setTimeout(() => {
        if (isLoading) {
          setIsLoading(false);
        }
      }, 3000); // 3 second max wait
      
      return () => clearTimeout(timeout);
    }
  }, [validProjects.length, isLoading]);

  // Auto-slider: advance to next image every 5s (only when not loading)
  useEffect(() => {
    if (validProjects.length <= 1 || isLoading) return;
    const id = setInterval(() => {
      setSelectedIndex((i) => (i + 1) % validProjects.length);
    }, AUTO_SLIDE_MS);
    return () => clearInterval(id);
  }, [validProjects.length, isLoading]);

  // Scroll active thumbnail into view when selection changes
  // Use requestAnimationFrame to ensure element is rendered before scrolling
  useEffect(() => {
    const el = thumbRefs.current[selectedIndex];
    if (el && stripRef.current) {
      // Wait for next frame to ensure active state styling is applied
      requestAnimationFrame(() => {
        // On initial mount with index 0, ensure we're at the very start
        // Wait a bit longer to ensure all thumbnails are rendered
        if (isInitialMount.current && selectedIndex === 0) {
          setTimeout(() => {
            if (stripRef.current) {
              stripRef.current.scrollLeft = 0;
            }
          }, 200);
          isInitialMount.current = false;
          return;
        }
        
        // For first 3 thumbnails (0, 1, 2), scroll to start to keep early thumbnails visible
        // For others, center the active thumbnail
        const scrollBehavior = selectedIndex < 3 ? 'start' : 'center';
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: scrollBehavior });
      });
    }
  }, [selectedIndex]);

  const goTo = useCallback((index: number) => {
    if (index !== selectedIndex && index >= 0 && index < validProjects.length) {
      setIsLoading(true);
      setSelectedIndex(index);
    }
  }, [selectedIndex, validProjects.length]);

  const handleImageLoad = useCallback((index: number) => {
    setImageLoaded(prev => {
      // Avoid unnecessary state updates
      if (prev[index]) return prev;
      return { ...prev, [index]: true };
    });
    if (index === selectedIndex) {
      // Small delay to ensure smooth transition
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    }
  }, [selectedIndex]);

  if (!projects.length) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-neutral-500 font-light tracking-wide">No projects in this category.</p>
      </div>
    );
  }
  
  if (!validProjects.length) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-neutral-500 font-light tracking-wide">No projects with images in this category.</p>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-b from-white via-neutral-50/30 to-white flex flex-col relative" style={{ position: 'relative', zIndex: 1 }}>
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(0,0,0) 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      {/* Main image — ultra-luxurious presentation */}
      {/* Nav ~10vh (fixed overlay), Card ~70vh, Strips ~20vh */}
      <div className="flex flex-col items-center justify-center px-2 sm:px-4 overflow-hidden relative gallery-fade-in" style={{ zIndex: 1, pointerEvents: 'auto' as const, height: '70vh', minHeight: '70vh', maxHeight: '70vh', marginTop: '10vh' } as React.CSSProperties}>
        {/* Decorative corner accents — hidden on mobile */}
        <div className="hidden md:block absolute top-20 left-8 w-24 h-24 border-t-2 border-l-2 border-neutral-200/40 opacity-30" />
        <div className="hidden md:block absolute top-20 right-8 w-24 h-24 border-t-2 border-r-2 border-neutral-200/40 opacity-30" />
        
        <div className="relative w-full h-full max-w-5xl max-h-full bg-gradient-to-br from-neutral-50 via-white via-neutral-50/50 to-neutral-50 overflow-hidden rounded-xl sm:rounded-2xl md:rounded-3xl shadow-[0_25px_70px_-20px_rgba(0,0,0,0.35),0_0_0_1px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.6)]" style={{ maxHeight: '100%' }}>
          {/* Modern Loading Spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-30 bg-gradient-to-br from-white/95 via-neutral-50/80 to-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden">
              {/* Shimmer effect */}
              <div className="absolute inset-0 animate-shimmer opacity-30"></div>
              
              <div className="flex flex-col items-center gap-4 sm:gap-5 relative z-10">
                {/* Modern double-ring spinner */}
                <div className="relative">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-neutral-200 rounded-full"></div>
                  <div className="absolute inset-0 w-12 h-12 sm:w-16 sm:h-16 border-2 border-transparent border-t-neutral-900 border-r-neutral-900 rounded-full animate-spin" style={{ animationDuration: '1s' }}></div>
                  <div className="absolute inset-1.5 sm:inset-2 w-9 h-9 sm:w-12 sm:h-12 border-2 border-transparent border-b-neutral-700 border-l-neutral-700 rounded-full animate-spin" style={{ animationDuration: '0.7s', animationDirection: 'reverse' }}></div>
                  <div className="absolute inset-3 sm:inset-4 w-6 h-6 sm:w-8 sm:h-8 bg-neutral-900/10 rounded-full animate-pulse-glow"></div>
                </div>
                
                {/* Animated dots */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-neutral-900 rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1s' }}></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-neutral-900 rounded-full animate-bounce" style={{ animationDelay: '150ms', animationDuration: '1s' }}></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-neutral-900 rounded-full animate-bounce" style={{ animationDelay: '300ms', animationDuration: '1s' }}></div>
                </div>
                <p className="text-[10px] sm:text-xs md:text-sm text-neutral-600 font-light tracking-wide">Loading image...</p>
              </div>
            </div>
          )}
          
          {validProjects.map((project, index) => {
            const isActive = index === selectedIndex && !isLoading;
            return (
            <div
              key={project.id}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.97]'
              }`}
              style={{ pointerEvents: (isActive ? 'auto' : 'none') as React.CSSProperties['pointerEvents'] }}
            >
              <Image
                src={project.images[0]}
                alt={`${project.title} - ${index + 1} of ${validProjects.length}`}
                fill
                className="object-contain p-2 sm:p-4"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1024px"
                priority={index === 0}
                onLoad={() => handleImageLoad(index)}
                onLoadingComplete={() => handleImageLoad(index)}
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </div>
            );
          })}
          
          {/* Multi-layer elegant effects */}
          <div className="absolute inset-0 pointer-events-none rounded-3xl shadow-[inset_0_0_80px_rgba(0,0,0,0.1),inset_0_2px_0_rgba(255,255,255,0.6),inset_0_-2px_0_rgba(0,0,0,0.05)]" />
          <div className="absolute inset-0 pointer-events-none rounded-3xl" style={{ backgroundImage: 'radial-gradient(circle at center, transparent 0%, transparent 55%, rgba(0,0,0,0.06) 100%)' }} />
          <div className="absolute inset-0 pointer-events-none rounded-3xl bg-gradient-to-b from-white/20 via-transparent to-transparent" />
          
          {/* Progress indicator for auto-slider */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {validProjects.map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === selectedIndex ? 'w-8 bg-neutral-900' : 'w-1 bg-neutral-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Thumbnail strip — center when few images, scroll when many */}
      {/* Nav ~10vh, Card ~70vh, Strips ~20vh */}
      <div
        ref={stripRef}
        className="relative flex-shrink-0 border-t border-neutral-200/50 bg-gradient-to-b from-white via-neutral-50/30 via-white/80 to-neutral-50/50 overflow-x-auto overflow-y-visible scroll-smooth backdrop-blur-lg shadow-[0_-8px_32px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.8)]"
        style={{ scrollbarGutter: 'stable', WebkitOverflowScrolling: 'touch', height: '20vh', minHeight: '20vh', maxHeight: '20vh' }}
      >
        {/* Elegant decorative elements */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neutral-300/60 via-neutral-200/40 to-transparent" />
        <div className="absolute top-[1px] left-0 right-0 h-[0.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
        
        {/* Subtle side gradients for depth — behind thumbnails so active border/number are never covered */}
        <div className="absolute top-0 left-0 w-12 sm:w-20 h-full bg-gradient-to-r from-white via-transparent to-transparent pointer-events-none z-0" />
        <div className="absolute top-0 right-0 w-12 sm:w-20 h-full bg-gradient-to-l from-white via-transparent to-transparent pointer-events-none z-0" />
        
        <div className="flex gap-2.5 sm:gap-3 md:gap-5 lg:gap-6 px-3 sm:px-4 md:px-6 lg:px-12 py-2.5 sm:py-3 min-w-max relative flex-shrink-0 z-10" style={{ margin: '0 auto', width: 'fit-content' }}>
          {validProjects.map((project, index) => (
            <button
              key={project.id}
              ref={(el) => { thumbRefs.current[index] = el; }}
              type="button"
              onClick={() => goTo(index)}
              style={{ animationDelay: `${index * 50}ms` }}
              className={`group relative flex-shrink-0 w-20 h-12 sm:w-28 sm:h-16 md:w-36 md:h-20 bg-gradient-to-br from-neutral-100 via-neutral-50 via-white to-neutral-200 overflow-hidden rounded-lg sm:rounded-xl transition-all duration-500 ease-out thumbnail-enter ${
                index === selectedIndex
                  ? 'ring-2 sm:ring-[3px] ring-neutral-900 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.5),0_0_0_2px_rgba(255,255,255,0.2),inset_0_0_0_1px_rgba(0,0,0,0.08)] scale-105 sm:scale-110 z-10'
                  : 'shadow-[0_5px_16px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.35)] hover:scale-105 hover:-translate-y-1 sm:hover:-translate-y-2 hover:ring-2 hover:ring-neutral-300/60'
              }`}
              aria-label={`View ${project.title}`}
              aria-current={index === selectedIndex ? 'true' : undefined}
            >
              {/* Base gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-neutral-100/80 via-white/50 to-neutral-200/80 rounded-lg sm:rounded-xl" />
              
              {/* Image with elegant zoom and brightness */}
              <Image
                src={project.images[0]}
                alt={`${project.title} thumbnail`}
                fill
                className={`object-cover transition-all duration-700 ease-out rounded-lg sm:rounded-xl ${
                  index === selectedIndex 
                    ? 'scale-100 brightness-100 saturate-100' 
                    : 'group-hover:scale-120 brightness-[0.92] group-hover:brightness-100 saturate-90 group-hover:saturate-100'
                }`}
                sizes="(max-width: 640px) 80px, (max-width: 768px) 112px, 144px"
                unoptimized
                loading={index < 3 ? 'eager' : 'lazy'}
                onError={(e) => {
                  // Silently handle image errors - make button visible even if image fails
                  const target = e.currentTarget;
                  if (target.parentElement) {
                    target.parentElement.style.opacity = '1';
                  }
                }}
                onLoad={() => {
                  // Ensure thumbnail is visible after image loads
                  const button = thumbRefs.current[index];
                  if (button) {
                    button.style.opacity = '';
                  }
                }}
              />
              
              {/* Modern thumbnail loading overlay */}
              {!imageLoaded[index] && (
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-50/80 via-white/60 to-neutral-50/80 backdrop-blur-sm flex items-center justify-center rounded-lg sm:rounded-xl">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '0.8s' }}></div>
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '150ms', animationDuration: '0.8s' }}></div>
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-neutral-600 rounded-full animate-bounce" style={{ animationDelay: '300ms', animationDuration: '0.8s' }}></div>
                  </div>
                </div>
              )}
              
              {/* Multi-layer overlay effects for non-active */}
              {index !== selectedIndex && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg sm:rounded-xl" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/25 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg sm:rounded-xl" />
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg sm:rounded-xl" />
                </>
              )}
              
              {/* Active state — ultra-luxurious indicators */}
              {index === selectedIndex && (
                <>
                  {/* Shine overlay — multiple layers (z-10, behind border) */}
                  <div className="absolute inset-0 z-10 bg-gradient-to-br from-white/25 via-white/8 to-transparent pointer-events-none rounded-xl" />
                  <div className="absolute inset-0 z-10 bg-gradient-to-t from-transparent via-transparent to-white/15 pointer-events-none rounded-xl" />
                  
                  {/* Inner glow — sophisticated (z-10, behind border) */}
                  <div className="absolute inset-[2px] z-10 rounded-lg shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-1px_2px_rgba(0,0,0,0.1)] pointer-events-none" />
                  
                  {/* Subtle radial glow (z-10, behind border) */}
                  <div className="absolute inset-0 z-10 rounded-xl" style={{ backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 70%)' }} />
                  
                  {/* Multi-layer border with glow (z-20, always on top of overlays) */}
                  <div className="absolute inset-0 z-20 border-[3px] border-neutral-900 pointer-events-none rounded-xl shadow-[0_0_0_2px_rgba(255,255,255,0.4),0_0_0_3px_rgba(0,0,0,0.1)]" />
                  
                  {/* Elegant bottom accent bar (z-20, same level as border) */}
                  <div className="absolute bottom-0 left-0 right-0 z-20 h-1.5 bg-gradient-to-r from-transparent via-neutral-900/90 to-transparent pointer-events-none rounded-b-xl" />
                  
                  {/* Top highlight bar (z-20, same level as border) */}
                  <div className="absolute top-0 left-0 right-0 z-20 h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent pointer-events-none rounded-t-xl" />
                </>
              )}
              
              {/* Ultra-elegant number indicator for active (z-30 so always on top) */}
              {index === selectedIndex && (
                <div className="absolute top-1.5 right-1.5 z-30 w-6 h-6 rounded-full bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 backdrop-blur-md flex items-center justify-center pointer-events-none shadow-[0_4px_12px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.2)] ring-1 ring-white/30">
                  <span className="text-[10px] text-white font-light tracking-wider">{index + 1}</span>
                </div>
              )}
              
              {/* Elegant corner accents on hover (non-active) */}
              {index !== selectedIndex && (
                <>
                  <div className="absolute top-0 right-0 w-3 h-3 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-bl-xl" />
                  <div className="absolute bottom-0 left-0 w-3 h-3 bg-gradient-to-tr from-neutral-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-tr-xl" />
                </>
              )}
              
              {/* Subtle pulse glow effect on active (z-0, behind everything) */}
              {index === selectedIndex && (
                <div className="absolute -inset-1 z-0 rounded-xl bg-neutral-900/10 animate-pulse-slow pointer-events-none blur-sm" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
