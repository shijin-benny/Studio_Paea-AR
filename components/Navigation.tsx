'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MobileMenu from './MobileMenu';

interface NavigationProps {
  isHomePage?: boolean; // Kept for backward compatibility but always true now
}

export default function Navigation({ isHomePage = false }: NavigationProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const pathname = usePathname();
  
  // Memoize activeCategory calculation
  const activeCategory = useMemo(() => {
    if (pathname === '/work/architecture') return 'architecture';
    if (pathname === '/work/interiors') return 'interiors';
    if (pathname === '/work/landscape') return 'landscape';
    return null;
  }, [pathname]);

  // Hero page: absolute positioning, white text, transparent background
  // Other pages: absolute positioning, black text, transparent background
  const headerClasses = `absolute top-0 left-0 right-0 flex items-center justify-between px-4 sm:px-6 md:px-12 py-4 sm:py-5 overflow-visible ${
    isHomePage ? 'text-white' : 'text-neutral-900'
  }`;

  const headerStyle: React.CSSProperties = { 
    zIndex: 100,
    pointerEvents: 'auto' as const
  };

  return (
    <header className={headerClasses} style={headerStyle}>
      {/* Categories Nav — visible on all devices */}
      <nav
        className={`flex items-center gap-2 sm:gap-3 md:gap-5 text-[10px] sm:text-xs md:text-sm font-light tracking-[0.25em] uppercase ${
          isHomePage ? 'text-white' : 'text-neutral-900'
        }`}
        aria-label="Categories"
      >
        <Link
          href="/work/architecture"
          className={
            activeCategory === 'architecture'
              ? isHomePage
                ? 'border-b border-white pb-0.5'
                : 'border-b border-neutral-900 pb-0.5'
              : 'hover:opacity-70 transition-opacity'
          }
          aria-current={activeCategory === 'architecture' ? 'page' : undefined}
        >
          architecture
        </Link>
        <span className="opacity-50" aria-hidden="true">
          —
        </span>
        <Link
          href="/work/interiors"
          className={
            activeCategory === 'interiors'
              ? isHomePage
                ? 'border-b border-white pb-0.5'
                : 'border-b border-neutral-900 pb-0.5'
              : 'hover:opacity-70 transition-opacity'
          }
          aria-current={activeCategory === 'interiors' ? 'page' : undefined}
        >
          interiors
        </Link>
        <span className="opacity-50" aria-hidden="true">
          —
        </span>
        <Link
          href="/work/landscape"
          className={
            activeCategory === 'landscape'
              ? isHomePage
                ? 'border-b border-white pb-0.5'
                : 'border-b border-neutral-900 pb-0.5'
              : 'hover:opacity-70 transition-opacity'
          }
          aria-current={activeCategory === 'landscape' ? 'page' : undefined}
        >
          landscape
        </Link>
      </nav>

      {/* Desktop Navigation — hidden on mobile */}
      <nav className={`hidden lg:flex items-center gap-6 md:gap-8 text-xs md:text-sm font-light tracking-[0.2em] uppercase overflow-visible ${
        isHomePage ? 'text-white' : 'text-neutral-900'
      }`}>
        <Link
          href="/"
          className={
            pathname === '/'
              ? isHomePage
                ? 'border-b border-white pb-0.5'
                : 'border-b border-neutral-900 pb-0.5'
              : 'hover:opacity-70 transition-opacity'
          }
          aria-current={pathname === '/' ? 'page' : undefined}
        >
          work
        </Link>
        <span
          className="relative inline-block cursor-not-allowed opacity-50 hover:opacity-70 transition-opacity"
          aria-label="Coming Soon"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setShowTooltip(!showTooltip);
            }
          }}
        >
          publications
          {showTooltip && (
            <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 text-[10px] font-light tracking-wider uppercase bg-neutral-900 text-white rounded-sm whitespace-nowrap z-[9999] shadow-xl animate-in fade-in-0 zoom-in-95 duration-200">
              Coming Soon
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-[-4px] border-4 border-transparent border-b-neutral-900"></span>
            </span>
          )}
        </span>
        <Link
          href="/contact"
          className={
            pathname === '/contact'
              ? isHomePage
                ? 'border-b border-white pb-0.5'
                : 'border-b border-neutral-900 pb-0.5'
              : 'hover:opacity-70 transition-opacity'
          }
          aria-current={pathname === '/contact' ? 'page' : undefined}
        >
          contact
        </Link>
      </nav>

      {/* Mobile Menu Button - positioned on the right */}
      <div className="lg:hidden ml-auto relative" style={{ zIndex: 99999 }}>
        <MobileMenu
          activeCategory={activeCategory}
          showTooltip={showTooltip}
          onTooltipChange={setShowTooltip}
          isHomePage={isHomePage}
        />
      </div>
    </header>
  );
}
