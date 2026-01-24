import { useCallback, useEffect, useRef, useState } from "react";

interface UseImageUploadReturn {
  mediaFile: File | null;
  mediaPreviewUrl: string | null;
  setMedia: (file: File | null) => void;
  openFilePicker: () => void;
  error: string | null;
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
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

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
      setError(null);

      if (file) {
        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
          setError(
            "Unsupported file type. Please use JPEG, PNG, GIF, or WebP.",
          );
          return;
        }
        if (file.size > MAX_FILE_SIZE) {
          setError("File too large. Maximum size is 5MB.");
          return;
        }
      }

      if (mediaPreviewUrl) {
        URL.revokeObjectURL(mediaPreviewUrl);
      }

      if (file) {
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
    if (!inputRef.current) {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ACCEPTED_IMAGE_TYPES.join(",");
      inputRef.current = input;
    }

    inputRef.current.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setMedia(file);
      }
      (e.target as HTMLInputElement).value = "";
    };

    inputRef.current.click();
  }, [setMedia]);

  return { mediaFile, mediaPreviewUrl, setMedia, openFilePicker, error };
}
