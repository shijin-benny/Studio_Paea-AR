'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HERO_VIDEOS } from '@/lib/hero-videos';

const FALLBACK_HERO_IMAGE = '/images/AT/ARC_7_hero.png';

const LOGO_DURATION_MS = 5000; // show "The paper earth" then hide, then "studio paea" appears

export default function HomePage() {
  const [videoIndex, setVideoIndex] = useState(0);
  const [videoReady, setVideoReady] = useState(false);
  const [videoInView, setVideoInView] = useState(false);
  const [showLogo, setShowLogo] = useState(true);       // first: The paper earth
  const [showStudioPaea, setShowStudioPaea] = useState(false); // then: studio paea (same design, no bold)
  const videoRef = useRef<HTMLVideoElement>(null);
  const nextVideoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // First "The paper earth" logo; after delay hide it and show "studio paea" (same design, no bold)
  useEffect(() => {
    const t = setTimeout(() => {
      setShowLogo(false);
      setShowStudioPaea(true);
    }, LOGO_DURATION_MS);
    return () => clearTimeout(t);
  }, []);

  const hasVideos = HERO_VIDEOS.length > 0;
  const currentVideoSrc = hasVideos ? HERO_VIDEOS[videoIndex] : null;
  const nextVideoSrc = hasVideos && HERO_VIDEOS.length > 1
    ? HERO_VIDEOS[(videoIndex + 1) % HERO_VIDEOS.length]
    : null;

  // Start loading video as soon as component mounts (hero in view on home)
  useEffect(() => {
    if (hasVideos && heroRef.current) {
      const el = heroRef.current;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) setVideoInView(true);
        },
        { rootMargin: '50px', threshold: 0.1 }
      );
      obs.observe(el);
      return () => obs.disconnect();
    }
  }, [hasVideos]);

  const goToNext = () => {
    setVideoReady(false);
    setVideoIndex((i) => (i + 1) % HERO_VIDEOS.length);
  };

  return (
    <div
      ref={heroRef}
      className="relative h-screen w-full overflow-hidden bg-neutral-900"
      style={{ position: 'relative', zIndex: 1 }}
    >
      {/* When videos exist: dim fallback so no harsh black screen; title shows immediately. Video fades in when ready (does not affect title timing). */}
      {hasVideos && (
        <Image
          src={FALLBACK_HERO_IMAGE}
          alt=""
          role="presentation"
          fill
          priority
          unoptimized
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
          style={{ opacity: videoReady ? 0 : 0.2 }}
          sizes="100vw"
          aria-hidden
        />
      )}

      {/* No videos: full fallback image */}
      {!hasVideos && (
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

      {/* Current video — fades in when ready; title change is independent of video */}
      {hasVideos && currentVideoSrc && videoInView && (
        <video
          ref={videoRef}
          key={currentVideoSrc}
          src={encodeURI(currentVideoSrc)}
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

      {/* Hidden preload of next video so transition is instant */}
      {hasVideos && HERO_VIDEOS.length > 1 && nextVideoSrc && videoInView && (
        <video
          ref={nextVideoRef}
          src={encodeURI(nextVideoSrc)}
          preload="auto"
          muted
          playsInline
          className="absolute opacity-0 pointer-events-none w-0 h-0"
          aria-hidden
        />
      )}

      {/* Smoke overlay */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-b from-black/45 via-black/60 to-black/70"
        aria-hidden
      />

      {/* Hero: first "The paper earth" (tighter inline spacing), then "studio paea" (wide spacing); fully responsive */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[2] w-[90vw] max-w-4xl px-3 sm:px-4 md:px-6 text-center"
        style={{
          textShadow: '0 2px 8px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)',
        }}
      >
        <Link
          href="/"
          className="inline-block text-left text-white font-normal leading-tight hover:opacity-90 transition-opacity text-2xl sm:text-4xl md:text-5xl lg:text-6xl"
          aria-label="The paper earth studio paea - Home"
        >
          {/* Phase 1: The paper earth — reduced letter spacing, maximum inline */}
          {showLogo && (
            <span className="hero-title-first inline-block tracking-tight sm:tracking-tight" style={{ letterSpacing: '-0.02em' }}>
              <span className="text-[1.15em]">T</span>he paper{' '}
              <span className="relative inline-block border-b-2 border-solid" style={{ borderColor: 'var(--hero-accent, #6b7c5c)', borderBottomWidth: '3px' }}>ea</span>rth
            </span>
          )}
          {/* Phase 2: studio paea — wide letter spacing */}
          {showStudioPaea && (
            <span className="hero-title-inline inline-block tracking-[0.35em] sm:tracking-[0.4em] md:tracking-[0.45em] lg:tracking-[0.5em]">
              studio paea
            </span>
          )}
        </Link>
      </div>
    </div>
  );
}
