"use client";

import { cn, createIframeLink } from "@/lib/utils";
import { useRef } from "react";

interface VideoPlayerProps {
  videoId: string;
  className?: string;
}

const VideoPlayer = ({ videoId, className }: VideoPlayerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  return (
    <div className={cn("relative w-full aspect-video", className)}>
      <iframe
        ref={iframeRef}
        src={createIframeLink(videoId)}
        loading="lazy"
        title="Video player"
        className="absolute top-0 left-0 w-full h-full rounded-lg"
        style={{ border: 0, zIndex: 50 }}
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default VideoPlayer;
