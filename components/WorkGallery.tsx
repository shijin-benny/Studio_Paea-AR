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
    <div className="h-screen overflow-hidden bg-white flex flex-col relative" style={{ position: 'relative', zIndex: 1 }}>

      {/* Main image — ultra-luxurious presentation */}
      {/* Nav ~10vh (fixed overlay), Card ~70vh, Strips ~20vh */}
      <div className="flex flex-col items-center justify-center px-2 sm:px-4 overflow-hidden relative gallery-fade-in" style={{ zIndex: 1, pointerEvents: 'auto' as const, height: '70vh', minHeight: '70vh', maxHeight: '70vh', marginTop: '10vh' } as React.CSSProperties}>
        <div className="relative w-full h-full max-w-5xl max-h-full bg-white overflow-hidden rounded-none border border-neutral-200" style={{ maxHeight: '100%' }}>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-30 bg-white">
              <div className="flex flex-col items-center gap-3 relative z-10">
                <div className="w-8 h-8 border-2 border-neutral-200 border-t-neutral-600 rounded-full animate-spin" />
                <p className="text-xs text-neutral-500">Loading...</p>
              </div>
            </div>
          )}
          
          {validProjects.map((project, index) => {
            const isActive = index === selectedIndex && !isLoading;
            return (
            <div
              key={project.id}
              className={`absolute inset-0 transition-opacity duration-300 ${
                isActive ? 'opacity-100' : 'opacity-0'
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
        className="relative flex-shrink-0 border-t border-neutral-200/50 bg-white overflow-x-auto overflow-y-visible scroll-smooth shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
        style={{ scrollbarGutter: 'stable', WebkitOverflowScrolling: 'touch', height: '20vh', minHeight: '20vh', maxHeight: '20vh' }}
      >
        <div className="flex gap-2.5 sm:gap-3 md:gap-5 lg:gap-6 px-3 sm:px-4 md:px-6 lg:px-12 py-2.5 sm:py-3 min-w-max relative flex-shrink-0 z-10" style={{ margin: '0 auto', width: 'fit-content' }}>
          {validProjects.map((project, index) => (
            <button
              key={project.id}
              ref={(el) => { thumbRefs.current[index] = el; }}
              type="button"
              onClick={() => goTo(index)}
              style={{ animationDelay: `${index * 50}ms` }}
              className={`group relative flex-shrink-0 w-20 h-12 sm:w-28 sm:h-16 md:w-36 md:h-20 bg-neutral-100 overflow-hidden rounded-none transition-all duration-500 ease-out thumbnail-enter ${
                index === selectedIndex
                  ? 'ring-2 sm:ring-[3px] ring-neutral-900 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.5),0_0_0_2px_rgba(255,255,255,0.2),inset_0_0_0_1px_rgba(0,0,0,0.08)] scale-105 sm:scale-110 z-10'
                  : 'shadow-[0_5px_16px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.35)] hover:scale-105 hover:-translate-y-1 sm:hover:-translate-y-2 hover:ring-2 hover:ring-neutral-300/60'
              }`}
              aria-label={`View ${project.title}`}
              aria-current={index === selectedIndex ? 'true' : undefined}
            >
              {/* Base gradient background */}
              <div className="absolute inset-0 bg-neutral-100/90 rounded-none" />
              
              {/* Image with elegant zoom and brightness */}
              <Image
                src={project.images[0]}
                alt={`${project.title} thumbnail`}
                fill
                className={`object-cover transition-all duration-700 ease-out rounded-none ${
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
                <div className="absolute inset-0 bg-neutral-100/90 backdrop-blur-sm flex items-center justify-center rounded-none">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-none" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/25 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-none" />
                </>
              )}
              
              {/* Active state — ultra-luxurious indicators */}
              {index === selectedIndex && (
                <>
                  {/* Shine overlay — multiple layers (z-10, behind border) */}
                  <div className="absolute inset-0 z-10 bg-gradient-to-br from-white/25 via-white/8 to-transparent pointer-events-none rounded-none" />
                  <div className="absolute inset-0 z-10 bg-gradient-to-t from-transparent via-transparent to-white/15 pointer-events-none rounded-none" />
                  
                  {/* Inner glow — sophisticated (z-10, behind border) */}
                  <div className="absolute inset-[2px] z-10 rounded-none shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-1px_2px_rgba(0,0,0,0.1)] pointer-events-none" />
                  
                  {/* Subtle radial glow (z-10, behind border) */}
                  <div className="absolute inset-0 z-10 rounded-none" style={{ backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 70%)' }} />
                  
                  {/* Multi-layer border with glow (z-20, always on top of overlays) */}
                  <div className="absolute inset-0 z-20 border-[3px] border-neutral-900 pointer-events-none rounded-none shadow-[0_0_0_2px_rgba(255,255,255,0.4),0_0_0_3px_rgba(0,0,0,0.1)]" />
                  
                  {/* Elegant bottom accent bar (z-20, same level as border) */}
                  <div className="absolute bottom-0 left-0 right-0 z-20 h-1.5 bg-gradient-to-r from-transparent via-neutral-900/90 to-transparent pointer-events-none rounded-none" />
                  
                  {/* Top highlight bar (z-20, same level as border) */}
                  <div className="absolute top-0 left-0 right-0 z-20 h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent pointer-events-none rounded-none" />
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
                  <div className="absolute top-0 right-0 w-3 h-3 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-none" />
                  <div className="absolute bottom-0 left-0 w-3 h-3 bg-gradient-to-tr from-neutral-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-none" />
                </>
              )}
              
              {/* Subtle pulse glow effect on active (z-0, behind everything) */}
              {index === selectedIndex && (
                <div className="absolute -inset-1 z-0 rounded-none bg-neutral-900/10 animate-pulse-slow pointer-events-none blur-sm" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
