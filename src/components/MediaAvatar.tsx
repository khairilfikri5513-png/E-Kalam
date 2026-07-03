import React, { useRef, useEffect } from 'react';

interface MediaAvatarProps {
  src: string;
  alt: string;
  className?: string;
}

export function MediaAvatar({ src, alt, className }: MediaAvatarProps) {
  const isVideo = src && src.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!isVideo || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          video.play().catch(() => {
            console.log("Autoplay disekat oleh browser. Pengguna perlu tekan play.");
          });
        } else {
          video.pause();
        }
      },
      {
        threshold: [0, 0.6, 1],
      }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, [isVideo]);

  if (isVideo) {
    return (
      <video
        ref={videoRef}
        src={src}
        controls
        playsInline
        muted
        preload="metadata"
        className={className}
      >
        Browser anda tidak menyokong tag video.
      </video>
    );
  }

  return (
    <img
      loading="lazy"
      src={src}
      alt={alt}
      className={className}
    />
  );
}
