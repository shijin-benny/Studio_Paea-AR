'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import MobileMenu from './MobileMenu';

const iconClass = 'w-4 h-4 sm:w-[18px] sm:h-[18px] flex-shrink-0';

const WorkIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
  </svg>
);
const PublicationsIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);
const ContactIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

interface NavigationProps {
  isHomePage?: boolean; // Kept for backward compatibility but always true now
}

export default function Navigation({ isHomePage = false }: NavigationProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Prefetch category pages so click opens fast
  useEffect(() => {
    router.prefetch('/work/architecture');
    router.prefetch('/work/interiors');
    router.prefetch('/work/landscape');
  }, [router]);

  // Memoize activeCategory calculation
  const activeCategory = useMemo(() => {
    if (pathname === '/work/architecture') return 'architecture';
    if (pathname === '/work/interiors') return 'interiors';
    if (pathname === '/work/landscape') return 'landscape';
    return null;
  }, [pathname]);

  // Fixed navigation bar at top - white text on hero page, black text on other pages
  const headerClasses = `fixed top-0 left-0 right-0 flex items-center justify-between px-4 sm:px-6 md:px-12 py-4 sm:py-5 overflow-visible ${
    isHomePage ? 'text-white' : 'text-neutral-900'
  }`;

  const headerStyle: React.CSSProperties = { 
    zIndex: 1000,
    pointerEvents: 'auto' as const
  };

  return (
    <header className={headerClasses} style={headerStyle}>
      {/* Categories Nav — visible on all devices */}
      <nav
        className={`flex items-center gap-4 sm:gap-5 md:gap-6 lg:gap-8 text-xs sm:text-sm md:text-base lg:text-lg font-bold sm:font-semibold md:font-light tracking-[0.2em] sm:tracking-[0.25em] ${
          isHomePage ? 'text-white' : 'text-neutral-900'
        }`}
        aria-label="Categories"
      >
        <Link
          href="/work/architecture"
          prefetch={true}
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
        <Link
          href="/work/interiors"
          prefetch={true}
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
        <Link
          href="/work/landscape"
          prefetch={true}
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

      {/* Desktop Navigation — hidden on mobile, icon + text */}
      <nav className={`hidden lg:flex items-center gap-6 md:gap-8 text-xs md:text-sm font-light tracking-[0.2em] overflow-visible ${
        isHomePage ? 'text-white' : 'text-neutral-900'
      }`}>
        <Link
          href="/"
          className={`inline-flex items-center gap-2 ${
            pathname === '/'
              ? isHomePage
                ? 'border-b border-white pb-0.5'
                : 'border-b border-neutral-900 pb-0.5'
              : 'hover:opacity-70 transition-opacity'
          }`}
          aria-current={pathname === '/' ? 'page' : undefined}
        >
          <WorkIcon className={iconClass} />
          <span>work</span>
        </Link>
        <span
          className="relative inline-flex items-center gap-2 cursor-not-allowed opacity-50 hover:opacity-70 transition-opacity"
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
          <PublicationsIcon className={iconClass} />
          <span>publications</span>
          {showTooltip && (
            <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 text-[10px] font-light tracking-wider uppercase bg-neutral-900 text-white rounded-sm whitespace-nowrap z-[9999] shadow-xl animate-in fade-in-0 zoom-in-95 duration-200">
              Coming Soon
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-[-4px] border-4 border-transparent border-b-neutral-900"></span>
            </span>
          )}
        </span>
        <Link
          href="/contact"
          className={`inline-flex items-center gap-2 ${
            pathname === '/contact'
              ? isHomePage
                ? 'border-b border-white pb-0.5'
                : 'border-b border-neutral-900 pb-0.5'
              : 'hover:opacity-70 transition-opacity'
          }`}
          aria-current={pathname === '/contact' ? 'page' : undefined}
        >
          <ContactIcon className={iconClass} />
          <span>contact</span>
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
