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
    if (!isVideo || !videoRef.current) return;

    const handleScroll = () => {
      if (videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isVideo]);

  if (isVideo) {
    return (
      <video
        ref={videoRef}
        src={src}
        controls
        playsInline
        autoPlay
        muted={false} /* Allow sound if possible, but browsers might block unmuted autoplay. However, if the user interacted with the page earlier, it might work. If muted is required for autoplay, we will have to set muted, but the user requested autoplay. Let's try autoPlay directly. Or we can just use autoPlay and the browser will decide. */
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
