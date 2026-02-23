'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuIconClass = 'w-5 h-5 flex-shrink-0';

const WorkIcon = () => (
  <svg className={menuIconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
  </svg>
);
const PublicationsIcon = () => (
  <svg className={menuIconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);
const ContactIcon = () => (
  <svg className={menuIconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

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
      {/* Mobile Menu Button — icon + text */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(prev => !prev);
        }}
        type="button"
        className={`lg:hidden relative flex items-center gap-2 py-1.5 px-1 focus:outline-none transition-all duration-300 group cursor-pointer touch-manipulation text-xs font-light tracking-[0.2em] ${
          isHomePage ? 'text-white' : 'text-neutral-900'
        }`}
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
          cursor: 'pointer'
        } as React.CSSProperties}
      >
        {/* Animated Hamburger Icon */}
        <div className="relative w-5 h-4 sm:w-6 sm:h-5 flex flex-col justify-between pointer-events-none flex-shrink-0">
          <span
            className={`block h-0.5 w-full transition-all duration-300 origin-center ${
              isOpen ? 'rotate-45 translate-y-2' : ''
            }`}
            style={{ backgroundColor: 'currentColor' }}
          />
          <span
            className={`block h-0.5 w-full transition-all duration-300 ${
              isOpen ? 'opacity-0' : 'opacity-100'
            }`}
            style={{ backgroundColor: 'currentColor' }}
          />
          <span
            className={`block h-0.5 w-full transition-all duration-300 origin-center ${
              isOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
            style={{ backgroundColor: 'currentColor' }}
          />
        </div>
        <span>Menu</span>
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
                      className={`inline-flex items-center gap-3 text-base font-light tracking-wide transition-opacity hover:opacity-70 ${
                        pathname === '/' ? 'border-l-2 pl-4' : 'pl-4'
                      }`}
                      style={{
                        color: '#000000',
                        opacity: pathname === '/' ? 1 : 1,
                        visibility: 'visible',
                        fontWeight: pathname === '/' ? 500 : 300
                      }}
                    >
                      <WorkIcon />
                      <span>Work</span>
                    </Link>
                    <span
                      className="relative inline-flex items-center gap-3 cursor-not-allowed text-base font-light tracking-wide pl-4"
                      style={{
                        color: 'rgba(0, 0, 0, 0.7)',
                        visibility: 'visible',
                        opacity: 1
                      }}
                      aria-label="Coming Soon"
                      onMouseEnter={() => onTooltipChange?.(true)}
                      onMouseLeave={() => onTooltipChange?.(false)}
                    >
                      <PublicationsIcon />
                      <span>Publications</span>
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
                      className={`inline-flex items-center gap-3 text-base font-light tracking-wide transition-opacity hover:opacity-70 ${
                        pathname === '/contact' ? 'border-l-2 pl-4' : 'pl-4'
                      }`}
                      style={{
                        color: '#000000',
                        opacity: pathname === '/contact' ? 1 : 1,
                        visibility: 'visible',
                        fontWeight: pathname === '/contact' ? 500 : 300
                      }}
                    >
                      <ContactIcon />
                      <span>Contact</span>
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
