'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HERO_VIDEOS } from '@/lib/hero-videos';

const FALLBACK_HERO_IMAGE = '/images/AT/ARC_7_hero.png';

export default function HomePage() {
  const [videoIndex, setVideoIndex] = useState(0);
  const [videoReady, setVideoReady] = useState(false);
  const [videoInView, setVideoInView] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const nextVideoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

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
      {/* No hero image when videos exist — go straight to video for faster playback */}

      {/* Fallback image only when there are no videos */}
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

      {/* Current video — visible as soon as it can play */}
      {hasVideos && currentVideoSrc && videoInView && (
        <video
          ref={videoRef}
          key={currentVideoSrc}
          src={encodeURI(currentVideoSrc)}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-out"
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
