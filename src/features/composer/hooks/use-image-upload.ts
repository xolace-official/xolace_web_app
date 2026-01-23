import { useCallback, useEffect, useState } from "react";

interface UseImageUploadReturn {
  mediaFile: File | null;
  mediaPreviewUrl: string | null;
  setMedia: (file: File | null) => void;
  openFilePicker: () => void;
}

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function useImageUpload(): UseImageUploadReturn {
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string | null>(null);

  // Cleanup object URL on unmount or when file changes
  useEffect(() => {
    return () => {
      if (mediaPreviewUrl) {
        URL.revokeObjectURL(mediaPreviewUrl);
      }
    };
  }, [mediaPreviewUrl]);

  const setMedia = useCallback(
    (file: File | null) => {
      if (mediaPreviewUrl) {
        URL.revokeObjectURL(mediaPreviewUrl);
      }

      if (file) {
        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
          console.warn("Unsupported file type:", file.type);
          return;
        }
        if (file.size > MAX_FILE_SIZE) {
          console.warn("File too large:", file.size);
          return;
        }
        setMediaFile(file);
        setMediaPreviewUrl(URL.createObjectURL(file));
      } else {
        setMediaFile(null);
        setMediaPreviewUrl(null);
      }
    },
    [mediaPreviewUrl],
  );

  const openFilePicker = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ACCEPTED_IMAGE_TYPES.join(",");
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setMedia(file);
      }
    };
    input.click();
  }, [setMedia]);

  return { mediaFile, mediaPreviewUrl, setMedia, openFilePicker };
}
