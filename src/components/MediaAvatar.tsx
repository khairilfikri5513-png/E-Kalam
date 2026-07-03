import React, { useRef, useEffect, useState } from 'react';

interface MediaAvatarProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

const videoRegistry = new Set<HTMLVideoElement>();

export function MediaAvatar({ src, alt, className, priority = false }: MediaAvatarProps) {
  const isVideo = src && src.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!isVideo || !video) return;

    videoRegistry.add(video);

    const handlePlayEvent = () => {
      setAutoplayBlocked(false);
      videoRegistry.forEach((v) => {
        if (v !== video && !v.paused) {
          v.pause();
        }
      });
    };

    video.addEventListener('play', handlePlayEvent);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.65) {
            videoRegistry.forEach((v) => {
              if (v !== video && !v.paused) v.pause();
            });

            video.muted = false;
            video.volume = 1;

            if (video.ended) {
              video.currentTime = 0;
            }

            video.play().catch((error) => {
              console.log("Autoplay dengan audio mungkin disekat oleh browser.", error);
              setAutoplayBlocked(true);
            });
          } else {
            if (!video.paused) {
              video.pause();
            }
          }
        });
      },
      {
        threshold: [0, 0.25, 0.5, 0.65, 0.8, 1],
      }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
      video.removeEventListener('play', handlePlayEvent);
      videoRegistry.delete(video);
    };
  }, [isVideo]);

  if (isVideo) {
    return (
      <div className="relative w-full h-full">
        <video
          ref={videoRef}
          src={src}
          controls
          playsInline
          preload={priority ? "auto" : "metadata"}
          className={className}
        >
          Browser anda tidak menyokong tag video.
        </video>
        {autoplayBlocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl z-20">
            <button 
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.play();
                }
              }}
              className="bg-white/95 hover:bg-white text-slate-800 text-sm font-bold py-2.5 px-5 rounded-xl shadow-lg transition-all transform hover:scale-105"
            >
              Tekan untuk mula video
            </button>
          </div>
        )}
      </div>
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
