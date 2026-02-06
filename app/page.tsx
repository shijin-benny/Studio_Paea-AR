'use client';

import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative h-screen w-full" style={{ position: 'relative', zIndex: 1 }}>
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

      {/* Logo centered — hidden when menu is open (lower z-index than menu overlay) */}
      <Link
        href="/"
        className="logo-animate absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1] text-white text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold sm:font-light tracking-[0.15em] sm:tracking-[0.25em] md:tracking-[0.3em] lg:tracking-[0.4em] uppercase hover:opacity-90 px-4 text-center whitespace-nowrap"
        style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)' }}
        aria-label="STUDIO PAEA - Home"
      >
        STUDIO PAEA
      </Link>
    </div>
  );
}
