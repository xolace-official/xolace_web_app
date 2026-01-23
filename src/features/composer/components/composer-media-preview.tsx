"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useComposer } from "../composer-context";

export function ComposerMediaPreview() {
  const { mediaPreviewUrl, mediaFile, setMedia } = useComposer();

  if (!mediaPreviewUrl || !mediaFile) return null;

  return (
    <div className="px-4 pb-2">
      <div className="group/media relative inline-block overflow-hidden rounded-xl">
        <Image
          src={mediaPreviewUrl}
          alt="Attached image"
          width={200}
          height={200}
          className="max-h-[200px] w-auto rounded-xl object-cover"
        />
        <button
          type="button"
          onClick={() => setMedia(null)}
          className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity hover:bg-black/80 group-hover/media:opacity-100"
          aria-label="Remove image"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
