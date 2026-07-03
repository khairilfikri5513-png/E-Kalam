import React from 'react';

interface MediaAvatarProps {
  src: string;
  alt: string;
  className?: string;
}

export function MediaAvatar({ src, alt, className }: MediaAvatarProps) {
  const isVideo = src && src.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i);

  if (isVideo) {
    return (
      <video
        src={src}
        controls
        playsInline
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
