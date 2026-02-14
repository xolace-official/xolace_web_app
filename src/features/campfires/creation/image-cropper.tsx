"use client";

import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  aspect?: number;
  output?: { width: number; height: number };
  zoomLabel?: string;
  onCancel?: () => void;
  onCropped?: (blob: Blob) => void;
  className?: string;
};

/**
 * Interactive image cropper UI that lets users position and zoom an image, then export the cropped region as a PNG Blob.
 *
 * @param src - Source URL or data URI of the image to crop
 * @param aspect - Desired crop aspect ratio (defaults to `1`)
 * @param output - Target output dimensions for the exported image; shape `{ width, height }` (defaults to `{ width: 512, height: 512 }`)
 * @param zoomLabel - Label text displayed next to the zoom control (defaults to `"Zoom"`)
 * @param onCancel - Callback invoked when the Cancel button is pressed
 * @param onCropped - Callback invoked with the resulting PNG `Blob` when the user saves the crop
 * @param className - Optional additional CSS class names applied to the root card element
 * @returns The ImageCropper React element
 */
export default function ImageCropper({
  src,
  aspect = 1,
  output = { width: 512, height: 512 },
  zoomLabel = "Zoom",
  onCancel = () => {},
  onCropped = () => {},
  className,
}: Props) {
  const [crop, setCrop] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [loading, setLoading] = useState(false);

  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPx: Area) => {
      setCroppedAreaPixels(croppedAreaPx);
    },
    [],
  );

  async function createCroppedImage() {
    setLoading(true);
    try {
      if (
        !croppedAreaPixels ||
        croppedAreaPixels.width === 0 ||
        croppedAreaPixels.height === 0
      ) {
        toast.error("No crop area selected. Please adjust the crop.");
        setLoading(false);
        return;
      }
      const blob = await getCroppedBlob(
        src,
        croppedAreaPixels,
        output.width,
        output.height,
      );
      onCropped(blob);
    } catch (err) {
      console.error(err);
      toast.error("Failed to crop image.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="relative aspect-video w-full bg-muted">
        <Cropper
          image={src}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
          restrictPosition={false}
          showGrid
        />
      </div>
      <div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span className="w-16 shrink-0 text-xs text-muted-foreground">
            {zoomLabel}
          </span>
          <Slider
            value={[zoom]}
            onValueChange={(v) => setZoom(v[0] || 1)}
            min={1}
            max={4}
            step={0.01}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={createCroppedImage} disabled={loading}>
            {loading ? "Saving..." : "Save crop"}
          </Button>
        </div>
      </div>
    </Card>
  );
}

/**
 * Creates a PNG Blob containing the specified cropped region of an image scaled to the target size.
 *
 * @param src - Source image URL or data URI.
 * @param crop - Crop rectangle in source-image pixel coordinates (`x`, `y`, `width`, `height`).
 * @param targetW - Output image width in pixels.
 * @param targetH - Output image height in pixels.
 * @returns A PNG `Blob` of the cropped region resized to `targetW` × `targetH`.
 * @throws If a 2D canvas rendering context cannot be obtained or if canvas-to-Blob conversion fails.
 */
async function getCroppedBlob(
  src: string,
  crop: { width: number; height: number; x: number; y: number },
  targetW: number,
  targetH: number,
): Promise<Blob> {
  const image = await loadImage(src);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No 2d context");

  canvas.width = targetW;
  canvas.height = targetH;

  // drawImage parameters: image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight
  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    targetW,
    targetH,
  );

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Canvas toBlob failed"));
    }, "image/png");
  });
}

/**
 * Load an image from a URL or data URI and produce the corresponding HTMLImageElement when it finishes loading.
 *
 * The returned promise rejects if the image fails to load.
 *
 * @param src - The image source (URL or data URI)
 * @returns The loaded `HTMLImageElement`
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // avoid CORS issues when rendering to canvas
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", (e) => reject(e));
    img.src = src;
  });
}
