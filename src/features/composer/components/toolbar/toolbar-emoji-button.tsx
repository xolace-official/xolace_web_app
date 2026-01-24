"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useComposerForm } from "../../composer-context";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[350px] w-full items-center justify-center">
      <span className="text-sm text-muted-foreground">Loading...</span>
    </div>
  ),
});

interface EmojiData {
  emoji: string;
}

export function ToolbarEmojiButton() {
  const { insertAtCursor } = useComposerForm();
  const [open, setOpen] = useState(false);

  const handleEmojiClick = (emojiData: EmojiData) => {
    insertAtCursor(emojiData.emoji);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="iconSm"
          tooltip="Emoji"
          aria-label="Open emoji picker"
        >
          <Smile className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-full p-0">
        <EmojiPicker
          onEmojiClick={handleEmojiClick}
          width="100%"
          height={350}
          searchDisabled
          lazyLoadEmojis
        />
      </PopoverContent>
    </Popover>
  );
}
