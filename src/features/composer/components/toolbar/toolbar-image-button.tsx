"use client";

import { ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useComposerUI } from "../../composer-context";

export function ToolbarImageButton() {
  const { openFilePicker, mediaFile } = useComposerUI();

  return (
    <Button
      type="button"
      variant="ghost"
      size="iconSm"
      onClick={openFilePicker}
      active={!!mediaFile}
      tooltip="Attach image"
      aria-label="Attach image"
    >
      <ImageIcon className="size-4" />
    </Button>
  );
}
