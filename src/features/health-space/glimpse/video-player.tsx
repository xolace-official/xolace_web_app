"use client";

import { cn, createIframeLink } from "@/lib/utils";
import { useRef } from "react";

interface VideoPlayerProps {
  videoId: string;
  className?: string;
}

const VideoPlayer = ({ videoId, className }: VideoPlayerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className={cn("relative w-full aspect-video", className)}>
      {/*<iframe*/}
      {/*  ref={iframeRef}*/}
      {/*  // src={createIframeLink(videoId)}*/}
      {/*  src={"https://videos.pexels.com/video-files/27180348/12091515_2560_1440_50fps.mp4"}*/}
      {/*  loading="lazy"*/}
      {/*  title="Video player"*/}
      {/*  className="absolute top-0 left-0 w-full h-full rounded-lg"*/}
      {/*  style={{ border: 0, zIndex: 50 }}*/}
      {/*  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"*/}
      {/*  allowFullScreen*/}
      {/*/>*/}
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full rounded-lg object-cover"
        controls
        preload="metadata"
      >
        <source
          src="https://videos.pexels.com/video-files/27180348/12091515_2560_1440_50fps.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
