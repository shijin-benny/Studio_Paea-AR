'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HERO_VIDEOS } from '@/lib/hero-videos';

const FALLBACK_HERO_IMAGE = '/images/AT/ARC_7_hero.png';

export default function HomePage() {
  const [videoIndex, setVideoIndex] = useState(0);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const hasVideos = HERO_VIDEOS.length > 0;
  const currentVideoSrc = hasVideos ? HERO_VIDEOS[videoIndex] : null;

  const goToNext = () => {
    setVideoReady(false);
    setVideoIndex((i) => (i + 1) % HERO_VIDEOS.length);
  };

  return (
    <div
      className="relative h-screen w-full overflow-hidden bg-neutral-900"
      style={{ position: 'relative', zIndex: 1 }}
    >
      {/* Layer 1: Fallback image — always visible first (priority load, no black screen) */}
      {hasVideos ? (
        <Image
          src={FALLBACK_HERO_IMAGE}
          alt=""
          role="presentation"
          fill
          priority
          unoptimized
          className="absolute inset-0 w-full h-full object-cover"
          sizes="100vw"
        />
      ) : (
        <Image
          src={FALLBACK_HERO_IMAGE}
          alt="STUDIO PAEA — Architecture"
          fill
          priority
          unoptimized
          className="object-cover"
          sizes="100vw"
        />
      )}

      {/* Layer 2: Video — lazy: only current video loads; fades in when ready */}
      {hasVideos && currentVideoSrc && (
        <video
          ref={videoRef}
          key={currentVideoSrc}
          src={currentVideoSrc}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out"
          style={{ opacity: videoReady ? 1 : 0 }}
          autoPlay
          muted
          playsInline
          loop={HERO_VIDEOS.length === 1}
          preload="auto"
          onCanPlay={() => setVideoReady(true)}
          onLoadedData={() => setVideoReady(true)}
          onEnded={HERO_VIDEOS.length > 1 ? goToNext : undefined}
          onError={() => setVideoReady(false)}
        />
      )}

      {/* Smoke overlay */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-b from-black/45 via-black/60 to-black/70"
        aria-hidden
      />

      {/* Logo */}
      <Link
        href="/"
        className="logo-animate absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[2] text-white text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold sm:font-light tracking-[0.15em] sm:tracking-[0.25em] md:tracking-[0.3em] lg:tracking-[0.4em] uppercase hover:opacity-90 px-4 text-center whitespace-nowrap"
        style={{
          textShadow:
            '0 2px 8px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)',
        }}
        aria-label="STUDIO PAEA - Home"
      >
        STUDIO PAEA
      </Link>
    </div>
  );
}
