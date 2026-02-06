'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <div className="relative h-screen w-full">
      {/* Hero image — from AT folder, no quality reduction */}
      <Image
        src="/images/AT/ARC_7_hero.png"
        alt="STUDIO PAEA — Architecture"
        fill
        priority
        unoptimized
        className="object-cover"
        sizes="100vw"
      />

      {/* Smoke overlay — improves white text visibility over busy background */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-b from-black/45 via-black/60 to-black/70"
        aria-hidden
      />

      {/* Plain nav — text only */}
      <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 md:px-12 py-5 text-white overflow-visible">
        <nav
          className="flex items-center gap-3 md:gap-5 text-xs md:text-sm font-light tracking-[0.25em] uppercase"
          aria-label="Categories"
        >
          <Link href="/work/architecture" className="hover:opacity-80 transition-opacity">
            architecture
          </Link>
          <span className="opacity-50" aria-hidden>—</span>
          <Link href="/work/interiors" className="hover:opacity-80 transition-opacity">
            interiors
          </Link>
          <span className="opacity-50" aria-hidden>—</span>
          <Link href="/work/landscape" className="hover:opacity-80 transition-opacity">
            landscape
          </Link>
        </nav>

        <nav className="flex items-center gap-6 md:gap-8 text-xs md:text-sm font-light tracking-[0.2em] uppercase overflow-visible">
          <Link href="/" className="border-b border-white pb-0.5 hover:opacity-80 transition-opacity">
            work
          </Link>
          <span 
            className="relative inline-block cursor-not-allowed opacity-50 hover:opacity-80 transition-opacity"
            aria-label="Coming Soon"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            publications
            {showTooltip && (
              <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 text-[10px] font-light tracking-wider uppercase bg-neutral-900 text-white rounded-sm whitespace-nowrap z-[9999] shadow-xl animate-in fade-in-0 zoom-in-95 duration-200">
                Coming Soon
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-[-4px] border-4 border-transparent border-b-neutral-900"></span>
              </span>
            )}
          </span>
          <Link href="/contact" className="hover:opacity-80 transition-opacity">
            contact
          </Link>
        </nav>
      </header>

      {/* Logo centered */}
      <Link
        href="/"
        className="logo-animate absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-white text-4xl md:text-5xl font-light tracking-[0.4em] uppercase hover:opacity-90"
        style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)' }}
      >
        STUDIO PAEA
      </Link>
    </div>
  );
}
