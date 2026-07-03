import React, { useState, useRef, useEffect } from 'react';
import { VolumeX } from 'lucide-react';

interface VideoWithAudioCheckProps { [key: string]: any }

export function VideoWithAudioCheck(props: VideoWithAudioCheckProps) {
  const [hasNoAudio, setHasNoAudio] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const checkAudio = () => {
      // Chrome/Firefox modern
      // Unfortunately there is no standard 100% way before playing except on some browsers
      // So we use a best-effort approach or just rely on user playing it
      
      let audioExists = true;
      const v = video as any;
      if (v.audioTracks !== undefined) {
        audioExists = v.audioTracks.length > 0;
      } else if (v.mozHasAudio !== undefined) {
        audioExists = v.mozHasAudio;
      }
      
      if (!audioExists) {
        setHasNoAudio(true);
      }
    };

    video.addEventListener('loadedmetadata', checkAudio);
    video.addEventListener('play', () => {
        const v = video as any;
        if (v.webkitAudioDecodedByteCount === 0 && v.videoTracks?.length > 0) {
            // sometimes it takes a bit to decode, but this is a heuristic
        }
    });

    return () => {
      video.removeEventListener('loadedmetadata', checkAudio);
    };
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col">
      <video ref={videoRef} {...props} />
      {hasNoAudio && (
        <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded-md flex items-center gap-1 backdrop-blur-sm">
          <VolumeX className="w-3 h-3" />
          Video ini tidak mempunyai audio
        </div>
      )}
    </div>
  );
}
