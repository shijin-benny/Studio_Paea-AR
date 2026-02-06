'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MobileMenuProps {
  activeCategory?: string | null;
  showTooltip?: boolean;
  onTooltipChange?: (show: boolean) => void;
  isHomePage?: boolean; // Kept for backward compatibility but always true now
}

export default function MobileMenu({ activeCategory, showTooltip, onTooltipChange, isHomePage = false }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  // Ensure component only renders menu overlay after mount to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open and ensure menu has highest priority
  // Only run on client side to prevent hydration mismatches
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      const originalWidth = document.body.style.width;
      const originalHeight = document.body.style.height;
      
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.width = originalWidth;
        document.body.style.height = originalHeight;
      };
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    }
  }, [isOpen]);

  // Always white menu background with black text for visibility
  const textColor = 'text-neutral-900';
  const borderColor = 'border-neutral-200';

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(prev => !prev);
        }}
        type="button"
        className="lg:hidden relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center focus:outline-none transition-all duration-300 group cursor-pointer touch-manipulation"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
        style={{ 
          pointerEvents: 'auto' as const,
          zIndex: 99999,
          position: 'relative',
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'manipulation',
          backgroundColor: 'transparent',
          border: 'none',
          outline: 'none',
          cursor: 'pointer',
          minWidth: '32px',
          minHeight: '32px'
        } as React.CSSProperties}
      >
        {/* Animated Hamburger Icon */}
        <div className="relative w-5 h-4 sm:w-6 sm:h-5 flex flex-col justify-between pointer-events-none">
          <span
            className={`block h-0.5 w-full ${isHomePage ? 'text-white' : 'text-neutral-900'} transition-all duration-300 origin-center ${
              isOpen ? 'rotate-45 translate-y-2' : ''
            }`}
            style={{ backgroundColor: 'currentColor' }}
          />
          <span
            className={`block h-0.5 w-full ${isHomePage ? 'text-white' : 'text-neutral-900'} transition-all duration-300 ${
              isOpen ? 'opacity-0' : 'opacity-100'
            }`}
            style={{ backgroundColor: 'currentColor' }}
          />
          <span
            className={`block h-0.5 w-full ${isHomePage ? 'text-white' : 'text-neutral-900'} transition-all duration-300 origin-center ${
              isOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
            style={{ backgroundColor: 'currentColor' }}
          />
        </div>
      </button>

      {/* Mobile Menu Overlay — Full Screen Coverage with Highest Priority */}
      {isMounted && isOpen && (
        <div 
          className="fixed inset-0 lg:hidden"
          style={{ 
            zIndex: 99999,
            pointerEvents: 'auto' as const,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            visibility: 'visible',
            opacity: 1
          } as React.CSSProperties}
        >
          {/* Backdrop — Full Screen */}
          <div
            className="absolute inset-0 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
            style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              visibility: 'visible',
              opacity: 1
            }}
          />
          
          {/* Menu Panel — Full Height */}
          <div
            className={`absolute top-0 right-0 h-full w-[85%] max-w-sm shadow-2xl transform transition-transform duration-300 ease-out ${
              isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
            style={{ 
              position: 'absolute',
              top: 0,
              right: 0,
              height: '100%',
              width: '85%',
              maxWidth: '384px',
              backgroundColor: '#ffffff',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              zIndex: 1,
              visibility: 'visible',
              opacity: 1
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full" style={{ visibility: 'visible', opacity: 1 }}>
              {/* Header */}
              <div 
                className={`flex items-center justify-end py-3 px-4 border-b`}
                style={{ 
                  borderColor: 'rgba(0, 0, 0, 0.1)',
                  visibility: 'visible',
                  opacity: 1
                }}
              >
                <button
                  onClick={() => setIsOpen(false)}
                  className={`p-1.5 focus:outline-none transition-opacity hover:opacity-70`}
                  style={{
                    color: '#000000',
                    visibility: 'visible',
                    opacity: 1,
                    cursor: 'pointer'
                  }}
                  aria-label="Close menu"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                    style={{ 
                      visibility: 'visible', 
                      opacity: 1,
                      color: 'inherit'
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Menu Content */}
              <div className="flex-1 overflow-y-auto py-8 px-6" style={{ visibility: 'visible', opacity: 1 }}>
                {/* Navigation Section */}
                <div>
                  <nav className="flex flex-col gap-6">
                    <Link
                      href="/"
                      onClick={() => setIsOpen(false)}
                      className={`text-base font-light tracking-wide transition-opacity hover:opacity-70 ${
                        pathname === '/' ? 'border-l-2 pl-4' : ''
                      }`}
                      style={{
                        color: '#000000',
                        opacity: pathname === '/' ? 1 : 1,
                        visibility: 'visible',
                        fontWeight: pathname === '/' ? 500 : 300
                      }}
                    >
                      Work
                    </Link>
                    <span
                      className="relative inline-block cursor-not-allowed text-base font-light tracking-wide"
                      style={{
                        color: 'rgba(0, 0, 0, 0.7)',
                        visibility: 'visible',
                        opacity: 1
                      }}
                      aria-label="Coming Soon"
                      onMouseEnter={() => onTooltipChange?.(true)}
                      onMouseLeave={() => onTooltipChange?.(false)}
                    >
                      Publications
                      {showTooltip && (
                        <span className="absolute top-full left-0 mt-2 px-3 py-1.5 text-[10px] font-light tracking-wider uppercase bg-neutral-900 text-white rounded-sm whitespace-nowrap z-[9999] shadow-xl animate-in fade-in-0 zoom-in-95 duration-200">
                          Coming Soon
                          <span className="absolute bottom-full left-4 mb-[-4px] border-4 border-transparent border-b-neutral-900"></span>
                        </span>
                      )}
                    </span>
                    <Link
                      href="/contact"
                      onClick={() => setIsOpen(false)}
                      className={`text-base font-light tracking-wide transition-opacity hover:opacity-70 ${
                        pathname === '/contact' ? 'border-l-2 pl-4' : ''
                      }`}
                      style={{
                        color: '#000000',
                        opacity: pathname === '/contact' ? 1 : 1,
                        visibility: 'visible',
                        fontWeight: pathname === '/contact' ? 500 : 300
                      }}
                    >
                      Contact
                    </Link>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
